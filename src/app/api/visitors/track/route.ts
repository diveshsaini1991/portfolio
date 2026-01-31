import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { 
  VisitorSession, 
  getOrCreateStats, 
  cleanupStaleSessions,
  getActiveVisitorCount 
} from '@/models/Visitor';

export const dynamic = 'force-dynamic';

// POST - Track a new visit or update session
export async function POST(request: NextRequest) {
  // Check if MongoDB URI is configured
  const mongoUri = process.env.MONGODB_URI;
  console.log('[Visitor Track] MONGODB_URI configured:', !!mongoUri);
  
  if (!mongoUri) {
    console.log('[Visitor Track] No MONGODB_URI - returning placeholder');
    return NextResponse.json({
      success: true,
      isNewSession: true,
      stats: {
        liveViewers: 1,
        totalVisits: 0,
        uniqueVisitors: 0,
      },
      note: 'MongoDB not configured'
    });
  }

  try {
    console.log('[Visitor Track] Connecting to MongoDB...');
    await dbConnect();
    console.log('[Visitor Track] Connected successfully');
    
    let body;
    try {
      body = await request.json();
      console.log('[Visitor Track] Request body:', JSON.stringify(body));
    } catch (parseError) {
      console.error('[Visitor Track] Failed to parse request body:', parseError);
      body = {};
    }
    
    const { sessionId, page } = body;
    
    // Validate sessionId
    if (!sessionId) {
      console.error('[Visitor Track] Missing sessionId in request');
      // Generate a fallback session ID based on IP
      const forwardedFor = request.headers.get('x-forwarded-for');
      const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
      const fallbackSessionId = `fallback_${ip}_${Date.now()}`;
      console.log('[Visitor Track] Using fallback sessionId:', fallbackSessionId);
      body.sessionId = fallbackSessionId;
    }
    
    const finalSessionId = body.sessionId || sessionId;
    
    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    console.log('[Visitor Track] Session ID:', finalSessionId, 'Page:', page);

    // Check if session exists
    const existingSession = await VisitorSession.findOne({ sessionId: finalSessionId });
    console.log('[Visitor Track] Existing session:', existingSession ? 'found' : 'not found');
    
    if (existingSession) {
      // Update existing session
      existingSession.lastActivity = new Date();
      existingSession.isActive = true;
      if (page) existingSession.page = page;
      await existingSession.save();
      
      // Get current stats
      await cleanupStaleSessions();
      const liveViewers = await getActiveVisitorCount();
      const stats = await getOrCreateStats();
      
      return NextResponse.json({
        success: true,
        isNewSession: false,
        stats: {
          // Always show at least 1 (the current user)
          liveViewers: Math.max(1, liveViewers),
          totalVisits: stats.totalVisits,
          uniqueVisitors: stats.uniqueVisitors,
        }
      });
    }

    // Check if this IP has visited before
    const existingVisitorByIP = await VisitorSession.findOne({ ip });
    const isNewVisitor = !existingVisitorByIP;

    // Create new session
    console.log('[Visitor Track] Creating new session for IP:', ip);
    const newSession = await VisitorSession.create({
      sessionId: finalSessionId,
      ip,
      userAgent,
      page: page || '/',
      isActive: true,
      lastActivity: new Date(),
    });
    console.log('[Visitor Track] New session created:', newSession._id);

    // Update global stats
    const stats = await getOrCreateStats();
    console.log('[Visitor Track] Current stats before update:', { totalVisits: stats.totalVisits, uniqueVisitors: stats.uniqueVisitors });
    stats.totalVisits += 1;
    if (isNewVisitor) {
      stats.uniqueVisitors += 1;
    }
    stats.lastUpdated = new Date();
    await stats.save();

    // Clean up stale sessions
    await cleanupStaleSessions();
    const liveViewers = await getActiveVisitorCount();

    return NextResponse.json({
      success: true,
      isNewSession: true,
      isNewVisitor,
      stats: {
        // Always show at least 1 (the current user)
        liveViewers: Math.max(1, liveViewers),
        totalVisits: stats.totalVisits,
        uniqueVisitors: stats.uniqueVisitors,
      }
    });
  } catch (error) {
    console.error('[Visitor Track] ERROR:', error);
    console.error('[Visitor Track] Error details:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({
      success: false,
      stats: {
        liveViewers: 1,
        totalVisits: 0,
        uniqueVisitors: 0,
      },
      error: error instanceof Error ? error.message : 'Database connection failed'
    });
  }
}

// DELETE - Mark session as inactive (on page unload)
export async function DELETE(request: NextRequest) {
  // Check if MongoDB URI is configured
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ success: true });
  }

  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (sessionId) {
      await VisitorSession.updateOne(
        { sessionId },
        { $set: { isActive: false } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deactivating session:', error);
    return NextResponse.json({ success: true }); // Don't fail on cleanup
  }
}

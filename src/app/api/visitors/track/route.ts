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
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({
      success: true,
      isNewSession: true,
      stats: { liveViewers: 1, totalVisits: 0, uniqueVisitors: 0 },
      note: 'MongoDB not configured'
    });
  }

  try {
    // Check if this is a deactivation request (from sendBeacon - check URL params first)
    const { searchParams } = new URL(request.url);
    const sessionIdFromParams = searchParams.get('sessionId');
    
    // For sendBeacon deactivation requests, handle via URL params only (body may be unreadable)
    if (sessionIdFromParams) {
      await dbConnect();
      await VisitorSession.updateOne(
        { sessionId: sessionIdFromParams },
        { $set: { isActive: false } }
      );
      return NextResponse.json({ success: true });
    }
    
    await dbConnect();
    
    let body;
    try {
      body = await request.json();
    } catch {
      // Body parsing failed (likely ECONNRESET from sendBeacon) - return success silently
      return NextResponse.json({ success: true });
    }
    
    const { sessionId, page, action } = body;
    
    // Handle deactivation request from sendBeacon body
    if (action === 'deactivate') {
      return NextResponse.json({ success: true });
    }
    
    // Validate sessionId - require it
    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Missing sessionId',
        stats: { liveViewers: 1, totalVisits: 0, uniqueVisitors: 0 }
      });
    }
    
    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    // Check if session exists
    const existingSession = await VisitorSession.findOne({ sessionId });
    
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
          liveViewers: Math.max(1, liveViewers),
          totalVisits: stats.totalVisits,
          uniqueVisitors: stats.uniqueVisitors,
        }
      });
    }

    // Check if this IP has visited before
    const existingVisitorByIP = await VisitorSession.findOne({ ip });
    const isNewVisitor = !existingVisitorByIP;

    // Create or update session (upsert to avoid duplicate key errors)
    await VisitorSession.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          ip,
          userAgent,
          page: page || '/',
          isActive: true,
          lastActivity: new Date(),
        },
        $setOnInsert: {
          sessionId,
          createdAt: new Date(),
        }
      },
      { upsert: true, new: true }
    );

    // Update global stats
    const stats = await getOrCreateStats();
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
        liveViewers: Math.max(1, liveViewers),
        totalVisits: stats.totalVisits,
        uniqueVisitors: stats.uniqueVisitors,
      }
    });
  } catch (error) {
    console.error('[Visitor Track] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({
      success: false,
      stats: { liveViewers: 1, totalVisits: 0, uniqueVisitors: 0 },
      error: 'Database error'
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

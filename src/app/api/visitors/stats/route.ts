import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getOrCreateStats, getActiveVisitorCount } from '@/models/Visitor';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Check if MongoDB URI is configured
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({
      liveViewers: 1,
      totalVisits: 0,
      uniqueVisitors: 0,
      lastUpdated: new Date().toISOString(),
      note: 'MongoDB not configured - showing placeholder data'
    });
  }

  try {
    await dbConnect();
    
    const stats = await getOrCreateStats();
    const liveViewers = await getActiveVisitorCount();

    return NextResponse.json({
      // Always show at least 1 (the current user viewing the page)
      liveViewers: Math.max(1, liveViewers),
      totalVisits: stats.totalVisits,
      uniqueVisitors: stats.uniqueVisitors,
      lastUpdated: stats.lastUpdated,
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json({
      liveViewers: 1,
      totalVisits: 0,
      uniqueVisitors: 0,
      error: 'Database connection failed'
    });
  }
}

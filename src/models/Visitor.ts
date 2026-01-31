import mongoose, { Schema, Document } from 'mongoose';

// Interface for visitor stats document
export interface IVisitorStats extends Document {
  totalVisits: number;
  uniqueVisitors: number;
  lastUpdated: Date;
}

// Interface for individual visitor session
export interface IVisitorSession extends Document {
  sessionId: string;
  ip: string;
  userAgent: string;
  page: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

// Schema for overall stats (single document)
const VisitorStatsSchema = new Schema<IVisitorStats>({
  totalVisits: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

// Schema for individual visitor sessions
const VisitorSessionSchema = new Schema<IVisitorSession>({
  sessionId: { type: String, required: true, unique: true },
  ip: { type: String, required: true },
  userAgent: { type: String, default: '' },
  page: { type: String, default: '/' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
});

// Index for faster queries
VisitorSessionSchema.index({ isActive: 1 });
VisitorSessionSchema.index({ ip: 1 });
VisitorSessionSchema.index({ lastActivity: 1 });

// Create or get existing models
export const VisitorStats = mongoose.models.VisitorStats || 
  mongoose.model<IVisitorStats>('VisitorStats', VisitorStatsSchema);

export const VisitorSession = mongoose.models.VisitorSession || 
  mongoose.model<IVisitorSession>('VisitorSession', VisitorSessionSchema);

// Helper function to get or create stats document
export async function getOrCreateStats(): Promise<IVisitorStats> {
  let stats = await VisitorStats.findOne();
  if (!stats) {
    stats = await VisitorStats.create({
      totalVisits: 0,
      uniqueVisitors: 0,
    });
  }
  return stats;
}

// Helper to clean up stale sessions (inactive for more than 1 minute)
export async function cleanupStaleSessions(): Promise<number> {
  // Sessions are considered stale if no heartbeat for 1 minute
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const result = await VisitorSession.updateMany(
    { lastActivity: { $lt: oneMinuteAgo }, isActive: true },
    { $set: { isActive: false } }
  );
  return result.modifiedCount;
}

// Get current active visitor count
export async function getActiveVisitorCount(): Promise<number> {
  await cleanupStaleSessions();
  return VisitorSession.countDocuments({ isActive: true });
}


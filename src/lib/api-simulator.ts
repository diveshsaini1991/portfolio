import { ApiResponse } from '@/types';

/**
 * Simulates API response with realistic delays and metadata
 */
export async function simulateApiCall<T>(
  data: T,
  delay: number = 300 + Math.random() * 200
): Promise<ApiResponse<T>> {
  const startTime = Date.now();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const responseTime = Date.now() - startTime;
  
  return {
    status: 200,
    statusText: 'OK',
    data,
    timestamp: Date.now(),
    responseTime,
    headers: {
      'Content-Type': 'application/json',
      'X-Response-Time': `${responseTime}ms`,
      'X-Powered-By': 'Divesh Portfolio API v1.0',
      'Cache-Control': 'public, max-age=300',
      'ETag': `"${Math.random().toString(36).substring(7)}"`,
    }
  };
}

/**
 * Formats response time with color coding
 */
export function getResponseTimeColor(ms: number): string {
  if (ms < 100) return 'text-green-400';
  if (ms < 300) return 'text-yellow-400';
  if (ms < 500) return 'text-orange-400';
  return 'text-red-400';
}

/**
 * Generates a realistic SQL query based on filters
 */
export function generateSQLQuery(
  table: string,
  filters?: Record<string, any>,
  orderBy?: { field: string; direction: 'ASC' | 'DESC' }
): string {
  let query = `SELECT * FROM ${table}`;
  
  if (filters && Object.keys(filters).length > 0) {
    const conditions = Object.entries(filters)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key} = '${value}'`;
        }
        return `${key} = ${value}`;
      })
      .join(' AND ');
    query += `\nWHERE ${conditions}`;
  }
  
  if (orderBy) {
    query += `\nORDER BY ${orderBy.field} ${orderBy.direction}`;
  }
  
  query += ';';
  return query;
}

/**
 * Formats JSON with syntax highlighting classes
 */
export function formatJSON(obj: any): string {
  return JSON.stringify(obj, null, 2);
}


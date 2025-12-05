// Mock data for cache demo
// Simulates different API endpoints with varying response times

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
}

export interface AnalyticsData {
  metric: string;
  value: number;
  change: number;
  timestamp: number;
}

// Sample Products
export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Mouse',
    price: 29.99,
    category: 'Electronics',
    stock: 156,
    description: 'Ergonomic wireless mouse with 6 buttons'
  },
  {
    id: 'prod-2',
    name: 'Mechanical Keyboard',
    price: 89.99,
    category: 'Electronics',
    stock: 43,
    description: 'RGB mechanical keyboard with Cherry MX switches'
  },
  {
    id: 'prod-3',
    name: 'USB-C Hub',
    price: 45.50,
    category: 'Accessories',
    stock: 87,
    description: '7-in-1 USB-C hub with HDMI and SD card reader'
  },
  {
    id: 'prod-4',
    name: 'Laptop Stand',
    price: 34.99,
    category: 'Accessories',
    stock: 234,
    description: 'Adjustable aluminum laptop stand'
  },
  {
    id: 'prod-5',
    name: 'Noise Cancelling Headphones',
    price: 199.99,
    category: 'Audio',
    stock: 67,
    description: 'Premium noise cancelling over-ear headphones'
  }
];

// Sample Users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    lastActive: '2 minutes ago'
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    lastActive: '15 minutes ago'
  },
  {
    id: 'user-3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'Moderator',
    lastActive: '1 hour ago'
  }
];

// Sample Analytics
export const analytics: AnalyticsData[] = [
  {
    metric: 'Page Views',
    value: 12453,
    change: 12.5,
    timestamp: Date.now()
  },
  {
    metric: 'Active Users',
    value: 847,
    change: -3.2,
    timestamp: Date.now()
  },
  {
    metric: 'Conversion Rate',
    value: 3.8,
    change: 8.7,
    timestamp: Date.now()
  },
  {
    metric: 'Revenue',
    value: 45230,
    change: 15.3,
    timestamp: Date.now()
  }
];

// Simulate API delay
export const simulateDelay = (min: number = 200, max: number = 500): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Get data by endpoint
export const getDataByEndpoint = (endpoint: string): any => {
  switch (endpoint) {
    case '/api/v1/products':
      return { count: products.length, data: products };
    case '/api/v1/users':
      return { count: users.length, data: users };
    case '/api/v1/analytics':
      return { count: analytics.length, data: analytics };
    default:
      return { error: 'Endpoint not found' };
  }
};


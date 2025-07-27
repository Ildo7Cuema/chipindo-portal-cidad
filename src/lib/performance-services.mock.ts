// Mock performance services for build compatibility

export interface PerformanceMetrics {
  loadTime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  cacheHitRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface PerformanceReport {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  score: number;
  metrics: PerformanceMetrics;
  recommendations: string[];
  timestamp: string;
}

export const getPerformanceMetrics = async (): Promise<PerformanceMetrics> => {
  return {
    loadTime: 1.2,
    responseTime: 0.8,
    throughput: 95,
    errorRate: 0.1,
    cacheHitRate: 87.5,
    memoryUsage: 65,
    cpuUsage: 45
  };
};

export const generatePerformanceReport = async (): Promise<PerformanceReport> => {
  const metrics = await getPerformanceMetrics();
  
  return {
    overall: 'good',
    score: 85,
    metrics,
    recommendations: [
      'Consider enabling compression for better performance',
      'Optimize image sizes to reduce load times',
      'Implement lazy loading for better user experience'
    ],
    timestamp: new Date().toISOString()
  };
};

export const optimizePerformance = async (): Promise<boolean> => {
  console.log('Mock performance optimization');
  return true;
};

export const clearPerformanceCache = async (): Promise<boolean> => {
  console.log('Mock performance cache cleared');
  return true;
};

export const monitorPerformance = (callback: (metrics: PerformanceMetrics) => void): void => {
  // Mock performance monitoring
  setInterval(() => {
    callback({
      loadTime: Math.random() * 2,
      responseTime: Math.random() * 1.5,
      throughput: 90 + Math.random() * 10,
      errorRate: Math.random() * 0.5,
      cacheHitRate: 85 + Math.random() * 10,
      memoryUsage: 60 + Math.random() * 20,
      cpuUsage: 40 + Math.random() * 20
    });
  }, 5000);
};

export const recordMetric = async (name: string, value: any): Promise<boolean> => {
  console.log('Mock metric recorded:', name, value);
  return true;
};
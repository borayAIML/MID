import { 
  Industry, 
  IndustrySubcategory, 
  BenchmarkMetric, 
  IndustryBenchmarkData,
  getIndustryById,
  getSubcategoryById,
  getMetricById,
  industries,
  benchmarkMetrics
} from '@shared/industries';

// This service handles fetching and managing industry benchmark data with real-time updates
// Provides both static data and WebSocket-based real-time updates

// WebSocket connection setup
let socket: WebSocket | null = null;
let wsConnected = false;
let wsReconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

interface BenchmarkResult {
  value: number;
  average: number;
  maxValue: number;
  percentile?: number; // Optional - where the company stands in the distribution
  trend?: 'up' | 'down' | 'stable'; // Trend direction
  changePercent?: number; // Percent change from previous period
  metadata: {
    dataSource: string;
    lastUpdated: string;
    sampleSize: number;
    isRealTime?: boolean; // Whether this data is real-time
    updateFrequency?: string; // How often the data updates
    europeanIndex?: boolean; // Whether this metric is from the European market index
    confidenceScore?: number; // Confidence level in the data (0-100)
  };
}

interface CompanyMetrics {
  industryId: string;
  subcategoryId?: string;
  metrics: Record<string, number>;
}

// Cache for benchmark data to avoid redundant fetches
const benchmarkCache: Record<string, Record<string, BenchmarkResult>> = {};

// Simulated API function that would connect to a real data source in production
export async function fetchIndustryBenchmarks(
  industryId: string,
  subcategoryId?: string,
  year: number = new Date().getFullYear(),
  quarter?: number
): Promise<Record<string, BenchmarkResult>> {
  // Create a cache key
  const cacheKey = `${industryId}-${subcategoryId || 'all'}-${year}-${quarter || 'all'}`;
  
  // Return cached data if available
  if (benchmarkCache[cacheKey]) {
    return benchmarkCache[cacheKey];
  }
  
  // In a real app, this would be an API call
  // For now, we'll generate realistic benchmark data
  const results: Record<string, BenchmarkResult> = {};
  
  // Get industry-specific benchmark ranges
  const industryRanges = getBenchmarkRangesForIndustry(industryId, subcategoryId);
  
  // Generate data for each metric
  for (const metric of benchmarkMetrics) {
    const range = industryRanges[metric.id] || { min: 0, avg: 50, max: 100 };
    
    results[metric.id] = {
      value: 0, // This will be set by the caller with company's actual value
      average: range.avg,
      maxValue: range.max * 1.2, // Set max slightly higher than industry max for chart display
      trend: 'stable',
      changePercent: 0,
      metadata: {
        dataSource: 'Industry Association Data',
        lastUpdated: new Date().toISOString().split('T')[0],
        sampleSize: Math.floor(Math.random() * 500) + 100, // Simulated sample size
        isRealTime: false,
        confidenceScore: 85
      }
    };
  }
  
  // Cache the results
  benchmarkCache[cacheKey] = results;
  
  return results;
}

// Compare company metrics against industry benchmarks
export async function compareCompanyToBenchmarks(
  companyMetrics: CompanyMetrics
): Promise<Record<string, BenchmarkResult>> {
  const { industryId, subcategoryId, metrics } = companyMetrics;
  
  // Fetch industry benchmarks
  const benchmarks = await fetchIndustryBenchmarks(industryId, subcategoryId);
  
  // Merge company metrics with benchmark data
  const results: Record<string, BenchmarkResult> = {};
  
  for (const metricId in benchmarks) {
    if (metrics[metricId] !== undefined) {
      // Calculate trend direction based on industry average
      const value = metrics[metricId];
      const average = benchmarks[metricId].average;
      let trend: 'up' | 'down' | 'stable' = 'stable';
      let changePercent = 0;
      
      if (value > average * 1.05) {
        trend = 'up';
        changePercent = ((value / average) - 1) * 100;
      } else if (value < average * 0.95) {
        trend = 'down';
        changePercent = (1 - (value / average)) * 100;
      }
      
      results[metricId] = {
        ...benchmarks[metricId],
        value,
        trend,
        changePercent: parseFloat(changePercent.toFixed(1))
      };
    } else {
      results[metricId] = benchmarks[metricId];
    }
  }
  
  return results;
}

// New function to simulate real-time updates
// In a real app, this would connect to a WebSocket or use polling
let realTimeListeners: Array<(data: Record<string, BenchmarkResult>) => void> = [];
let realTimeUpdateInterval: NodeJS.Timeout | null = null;
let realTimeData: Record<string, BenchmarkResult> = {};

// Add real-time data for specific industry and metrics
// Connection status callbacks interface
interface ConnectionCallbacks {
  onConnecting?: () => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

export function setupRealTimeBenchmarks(
  industryId: string,
  metricIds: string[],
  subcategoryId?: string,
  connectionCallbacks?: ConnectionCallbacks
): Promise<Record<string, BenchmarkResult>> {
  // Notify that we're connecting if callback exists
  connectionCallbacks?.onConnecting?.();
  
  return new Promise((resolve, reject) => {
    // Get initial benchmark data
    fetchIndustryBenchmarks(industryId, subcategoryId).then((benchmarks) => {
      // Filter only the requested metrics
      realTimeData = Object.keys(benchmarks)
        .filter(id => metricIds.includes(id))
        .reduce((acc, id) => {
          // Add real-time specific metadata
          const benchmark = {
            ...benchmarks[id],
            metadata: {
              dataSource: benchmarks[id].metadata?.dataSource || 'European Market Index',
              sampleSize: benchmarks[id].metadata?.sampleSize || 250,
              lastUpdated: new Date().toISOString(),
              isRealTime: true,
              updateFrequency: '15s',
              europeanIndex: ['ebitda_margin', 'revenue_growth', 'digital_transformation', 'roi'].includes(id),
              confidenceScore: Math.floor(Math.random() * 20) + 80 // 80-100
            }
          };
          
          acc[id] = benchmark;
          return acc;
        }, {} as Record<string, BenchmarkResult>);
      
      // Initialize WebSocket connection with connection callbacks
      try {
        initializeWebSocket(connectionCallbacks);
        
        // Give the WebSocket a moment to connect before sending subscription
        const checkAndSubscribe = () => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            // Send subscription message to WebSocket server
            console.log(`Subscribing to metrics for industry: ${industryId}`, metricIds);
            
            // Ensure we're using the correct type that matches server expectation
            socket.send(JSON.stringify({
              type: 'subscribe_metrics',  // This needs to match what server is listening for
              industry: industryId,
              subcategory: subcategoryId,
              metrics: metricIds
            }));
            
            console.log('Sent subscription message:', JSON.stringify({
              type: 'subscribe_metrics',
              industry: industryId,
              subcategory: subcategoryId,
              metrics: metricIds
            }));
          } else if (socket && socket.readyState === WebSocket.CONNECTING) {
            // Socket is still connecting, wait a bit and try again
            setTimeout(checkAndSubscribe, 100);
          } else {
            // Socket failed to connect or isn't available, fall back to polling
            console.log('WebSocket not available, falling back to polling');
            if (!realTimeUpdateInterval) {
              startRealTimeUpdates();
            }
          }
        };
        
        // Start the connection check process
        checkAndSubscribe();
        
        resolve({...realTimeData});
      } catch (error) {
        console.error("Error in websocket setup:", error);
        connectionCallbacks?.onError?.(error instanceof Error ? error : new Error('Unknown error in WebSocket setup'));
        reject(error);
      }
    });
  });
}

// Subscribe to real-time updates
export function subscribeToRealTimeUpdates(
  callback: (data: Record<string, BenchmarkResult>) => void
): () => void {
  realTimeListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    realTimeListeners = realTimeListeners.filter(listener => listener !== callback);
    
    // If no listeners, stop updates
    if (realTimeListeners.length === 0 && realTimeUpdateInterval) {
      clearInterval(realTimeUpdateInterval);
      realTimeUpdateInterval = null;
    }
  };
}

// Initialize WebSocket connection
export function initializeWebSocket(connectionCallbacks?: ConnectionCallbacks): void {
  // Clean up existing socket if it exists
  if (socket) {
    try {
      socket.close();
    } catch (e) {
      console.log('Error closing existing socket:', e);
    }
    socket = null;
  }
  
  try {
    // Create WebSocket connection using correct protocol based on current connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('Connecting to WebSocket at:', wsUrl);
    
    // Notify connecting if callback exists
    connectionCallbacks?.onConnecting?.();
    
    // Setup connection timeout
    const connectionTimeout = setTimeout(() => {
      if (socket && socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket connection timeout');
        connectionCallbacks?.onError?.(new Error('Connection timeout - server did not respond'));
        
        // Try to close the socket
        try {
          socket.close();
        } catch (e) {
          console.error('Error closing timed-out socket:', e);
        }
        socket = null;
        
        // Start fallback
        startPollingFallback();
      }
    }, 5000); // 5 second timeout
    
    console.log('Creating new WebSocket connection to:', wsUrl);
    socket = new WebSocket(wsUrl);
    
    if (socket) {
      socket.onopen = () => {
        // Clear the connection timeout
        clearTimeout(connectionTimeout);
        
        console.log('WebSocket connection established for real-time benchmarks');
        wsConnected = true;
        wsReconnectAttempts = 0;
        
        // Notify connected if callback exists
        connectionCallbacks?.onConnected?.();
        
        // Send a simple connection confirmation message
        if (socket) {
          socket.send(JSON.stringify({
            type: 'subscribe',
            channel: 'benchmark_updates'
          }));
        }
        
        console.log('WebSocket connected and ready for metric subscriptions');
      };
    }
    
    if (socket) {
      socket.onmessage = (event) => {
        try {
          console.log('Received WebSocket message:', event.data);
          const message = JSON.parse(event.data);
          
          if (message.type === 'benchmark_update') {
            console.log('Processing benchmark update with data:', message.data);
            handleBenchmarkUpdate(message.data);
          } else if (message.type === 'subscription_confirmed') {
            console.log('Subscription confirmed:', message);
          } else if (message.type === 'error') {
            console.error('Error from WebSocket server:', message.error);
            connectionCallbacks?.onError?.(new Error(message.error || 'Server error'));
          } else {
            console.log('Received other WebSocket message type:', message.type, message);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
          connectionCallbacks?.onError?.(new Error('Failed to process WebSocket message'));
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket connection closed');
        wsConnected = false;
        socket = null;
        
        // Notify disconnected if callback exists
        connectionCallbacks?.onDisconnected?.();
        
        // Attempt to reconnect with backoff
        if (wsReconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const backoffDelay = Math.min(1000 * (2 ** wsReconnectAttempts), 30000);
          setTimeout(() => {
            wsReconnectAttempts++;
            initializeWebSocket(connectionCallbacks);
          }, backoffDelay);
        } else {
          console.log('Max WebSocket reconnection attempts reached. Falling back to polling.');
          connectionCallbacks?.onError?.(new Error('Max reconnection attempts reached, using fallback polling'));
          startPollingFallback();
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Notify error if callback exists
        connectionCallbacks?.onError?.(new Error('WebSocket connection error'));
        // Socket will attempt to reconnect via onclose handler
      };
    }
  } catch (error) {
    console.error('Failed to initialize WebSocket:', error);
    connectionCallbacks?.onError?.(new Error('Failed to initialize WebSocket connection'));
    startPollingFallback();
  }
}

// Process incoming benchmark update from WebSocket
function handleBenchmarkUpdate(data: Record<string, BenchmarkResult>): void {
  if (!data) {
    console.warn('Received empty benchmark update');
    return;
  }
  
  console.log('Received benchmark update from WebSocket:', Object.keys(data));
  
  // Update our real-time data with the received updates
  Object.keys(data).forEach(metricId => {
    try {
      if (realTimeData[metricId]) {
        console.log(`Updating metric: ${metricId}, current value:`, realTimeData[metricId]);
        
        // Preserve existing company value while updating industry average
        const companyValue = realTimeData[metricId].value;
        
        realTimeData[metricId] = {
          ...realTimeData[metricId],
          ...data[metricId],
          // Keep original company value
          value: companyValue,
          metadata: {
            ...realTimeData[metricId].metadata,
            ...(data[metricId].metadata || {}),
            lastUpdated: new Date().toISOString(),
            isRealTime: true
          }
        };
        
        // Set trend based on comparison to previous average
        const oldAverage = realTimeData[metricId].average;
        const newAverage = data[metricId].average;
        
        if (newAverage > oldAverage * 1.005) {
          realTimeData[metricId].trend = 'up';
          realTimeData[metricId].changePercent = ((newAverage / oldAverage) - 1) * 100;
        } else if (newAverage < oldAverage * 0.995) {
          realTimeData[metricId].trend = 'down';
          realTimeData[metricId].changePercent = (1 - (newAverage / oldAverage)) * 100;
        } else {
          realTimeData[metricId].trend = 'stable';
          realTimeData[metricId].changePercent = Math.abs((newAverage / oldAverage - 1) * 100);
        }
        
        console.log(`Updated metric: ${metricId}, new value:`, realTimeData[metricId]);
      } else {
        console.warn(`Received update for new metric: ${metricId}`);
        // Initialize this metric in our data
        realTimeData[metricId] = {
          ...data[metricId],
          metadata: {
            ...(data[metricId].metadata || {}),
            lastUpdated: new Date().toISOString(),
            isRealTime: true
          }
        };
      }
    } catch (error) {
      console.error(`Error updating metric ${metricId}:`, error);
      // Continue with other metrics
    }
  });
  
  // Notify all listeners of the updates
  console.log(`Notifying ${realTimeListeners.length} listeners of benchmark updates`);
  if (realTimeListeners.length > 0) {
    realTimeListeners.forEach(listener => listener({...realTimeData}));
  }
}

// Fallback to polling if WebSocket connection fails
function startPollingFallback(): void {
  console.log('Starting polling fallback for real-time benchmark updates');
  startRealTimeUpdates();
}

// Start real-time data simulation (fallback when WebSocket is unavailable)
function startRealTimeUpdates(): void {
  // Clear any existing interval
  if (realTimeUpdateInterval) {
    clearInterval(realTimeUpdateInterval);
  }
  
  // Don't start updates if we don't have any data
  if (Object.keys(realTimeData).length === 0) {
    console.warn('Cannot start real-time updates: no benchmark data available');
    return;
  }
  
  console.log('Starting real-time updates for metrics:', Object.keys(realTimeData));
  
  // Update every 15 seconds
  realTimeUpdateInterval = setInterval(() => {
    try {
      // Update each metric slightly
      Object.keys(realTimeData).forEach(id => {
        try {
          const currentAvg = realTimeData[id].average || 0;
          
          // Small random change, more likely to go up than down (growth bias)
          const changeFactor = 1 + ((Math.random() - 0.4) * 0.03); // -1% to +2%
          const newAverage = currentAvg * changeFactor;
          
          // Random trend
          let trend: 'up' | 'down' | 'stable' = 'stable';
          let changePercent = Math.abs((changeFactor - 1) * 100);
          
          if (changeFactor > 1.005) {
            trend = 'up';
          } else if (changeFactor < 0.995) {
            trend = 'down';
          }
          
          // Make sure metadata object has all required fields, use defaults if missing
          const currentMetadata = realTimeData[id].metadata || {};
          const updatedMetadata = {
            dataSource: currentMetadata.dataSource || 'European Market Index',
            sampleSize: currentMetadata.sampleSize || 250,
            lastUpdated: new Date().toISOString(),
            isRealTime: true,
            updateFrequency: currentMetadata.updateFrequency || '15s',
            europeanIndex: currentMetadata.europeanIndex !== undefined ? 
              currentMetadata.europeanIndex : 
              ['ebitda_margin', 'revenue_growth', 'digital_transformation', 'roi'].includes(id),
            confidenceScore: currentMetadata.confidenceScore || Math.floor(Math.random() * 20) + 80 // 80-100
          };
          
          realTimeData[id] = {
            ...realTimeData[id],
            average: parseFloat(newAverage.toFixed(2)),
            trend,
            changePercent: parseFloat(changePercent.toFixed(1)),
            metadata: updatedMetadata
          };
        } catch (error) {
          console.error(`Error updating metric ${id}:`, error);
          // Continue with other metrics
        }
      });
      
      // Notify all listeners
      if (realTimeListeners.length > 0) {
        console.log('Notifying listeners of polling updates:', Object.keys(realTimeData).length, 'metrics');
        realTimeListeners.forEach(listener => listener({...realTimeData}));
      }
    } catch (error) {
      console.error('Error in real-time update loop:', error);
    }
  }, 15000); // 15 seconds
}

// Get all available industries
export function getIndustries(): Industry[] {
  return industries;
}

// Get subcategories for a specific industry
export function getSubcategoriesForIndustry(industryId: string): IndustrySubcategory[] {
  const industry = getIndustryById(industryId);
  return industry ? industry.subcategories : [];
}

// Get available benchmark metrics
export function getBenchmarkMetrics(): BenchmarkMetric[] {
  return benchmarkMetrics;
}

// Function to get specific metric details
export function getBenchmarkMetric(metricId: string): BenchmarkMetric | undefined {
  return getMetricById(metricId);
}

// Helper function to determine benchmark ranges for different industries
// In a real app, this would come from a database or API
function getBenchmarkRangesForIndustry(
  industryId: string, 
  subcategoryId?: string
): Record<string, { min: number, avg: number, max: number }> {
  // Default ranges
  const defaultRanges: Record<string, { min: number, avg: number, max: number }> = {
    revenue_growth: { min: 2, avg: 8, max: 20 },
    profit_margin: { min: 5, avg: 15, max: 30 },
    roi: { min: 5, avg: 15, max: 30 },
    employee_productivity: { min: 80000, avg: 150000, max: 300000 },
    customer_acquisition_cost: { min: 50, avg: 200, max: 1000 },
    customer_retention: { min: 60, avg: 80, max: 95 },
    digital_transformation: { min: 30, avg: 65, max: 90 },
    r_and_d: { min: 1, avg: 5, max: 15 },
    debt_to_equity: { min: 0.1, avg: 1.0, max: 2.5 },
    cash_flow: { min: 5, avg: 15, max: 25 }
  };
  
  // Industry-specific adjustments (in a real app this would be from a database)
  const industryAdjustments: Record<string, Record<string, { min: number, avg: number, max: number }>> = {
    tech: {
      revenue_growth: { min: 5, avg: 18, max: 40 },
      profit_margin: { min: 10, avg: 20, max: 35 },
      digital_transformation: { min: 50, avg: 80, max: 95 },
      r_and_d: { min: 8, avg: 15, max: 25 }
    },
    retail: {
      profit_margin: { min: 2, avg: 8, max: 15 },
      customer_acquisition_cost: { min: 10, avg: 50, max: 200 },
      customer_retention: { min: 65, avg: 75, max: 90 }
    },
    manufacturing: {
      revenue_growth: { min: 1, avg: 5, max: 15 },
      employee_productivity: { min: 100000, avg: 200000, max: 400000 },
      digital_transformation: { min: 20, avg: 42, max: 80 }
    },
    healthcare: {
      profit_margin: { min: 8, avg: 15, max: 25 },
      employee_productivity: { min: 120000, avg: 180000, max: 350000 },
      r_and_d: { min: 10, avg: 18, max: 30 }
    },
    finance: {
      profit_margin: { min: 15, avg: 25, max: 40 },
      employee_productivity: { min: 200000, avg: 350000, max: 800000 },
      debt_to_equity: { min: 1.5, avg: 3.0, max: 5.0 },
      cash_flow: { min: 10, avg: 20, max: 35 }
    }
  };
  
  // Apply industry adjustments if available
  if (industryAdjustments[industryId]) {
    return { ...defaultRanges, ...industryAdjustments[industryId] };
  }
  
  return defaultRanges;
}

// Get trending data for a metric over time
export async function getMetricTrendData(
  industryId: string,
  metricId: string,
  subcategoryId?: string,
  years: number = 5
): Promise<{ date: string; value: number }[]> {
  // In a real app, this would fetch historical data from an API
  const currentYear = new Date().getFullYear();
  const result = [];
  
  // Get average value for this metric and industry
  const ranges = getBenchmarkRangesForIndustry(industryId, subcategoryId);
  const baseValue = ranges[metricId]?.avg || 50;
  
  // Generate trend data with realistic variation
  for (let i = 0; i < years; i++) {
    const year = currentYear - years + i + 1;
    
    // Generate realistic fluctuations around the base value
    const variance = baseValue * 0.1; // 10% variance
    const randomFactor = (Math.random() - 0.5) * variance;
    
    // Add slight upward trend over time (0.5% per year)
    const trendFactor = baseValue * 0.005 * i;
    
    result.push({
      date: `${year}`,
      value: baseValue + randomFactor + trendFactor
    });
  }
  
  return result;
}
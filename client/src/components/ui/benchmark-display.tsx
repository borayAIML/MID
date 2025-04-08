import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BenchmarkChart from "@/components/charts/BenchmarkChart";
import { AlertCircle, Zap, TrendingUp, TrendingDown, MinusCircle, InfoIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { 
  fetchIndustryBenchmarks, 
  compareCompanyToBenchmarks,
  getBenchmarkMetric,
  getMetricTrendData,
  setupRealTimeBenchmarks,
  subscribeToRealTimeUpdates
} from "@/lib/benchmarkService";
import {
  ResponsiveContainer,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from "recharts";

interface BenchmarkResult {
  value: number;
  average: number;
  maxValue: number;
  percentile?: number;
  trend?: 'up' | 'down' | 'stable';
  changePercent?: number;
  metadata?: {
    dataSource: string;
    lastUpdated: string;
    sampleSize: number;
    isRealTime?: boolean;
    updateFrequency?: string;
    europeanIndex?: boolean;
    confidenceScore?: number;
  };
}

interface BenchmarkDisplayProps {
  industryId: string;
  subcategoryId?: string;
  companyMetrics?: Record<string, number>;
  metrics?: string[];
  className?: string;
  onRealTimeStatus?: (isActive: boolean) => void;
}

export function BenchmarkDisplay({
  industryId,
  subcategoryId,
  companyMetrics = {},
  metrics = ['revenue_growth', 'profit_margin', 'digital_transformation'],
  className = "",
  onRealTimeStatus
}: BenchmarkDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [benchmarkData, setBenchmarkData] = useState<Record<string, BenchmarkResult>>({});
  const [selectedMetric, setSelectedMetric] = useState<string>(metrics[0] || 'revenue_growth');
  const [trendData, setTrendData] = useState<{ date: string; value: number }[]>([]);
  const [trendIsLoading, setTrendIsLoading] = useState(false);
  const [isRealTime, setIsRealTime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  const metricColors: Record<string, string> = {
    revenue_growth: "blue",
    profit_margin: "green",
    roi: "purple",
    employee_productivity: "indigo",
    customer_acquisition_cost: "red",
    customer_retention: "amber",
    digital_transformation: "pink",
    r_and_d: "cyan",
    debt_to_equity: "orange",
    cash_flow: "emerald"
  };

  // Clean up real-time subscription when component unmounts
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);
  
  // Notify parent component about real-time status changes
  useEffect(() => {
    if (onRealTimeStatus) {
      onRealTimeStatus(isRealTime);
    }
  }, [isRealTime, onRealTimeStatus]);

  // Toggle real-time data updates
  const toggleRealTimeUpdates = async () => {
    console.log('Toggling real-time updates. Current state:', isRealTime);
    
    // If currently using real-time data, unsubscribe
    if (isRealTime && unsubscribeRef.current) {
      console.log('Unsubscribing from real-time updates...');
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      setIsRealTime(false);
      setLastUpdated(null);
      setConnectionStatus('disconnected');
      setConnectionError(null);
      
      // Reload regular data
      setIsLoading(true);
      try {
        console.log('Loading standard benchmark data...');
        const benchmarks = await fetchIndustryBenchmarks(industryId, subcategoryId);
        setBenchmarkData(benchmarks);
        console.log('Successfully loaded static benchmark data:', Object.keys(benchmarks));
      } catch (error) {
        console.error("Error loading benchmarks:", error);
      } finally {
        setIsLoading(false);
      }
      
      return;
    }
    
    // Setup real-time data
    console.log('Setting up real-time benchmark data...');
    setIsLoading(true);
    setConnectionStatus('connecting');
    setConnectionError(null);
    try {
      // Show toast to users that we are connecting to real-time data
      console.log('Connecting to real-time European Market data...');
      
      // Initialize the WebSocket and real-time benchmarks
      console.log('Setting up WebSocket with industry:', industryId, 'metrics:', metrics);
      const realTimeBenchmarks = await setupRealTimeBenchmarks(
        industryId, 
        metrics, 
        subcategoryId,
        // Connection status callbacks
        {
          onConnecting: () => {
            console.log('Connecting to WebSocket...');
            setConnectionStatus('connecting');
          },
          onConnected: () => {
            console.log('Connected to WebSocket!');
            setConnectionStatus('connected');
            setConnectionError(null);
          },
          onDisconnected: () => {
            console.log('Disconnected from WebSocket');
            setConnectionStatus('disconnected');
          },
          onError: (error) => {
            console.error('WebSocket error:', error.message);
            setConnectionStatus('error');
            setConnectionError(error.message);
          }
        }
      );
      
      console.log('Received initial real-time benchmark data:', Object.keys(realTimeBenchmarks));
      setBenchmarkData(realTimeBenchmarks);
      setLastUpdated(new Date().toLocaleTimeString());
      
      // Subscribe to real-time updates via the WebSocket connection
      console.log('Subscribing to real-time updates...');
      const unsubscribe = subscribeToRealTimeUpdates((data) => {
        const updateKeys = Object.keys(data);
        console.log(`Received real-time update for ${updateKeys.length} metrics:`, updateKeys);
        
        setBenchmarkData(prevData => {
          console.log('Updating benchmark data with new values:', updateKeys);
          return {
            ...prevData,
            ...data  // Merge new data with existing data
          };
        });
        setLastUpdated(new Date().toLocaleTimeString());
      });
      
      unsubscribeRef.current = unsubscribe;
      setIsRealTime(true);
      console.log('Real-time mode successfully enabled');
    } catch (error) {
      console.error("Error setting up real-time benchmarks:", error);
      setConnectionStatus('error');
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect to real-time service');
      
      // If there was an error, make sure real-time is turned off
      setIsRealTime(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Load benchmark data when industry/subcategory changes
  useEffect(() => {
    // If real-time is active, unsubscribe first
    if (isRealTime && unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      setIsRealTime(false);
      setLastUpdated(null);
    }
    
    const loadBenchmarks = async () => {
      setIsLoading(true);
      try {
        if (industryId) {
          let benchmarks;
          
          // If company metrics are provided, use comparison function
          if (Object.keys(companyMetrics).length > 0) {
            benchmarks = await compareCompanyToBenchmarks({
              industryId,
              subcategoryId,
              metrics: companyMetrics
            });
          } else {
            // Otherwise just fetch standard benchmarks
            benchmarks = await fetchIndustryBenchmarks(industryId, subcategoryId);
          }
          
          setBenchmarkData(benchmarks);
        }
      } catch (error) {
        console.error("Error loading benchmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBenchmarks();
  }, [industryId, subcategoryId, companyMetrics]);
  
  // Load trend data when selected metric changes
  useEffect(() => {
    const loadTrendData = async () => {
      if (!industryId || !selectedMetric) return;
      
      setTrendIsLoading(true);
      try {
        const data = await getMetricTrendData(industryId, selectedMetric, subcategoryId);
        setTrendData(data);
      } catch (error) {
        console.error("Error loading trend data:", error);
      } finally {
        setTrendIsLoading(false);
      }
    };
    
    loadTrendData();
  }, [industryId, subcategoryId, selectedMetric]);

  // Function to format the metric value as a string with appropriate units
  const formatMetricValue = (value: number, metricId: string) => {
    const metric = getBenchmarkMetric(metricId);
    if (!metric) return value.toString();
    
    if (metric.unit === '%') {
      return `${value}%`;
    } else if (metric.unit === '$') {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(value);
    } else if (metric.unit === 'ratio') {
      return value.toFixed(2);
    } else {
      return value.toString();
    }
  };

  return (
    <div className={`${className} p-4 rounded-lg bg-white border border-indigo-100 shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="real-time-toggle" 
            checked={isRealTime} 
            onCheckedChange={toggleRealTimeUpdates}
            className={`cursor-pointer ${isRealTime ? "bg-indigo-600 data-[state=checked]:bg-indigo-600" : ""}`}
          />
          <Label 
            htmlFor="real-time-toggle" 
            className="cursor-pointer flex items-center text-indigo-700 font-medium"
          >
            <span>Real-time European data</span>
            {isRealTime && (
              <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none hover:from-green-600 hover:to-emerald-600">
                <span className="h-2 w-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
                <span className="text-xs">LIVE</span>
              </Badge>
            )}
          </Label>
        </div>
        
        {isRealTime && (
          <div className="text-xs text-muted-foreground flex items-center space-x-2">
            {lastUpdated && <span>Last update: {lastUpdated}</span>}
            
            {/* Connection status display */}
            <div className="flex items-center">
              {connectionStatus === 'connected' && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
                    Connected
                  </span>
                </Badge>
              )}
              
              {connectionStatus === 'connecting' && (
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-none">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
                    Connecting...
                  </span>
                </Badge>
              )}
              
              {connectionStatus === 'disconnected' && (
                <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-none">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-white mr-1.5"></span>
                    Disconnected
                  </span>
                </Badge>
              )}
              
              {connectionStatus === 'error' && (
                <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-none">
                  <span className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Connection Error
                  </span>
                </Badge>
              )}
              
              {/* Show error message when there's a connection error */}
              {connectionStatus === 'error' && connectionError && (
                <div className="mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  {connectionError}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-indigo-50 h-10 p-1 rounded-md">
          <TabsTrigger 
            value="charts" 
            className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm data-[state=active]:font-medium px-4 h-full rounded-md transition-all hover:bg-indigo-100 cursor-pointer"
          >
            Benchmark Charts
          </TabsTrigger>
          <TabsTrigger 
            value="trends" 
            className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm data-[state=active]:font-medium px-4 h-full rounded-md transition-all hover:bg-indigo-100 cursor-pointer"
          >
            Historical Trends
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                    <Skeleton className="h-2 w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.map((metricId) => {
                const metric = getBenchmarkMetric(metricId);
                const data = benchmarkData[metricId];
                
                if (!metric || !data) return null;
                
                const color = metricColors[metricId] || "blue";
                
                return (
                  <Card 
                    key={metricId} 
                    className="border-indigo-100 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer no-hover-movement"
                    onClick={() => setSelectedMetric(metricId)}
                  >
                    <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 shadow-sm relative z-10">
                      <CardTitle className="text-sm font-medium text-indigo-800 flex items-center justify-between">
                        <span>{metric.name}</span>
                        {selectedMetric === metricId && <span className="inline-block h-2 w-2 bg-indigo-600 rounded-full"></span>}
                      </CardTitle>
                      <CardDescription className="text-xs text-indigo-600">{metric.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 bg-gradient-to-b from-white to-slate-50">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className={`text-xs font-semibold inline-block py-1.5 px-3 uppercase rounded-full shadow-sm ${
                              color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
                              color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                              color === 'red' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' :
                              color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white' :
                              color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' :
                              color === 'pink' ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white' :
                              color === 'indigo' ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white' :
                              color === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' :
                              color === 'cyan' ? 'bg-gradient-to-r from-cyan-500 to-blue-400 text-white' :
                              color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' :
                              'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            }`}>
                              Your Company: {formatMetricValue(data.value, metricId)}
                            </span>
                          </div>
                          <div className="text-right flex items-center">
                            <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-indigo-100 text-indigo-700 mr-2">
                              Industry Average: {formatMetricValue(data.average, metricId)}
                            </span>
                            
                            {data.trend && (
                              <span className={`inline-flex items-center ${
                                data.trend === 'up' ? 'text-green-600' : 
                                data.trend === 'down' ? 'text-red-600' : 
                                'text-gray-500'
                              }`}>
                                {data.trend === 'up' ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : data.trend === 'down' ? (
                                  <TrendingDown className="w-4 h-4" />
                                ) : (
                                  <MinusCircle className="w-4 h-4" />
                                )}
                                {data.changePercent !== undefined && data.changePercent > 0 && (
                                  <span className="text-xs ml-1">{data.changePercent.toFixed(1)}%</span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <BenchmarkChart 
                          value={data.value} 
                          average={data.average} 
                          maxValue={data.maxValue} 
                          color="blue" 
                        />
                        
                        {data.metadata && (
                          <div className="mt-3 flex flex-wrap justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <span>Source: {data.metadata.dataSource}</span>
                              {data.metadata.europeanIndex && (
                                <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none">
                                  <span className="text-xs">EU Index</span>
                                </Badge>
                              )}
                            </div>
                            
                            <span>Last updated: {new Date(data.metadata.lastUpdated).toLocaleString()}</span>
                            
                            <div className="flex items-center">
                              <span>Sample size: {data.metadata.sampleSize} companies</span>
                              {data.metadata.confidenceScore !== undefined && (
                                <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                  {data.metadata.confidenceScore}% confidence
                                </span>
                              )}
                            </div>
                            
                            {data.metadata.isRealTime && (
                              <div className="w-full mt-1.5">
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none">
                                  <span className="h-2 w-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
                                  <span className="text-xs">Real-time • Updates every {data.metadata.updateFrequency}</span>
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="trends" className="mt-4">
          <Card className="border-indigo-100 shadow-sm overflow-hidden no-hover-movement">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 shadow-sm relative z-10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-indigo-800">Historical Trends</CardTitle>
                <select 
                  className="px-3 py-1.5 text-sm border border-indigo-200 rounded-md bg-white shadow-sm hover:border-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  {metrics.map((metricId) => {
                    const metric = getBenchmarkMetric(metricId);
                    return metric ? (
                      <option key={metricId} value={metricId}>
                        {metric.name}
                      </option>
                    ) : null;
                  })}
                </select>
              </div>
              <CardDescription className="flex items-center text-indigo-600">
                <span>Industry average over time</span>
                {isRealTime && (
                  <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none">
                    <span className="h-2 w-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
                    <span className="text-xs">Real-time data active</span>
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-gradient-to-b from-white to-slate-50">
              {trendIsLoading ? (
                <div className="w-full h-[300px] flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => {
                          return formatMetricValue(value, selectedMetric);
                        }}
                      />
                      <Legend />
                      
                      {/* Show a reference line for current value when in real-time mode */}
                      {isRealTime && benchmarkData[selectedMetric] && (
                        <ReferenceLine 
                          y={benchmarkData[selectedMetric].average} 
                          stroke="#82ca9d" 
                          strokeDasharray="3 3"
                          label={{
                            value: 'Current',
                            position: 'insideTopRight',
                            fill: '#82ca9d'
                          }} 
                        />
                      )}
                      
                      <Line
                        type="monotone"
                        dataKey="value"
                        name={getBenchmarkMetric(selectedMetric)?.name || "Value"}
                        stroke={isRealTime ? "#8884d8" : "#8884d8"}
                        strokeWidth={isRealTime ? 1 : 2}
                        activeDot={{ r: 8 }}
                      />
                      
                      {/* Add real-time datapoint when applicable */}
                      {isRealTime && benchmarkData[selectedMetric] && (
                        <Line
                          data={[
                            { 
                              date: "Current", 
                              value: benchmarkData[selectedMetric].average 
                            }
                          ]}
                          type="monotone"
                          dataKey="value"
                          name="Real-time"
                          stroke="#82ca9d"
                          strokeWidth={3}
                          dot={{ r: 6, fill: '#82ca9d' }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
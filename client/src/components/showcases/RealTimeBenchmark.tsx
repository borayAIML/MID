import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BenchmarkDisplay } from '@/components/ui/benchmark-display';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  LineChart, 
  BarChart, 
  Line, 
  Pie, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  ResponsiveContainer
} from 'recharts';
import { Industry, industries } from '@shared/industries';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, AlertCircle, Activity, GlobeIcon, Building2, Layers } from 'lucide-react';
import { AnimatedElement } from '@/components/ui/animated-element';

// Sample data for benchmark visualizations
const revenueGrowthData = [
  { name: 'Q1 2024', industry: 12, company: 14 },
  { name: 'Q2 2024', industry: 13, company: 15 },
  { name: 'Q3 2024', industry: 10, company: 18 },
  { name: 'Q4 2024', industry: 15, company: 20 },
  { name: 'Q1 2025', industry: 16, company: 22 },
];

const profitMarginData = [
  { name: 'SaaS', value: 12 },
  { name: 'Manufacturing', value: 8 },
  { name: 'Retail', value: 5 },
  { name: 'Healthcare', value: 10 },
  { name: 'Finance', value: 15 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#a855f7'];

const customersData = [
  { name: 'Acquisition Cost', company: 430, industry: 500 },
  { name: 'Lifetime Value', company: 2800, industry: 2300 },
  { name: 'Retention Rate', company: 82, industry: 75 },
  { name: 'Referral Rate', company: 35, industry: 20 },
];

export default function RealTimeBenchmarkShowcase() {
  const [selectedIndustry, setSelectedIndustry] = useState('tech_saas');
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('key_metrics');
  
  // Simulate real-time updates
  useEffect(() => {
    let intervalId: number;
    
    if (isRealTimeActive) {
      intervalId = window.setInterval(() => {
        setLastUpdated(new Date());
      }, 10000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRealTimeActive]);
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1200);
  };
  
  const formattedLastUpdated = lastUpdated.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };
  
  return (
    <div className="space-y-6">
      <AnimatedElement delay={0.1} className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 fixed-element">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div>
              <label className="text-sm font-medium block mb-1 text-indigo-700 flex items-center">
                <Building2 className="w-4 h-4 mr-1.5" />
                Industry
              </label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-[200px] border-indigo-200 bg-white shadow-sm hover:border-indigo-300 transition-colors">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-white border-indigo-100">
                  <SelectItem value="tech_saas" className="cursor-pointer hover:bg-indigo-50">SaaS/Software</SelectItem>
                  <SelectItem value="tech_hardware" className="cursor-pointer hover:bg-indigo-50">Hardware</SelectItem>
                  <SelectItem value="manufacturing" className="cursor-pointer hover:bg-indigo-50">Manufacturing</SelectItem>
                  <SelectItem value="retail" className="cursor-pointer hover:bg-indigo-50">Retail</SelectItem>
                  <SelectItem value="healthcare" className="cursor-pointer hover:bg-indigo-50">Healthcare</SelectItem>
                  <SelectItem value="financial" className="cursor-pointer hover:bg-indigo-50">Financial Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1 text-indigo-700 flex items-center">
                <GlobeIcon className="w-4 h-4 mr-1.5" />
                Region
              </label>
              <Select defaultValue="eu">
                <SelectTrigger className="w-[200px] border-indigo-200 bg-white shadow-sm hover:border-indigo-300 transition-colors">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-white border-indigo-100">
                  <SelectItem value="eu" className="cursor-pointer hover:bg-indigo-50">European Union</SelectItem>
                  <SelectItem value="uk" className="cursor-pointer hover:bg-indigo-50">United Kingdom</SelectItem>
                  <SelectItem value="dach" className="cursor-pointer hover:bg-indigo-50">DACH</SelectItem>
                  <SelectItem value="benelux" className="cursor-pointer hover:bg-indigo-50">Benelux</SelectItem>
                  <SelectItem value="nordic" className="cursor-pointer hover:bg-indigo-50">Nordic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-end flex-wrap gap-3">
            <div className="flex items-center">
              <Badge variant={isRealTimeActive ? "default" : "outline"} 
                className={`mr-2 ${isRealTimeActive ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : ''}`}>
                {isRealTimeActive ? (
                  <span className="flex items-center">
                    <span className="h-2 w-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
                    LIVE
                  </span>
                ) : 'Disabled'}
              </Badge>
              <Button 
                variant={isRealTimeActive ? "default" : "outline"} 
                size="sm" 
                onClick={toggleRealTime}
                className={`${isRealTimeActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : ''} transition-colors duration-200`}
              >
                {isRealTimeActive ? 'Disable' : 'Enable'} Real-time
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading || isRealTimeActive}
              className="border-indigo-200 transition-colors duration-200"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <div className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 shadow-sm">
              <span className="font-medium">Last updated:</span> {formattedLastUpdated}
            </div>
          </div>
        </div>
      </AnimatedElement>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatedElement delay={0.2}>
          <Card className="hover:shadow-md border-indigo-100 hover:border-indigo-300 transition-all duration-300 cursor-pointer no-hover-movement">
            <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-green-50 border-b border-indigo-100">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                  Revenue Growth
                </span>
                <Badge variant="outline" className="bg-white text-green-600 border-green-200">Growing</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueGrowthData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="industry" stroke="#8884d8" name="Industry Avg" />
                    <Line type="monotone" dataKey="company" stroke="#82ca9d" name="Your Company" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
        
        <AnimatedElement delay={0.25}>
          <Card className="hover:shadow-md border-indigo-100 hover:border-indigo-300 transition-all duration-300 cursor-pointer no-hover-movement">
            <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-blue-500" />
                  Profit Margin by Sector
                </span>
                <Badge variant="outline" className="bg-white text-blue-600 border-blue-200">Comparative</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={profitMarginData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {profitMarginData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-center mt-2 text-gray-500">
                Showing average profit margins across industries
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
        
        <AnimatedElement delay={0.3}>
          <Card className="hover:shadow-md border-indigo-100 hover:border-indigo-300 transition-all duration-300 cursor-pointer no-hover-movement">
            <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-amber-50 border-b border-indigo-100">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                  Customer Metrics
                </span>
                <Badge variant="outline" className="bg-white text-amber-600 border-amber-200">Competitive</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customersData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="company" fill="#82ca9d" name="Your Company" />
                    <Bar dataKey="industry" fill="#8884d8" name="Industry Avg" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
      </div>
      
      <AnimatedElement delay={0.35}>
        <Card className="mb-6 border-indigo-100 no-hover-movement">
          <CardHeader className="border-b border-indigo-50 bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardTitle className="text-lg font-medium text-indigo-800 flex items-center">
              <Layers className="h-5 w-5 mr-2 text-indigo-600" />
              Benchmark Categories
            </CardTitle>
            <CardDescription className="text-indigo-700">
              Compare your business against industry leaders across key metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4 bg-indigo-50 h-12 p-1 rounded-md">
                <TabsTrigger 
                  value="key_metrics" 
                  className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm data-[state=active]:font-medium px-4 h-full rounded-md transition-all hover:bg-indigo-100 cursor-pointer"
                  onClick={() => setActiveTab("key_metrics")}
                >
                  Key Metrics
                </TabsTrigger>
                <TabsTrigger 
                  value="financial" 
                  className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm data-[state=active]:font-medium px-4 h-full rounded-md transition-all hover:bg-indigo-100 cursor-pointer"
                  onClick={() => setActiveTab("financial")}
                >
                  Financial
                </TabsTrigger>
                <TabsTrigger 
                  value="operational" 
                  className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm data-[state=active]:font-medium px-4 h-full rounded-md transition-all hover:bg-indigo-100 cursor-pointer"
                  onClick={() => setActiveTab("operational")}
                >
                  Operational
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="key_metrics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <BenchmarkDisplay 
                    industryId={selectedIndustry}
                    companyMetrics={{ revenueGrowth: 22 }}
                    metrics={['revenueGrowth']}
                    onRealTimeStatus={setIsRealTimeActive}
                  />
                  
                  <BenchmarkDisplay 
                    industryId={selectedIndustry}
                    companyMetrics={{ profitMargin: 18 }}
                    metrics={['profitMargin']}
                    onRealTimeStatus={setIsRealTimeActive}
                  />
                  
                  <BenchmarkDisplay 
                    industryId={selectedIndustry}
                    companyMetrics={{ customerRetention: 82 }}
                    metrics={['customerRetention']}
                    onRealTimeStatus={setIsRealTimeActive}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <BenchmarkDisplay 
                    industryId={selectedIndustry}
                    companyMetrics={{ ebitdaMargin: 24 }}
                    metrics={['ebitdaMargin']}
                    onRealTimeStatus={setIsRealTimeActive}
                  />
                  
                  <BenchmarkDisplay 
                    industryId={selectedIndustry}
                    companyMetrics={{ cashFlow: 16 }}
                    metrics={['cashFlow']}
                    onRealTimeStatus={setIsRealTimeActive}
                  />
                  
                  <BenchmarkDisplay 
                    industryId={selectedIndustry}
                    companyMetrics={{ debtToEquity: 0.8 }}
                    metrics={['debtToEquity']}
                    onRealTimeStatus={setIsRealTimeActive}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="operational" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <BenchmarkDisplay 
                    industryId={selectedIndustry}
                    companyMetrics={{ employeeProductivity: 210000 }}
                    metrics={['employeeProductivity']}
                    onRealTimeStatus={setIsRealTimeActive}
                  />
                  
                  <BenchmarkDisplay 
                    industryId={selectedIndustry}
                    companyMetrics={{ customerAcquisitionCost: 430 }}
                    metrics={['customerAcquisitionCost']}
                    onRealTimeStatus={setIsRealTimeActive}
                  />
                  
                  <BenchmarkDisplay 
                    industryId={selectedIndustry}
                    companyMetrics={{ techStackModernity: 72 }}
                    metrics={['techStackModernity']}
                    onRealTimeStatus={setIsRealTimeActive}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AnimatedElement>
      
      <AnimatedElement delay={0.4} className="mt-6 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg border border-indigo-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer fixed-element no-hover-movement">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <Badge variant="outline" className="mb-2 w-fit border-indigo-200 bg-white text-indigo-700">Data sources</Badge>
            <span className="text-sm text-gray-700">European Central Bank, Eurostat, Industry associations, Financial reports</span>
          </div>
          <div className="flex flex-col">
            <Badge variant="outline" className="mb-2 w-fit border-indigo-200 bg-white text-indigo-700">Coverage</Badge>
            <span className="text-sm text-gray-700">Data covers 27 EU countries plus UK, Switzerland, and Norway</span>
          </div>
          <div className="flex flex-col">
            <Badge variant="outline" className="mb-2 w-fit border-indigo-200 bg-white text-indigo-700">Update frequency</Badge>
            <span className="text-sm text-gray-700">Daily aggregates with real-time market indicators</span>
          </div>
          <div className="flex flex-col">
            <Badge variant="outline" className="mb-2 w-fit border-indigo-200 bg-white text-indigo-700">Metrics</Badge>
            <span className="text-sm text-gray-700">30+ financial, operational, and market performance indicators</span>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-center text-indigo-600 font-medium hover:underline">
          Click to learn more about our data methodology
        </div>
      </AnimatedElement>
    </div>
  );
}
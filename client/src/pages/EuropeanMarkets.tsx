import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AnimatedElement, AnimatedCounter, RevealOnScroll } from "@/components/ui/animated-element";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertCircle, TrendingUp, Briefcase, Landmark, Cpu, Leaf, Pill, MapPin, EuroIcon } from "lucide-react";

export default function EuropeanMarkets() {
  const [activeTab, setActiveTab] = useState("overview");

  // Data for charts
  const gdpData = [
    { name: 'Germany', value: 4.26 },
    { name: 'France', value: 3.05 },
    { name: 'Italy', value: 2.16 },
    { name: 'Spain', value: 1.45 },
    { name: 'Netherlands', value: 1.01 },
  ];

  const roiData = [
    { name: 'Technology', roi: 18.7 },
    { name: 'Renewable Energy', roi: 15.3 },
    { name: 'Pharmaceuticals', roi: 14.1 },
    { name: 'Digital Services', roi: 16.5 },
    { name: 'Manufacturing', roi: 8.3 },
    { name: 'Retail', roi: 6.8 },
  ];

  const investmentHotspots = [
    { region: 'Nordics', focus: 'Tech Innovation', growth: 14.2 },
    { region: 'Benelux', focus: 'Digital Services', growth: 12.8 },
    { region: 'Southern Europe', focus: 'Renewables', growth: 11.3 },
    { region: 'Central Europe', focus: 'Manufacturing', growth: 7.6 },
    { region: 'Eastern Europe', focus: 'IT Services', growth: 10.9 },
  ];

  // Economic growth projections data
  const projectionData = [
    { year: '2024', growth: 0.7 },
    { year: '2025', growth: 0.9 },
    { year: '2026', growth: 1.5 },
    { year: '2027', growth: 1.9 },
  ];

  // Government initiative funding data
  const fundingData = [
    { name: 'Digital Europe', value: 7.5 },
    { name: 'SME Fund', value: 4.2 },
    { name: 'Green Deal', value: 6.8 },
    { name: 'Innovation Fund', value: 3.5 },
    { name: 'Regional Development', value: 5.1 },
  ];

  // COLORS
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800 mb-3">
            European Markets
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore Europe's diverse and vibrant markets, each offering unique opportunities for SMBs looking to expand, invest, or exit.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-10">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
            <TabsTrigger value="overview">Market Overview</TabsTrigger>
            <TabsTrigger value="sectors">Key Sectors</TabsTrigger>
            <TabsTrigger value="funding">Funding & Support</TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="overflow-hidden shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-blue-700">
                    <EuroIcon className="mr-2 h-5 w-5" />
                    Economic Outlook 2025-2026
                  </CardTitle>
                  <CardDescription>
                    Projected growth and market trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    The European Commission forecasts a GDP growth of 0.9% in 2025, with an acceleration to 1.5% in 2026, 
                    driven by increased consumption and a recovery in investment. Despite this modest growth, specific sectors 
                    are poised for substantial returns.
                  </p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={projectionData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="growth" fill="#4f46e5" name="GDP Growth %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Source: European Commission Economic Forecast 2025
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-blue-700">
                    <Landmark className="mr-2 h-5 w-5" />
                    Highest GDP Countries
                  </CardTitle>
                  <CardDescription>
                    Top 5 economies by GDP (in trillion EUR)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={gdpData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip formatter={(value) => [`€${value} trillion`, 'GDP']} />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    These markets represent immense potential for SMBs seeking growth, investments, or strategic exits. 
                    Understanding local opportunities can significantly enhance your business valuation.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <Card className="overflow-hidden shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-blue-700">
                    <MapPin className="mr-2 h-5 w-5" />
                    European Investment Hotspots
                  </CardTitle>
                  <CardDescription>
                    Regional opportunities for strategic expansion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {investmentHotspots.map((hotspot, index) => (
                      <RevealOnScroll key={index} delay={index * 0.1}>
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 transition-all hover:shadow-md hover:border-blue-100">
                          <h3 className="font-semibold text-lg text-gray-800 mb-1">{hotspot.region}</h3>
                          <p className="text-sm text-gray-600 mb-2">Focus: {hotspot.focus}</p>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-green-600 font-medium">{hotspot.growth}% Growth</span>
                          </div>
                        </div>
                      </RevealOnScroll>
                    ))}
                  </div>
                  <div className="mt-6 bg-blue-50 p-4 rounded-md">
                    <h3 className="font-semibold text-blue-800 mb-2">Regional Highlights</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                      <li><span className="font-medium">Nordics:</span> Known for tech innovation and a supportive startup ecosystem, countries like Sweden and Finland offer fertile ground for technology-focused SMBs.</li>
                      <li><span className="font-medium">Benelux:</span> Belgium, Netherlands, and Luxembourg provide robust digital infrastructures and a strategic location for digital services companies.</li>
                      <li><span className="font-medium">Southern Europe:</span> Countries such as Spain and Italy are investing heavily in renewable energy, aligning with the EU's sustainability goals.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Average SMB ROI Growth</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 mb-4">
                    Across leading EU economies, small and medium businesses are seeing annual returns on investment growth between:
                  </p>
                  <div className="text-center">
                    <AnimatedCounter 
                      value={7} 
                      duration={1} 
                      className="text-5xl font-bold text-blue-600"
                      formatter={(val) => `${val}%`}
                    />
                    <span className="text-4xl font-light mx-3 text-gray-400">to</span>
                    <AnimatedCounter 
                      value={12} 
                      duration={1.5} 
                      className="text-5xl font-bold text-indigo-600"
                      formatter={(val) => `${val}%`}
                    />
                  </div>
                  <p className="text-center text-gray-500 mt-2">Annual ROI Growth</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Growth Factors</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      </div>
                      Digital transformation accelerating business efficiency
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      </div>
                      EU regulatory simplification improving operations
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      </div>
                      Access to expanded financing options and government support
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      </div>
                      Emerging technologies creating new business opportunities
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start mb-4">
                <AlertCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Economic Challenges</h3>
                  <p className="text-sm text-gray-600">
                    Despite growth opportunities, European SMBs face several challenges in 2025, including inflation pressures, talent shortages, 
                    and geopolitical uncertainties. Successful businesses will need to navigate these obstacles through strategic planning and adaptation.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Key Sectors Tab Content */}
          <TabsContent value="sectors" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="overflow-hidden shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-blue-700">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Industries with Highest ROI
                  </CardTitle>
                  <CardDescription>
                    Top performing sectors by return on investment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={roiData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Average ROI']} />
                        <Bar dataKey="roi" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-blue-700">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Sector Performance
                  </CardTitle>
                  <CardDescription>
                    Proportion of high-growth sectors in European economy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={400} height={400}>
                        <Pie
                          data={roiData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="roi"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {roiData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Sector ROI']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <AnimatedElement>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm h-full">
                  <div className="mb-4 flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Cpu className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-blue-800 mb-3">Technology</h3>
                  <p className="text-sm text-gray-700">
                    The rapid advancement in digital technologies continues to create opportunities for SMBs, particularly in areas like 
                    artificial intelligence, cybersecurity, and high-performance computing. Tech companies are seeing ROI averages of 15-20%.
                  </p>
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Key Growth Areas:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Artificial Intelligence & Machine Learning</li>
                      <li>Cybersecurity Solutions</li>
                      <li>Cloud Infrastructure</li>
                      <li>Software-as-a-Service</li>
                    </ul>
                  </div>
                </div>
              </AnimatedElement>

              <AnimatedElement delay={0.1}>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm h-full">
                  <div className="mb-4 flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-green-800 mb-3">Renewable Energy</h3>
                  <p className="text-sm text-gray-700">
                    The EU's commitment to the Green Deal necessitates significant investments in sustainable energy solutions, presenting 
                    opportunities for SMBs in the renewable energy sector. Growth is projected at 13-18% annually through 2030.
                  </p>
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Key Growth Areas:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Solar Power Technologies</li>
                      <li>Wind Energy Solutions</li>
                      <li>Energy Storage Systems</li>
                      <li>Green Building Technologies</li>
                    </ul>
                  </div>
                </div>
              </AnimatedElement>

              <AnimatedElement delay={0.2}>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-sm h-full">
                  <div className="mb-4 flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <Pill className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-purple-800 mb-3">Pharmaceuticals & Healthcare</h3>
                  <p className="text-sm text-gray-700">
                    An aging population and increased focus on healthcare innovation make this sector ripe for investment and expansion. 
                    Healthcare technologies are seeing particularly strong ROI of 12-16% annually.
                  </p>
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Key Growth Areas:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Digital Health Solutions</li>
                      <li>Biotechnology</li>
                      <li>Medical Devices</li>
                      <li>Healthcare IT Systems</li>
                    </ul>
                  </div>
                </div>
              </AnimatedElement>
            </div>

            <Card className="shadow-md overflow-hidden mb-8">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 pb-4">
                <CardTitle className="text-xl text-blue-700">Emerging Trends</CardTitle>
                <CardDescription>Key factors shaping European markets in 2025</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Sustainability and Green Investments</h4>
                      <p className="text-sm text-gray-600">
                        There's a strong push towards sustainability, with substantial investments required to meet the EU's climate goals. 
                        Businesses that align with sustainability objectives can access specialized funding and market advantages.
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
                      <Cpu className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Digital Transformation</h4>
                      <p className="text-sm text-gray-600">
                        The accelerated adoption of digital technologies across sectors is creating new business models and opportunities. 
                        Companies that embrace digital transformation are seeing productivity gains of 15-25% and improved valuations.
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-100 rounded-full p-2 mr-4">
                      <Landmark className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Regulatory Simplification</h4>
                      <p className="text-sm text-gray-600">
                        Efforts are underway to simplify regulations, making it easier for SMBs to operate and expand. The European 
                        Commission's "Better Regulation" agenda aims to reduce administrative burden by 25% by 2027.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funding & Support Tab Content */}
          <TabsContent value="funding" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="overflow-hidden shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-xl text-blue-700">
                    <EuroIcon className="mr-2 h-5 w-5" />
                    EU Funding Initiatives
                  </CardTitle>
                  <CardDescription>
                    Major funding programs for SMBs (in billion EUR)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={400} height={400}>
                        <Pie
                          data={fundingData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, value }) => `${name}: €${value}B`}
                        >
                          {fundingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`€${value} billion`, 'Funding']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden shadow-md">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl text-blue-700">Governmental Support</CardTitle>
                  <CardDescription>Key initiatives for SMB growth</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    <div className="p-4 hover:bg-blue-50 transition-colors">
                      <h3 className="font-medium text-gray-900">SME Fund 2025</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Initiative by the European Commission, implemented by the European Union Intellectual Property Office (EUIPO), 
                        providing financial support to SMEs established in the EU to protect their intellectual property rights.
                      </p>
                    </div>
                    <div className="p-4 hover:bg-blue-50 transition-colors">
                      <h3 className="font-medium text-gray-900">SME Access to Finance Initiative</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        A joint program by the European Investment Bank (EIB) and the EU aims to enhance access to finance for SMBs, 
                        particularly in neighboring countries and Sub-Saharan Africa.
                      </p>
                    </div>
                    <div className="p-4 hover:bg-blue-50 transition-colors">
                      <h3 className="font-medium text-gray-900">Digital Europe Programme</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Launched in 2021, this funding instrument focuses on development and innovation in digital technologies, 
                        aligning with strategic areas such as cybersecurity and artificial intelligence.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <Card className="shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <CardTitle className="text-xl text-blue-700">How to Access EU Funding</CardTitle>
                  <CardDescription>Steps for successful grant and funding applications</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <span className="text-blue-700 font-bold">1</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Identify Relevant Programs</h3>
                      <p className="text-sm text-gray-600">
                        Research which EU programs align with your business objectives. Use the Enterprise Europe Network 
                        and European Investment Fund portals to find opportunities.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <span className="text-blue-700 font-bold">2</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Prepare Documentation</h3>
                      <p className="text-sm text-gray-600">
                        Develop a strong business plan and gather required documentation. Ensure your financial statements are 
                        up-to-date and your project aligns with EU priorities.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <span className="text-blue-700 font-bold">3</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">Submit Application</h3>
                      <p className="text-sm text-gray-600">
                        Follow application procedures carefully and consider partnering with other organizations when beneficial. 
                        Submit before deadlines and be prepared for a detailed review process.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Maximizing Support for Your Business</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">Leverage Local Resources</h3>
                  <p className="text-sm text-gray-600">
                    Beyond EU-level funding, many member states offer additional support programs for SMBs. Contact your local 
                    business development agencies and chambers of commerce to identify country-specific opportunities.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">Consider Private-Public Partnerships</h3>
                  <p className="text-sm text-gray-600">
                    Many EU funding initiatives encourage collaboration between private businesses and public institutions. 
                    These partnerships can open doors to larger funding pools and valuable knowledge exchange.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">Align with EU Strategic Priorities</h3>
                  <p className="text-sm text-gray-600">
                    Funding applications that align with key EU priorities like digital transformation, sustainability, and 
                    innovation have higher success rates. Frame your business objectives within these broader European goals.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">European Market Opportunities Summary</h2>
          <p className="text-gray-700 mb-6">
            While the European market in 2025 presents certain economic challenges, targeted opportunities exist for SMBs, 
            particularly in technology, renewable energy, and healthcare sectors. Leveraging governmental support and aligning 
            with emerging trends can enhance business valuation and deal potential.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-blue-700 mb-2">Market Strengths</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                  Strong digital infrastructure across most regions
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                  Significant government and EU-level funding availability
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                  Highly educated workforce in technological sectors
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                  Strong regulatory framework providing business stability
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-blue-700 mb-2">Strategic Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <EuroIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  Focus on high-growth sectors like technology, healthcare, and renewable energy
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <EuroIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  Leverage region-specific advantages in your expansion strategy
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <EuroIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  Align business initiatives with EU sustainability and digital transformation goals
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <EuroIcon className="h-3 w-3 text-blue-600" />
                  </div>
                  Explore both EU-level and national funding opportunities to fuel growth
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Source: European Central Bank, European Commission, European Investment Bank, Financial Times
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
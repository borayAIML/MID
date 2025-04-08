import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Sprout, 
  Cpu, 
  Heart, 
  ShoppingBag, 
  Leaf, 
  Globe, 
  Zap, 
  Building, 
  ArrowRight, 
  BarChart3,
  BadgeEuro,
  LineChart,
  ArrowUpRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ParallaxSection, FloatingElement } from '@/components/ui/parallax-effect';
import { Badge } from '@/components/ui/badge';
import { MAFactCard } from '@/components/ui/manda-facts';

export default function IndustryInsights() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-16 md:py-24 overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-300">
                Market Intelligence
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  European SMB Market Insights
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                Strategic intelligence to position your business for optimal growth, 
                valuation, and successful exits in Europe's evolving marketplace.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 hover:shadow-xl">
                  <BarChart3 size={18} />
                  <span>Get Your Valuation</span>
                </Button>
                
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg flex items-center gap-2">
                  <LineChart size={18} />
                  <span>Download Market Report</span>
                </Button>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-6xl mx-auto mt-12 px-4"
          >
            <div className="relative h-20 md:h-32">
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent top-1/2"></div>
              
              <div className="absolute inset-0 flex items-center justify-around">
                <FloatingElement className="flex flex-col items-center bg-white p-3 rounded-full shadow-lg">
                  <Sprout className="h-6 w-6 text-green-500" />
                  <span className="text-xs font-medium mt-2 text-green-800 whitespace-nowrap">Renewable Energy</span>
                </FloatingElement>
                
                <FloatingElement className="flex flex-col items-center bg-white p-3 rounded-full shadow-lg" delay={10}>
                  <Cpu className="h-6 w-6 text-indigo-500" />
                  <span className="text-xs font-medium mt-2 text-indigo-800 whitespace-nowrap">Technology</span>
                </FloatingElement>
                
                <FloatingElement className="flex flex-col items-center bg-white p-3 rounded-full shadow-lg" delay={5}>
                  <Heart className="h-6 w-6 text-red-500" />
                  <span className="text-xs font-medium mt-2 text-red-800 whitespace-nowrap">Digital Healthcare</span>
                </FloatingElement>
                
                <FloatingElement className="flex flex-col items-center bg-white p-3 rounded-full shadow-lg" delay={8}>
                  <Leaf className="h-6 w-6 text-green-600" />
                  <span className="text-xs font-medium mt-2 text-green-800 whitespace-nowrap">Sustainable Agriculture</span>
                </FloatingElement>
                
                <FloatingElement className="flex flex-col items-center bg-white p-3 rounded-full shadow-lg" delay={12}>
                  <ShoppingBag className="h-6 w-6 text-purple-500" />
                  <span className="text-xs font-medium mt-2 text-purple-800 whitespace-nowrap">E-Commerce</span>
                </FloatingElement>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <ParallaxSection speed={0.1} direction="up" className="mb-12">
                <p className="lead text-xl text-gray-700 font-medium">
                  The European SMB market is dynamically evolving. Over the next five years, industries such as technology, 
                  renewable energy, digital healthcare, sustainable agriculture, and e-commerce are set to thrive dramatically. 
                </p>
                
                <p className="text-gray-700 mt-6">
                  Driven by EU initiatives like the Green Deal, digitalization funding, and economic resilience plans, 
                  SMBs in these sectors can expect significant growth opportunities.
                </p>
              </ParallaxSection>
              
              {/* Key Trends */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 relative">
                Key Upcoming Trends
                <span className="absolute -right-4 -top-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <motion.div 
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-sm"
                >
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-lg text-white shadow-md mr-4">
                      <Leaf className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Sustainability Push</h3>
                      <p className="text-gray-700">
                        Strong push towards sustainability and green investments across all sectors, 
                        with favorable regulatory environment and consumer demand.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm"
                >
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-lg text-white shadow-md mr-4">
                      <Cpu className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Digital Transformation</h3>
                      <p className="text-gray-700">
                        Accelerated digital transformation across all sectors, creating opportunities for 
                        tech-enabled businesses and digital solution providers.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-100 shadow-sm"
                >
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-3 rounded-lg text-white shadow-md mr-4">
                      <BadgeEuro className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">EU Funding Boost</h3>
                      <p className="text-gray-700">
                        Increased funding and support from the EU for SMB innovation, particularly
                        for businesses addressing key European priorities.
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl p-6 border border-purple-100 shadow-sm"
                >
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-purple-400 to-fuchsia-500 p-3 rounded-lg text-white shadow-md mr-4">
                      <Building className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Market Consolidation</h3>
                      <p className="text-gray-700">
                        Significant consolidation opportunities in fragmented markets as larger companies
                        seek strategic acquisitions to gain market share.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Industry Growth Chart */}
            <div className="mt-16 bg-white rounded-xl p-8 border border-gray-200 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Industry Growth Projections (2025-2030)</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Cpu className="h-4 w-4 mr-1 text-indigo-500" /> Technology
                    </span>
                    <span className="text-sm font-semibold text-indigo-600">+28.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Sprout className="h-4 w-4 mr-1 text-green-500" /> Renewable Energy
                    </span>
                    <span className="text-sm font-semibold text-green-600">+32.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-red-500" /> Digital Healthcare
                    </span>
                    <span className="text-sm font-semibold text-red-600">+24.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Leaf className="h-4 w-4 mr-1 text-emerald-500" /> Sustainable Agriculture
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">+18.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-1 text-purple-500" /> E-Commerce
                    </span>
                    <span className="text-sm font-semibold text-purple-600">+21.6%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500 italic text-right">
                Source: European Commission Digital Economy and Society Index (DESI), 2025 Projections
              </div>
            </div>
            
            {/* EU Initiatives */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key EU Initiatives Driving Growth</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow duration-300">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <Globe className="h-5 w-5 text-green-500" />
                    European Green Deal
                  </h4>
                  <p className="text-gray-700 text-sm">
                    €1 trillion investment to make Europe climate-neutral by 2050, creating massive
                    opportunities for sustainable businesses.
                  </p>
                  <div className="mt-4 text-green-600 text-sm font-medium flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>30% annual growth in green tech funding</span>
                  </div>
                </Card>
                
                <Card className="p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-300">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Digital Europe Program
                  </h4>
                  <p className="text-gray-700 text-sm">
                    €7.5 billion fund dedicated to deploying digital technologies and
                    accelerating digital transformation of SMBs.
                  </p>
                  <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>25% increase in digital adoption</span>
                  </div>
                </Card>
                
                <Card className="p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow duration-300">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <Building className="h-5 w-5 text-purple-500" />
                    EU Recovery & Resilience Facility
                  </h4>
                  <p className="text-gray-700 text-sm">
                    €672.5 billion in loans and grants to support reforms and investments by member states,
                    with significant allocation to SMBs.
                  </p>
                  <div className="mt-4 text-purple-600 text-sm font-medium flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>€125B earmarked for SMB growth</span>
                  </div>
                </Card>
              </div>
            </div>
            
            {/* M&A Facts */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">European M&A Insights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MAFactCard 
                  fact={{
                    text: "Mid-market M&A activity in Europe reached €240 billion in transaction value for 2024, with technology and renewable energy sectors leading the way.",
                    category: "europe",
                    icon: TrendingUp,
                    highlight: "€240 billion"
                  }}
                  showSource={true}
                />
                
                <MAFactCard 
                  fact={{
                    text: "Businesses with clear ESG (Environmental, Social, Governance) strategies are commanding 12-15% higher valuations in European acquisition markets.",
                    category: "valuation",
                    icon: Leaf,
                    highlight: "12-15% higher valuations"
                  }}
                  showSource={true}
                />
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Stay informed and position your business strategically</h3>
              <p className="mb-6 text-blue-100">
                Leverage these trends to position your business optimally for future growth or a successful exit
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
              >
                Get Your Free Valuation
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
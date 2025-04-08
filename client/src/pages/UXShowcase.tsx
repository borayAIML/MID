import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AccessibilityChecker, SimpleColorChecker } from '@/components/ui/accessibility-checker';
import GuideShowcase from '@/components/showcases/GuideShowcase';
import RealTimeBenchmarkShowcase from '@/components/showcases/RealTimeBenchmarkShowcase';
import { Separator } from '@/components/ui/separator';
import { ConfettiAnimation } from '@/components/ui/confetti-animation';
import { BenchmarkDisplay } from '@/components/ui/benchmark-display';
import { ParallaxSection, FloatingElement } from '@/components/ui/parallax-effect';
import { MoodTheme, ThemeSelector } from '@/components/ui/theme-selector';
import { CheckCircle2, Palette, Eye, Sparkles, Zap, ArrowRight, Lightbulb } from 'lucide-react';

export default function UXShowcase() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedTab, setSelectedTab] = useState('accessibility');
  
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };
  
  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <header className="text-center space-y-4 mb-12">
        <motion.h1 
          className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          UX & Accessibility Showcase
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore our interactive tools designed to enhance user experience and make your financial data visualization more accessible and engaging.
        </motion.p>
      </header>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="accessibility" className="flex flex-col items-center p-4 space-y-1">
              <Eye className="h-5 w-5" />
              <span className="text-xs md:text-sm">Accessibility</span>
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex flex-col items-center p-4 space-y-1">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs md:text-sm">Interactions</span>
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex flex-col items-center p-4 space-y-1">
              <Zap className="h-5 w-5" />
              <span className="text-xs md:text-sm">Visualization</span>
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex flex-col items-center p-4 space-y-1">
              <Palette className="h-5 w-5" />
              <span className="text-xs md:text-sm">Themes</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="accessibility" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Color Accessibility Tools</h2>
              <p className="text-gray-600">
                Ensure your color choices meet WCAG accessibility standards for all users.
                Our tools help you check contrast ratios and suggest better alternatives.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {/* Main Accessibility Checker */}
              <div className="rounded-lg shadow-lg overflow-hidden">
                <AccessibilityChecker />
              </div>
              
              {/* Quick Facts about Accessibility */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full inline-flex items-center justify-center mr-2">
                        <CheckCircle2 className="h-5 w-5" />
                      </span>
                      Why Accessibility Matters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Around 1 in 12 men and 1 in 200 women have some form of color vision deficiency. 
                      Good contrast ensures everyone can use your financial tools clearly.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full inline-flex items-center justify-center mr-2">
                        <Lightbulb className="h-5 w-5" />
                      </span>
                      WCAG Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      AA standards require a contrast ratio of at least 4.5:1 for normal text 
                      and 3:1 for large text. AAA requires 7:1 and 4.5:1 respectively.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full inline-flex items-center justify-center mr-2">
                        <Palette className="h-5 w-5" />
                      </span>
                      Financial Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      For financial dashboards, clear contrast helps prevent costly mistakes
                      by ensuring data visualization is accurate and understandable for all users.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="interactions" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Interactive Elements</h2>
              <p className="text-gray-600">
                Explore our interactive UI elements designed to create engaging and intuitive experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Celebration Effects</CardTitle>
                  <CardDescription>Micro-interactions to celebrate achievements</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Button 
                    className="mb-4"
                    onClick={triggerConfetti}
                  >
                    Trigger Celebration
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    Used when users complete important milestones in their financial journey.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Contextual Guides</CardTitle>
                  <CardDescription>Character-driven guidance system</CardDescription>
                </CardHeader>
                <CardContent>
                  <GuideShowcase />
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2 overflow-hidden">
                <CardHeader>
                  <CardTitle>Parallax & Floating Elements</CardTitle>
                  <CardDescription>Subtle motion effects to create depth and draw attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <ParallaxSection speed={0.5} direction="up" className="h-40 p-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <div className="relative h-full">
                      <h3 className="text-xl font-bold mb-2">Parallax Effect</h3>
                      <p>Scrolls at a different rate to create depth</p>
                      
                      <FloatingElement className="absolute bottom-0 right-0">
                        <div className="bg-white text-blue-500 p-3 rounded-lg shadow-lg font-medium">
                          I'm floating! 🎈
                        </div>
                      </FloatingElement>
                    </div>
                  </ParallaxSection>
                </CardContent>
              </Card>
            </div>
            
            {showConfetti && <ConfettiAnimation pieces={100} duration={3000} />}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="visualization" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Visualization</h2>
              <p className="text-gray-600">
                Interactive data visualization tools that make complex financial information more understandable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Industry Benchmarks</CardTitle>
                  <CardDescription>Live comparisons with industry standards</CardDescription>
                </CardHeader>
                <CardContent>
                  <RealTimeBenchmarkShowcase />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Visualizing company performance against benchmarks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Revenue Growth</h3>
                      <BenchmarkDisplay 
                        industryId="tech_saas" 
                        companyMetrics={{ revenueGrowth: 23 }}
                        metrics={['revenueGrowth']}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Profit Margin</h3>
                      <BenchmarkDisplay 
                        industryId="manufacturing" 
                        companyMetrics={{ profitMargin: 15 }}
                        metrics={['profitMargin']}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Customer Retention</h3>
                      <BenchmarkDisplay 
                        industryId="retail" 
                        companyMetrics={{ customerRetention: 82 }}
                        metrics={['customerRetention']}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="themes" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Mood-Based Theming</h2>
              <p className="text-gray-600">
                Our mood-based theming system adapts colors to match your financial goals and emotional state, 
                enhancing psychological engagement while maintaining accessibility.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Selector</CardTitle>
                  <CardDescription>Choose a theme that matches your mood</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ThemeSelector />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Psychology</CardTitle>
                    <CardDescription>How colors influence financial decision-making</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <span className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Blues</span>: Promote trust and security, ideal for banking interfaces and long-term planning
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Greens</span>: Associated with growth and prosperity, effective for investment platforms
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 bg-purple-500 rounded-full flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Purples</span>: Convey luxury and ambition, suitable for premium financial services
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 bg-amber-500 rounded-full flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Amber/Gold</span>: Represents caution and value, good for risk management sections
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility Integration</CardTitle>
                    <CardDescription>All mood themes maintain WCAG compliance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Our theming system automatically checks all color combinations against WCAG contrast standards,
                      ensuring that even emotionally-resonant designs remain accessible to all users.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <SimpleColorChecker />
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => setSelectedTab('accessibility')}>
                        <span>Full Accessibility Checker</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-12" />
      
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Improving User Experience Through Accessibility</h2>
        <p className="text-gray-600 mb-8">
          Our commitment to accessibility isn't just about compliance—it's about creating 
          financial tools that work better for everyone, regardless of ability or context.
        </p>
        
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => window.location.href = '/valuation-services'}
        >
          Explore Our Valuation Services
        </Button>
      </div>
    </div>
  );
}
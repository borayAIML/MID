import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/layout/Footer";
import { initializeMoodSystem, determineMood, getMoodColorScheme, applyMoodColorScheme, FinancialMood } from "@/lib/moodColorPalette";
import { 
  ChartLine, 
  UserSquare, 
  PieChart, 
  BarChart, 
  Rocket,
  Clock as ClockIcon,
  Info as InfoIcon,
  ChevronDown,
  DollarSign,
  Sparkles,
  Building2,
  Heart,
  BadgeCheck,
  TrendingUp,
  Globe
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

import LoadingMascot, { LoadingOverlay, MascotLoadingButton } from "@/components/ui/loading-mascot";

export default function LandingPage() {
  const [_, setLocation] = useLocation();
  const [currentMood, setCurrentMood] = useState<FinancialMood>("growth");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  
  // Initialize the mood-based color system on component mount
  useEffect(() => {
    initializeMoodSystem();
    const detectedMood = determineMood({
      goal: "expansion", 
      revenue: 500000, 
      yearsInBusiness: 5,
      targetGrowth: 0.15,
      riskTolerance: 0.5
    });
    setCurrentMood(detectedMood);
    applyMoodColorScheme(detectedMood);
  }, []);
  
  const handleStartValuation = () => {
    setIsLoading(true);
    // Show loading overlay with mascot animation
    setShowLoadingOverlay(true);
    
    // Apply delay to simulate processing and show the animation
    setTimeout(() => {
      setLocation("/onboarding");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Loading Overlay with animated mascot */}
      {showLoadingOverlay && (
        <LoadingOverlay 
          message="Preparing your business valuation dashboard..." 
          mascotMood="thinking"
        />
      )}
      
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    MANDA INSTITUTE
                  </span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  Get a real-time valuation for your business — <span className="relative">
                    <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 opacity-20 blur"></span>
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">instantly</span>
                  </span>.
                </h2>
                <p className="mt-6 text-lg text-gray-600 max-w-2xl">
                  Our AI-powered platform analyzes your business data and provides accurate, market-based valuation in minutes. No more guesswork or expensive consultants.
                </p>
                
                <div className="mt-8 flex items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 max-w-xs"
                  >
                    <Button 
                      onClick={handleStartValuation}
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white relative overflow-visible group transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-3"
                    >
                      <span className="absolute right-0 top-0 h-12 w-9 translate-x-6 -translate-y-6 transform rotate-45 bg-white opacity-10 group-hover:translate-x-0 group-hover:translate-y-0 duration-700"></span>
                      <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <span className="mr-2">Processing</span>
                            <span className="animate-spin mr-2">⏳</span>
                          </>
                        ) : (
                          <>
                            Start Free Valuation
                            <span className="ml-1 text-xs font-semibold bg-yellow-300 text-blue-800 rounded-full px-2 py-0.5 inline-flex items-center">5min</span>
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" 
                  alt="Business valuation dashboard" 
                  className="w-full rounded-lg shadow-xl" 
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Get your business valuation in 4 simple steps <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Takes only 5 minutes</span>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0">
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-bl-md">
                  Step 1
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <UserSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Enter Basic Info</h3>
              <p className="mt-2 text-gray-600">Tell us about your company and goals. <span className="text-blue-600">No credit card required</span>.</p>
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" /> 
                <span>Takes ~1 minute</span>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0">
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-bl-md">
                  Step 2
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Provide Business Data</h3>
              <p className="mt-2 text-gray-600">Share your financials and operational insights. <span className="text-blue-600">100% secure</span>.</p>
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" /> 
                <span>Takes ~2 minutes</span>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0">
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-bl-md">
                  Step 3
                </div>
              </div>
              <div className="absolute -top-3 -left-3">
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform rotate-[-30deg] bg-gradient-to-r from-purple-600 to-blue-600 rounded-sm">
                  Most Popular
                </span>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Get Your Valuation</h3>
              <p className="mt-2 text-gray-600">Receive an <span className="text-blue-600">instant AI-powered</span> valuation using 57+ data points.</p>
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" /> 
                <span>Takes ~1 minute</span>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0">
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-bl-md">
                  Step 4
                </div>
              </div>
              <div className="absolute -top-1 -right-1">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Improve Your Worth</h3>
              <p className="mt-2 text-gray-600">Get <span className="text-blue-600">personalized AI recommendations</span> to increase business value.</p>
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" /> 
                <span>Takes ~1 minute</span>
              </div>
            </Card>
          </div>
          
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-center mb-6">European M&A Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 shrink-0 mt-1">
                    <BarChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Did you know?</h4>
                    <p className="mt-1 text-sm text-gray-700">
                      <span className="font-medium text-blue-600">78% of business owners</span> underestimate their company's value by 15-30%. Our AI valuation has been proven to provide estimates within 7% of professional appraisals.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 shrink-0 mt-1">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">European Insight</h4>
                    <p className="mt-1 text-sm text-gray-700">
                      European M&A activity reached <span className="font-medium text-blue-600">€1.1 trillion</span> in 2023, with cross-border transactions accounting for 65% of total deal value.
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Source: European M&A Monitor</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 shrink-0 mt-1">
                    <PieChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Mid-Market Focus</h4>
                    <p className="mt-1 text-sm text-gray-700">
                      Mid-market deals (€15-250M) represent <span className="font-medium text-blue-600">68%</span> of all European acquisition volume but only 31% of total value.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 shrink-0 mt-1">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Technology Premium</h4>
                    <p className="mt-1 text-sm text-gray-700">
                      Technology sector valuations in Europe average <span className="font-medium text-blue-600">6.8x EBITDA</span>, 33% higher than traditional manufacturing companies at 5.1x.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 shrink-0 mt-1">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Due Diligence Time</h4>
                    <p className="mt-1 text-sm text-gray-700">
                      Due diligence periods for European acquisitions average <span className="font-medium text-blue-600">4-6 months</span>, compared to 2-3 months in North America.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="text-blue-600 shrink-0 mt-1">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">SaaS Valuation Trend</h4>
                    <p className="mt-1 text-sm text-gray-700">
                      EBITDA multiples for European SaaS companies increased by <span className="font-medium text-blue-600">2.3x</span> between 2019 and 2023, outpacing all other tech sectors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 relative inline-block">
              What Our Clients Say
              <span className="absolute -top-5 -right-5 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-yellow-300 shadow-sm animate-pulse">
                Verified Reviews
              </span>
            </h2>
            <p className="mt-2 text-gray-600">Join 2,500+ business owners who've discovered their company's true value</p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-50 p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-1">
                <div className="text-yellow-400 flex">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="ml-2 text-xs text-green-600 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-3">Posted 2 weeks ago</div>
              <p className="text-gray-600 mb-4 relative">
                <span className="text-3xl text-gray-200 absolute -top-2 -left-2">"</span>
                <span className="relative">The valuation tool provided insights that helped me negotiate a deal <strong className="text-green-600">30% higher</strong> than my initial expectations.</span>
                <span className="text-3xl text-gray-200 absolute -bottom-5 -right-2">"</span>
              </p>
              <div className="flex items-center mt-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">S</div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Sarah T.</div>
                  <div className="text-gray-500 text-sm">CEO, E-Commerce</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-50 p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-1">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <div className="ml-2 text-xs text-green-600 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-3">Posted 1 month ago</div>
              <p className="text-gray-600 mb-4 relative">
                <span className="text-3xl text-gray-200 absolute -top-2 -left-2">"</span>
                <span className="relative">The AI recommendations identified <strong className="text-blue-600">5 key areas</strong> where I could improve my business value before selling.</span>
                <span className="text-3xl text-gray-200 absolute -bottom-5 -right-2">"</span>
              </p>
              <div className="flex items-center mt-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Mark J.</div>
                  <div className="text-gray-500 text-sm">Founder, SaaS Company</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-50 p-6 border-t-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-1">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <div className="ml-2 text-xs text-green-600 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-1">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Verified
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-3">Posted 3 months ago</div>
              <p className="text-gray-600 mb-4 relative">
                <span className="text-3xl text-gray-200 absolute -top-2 -left-2">"</span>
                <span className="relative">Finally, a valuation tool that understands European markets! Got <strong className="text-purple-600">accurate benchmarks</strong> for our German operations.</span>
                <span className="text-3xl text-gray-200 absolute -bottom-5 -right-2">"</span>
              </p>
              <div className="flex items-center mt-6">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">L</div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Lisa K.</div>
                  <div className="text-gray-500 text-sm">CFO, Manufacturing</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to discover your business's true value?</h2>
            <p className="mt-4 text-lg text-blue-100">Join 2,500+ business owners who've transformed their understanding of their company's worth.</p>
            <div className="mt-8">
              <Button 
                onClick={handleStartValuation}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-visible"
                size="lg"
              >
                <span className="relative z-10">Get Started Free</span>
              </Button>
              <p className="mt-3 text-sm text-blue-200">No credit card required</p>
            </div>
          </div>
          
          {/* Footer Section */}
          <div className="mt-24 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12">
              <div>
                <h3 className="text-xl font-semibold mb-4 border-l-4 border-purple-500 pl-3">MANDA INSTITUTE</h3>
                <p className="text-sm text-blue-100 mb-4">
                  The leading platform for accurate business valuations, industry benchmarking, and AI-powered exit strategy planning.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 border-l-4 border-blue-500 pl-3">Company</h3>
                <ul className="space-y-2">
                  <li><a href="/about-us" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-blue-400 mr-2">•</span>About
                  </a></li>
                  <li><a href="/our-team" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-blue-400 mr-2">•</span>Our Team
                  </a></li>
                  <li><a href="/careers" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-blue-400 mr-2">•</span>Careers
                  </a></li>
                  <li><a href="/press" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-blue-400 mr-2">•</span>Press & Media
                  </a></li>
                  <li><a href="/contact" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-blue-400 mr-2">•</span>Contact
                  </a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 border-l-4 border-green-500 pl-3">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="/blog" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-green-400 mr-2">•</span>Blog
                  </a></li>
                  <li><a href="/research" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-green-400 mr-2">•</span>Research
                  </a></li>
                  <li><a href="/guides" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-green-400 mr-2">•</span>Valuation Guides
                  </a></li>
                  <li><a href="/webinars" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-green-400 mr-2">•</span>Webinars
                  </a></li>
                  <li><a href="/podcast" className="text-sm text-blue-100 hover:text-white transition-colors duration-200 flex items-center">
                    <span className="text-green-400 mr-2">•</span>Podcast
                  </a></li>
                </ul>
              </div>
            </div>
            
            {/* Industry Coverage Section - Collapsible */}
            <div className="mt-12 pt-12 border-t border-blue-800">
              <Accordion.Root type="single" collapsible className="w-full">
                <Accordion.Item value="industry-coverage" className="border-none">
                  <Accordion.Trigger className="flex w-full justify-between items-center mb-4 group bg-blue-900/30 p-3 rounded-md hover:bg-blue-800/40 transition-colors">
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-white">Industry Coverage</h3>
                    </div>
                    <ChevronDown className="h-5 w-5 text-blue-300 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                  </Accordion.Trigger>
                  
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 text-left mb-4 mt-4 p-4 bg-blue-950/20 rounded-md">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-blue-500 rounded mr-2"></div>
                          Private Equity & VC
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/industries/pe/growth" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Growth Equity</a></li>
                          <li><a href="/industries/pe/buyout" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Buyout Firms</a></li>
                          <li><a href="/industries/pe/early" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Early Stage VC</a></li>
                          <li><a href="/industries/pe" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-green-500 rounded mr-2"></div>
                          Investment Management
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/industries/im/asset" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Asset Management</a></li>
                          <li><a href="/industries/im/wealth" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Wealth Management</a></li>
                          <li><a href="/industries/im/hedge" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Hedge Funds</a></li>
                          <li><a href="/industries/im" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-indigo-500 rounded mr-2"></div>
                          Investment Banking
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/industries/ib/ma" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Mergers & Acquisitions</a></li>
                          <li><a href="/industries/ib/cm" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Capital Markets</a></li>
                          <li><a href="/industries/ib/rd" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Restructuring & Distressed</a></li>
                          <li><a href="/industries/ib" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-purple-500 rounded mr-2"></div>
                          Technology
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/industries/tech/enterprise" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Enterprise Software</a></li>
                          <li><a href="/industries/tech/saas" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> SaaS & Cloud</a></li>
                          <li><a href="/industries/tech/ai" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> AI & Machine Learning</a></li>
                          <li><a href="/industries/tech" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-cyan-500 rounded mr-2"></div>
                          Financial Services
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/industries/fs/banking" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Banking</a></li>
                          <li><a href="/industries/fs/insurance" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Insurance</a></li>
                          <li><a href="/industries/fs/payments" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Payments & Processing</a></li>
                          <li><a href="/industries/fs" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
            
            {/* Benchmark Categories Section - Collapsible */}
            <div className="mt-12 pt-12 border-t border-blue-800">
              <Accordion.Root type="single" collapsible className="w-full">
                <Accordion.Item value="benchmark-categories" className="border-none">
                  <Accordion.Trigger className="flex w-full justify-between items-center mb-4 group bg-blue-900/30 p-3 rounded-md hover:bg-blue-800/40 transition-colors">
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-white">Benchmark Categories</h3>
                    </div>
                    <ChevronDown className="h-5 w-5 text-blue-300 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                  </Accordion.Trigger>
                  
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 text-left mb-4 mt-4 p-4 bg-blue-950/20 rounded-md">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-green-400 rounded mr-2"></div>
                          Financial Performance
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/metrics/revenue-growth" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Revenue Growth</a></li>
                          <li><a href="/metrics/profit-margin" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Profit Margin</a></li>
                          <li><a href="/metrics/ebitda-margin" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> EBITDA Margin</a></li>
                          <li><a href="/metrics/financial" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-yellow-400 rounded mr-2"></div>
                          Operational Metrics
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/metrics/employee-productivity" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Employee Productivity</a></li>
                          <li><a href="/metrics/opex-ratio" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Operating Expense Ratio</a></li>
                          <li><a href="/metrics/employee-satisfaction" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Employee Satisfaction</a></li>
                          <li><a href="/metrics/operational" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-orange-400 rounded mr-2"></div>
                          Customer Metrics
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/metrics/cac" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Customer Acquisition Cost</a></li>
                          <li><a href="/metrics/ltv" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Customer Lifetime Value</a></li>
                          <li><a href="/metrics/retention" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Customer Retention Rate</a></li>
                          <li><a href="/metrics/customer" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-purple-400 rounded mr-2"></div>
                          Technology & Innovation
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/metrics/dti" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Digital Transformation Index</a></li>
                          <li><a href="/metrics/tech-stack" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Tech Stack Modernity</a></li>
                          <li><a href="/metrics/tech-innovation" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Innovation Metrics</a></li>
                          <li><a href="/metrics/technology" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                          <div className="w-1.5 h-6 bg-red-400 rounded mr-2"></div>
                          Growth & Risk Metrics
                        </h4>
                        <ul className="space-y-2">
                          <li><a href="/metrics/revenue-growth" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Revenue Growth</a></li>
                          <li><a href="/metrics/cagr" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Compound Annual Growth Rate</a></li>
                          <li><a href="/metrics/risk-factors" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1">•</span> Risk Factor Analysis</a></li>
                          <li><a href="/metrics/growth-risk" className="text-xs text-indigo-300 hover:text-white hover:underline flex items-center"><span className="mr-1">→</span> View all</a></li>
                        </ul>
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
            

            
            {/* Legal Links - Collapsible */}
            <div className="mt-12 pt-12 border-t border-blue-800">
              <Accordion.Root type="single" collapsible className="w-full">
                <Accordion.Item value="legal" className="border-none">
                  <Accordion.Trigger className="flex w-full justify-between items-center mb-4 group bg-blue-900/30 p-3 rounded-md hover:bg-blue-800/40 transition-colors">
                    <div className="flex items-center">
                      <div className="w-1 h-4 bg-blue-400 rounded mr-2"></div>
                      <h3 className="text-base font-medium text-white">Legal</h3>
                    </div>
                    <ChevronDown className="h-5 w-5 text-blue-300 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                  </Accordion.Trigger>
                  
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <ul className="space-y-2 p-4 bg-blue-950/20 rounded-md">
                      <li><a href="/legal/terms" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-blue-400">•</span> Terms & Conditions</a></li>
                      <li><a href="/legal/privacy" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-blue-400">•</span> Privacy Policy</a></li>
                      <li><a href="/legal/cookies" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-blue-400">•</span> Cookie Policy</a></li>
                      <li><a href="/legal/gdpr" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-blue-400">•</span> GDPR Compliance</a></li>
                      <li><a href="/legal/data" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-blue-400">•</span> Data Usage</a></li>
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
            
            {/* Support Links - Collapsible */}
            <div className="mt-6">
              <Accordion.Root type="single" collapsible className="w-full">
                <Accordion.Item value="support" className="border-none">
                  <Accordion.Trigger className="flex w-full justify-between items-center mb-4 group bg-blue-900/30 p-3 rounded-md hover:bg-blue-800/40 transition-colors">
                    <div className="flex items-center">
                      <div className="w-1 h-4 bg-green-400 rounded mr-2"></div>
                      <h3 className="text-base font-medium text-white">Support</h3>
                    </div>
                    <ChevronDown className="h-5 w-5 text-blue-300 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                  </Accordion.Trigger>
                  
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <ul className="space-y-2 p-4 bg-blue-950/20 rounded-md">
                      <li><a href="/support/help" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-green-400">•</span> Help Center</a></li>
                      <li><a href="/support/faq" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-green-400">•</span> FAQ</a></li>
                      <li><a href="/support/feedback" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-green-400">•</span> Feedback</a></li>
                      <li><a href="/support/tickets" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-green-400">•</span> Support Tickets</a></li>
                      <li><a href="/support/contact" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-green-400">•</span> Contact Support</a></li>
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
            
            {/* European Resources - Collapsible */}
            <div className="mt-6">
              <Accordion.Root type="single" collapsible className="w-full">
                <Accordion.Item value="european" className="border-none">
                  <Accordion.Trigger className="flex w-full justify-between items-center mb-4 group bg-blue-900/30 p-3 rounded-md hover:bg-blue-800/40 transition-colors">
                    <div className="flex items-center">
                      <div className="w-1 h-4 bg-yellow-400 rounded mr-2"></div>
                      <h3 className="text-base font-medium text-white">European Resources</h3>
                    </div>
                    <ChevronDown className="h-5 w-5 text-blue-300 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                  </Accordion.Trigger>
                  
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <ul className="space-y-2 p-4 bg-blue-950/20 rounded-md">
                      <li><a href="/eu/regulations" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-yellow-400">•</span> EU Regulations</a></li>
                      <li><a href="/eu/markets" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-yellow-400">•</span> European Markets</a></li>
                      <li><a href="/eu/trends" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-yellow-400">•</span> Market Trends</a></li>
                      <li><a href="/eu/data" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-yellow-400">•</span> Data Sources</a></li>
                      <li><a href="/eu/partners" className="text-xs text-blue-100 hover:text-white hover:underline flex items-center"><span className="mr-1 text-yellow-400">•</span> European Partners</a></li>
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
            
            {/* Copyright section at the very bottom */}
            <div className="mt-12 pt-6 border-t border-blue-800/50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
                  <a href="/privacy" className="text-xs text-blue-200 hover:text-white hover:underline transition-colors duration-200">Privacy and security</a>
                  <a href="/terms" className="text-xs text-blue-200 hover:text-white hover:underline transition-colors duration-200">Terms and conditions</a>
                  <a href="/cookies" className="text-xs text-blue-200 hover:text-white hover:underline transition-colors duration-200">Cookies</a>
                  <a href="/accessibility" className="text-xs text-blue-200 hover:text-white hover:underline transition-colors duration-200">Accessibility</a>
                  <a href="/compliance" className="text-xs text-blue-200 hover:text-white hover:underline transition-colors duration-200">Global Financial Crimes Compliance</a>
                </div>
                <p className="text-xs text-blue-200">©2025 MANDA INSTITUTE. All rights reserved. MANDA INSTITUTE. is part of AIEB.Capital.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
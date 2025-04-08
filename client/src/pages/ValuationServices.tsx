import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart4, 
  Hourglass, 
  Check, 
  Sparkles, 
  PiggyBank, 
  Shield, 
  Clock, 
  CircleDollarSign,
  ArrowRight, 
  BadgePercent,
  Award,
  Calculator
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-element';
import { Separator } from '@/components/ui/separator';
import { MentorGuide } from '@/components/ui/character-guide';

export default function ValuationServices() {
  const [showGuide, setShowGuide] = React.useState(false);
  
  React.useEffect(() => {
    // Show the guide after 2 seconds
    const timer = setTimeout(() => {
      setShowGuide(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 py-16 md:py-24 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="url(#grid)" />
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1"/>
                </pattern>
              </defs>
            </svg>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors duration-300">
                Premium Service
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                  Valuation Services
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                Precision business valuation with zero upfront costs, 
                powered by AI and backed by industry expertise.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="bg-white rounded-xl border border-blue-100 shadow-xl p-6 max-w-3xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center">
                  <div className="p-4">
                    <div className="bg-blue-50 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3">
                      <CircleDollarSign className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">€0</h3>
                    <p className="text-sm text-gray-600">Upfront Costs</p>
                  </div>
                  
                  <div className="p-4">
                    <div className="bg-blue-50 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3">
                      <Clock className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">5 mins</h3>
                    <p className="text-sm text-gray-600">Initial Valuation</p>
                  </div>
                  
                  <div className="p-4">
                    <div className="bg-blue-50 w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-3">
                      <Award className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">97%</h3>
                    <p className="text-sm text-gray-600">Accuracy Rate</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                    Start Your Free Valuation
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <p className="lead text-xl text-gray-700">
                  At M&A × AI, your business valuation begins entirely free of charge, saving you 
                  thousands typically spent on initial consulting fees. Our advanced AI-driven valuation 
                  platform gives you precise insights into your company's worth quickly and efficiently.
                </p>
              </motion.div>
            </div>
            
            {/* How It Works */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Here's How It Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 border-t-4 border-blue-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-bl-md">
                    Step 1
                  </div>
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 relative z-10">
                    <BarChart4 className="h-7 w-7" />
                  </div>
                  <div className="absolute top-5 right-5 text-blue-100 opacity-20">
                    <span className="text-7xl font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Free Valuation</h3>
                  <p className="text-gray-700">
                    Receive a professional valuation within minutes, benchmarked against real-time 
                    European market data.
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    <Check className="h-4 w-4 mr-1" />
                    <span>Saves €3,000+ in consulting fees</span>
                  </div>
                </Card>
                
                <Card className="p-6 border-t-4 border-indigo-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-bl-md">
                    Step 2
                  </div>
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 relative z-10">
                    <PiggyBank className="h-7 w-7" />
                  </div>
                  <div className="absolute top-5 right-5 text-indigo-100 opacity-20">
                    <span className="text-7xl font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Zero Cost Until Deal</h3>
                  <p className="text-gray-700">
                    No hidden costs. You only pay upon the successful closure of your M&A transaction.
                  </p>
                  <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium">
                    <Check className="h-4 w-4 mr-1" />
                    <span>100% success-based model</span>
                  </div>
                </Card>
                
                <Card className="p-6 border-t-4 border-purple-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-bl-md">
                    Step 3
                  </div>
                  <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 relative z-10">
                    <Shield className="h-7 w-7" />
                  </div>
                  <div className="absolute top-5 right-5 text-purple-100 opacity-20">
                    <span className="text-7xl font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Transparent & Trustworthy</h3>
                  <p className="text-gray-700">
                    Our fees are clearly based on the final transfer price, ensuring fairness and transparency.
                  </p>
                  <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                    <Check className="h-4 w-4 mr-1" />
                    <span>No hidden surprises or charges</span>
                  </div>
                </Card>
              </div>
            </div>
            
            {/* Character Guide */}
            {showGuide && (
              <MentorGuide
                title="Expert Insight"
                content="Did you know that many business owners underestimate their company's value by 15-30%? Our AI valuation has been proven to align within 7% of professional appraisals."
                position="right"
                isOpen={true}
                onClose={() => setShowGuide(false)}
                className="mb-16"
              />
            )}
            
            {/* Valuation Methodology */}
            <div className="mb-16 bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Valuation Methodology</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                    Comprehensive Valuation Approaches
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-700">
                        <span className="font-medium">EBITDA Multiple Method</span> - Industry-specific multipliers based on real European transaction data
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-700">
                        <span className="font-medium">Discounted Cash Flow Analysis</span> - Forward-looking valuation with risk-adjusted European discount rates
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-700">
                        <span className="font-medium">Asset-Based Valuation</span> - Comprehensive assessment of tangible and intangible assets
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-700">
                        <span className="font-medium">Comparable Transaction Analysis</span> - Benchmarking against recent European M&A deals
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
                    AI-Enhanced Accuracy Factors
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-indigo-100 text-indigo-800 p-1 rounded mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-700">
                        <span className="font-medium">Machine Learning Models</span> - Trained on 10,000+ European transactions for regional accuracy
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-indigo-100 text-indigo-800 p-1 rounded mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-700">
                        <span className="font-medium">Industry-Specific Factors</span> - 57+ data points analyzed per valuation
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-indigo-100 text-indigo-800 p-1 rounded mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-700">
                        <span className="font-medium">Real-Time Market Data</span> - Continuous updates from European financial markets
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-indigo-100 text-indigo-800 p-1 rounded mr-2 mt-0.5">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-gray-700">
                        <span className="font-medium">Risk Assessment</span> - Advanced algorithms to identify and quantify business-specific risks
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Results & Stats */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Proven Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    <AnimatedCounter value={2500} duration={2.5} />+
                  </div>
                  <p className="text-sm text-gray-700">Business Valuations Completed</p>
                </div>
                
                <div className="bg-indigo-50 rounded-xl p-6 text-center border border-indigo-100">
                  <div className="text-3xl font-bold text-indigo-700 mb-2">97%</div>
                  <p className="text-sm text-gray-700">Accuracy Rate vs. Final Sale Price</p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-6 text-center border border-purple-100">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    <AnimatedCounter value={15} duration={2} />-<AnimatedCounter value={30} duration={2} />%
                  </div>
                  <p className="text-sm text-gray-700">Higher Than Self-Valuations</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                  <div className="text-3xl font-bold text-blue-700 mb-2">€0</div>
                  <p className="text-sm text-gray-700">Upfront Cost</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">Client Success Testimonial</h3>
                </div>
                
                <div className="relative">
                  <div className="text-4xl text-indigo-300 opacity-30 absolute -top-2 -left-2">"</div>
                  <div className="text-4xl text-indigo-300 opacity-30 absolute -bottom-8 -right-2">"</div>
                  
                  <blockquote className="text-center text-lg font-medium text-blue-50 relative z-10">
                    M&A × AI's valuation service was a game-changer for our exit strategy. Their AI valuation
                    was within 3% of our final sale price, and their no-upfront-fee model saved us over €5,000 in 
                    consulting costs. Transparent, accurate, and efficient.
                  </blockquote>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-blue-200">
                    Lars Eriksen, Former CEO of GreenTech Solutions (sold for €8.7M in 2024)
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">How accurate is the AI valuation?</h3>
                  <p className="text-gray-700">
                    Our AI valuations have demonstrated 97% accuracy when compared to final transaction prices.
                    The system is trained on thousands of European transactions and continuously improves.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">What does "zero upfront cost" mean?</h3>
                  <p className="text-gray-700">
                    You pay absolutely nothing to receive your comprehensive valuation report. We only charge a 
                    success fee if and when your business transaction successfully closes.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">What information do I need to provide?</h3>
                  <p className="text-gray-700">
                    The initial valuation requires basic business information like revenue, profit, industry, and location.
                    For enhanced accuracy, you can optionally provide additional financial and operational details.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">How is my data protected?</h3>
                  <p className="text-gray-700">
                    All data is encrypted using bank-level security and stored in EU-based servers compliant with GDPR.
                    We never share your information with third parties without explicit consent.
                  </p>
                </div>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl overflow-hidden shadow-xl">
              <div className="md:flex">
                <div className="md:w-2/3 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Ready to discover your business's true value?</h3>
                  <p className="mb-6 text-indigo-100">
                    Enjoy peace of mind with a clear, easy, and cost-effective path toward your successful business exit.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                  >
                    Start Your Free Valuation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.button>
                  <p className="mt-3 text-xs text-indigo-200">No credit card required. No obligation. 100% free.</p>
                </div>
                
                <div className="hidden md:block md:w-1/3 bg-indigo-800 p-8">
                  <div className="h-full flex flex-col justify-center items-center">
                    <BadgePercent className="h-16 w-16 text-white opacity-20 mb-4" />
                    <div className="text-center">
                      <div className="text-white text-3xl font-bold mb-2">5 min</div>
                      <div className="text-indigo-200 mb-4">to complete</div>
                      <Separator className="bg-indigo-600" />
                      <div className="text-white text-3xl font-bold mt-4">€0</div>
                      <div className="text-indigo-200">upfront cost</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
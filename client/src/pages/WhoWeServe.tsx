import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building, PiggyBank, Check, Clock, BadgeEuro, Shield } from 'lucide-react';

export default function WhoWeServe() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Who We Serve
                </span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Exclusively focused on European small and medium-sized businesses
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl text-gray-700">
                Our focus at M&A × AI is exclusively European small and medium-sized businesses (SMBs) 
                with EBITDA under €10 million. We passionately believe in helping these overlooked 
                businesses unlock their true potential through mergers, acquisitions, or strategic investments.
              </p>
              
              <p className="text-gray-700 mt-6">
                As part of the AIEB.Capital group, the M&A Institute is fully committed to supporting European 
                businesses. Our unique model ensures:
              </p>
            </div>
            
            {/* Key Benefits */}
            <div className="mt-10 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-4 bg-blue-50 p-6 rounded-lg border border-blue-100"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <BadgeEuro className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Zero upfront fees</h3>
                  <p className="text-gray-700">No payment until your M&A deal is successfully completed.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-4 bg-indigo-50 p-6 rounded-lg border border-indigo-100"
              >
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Rapid deal closure</h3>
                  <p className="text-gray-700">Complete transactions in as little as 49 days.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-4 bg-blue-50 p-6 rounded-lg border border-blue-100"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Extensive network</h3>
                  <p className="text-gray-700">Over 5,000 annual inquiries from trusted business owners like you.</p>
                </div>
              </motion.div>
            </div>
            
            {/* Reasons to Choose Us */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Four reasons entrepreneurs choose us:</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Completely Success-Based Fees</h3>
                  <p className="text-gray-700">
                    No hidden retainer fees or interim costs. You pay only upon successful deal closure.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency & Credibility</h3>
                  <p className="text-gray-700">
                    Clear, honest valuations based strictly on transfer price—not inflated asset totals.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Wider Buyer Network</h3>
                  <p className="text-gray-700">
                    No retainer fees for buyers, ensuring maximum interest and faster matching.
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <PiggyBank className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">European SMB Focus</h3>
                  <p className="text-gray-700">
                    Specialized in businesses with EBITDA under €10 million, an underserved market segment.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Customer Profile */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Is your business a perfect fit?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-1 text-blue-200 flex-shrink-0" />
                      <span>European small or medium-sized enterprise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-1 text-blue-200 flex-shrink-0" />
                      <span>EBITDA under €10 million</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-1 text-blue-200 flex-shrink-0" />
                      <span>At least 3 years of operational history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-1 text-blue-200 flex-shrink-0" />
                      <span>Looking to sell, merge, or receive investment</span>
                    </li>
                  </ul>
                  <button className="mt-6 bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
                    Get Started
                  </button>
                </div>
                <div className="md:w-1/2 bg-blue-700 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-5xl font-bold mb-2">5,000+</div>
                    <div className="text-blue-200">Businesses served across Europe</div>
                    <div className="mt-4 text-white text-4xl font-bold">49 days</div>
                    <div className="text-blue-200">Average time to close</div>
                    <div className="mt-4 text-white text-4xl font-bold">€0</div>
                    <div className="text-blue-200">Upfront fees</div>
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
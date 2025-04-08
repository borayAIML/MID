import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Rocket, LineChart, Handshake } from 'lucide-react';

export default function OurApproach() {
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
                  Our Approach
                </span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Empowering European SMBs with AI-driven valuations and seamless M&A experiences
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl text-gray-700">
                At M&A × AI, we understand European SMBs deeply. We recognize that many businesses, particularly 
                those owned by baby boomers, face challenges in finding suitable successors. While big Private Equity 
                firms often overlook these businesses, we step in to empower SMBs by providing fun, real-time, and free 
                valuations using cutting-edge AI technology.
              </p>
              
              <p className="text-gray-700 mt-6">
                We're revolutionizing the traditional, slow, and boring M&A processes, turning them into simple, 
                exciting experiences. Our state-of-the-art AI matching algorithms, developed by M&A Research Institute Inc., 
                enable rapid, accurate matches for mergers, acquisitions, investments, and sales opportunities. First, we help 
                entrepreneurs get a fast, hassle-free valuation. If you're happy with this initial insight, we're here to guide 
                you seamlessly towards your ultimate business goals.
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-blue-50 rounded-xl p-8 border border-blue-100"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Insights</h3>
                <p className="text-gray-700">
                  Our proprietary algorithms analyze over 30 market factors to provide accurate, data-driven valuations 
                  tailored specifically to European markets.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-indigo-50 rounded-xl p-8 border border-indigo-100"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Accelerated Processes</h3>
                <p className="text-gray-700">
                  We've streamlined the entire M&A journey, enabling deals to close in as little as 49 days—drastically 
                  faster than the industry average of 6-9 months.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-purple-50 rounded-xl p-8 border border-purple-100"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <LineChart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Data-Driven Matching</h3>
                <p className="text-gray-700">
                  Our algorithms match businesses with potential buyers based on over 150 compatibility factors, 
                  ensuring the best possible fit for long-term success.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-blue-50 rounded-xl p-8 border border-blue-100"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Success-Based Model</h3>
                <p className="text-gray-700">
                  We only charge fees upon successful deal closure, aligning our incentives perfectly with yours 
                  and eliminating the burden of upfront or hidden costs.
                </p>
              </motion.div>
            </div>
            
            {/* CTA Section */}
            <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to discover your business's true value?</h3>
              <p className="mb-6 text-blue-100">Get your free, AI-powered valuation in just 5 minutes</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
              >
                Start Free Valuation
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
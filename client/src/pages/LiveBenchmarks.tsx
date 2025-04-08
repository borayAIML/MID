import React from 'react';
import { motion } from 'framer-motion';
import RealTimeBenchmarkShowcase from '@/components/showcases/RealTimeBenchmark';
import { BarChart4, Activity, Globe, LineChart } from 'lucide-react';

export default function LiveBenchmarks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero Section */}
      <div className="mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Live European Market{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Benchmarks
            </span>
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <p className="text-gray-500 text-sm">Real-time data updates every 10 seconds</p>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Compare your business against industry benchmarks across Europe with our real-time analytics dashboard.
            Gain valuable insights into financial performance, operational efficiency, and market positioning across
            the European marketplace.
          </p>
        </motion.div>
      </div>

      {/* Key Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-lg border border-indigo-100 hover:shadow-md hover:border-indigo-300 transition-all duration-300 w-full text-left cursor-pointer"
          onClick={() => {
            document.getElementById('benchmark-dashboard')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="flex items-start gap-3">
            <div className="text-indigo-600 mt-1">
              <BarChart4 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-indigo-900">Industry Comparison</h3>
              <p className="mt-1 text-sm text-gray-700">
                Compare your metrics against European industry leaders and identify growth opportunities.
              </p>
            </div>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-lg border border-purple-100 hover:shadow-md hover:border-purple-300 transition-all duration-300 w-full text-left cursor-pointer"
          onClick={() => {
            document.getElementById('benchmark-dashboard')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="flex items-start gap-3">
            <div className="text-purple-600 mt-1">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-purple-900">European Market Data</h3>
              <p className="mt-1 text-sm text-gray-700">
                Access financial and performance data from 27 EU countries plus UK, Switzerland, and Norway.
              </p>
            </div>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-lg border border-blue-100 hover:shadow-md hover:border-blue-300 transition-all duration-300 w-full text-left cursor-pointer"
          onClick={() => {
            document.getElementById('benchmark-dashboard')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="flex items-start gap-3">
            <div className="text-blue-600 mt-1">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Real-time Updates</h3>
              <p className="mt-1 text-sm text-gray-700">
                Watch as metrics update in real-time, with data sourced from European Central Bank and industry associations.
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Benchmark Dashboard Section */}
      <motion.div
        id="benchmark-dashboard"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <RealTimeBenchmarkShowcase />
      </motion.div>

      {/* Data Source Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-blue-100"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <LineChart className="h-5 w-5 mr-2 text-blue-600" />
          About Our Benchmark Data
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Our real-time benchmark data is sourced from European financial institutions, industry associations, public financial reports,
          and regulatory filings. The data is processed and analyzed using advanced AI algorithms to ensure accuracy and relevance.
        </p>
        <div className="text-xs text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <strong>Data Sources:</strong> European Central Bank, Eurostat, Industry associations, Financial reports
          </div>
          <div>
            <strong>Update Frequency:</strong> Daily aggregates with real-time market indicators
          </div>
          <div>
            <strong>Coverage:</strong> 27 EU countries plus UK, Switzerland, and Norway
          </div>
          <div>
            <strong>Metrics:</strong> 30+ financial, operational and market performance indicators
          </div>
        </div>
      </motion.div>
    </div>
  );
}
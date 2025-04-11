import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Building, ChartLine, Menu, X } from "lucide-react";
import { useState, useEffect } from "react"; 
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

// We'll use dynamic imports and local state to manage the industries and metrics

type NavigationProps = {
  isLoggedIn?: boolean; // Make it optional since we'll use useAuth hook
};

export default function Navigation({ isLoggedIn: propIsLoggedIn }: NavigationProps) {
  // Use the authentication state from our hook
  const { isAuthenticated, logout, user } = useAuth();
  
  // Hardcoded industry data for the footer with trending and hot indicators
  const industries = [
    {
      id: 'pe-vc',
      name: 'Private Equity & VC',
      isHot: true,
      europeanData: true,
      lastUpdated: '2 hours ago',
      subcategories: [
        { id: 'pe-vc-growth', name: 'Growth Equity', trending: true },
        { id: 'pe-vc-buyout', name: 'Buyout Firms', europeanFocus: true },
        { id: 'pe-vc-early-stage', name: 'Early Stage VC' },
        { id: 'pe-vc-late-stage', name: 'Late Stage VC', trending: true },
        { id: 'pe-vc-impact', name: 'Impact Investing', trending: true, europeanFocus: true },
        { id: 'pe-vc-secondary', name: 'Secondary Funds' },
        { id: 'pe-vc-debt', name: 'Private Debt', europeanFocus: true },
        { id: 'pe-vc-distressed', name: 'Distressed & Special Situations', limited: true }
      ]
    },
    {
      id: 'im',
      name: 'Investment Management',
      isHot: false,
      europeanData: true,
      lastUpdated: '6 hours ago',
      subcategories: [
        { id: 'im-asset', name: 'Asset Management', trending: true },
        { id: 'im-wealth', name: 'Wealth Management', europeanFocus: true },
        { id: 'im-hedge', name: 'Hedge Funds', limited: true },
        { id: 'im-family', name: 'Family Offices', trending: true, europeanFocus: true },
        { id: 'im-pension', name: 'Pension Funds' },
        { id: 'im-sovereign', name: 'Sovereign Wealth Funds', limited: true }
      ]
    },
    {
      id: 'ib',
      name: 'Investment Banking',
      isHot: true,
      europeanData: true,
      lastUpdated: '4 hours ago',
      subcategories: [
        { id: 'ib-ma', name: 'Mergers & Acquisitions', trending: true, europeanFocus: true },
        { id: 'ib-capital-markets', name: 'Capital Markets', limited: true },
        { id: 'ib-restructuring', name: 'Restructuring & Distressed', trending: true },
        { id: 'ib-private-placement', name: 'Private Placements' },
        { id: 'ib-specialty', name: 'Industry Specialists', europeanFocus: true }
      ]
    },
    {
      id: 'tech',
      name: 'Technology',
      isHot: true,
      europeanData: true,
      lastUpdated: '1 hour ago',
      subcategories: [
        { id: 'tech-software', name: 'Enterprise Software', trending: true },
        { id: 'tech-saas', name: 'SaaS & Cloud', trending: true, europeanFocus: true },
        { id: 'tech-ai', name: 'AI & Machine Learning', trending: true, hot: true },
        { id: 'tech-fintech', name: 'Financial Technology', trending: true, europeanFocus: true },
        { id: 'tech-healthtech', name: 'Healthcare Technology', trending: true }
      ]
    },
    {
      id: 'fs',
      name: 'Financial Services',
      isHot: false,
      europeanData: true,
      lastUpdated: '5 hours ago',
      subcategories: [
        { id: 'fs-banking', name: 'Banking', europeanFocus: true },
        { id: 'fs-insurance', name: 'Insurance' },
        { id: 'fs-payments', name: 'Payments & Processing', trending: true },
        { id: 'fs-lending', name: 'Specialty Lending', limited: true },
        { id: 'fs-marketmaking', name: 'Market Making & Trading', trending: true }
      ]
    }
  ];

  // Hardcoded benchmark metrics for the footer with real-time indicators
  const benchmarkMetrics = [
    { id: 'revenue_growth', name: 'Revenue Growth', trending: true, isRealTime: true },
    { id: 'profit_margin', name: 'Profit Margin', isRealTime: true },
    { id: 'ebitda_margin', name: 'EBITDA Margin', trending: true, isRealTime: true, europeanFocus: true },
    { id: 'roi', name: 'Return on Investment', isRealTime: true },
    { id: 'roa', name: 'Return on Assets' },
    { id: 'roe', name: 'Return on Equity', trending: true, europeanFocus: true },
    
    { id: 'employee_productivity', name: 'Employee Productivity', trending: true },
    { id: 'operating_expense_ratio', name: 'Operating Expense Ratio', europeanFocus: true },
    { id: 'inventory_turnover', name: 'Inventory Turnover' },
    { id: 'asset_turnover', name: 'Asset Turnover' },
    
    { id: 'customer_acquisition_cost', name: 'Customer Acquisition Cost', trending: true },
    { id: 'customer_lifetime_value', name: 'Customer Lifetime Value', trending: true, isRealTime: true },
    { id: 'customer_retention', name: 'Customer Retention Rate', europeanFocus: true },
    { id: 'customer_satisfaction', name: 'Customer Satisfaction Score' },
    { id: 'nps', name: 'Net Promoter Score', trending: true },
    
    { id: 'digital_transformation', name: 'Digital Transformation Index', trending: true, europeanFocus: true },
    { id: 'r_and_d', name: 'R&D Investment' },
    { id: 'innovation_rate', name: 'Innovation Rate', trending: true },
    { id: 'tech_stack_modernity', name: 'Tech Stack Modernity', trending: true },
    
    { id: 'debt_to_equity', name: 'Debt to Equity Ratio', isRealTime: true },
    { id: 'current_ratio', name: 'Current Ratio', isRealTime: true },
    { id: 'quick_ratio', name: 'Quick Ratio', isRealTime: true },
    { id: 'cash_flow', name: 'Cash Flow Margin', trending: true, europeanFocus: true },
    { id: 'interest_coverage', name: 'Interest Coverage Ratio', isRealTime: true },
    
    { id: 'market_share', name: 'Market Share', europeanFocus: true },
    { id: 'growth_rate', name: 'Compound Annual Growth Rate (CAGR)', trending: true, europeanFocus: true },
    { id: 'scalability_score', name: 'Scalability Score' },
    
    { id: 'carbon_footprint', name: 'Carbon Footprint', europeanFocus: true },
    { id: 'employee_satisfaction', name: 'Employee Satisfaction' },
    { id: 'diversity_score', name: 'Diversity & Inclusion Score', trending: true },
    { id: 'governance_rating', name: 'Corporate Governance Rating', europeanFocus: true }
  ];
  
  return (
    <>
      <div className="bg-indigo-900 text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <span className="flex items-center animate-pulse">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
              <span>Live European Market Data</span>
            </span>
            <span className="mx-3 text-indigo-300">|</span>
            <span>
              {new Date().toLocaleDateString('en-GB', {
                timeZone: 'Europe/Paris', // GMT+1 (CET)
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/valuation-calculator">
              <span className="text-indigo-200 hover:text-white cursor-pointer transition-colors">Free Valuation Tool</span>
            </Link>
            <Link href="/contact">
              <span className="text-indigo-200 hover:text-white cursor-pointer transition-colors">Contact</span>
            </Link>
          </div>
        </div>
      </div>
      
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text flex items-center cursor-pointer transition-transform hover:scale-105">
                  <Building className="mr-2 text-indigo-700" />
                  MANDA INSTITUTE
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 md:space-x-3">
              <Link href="/our-approach">
                <div className="text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 md:px-3 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors group flex items-center">
                  <span>Our Approach</span>
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-blue-50 text-blue-600 px-1 rounded">
                    New
                  </span>
                </div>
              </Link>
              
              <Link href="/who-we-serve">
                <div className="text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 md:px-3 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors group flex items-center">
                  <span>Who We Serve</span>
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-blue-50 text-blue-600 px-1 rounded">
                    New
                  </span>
                </div>
              </Link>
              
              <Link href="/industry-insights">
                <div className="text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 md:px-3 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors">
                  Industry Insights
                </div>
              </Link>
              
              <Link href="/valuation-services">
                <div className="relative text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 md:px-3 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors">
                  Valuation Services
                  <span className="absolute -right-1 -top-1 h-2 w-2 bg-green-500 rounded-full animate-ping"></span>
                </div>
              </Link>
              
              <Link href="/european-markets">
                <div className="text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 md:px-3 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors flex items-center">
                  <span>European Markets</span>
                  <span className="ml-1 text-[10px] bg-amber-100 text-amber-700 px-1 rounded">
                    Trending
                  </span>
                </div>
              </Link>
              
              <Link href="/success-stories">
                <div className="text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 md:px-3 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors group flex items-center">
                  <span>Success Stories</span>
                  <span className="ml-1 text-[10px] bg-blue-100 text-blue-700 px-1 rounded">
                    New
                  </span>
                </div>
              </Link>
              
              <Link href="/live-benchmarks">
                <div className="text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 md:px-3 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors flex items-center">
                  <span>Live Benchmarks</span>
                  <span className="ml-1 text-[10px] bg-green-100 text-green-700 px-1 rounded animate-pulse">
                    New
                  </span>
                </div>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link href="/business-data">
                    <Button variant="outline" className="bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300">
                      <ChartLine className="w-4 h-4 mr-2" />
                      Data Wizard
                    </Button>
                  </Link>
                  <Link href="/valuation">
                    <Button variant="default" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm">
                      Your Dashboard
                    </Button>
                  </Link>
                  <div className="relative group">
                    <Button variant="ghost" className="flex items-center gap-1 ml-1 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800">
                      <span>{user?.fullName || 'Account'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
                    </Button>
                    <div className="absolute right-0 z-10 w-48 mt-1 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <Link href="/data-room">
                          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer">
                            Data Room
                          </div>
                        </Link>
                        <Link href="/improvement-suggestions">
                          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer">
                            Improvement Suggestions
                          </div>
                        </Link>
                        <Link href="/buyer-matches">
                          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer">
                            Buyer Matches
                          </div>
                        </Link>
                        <Link href="/emilia-showcase">
                          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer flex items-center">
                            <span>Emilia AI Assistant</span>
                            <span className="ml-1 text-[10px] bg-green-100 text-green-700 px-1 rounded">
                              New
                            </span>
                          </div>
                        </Link>
                        <Link href="/ai-test">
                          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer flex items-center">
                            <span>AI Analysis Tools</span>
                            <span className="ml-1 text-[10px] bg-purple-100 text-purple-700 px-1 rounded">
                              Beta
                            </span>
                          </div>
                        </Link>
                      </div>
                      <div className="py-1">
                        <Link href="/profile">
                          <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer">
                            Profile Settings
                          </div>
                        </Link>
                        <div 
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() => logout()}
                        >
                          Sign Out
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="outline" className="text-indigo-700 border-indigo-700 hover:bg-indigo-50">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="default" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm whitespace-nowrap">
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              {isAuthenticated && (
                <Link href="/valuation" className="mr-4">
                  <Button size="sm" variant="default" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm">
                    Dashboard
                  </Button>
                </Link>
              )}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="text-gray-700">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96 overflow-auto">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <Link href="/">
                        <SheetClose className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 text-transparent bg-clip-text flex items-center cursor-pointer">
                          <Building className="mr-2 text-indigo-700" />
                          MANDA INSTITUTE
                        </SheetClose>
                      </Link>
                      <SheetClose asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0" aria-label="Close menu">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>
                    
                    <div className="flex flex-col space-y-1 mb-6">
                      {isAuthenticated ? (
                        <div className="border border-indigo-100 bg-indigo-50 rounded-md p-4 mb-4">
                          <div className="text-sm text-gray-600 mb-1">Logged in as</div>
                          <div className="font-medium text-indigo-800 mb-3">{user?.email}</div>
                          <div className="flex space-x-2">
                            <Link href="/valuation" className="flex-1">
                              <SheetClose asChild>
                                <Button 
                                  variant="default" 
                                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm"
                                >
                                  Dashboard
                                </Button>
                              </SheetClose>
                            </Link>
                            <Button 
                              variant="outline" 
                              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => {
                                logout();
                              }}
                            >
                              Sign Out
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2 mb-4">
                          <Link href="/login">
                            <SheetClose asChild>
                              <Button variant="outline" className="w-full text-indigo-700 border-indigo-700 hover:bg-indigo-50">
                                Sign In
                              </Button>
                            </SheetClose>
                          </Link>
                          <Link href="/signup">
                            <SheetClose asChild>
                              <Button variant="default" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm">
                                Create Account
                              </Button>
                            </SheetClose>
                          </Link>
                        </div>
                      )}
                      
                      <Link href="/our-approach">
                        <SheetClose asChild>
                          <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors flex justify-between items-center">
                            <span>Our Approach</span>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">
                              New
                            </span>
                          </div>
                        </SheetClose>
                      </Link>
                      
                      <Link href="/who-we-serve">
                        <SheetClose asChild>
                          <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors flex justify-between items-center">
                            <span>Who We Serve</span>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">
                              New
                            </span>
                          </div>
                        </SheetClose>
                      </Link>
                      
                      <Link href="/industry-insights">
                        <SheetClose asChild>
                          <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors">
                            Industry Insights
                          </div>
                        </SheetClose>
                      </Link>
                      
                      <Link href="/valuation-services">
                        <SheetClose asChild>
                          <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors relative">
                            Valuation Services
                            <span className="absolute -right-1 -top-1 h-2 w-2 bg-green-500 rounded-full animate-ping"></span>
                          </div>
                        </SheetClose>
                      </Link>
                      
                      <Link href="/european-markets">
                        <SheetClose asChild>
                          <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors flex justify-between items-center">
                            <span>European Markets</span>
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded">
                              Trending
                            </span>
                          </div>
                        </SheetClose>
                      </Link>
                      
                      <Link href="/success-stories">
                        <SheetClose asChild>
                          <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors flex justify-between items-center">
                            <span>Success Stories</span>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">
                              New
                            </span>
                          </div>
                        </SheetClose>
                      </Link>
                      
                      <Link href="/live-benchmarks">
                        <SheetClose asChild>
                          <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors flex justify-between items-center">
                            <span>Live Benchmarks</span>
                            <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded animate-pulse">
                              Live
                            </span>
                          </div>
                        </SheetClose>
                      </Link>
                    </div>
                    
                    {isAuthenticated && (
                      <div className="mb-6">
                        <div className="text-sm font-medium text-gray-500 mb-2 px-3">YOUR ACCOUNT</div>
                        <div className="flex flex-col space-y-1">
                          <Link href="/business-data">
                            <SheetClose asChild>
                              <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors">
                                Business Data Wizard
                              </div>
                            </SheetClose>
                          </Link>
                          <Link href="/data-room">
                            <SheetClose asChild>
                              <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors">
                                Data Room
                              </div>
                            </SheetClose>
                          </Link>
                          <Link href="/improvement-suggestions">
                            <SheetClose asChild>
                              <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors">
                                Improvement Suggestions
                              </div>
                            </SheetClose>
                          </Link>
                          <Link href="/buyer-matches">
                            <SheetClose asChild>
                              <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors">
                                Buyer Matches
                              </div>
                            </SheetClose>
                          </Link>
                          <Link href="/emilia-showcase">
                            <SheetClose asChild>
                              <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors flex justify-between items-center">
                                <span>Emilia AI Assistant</span>
                                <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded">
                                  New
                                </span>
                              </div>
                            </SheetClose>
                          </Link>
                          <Link href="/ai-test">
                            <SheetClose asChild>
                              <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors flex justify-between items-center">
                                <span>AI Analysis Tools</span>
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded">
                                  Beta
                                </span>
                              </div>
                            </SheetClose>
                          </Link>
                          <Link href="/profile">
                            <SheetClose asChild>
                              <div className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors">
                                Profile Settings
                              </div>
                            </SheetClose>
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-auto pt-6 border-t border-gray-200">
                      <div className="flex flex-col space-y-1">
                        <Link href="/about-us">
                          <SheetClose asChild>
                            <div className="text-gray-500 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors text-sm">
                              About Us
                            </div>
                          </SheetClose>
                        </Link>
                        <Link href="/our-team">
                          <SheetClose asChild>
                            <div className="text-gray-500 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors text-sm">
                              Our Team
                            </div>
                          </SheetClose>
                        </Link>
                        <Link href="/faq">
                          <SheetClose asChild>
                            <div className="text-gray-500 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors text-sm">
                              FAQ
                            </div>
                          </SheetClose>
                        </Link>
                        <Link href="/contact">
                          <SheetClose asChild>
                            <div className="text-gray-500 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors text-sm">
                              Contact
                            </div>
                          </SheetClose>
                        </Link>
                      </div>
                      <div className="mt-4 px-3 flex items-center">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-gray-500">Live European Market Data</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
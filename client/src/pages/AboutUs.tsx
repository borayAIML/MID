import React from 'react';
import { Building, Briefcase, Users, Heart, Award, LineChart } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ParallaxSection, RevealOnScroll } from '@/components/ui/parallax-effect';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800 mb-6">
            About Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing M&A for European SMBs through a blend of human expertise and cutting-edge AI.
          </p>
        </div>
        
        {/* Our Story Section */}
        <RevealOnScroll>
          <Card className="mb-16 overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
              <CardTitle className="text-2xl">Our Journey</CardTitle>
              <CardDescription className="text-indigo-100">
                Where passion meets purpose
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Our journey began with a clear vision: supporting Europe's 31 million businesses—nearly half owned by baby boomers—with smooth, dignified business exits. We recognized a crucial gap: many SMB owners lack succession plans, and their businesses risk disappearing without proper transition strategies.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Having spent over a decade helping SMBs succeed in the digital world—scaling, networking, selling, and growing—we understand entrepreneurs' ambitions deeply. Big M&A institutions frequently overlook SMBs, prioritizing larger deals over genuine impact. This oversight inspired us to create M&A × AI, where digitalization meets real-world business succession.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We believe every entrepreneur deserves a rewarding exit and every employee the assurance of continued prosperity.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    M&A × AI is here to revolutionize the SMB M&A landscape, empowering entrepreneurs with seamless, stress-free business transitions—one AI-driven valuation at a time.
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-100 shadow-sm">
                    <div className="flex justify-center mb-4">
                      <Building className="h-16 w-16 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-center text-indigo-800 mb-3">Our Mission</h3>
                    <p className="text-gray-600 text-center">
                      To ensure every European SMB owner achieves the exit they deserve, preserving legacies and securing futures.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </RevealOnScroll>
        
        {/* Key Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-10">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RevealOnScroll delay={0.1}>
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Heart className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Entrepreneur First</h3>
                  <p className="text-gray-600 text-center">
                    We place SMB owners at the center of everything we do, ensuring their needs, goals, and legacies are prioritized.
                  </p>
                </CardContent>
              </Card>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.2}>
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <Award className="h-8 w-8 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Excellence & Integrity</h3>
                  <p className="text-gray-600 text-center">
                    We uphold the highest standards of professionalism and ethics in every interaction and transaction.
                  </p>
                </CardContent>
              </Card>
            </RevealOnScroll>
            
            <RevealOnScroll delay={0.3}>
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <LineChart className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Innovation & Insight</h3>
                  <p className="text-gray-600 text-center">
                    We combine cutting-edge AI technology with deep market expertise to deliver unparalleled valuation accuracy.
                  </p>
                </CardContent>
              </Card>
            </RevealOnScroll>
          </div>
        </div>
        
        {/* Our Impact Section */}
        <ParallaxSection className="mb-16">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:p-12 text-white">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">500+</p>
                  <p className="text-indigo-200">Businesses Valued</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">€800M+</p>
                  <p className="text-indigo-200">Transaction Value</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">12+</p>
                  <p className="text-indigo-200">European Countries</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">5,000+</p>
                  <p className="text-indigo-200">Jobs Preserved</p>
                </div>
              </div>
            </div>
          </div>
        </ParallaxSection>
        
        {/* Call to Action */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the growing community of European SMB owners who are securing their business legacy with our help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:from-indigo-700 hover:to-blue-700">
              Get Your Free Valuation
            </Button>
            <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
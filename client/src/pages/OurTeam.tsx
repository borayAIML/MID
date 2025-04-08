import React from 'react';
import { 
  Users, 
  BriefcaseBusiness, 
  Building2, 
  Award, 
  Network, 
  Globe 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RevealOnScroll } from '@/components/ui/parallax-effect';

export default function OurTeam() {
  // Team Members Data (placeholders)
  const executiveTeam = [
    {
      name: "Alexandra Müller",
      role: "Chief Executive Officer",
      background: "Former CEO of Fortune 500 Company, 20+ years leadership experience",
      imgUrl: "",
      initials: "AM"
    },
    {
      name: "Jens Bergström",
      role: "Chief Financial Officer",
      background: "Former Investment Banker, 15+ years M&A experience",
      imgUrl: "",
      initials: "JB"
    },
    {
      name: "Marie Dubois",
      role: "Chief Technology Officer",
      background: "AI & Machine Learning Expert, Ex-Google",
      imgUrl: "",
      initials: "MD"
    },
    {
      name: "Carlos Mendes",
      role: "Head of European Markets",
      background: "20+ years experience in European business development",
      imgUrl: "",
      initials: "CM"
    }
  ];
  
  const advisoryBoard = [
    {
      name: "Dr. Heinrich Weber",
      role: "Financial Advisory",
      background: "Former Managing Director, Top 3 Global Investment Bank",
      imgUrl: "",
      initials: "HW"
    },
    {
      name: "Sofia Lindholm",
      role: "Technology Strategy",
      background: "Successful Tech Entrepreneur, 3 Exits",
      imgUrl: "",
      initials: "SL"
    },
    {
      name: "Pierre Durand",
      role: "M&A Legal Expert",
      background: "Lead Counsel on $50B+ in transactions",
      imgUrl: "",
      initials: "PD"
    },
    {
      name: "Elisa Rossi",
      role: "SMB Growth Specialist",
      background: "Scaled 100+ European SMBs",
      imgUrl: "",
      initials: "ER"
    }
  ];
  
  // Partners (logos would be imported or from a CDN in a real app)
  const partners = [
    { name: "European Investment Fund", logo: "" },
    { name: "Tech Innovation Partners", logo: "" },
    { name: "Global Finance Group", logo: "" },
    { name: "Enterprise Growth Associates", logo: "" },
    { name: "Digital Transformation Alliance", logo: "" }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800 mb-6">
            Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A diverse group of experts committed to revolutionizing M&A for European SMBs.
          </p>
        </div>
        
        {/* Team Overview */}
        <RevealOnScroll>
          <Card className="mb-16 overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
              <CardTitle className="text-2xl">Who We Are</CardTitle>
              <CardDescription className="text-indigo-100">
                Experience and expertise driving results
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                Our team comprises seasoned entrepreneurs who deeply understand the entrepreneurial journey, alongside former CEOs who have led Fortune 500 companies. Our wealth managers come from the top 10 largest banks globally, bringing unmatched financial insights. Additionally, our team includes a leading M&A lawyer involved in landmark global deals and expert fiscalists who excel at analyzing and consulting on complex transactions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-indigo-50 p-5 rounded-lg text-center">
                  <div className="flex justify-center mb-3">
                    <BriefcaseBusiness className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-indigo-900 mb-1">Entrepreneurs</h3>
                  <p className="text-sm text-indigo-700">Who've walked your path</p>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-lg text-center">
                  <div className="flex justify-center mb-3">
                    <Building2 className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-1">Former CEOs</h3>
                  <p className="text-sm text-blue-700">Fortune 500 leadership</p>
                </div>
                
                <div className="bg-purple-50 p-5 rounded-lg text-center">
                  <div className="flex justify-center mb-3">
                    <Network className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-900 mb-1">Wealth Managers</h3>
                  <p className="text-sm text-purple-700">Top global banks</p>
                </div>
                
                <div className="bg-indigo-50 p-5 rounded-lg text-center">
                  <div className="flex justify-center mb-3">
                    <Award className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-indigo-900 mb-1">Legal Experts</h3>
                  <p className="text-sm text-indigo-700">M&A specialists</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </RevealOnScroll>
        
        {/* Executive Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-10">Executive Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {executiveTeam.map((member, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        {member.imgUrl && <AvatarImage src={member.imgUrl} alt={member.name} />}
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xl">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                    <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.background}</p>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </div>
        
        {/* Advisory Board */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">Board of Advisors</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
            Our board includes influential industry leaders and respected executives with vast experience across finance, technology, and business transformation. These distinguished advisors guide our strategic vision, ensuring we continuously deliver superior results and remain ahead of industry trends.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advisoryBoard.map((advisor, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-20 w-20">
                        {advisor.imgUrl && <AvatarImage src={advisor.imgUrl} alt={advisor.name} />}
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl">
                          {advisor.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{advisor.name}</h3>
                    <p className="text-indigo-600 font-medium mb-3">{advisor.role}</p>
                    <p className="text-gray-600 text-sm">{advisor.background}</p>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            ))}
          </div>
        </div>
        
        {/* Partners Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">Backed by Industry Leaders</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
            We proudly collaborate with prominent Limited Partners (LPs) and leading global tech companies. Their support strengthens our ability to deliver exceptional results for our clients.
          </p>
          <div className="bg-gray-50 rounded-lg p-8 flex flex-wrap justify-center gap-8 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="h-12 w-12" />
                  ) : (
                    <Globe className="h-8 w-8 text-indigo-600" />
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-2">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Join Us CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Interested in being part of our team? We're always looking for talented individuals who share our passion for revolutionizing M&A for European SMBs.
          </p>
          <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:from-indigo-700 hover:to-blue-700">
            View Career Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
}
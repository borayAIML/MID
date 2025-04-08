import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AnimatedElement, RevealOnScroll } from "@/components/ui/animated-element";
import { Quote, ArrowRightCircle, Download, Building, LineChart, TrendingUp, Briefcase, Landmark, Users, ArrowUp } from "lucide-react";

export default function SuccessStories() {
  const [activeTab, setActiveTab] = useState("exits");
  
  const featuredStories = [
    {
      id: 1,
      title: "Family-Owned Manufacturing Business Exit",
      company: "Precision Parts Manufacturing GmbH",
      industry: "Manufacturing",
      location: "Germany",
      valuation: "€42M",
      exitMultiple: "6.5x EBITDA",
      year: 2024,
      category: "exits",
      story: "After 35 years of operation, the founding family sought a strategic exit. Our team identified operational improvements that added €6M to the valuation, and secured multiple international buyers, resulting in a competitive bidding process and final valuation 28% higher than initial expectations.",
      quote: "The MANDA Institute team transformed our business valuation through their operational insights. Their expert guidance through the entire exit process resulted in an outcome we could never have achieved alone.",
      clientName: "Heinz Mueller",
      clientPosition: "Former CEO, Precision Parts Manufacturing",
      keyFactors: [
        "Identified redundant inventory systems that reduced operational costs by 15%",
        "Implemented financial reporting improvements that increased transparency",
        "Corrected undervalued IP assets that added €3.2M to valuation",
        "Created competitive bidding environment with 4 qualified buyers"
      ],
      results: {
        initialValuation: "€32.8M",
        finalValuation: "€42M",
        timeToClose: "9 months",
        buyerType: "Strategic"
      }
    },
    {
      id: 2,
      title: "Tech Startup Strategic Acquisition",
      company: "DataSync Solutions",
      industry: "SaaS",
      location: "Sweden",
      valuation: "€18.5M",
      exitMultiple: "12x ARR",
      year: 2024,
      category: "exits",
      story: "Founded just 4 years prior, this data integration platform had strong technology but unclear positioning. Our team restructured pricing, clarified the value proposition, and identified the perfect strategic buyer looking to expand their enterprise offering. The deal closed in just 5 months from engagement.",
      quote: "MANDA Institute helped us position our technology as a strategic asset rather than just another tool. Their valuation guidance and buyer introductions were instrumental in achieving an exit that exceeded our expectations.",
      clientName: "Elsa Johansson",
      clientPosition: "Co-founder, DataSync Solutions",
      keyFactors: [
        "Restructured pricing model that increased ARR by 30%",
        "Identified proprietary algorithm value overlooked by founders",
        "Connected with strategic buyer seeking specific integration capabilities",
        "Negotiated favorable terms with minimal earnout requirements"
      ],
      results: {
        initialValuation: "€11.2M",
        finalValuation: "€18.5M",
        timeToClose: "5 months",
        buyerType: "Strategic Technology Company"
      }
    },
    {
      id: 3,
      title: "Healthcare Service Provider Growth Investment",
      company: "MedCare Plus",
      industry: "Healthcare",
      location: "Spain",
      valuation: "€24M",
      deal: "€8M Growth Investment (33% stake)",
      year: 2025,
      category: "investments",
      story: "This regional healthcare service provider was delivering exceptional care but struggling with expansion and digital transformation. Our team identified key performance metrics, compared them to industry benchmarks, and secured a growth investment that preserved founder control while providing capital for a 5-region expansion.",
      quote: "MANDA Institute brought strategic insights that completely changed our growth trajectory. Their valuation methodology captured our true worth, while their connections to specialized healthcare investors proved invaluable.",
      clientName: "Carmen Rodriguez",
      clientPosition: "CEO, MedCare Plus",
      keyFactors: [
        "Developed detailed benchmarking against European healthcare standards",
        "Created digital transformation roadmap that increased valuation",
        "Identified patient-outcome metrics that demonstrated superior care quality",
        "Structured investment preserving founder operational control"
      ],
      results: {
        preMoneyValuation: "€24M",
        investmentRaised: "€8M",
        expansion: "5 new regions",
        investorType: "Healthcare-focused PE fund"
      }
    },
    {
      id: 4,
      title: "Family Business Succession Planning",
      company: "EuroHouse Construction",
      industry: "Construction",
      location: "Italy",
      valuation: "€16.5M",
      deal: "Intergenerational Transfer & Partial Sale",
      year: 2024,
      category: "succession",
      story: "A third-generation family construction business faced leadership transition challenges. Our comprehensive valuation and succession planning facilitated a smooth transfer to the next generation, while arranging the sale of a 25% stake to provide liquidity to retiring members and growth capital.",
      quote: "MANDA Institute navigated our complex family dynamics with remarkable skill. Their succession planning created a clear path forward that satisfied everyone's needs while positioning our business for future success.",
      clientName: "Marco Rossi",
      clientPosition: "Incoming CEO, EuroHouse Construction",
      keyFactors: [
        "Created fair valuation methodology accounting for illiquid real estate assets",
        "Developed governance structure for next-generation leadership",
        "Structured partial sale to provide retirement liquidity for senior members",
        "Established employee ownership program to retain key talent"
      ],
      results: {
        businessValuation: "€16.5M",
        retirementLiquidity: "€4.1M",
        governanceStructure: "New board with independent directors",
        successionTiming: "18-month phased transition"
      }
    },
    {
      id: 5,
      title: "Cross-Border Food & Beverage Acquisition",
      company: "Taste Traditions",
      industry: "Food & Beverage",
      location: "Belgium",
      valuation: "€29.5M",
      exitMultiple: "9.2x EBITDA",
      year: 2023,
      category: "exits",
      story: "This specialty food manufacturer with strong European distribution was seeking international expansion. We identified operational efficiencies, highlighted unique supply chain advantages, and connected them with a UK-based strategic buyer looking to establish EU presence post-Brexit.",
      quote: "The cross-border complexities of our deal seemed overwhelming until MANDA Institute stepped in. Their international expertise and buyer network resulted in a partnership that delivered immediate value beyond just the acquisition price.",
      clientName: "Thomas Dubois",
      clientPosition: "Former Owner, Taste Traditions",
      keyFactors: [
        "Highlighted unique sourcing relationships with local producers",
        "Quantified value of established EU distribution network post-Brexit",
        "Identified production efficiencies that improved margins by 3.5%",
        "Negotiated post-acquisition integration plan preserving key relationships"
      ],
      results: {
        initialValuation: "€22.7M",
        finalValuation: "€29.5M",
        timeToClose: "11 months",
        synergies: "€4.2M in identified annual synergies"
      }
    },
    {
      id: 6,
      title: "Technology Platform Venture Funding",
      company: "GreenLogi Solutions",
      industry: "Logistics Technology",
      location: "Netherlands",
      valuation: "€32M",
      deal: "€7M Series A (22% stake)",
      year: 2025,
      category: "investments",
      story: "This logistics optimization platform specializing in carbon footprint reduction needed growth capital to scale. Our team created a comprehensive valuation based on their sustainability impact metrics and technology IP, securing Series A funding at a valuation 40% higher than their initial expectations.",
      quote: "MANDA Institute recognized the full potential of our sustainability technology before we fully did. Their approach to valuing our environmental impact alongside traditional metrics was refreshing and highly effective.",
      clientName: "Jan van der Berg",
      clientPosition: "Founder & CEO, GreenLogi Solutions",
      keyFactors: [
        "Developed valuation methodology that quantified carbon reduction impact",
        "Created technology roadmap highlighting ML capabilities and IP value",
        "Connected with climate-focused VC funds seeking logistics solutions",
        "Structured deal preserving founder decision-making authority"
      ],
      results: {
        preMoneyValuation: "€32M",
        investmentRaised: "€7M",
        expansionMarkets: "8 new European countries",
        investorType: "Climate Tech Venture Fund"
      }
    },
    {
      id: 7,
      title: "TMT Sector Mid-Market Exit",
      company: "Cyber Security Solutions AG",
      industry: "Technology",
      location: "Switzerland",
      valuation: "€35.2M",
      exitMultiple: "8.6x EBITDA",
      year: 2024,
      category: "exits",
      story: "This cybersecurity provider had developed proprietary threat detection technology but was struggling to scale across the DACH region. Our team restructured their go-to-market strategy, improved their sales processes, and identified a global security company looking to expand their European footprint and technical capabilities.",
      quote: "MANDA Institute brought tremendous value through their in-depth understanding of both the technical and commercial aspects of our business. Their guidance on strategic positioning and connections to potential buyers was instrumental to our successful exit.",
      clientName: "Markus Weber",
      clientPosition: "Founder & Former CEO, Cyber Security Solutions AG",
      keyFactors: [
        "Identified key IP assets that had not been properly documented or valued",
        "Restructured recurring revenue contracts to improve visibility and valuation",
        "Created competitive bidding environment with both strategic and PE buyers",
        "Negotiated favorable earnout structure tied to achievable metrics"
      ],
      results: {
        initialValuation: "€26.8M",
        finalValuation: "€35.2M",
        timeToClose: "8 months",
        buyerType: "Strategic Global Security Provider"
      }
    },
    {
      id: 8,
      title: "Manufacturing Business Private Equity Investment",
      company: "Circular Materials BV",
      industry: "Sustainable Manufacturing",
      location: "Netherlands",
      valuation: "€42.5M",
      deal: "€15M PE Investment (35% stake)",
      year: 2024,
      category: "investments",
      story: "This innovative circular economy manufacturer had developed a breakthrough process for recycling complex materials but needed capital to scale operations. We positioned their sustainability credentials as a core valuation driver and secured private equity investment at a premium multiple despite being in a traditionally lower-valued manufacturing sector.",
      quote: "The MANDA Institute's approach to valuing our environmental impact and circular business model was revolutionary. They understood that our value went beyond traditional financial metrics and found investors who shared that vision.",
      clientName: "Lotte Vandenberg",
      clientPosition: "CEO, Circular Materials BV",
      keyFactors: [
        "Developed comprehensive ESG impact report that quantified environmental value",
        "Created detailed capacity expansion plan showing 3-year growth trajectory",
        "Secured pre-commitments from major customers to validate market demand",
        "Structured governance model balancing growth goals with founder vision"
      ],
      results: {
        preMoneyValuation: "€42.5M",
        postMoneyValuation: "€57.5M",
        investmentRaised: "€15M",
        investorType: "ESG-focused Private Equity Fund"
      }
    },
    {
      id: 9,
      title: "Belgian Industrial Services Provider Exit",
      company: "IndustrialTech Services",
      industry: "Industrial Services",
      location: "Belgium",
      valuation: "€37.8M",
      exitMultiple: "10.2x EBITDA",
      year: 2023,
      category: "exits",
      story: "This industrial maintenance and services provider had a stable but modest growth profile with strong recurring revenues. By implementing advanced analytics and developing a proprietary asset management platform, we helped the company pivot to a tech-enabled service model that commanded a premium valuation from a strategic buyer.",
      quote: "MANDA Institute helped us see beyond our traditional business model to unlock significant hidden value. Their guidance in transforming our service offering and operational analytics created substantial value that our acquirer immediately recognized.",
      clientName: "Filip Devos",
      clientPosition: "Former Owner, IndustrialTech Services",
      keyFactors: [
        "Developed proprietary digital maintenance platform that increased recurring revenue",
        "Implemented predictive analytics capabilities that reduced client downtime by 26%",
        "Restructured service contracts to highlight data-driven value proposition",
        "Created detailed integration roadmap for potential acquirers"
      ],
      results: {
        initialValuation: "€28.6M",
        finalValuation: "€37.8M",
        timeToClose: "7 months",
        buyerType: "Strategic Industrial Conglomerate"
      }
    },
    {
      id: 10,
      title: "Multi-generational Family Business Succession",
      company: "Schmitt Precision Engineering",
      industry: "Engineering",
      location: "Germany",
      valuation: "€19.2M",
      deal: "Staged Family Transfer & Minority Investment",
      year: 2024,
      category: "succession",
      story: "This fourth-generation precision engineering company faced complex succession challenges with family members having divergent interests. We developed a comprehensive succession plan involving partial transfers, strategic minority investment, and governance restructuring that satisfied all stakeholders while preserving the family legacy.",
      quote: "The MANDA Institute expertly navigated our complex family dynamics and competing objectives. Their methodical approach to valuation and succession planning gave us a clear path forward that honored our heritage while securing our future.",
      clientName: "Christoph Schmitt",
      clientPosition: "Managing Director, Schmitt Precision Engineering",
      keyFactors: [
        "Conducted detailed individual interviews with 14 family stakeholders",
        "Created fair valuation methodology balancing legacy assets and future potential",
        "Developed tiered governance structure with family and independent members",
        "Secured minority investment partner aligned with long-term family values"
      ],
      results: {
        businessValuation: "€19.2M",
        minorityInvestment: "€4.8M (25% stake)",
        familyRetention: "75% ownership across 8 family members",
        governanceStructure: "New two-tier board structure with family council"
      }
    },
    {
      id: 11,
      title: "Swiss Pharmaceutical Services Acquisition",
      company: "PharmaTech Analytics",
      industry: "Life Sciences",
      location: "Switzerland",
      valuation: "€46.2M",
      exitMultiple: "9.5x EBITDA",
      year: 2024,
      category: "exits",
      story: "This specialized pharmaceutical analytics company had unique capabilities but was underselling their strategic value. Our team repositioned them as a critical regulatory compliance partner rather than a service provider, documented their proprietary methodologies, and attracted multiple competing bids from both industry players and private equity.",
      quote: "MANDA Institute's strategic repositioning of our business was transformative. They helped us recognize and communicate our true value, resulting in a transaction that far exceeded our expectations and placed our team in an ideal environment for future growth.",
      clientName: "Dr. Andrea Berger",
      clientPosition: "Founder & Former CEO, PharmaTech Analytics",
      keyFactors: [
        "Developed IP protection strategy for proprietary analytics methods",
        "Created compliance ROI calculator that demonstrated 4x client cost savings",
        "Restructured commercial model to emphasize long-term strategic partnerships",
        "Orchestrated controlled auction process attracting multiple qualified bidders"
      ],
      results: {
        initialValuation: "€32.5M",
        finalValuation: "€46.2M",
        timeToClose: "10 months",
        buyerType: "Global Pharmaceutical Services Group"
      }
    },
    {
      id: 12,
      title: "Benelux Region Manufacturing PE Investment",
      company: "Smart Industrial Components",
      industry: "Advanced Manufacturing",
      location: "Luxembourg",
      valuation: "€29.8M",
      deal: "€12M Growth Investment (40% stake)",
      year: 2025,
      category: "investments",
      story: "This innovative component manufacturer needed capital for European expansion and automation investments. We positioned them at the intersection of traditional manufacturing and Industry 4.0, securing investment from a specialized PE fund at a premium multiple that reflected their technological advantages and growth potential.",
      quote: "The MANDA Institute team deeply understood both our manufacturing heritage and our digital transformation journey. Their ability to articulate our value proposition to financial investors who typically overlooked traditional manufacturing was remarkable.",
      clientName: "Michel Laurent",
      clientPosition: "CEO, Smart Industrial Components",
      keyFactors: [
        "Developed comprehensive automation and digitalization roadmap",
        "Created detailed market expansion plan for five European countries",
        "Implemented advanced manufacturing KPIs that demonstrated efficiency advantages",
        "Structured governance model balancing operational expertise with growth capital"
      ],
      results: {
        preMoneyValuation: "€29.8M",
        investmentRaised: "€12M",
        expansionPlan: "3 new manufacturing facilities",
        investorType: "European Industrial Technology PE Fund"
      }
    }
  ];
  
  // Filter stories based on active tab
  const filteredStories = featuredStories.filter(story => story.category === activeTab);
  
  // Industry distribution for visualization - based on market data
  const industryDistribution = [
    { industry: "Technology (TMT)", percentage: 35 },
    { industry: "Manufacturing", percentage: 27 },
    { industry: "Life Sciences", percentage: 14 },
    { industry: "Industrial Services", percentage: 10 },
    { industry: "Food & Beverage", percentage: 8 },
    { industry: "Other", percentage: 6 }
  ];
  
  // Exit multiple distribution - based on actual market data
  const exitMultiples = [
    { range: "6-7x", percentage: 15 },
    { range: "7-8x", percentage: 20 },
    { range: "8-9x", percentage: 25 },
    { range: "9-10x", percentage: 25 },
    { range: "10x+", percentage: 15 }
  ];
  
  // Annual performance metrics - reflecting market trends
  const annualPerformance = [
    { year: 2022, successfulDeals: 14, averageMultiple: 8.2 },
    { year: 2023, successfulDeals: 21, averageMultiple: 9.1 },
    { year: 2024, successfulDeals: 29, averageMultiple: 9.0 },
    { year: 2025, successfulDeals: 18, averageMultiple: 9.5, inProgress: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800 mb-3">
            Our Success Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real results from real businesses across Europe. Discover how our valuation expertise and market insights have helped companies maximize their value, secure strategic exits, and achieve their business goals.
          </p>
        </div>

        {/* Performance Metrics Section */}
        <RevealOnScroll className="mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-blue-800">Our Track Record</CardTitle>
              <CardDescription className="text-blue-700">
                Key performance metrics from our portfolio of successful valuations and exits
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Success Rate</h3>
                    <LineChart className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-700">78%</p>
                  <p className="text-sm text-gray-600 mt-1">For sell-side M&A in Benelux region</p>
                </div>
                
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">EBITDA Multiple</h3>
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-700">9.0x</p>
                  <p className="text-sm text-gray-600 mt-1">Average multiple for mid-market deals</p>
                </div>
                
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">TMT Sector</h3>
                    <ArrowUp className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-700">8.6x</p>
                  <p className="text-sm text-gray-600 mt-1">EBITDA multiple in DACH region</p>
                </div>
                
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">PE Activity</h3>
                    <Building className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-indigo-700">+20%</p>
                  <p className="text-sm text-gray-600 mt-1">Growth in PE-backed transactions YoY</p>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Industry Expertise</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {industryDistribution.map((item, index) => (
                    <div key={index} className="relative pt-1">
                      <div className="text-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.industry}</span>
                      </div>
                      <div className="flex mb-2 items-center justify-center">
                        <div className="text-xs font-semibold inline-block text-indigo-600">
                          {item.percentage}%
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </RevealOnScroll>

        {/* Success Stories Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-10">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="exits">Successful Exits</TabsTrigger>
            <TabsTrigger value="investments">Growth Investments</TabsTrigger>
            <TabsTrigger value="succession">Succession Planning</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="py-6">
            <div className="grid grid-cols-1 gap-8">
              {filteredStories.map((story, index) => (
                <RevealOnScroll key={story.id} delay={index * 0.1}>
                  <Card className="overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-blue-800">{story.title}</CardTitle>
                          <CardDescription className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                              {story.industry}
                            </span>
                            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-medium">
                              {story.location}
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                              {story.year}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-700">{story.valuation}</p>
                          <p className="text-sm text-gray-600">{story.exitMultiple || story.deal}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <h3 className="font-semibold text-gray-800 mb-2">The Challenge & Solution</h3>
                          <p className="text-gray-600 mb-4">{story.story}</p>
                          
                          <h3 className="font-semibold text-gray-800 mb-2">Key Value Drivers</h3>
                          <ul className="space-y-2">
                            {story.keyFactors.map((factor, i) => (
                              <li key={i} className="flex items-start">
                                <ArrowRightCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mr-2 mt-0.5" />
                                <span className="text-gray-600">{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-5">
                          <div className="flex items-start mb-4">
                            <Quote className="h-8 w-8 text-indigo-300 mr-2 flex-shrink-0" />
                            <div className="italic text-gray-700">
                              "{story.quote}"
                              <div className="mt-3 text-sm font-medium text-gray-800 not-italic">
                                {story.clientName}
                                <div className="text-gray-500 font-normal">{story.clientPosition}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="font-semibold text-gray-800 mb-2">Results</h4>
                            <div className="space-y-2 text-sm">
                              {story.results && Object.entries(story.results).map(([key, value], i) => (
                                <div key={i} className="flex justify-between">
                                  <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                  <span className="font-medium text-indigo-700">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between">
                      <Button variant="outline" className="text-gray-600">
                        <Download className="h-4 w-4 mr-2" /> Download Case Study
                      </Button>
                      
                      <Button variant="default" className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
                        Contact for Similar Valuation
                      </Button>
                    </CardFooter>
                  </Card>
                </RevealOnScroll>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-indigo-600 to-blue-700 shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Ready to Write Your Success Story?
                  </h2>
                  <p className="text-indigo-100 mb-6">
                    Join the growing list of businesses that have achieved their goals through
                    our expert valuation and strategic advisory services.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="default" className="bg-white text-indigo-700 hover:bg-gray-100">
                      Schedule Free Consultation
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-indigo-700">
                      Learn About Our Process
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4">Why Companies Choose Us</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-white/20 p-1 rounded mr-3 mt-0.5">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-indigo-50">Specialized expertise in European markets</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-white/20 p-1 rounded mr-3 mt-0.5">
                        <LineChart className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-indigo-50">Data-driven valuation methodology</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-white/20 p-1 rounded mr-3 mt-0.5">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-indigo-50">Extensive network of qualified buyers and investors</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-white/20 p-1 rounded mr-3 mt-0.5">
                        <Landmark className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-indigo-50">No upfront fees - we succeed when you succeed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { apiRequest } from "@/lib/queryClient";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  id: string;
  model: string;
  object: string;
  created: number;
  citations?: string[];
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta?: {
      role: string;
      content: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// Emilia's knowledge base - content from our website pages
const KNOWLEDGE_BASE = {
  // FAQ content
  faqs: [
    {
      question: "The company is located in a rural area. Is it possible to transfer the company through M&A?",
      answer: "Of course, you can. We will visit you anywhere in the country free of charge. Many of the companies we have worked with as M&A intermediaries are local companies."
    },
    {
      question: "How long does it take for the M&A / company transfer to succeed?",
      answer: "The quickest is 1.5 months from the time of your request. First, we select about 500 - 1000 companies from our database and search for potential buyers. At the earliest, we will conduct an interview within one month from the retainer consultation, go through a period of due diligence, and quickly lead to the conclusion of a contract. Since our M&A Advisers have a wealth of M&A support experience, we can shorten the time required for M&A by eliminating unnecessary exchanges between matching and closing."
    },
    {
      question: "What are the M&A intermediary fees?",
      answer: "We put our customers first and have adopted a completely success-based fee system for M&A of transfer companies. We do not receive any retainer fee or interim fee. For details, please refer to 'Pricing System'."
    },
    {
      question: "What are the advantages of the M&A Research Institute Inc.?",
      answer: "• Transferee company, completely success-based fee system (free of charge until the contract is closed) \n• Extensive track record of M&A support \n• Full support from experienced M&A Advisers \nThese are our 4 strengths. At M&A Research Institute Inc., Advisers who specialize in M&A will conduct M&A negotiations in a polite and sincere manner."
    },
    {
      question: "Will information be leaked to business partners, employees, or financial institutions?",
      answer: "Our company strives to thoroughly manage the confidential information entrusted to us by our customers. Also, when making a proposal to potential buyers, we will only disclose information after narrowing down the potential buyers and concluding an NDA (non-disclosure agreement). If you ask multiple M&A intermediary companies to act as mediators (so-called non-exclusive contracts), the risk of information leakage increases. In order to prevent information leaks, we recommend that you sign an exclusive contract with only one company as an intermediary."
    },
    {
      question: "I have not decided on M&A, but can I consult with you?",
      answer: "Please feel free to contact us. Talk with us, and we can find the best ideas together. We are happy to hear from you if you would like to collect information."
    },
    {
      question: "We are in the red this term, but is M&A possible?",
      answer: "There are many cases of M&A of loss-making companies. Consultation fee is free, so please contact us first."
    },
    {
      question: "How is the transfer price for the M&A calculated?",
      answer: "The M&A Adviser will calculate the corporate value after considering not only tangible assets and profits, but also intangible assets and know-how. Based on the results, we will determine the desired transfer price based on the owner's intentions."
    },
    {
      question: "Can I transfer or sell only one business?",
      answer: "There are various methods such as business transfer and company split, so please contact us first."
    },
    {
      question: "Will the CEO continue to be involved in the business when the transfer is decided with M&A?",
      answer: "In some cases, they will continue to be involved in the business after the transfer, and in others, they will retire. It is possible to proceed according to the president's wishes."
    }
  ],
  
  // Valuation services
  valuationServices: {
    overview: "At M&A × AI, your business valuation begins entirely free of charge, saving you thousands typically spent on initial consulting fees. Our advanced AI-driven valuation platform gives you precise insights into your company's worth quickly and efficiently.",
    features: [
      "Instant Free Valuation - Receive a professional valuation within minutes, benchmarked against real-time European market data.",
      "Zero Cost Until Deal - No hidden costs. You only pay upon the successful closure of your M&A transaction.",
      "Transparent & Trustworthy - Our fees are clearly based on the final transfer price, ensuring fairness and transparency."
    ],
    methodology: [
      "EBITDA Multiple Method - Industry-specific multipliers based on real European transaction data",
      "Discounted Cash Flow Analysis - Forward-looking valuation with risk-adjusted European discount rates",
      "Asset-Based Valuation - Comprehensive assessment of tangible and intangible assets",
      "Comparable Transaction Analysis - Benchmarking against recent European M&A deals"
    ],
    aiFeatures: [
      "Machine Learning Models - Trained on 10,000+ European transactions for regional accuracy",
      "Industry-Specific Factors - 57+ data points analyzed per valuation",
      "Real-Time Market Data - Continuous updates from European financial markets",
      "Risk Assessment - Advanced algorithms to identify and quantify business-specific risks"
    ]
  },
  
  // Our approach
  ourApproach: {
    overview: "At M&A × AI, we understand European SMBs deeply. We recognize that many businesses, particularly those owned by baby boomers, face challenges in finding suitable successors. While big Private Equity firms often overlook these businesses, we step in to empower SMBs by providing fun, real-time, and free valuations using cutting-edge AI technology.",
    approach: "We're revolutionizing the traditional, slow, and boring M&A processes, turning them into simple, exciting experiences. Our state-of-the-art AI matching algorithms, developed by M&A Research Institute Inc., enable rapid, accurate matches for mergers, acquisitions, investments, and sales opportunities. First, we help entrepreneurs get a fast, hassle-free valuation. If you're happy with this initial insight, we're here to guide you seamlessly towards your ultimate business goals.",
    features: [
      "AI-Powered Insights - Our proprietary algorithms analyze over 30 market factors to provide accurate, data-driven valuations tailored specifically to European markets.",
      "Accelerated Processes - We've streamlined the entire M&A journey, enabling deals to close in as little as 49 days—drastically faster than the industry average of 6-9 months.",
      "Data-Driven Matching - Our algorithms match businesses with potential buyers based on over 150 compatibility factors, ensuring the best possible fit for long-term success.",
      "Success-Based Model - We only charge fees upon successful deal closure, aligning our incentives perfectly with yours and eliminating the burden of upfront or hidden costs."
    ]
  },
  
  // European markets info
  europeanMarkets: {
    overview: "Europe's economic landscape in 2025 presents a complex mix of challenges and opportunities for small and medium-sized businesses (SMBs). While overall GDP growth is projected to be modest, certain sectors and regions offer significant potential for investment and expansion.",
    outlook: "The European Commission forecasts a GDP growth of 0.9% in 2025, with an acceleration to 1.5% in 2026, driven by increased consumption and a recovery in investment.",
    sectors: [
      "Technology and Digital Transformation: The rapid advancement in digital technologies continues to create opportunities for SMBs, particularly in areas like artificial intelligence, cybersecurity, and high-performance computing.",
      "Renewable Energy: The EU's commitment to the Green Deal necessitates significant investments in sustainable energy solutions, presenting opportunities for SMBs in the renewable energy sector.",
      "Pharmaceuticals and Healthcare: An aging population and increased focus on healthcare innovation make this sector ripe for investment and expansion."
    ],
    regions: [
      "Nordics: Known for tech innovation and a supportive startup ecosystem, countries like Sweden and Finland offer fertile ground for technology-focused SMBs.",
      "Benelux: Belgium, Netherlands, and Luxembourg provide robust digital infrastructures and a strategic location for digital services companies.",
      "Southern Europe: Countries such as Spain and Italy are investing heavily in renewable energy, aligning with the EU's sustainability goals and offering opportunities in the green energy sector."
    ],
    support: [
      "SME Fund 2025: This initiative by the European Commission provides financial support to SMEs established in the EU to protect their intellectual property rights.",
      "SME Access to Finance Initiative: A joint program by the European Investment Bank (EIB) and the EU aims to enhance access to finance for SMBs.",
      "Digital Europe Programme: Launched in 2021, this funding instrument focuses on development and innovation in digital technologies."
    ],
    trends: [
      "Sustainability and Green Investments: There's a strong push towards sustainability, with substantial investments required to meet the EU's climate goals.",
      "Digital Transformation: The accelerated adoption of digital technologies across sectors is creating new business models and opportunities.",
      "Regulatory Simplification: Efforts are underway to simplify regulations, making it easier for SMBs to operate and expand."
    ]
  },
  
  // Company info
  companyInfo: {
    name: "M&A × AI",
    specialty: "Business valuation and M&A facilitation for European SMBs with EBITDA under €10 million",
    valueProposition: "Zero upfront fees, AI-powered valuations, and success-based fee structure",
    contactInfo: "Please use the contact form on our website to reach our M&A Advisers."
  }
};

// Find the best answer from our knowledge base based on the query
function findBestAnswer(query: string): string {
  // Normalize query for better matching
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for exact FAQ matches first
  for (const faq of KNOWLEDGE_BASE.faqs) {
    if (normalizedQuery.includes(faq.question.toLowerCase())) {
      return faq.answer;
    }
  }
  
  // Look for keyword matches
  
  // M&A timing
  if (normalizedQuery.includes("how long") || normalizedQuery.includes("time") || normalizedQuery.includes("duration") || normalizedQuery.includes("how much time")) {
    return KNOWLEDGE_BASE.faqs[1].answer;
  }
  
  // Fees
  if (normalizedQuery.includes("fee") || normalizedQuery.includes("cost") || normalizedQuery.includes("price") || normalizedQuery.includes("charge") || normalizedQuery.includes("pay")) {
    return KNOWLEDGE_BASE.faqs[2].answer;
  }
  
  // Advantages
  if (normalizedQuery.includes("advantage") || normalizedQuery.includes("benefit") || normalizedQuery.includes("why choose") || normalizedQuery.includes("strength")) {
    return KNOWLEDGE_BASE.faqs[3].answer;
  }
  
  // Confidentiality
  if (normalizedQuery.includes("confidential") || normalizedQuery.includes("leak") || normalizedQuery.includes("secret") || normalizedQuery.includes("private") || normalizedQuery.includes("nda")) {
    return KNOWLEDGE_BASE.faqs[4].answer;
  }
  
  // Consultation
  if (normalizedQuery.includes("consult") || normalizedQuery.includes("advice") || normalizedQuery.includes("not decided") || normalizedQuery.includes("thinking about")) {
    return KNOWLEDGE_BASE.faqs[5].answer;
  }
  
  // Unprofitable companies
  if (normalizedQuery.includes("loss") || normalizedQuery.includes("red") || normalizedQuery.includes("unprofitable") || normalizedQuery.includes("negative profit")) {
    return KNOWLEDGE_BASE.faqs[6].answer;
  }
  
  // Valuation calculation
  if (normalizedQuery.includes("how is") && normalizedQuery.includes("calculate") || 
      normalizedQuery.includes("valuation method") || normalizedQuery.includes("determine value") || 
      normalizedQuery.includes("value calculation")) {
    // If asking about detailed methodology, provide more comprehensive info
    if (normalizedQuery.includes("methodology") || normalizedQuery.includes("detail") || normalizedQuery.includes("approach")) {
      return `We use several valuation methods to accurately determine your business's worth:\n\n` + 
        KNOWLEDGE_BASE.valuationServices.methodology.join("\n\n") + 
        `\n\nOur AI enhancement further improves accuracy through:\n\n` + 
        KNOWLEDGE_BASE.valuationServices.aiFeatures.join("\n\n");
    }
    // Otherwise give the basic answer
    return KNOWLEDGE_BASE.faqs[7].answer;
  }
  
  // Partial business sale
  if (normalizedQuery.includes("part") || normalizedQuery.includes("only one") || normalizedQuery.includes("portion") || normalizedQuery.includes("division")) {
    return KNOWLEDGE_BASE.faqs[8].answer;
  }
  
  // CEO involvement
  if (normalizedQuery.includes("ceo") || normalizedQuery.includes("owner") || normalizedQuery.includes("founder") || 
      normalizedQuery.includes("continue") || normalizedQuery.includes("stay") || normalizedQuery.includes("retire")) {
    return KNOWLEDGE_BASE.faqs[9].answer;
  }
  
  // European market questions
  if (normalizedQuery.includes("europe") || normalizedQuery.includes("market") || normalizedQuery.includes("economic") || 
      normalizedQuery.includes("sector") || normalizedQuery.includes("industry") || normalizedQuery.includes("region")) {
    let response = KNOWLEDGE_BASE.europeanMarkets.overview + "\n\n";
    
    if (normalizedQuery.includes("sector") || normalizedQuery.includes("industry")) {
      response += "Key sectors with growth potential:\n\n" + KNOWLEDGE_BASE.europeanMarkets.sectors.join("\n\n");
    } else if (normalizedQuery.includes("region") || normalizedQuery.includes("country") || normalizedQuery.includes("location")) {
      response += "Regional hotspots for expansion:\n\n" + KNOWLEDGE_BASE.europeanMarkets.regions.join("\n\n");
    } else if (normalizedQuery.includes("trend") || normalizedQuery.includes("future") || normalizedQuery.includes("emerging")) {
      response += "Emerging trends shaping the market:\n\n" + KNOWLEDGE_BASE.europeanMarkets.trends.join("\n\n");
    } else if (normalizedQuery.includes("support") || normalizedQuery.includes("fund") || normalizedQuery.includes("initiative") || normalizedQuery.includes("government")) {
      response += "Governmental support and funding initiatives:\n\n" + KNOWLEDGE_BASE.europeanMarkets.support.join("\n\n");
    } else {
      response += "The European Commission forecasts a GDP growth of 0.9% in 2025, with an acceleration to 1.5% in 2026. Despite this modest growth, specific sectors present significant opportunities for SMBs.";
    }
    
    return response;
  }
  
  // Valuation services
  if (normalizedQuery.includes("valuation") || normalizedQuery.includes("worth") || normalizedQuery.includes("value") || 
      normalizedQuery.includes("how much is") || normalizedQuery.includes("estimate")) {
    return `${KNOWLEDGE_BASE.valuationServices.overview}\n\nOur valuation service offers:\n\n` + 
      KNOWLEDGE_BASE.valuationServices.features.join("\n\n");
  }
  
  // Our approach
  if (normalizedQuery.includes("approach") || normalizedQuery.includes("process") || normalizedQuery.includes("how do you") || 
      normalizedQuery.includes("how you") || normalizedQuery.includes("method") || normalizedQuery.includes("work")) {
    return `${KNOWLEDGE_BASE.ourApproach.overview}\n\n${KNOWLEDGE_BASE.ourApproach.approach}\n\n` + 
      "Our key differentiators:\n\n" + KNOWLEDGE_BASE.ourApproach.features.join("\n\n");
  }
  
  // About the company
  if (normalizedQuery.includes("about") || normalizedQuery.includes("who are you") || normalizedQuery.includes("company") || 
      normalizedQuery.includes("what is") || normalizedQuery.includes("tell me about")) {
    return `${KNOWLEDGE_BASE.companyInfo.name} specializes in ${KNOWLEDGE_BASE.companyInfo.specialty}. We offer ${KNOWLEDGE_BASE.companyInfo.valueProposition}.`;
  }
  
  // Contact information
  if (normalizedQuery.includes("contact") || normalizedQuery.includes("reach") || normalizedQuery.includes("phone") || 
      normalizedQuery.includes("email") || normalizedQuery.includes("talk to")) {
    return KNOWLEDGE_BASE.companyInfo.contactInfo;
  }
  
  // Default response if no match found
  return "I don't have specific information about that in my knowledge base. Would you like to know about our valuation services, our approach to M&A, or information about European markets? You can also contact our M&A Advisers directly through the contact form on our website.";
}

// Format the chat response to simulate a Perplexity API response
function formatChatResponse(answer: string): ChatResponse {
  const now = Math.floor(Date.now() / 1000);
  
  return {
    id: `emilia-response-${now}`,
    model: "emilia-knowledge-base",
    object: "chat.completion",
    created: now,
    choices: [
      {
        index: 0,
        finish_reason: "stop",
        message: {
          role: "assistant",
          content: answer
        }
      }
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  };
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    // Extract the user's message (last message if it's a user)
    const userMessages = messages.filter(msg => msg.role === "user");
    if (userMessages.length === 0) {
      throw new Error("No user message found");
    }
    
    const userQuery = userMessages[userMessages.length - 1].content;
    
    // Find the best answer from our knowledge base
    const answer = findBestAnswer(userQuery);
    
    // Format the response
    const response = formatChatResponse(answer);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return response;
  } catch (error) {
    console.error("Error processing chat message:", error);
    
    // Return a formatted error response
    return formatChatResponse(
      "I apologize, but I'm having trouble processing your request at the moment. Please try again or contact our support team for assistance."
    );
  }
}

export async function getBusinessValuationResponse(query: string): Promise<string> {
  try {
    // Create temporary messages array with just the user query
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: "You are Emilia, an expert business valuation assistant for European SMBs."
      },
      {
        role: "user",
        content: query
      }
    ];

    const response = await sendChatMessage(messages);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error getting business valuation response:", error);
    return "I apologize, but I'm having trouble connecting to my knowledge base at the moment. Please try again later or contact our support team for assistance.";
  }
}

// Specific business valuation assistant functions
export async function analyzeValuationFactors(
  sector: string, 
  revenue: number, 
  ebitda: number, 
  yearsInBusiness: string
): Promise<string> {
  const query = `Analyze the valuation factors for a ${sector} business with €${revenue.toLocaleString()} in revenue, €${ebitda.toLocaleString()} EBITDA, and ${yearsInBusiness} years in business.`;
  return getBusinessValuationResponse(query);
}

export async function suggestValuationImprovements(
  sector: string,
  currentValuation: number,
  weakAreas: string[]
): Promise<string> {
  const weakAreasText = weakAreas.join(", ");
  const query = `Suggest practical improvements to increase the valuation of a ${sector} business currently valued at €${currentValuation.toLocaleString()}. The business shows weaknesses in these areas: ${weakAreasText}.`;
  return getBusinessValuationResponse(query);
}

export async function explainValuationMethod(method: string): Promise<string> {
  const query = `Explain the "${method}" valuation method in simple terms.`;
  return getBusinessValuationResponse(query);
}
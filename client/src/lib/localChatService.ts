import { ChatMessage } from "./chatService";

// FAQ content from our website
const faqContent = [
  {
    question: "The company is located in a rural area. Is it possible to transfer the company through M&A?",
    answer: "Of course, you can. We will visit you anywhere in the country free of charge. Many of the companies we have worked with as M&A intermediaries are local companies."
  },
  {
    question: "How long does it take for the M&A / company transfer to succeed?",
    answer: "The quickest is 1.5 months from the time of your request. First, we select about 500 - 1000 companies from our database and search for potential buyers. At the earliest, we will conduct an interview within one month from the retainer consultation, go through a period of due diligence, and quickly lead to the conclusion of a contract. Since our M&A Advisers have a wealth of M&A support experience, we can shorten the time required for M&A by eliminating unnecessary exchanges between matching and closing. In the M&A industry, we often hear people say, 'I requested an Adviser, but several months passed with nothing.' At the M&A Research Institute Inc., we commit to results from the customer's point of view."
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
];

// Additional site content
const siteContent = {
  companyInfo: "M&A Research Institute Inc. specializes in M&A and business succession solutions for European SMBs with EBITDA under €10 million. We offer a completely success-based fee system for transfer companies with no retainer or interim fees.",
  valuationInfo: "Our valuation process takes into account not only tangible assets and profits but also intangible assets, market position, and growth potential. We provide comprehensive valuation services to determine the optimal transfer price based on the owner's intentions.",
  services: [
    "M&A Advisory",
    "Business Succession Planning",
    "Valuation Services",
    "Buyer Matching",
    "Due Diligence Support",
    "Post-Merger Integration"
  ],
  europeanMarkets: "We specialize in European SMB markets with a focus on companies in the Benelux and DACH regions. Our expertise covers various industries including manufacturing, technology, healthcare, and professional services.",
  contactInfo: "Please feel free to contact us for a consultation. Our experienced M&A Advisers are ready to assist you with any questions regarding M&A or business succession.",
  ourApproach: "At M&A × AI, we understand European SMBs deeply. We recognize that many businesses, particularly those owned by baby boomers, face challenges in finding suitable successors. While big Private Equity firms often overlook these businesses, we step in to empower SMBs by providing fun, real-time, and free valuations using cutting-edge AI technology. We're revolutionizing the traditional, slow, and boring M&A processes, turning them into simple, exciting experiences. Our state-of-the-art AI matching algorithms, developed by M&A Research Institute Inc., enable rapid, accurate matches for mergers, acquisitions, investments, and sales opportunities.",
  keyFeatures: [
    "AI-Powered Insights: Our proprietary algorithms analyze over 30 market factors to provide accurate, data-driven valuations tailored specifically to European markets.",
    "Accelerated Processes: We've streamlined the entire M&A journey, enabling deals to close in as little as 49 days—drastically faster than the industry average of 6-9 months.",
    "Data-Driven Matching: Our algorithms match businesses with potential buyers based on over 150 compatibility factors, ensuring the best possible fit for long-term success.",
    "Success-Based Model: We only charge fees upon successful deal closure, aligning our incentives perfectly with yours and eliminating the burden of upfront or hidden costs."
  ],
  industryTrends: "The European SMB market is dynamically evolving. Over the next five years, industries such as technology, renewable energy, digital healthcare, sustainable agriculture, and e-commerce are set to thrive dramatically. Driven by EU initiatives like the Green Deal, digitalization funding, and economic resilience plans, SMBs in these sectors can expect significant growth opportunities.",
  industryGrowth: {
    "Technology": "+28.5%",
    "Renewable Energy": "+32.7%",
    "Digital Healthcare": "+24.3%",
    "Sustainable Agriculture": "+18.9%",
    "E-Commerce": "+21.6%"
  },
  euInitiatives: "Key EU initiatives driving growth include the European Green Deal (€1 trillion investment to make Europe climate-neutral by 2050), Digital Europe Programme, Horizon Europe research funding, and SME Strategy for a sustainable and digital Europe."
};

// Helper function to find the best matching FAQ based on user query
function findBestMatchingFAQ(query: string) {
  // Convert query to lowercase for case-insensitive matching
  const lowerQuery = query.toLowerCase();
  
  // Keywords to look for
  const keywords = [
    { words: ['fee', 'cost', 'price', 'pricing', 'charge', 'intermediary'], index: 2 },
    { words: ['time', 'duration', 'long', 'quick', 'fast'], index: 1 },
    { words: ['advantage', 'benefit', 'strength', 'pros'], index: 3 },
    { words: ['rural', 'local', 'area', 'location', 'remote'], index: 0 },
    { words: ['leak', 'confidential', 'secret', 'private', 'disclose', 'nda'], index: 4 },
    { words: ['consult', 'advice', 'question', 'help', 'contact'], index: 5 },
    { words: ['loss', 'red', 'profit', 'negative', 'debt'], index: 6 },
    { words: ['calculate', 'valuation', 'transfer price', 'worth', 'value'], index: 7 },
    { words: ['one business', 'partial', 'division', 'department', 'unit', 'part of'], index: 8 },
    { words: ['ceo', 'president', 'owner', 'involve', 'retire', 'continue'], index: 9 }
  ];
  
  // Check for exact matches
  for (let i = 0; i < faqContent.length; i++) {
    if (lowerQuery.includes(faqContent[i].question.toLowerCase())) {
      return faqContent[i];
    }
  }
  
  // Check for keyword matches
  for (const kw of keywords) {
    if (kw.words.some(word => lowerQuery.includes(word))) {
      return faqContent[kw.index];
    }
  }
  
  // If no specific match, return a general answer
  return null;
}

// Function to generate a response based on user input
function generateResponse(query: string): string {
  // Greetings
  if (/^(hello|hi|hey|greetings)/i.test(query)) {
    return "Hello! I'm Emilia, your M&A assistant. How can I help you today with business valuation or M&A questions?";
  }
  
  // Goodbye
  if (/^(bye|goodbye|see you)/i.test(query)) {
    return "Thank you for chatting with me! If you have more questions about M&A or business valuation, feel free to ask anytime.";
  }
  
  // Thank you
  if (/thank you|thanks/i.test(query)) {
    return "You're welcome! I'm here to help with any other questions you might have about M&A and business valuation.";
  }
  
  // Check for FAQ matches
  const faqMatch = findBestMatchingFAQ(query);
  if (faqMatch) {
    return faqMatch.answer;
  }
  
  // If it contains keywords about the company
  if (/company|about|who are you|what do you do/i.test(query)) {
    return siteContent.companyInfo;
  }
  
  // If it's about services
  if (/services|offer|provide/i.test(query)) {
    return `We offer the following services:\n• ${siteContent.services.join("\n• ")}\n\nFor more information, please visit our Services page or contact us directly.`;
  }
  
  // If it's about European markets
  if (/europe|european|market|region|industry/i.test(query)) {
    return siteContent.europeanMarkets;
  }
  
  // If it's about contact
  if (/contact|reach|call|email/i.test(query)) {
    return siteContent.contactInfo;
  }
  
  // If it's about valuation
  if (/valuation|value|worth/i.test(query)) {
    return siteContent.valuationInfo;
  }
  
  // Default response
  return "I can answer questions about M&A, business succession, and valuation services based on our website content. Could you please rephrase your question or check our FAQ page for more information? Alternatively, you can contact our M&A advisers directly for personalized assistance.";
}

// Function to process chat messages and return a response
export async function processLocalChat(messages: ChatMessage[]): Promise<string> {
  // Get the last user message (query)
  const userMessages = messages.filter(msg => msg.role === "user");
  
  if (userMessages.length === 0) {
    return "Hello! I'm Emilia, your M&A assistant. How can I help you today?";
  }
  
  const lastUserMessage = userMessages[userMessages.length - 1].content;
  return generateResponse(lastUserMessage);
}

// Function to be used by the chat interface
export async function sendLocalChatMessage(messages: ChatMessage[]): Promise<{
  id: string;
  content: string;
}> {
  try {
    const response = await processLocalChat(messages);
    
    // Create a mock response object similar to what would come from an API
    return {
      id: Date.now().toString(),
      content: response
    };
  } catch (error) {
    console.error("Error processing local chat:", error);
    throw error;
  }
}
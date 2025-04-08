import { z } from 'zod';

// Define the industry categories and subcategories
export type IndustrySubcategory = {
  id: string;
  name: string;
  description: string;
};

export type Industry = {
  id: string;
  name: string;
  description: string;
  subcategories: IndustrySubcategory[];
};

// Define benchmark metrics that will be tracked for each industry
export type BenchmarkMetric = {
  id: string;
  name: string;
  description: string;
  unit: string;
  higherIsBetter: boolean;
};

// Define benchmark data structure
export type IndustryBenchmarkData = {
  industryId: string;
  subcategoryId?: string; // Optional - more specific benchmarks for subcategories
  year: number;
  quarter?: number; // Optional - quarterly data
  metrics: Record<string, number>; // Key is metric ID, value is the benchmark value
};

// Validation schemas
export const industrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  subcategories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string()
  }))
});

export const benchmarkMetricSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  unit: z.string(),
  higherIsBetter: z.boolean()
});

export const industryBenchmarkDataSchema = z.object({
  industryId: z.string(),
  subcategoryId: z.string().optional(),
  year: z.number(),
  quarter: z.number().optional(),
  metrics: z.record(z.string(), z.number())
});

// Industry definitions
export const industries: Industry[] = [
  {
    id: 'pe-vc',
    name: 'Private Equity & Venture Capital',
    description: 'Firms investing in private companies at various stages of growth and maturity.',
    subcategories: [
      {
        id: 'pe-vc-growth',
        name: 'Growth Equity',
        description: 'Investments in companies with proven business models seeking capital for expansion.'
      },
      {
        id: 'pe-vc-buyout',
        name: 'Buyout Firms',
        description: 'Firms that acquire majority control of mature companies using significant leverage.'
      },
      {
        id: 'pe-vc-early-stage',
        name: 'Early Stage VC',
        description: 'Investments in startups and early-stage companies with high growth potential.'
      },
      {
        id: 'pe-vc-late-stage',
        name: 'Late Stage VC',
        description: 'Investments in more established private companies preparing for exits or IPOs.'
      },
      {
        id: 'pe-vc-impact',
        name: 'Impact Investing',
        description: 'Investments made with the intention to generate positive social or environmental impact alongside financial returns.'
      },
      {
        id: 'pe-vc-secondary',
        name: 'Secondary Funds',
        description: 'Firms specializing in acquiring existing LP interests in private equity funds.'
      },
      {
        id: 'pe-vc-debt',
        name: 'Private Debt',
        description: 'Funds providing debt financing to private companies or PE-backed businesses.'
      },
      {
        id: 'pe-vc-distressed',
        name: 'Distressed & Special Situations',
        description: 'Firms investing in troubled companies or special opportunity situations.'
      }
    ]
  },
  {
    id: 'im',
    name: 'Investment Management',
    description: 'Organizations managing investments across various asset classes and strategies.',
    subcategories: [
      {
        id: 'im-asset',
        name: 'Asset Management',
        description: 'Firms managing investment portfolios on behalf of clients.'
      },
      {
        id: 'im-wealth',
        name: 'Wealth Management',
        description: 'Financial advisory services for high-net-worth individuals and families.'
      },
      {
        id: 'im-hedge',
        name: 'Hedge Funds',
        description: 'Investment funds employing various strategies to generate alpha and manage risk.'
      },
      {
        id: 'im-family',
        name: 'Family Offices',
        description: 'Private wealth management firms serving ultra-high-net-worth individuals and families.'
      },
      {
        id: 'im-pension',
        name: 'Pension Funds',
        description: 'Retirement investment funds managing assets for plan participants.'
      },
      {
        id: 'im-sovereign',
        name: 'Sovereign Wealth Funds',
        description: 'State-owned investment funds managing a country\'s assets.'
      },
      {
        id: 'im-endowment',
        name: 'Endowments & Foundations',
        description: 'Investment organizations managing assets for educational institutions and nonprofit organizations.'
      },
      {
        id: 'im-etf',
        name: 'ETF & Index Providers',
        description: 'Organizations creating and managing exchange-traded funds and index products.'
      }
    ]
  },
  {
    id: 'ib',
    name: 'Investment Banking',
    description: 'Financial institutions that provide capital raising, M&A, and advisory services to corporations and governments.',
    subcategories: [
      {
        id: 'ib-ma',
        name: 'Mergers & Acquisitions',
        description: 'Advisory services for company mergers, acquisitions, divestitures, and restructurings.'
      },
      {
        id: 'ib-capital-markets',
        name: 'Capital Markets',
        description: 'Services for companies raising capital through debt and equity offerings.'
      },
      {
        id: 'ib-restructuring',
        name: 'Restructuring & Distressed',
        description: 'Advisory services for companies undergoing financial restructuring or bankruptcy.'
      },
      {
        id: 'ib-private-placement',
        name: 'Private Placements',
        description: 'Services to help companies raise capital through private securities offerings.'
      },
      {
        id: 'ib-specialty',
        name: 'Industry Specialists',
        description: 'Investment banks with specialized expertise in specific industry sectors.'
      },
      {
        id: 'ib-boutique',
        name: 'Boutique Advisory Firms',
        description: 'Independent firms offering specialized investment banking services.'
      },
      {
        id: 'ib-full-service',
        name: 'Full-Service Investment Banks',
        description: 'Large financial institutions offering a comprehensive range of investment banking services.'
      },
      {
        id: 'ib-merchant',
        name: 'Merchant Banking',
        description: 'Banks that both advise on and invest in transactions with their own capital.'
      }
    ]
  },
  {
    id: 'tech',
    name: 'Technology',
    description: 'Companies involved in the research, development, or distribution of technologically based goods and services.',
    subcategories: [
      {
        id: 'tech-software',
        name: 'Enterprise Software',
        description: 'Companies developing business applications, productivity software, and platforms for corporate use.'
      },
      {
        id: 'tech-saas',
        name: 'SaaS & Cloud',
        description: 'Companies offering software as a service and cloud-based solutions.'
      },
      {
        id: 'tech-ai',
        name: 'AI & Machine Learning',
        description: 'Companies focused on artificial intelligence and machine learning technologies.'
      },
      {
        id: 'tech-fintech',
        name: 'Financial Technology',
        description: 'Technology companies providing financial services and solutions.'
      },
      {
        id: 'tech-healthtech',
        name: 'Healthcare Technology',
        description: 'Technology companies serving the healthcare industry with software and solutions.'
      },
      {
        id: 'tech-cybersecurity',
        name: 'Cybersecurity',
        description: 'Companies providing cybersecurity solutions and services.'
      },
      {
        id: 'tech-data',
        name: 'Data Analytics & Services',
        description: 'Companies specializing in data processing, analytics, and insights.'
      },
      {
        id: 'tech-enterprise',
        name: 'Enterprise Infrastructure',
        description: 'Companies providing technology infrastructure solutions for large organizations.'
      }
    ]
  },
  {
    id: 'fs',
    name: 'Financial Services',
    description: 'Institutions that provide financial and banking products and services.',
    subcategories: [
      {
        id: 'fs-banking',
        name: 'Banking',
        description: 'Traditional and digital banking institutions offering deposit and lending services.'
      },
      {
        id: 'fs-insurance',
        name: 'Insurance',
        description: 'Companies providing various types of insurance coverage and risk management solutions.'
      },
      {
        id: 'fs-payments',
        name: 'Payments & Processing',
        description: 'Companies facilitating payment transactions and processing services.'
      },
      {
        id: 'fs-lending',
        name: 'Specialty Lending',
        description: 'Financial institutions focused on specific lending segments or non-traditional lending.'
      },
      {
        id: 'fs-marketmaking',
        name: 'Market Making & Trading',
        description: 'Firms providing liquidity and trading services in financial markets.'
      },
      {
        id: 'fs-exchanges',
        name: 'Exchanges & Trading Platforms',
        description: 'Organizations that operate financial markets and trading platforms.'
      },
      {
        id: 'fs-advisory',
        name: 'Financial Advisory',
        description: 'Firms providing financial planning and advisory services to individuals and businesses.'
      },
      {
        id: 'fs-services',
        name: 'Financial Services Tech',
        description: 'Technology providers specializing in solutions for financial institutions.'
      }
    ]
  },
  {
    id: 'hc',
    name: 'Healthcare',
    description: 'Organizations involved in the provision of healthcare services or products.',
    subcategories: [
      {
        id: 'hc-providers',
        name: 'Healthcare Providers',
        description: 'Hospitals, clinics, physician practices, and other healthcare service providers.'
      },
      {
        id: 'hc-pharma',
        name: 'Pharmaceuticals',
        description: 'Companies that research, develop, and produce pharmaceuticals.'
      },
      {
        id: 'hc-biotech',
        name: 'Biotechnology',
        description: 'Companies applying biology and technology to develop healthcare products and solutions.'
      },
      {
        id: 'hc-devices',
        name: 'Medical Devices',
        description: 'Companies that manufacture medical devices and equipment.'
      },
      {
        id: 'hc-digital',
        name: 'Digital Health',
        description: 'Companies providing technology-enabled healthcare services and solutions.'
      },
      {
        id: 'hc-services',
        name: 'Healthcare Services',
        description: 'Service providers supporting the healthcare industry.'
      },
      {
        id: 'hc-payers',
        name: 'Payers & Insurance',
        description: 'Health insurance companies and organizations managing healthcare benefits.'
      },
      {
        id: 'hc-diagnostics',
        name: 'Diagnostics & Labs',
        description: 'Companies providing diagnostic testing and laboratory services.'
      }
    ]
  },
  {
    id: 'biz',
    name: 'Business Services',
    description: 'Companies that provide essential services and solutions to businesses across industries.',
    subcategories: [
      {
        id: 'biz-consulting',
        name: 'Management Consulting',
        description: 'Firms providing strategic and operational advisory services to businesses.'
      },
      {
        id: 'biz-hr',
        name: 'HR & Workforce Solutions',
        description: 'Companies providing human resources services, staffing, and workforce management.'
      },
      {
        id: 'biz-marketing',
        name: 'Marketing & Communications',
        description: 'Agencies and service providers for marketing, advertising, and communications.'
      },
      {
        id: 'biz-legal',
        name: 'Legal Services',
        description: 'Law firms and legal service providers for corporate clients.'
      },
      {
        id: 'biz-analytics',
        name: 'Data & Analytics Services',
        description: 'Firms providing data management, analytics, and business intelligence services.'
      },
      {
        id: 'biz-outsourcing',
        name: 'Business Process Outsourcing',
        description: 'Companies that manage outsourced business operations for clients.'
      },
      {
        id: 'biz-professional',
        name: 'Professional Services',
        description: 'Accounting, tax, audit, and other specialized professional services.'
      },
      {
        id: 'biz-logistics',
        name: 'Logistics & Supply Chain',
        description: 'Companies providing logistics, supply chain management, and distribution services.'
      }
    ]
  },
  {
    id: 'consumer',
    name: 'Consumer',
    description: 'Companies providing products and services directly to consumers.',
    subcategories: [
      {
        id: 'consumer-retail',
        name: 'Retail & E-commerce',
        description: 'Traditional and online retailers selling products to consumers.'
      },
      {
        id: 'consumer-cpg',
        name: 'Consumer Products',
        description: 'Companies manufacturing and selling packaged consumer goods.'
      },
      {
        id: 'consumer-food',
        name: 'Food & Beverage',
        description: 'Companies producing and distributing food and beverage products.'
      },
      {
        id: 'consumer-luxury',
        name: 'Luxury & Premium Brands',
        description: 'Businesses offering high-end luxury products and premium experiences.'
      },
      {
        id: 'consumer-travel',
        name: 'Travel & Leisure',
        description: 'Companies providing travel, hospitality, and leisure services and experiences.'
      },
      {
        id: 'consumer-media',
        name: 'Media & Entertainment',
        description: 'Companies creating and distributing content and entertainment for consumers.'
      },
      {
        id: 'consumer-apparel',
        name: 'Apparel & Fashion',
        description: 'Businesses designing, manufacturing, and selling clothing and fashion items.'
      },
      {
        id: 'consumer-tech',
        name: 'Consumer Technology',
        description: 'Companies producing technology products and services for consumer use.'
      }
    ]
  },
  {
    id: 'industry',
    name: 'Industrial',
    description: 'Companies involved in manufacturing, construction, materials, and related industrial activities.',
    subcategories: [
      {
        id: 'industry-manufacturing',
        name: 'Advanced Manufacturing',
        description: 'Companies using advanced technologies for manufacturing products.'
      },
      {
        id: 'industry-aerospace',
        name: 'Aerospace & Defense',
        description: 'Companies producing aircraft, defense systems, and related technologies.'
      },
      {
        id: 'industry-auto',
        name: 'Automotive & Mobility',
        description: 'Companies involved in the automotive industry and mobility solutions.'
      },
      {
        id: 'industry-construction',
        name: 'Construction & Engineering',
        description: 'Companies providing construction, engineering, and related services.'
      },
      {
        id: 'industry-chemicals',
        name: 'Chemicals & Materials',
        description: 'Companies producing industrial chemicals and advanced materials.'
      },
      {
        id: 'industry-machinery',
        name: 'Machinery & Equipment',
        description: 'Manufacturers of industrial machinery and equipment.'
      },
      {
        id: 'industry-automation',
        name: 'Industrial Automation',
        description: 'Companies providing automation solutions for industrial processes.'
      },
      {
        id: 'industry-logistics',
        name: 'Transportation & Logistics',
        description: 'Companies involved in transportation, logistics, and supply chain operations.'
      }
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Natural Resources',
    description: 'Companies involved in energy production, utilities, and management of natural resources.',
    subcategories: [
      {
        id: 'energy-oil',
        name: 'Oil & Gas',
        description: 'Companies involved in the exploration, extraction, and processing of oil and gas.'
      },
      {
        id: 'energy-renewable',
        name: 'Renewable Energy',
        description: 'Companies focused on renewable energy sources like solar, wind, and hydro.'
      },
      {
        id: 'energy-utilities',
        name: 'Utilities',
        description: 'Companies providing electricity, water, and gas utility services.'
      },
      {
        id: 'energy-cleantech',
        name: 'CleanTech',
        description: 'Companies developing technologies to optimize energy usage and reduce environmental impact.'
      },
      {
        id: 'energy-storage',
        name: 'Energy Storage & Grid',
        description: 'Companies providing energy storage solutions and grid infrastructure.'
      },
      {
        id: 'energy-carbon',
        name: 'Carbon Management',
        description: 'Companies involved in carbon capture, storage, and carbon credit trading.'
      },
      {
        id: 'energy-mining',
        name: 'Mining & Minerals',
        description: 'Companies involved in exploration and extraction of minerals and resources.'
      }
    ]
  },
  {
    id: 'realestate',
    name: 'Real Estate & Construction',
    description: 'Companies involved in property development, management, and construction.',
    subcategories: [
      {
        id: 'realestate-commercial',
        name: 'Commercial Real Estate',
        description: 'Development and management of commercial properties.'
      },
      {
        id: 'realestate-residential',
        name: 'Residential Real Estate',
        description: 'Development and management of residential properties.'
      },
      {
        id: 'realestate-construction',
        name: 'Construction',
        description: 'Companies providing construction services for various property types.'
      },
      {
        id: 'realestate-industrial',
        name: 'Industrial Construction',
        description: 'Companies building industrial facilities and plants.'
      },
      {
        id: 'realestate-renovation',
        name: 'Renovation & Restoration',
        description: 'Companies specializing in renovation and restoration of existing buildings.'
      }
    ]
  },
  {
    id: 'education',
    name: 'Education & Training',
    description: 'Organizations providing educational services and training programs.',
    subcategories: [
      {
        id: 'education-k12',
        name: 'K-12 Education',
        description: 'Primary and secondary education providers.'
      },
      {
        id: 'education-higher',
        name: 'Higher Education',
        description: 'Colleges, universities, and post-secondary institutions.'
      },
      {
        id: 'education-online',
        name: 'Online Education',
        description: 'Digital learning platforms and online course providers.'
      },
      {
        id: 'education-professional',
        name: 'Professional Training',
        description: 'Companies providing professional development and vocational training.'
      },
      {
        id: 'education-tech',
        name: 'Educational Technology',
        description: 'Companies developing technology solutions for education.'
      },
      {
        id: 'education-language',
        name: 'Language Learning',
        description: 'Language schools and language learning platforms.'
      },
      {
        id: 'education-testing',
        name: 'Testing & Assessment',
        description: 'Companies providing educational testing and assessment services.'
      },
      {
        id: 'education-tutoring',
        name: 'Tutoring & Coaching',
        description: 'Tutoring services and academic coaching.'
      }
    ]
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Farming',
    description: 'Businesses involved in crop production, livestock, and related services.',
    subcategories: [
      {
        id: 'agriculture-crops',
        name: 'Crop Production',
        description: 'Companies growing crops, grains, and produce.'
      },
      {
        id: 'agriculture-livestock',
        name: 'Livestock & Animal Products',
        description: 'Companies raising animals and producing animal products.'
      },
      {
        id: 'agriculture-equipment',
        name: 'Agricultural Equipment',
        description: 'Manufacturers of farming machinery and equipment.'
      },
      {
        id: 'agriculture-tech',
        name: 'AgTech',
        description: 'Companies developing technology solutions for agriculture.'
      },
      {
        id: 'agriculture-organic',
        name: 'Organic & Sustainable Farming',
        description: 'Farms and companies using organic and sustainable methods.'
      },
      {
        id: 'agriculture-processing',
        name: 'Food Processing',
        description: 'Companies processing agricultural products into food items.'
      },
      {
        id: 'agriculture-distribution',
        name: 'Agricultural Distribution',
        description: 'Companies involved in the distribution of agricultural products.'
      },
      {
        id: 'agriculture-aquaculture',
        name: 'Aquaculture & Fisheries',
        description: 'Companies involved in fish farming and fisheries.'
      }
    ]
  },
  {
    id: 'transportation',
    name: 'Transportation & Logistics',
    description: 'Companies involved in the movement of people and goods.',
    subcategories: [
      {
        id: 'transportation-freight',
        name: 'Freight & Logistics',
        description: 'Companies providing freight transport and logistics services.'
      },
      {
        id: 'transportation-passenger',
        name: 'Passenger Transportation',
        description: 'Companies providing transportation services for people.'
      },
      {
        id: 'transportation-air',
        name: 'Air Transport',
        description: 'Airlines and air cargo companies.'
      },
      {
        id: 'transportation-maritime',
        name: 'Maritime & Shipping',
        description: 'Companies involved in sea transport and shipping.'
      },
      {
        id: 'transportation-rail',
        name: 'Rail Transport',
        description: 'Railway companies and rail freight services.'
      },
      {
        id: 'transportation-road',
        name: 'Road Transport',
        description: 'Trucking and road freight companies.'
      },
      {
        id: 'transportation-warehousing',
        name: 'Warehousing & Storage',
        description: 'Companies providing warehousing and storage facilities.'
      },
      {
        id: 'transportation-lastmile',
        name: 'Last-Mile Delivery',
        description: 'Companies specializing in last-mile delivery services.'
      }
    ]
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit & Social Services',
    description: 'Organizations dedicated to charitable, educational, or social causes.',
    subcategories: [
      {
        id: 'nonprofit-charity',
        name: 'Charitable Organizations',
        description: 'Nonprofits focused on charitable activities and donations.'
      },
      {
        id: 'nonprofit-health',
        name: 'Health & Medical Research',
        description: 'Organizations focused on health and medical research.'
      },
      {
        id: 'nonprofit-education',
        name: 'Educational Foundations',
        description: 'Nonprofits supporting educational initiatives.'
      },
      {
        id: 'nonprofit-environment',
        name: 'Environmental & Conservation',
        description: 'Organizations dedicated to environmental causes and conservation.'
      },
      {
        id: 'nonprofit-arts',
        name: 'Arts & Culture',
        description: 'Nonprofits supporting arts, culture, and heritage.'
      },
      {
        id: 'nonprofit-community',
        name: 'Community Development',
        description: 'Organizations focused on community improvement and development.'
      },
      {
        id: 'nonprofit-human',
        name: 'Human Rights & Advocacy',
        description: 'Organizations advocating for human rights and social justice.'
      },
      {
        id: 'nonprofit-religious',
        name: 'Religious Organizations',
        description: 'Faith-based nonprofit organizations.'
      }
    ]
  }
];

// Define benchmark metrics for tracking
export const benchmarkMetrics: BenchmarkMetric[] = [
  // Financial Performance Metrics
  {
    id: 'revenue_growth',
    name: 'Revenue Growth',
    description: 'Annual revenue growth rate',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'profit_margin',
    name: 'Profit Margin',
    description: 'Net profit margin',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'gross_margin',
    name: 'Gross Margin',
    description: 'Gross profit as a percentage of revenue',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'ebitda_margin',
    name: 'EBITDA Margin',
    description: 'Earnings before interest, taxes, depreciation, and amortization as a percentage of revenue',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'roi',
    name: 'Return on Investment',
    description: 'Return on investment',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'roa',
    name: 'Return on Assets',
    description: 'Net income divided by total assets',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'roe',
    name: 'Return on Equity',
    description: 'Net income divided by shareholders\' equity',
    unit: '%',
    higherIsBetter: true
  },
  
  // Operational Metrics
  {
    id: 'employee_productivity',
    name: 'Employee Productivity',
    description: 'Revenue per employee',
    unit: '$',
    higherIsBetter: true
  },
  {
    id: 'operating_expense_ratio',
    name: 'Operating Expense Ratio',
    description: 'Operating expenses as a percentage of revenue',
    unit: '%',
    higherIsBetter: false
  },
  {
    id: 'inventory_turnover',
    name: 'Inventory Turnover',
    description: 'Cost of goods sold divided by average inventory',
    unit: 'ratio',
    higherIsBetter: true
  },
  {
    id: 'asset_turnover',
    name: 'Asset Turnover',
    description: 'Revenue divided by total assets',
    unit: 'ratio',
    higherIsBetter: true
  },
  
  // Customer Metrics
  {
    id: 'customer_acquisition_cost',
    name: 'Customer Acquisition Cost',
    description: 'Cost to acquire a new customer',
    unit: '$',
    higherIsBetter: false
  },
  {
    id: 'customer_lifetime_value',
    name: 'Customer Lifetime Value',
    description: 'Total value a customer brings over their lifetime',
    unit: '$',
    higherIsBetter: true
  },
  {
    id: 'customer_retention',
    name: 'Customer Retention Rate',
    description: 'Percentage of customers retained',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'customer_satisfaction',
    name: 'Customer Satisfaction Score',
    description: 'Average customer satisfaction rating',
    unit: 'score',
    higherIsBetter: true
  },
  {
    id: 'nps',
    name: 'Net Promoter Score',
    description: 'Likelihood of customers to recommend the business',
    unit: 'score',
    higherIsBetter: true
  },
  
  // Technology & Innovation Metrics
  {
    id: 'digital_transformation',
    name: 'Digital Transformation Index',
    description: 'Level of digital technology adoption',
    unit: 'score',
    higherIsBetter: true
  },
  {
    id: 'r_and_d',
    name: 'R&D Investment',
    description: 'R&D spending as % of revenue',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'innovation_rate',
    name: 'Innovation Rate',
    description: 'Percentage of revenue from new products/services in the last three years',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'tech_stack_modernity',
    name: 'Tech Stack Modernity',
    description: 'Assessment of how modern the company\'s technology stack is',
    unit: 'score',
    higherIsBetter: true
  },
  
  // Risk & Financial Health Metrics
  {
    id: 'debt_to_equity',
    name: 'Debt to Equity Ratio',
    description: 'Ratio of total debt to shareholders\' equity',
    unit: 'ratio',
    higherIsBetter: false
  },
  {
    id: 'current_ratio',
    name: 'Current Ratio',
    description: 'Current assets divided by current liabilities',
    unit: 'ratio',
    higherIsBetter: true
  },
  {
    id: 'quick_ratio',
    name: 'Quick Ratio',
    description: 'Quick assets divided by current liabilities',
    unit: 'ratio',
    higherIsBetter: true
  },
  {
    id: 'cash_flow',
    name: 'Cash Flow Margin',
    description: 'Operating cash flow as % of revenue',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'interest_coverage',
    name: 'Interest Coverage Ratio',
    description: 'EBIT divided by interest expenses',
    unit: 'ratio',
    higherIsBetter: true
  },
  
  // Growth & Scalability Metrics
  {
    id: 'market_share',
    name: 'Market Share',
    description: 'Company\'s percentage of total market sales',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'growth_rate',
    name: 'Compound Annual Growth Rate (CAGR)',
    description: 'Average annual growth rate over a specific period',
    unit: '%',
    higherIsBetter: true
  },
  {
    id: 'scalability_score',
    name: 'Scalability Score',
    description: 'Assessment of how easily the business can scale',
    unit: 'score',
    higherIsBetter: true
  },
  
  // ESG Metrics
  {
    id: 'carbon_footprint',
    name: 'Carbon Footprint',
    description: 'CO2 emissions per unit of revenue',
    unit: 'tons/$M',
    higherIsBetter: false
  },
  {
    id: 'employee_satisfaction',
    name: 'Employee Satisfaction',
    description: 'Average employee satisfaction score',
    unit: 'score',
    higherIsBetter: true
  },
  {
    id: 'diversity_score',
    name: 'Diversity & Inclusion Score',
    description: 'Assessment of company\'s diversity and inclusion practices',
    unit: 'score',
    higherIsBetter: true
  },
  {
    id: 'governance_rating',
    name: 'Corporate Governance Rating',
    description: 'Rating of company\'s governance practices',
    unit: 'score',
    higherIsBetter: true
  }
];

// Function to get an industry by ID
export function getIndustryById(id: string): Industry | undefined {
  return industries.find(industry => industry.id === id);
}

// Function to get a subcategory by ID
export function getSubcategoryById(id: string): IndustrySubcategory | undefined {
  for (const industry of industries) {
    const subcategory = industry.subcategories.find(sub => sub.id === id);
    if (subcategory) return subcategory;
  }
  return undefined;
}

// Function to get a metric by ID
export function getMetricById(id: string): BenchmarkMetric | undefined {
  return benchmarkMetrics.find(metric => metric.id === id);
}

// Helper to get parent industry ID from subcategory ID
export function getParentIndustryId(subcategoryId: string): string | undefined {
  for (const industry of industries) {
    if (industry.subcategories.some(sub => sub.id === subcategoryId)) {
      return industry.id;
    }
  }
  return undefined;
}
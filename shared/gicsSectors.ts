export type GICSSector = {
  id: string;
  name: string;
  description: string;
};

export type GICSIndustryGroup = {
  id: string;
  sectorId: string;
  name: string;
  description: string;
};

// Standard GICS Sectors (11 sectors)
export const gicsSectors: GICSSector[] = [
  {
    id: "10",
    name: "Energy",
    description: "Companies involved in exploration, production, refining, and marketing of oil, gas, coal, and other consumable fuels."
  },
  {
    id: "15",
    name: "Materials",
    description: "Companies involved in discovering, developing, and processing raw materials, including mining, chemicals, construction materials, metals, and paper products."
  },
  {
    id: "20",
    name: "Industrials",
    description: "Companies involved in manufacturing, distribution of capital goods, provision of commercial services and supplies, or transportation services."
  },
  {
    id: "25",
    name: "Consumer Discretionary",
    description: "Industries that tend to be the most sensitive to economic cycles, including automotive, consumer durables, apparel, hotels, restaurants, and leisure."
  },
  {
    id: "30",
    name: "Consumer Staples",
    description: "Companies whose businesses are less sensitive to economic cycles, including food, beverages, tobacco, and household and personal products."
  },
  {
    id: "35",
    name: "Health Care",
    description: "Companies involved in health care equipment and supplies, health care providers and services, pharmaceuticals, and biotechnology."
  },
  {
    id: "40",
    name: "Financials",
    description: "Companies involved in banking, diversified financials, insurance, and real estate."
  },
  {
    id: "45",
    name: "Information Technology",
    description: "Companies involved in software, IT services, hardware, semiconductor equipment, and communication equipment."
  },
  {
    id: "50",
    name: "Communication Services",
    description: "Companies involved in telecommunication services, media, and entertainment."
  },
  {
    id: "55",
    name: "Utilities",
    description: "Companies involved in electric, gas, and water utilities as well as independent power producers and energy traders."
  },
  {
    id: "60",
    name: "Real Estate",
    description: "Companies engaged in real estate development and operation."
  }
];

// GICS Industry Groups (25 groups)
export const gicsIndustryGroups: GICSIndustryGroup[] = [
  {
    id: "1010",
    sectorId: "10",
    name: "Energy",
    description: "Companies engaged in the exploration, production, refining, marketing, storage, and transportation of oil, gas, coal, and consumable fuels."
  },
  {
    id: "1510",
    sectorId: "15",
    name: "Materials",
    description: "Companies that manufacture chemicals, construction materials, glass, paper, forest products, containers, metals, minerals, and mining products."
  },
  {
    id: "2010",
    sectorId: "20",
    name: "Capital Goods",
    description: "Companies that manufacture machinery, electrical equipment, aerospace and defense, construction, engineering, and building products."
  },
  {
    id: "2020",
    sectorId: "20",
    name: "Commercial & Professional Services",
    description: "Companies that provide commercial services, supplies, HR, employment, environmental, office, printing, security, and other support services."
  },
  {
    id: "2030",
    sectorId: "20",
    name: "Transportation",
    description: "Companies providing transportation services, including air freight, airlines, marine, road, rail, and logistics services."
  },
  {
    id: "2510",
    sectorId: "25",
    name: "Automobiles & Components",
    description: "Companies that manufacture automobiles, auto parts, tires, and motorcycle manufacturers."
  },
  {
    id: "2520",
    sectorId: "25",
    name: "Consumer Durables & Apparel",
    description: "Companies that manufacture consumer durables, apparel, accessories, and footwear, as well as textiles and luxury goods."
  },
  {
    id: "2530",
    sectorId: "25",
    name: "Consumer Services",
    description: "Companies that provide consumer services, including hotels, restaurants, leisure facilities, and education services."
  },
  {
    id: "2550",
    sectorId: "25",
    name: "Retailing",
    description: "Companies engaged in retail merchandising, including department stores, specialized consumer retailers, and multi-line retailers."
  },
  {
    id: "3010",
    sectorId: "30",
    name: "Food & Staples Retailing",
    description: "Companies that retail food, medicine, tobacco, household goods, and personal products."
  },
  {
    id: "3020",
    sectorId: "30",
    name: "Food, Beverage & Tobacco",
    description: "Companies that manufacture food products, soft drinks, alcoholic beverages, and tobacco products."
  },
  {
    id: "3030",
    sectorId: "30",
    name: "Household & Personal Products",
    description: "Companies that manufacture household and personal products, including cosmetics and personal care."
  },
  {
    id: "3510",
    sectorId: "35",
    name: "Health Care Equipment & Services",
    description: "Companies that manufacture medical equipment, supplies, healthcare providers, services, technology, distributors, and manage care."
  },
  {
    id: "3520",
    sectorId: "35",
    name: "Pharmaceuticals, Biotechnology & Life Sciences",
    description: "Companies engaged in research, development, production, and marketing of pharmaceuticals, and biotechnology products."
  },
  {
    id: "4010",
    sectorId: "40",
    name: "Banks",
    description: "Institutions providing general banking and financial services, including large and regional banks."
  },
  {
    id: "4020",
    sectorId: "40",
    name: "Diversified Financials",
    description: "Companies providing financial services to consumers and businesses, like capital markets, consumer finance, and financial exchanges."
  },
  {
    id: "4030",
    sectorId: "40",
    name: "Insurance",
    description: "Companies providing insurance and reinsurance services."
  },
  {
    id: "4510",
    sectorId: "45",
    name: "Software & Services",
    description: "Companies providing internet services, software, IT consulting, data processing, and outsourced services."
  },
  {
    id: "4520",
    sectorId: "45",
    name: "Technology Hardware & Equipment",
    description: "Companies that manufacture communication equipment, computers, electronic equipment, instruments, and components."
  },
  {
    id: "4530",
    sectorId: "45",
    name: "Semiconductors & Semiconductor Equipment",
    description: "Companies engaged in the design, manufacture, and sale of semiconductors and semiconductor equipment."
  },
  {
    id: "5010",
    sectorId: "50",
    name: "Telecommunication Services",
    description: "Companies providing telecommunication services, including wireless, wireline, and satellite communications."
  },
  {
    id: "5020",
    sectorId: "50",
    name: "Media & Entertainment",
    description: "Companies providing media, advertising, broadcasting, entertainment, and interactive media services."
  },
  {
    id: "5510",
    sectorId: "55",
    name: "Utilities",
    description: "Companies providing utility services, including electric, gas, water utilities, and independent power producers."
  },
  {
    id: "6010",
    sectorId: "60",
    name: "Real Estate",
    description: "Companies engaged in real estate development, operation, management, and investment of properties."
  },
  {
    id: "6020",
    sectorId: "60",
    name: "REITs",
    description: "Real Estate Investment Trusts that own and operate income-producing real estate."
  }
];

// Helper functions to work with sectors and industry groups
export function getSectorById(id: string): GICSSector | undefined {
  return gicsSectors.find(sector => sector.id === id);
}

export function getIndustryGroupById(id: string): GICSIndustryGroup | undefined {
  return gicsIndustryGroups.find(group => group.id === id);
}

export function getIndustryGroupsBySectorId(sectorId: string): GICSIndustryGroup[] {
  return gicsIndustryGroups.filter(group => group.sectorId === sectorId);
}

export function getSectorByIndustryGroupId(industryGroupId: string): GICSSector | undefined {
  const industryGroup = getIndustryGroupById(industryGroupId);
  if (!industryGroup) return undefined;
  return getSectorById(industryGroup.sectorId);
}

// Utility to generate a unique ID based on company name and domain
export function generateUniqueCompanyId(companyName: string, website: string): string {
  const cleanCompanyName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Extract domain from website
  let domain = '';
  try {
    if (website) {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`);
      domain = url.hostname.replace('www.', '');
    }
  } catch (e) {
    // If URL parsing fails, just use the raw website input
    domain = website.toLowerCase().replace(/[^a-z0-9.-]/g, '');
  }
  
  const domainPart = domain.split('.')[0] || '';
  const timestamp = Date.now().toString().slice(-6);
  
  return `${cleanCompanyName.slice(0, 10)}-${domainPart.slice(0, 8)}-${timestamp}`;
}
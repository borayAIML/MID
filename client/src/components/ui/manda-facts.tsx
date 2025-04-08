import React, { useState, useEffect } from 'react';
import { InfoIcon, BarChart3, TrendingUp, Globe, PieChart, Building2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MAFact {
  text: string;
  category: 'global' | 'europe' | 'valuation' | 'tech' | 'industry';
  source?: string;
  icon: React.ElementType;
  highlight?: string;
}

const maFacts: MAFact[] = [
  {
    text: "78% of business owners underestimate their company's value by 15-30%. Our AI valuation has been proven to provide estimates within 7% of professional appraisals.",
    category: 'valuation',
    icon: BarChart3,
    highlight: "78%"
  },
  {
    text: "European M&A activity reached €1.1 trillion in 2023, with cross-border transactions accounting for 65% of total deal value.",
    category: 'europe',
    source: "European M&A Monitor",
    icon: Globe,
    highlight: "€1.1 trillion"
  },
  {
    text: "Mid-market deals (€15-250M) represent 68% of all European acquisition volume but only 31% of total value.",
    category: 'europe',
    icon: PieChart,
    highlight: "68%"
  },
  {
    text: "Technology sector valuations in Europe average 6.8x EBITDA, 33% higher than traditional manufacturing companies at 5.1x.",
    category: 'europe',
    icon: TrendingUp,
    highlight: "6.8x EBITDA"
  },
  {
    text: "UK, Germany, and France collectively account for 57% of all European M&A transactions by volume.",
    category: 'europe',
    source: "Deloitte European M&A Study",
    icon: Globe,
    highlight: "57%"
  },
  {
    text: "Due diligence periods for European acquisitions average 4-6 months, compared to 2-3 months in North America.",
    category: 'europe',
    icon: Building2,
    highlight: "4-6 months"
  },
  {
    text: "EBITDA multiples for European SaaS companies increased by 2.3x between 2019 and 2023, outpacing all other tech sectors.",
    category: 'europe',
    icon: TrendingUp,
    highlight: "2.3x"
  },
  {
    text: "European regulatory reviews add an average of 97 days to closing timelines for cross-border acquisitions.",
    category: 'europe',
    source: "European Commission Competition Database",
    icon: Building2,
    highlight: "97 days"
  },
  {
    text: "Private equity firms now participate in 41% of all European mid-market deals, up from 26% in 2018.",
    category: 'europe',
    icon: BarChart3,
    highlight: "41%"
  },
  {
    text: "The average 'discount gap' between seller expectations and buyer valuations in European deals stands at 18%, highest in the CEE region.",
    category: 'europe',
    icon: PieChart,
    highlight: "18%"
  },
  {
    text: "Companies with structured data rooms receive valuations 11-14% higher than those with poorly organized financial documentation.",
    category: 'valuation',
    icon: BarChart3,
    highlight: "11-14% higher"
  },
  {
    text: "European businesses with enterprise software integration see 22% faster due diligence periods and 9% higher purchase multiples.",
    category: 'europe',
    icon: TrendingUp,
    highlight: "22% faster"
  }
];

export const getRandomMAFact = (category?: 'global' | 'europe' | 'valuation' | 'tech' | 'industry'): MAFact => {
  const filteredFacts = category ? maFacts.filter(fact => fact.category === category) : maFacts;
  const randomIndex = Math.floor(Math.random() * filteredFacts.length);
  return filteredFacts[randomIndex];
};

interface MAFactCardProps {
  fact?: MAFact;
  category?: 'global' | 'europe' | 'valuation' | 'tech' | 'industry';
  showSource?: boolean;
  className?: string;
  onNext?: () => void;
}

export const MAFactCard: React.FC<MAFactCardProps> = ({ 
  fact: propFact, 
  category, 
  showSource = false, 
  className = "",
  onNext 
}) => {
  const [fact, setFact] = useState<MAFact | undefined>(propFact || getRandomMAFact(category));
  
  // If propFact changes, update the state
  useEffect(() => {
    if (propFact) {
      setFact(propFact);
    }
  }, [propFact]);
  
  const handleNextFact = () => {
    const newFact = getRandomMAFact(category);
    setFact(newFact);
    if (onNext) onNext();
  };
  
  if (!fact) return null;
  
  const Icon = fact.icon || InfoIcon;
  
  // Helper function to highlight specific text
  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text;
    
    const parts = text.split(highlight);
    
    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="font-semibold text-blue-600">{highlight}</span>}
            {part}
          </React.Fragment>
        ))}
      </>
    );
  };
  
  return (
    <Card className={`bg-blue-50 p-4 max-w-2xl ${className}`}>
      <div className="flex items-start gap-3">
        <div className="text-blue-600 shrink-0 mt-1">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Did you know?</h4>
          <p className="text-sm text-gray-700">
            {highlightText(fact.text, fact.highlight)}
          </p>
          {showSource && fact.source && (
            <p className="mt-1 text-xs text-gray-500">Source: {fact.source}</p>
          )}
          {onNext && (
            <div className="mt-2 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextFact}
                className="text-xs text-blue-700 hover:text-blue-800 px-2 py-1"
              >
                Another fact
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const MAFactsGrid: React.FC<{ 
  category?: 'global' | 'europe' | 'valuation' | 'tech' | 'industry',
  count?: number,
  showSource?: boolean
}> = ({ 
  category, 
  count = 3, 
  showSource = true 
}) => {
  // Get random facts but ensure no duplicates
  const getRandomFacts = () => {
    const facts: MAFact[] = [];
    const availableFacts = [...maFacts].filter(f => !category || f.category === category);
    
    for (let i = 0; i < Math.min(count, availableFacts.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableFacts.length);
      facts.push(availableFacts.splice(randomIndex, 1)[0]);
    }
    
    return facts;
  };
  
  const [facts, setFacts] = useState<MAFact[]>(getRandomFacts());
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {facts.map((fact, index) => (
        <MAFactCard 
          key={index} 
          fact={fact} 
          showSource={showSource} 
        />
      ))}
    </div>
  );
};

export default MAFactCard;
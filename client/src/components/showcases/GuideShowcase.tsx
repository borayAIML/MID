import React, { useState } from 'react';
import { 
  CharacterGuide, 
  EmiliaGuide, 
  MentorGuide,
  AnalystGuide,
  CoachGuide 
} from '@/components/ui/character-guide';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GuideShowcase() {
  const [showEmilia, setShowEmilia] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [showAnalyst, setShowAnalyst] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="emilia" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="emilia">Emilia</TabsTrigger>
          <TabsTrigger value="mentor">Mentor</TabsTrigger>
          <TabsTrigger value="analyst">Analyst</TabsTrigger>
          <TabsTrigger value="coach">Coach</TabsTrigger>
        </TabsList>
        
        <TabsContent value="emilia" className="space-y-4">
          <div className="mt-4 flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">
              Emilia is your friendly assistant who guides you through the platform
            </p>
            <Button 
              size="sm"
              onClick={() => setShowEmilia(!showEmilia)} 
              variant="outline"
            >
              {showEmilia ? 'Hide' : 'Show'} Emilia
            </Button>
          </div>
          
          {showEmilia && (
            <EmiliaGuide
              title="Welcome to MANDA INSTITUTE!"
              content="I'm Emilia, your digital assistant. I'm here to help you navigate our valuation tools and answer any questions you might have about business valuations."
              position="bottom"
              onClose={() => setShowEmilia(false)}
              actionText="Tell me more"
              onAction={() => alert("I can help you understand how valuations work!")}
              dismissible
            />
          )}
        </TabsContent>
        
        <TabsContent value="mentor" className="space-y-4">
          <div className="mt-4 flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">
              The Mentor provides wisdom and strategic advice
            </p>
            <Button 
              size="sm"
              onClick={() => setShowMentor(!showMentor)} 
              variant="outline"
            >
              {showMentor ? 'Hide' : 'Show'} Mentor
            </Button>
          </div>
          
          {showMentor && (
            <MentorGuide
              title="Strategic Consideration"
              content="When preparing for an exit, it's crucial to look beyond financial metrics. The strategic value of your intellectual property and market position can dramatically increase your valuation multiple."
              position="right"
              onClose={() => setShowMentor(false)}
              actionText="Learn more"
              onAction={() => alert("Let me explain how strategic positioning works...")}
              dismissible
            />
          )}
        </TabsContent>
        
        <TabsContent value="analyst" className="space-y-4">
          <div className="mt-4 flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">
              The Analyst provides data-driven insights
            </p>
            <Button 
              size="sm"
              onClick={() => setShowAnalyst(!showAnalyst)} 
              variant="outline"
            >
              {showAnalyst ? 'Hide' : 'Show'} Analyst
            </Button>
          </div>
          
          {showAnalyst && (
            <AnalystGuide
              title="Financial Insight"
              content="Your EBITDA margin of 23% is significantly above the industry average of 18%. This puts you in the top quartile of SaaS companies in your revenue bracket, which typically correlates with a 1.5-2x multiple premium."
              position="left"
              onClose={() => setShowAnalyst(false)}
              actionText="See calculations"
              onAction={() => alert("Here's how we calculated your position...")}
              dismissible
            />
          )}
        </TabsContent>
        
        <TabsContent value="coach" className="space-y-4">
          <div className="mt-4 flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-2">
              The Coach motivates and provides action steps
            </p>
            <Button 
              size="sm"
              onClick={() => setShowCoach(!showCoach)} 
              variant="outline"
            >
              {showCoach ? 'Hide' : 'Show'} Coach
            </Button>
          </div>
          
          {showCoach && (
            <CoachGuide
              title="Your Next Steps"
              content="Great job completing your financial profile! To further improve your valuation, consider documenting your customer acquisition strategy. Companies with clear, scalable acquisition channels typically see a 15-20% increase in valuation multiples."
              position="top"
              onClose={() => setShowCoach(false)}
              actionText="Show me how"
              onAction={() => alert("Here's a template for documenting your strategy...")}
              dismissible
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
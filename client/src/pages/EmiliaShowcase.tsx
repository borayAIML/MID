import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmiliaPersonality, EmiliaPersonalityType } from '@/components/chat/EmiliaPersonality';
import { EnhancedChatInterface } from '@/components/chat/EnhancedChatInterface';
import { EnhancedSimpleChat } from '@/components/chat/EnhancedSimpleChat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EmiliaShowcase() {
  const [selectedMood, setSelectedMood] = useState<EmiliaPersonalityType>('neutral');
  
  const moods: EmiliaPersonalityType[] = [
    'neutral',
    'thinking',
    'excited',
    'concerned',
    'analytical',
    'creative',
    'helpful'
  ];
  
  const moodDescriptions = {
    neutral: "The default state for general interactions",
    thinking: "When processing complex information or calculations",
    excited: "When sharing positive news or achievements",
    concerned: "When warning about potential risks or issues",
    analytical: "When presenting data analysis and insights",
    creative: "When offering innovative ideas or suggestions",
    helpful: "When answering general questions or providing assistance"
  };
  
  const examplePrompts = [
    "What factors affect the valuation of a technology company?",
    "I'm concerned about my company's declining EBITDA. What should I do?",
    "Can you analyze the European manufacturing sector trends?",
    "What are some creative strategies to improve my business valuation?",
    "Help me understand the difference between DCF and multiple-based valuation.",
    "What are the biggest risks facing SMBs in the European market?",
    "How do I calculate the growth rate for my financial projections?"
  ];
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Emilia AI Assistant</h1>
          <p className="text-muted-foreground mt-2">
            An intelligent assistant with contextual personality and expressive animations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Personality States</CardTitle>
              <CardDescription>
                Emilia adapts her personality based on the conversation context
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {moods.map((mood) => (
                  <div 
                    key={mood}
                    className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all ${
                      selectedMood === mood ? 'bg-muted border-2 border-primary' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedMood(mood)}
                  >
                    <EmiliaPersonality mood={mood} size="md" />
                    <span className="mt-2 text-xs font-medium capitalize">{mood}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <h3 className="font-medium mb-1 capitalize">{selectedMood}</h3>
                <p className="text-sm text-muted-foreground">
                  {moodDescriptions[selectedMood]}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 md:col-span-2 h-auto">
            <CardHeader>
              <CardTitle>Demo</CardTitle>
              <CardDescription>
                See how Emilia dynamically changes based on the conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Try sample prompts</AlertTitle>
                <AlertDescription>
                  The AI will automatically change its personality based on your questions!
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {examplePrompts.map((prompt, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      // This is just a visual demo - in a real scenario, you would
                      // programmatically send these prompts to the chat interfaces
                      navigator.clipboard.writeText(prompt);
                      alert("Prompt copied to clipboard: " + prompt);
                    }}
                  >
                    {prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt}
                  </Badge>
                ))}
              </div>
              
              <Tabs defaultValue="full" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="full">Full Chat Interface</TabsTrigger>
                  <TabsTrigger value="simple">Simple Chat Widget</TabsTrigger>
                </TabsList>
                <TabsContent value="full" className="mt-4">
                  <EnhancedChatInterface className="h-[400px]" />
                </TabsContent>
                <TabsContent value="simple" className="mt-4">
                  <EnhancedSimpleChat />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Technical Features</CardTitle>
            <CardDescription>How Emilia creates a more engaging user experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">Contextual Understanding</h3>
                <p className="text-sm text-muted-foreground">
                  Emilia analyzes the content of each message to determine the most appropriate emotional response.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">Visual Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Dynamic animations and color changes provide intuitive feedback about the nature of the information.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">Adaptive UI</h3>
                <p className="text-sm text-muted-foreground">
                  The interface adapts to match Emilia's current mood, creating a cohesive and engaging experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Alert className="max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Integration Options</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Emilia can be integrated throughout the application in different ways:
              </p>
              <ul className="list-disc pl-5">
                <li>Full chat interface for in-depth guidance on valuation pages</li>
                <li>Simple widget for quick assistance on dashboard or navigation pages</li>
                <li>Context-specific helpers that appear on complex input forms</li>
                <li>Proactive suggestions in the data room or valuation report sections</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
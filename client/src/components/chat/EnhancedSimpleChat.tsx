import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBusinessValuationResponse } from "@/lib/chatService";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AIThinkingLoader } from "@/components/ui/animated-loader";
import { motion, AnimatePresence } from 'framer-motion';
import { EmiliaPersonality, detectMoodFromMessage, EmiliaPersonalityType } from './EmiliaPersonality';

interface EnhancedSimpleChatProps {
  title?: string;
  placeholder?: string;
  greeting?: string;
  className?: string;
  onSend?: (message: string) => void;
  onResponse?: (message: string) => void;
  contextualResponses?: boolean;
}

export function EnhancedSimpleChat({
  title = "Ask Emilia",
  placeholder = "Ask a question about business valuation...",
  greeting = "I can answer your questions about business valuation and European market trends.",
  className = "",
  onSend,
  onResponse,
  contextualResponses = true
}: EnhancedSimpleChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState<string>(greeting);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [currentMood, setCurrentMood] = useState<EmiliaPersonalityType>('neutral');
  const [showResponseAnimation, setShowResponseAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation when a new response is received
    if (response !== greeting) {
      setShowResponseAnimation(true);
      const timer = setTimeout(() => {
        setShowResponseAnimation(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [response, greeting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const question = inputValue.trim();
    setInputValue("");
    setIsLoading(true);
    
    // Set mood to thinking while processing
    setCurrentMood('thinking');
    
    // Trigger onSend callback if provided
    if (onSend) {
      onSend(question);
    }
    
    try {
      const answer = await getBusinessValuationResponse(question);
      setResponse(answer);
      
      // Detect mood based on the response content
      if (contextualResponses) {
        const detectedMood = detectMoodFromMessage(answer);
        setCurrentMood(detectedMood);
      }
      
      // Trigger onResponse callback if provided
      if (onResponse) {
        onResponse(answer);
      }
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
      setResponse("I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later.");
      
      // Set mood to concerned when there's an error
      setCurrentMood('concerned');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <EmiliaPersonality 
            mood={currentMood} 
            size="sm" 
            withAnimation={true}
          />
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge 
            variant="outline" 
            className={`ml-auto transition-colors duration-300 ${
              currentMood === 'thinking' ? 'bg-purple-50' : 
              currentMood === 'excited' ? 'bg-green-50' : 
              currentMood === 'concerned' ? 'bg-amber-50' : 
              currentMood === 'analytical' ? 'bg-indigo-50' :
              currentMood === 'creative' ? 'bg-pink-50' :
              currentMood === 'helpful' ? 'bg-teal-50' :
              'bg-blue-50'
            }`}
          >
            AI Assistant
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <AnimatePresence mode="wait">
          <motion.div 
            key={isLoading ? 'loading' : 'response'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`bg-muted p-3 rounded-lg mb-3 ${showResponseAnimation ? 'border-2 border-primary transition-all duration-500' : ''}`}
          >
            {isLoading ? (
              <div className="min-h-[80px] flex items-center justify-center">
                <AIThinkingLoader size="sm" text="Thinking" />
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm">{response}</p>
            )}
          </motion.div>
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-grow text-sm"
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={isLoading || !inputValue.trim()}
            className={`transition-colors duration-300 ${
              currentMood === 'thinking' ? 'bg-purple-600 hover:bg-purple-700' : 
              currentMood === 'excited' ? 'bg-green-600 hover:bg-green-700' : 
              currentMood === 'concerned' ? 'bg-amber-600 hover:bg-amber-700' : 
              currentMood === 'analytical' ? 'bg-indigo-600 hover:bg-indigo-700' :
              currentMood === 'creative' ? 'bg-pink-600 hover:bg-pink-700' :
              currentMood === 'helpful' ? 'bg-teal-600 hover:bg-teal-700' :
              ''
            }`}
          >
            Ask
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
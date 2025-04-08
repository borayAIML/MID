import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBusinessValuationResponse } from "@/lib/chatService";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AIThinkingLoader } from "@/components/ui/animated-loader";

interface SimpleChatProps {
  title?: string;
  placeholder?: string;
  greeting?: string;
  className?: string;
}

export function SimpleChat({
  title = "Ask Emilia",
  placeholder = "Ask a question about business valuation...",
  greeting = "I can answer your questions about business valuation and European market trends.",
  className = "",
}: SimpleChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState<string>(greeting);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const question = inputValue.trim();
    setInputValue("");
    setIsLoading(true);
    
    try {
      const answer = await getBusinessValuationResponse(question);
      setResponse(answer);
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
      setResponse("I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/assets/emilia-avatar.png" alt="Emilia" />
            <AvatarFallback>EM</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline" className="ml-auto">AI Assistant</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="bg-muted p-3 rounded-lg mb-3">
          {isLoading ? (
            <div className="min-h-[80px] flex items-center justify-center">
              <AIThinkingLoader size="sm" text="Thinking" />
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm">{response}</p>
          )}
        </div>
        
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
          >
            Ask
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
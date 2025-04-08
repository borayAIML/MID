import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AIThinkingLoader } from "@/components/ui/animated-loader";
import { type ChatMessage } from "@/lib/chatService";
import { sendLocalChatMessage } from "@/lib/localChatService";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { EmiliaPersonality, detectMoodFromMessage, EmiliaPersonalityType } from './EmiliaPersonality';

interface EnhancedChatInterfaceProps {
  title?: string;
  placeholder?: string;
  initialSystemMessage?: string;
  showAvatar?: boolean;
  className?: string;
  onSend?: (message: string) => void;
  onResponse?: (message: string) => void;
  contextualResponses?: boolean;
}

export function EnhancedChatInterface({
  title = "Chat with Emilia",
  placeholder = "Ask me about business valuation...",
  initialSystemMessage = "You are Emilia, a friendly AI assistant specializing in European business valuation. You speak in a conversational, helpful tone. You're focused on helping European SMBs understand their business value. Use the € currency symbol when discussing monetary values.",
  showAvatar = true,
  className = "",
  onSend,
  onResponse,
  contextualResponses = true
}: EnhancedChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  // Only start with a system message to follow Perplexity API requirements
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system" as const,
      content: initialSystemMessage
    }
  ]);
  // Store display messages separately for UI rendering
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([
    {
      role: "assistant" as const,
      content: "Hello! I'm Emilia, your business valuation assistant. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [currentMood, setCurrentMood] = useState<EmiliaPersonalityType>('neutral');
  
  useEffect(() => {
    // Scroll to bottom whenever display messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayMessages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = inputValue.trim();
    setInputValue("");
    
    // Create user message object
    const userMessageObj = { role: "user" as const, content: userMessage };
    
    // Add user message to display messages for UI
    setDisplayMessages([
      ...displayMessages,
      userMessageObj
    ]);
    
    // Add user message to API messages array
    // For Perplexity API, we need proper sequencing: system, user, assistant, user, assistant...
    const updatedMessages = [
      ...messages, // Contains system message initially
      userMessageObj
    ];
    
    setMessages(updatedMessages);
    setIsLoading(true);
    
    // Set mood to thinking while processing
    setCurrentMood('thinking');
    
    // Trigger onSend callback if provided
    if (onSend) {
      onSend(userMessage);
    }
    
    try {
      // Use local chat service instead of external API
      const response = await sendLocalChatMessage(updatedMessages);
      const assistantMessage = response.content;
      
      // Detect mood based on the response content
      if (contextualResponses) {
        const detectedMood = detectMoodFromMessage(assistantMessage);
        setCurrentMood(detectedMood);
      }
      
      // Create assistant message object
      const assistantMessageObj = {
        role: "assistant" as const,
        content: assistantMessage,
      };
      
      // Update display messages for UI
      setDisplayMessages(prev => [
        ...prev,
        assistantMessageObj
      ]);
      
      // Update the messages array for future context
      setMessages([
        ...updatedMessages,
        assistantMessageObj,
      ]);
      
      // Trigger onResponse callback if provided
      if (onResponse) {
        onResponse(assistantMessage);
      }
      
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
      
      const errorMessageObj = {
        role: "assistant" as const,
        content: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again later.",
      };
      
      // Update display messages for UI with error message
      setDisplayMessages(prev => [
        ...prev,
        errorMessageObj
      ]);
      
      // Don't update the API messages to maintain proper sequence
      
      // Set mood to concerned when there's an error
      setCurrentMood('concerned');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };
  
  return (
    <Card className={`flex flex-col h-full max-h-[600px] ${className}`}>
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          {showAvatar && (
            <EmiliaPersonality 
              mood={currentMood} 
              size="sm" 
              withAnimation={true}
            />
          )}
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
      
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-[calc(100%-1px)] p-4">
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {displayMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" && showAvatar && (
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/assets/emilia-avatar.png" alt="Emilia" />
                          <AvatarFallback>Em</AvatarFallback>
                        </Avatar>
                        <Badge variant="outline" className="text-xs font-normal">
                          Emilia
                        </Badge>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
              
            {isLoading && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  {showAvatar && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/assets/emilia-avatar.png" alt="Emilia" />
                        <AvatarFallback>Em</AvatarFallback>
                      </Avatar>
                      <Badge variant="outline" className="text-xs font-normal">
                        Emilia
                      </Badge>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">
                    <AIThinkingLoader size="sm" text="Thinking" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-2 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button 
            type="submit" 
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
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
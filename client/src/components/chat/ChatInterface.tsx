import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/lib/chatService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AIThinkingLoader } from "@/components/ui/animated-loader";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/lib/chatService";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  title?: string;
  placeholder?: string;
  greeting?: string;
  showAvatar?: boolean;
  className?: string;
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  onReceiveResponse?: (response: string) => void;
}

export function ChatInterface({
  title = "Chat with Emilia",
  placeholder = "Type your question here...",
  greeting = "Hello! I'm Emilia, your business valuation assistant. How can I help you today?",
  showAvatar = true,
  className = "",
  initialMessages = [],
  onSendMessage,
  onReceiveResponse,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system" as const,
      content: "You are Emilia, an expert business valuation assistant for European SMBs.",
    },
    ...initialMessages.length
      ? initialMessages
      : [
          {
            role: "assistant" as const,
            content: greeting,
          },
        ],
  ]);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = inputValue.trim();
    setInputValue("");
    
    // Add user message to the chat
    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: userMessage },
    ];
    setMessages(updatedMessages);
    
    // Notify parent component about the sent message
    if (onSendMessage) {
      onSendMessage(userMessage);
    }
    
    try {
      setIsLoading(true);
      
      // Send message to backend API
      const response = await sendChatMessage(updatedMessages);
      
      if (response && response.choices && response.choices.length > 0) {
        const assistantMessage = response.choices[0].message.content;
        
        // Add assistant response to chat
        setMessages([
          ...updatedMessages,
          { role: "assistant" as const, content: assistantMessage },
        ]);
        
        // Notify parent component about the received response
        if (onReceiveResponse) {
          onReceiveResponse(assistantMessage);
        }
      } else {
        throw new Error("Invalid response from AI service");
      }
    } catch (error) {
      console.error("Error in chat completion:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
      
      // Add error message to chat
      setMessages([
        ...updatedMessages,
        {
          role: "assistant" as const,
          content: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again later.",
        },
      ]);
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
            <Avatar className="h-8 w-8">
              <AvatarImage src="/assets/emilia-avatar.png" alt="Emilia" />
              <AvatarFallback>Em</AvatarFallback>
            </Avatar>
          )}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-[calc(100%-1px)] p-4">
          <div className="flex flex-col gap-4">
            {messages
              .filter((msg) => msg.role !== "system")
              .map((message, index) => (
                <div
                  key={index}
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
                </div>
              ))}
              
            {isLoading && (
              <div className="flex justify-start">
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
              </div>
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
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
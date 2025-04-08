import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minimize2, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { EnhancedChatInterface } from './EnhancedChatInterface';
import { EmiliaPersonality, EmiliaPersonalityType } from './EmiliaPersonality';

interface FloatingChatButtonProps {
  title?: string;
  placeholder?: string;
  initialSystemMessage?: string;
  className?: string;
}

export function FloatingChatButton({
  title = "Chat with Emilia",
  placeholder = "Ask me about business valuation...",
  initialSystemMessage = "You are Emilia, a friendly AI assistant specializing in European business valuation. You speak in a conversational, helpful tone. You're focused on helping European SMBs understand their business value. Use the € currency symbol when discussing monetary values.",
  className = ""
}: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMood, setCurrentMood] = useState<EmiliaPersonalityType>('neutral');
  const chatRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside the chat component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen && !isMinimized) {
        // Don't close, just minimize when clicked outside
        setIsMinimized(true);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMinimized]);
  
  // Create random "thinking" animations for the icon when closed
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        // Randomly set mood to thinking then back to neutral
        if (Math.random() > 0.7) {
          setCurrentMood('thinking');
          setTimeout(() => setCurrentMood('neutral'), 3000);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };
  
  const closeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
  };
  
  // Handle response from the AI to update mood
  const handleResponse = (message: string) => {
    // Update the mood based on the response content
    if (message.toLowerCase().includes('analyzing') || message.toLowerCase().includes('calculating')) {
      setCurrentMood('thinking');
    } else if (message.toLowerCase().includes('great news') || message.toLowerCase().includes('excellent')) {
      setCurrentMood('excited');
    } else if (message.toLowerCase().includes('concern') || message.toLowerCase().includes('risk')) {
      setCurrentMood('concerned');
    } else if (message.toLowerCase().includes('data shows') || message.toLowerCase().includes('analysis')) {
      setCurrentMood('analytical');
    } else if (message.toLowerCase().includes('suggest') || message.toLowerCase().includes('idea')) {
      setCurrentMood('creative');
    } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('assist')) {
      setCurrentMood('helpful');
    } else {
      setCurrentMood('neutral');
    }
  };
  
  return (
    <div 
      ref={chatRef}
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end ${className}`}
    >
      <AnimatePresence mode="wait">
        {isOpen && !isMinimized && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[350px] sm:w-[400px] shadow-xl rounded-lg overflow-hidden"
          >
            <EnhancedChatInterface 
              title={title}
              placeholder={placeholder}
              initialSystemMessage={initialSystemMessage}
              className="border border-border rounded-lg"
              onResponse={handleResponse}
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 p-0 rounded-full" 
                onClick={minimizeChat}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-destructive" 
                onClick={closeChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
        
        {isOpen && isMinimized && (
          <motion.div
            key="minimized"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400 shadow-lg rounded-full pl-4 pr-2 py-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <EmiliaPersonality mood={currentMood} size="sm" />
              <span className="font-medium text-sm">{title}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 rounded-full text-white hover:bg-blue-500" 
                onClick={toggleChat}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 rounded-full text-white hover:bg-blue-500" 
                onClick={closeChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pulsing circle effect when closed */}
      {!isOpen && (
        <motion.div
          className="absolute -inset-3 rounded-full bg-blue-300 opacity-30 pointer-events-none"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      )}
      
      <Button 
        onClick={toggleChat}
        variant="default"
        className={`h-16 w-16 rounded-full p-0 border-2 border-blue-300 shadow-lg
          ${isOpen 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
          }`}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full h-full rounded-full flex items-center justify-center"
        >
          {isOpen ? (
            isMinimized ? (
              <EmiliaPersonality mood={currentMood} size="sm" />
            ) : (
              <X className="h-6 w-6" />
            )
          ) : (
            <div className="text-center flex items-center justify-center">
              <MessageCircle className="h-7 w-7" />
            </div>
          )}
        </motion.div>
      </Button>
      
      {/* No help text - removed for cleaner design */}
    </div>
  );
}
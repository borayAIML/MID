import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles, Brain, Heart, Leaf, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export type MoodTheme = 
  | 'focus' 
  | 'calm' 
  | 'energetic' 
  | 'creative' 
  | 'professional' 
  | 'natural';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  cssVariables: Record<string, string>;
}

export function ThemeSelector() {
  const [currentMood, setCurrentMood] = useState<MoodTheme>('professional');
  const [isDark, setIsDark] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [showConfetti, setShowConfetti] = useState(false);

  const moodThemes: Record<MoodTheme, ThemeColors> = {
    focus: {
      primary: isDark ? '#4169E1' : '#6495ED', // Royal Blue
      secondary: isDark ? '#1E3A8A' : '#3B82F6', // Dark/Light Blue
      accent: '#FFA500', // Orange for focus/attention
      background: isDark ? '#1E293B' : '#F8FAFC',
      text: isDark ? '#F8FAFC' : '#1E293B',
      cssVariables: {
        '--theme-primary': isDark ? '#4169E1' : '#6495ED',
        '--theme-secondary': isDark ? '#1E3A8A' : '#3B82F6',
        '--theme-accent': '#FFA500',
        '--theme-background': isDark ? '#1E293B' : '#F8FAFC',
        '--theme-text': isDark ? '#F8FAFC' : '#1E293B',
      }
    },
    calm: {
      primary: isDark ? '#4682B4' : '#87CEEB', // Steel Blue to Sky Blue
      secondary: isDark ? '#5F9EA0' : '#ADD8E6', // Cadet Blue to Light Blue
      accent: '#9370DB', // Medium Purple
      background: isDark ? '#1A202C' : '#F0F8FF',
      text: isDark ? '#F0F8FF' : '#1A202C',
      cssVariables: {
        '--theme-primary': isDark ? '#4682B4' : '#87CEEB',
        '--theme-secondary': isDark ? '#5F9EA0' : '#ADD8E6',
        '--theme-accent': '#9370DB',
        '--theme-background': isDark ? '#1A202C' : '#F0F8FF',
        '--theme-text': isDark ? '#F0F8FF' : '#1A202C',
      }
    },
    energetic: {
      primary: isDark ? '#FF4500' : '#FF7F50', // Orange Red to Coral
      secondary: isDark ? '#FF6347' : '#FFA07A', // Tomato to Light Salmon
      accent: '#FFD700', // Gold
      background: isDark ? '#2D2D2D' : '#FFF5F5',
      text: isDark ? '#FFF5F5' : '#2D2D2D',
      cssVariables: {
        '--theme-primary': isDark ? '#FF4500' : '#FF7F50',
        '--theme-secondary': isDark ? '#FF6347' : '#FFA07A',
        '--theme-accent': '#FFD700',
        '--theme-background': isDark ? '#2D2D2D' : '#FFF5F5',
        '--theme-text': isDark ? '#FFF5F5' : '#2D2D2D',
      }
    },
    creative: {
      primary: isDark ? '#8A2BE2' : '#9932CC', // Blue Violet to Dark Orchid
      secondary: isDark ? '#9400D3' : '#BA55D3', // Dark Violet to Medium Orchid
      accent: '#00FFFF', // Cyan
      background: isDark ? '#2E1A47' : '#FAF5FF',
      text: isDark ? '#FAF5FF' : '#2E1A47',
      cssVariables: {
        '--theme-primary': isDark ? '#8A2BE2' : '#9932CC',
        '--theme-secondary': isDark ? '#9400D3' : '#BA55D3',
        '--theme-accent': '#00FFFF',
        '--theme-background': isDark ? '#2E1A47' : '#FAF5FF',
        '--theme-text': isDark ? '#FAF5FF' : '#2E1A47',
      }
    },
    professional: {
      primary: isDark ? '#2c3e50' : '#3498db', // Midnight Blue to Bright Blue
      secondary: isDark ? '#34495e' : '#2980b9', // Wet Asphalt to Belize Hole
      accent: '#16a085', // Green Sea
      background: isDark ? '#1A202C' : '#ffffff',
      text: isDark ? '#ffffff' : '#2c3e50',
      cssVariables: {
        '--theme-primary': isDark ? '#2c3e50' : '#3498db',
        '--theme-secondary': isDark ? '#34495e' : '#2980b9',
        '--theme-accent': '#16a085',
        '--theme-background': isDark ? '#1A202C' : '#ffffff',
        '--theme-text': isDark ? '#ffffff' : '#2c3e50',
      }
    },
    natural: {
      primary: isDark ? '#2E8B57' : '#3CB371', // Sea Green to Medium Sea Green
      secondary: isDark ? '#006400' : '#32CD32', // Dark Green to Lime Green
      accent: '#F4A460', // Sandy Brown
      background: isDark ? '#1C2A1C' : '#F5F7F0',
      text: isDark ? '#F5F7F0' : '#1C2A1C',
      cssVariables: {
        '--theme-primary': isDark ? '#2E8B57' : '#3CB371',
        '--theme-secondary': isDark ? '#006400' : '#32CD32',
        '--theme-accent': '#F4A460',
        '--theme-background': isDark ? '#1C2A1C' : '#F5F7F0',
        '--theme-text': isDark ? '#F5F7F0' : '#1C2A1C',
      }
    },
  };

  const moodIcons = {
    focus: <Brain className="h-5 w-5" />,
    calm: <Moon className="h-5 w-5" />,
    energetic: <Zap className="h-5 w-5" />,
    creative: <Sparkles className="h-5 w-5" />,
    professional: <Check className="h-5 w-5" />,
    natural: <Leaf className="h-5 w-5" />
  };

  const moodDescriptions = {
    focus: "Enhance concentration with blue hues",
    calm: "Relax with serene colors and soft animations",
    energetic: "Vibrant colors for high energy and motivation",
    creative: "Stimulate imagination with purple tones",
    professional: "Clean and polished corporate aesthetic",
    natural: "Earth tones for a grounded experience"
  };

  useEffect(() => {
    // Apply CSS variables to document root
    const colors = moodThemes[currentMood].cssVariables;
    const intensityFactor = intensity / 50; // 0-2 range (50 is neutral)
    
    Object.entries(colors).forEach(([key, value]) => {
      // Apply intensity to colors (but not to background and text)
      if (!key.includes('background') && !key.includes('text')) {
        // Adjust color intensity - this is a simple implementation
        // A more sophisticated version would use HSL
        document.documentElement.style.setProperty(key, value);
      } else {
        document.documentElement.style.setProperty(key, value);
      }
    });
    
    // If theme changes, show confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }, [currentMood, isDark, intensity]);

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "border-dashed border-2 transition-colors",
              "hover:border-primary hover:text-primary"
            )}
          >
            <span className="mr-2">Theme</span>
            <div 
              className="h-4 w-4 rounded-full" 
              style={{ backgroundColor: moodThemes[currentMood].primary }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Mood-Based Theme</h4>
            <p className="text-sm text-muted-foreground">
              Choose a theme that matches your current mood
            </p>
            
            <div className="flex justify-between space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setIsDark(false)}
              >
                <Sun className="h-4 w-4 mr-1" /> Light
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setIsDark(true)}
              >
                <Moon className="h-4 w-4 mr-1" /> Dark
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-medium">
                Color Intensity
              </label>
              <Slider 
                defaultValue={[50]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(value) => setIntensity(value[0])}
                className="mt-2"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">
                Mood Selection
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(Object.keys(moodThemes) as MoodTheme[]).map((mood) => (
                  <motion.button
                    key={mood}
                    className={cn(
                      "flex flex-col items-center py-2 px-1 rounded-md text-xs transition-colors",
                      currentMood === mood ? "bg-primary/20" : "hover:bg-muted"
                    )}
                    onClick={() => setCurrentMood(mood)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                      style={{ backgroundColor: moodThemes[mood].primary }}
                    >
                      {moodIcons[mood]}
                    </div>
                    <span className="capitalize">{mood}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="rounded-md p-3" style={{ backgroundColor: moodThemes[currentMood].background }}>
              <p 
                className="text-sm font-medium" 
                style={{ color: moodThemes[currentMood].text }}
              >
                {moodDescriptions[currentMood]}
              </p>
              <div className="flex space-x-2 mt-2">
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: moodThemes[currentMood].primary }}
                />
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: moodThemes[currentMood].secondary }}
                />
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: moodThemes[currentMood].accent }}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Confetti effect on theme change */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute top-0 w-full h-full overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: [
                    moodThemes[currentMood].primary,
                    moodThemes[currentMood].secondary,
                    moodThemes[currentMood].accent
                  ][i % 3],
                  top: '-10%',
                  left: `${Math.random() * 100}%`
                }}
                animate={{
                  y: ['0vh', `${100 + Math.random() * 20}vh`],
                  x: [`0%`, `${(Math.random() - 0.5) * 50}%`],
                  rotate: [0, Math.random() * 360]
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
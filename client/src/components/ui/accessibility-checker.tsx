import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  RefreshCw,
  Eye,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  calculateContrastRatio, 
  checkColorAccessibility, 
  suggestAccessibleAlternatives,
  AccessibilityCheckResult,
  hexToRgb,
  rgbToHsl,
  AccessibilityLevel,
  ContrastThresholds
} from '@/lib/colorAccessibility';
import { getMoodColorScheme, FinancialMood } from '@/lib/moodColorPalette';
import { cn } from '@/lib/utils';

// Component to display a color sample
const ColorSample = ({ 
  color, 
  textColor = '#000',
  onClick, 
  className,
  showHex = true,
  size = 'md'
}: { 
  color: string; 
  textColor?: string;
  onClick?: () => void; 
  className?: string;
  showHex?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeLookup = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-base'
  };
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-md cursor-pointer transition-transform hover:scale-105",
        sizeLookup[size],
        className
      )}
      style={{ backgroundColor: color, color: textColor }}
      onClick={onClick}
      aria-label={`Color ${color}`}
    >
      {showHex && <span>{color.substring(1, 7)}</span>}
    </div>
  );
};

// Component to display the contrast ratio result with visual feedback
const ContrastResult = ({ 
  ratio, 
  required, 
  level 
}: { 
  ratio: number; 
  required: number;
  level: AccessibilityLevel;
}) => {
  const passes = ratio >= required;
  
  return (
    <div className="flex items-center gap-2 mb-1">
      {passes ? (
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      )}
      <div className="flex-1">
        <div className="text-sm font-medium">
          {level} ({required}:1)
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn(
              "absolute left-0 top-0 h-full rounded-full",
              passes ? "bg-green-500" : "bg-red-400"
            )}
            style={{ width: `${Math.min(100, (ratio / required) * 100)}%` }}
          />
        </div>
      </div>
      <div className={cn(
        "text-sm font-medium",
        passes ? "text-green-600" : "text-red-600"
      )}>
        {ratio.toFixed(2)}:1
      </div>
    </div>
  );
};

// Component to display color information (RGB, HSL)
const ColorInformation = ({ 
  hexColor 
}: { 
  hexColor: string;
}) => {
  const rgb = hexToRgb(hexColor);
  const hsl = rgb ? rgbToHsl(rgb) : null;
  
  if (!rgb || !hsl) return null;
  
  return (
    <div className="text-sm space-y-1 mt-2">
      <div>
        <span className="font-medium">RGB: </span>
        <span>
          {rgb.r}, {rgb.g}, {rgb.b}
        </span>
      </div>
      <div>
        <span className="font-medium">HSL: </span>
        <span>
          {hsl.h}°, {hsl.s}%, {hsl.l}%
        </span>
      </div>
    </div>
  );
};

// Text sample component to visualize how text will look
const TextSample = ({
  foreground,
  background,
  size = 'normal'
}: {
  foreground: string;
  background: string;
  size?: 'small' | 'normal' | 'large';
}) => {
  const sizeLookup = {
    small: 'text-xs',
    normal: 'text-base',
    large: 'text-2xl font-bold'
  };
  
  return (
    <div 
      className="p-4 rounded-md my-3"
      style={{ backgroundColor: background }}
    >
      <p 
        className={cn("mb-1", sizeLookup[size])}
        style={{ color: foreground }}
      >
        {size === 'large' ? 'Large Text Example' : 'This is how your text will appear'}
      </p>
      {size === 'normal' && (
        <p 
          className="text-sm"
          style={{ color: foreground }}
        >
          Ensuring good contrast helps all users, especially those with low vision.
        </p>
      )}
    </div>
  );
};

// Main accessibility checker component
export function AccessibilityChecker() {
  const [foregroundColor, setForegroundColor] = useState('#1e293b');
  const [backgroundColor, setBackgroundColor] = useState('#f8fafc');
  const [results, setResults] = useState<AccessibilityCheckResult | null>(null);
  const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState('checker');
  const [selectedMood, setSelectedMood] = useState<FinancialMood>('neutral');
  
  // Check/update results when colors change
  useEffect(() => {
    try {
      const accessibilityResults = checkColorAccessibility(foregroundColor, backgroundColor);
      setResults(accessibilityResults);
      
      if (!accessibilityResults.passesAA) {
        const suggestions = suggestAccessibleAlternatives(foregroundColor, backgroundColor);
        setSuggestedColors(suggestions);
      } else {
        setSuggestedColors([]);
      }
    } catch (error) {
      console.error('Error checking accessibility:', error);
    }
  }, [foregroundColor, backgroundColor]);
  
  // Load a theme's colors
  const loadThemeColors = (mood: FinancialMood) => {
    setSelectedMood(mood);
    const theme = getMoodColorScheme(mood);
    setBackgroundColor(theme.background);
    setForegroundColor(theme.text);
  };
  
  // Handle color input change
  const handleColorChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'foreground' | 'background'
  ) => {
    const value = e.target.value;
    
    // Basic validation for hex colors
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      if (type === 'foreground') {
        setForegroundColor(value);
      } else {
        setBackgroundColor(value);
      }
    }
  };
  
  // Swap foreground and background colors
  const swapColors = () => {
    const temp = foregroundColor;
    setForegroundColor(backgroundColor);
    setBackgroundColor(temp);
  };
  
  // Apply a suggested color
  const applySuggestedColor = (color: string) => {
    setForegroundColor(color);
  };
  
  // Copy a color to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Color Accessibility Checker</h2>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="checker" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Checker</span>
            </TabsTrigger>
            <TabsTrigger value="palettes" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>Mood Palettes</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="checker" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <div className="flex gap-3 items-center">
                    <Input 
                      type="text" 
                      value={foregroundColor} 
                      onChange={(e) => handleColorChange(e, 'foreground')} 
                      className="font-mono"
                    />
                    <input 
                      type="color" 
                      value={foregroundColor} 
                      onChange={(e) => setForegroundColor(e.target.value)} 
                      className="w-10 h-10 rounded-md cursor-pointer"
                      aria-label="Pick text color"
                    />
                  </div>
                  <ColorInformation hexColor={foregroundColor} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <div className="flex gap-3 items-center">
                    <Input 
                      type="text" 
                      value={backgroundColor} 
                      onChange={(e) => handleColorChange(e, 'background')} 
                      className="font-mono"
                    />
                    <input 
                      type="color" 
                      value={backgroundColor} 
                      onChange={(e) => setBackgroundColor(e.target.value)} 
                      className="w-10 h-10 rounded-md cursor-pointer"
                      aria-label="Pick background color"
                    />
                  </div>
                  <ColorInformation hexColor={backgroundColor} />
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    className="mt-2" 
                    onClick={swapColors}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Swap Colors
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <TextSample 
                  foreground={foregroundColor} 
                  background={backgroundColor}
                  size="normal"
                />
                
                <TextSample 
                  foreground={foregroundColor} 
                  background={backgroundColor}
                  size="large"
                />
                
                {results && (
                  <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium mb-2">Contrast Results</h3>
                    <ContrastResult 
                      ratio={results.contrastRatio} 
                      required={ContrastThresholds[AccessibilityLevel.AA_SMALL]}
                      level={AccessibilityLevel.AA_SMALL}
                    />
                    <ContrastResult 
                      ratio={results.contrastRatio} 
                      required={ContrastThresholds[AccessibilityLevel.AA_LARGE]}
                      level={AccessibilityLevel.AA_LARGE}
                    />
                    <ContrastResult 
                      ratio={results.contrastRatio} 
                      required={ContrastThresholds[AccessibilityLevel.AAA_SMALL]}
                      level={AccessibilityLevel.AAA_SMALL}
                    />
                    <ContrastResult 
                      ratio={results.contrastRatio} 
                      required={ContrastThresholds[AccessibilityLevel.AAA_LARGE]}
                      level={AccessibilityLevel.AAA_LARGE}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {suggestedColors.length > 0 && (
              <div className="mt-6 p-4 border border-amber-200 rounded-md bg-amber-50">
                <h3 className="flex items-center font-medium text-amber-800 mb-3">
                  <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                  Suggested Accessible Alternatives
                </h3>
                <p className="text-sm text-amber-700 mb-4">
                  These colors maintain a similar appearance but provide better contrast.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {suggestedColors.map((color, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center"
                    >
                      <TextSample 
                        foreground={color} 
                        background={backgroundColor}
                        size="small"
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono">
                          {color}
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(color)}
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => applySuggestedColor(color)}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="sr-only">Apply</span>
                        </Button>
                      </div>
                      <div className="text-xs mt-1">
                        {calculateContrastRatio(color, backgroundColor).toFixed(2)}:1
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="palettes" className="mt-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Financial Mood Palettes</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Check accessibility across different financial mood color schemes.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(['growth', 'stability', 'caution', 'recovery', 'ambition', 'neutral'] as FinancialMood[]).map((mood) => {
                    const colors = getMoodColorScheme(mood);
                    const isSelected = selectedMood === mood;
                    
                    return (
                      <div 
                        key={mood}
                        className={cn(
                          "p-3 rounded-md border-2 cursor-pointer transition-all",
                          isSelected 
                            ? "border-blue-500 bg-blue-50" 
                            : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => loadThemeColors(mood)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium capitalize">{mood}</h4>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex gap-2 mb-2">
                          <ColorSample 
                            color={colors.primary} 
                            showHex={false}
                            size="sm"
                          />
                          <ColorSample 
                            color={colors.secondary} 
                            showHex={false}
                            size="sm"
                          />
                          <ColorSample 
                            color={colors.accent} 
                            showHex={false}
                            size="sm"
                          />
                        </div>
                        <div className="text-xs mt-2">
                          Text vs Background: {calculateContrastRatio(colors.text, colors.background).toFixed(2)}:1
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {selectedMood && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Selected Palette: {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}</h3>
                  
                  <Accordion type="single" collapsible defaultValue="text-bg">
                    <AccordionItem value="text-bg">
                      <AccordionTrigger className="py-2">
                        Text vs Background
                      </AccordionTrigger>
                      <AccordionContent>
                        {(() => {
                          const colors = getMoodColorScheme(selectedMood);
                          const check = checkColorAccessibility(colors.text, colors.background);
                          
                          return (
                            <div className="pt-2">
                              <TextSample 
                                foreground={colors.text} 
                                background={colors.background}
                                size="normal"
                              />
                              
                              <div className="mt-2 p-3 rounded-md bg-gray-50">
                                <div className="flex justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span>Text: </span>
                                    <ColorSample 
                                      color={colors.text} 
                                      size="sm"
                                      showHex={false}
                                    />
                                    <span className="text-xs font-mono">{colors.text}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span>Background: </span>
                                    <ColorSample 
                                      color={colors.background} 
                                      size="sm"
                                      showHex={false}
                                    />
                                    <span className="text-xs font-mono">{colors.background}</span>
                                  </div>
                                </div>
                                
                                <ContrastResult 
                                  ratio={check.contrastRatio} 
                                  required={ContrastThresholds[AccessibilityLevel.AA_SMALL]}
                                  level={AccessibilityLevel.AA_SMALL}
                                />
                              </div>
                            </div>
                          );
                        })()}
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="buttons">
                      <AccordionTrigger className="py-2">
                        Button Colors
                      </AccordionTrigger>
                      <AccordionContent>
                        {(() => {
                          const colors = getMoodColorScheme(selectedMood);
                          const buttonText = '#ffffff'; // Assuming white text on buttons
                          
                          const primaryCheck = checkColorAccessibility(buttonText, colors.primary);
                          const secondaryCheck = checkColorAccessibility(buttonText, colors.secondary);
                          
                          return (
                            <div className="space-y-4 pt-2">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Primary Button</h4>
                                <div 
                                  className="p-3 rounded-md flex items-center justify-center font-medium"
                                  style={{ backgroundColor: colors.primary, color: buttonText }}
                                >
                                  Primary Action
                                </div>
                                <div className="mt-2 bg-gray-50 p-2 rounded">
                                  <ContrastResult 
                                    ratio={primaryCheck.contrastRatio} 
                                    required={ContrastThresholds[AccessibilityLevel.AA_SMALL]}
                                    level={AccessibilityLevel.AA_SMALL}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-2">Secondary Button</h4>
                                <div 
                                  className="p-3 rounded-md flex items-center justify-center font-medium"
                                  style={{ backgroundColor: colors.secondary, color: buttonText }}
                                >
                                  Secondary Action
                                </div>
                                <div className="mt-2 bg-gray-50 p-2 rounded">
                                  <ContrastResult 
                                    ratio={secondaryCheck.contrastRatio} 
                                    required={ContrastThresholds[AccessibilityLevel.AA_SMALL]}
                                    level={AccessibilityLevel.AA_SMALL}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="all-colors">
                      <AccordionTrigger className="py-2">
                        All Colors Analysis
                      </AccordionTrigger>
                      <AccordionContent>
                        {(() => {
                          const colors = getMoodColorScheme(selectedMood);
                          const colorEntries = [
                            ['Primary', colors.primary],
                            ['Secondary', colors.secondary],
                            ['Accent', colors.accent],
                            ['Success', colors.success],
                            ['Warning', colors.warning],
                            ['Danger', colors.danger],
                            ['Info', colors.info],
                          ] as const;
                          
                          return (
                            <div className="space-y-4 pt-2">
                              <div className="grid grid-cols-4 gap-2">
                                {colorEntries.map(([name, color]) => (
                                  <ColorSample 
                                    key={name} 
                                    color={color}
                                    showHex={true}
                                    size="md"
                                    className="flex-col"
                                  />
                                ))}
                              </div>
                              
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Color</th>
                                    <th className="text-left py-2">On Background</th>
                                    <th className="text-right py-2">Ratio</th>
                                    <th className="text-right py-2">AA</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {colorEntries.map(([name, color]) => {
                                    const ratio = calculateContrastRatio(color, colors.background);
                                    const passesAA = ratio >= ContrastThresholds[AccessibilityLevel.AA_SMALL];
                                    
                                    return (
                                      <tr key={name} className="border-b">
                                        <td className="py-2 flex items-center gap-2">
                                          <div 
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: color }}
                                          />
                                          {name}
                                        </td>
                                        <td className="py-2">
                                          <div 
                                            className="px-2 py-1 rounded text-center text-xs"
                                            style={{ 
                                              backgroundColor: colors.background, 
                                              color: color 
                                            }}
                                          >
                                            Sample
                                          </div>
                                        </td>
                                        <td className="text-right py-2">
                                          {ratio.toFixed(2)}:1
                                        </td>
                                        <td className="text-right py-2">
                                          {passesAA ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500 inline" />
                                          ) : (
                                            <XCircle className="w-4 h-4 text-red-500 inline" />
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
      </div>
    </div>
  );
}

// Simplified access to color checker (direct version)
export function SimpleColorChecker() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [contrast, setContrast] = useState(21);
  const [passesAA, setPassesAA] = useState(true);
  
  useEffect(() => {
    try {
      const ratio = calculateContrastRatio(foreground, background);
      setContrast(ratio);
      setPassesAA(ratio >= ContrastThresholds[AccessibilityLevel.AA_SMALL]);
    } catch (e) {
      console.error(e);
    }
  }, [foreground, background]);
  
  return (
    <div className="p-4 border rounded-md space-y-3">
      <h3 className="font-medium">Quick Color Check</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs block mb-1">Text</label>
          <input
            type="color"
            value={foreground}
            onChange={(e) => setForeground(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs block mb-1">Background</label>
          <input
            type="color"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div 
        className="p-3 rounded-md text-center"
        style={{ backgroundColor: background, color: foreground }}
      >
        Sample Text
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          Contrast: <span className="font-bold">{contrast.toFixed(2)}:1</span>
        </div>
        <div>
          {passesAA ? (
            <span className="text-xs text-green-600 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Passes AA
            </span>
          ) : (
            <span className="text-xs text-red-600 flex items-center">
              <XCircle className="w-3 h-3 mr-1" /> Fails AA
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
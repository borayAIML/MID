/**
 * Dynamic color palette generator based on financial moods
 * Uses color psychology principles to match user's financial goals and emotional state
 */

export type FinancialMood = 
  | 'growth' // Optimistic, seeking expansion
  | 'stability' // Seeking security and consistency
  | 'caution' // Risk-averse, careful decision making
  | 'recovery' // Rebuilding after setbacks
  | 'ambition' // High-achievement oriented
  | 'neutral'; // Default state

export interface MoodColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  subtle: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  cardBg: string;
  buttonGradient: {
    from: string;
    to: string;
  };
  moodName: string;
  moodDescription: string;
}

// Color palette definitions based on psychological research
const moodPalettes: Record<FinancialMood, MoodColorScheme> = {
  growth: {
    primary: '#2563eb', // Blue - trust, stability with growth potential
    secondary: '#10b981', // Green - growth, prosperity
    accent: '#8b5cf6', // Purple - ambition, creativity
    background: '#f8fafc', // Light background - open possibilities
    text: '#1e293b', // Dark enough for contrast
    subtle: '#94a3b8', // Subtle text for secondary information
    success: '#059669', // Rich green - prosperity
    warning: '#d97706', // Amber - cautious optimism
    danger: '#dc2626', // Red - clear warning/danger 
    info: '#0ea5e9', // Blue - informational
    cardBg: '#ffffff',
    buttonGradient: {
      from: '#3b82f6',
      to: '#2563eb'
    },
    moodName: 'Growth',
    moodDescription: 'Focused on expansion and new opportunities'
  },
  
  stability: {
    primary: '#0f766e', // Teal - stability, reliability
    secondary: '#4f46e5', // Indigo - trustworthiness
    accent: '#0369a1', // Blue - dependability
    background: '#f8fafc', // Clean background - structure
    text: '#1e293b', // Dark text for readability
    subtle: '#64748b', // Subtle text
    success: '#15803d', // Forest green - established growth
    warning: '#b45309', // Amber brown - measured caution
    danger: '#b91c1c', // Darker red - serious but not alarming
    info: '#0284c7', // Darker blue - reliable information
    cardBg: '#f1f5f9',
    buttonGradient: {
      from: '#0e7490',
      to: '#0f766e'
    },
    moodName: 'Stability',
    moodDescription: 'Seeking security and long-term consistency'
  },
  
  caution: {
    primary: '#ca8a04', // Yellow - caution, attention
    secondary: '#64748b', // Slate - neutrality
    accent: '#9ca3af', // Gray - reserved
    background: '#fefce8', // Very light yellow - alertness
    text: '#44403c', // Brown text - grounding
    subtle: '#78716c', // Subtle earthy tone
    success: '#4d7c0f', // Muted green - cautious optimism
    warning: '#b45309', // Amber - attention
    danger: '#9f1239', // Burgundy - serious warning
    info: '#0369a1', // Darker blue - reliable
    cardBg: '#fff7ed',
    buttonGradient: {
      from: '#eab308',
      to: '#ca8a04'
    },
    moodName: 'Caution',
    moodDescription: 'Taking careful, deliberate steps'
  },
  
  recovery: {
    primary: '#06b6d4', // Cyan - refreshing, new beginning
    secondary: '#14b8a6', // Teal - healing, renewal
    accent: '#f59e0b', // Amber - warmth, encouragement
    background: '#ecfeff', // Very light cyan - fresh start
    text: '#0f172a', // Navy text - depth, seriousness
    subtle: '#64748b', // Slate - balance
    success: '#16a34a', // Green - new growth
    warning: '#f59e0b', // Amber - care required
    danger: '#e11d48', // Rose - attention to problems
    info: '#0284c7', // Blue - guidance
    cardBg: '#f0fdfa',
    buttonGradient: {
      from: '#22d3ee',
      to: '#06b6d4'
    },
    moodName: 'Recovery',
    moodDescription: 'Building back stronger after challenges'
  },
  
  ambition: {
    primary: '#7c3aed', // Violet - ambition, luxury
    secondary: '#ec4899', // Pink - energy, excitement
    accent: '#f97316', // Orange - enthusiasm 
    background: '#f5f3ff', // Light violet - aspiration
    text: '#1e1b4b', // Indigo text - depth
    subtle: '#6b7280', // Gray - balance to the vibrant palette
    success: '#15803d', // Green - achievement
    warning: '#ea580c', // Orange - challenge
    danger: '#be123c', // Deep red - obstacles
    info: '#4f46e5', // Indigo - inspiration
    cardBg: '#faf5ff',
    buttonGradient: {
      from: '#8b5cf6',
      to: '#7c3aed'
    },
    moodName: 'Ambition',
    moodDescription: 'Aiming high and pursuing excellence'
  },
  
  neutral: {
    primary: '#3b82f6', // Blue - versatile, neutral
    secondary: '#64748b', // Slate - balanced, professional
    accent: '#6366f1', // Indigo - subtle interest
    background: '#f8fafc', // Light background - clean, professional
    text: '#1e293b', // Dark slate - professional, readable
    subtle: '#94a3b8', // Light slate - subtle
    success: '#22c55e', // Green - standard success
    warning: '#f59e0b', // Amber - standard warning
    danger: '#ef4444', // Red - standard danger
    info: '#3b82f6', // Blue - standard info
    cardBg: '#ffffff',
    buttonGradient: {
      from: '#4f46e5',
      to: '#3b82f6'
    },
    moodName: 'Professional',
    moodDescription: 'Balanced and focused approach'
  }
};

/**
 * Determines the most appropriate financial mood based on user goals and business metrics
 */
export function determineMood(params: {
  goal?: string;
  revenue?: number;
  yearsInBusiness?: number;
  riskTolerance?: number; // 1-10 scale
  targetGrowth?: number; // percentage
  recentSetback?: boolean;
}): FinancialMood {
  const { goal, revenue, yearsInBusiness, riskTolerance, targetGrowth, recentSetback } = params;
  
  // Default to neutral for empty parameters
  if (!goal && !revenue && !yearsInBusiness && !riskTolerance && !targetGrowth) {
    return 'neutral';
  }
  
  // Check for recovery signals first
  if (recentSetback) {
    return 'recovery';
  }
  
  // Check goal-based signals
  if (goal) {
    const goalLower = goal.toLowerCase();
    if (goalLower.includes('grow') || goalLower.includes('expand') || goalLower.includes('scale')) {
      return targetGrowth && targetGrowth > 30 ? 'ambition' : 'growth';
    }
    if (goalLower.includes('sell') || goalLower.includes('exit') || goalLower.includes('acquisition')) {
      return 'ambition';
    }
    if (goalLower.includes('stabilize') || goalLower.includes('maintain') || goalLower.includes('secure')) {
      return 'stability';
    }
    if (goalLower.includes('risk') || goalLower.includes('careful') || goalLower.includes('debts')) {
      return 'caution';
    }
  }
  
  // Risk profile signals
  if (riskTolerance !== undefined) {
    if (riskTolerance <= 3) return 'caution';
    if (riskTolerance >= 8) return 'ambition';
  }
  
  // Business maturity signals
  if (yearsInBusiness !== undefined) {
    if (yearsInBusiness < 2) return 'growth';
    if (yearsInBusiness > 10) return 'stability';
  }
  
  // Revenue-based signals
  if (revenue !== undefined) {
    if (revenue > 5000000) return 'stability'; // Established business
    if (revenue < 500000) return 'growth'; // Growing business
  }
  
  // Default mood
  return 'neutral';
}

/**
 * Gets color palette based on financial mood
 */
export function getMoodColorScheme(mood: FinancialMood): MoodColorScheme {
  return moodPalettes[mood] || moodPalettes.neutral;
}

/**
 * Applies the selected mood color scheme to CSS variables
 */
export function applyMoodColorScheme(mood: FinancialMood): void {
  const colors = getMoodColorScheme(mood);
  const root = document.documentElement;
  
  // Set CSS variables
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-subtle', colors.subtle);
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-danger', colors.danger);
  root.style.setProperty('--color-info', colors.info);
  root.style.setProperty('--color-card-bg', colors.cardBg);
  root.style.setProperty('--gradient-from', colors.buttonGradient.from);
  root.style.setProperty('--gradient-to', colors.buttonGradient.to);
  
  // Store current mood in localStorage for persistence
  localStorage.setItem('financialMood', mood);
}

/**
 * Detect the most appropriate mood automatically from available user data
 */
export function autoDetectMood(): FinancialMood {
  // Try to get data from localStorage
  const localGoal = localStorage.getItem('userGoal') || '';
  const localRevenue = parseFloat(localStorage.getItem('companyRevenue') || '0');
  const localYears = parseFloat(localStorage.getItem('yearsInBusiness') || '0');
  
  return determineMood({
    goal: localGoal,
    revenue: localRevenue || undefined,
    yearsInBusiness: localYears || undefined
  });
}

/**
 * Initialize the mood system, either from saved preference or auto-detect
 */
export function initializeMoodSystem(): void {
  // First check if user has a saved preference
  const savedMood = localStorage.getItem('financialMood') as FinancialMood;
  
  if (savedMood && Object.keys(moodPalettes).includes(savedMood)) {
    applyMoodColorScheme(savedMood);
  } else {
    // Auto-detect based on available data
    const detectedMood = autoDetectMood();
    applyMoodColorScheme(detectedMood);
  }
}
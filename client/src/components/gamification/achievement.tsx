import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Lock, Star, Trophy, TrendingUp, FileCheck, Users, Lightbulb } from 'lucide-react';

export type AchievementType = 
  | 'data_entry'
  | 'financial_complete'
  | 'valuation_first'
  | 'improve_score'
  | 'document_upload' 
  | 'share_report'
  | 'buyer_match'
  | 'suggestion_apply';

type AchievementLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

interface AchievementProps {
  type: AchievementType;
  unlocked?: boolean;
  level?: AchievementLevel;
  withAnimation?: boolean;
  className?: string;
  progress?: number; // 0-100
  onClick?: () => void;
}

interface AchievementConfig {
  title: string;
  description: string;
  icon: React.ElementType;
  color: {
    bronze: string;
    silver: string;
    gold: string;
    platinum: string;
  };
  background: {
    bronze: string;
    silver: string;
    gold: string;
    platinum: string;
  };
}

// Achievement configurations
export const achievementConfigs: Record<AchievementType, AchievementConfig> = {
  data_entry: {
    title: 'Data Maven',
    description: 'Complete your business profile data',
    icon: CheckCircle,
    color: {
      bronze: 'text-amber-600',
      silver: 'text-slate-400',
      gold: 'text-amber-400',
      platinum: 'text-emerald-300',
    },
    background: {
      bronze: 'bg-amber-100',
      silver: 'bg-slate-100',
      gold: 'bg-amber-50',
      platinum: 'bg-emerald-50',
    }
  },
  financial_complete: {
    title: 'Number Cruncher',
    description: 'Enter all financial information',
    icon: TrendingUp,
    color: {
      bronze: 'text-blue-600',
      silver: 'text-slate-400',
      gold: 'text-amber-400',
      platinum: 'text-emerald-300',
    },
    background: {
      bronze: 'bg-blue-100',
      silver: 'bg-slate-100',
      gold: 'bg-amber-50',
      platinum: 'bg-emerald-50',
    }
  },
  valuation_first: {
    title: 'Value Visionary',
    description: 'Get your first business valuation',
    icon: Trophy,
    color: {
      bronze: 'text-purple-600',
      silver: 'text-slate-400',
      gold: 'text-amber-400',
      platinum: 'text-emerald-300',
    },
    background: {
      bronze: 'bg-purple-100',
      silver: 'bg-slate-100',
      gold: 'bg-amber-50',
      platinum: 'bg-emerald-50',
    }
  },
  improve_score: {
    title: 'Growth Guru',
    description: 'Improve your valuation score',
    icon: Star,
    color: {
      bronze: 'text-green-600',
      silver: 'text-slate-400',
      gold: 'text-amber-400',
      platinum: 'text-emerald-300',
    },
    background: {
      bronze: 'bg-green-100',
      silver: 'bg-slate-100',
      gold: 'bg-amber-50',
      platinum: 'bg-emerald-50',
    }
  },
  document_upload: {
    title: 'Document Master',
    description: 'Upload all required documents',
    icon: FileCheck,
    color: {
      bronze: 'text-orange-600',
      silver: 'text-slate-400',
      gold: 'text-amber-400',
      platinum: 'text-emerald-300',
    },
    background: {
      bronze: 'bg-orange-100',
      silver: 'bg-slate-100',
      gold: 'bg-amber-50',
      platinum: 'bg-emerald-50',
    }
  },
  share_report: {
    title: 'Connected Leader',
    description: 'Share your valuation report',
    icon: Users,
    color: {
      bronze: 'text-indigo-600',
      silver: 'text-slate-400',
      gold: 'text-amber-400',
      platinum: 'text-emerald-300',
    },
    background: {
      bronze: 'bg-indigo-100',
      silver: 'bg-slate-100',
      gold: 'bg-amber-50',
      platinum: 'bg-emerald-50',
    }
  },
  buyer_match: {
    title: 'Perfect Match',
    description: 'Find potential buyers for your business',
    icon: Users,
    color: {
      bronze: 'text-pink-600',
      silver: 'text-slate-400',
      gold: 'text-amber-400',
      platinum: 'text-emerald-300',
    },
    background: {
      bronze: 'bg-pink-100',
      silver: 'bg-slate-100',
      gold: 'bg-amber-50',
      platinum: 'bg-emerald-50',
    }
  },
  suggestion_apply: {
    title: 'Improvement Pioneer',
    description: 'Apply valuation improvement suggestions',
    icon: Lightbulb,
    color: {
      bronze: 'text-yellow-600',
      silver: 'text-slate-400',
      gold: 'text-amber-400',
      platinum: 'text-emerald-300',
    },
    background: {
      bronze: 'bg-yellow-100',
      silver: 'bg-slate-100',
      gold: 'bg-amber-50',
      platinum: 'bg-emerald-50',
    }
  }
};

export function Achievement({
  type,
  unlocked = false,
  level = 'bronze',
  withAnimation = true,
  className,
  progress = unlocked ? 100 : 0,
  onClick
}: AchievementProps) {
  const config = achievementConfigs[type];

  const variants = {
    locked: { scale: 0.95, opacity: 0.7 },
    unlocked: { scale: 1, opacity: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 1, 1],
      transition: { 
        duration: 1.5,
        repeat: 1,
        repeatType: "reverse" as const
      }
    }
  };

  const IconComponent = config.icon;
  
  // Get the appropriate colors based on level
  const colorClass = unlocked 
    ? (level === 'bronze' ? 'text-amber-600' : 
       level === 'silver' ? 'text-slate-400' : 
       level === 'gold' ? 'text-amber-400' : 
       'text-emerald-300')
    : 'text-gray-400';
    
  const bgClass = unlocked 
    ? (level === 'bronze' ? 'bg-amber-100' : 
       level === 'silver' ? 'bg-slate-100' : 
       level === 'gold' ? 'bg-amber-50' : 
       'bg-emerald-50')
    : 'bg-gray-50';
    
  const borderClass = unlocked 
    ? (level === 'bronze' ? 'border-amber-300' : 
       level === 'silver' ? 'border-slate-300' : 
       level === 'gold' ? 'border-amber-300' : 
       'border-emerald-300')
    : 'border-gray-200';

  return (
    <motion.div
      initial={withAnimation ? "locked" : false}
      animate={withAnimation ? (unlocked ? "pulse" : "locked") : false}
      variants={variants}
      whileHover={{ scale: 1.03 }}
      className={cn("cursor-pointer", className)}
      onClick={onClick}
    >
      <Card className={cn(
        "border-2 overflow-hidden transition-all", 
        borderClass,
        bgClass
      )}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "rounded-full p-2", 
              unlocked ? colorClass : "bg-gray-100"
            )}>
              {unlocked ? <IconComponent size={24} /> : <Lock size={24} />}
            </div>
            <div>
              <h3 className={cn(
                "font-semibold",
                unlocked ? "text-gray-800" : "text-gray-500"
              )}>
                {config.title}
              </h3>
              <p className="text-sm text-gray-500">{config.description}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          {!unlocked && progress > 0 && progress < 100 && (
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          {/* Badge for completed achievements */}
          {unlocked && (
            <div className="flex justify-end mt-2">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs uppercase font-bold",
                  colorClass,
                  "border-current"
                )}
              >
                {level}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Achievement collection component
interface AchievementCollectionProps {
  achievements: {
    type: AchievementType;
    unlocked: boolean;
    level?: AchievementLevel;
    progress?: number;
  }[];
  className?: string;
  onAchievementClick?: (type: AchievementType) => void;
}

export function AchievementCollection({
  achievements,
  className,
  onAchievementClick
}: AchievementCollectionProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {achievements.map((achievement) => (
        <Achievement
          key={achievement.type}
          type={achievement.type}
          unlocked={achievement.unlocked}
          level={achievement.level || 'bronze'}
          progress={achievement.progress}
          onClick={() => onAchievementClick?.(achievement.type)}
        />
      ))}
    </div>
  );
}
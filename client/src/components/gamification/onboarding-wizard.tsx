import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Award, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AnimatedElement } from '@/components/ui/animated-element';
import { AchievementType, Achievement } from './achievement';
import { achievementConfigs } from './achievement';

interface OnboardingWizardProps {
  onComplete: () => void;
  onboardingData?: any;
  updateOnboardingData?: (data: any) => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  achievementType: AchievementType;
  component: React.ReactNode;
}

export function OnboardingWizard({
  onComplete,
  onboardingData = {},
  updateOnboardingData = () => {}
}: OnboardingWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<AchievementType[]>([]);
  const [showAchievementNotification, setShowAchievementNotification] = useState<{
    show: boolean;
    type: AchievementType | null;
  }>({ show: false, type: null });

  // Define the onboarding steps
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to BusinessValAI',
      description: 'Your journey to accurate business valuation starts here',
      achievementType: 'data_entry',
      component: (
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mx-auto mb-6 rounded-full bg-blue-100 p-6 inline-block"
          >
            <Award size={64} className="text-blue-600" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-4">Get Ready to Unlock Your Business's True Value</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Complete each step to earn achievements and discover insights about your business's worth.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
            {['data_entry', 'financial_complete', 'valuation_first'].map((type, i) => (
              <AnimatedElement 
                key={type} 
                type="card"
                delay={i * 200}
              >
                <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                  <div className="rounded-full bg-blue-50 p-2 inline-block mb-2">
                    {type === 'data_entry' ? (
                      <CheckCircle2 size={20} className="text-blue-500" />
                    ) : type === 'financial_complete' ? (
                      <Star size={20} className="text-amber-500" />
                    ) : (
                      <Award size={20} className="text-purple-500" />
                    )}
                  </div>
                  <p className="text-xs font-medium">
                    {type === 'data_entry' ? 'Enter Data' : 
                     type === 'financial_complete' ? 'Add Financials' : 
                     'Get Valuation'}
                  </p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'company-profile',
      title: 'Company Profile',
      description: 'Tell us about your business',
      achievementType: 'data_entry',
      component: (
        <div className="py-6">
          <p className="text-gray-500 mb-6">
            The more accurately you complete your profile, the more precise your valuation will be.
          </p>
          
          {/* This would be a form component in a real implementation */}
          <div className="space-y-4">
            <AnimatedElement type="input" delay={100}>
              <div className="p-4 border rounded-lg bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  placeholder="Enter company name" 
                />
              </div>
            </AnimatedElement>
            
            <AnimatedElement type="input" delay={200}>
              <div className="p-4 border rounded-lg bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select className="w-full p-2 border rounded">
                  <option value="">Select industry</option>
                  <option value="tech">Technology</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="services">Services</option>
                </select>
              </div>
            </AnimatedElement>
            
            <AnimatedElement type="input" delay={300}>
              <div className="p-4 border rounded-lg bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years in Business
                </label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded"
                  placeholder="Enter years" 
                />
              </div>
            </AnimatedElement>
          </div>
        </div>
      )
    },
    {
      id: 'financial-info',
      title: 'Financial Information',
      description: 'Add your company\'s financial data',
      achievementType: 'financial_complete',
      component: (
        <div className="py-6">
          <p className="text-gray-500 mb-6">
            Your financial data helps us calculate accurate valuation multiples for your business.
          </p>
          
          <div className="space-y-4">
            <AnimatedElement type="input" delay={100}>
              <div className="p-4 border rounded-lg bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Revenue ($)
                </label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded"
                  placeholder="Enter annual revenue" 
                />
              </div>
            </AnimatedElement>
            
            <AnimatedElement type="input" delay={200}>
              <div className="p-4 border rounded-lg bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EBITDA ($)
                </label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded"
                  placeholder="Enter EBITDA" 
                />
              </div>
            </AnimatedElement>
            
            <AnimatedElement type="input" delay={300}>
              <div className="p-4 border rounded-lg bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Net Profit Margin (%)
                </label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded"
                  placeholder="Enter profit margin" 
                />
              </div>
            </AnimatedElement>
          </div>
        </div>
      )
    },
    {
      id: 'document-upload',
      title: 'Upload Documents',
      description: 'Add supporting documents for a more accurate valuation',
      achievementType: 'document_upload',
      component: (
        <div className="py-6">
          <p className="text-gray-500 mb-6">
            Adding financial statements and other documents improves the accuracy of your valuation.
          </p>
          
          <div className="space-y-4">
            <AnimatedElement type="card" delay={100}>
              <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                <div className="mb-4 rounded-full bg-blue-50 p-3">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Upload Financial Statements</h3>
                <p className="text-xs text-gray-500 mt-1">PDF, Excel or image files</p>
                <button className="mt-4 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none">
                  Select File
                </button>
              </div>
            </AnimatedElement>
            
            <AnimatedElement type="card" delay={200}>
              <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                <div className="mb-4 rounded-full bg-green-50 p-3">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Upload Tax Documents</h3>
                <p className="text-xs text-gray-500 mt-1">PDF, Excel or image files</p>
                <button className="mt-4 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none">
                  Select File
                </button>
              </div>
            </AnimatedElement>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: 'You\'ve Completed the Setup!',
      description: 'Ready to explore your business valuation',
      achievementType: 'valuation_first',
      component: (
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1.2, type: 'spring' }}
            className="mx-auto mb-6 rounded-full bg-green-100 p-6 inline-block"
          >
            <CheckCircle2 size={64} className="text-green-500" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-4">Congratulations!</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            You've unlocked valuable achievements and insights. Now it's time to discover your business's true value.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
            {unlockedAchievements.map((achievement, index) => (
              <div key={achievement} className="scale-90">
                <Achievement 
                  type={achievement}
                  unlocked={true}
                  level="bronze"
                  withAnimation={false}
                />
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[currentStepIndex];
  const progress = Math.round(((currentStepIndex) / (steps.length - 1)) * 100);

  // Handle advancing to the next step
  const handleNextStep = () => {
    const stepId = currentStep.id;
    const achievementType = currentStep.achievementType;

    // If this step wasn't already completed, mark it as completed
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      
      // If this achievement wasn't already unlocked, unlock it and show notification
      if (!unlockedAchievements.includes(achievementType)) {
        setUnlockedAchievements([...unlockedAchievements, achievementType]);
        setShowAchievementNotification({
          show: true,
          type: achievementType
        });
        
        // Hide the notification after 3 seconds
        setTimeout(() => {
          setShowAchievementNotification({ show: false, type: null });
        }, 3000);
      }
    }

    // If this is the last step, call the complete handler
    if (currentStepIndex === steps.length - 1) {
      onComplete();
    } else {
      // Otherwise go to the next step
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // Handle going back to the previous step
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Animation variants for step transitions
  const stepVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Getting Started</span>
          <span>Company Info</span>
          <span>Financials</span>
          <span>Documents</span>
          <span>Complete</span>
        </div>
      </div>

      <Card className="shadow-lg border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial="enter"
              animate="center"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              {currentStep.component}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Button onClick={handleNextStep}>
            {currentStepIndex === steps.length - 1 ? 'Complete' : 'Continue'} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Achievement notification toast */}
      <AnimatePresence>
        {showAchievementNotification.show && showAchievementNotification.type && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center space-x-3">
              <div className="rounded-full bg-green-100 p-2">
                <Award className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Achievement Unlocked!</h3>
                <p className="text-sm text-gray-500">
                  {achievementConfigs[showAchievementNotification.type].title}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
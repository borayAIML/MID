import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import OnboardingForm from "@/pages/OnboardingForm";
import BusinessDataWizard from "@/pages/BusinessDataWizard";
import ValuationDashboard from "@/pages/ValuationDashboard";
import ValuationReport from "@/pages/ValuationReport";
import DataRoom from "@/pages/DataRoom";
import ValuationImprovementSuggestions from "@/pages/ValuationImprovementSuggestions";
import BuyerMatchRecommendations from "@/pages/BuyerMatchRecommendations";
import UXShowcase from "@/pages/UXShowcase";
import OurApproach from "@/pages/OurApproach";
import WhoWeServe from "@/pages/WhoWeServe";
import IndustryInsights from "@/pages/IndustryInsights";
import ValuationServices from "@/pages/ValuationServices";
import EuropeanMarkets from "@/pages/EuropeanMarkets";
import SuccessStories from "@/pages/SuccessStories";
import AboutUs from "@/pages/AboutUs";
import OurTeam from "@/pages/OurTeam";
import AIFeatureTest from "@/pages/AIFeatureTest";
import EmiliaShowcase from "@/pages/EmiliaShowcase";
import FAQ from "@/pages/FAQ";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import LiveBenchmarks from "@/pages/LiveBenchmarks";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import { useState, useEffect } from "react";
import { BusinessDataWizardData, OnboardingFormData } from "@shared/schema";

function Router() {
  const [location] = useLocation();
  
  // Load initial state from localStorage or use null
  const [userData, setUserData] = useState<OnboardingFormData | null>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [businessData, setBusinessData] = useState<BusinessDataWizardData | null>(() => {
    const saved = localStorage.getItem('businessData');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [companyId, setCompanyId] = useState<number | null>(() => {
    const saved = localStorage.getItem('companyId');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);
  
  useEffect(() => {
    if (businessData) {
      localStorage.setItem('businessData', JSON.stringify(businessData));
    }
  }, [businessData]);
  
  useEffect(() => {
    if (companyId) {
      localStorage.setItem('companyId', JSON.stringify(companyId));
    }
  }, [companyId]);
  
  const handleOnboardingComplete = (data: OnboardingFormData) => {
    setUserData(data);
    // Save user data to localStorage for persistence
    localStorage.setItem('userData', JSON.stringify(data));
  };
  
  const handleBusinessDataComplete = (data: BusinessDataWizardData, id: number) => {
    setBusinessData(data);
    setCompanyId(id);
  };

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      
      {/* Authentication routes */}
      <Route path="/login">
        {() => <Login />}
      </Route>
      
      <Route path="/signup">
        {() => <Signup />}
      </Route>
      
      <Route path="/onboarding">
        {() => <OnboardingForm onComplete={handleOnboardingComplete} />}
      </Route>
      
      <Route path="/business-data">
        {() => (
          <BusinessDataWizard 
            userData={userData} 
            onComplete={handleBusinessDataComplete}
          />
        )}
      </Route>
      
      <Route path="/valuation">
        {() => <ValuationDashboard companyId={companyId} />}
      </Route>
      
      <Route path="/valuation-report">
        {() => <ValuationReport companyId={companyId} />}
      </Route>
      
      <Route path="/data-room">
        {() => <DataRoom companyId={companyId} />}
      </Route>
      
      <Route path="/improvement-suggestions">
        {() => <ValuationImprovementSuggestions companyId={companyId} />}
      </Route>
      
      <Route path="/buyer-matches">
        {() => <BuyerMatchRecommendations companyId={companyId} />}
      </Route>
      
      <Route path="/ux-showcase">
        {() => <UXShowcase />}
      </Route>
      
      <Route path="/live-benchmarks">
        {() => <LiveBenchmarks />}
      </Route>
      
      <Route path="/our-approach">
        {() => <OurApproach />}
      </Route>
      
      <Route path="/who-we-serve">
        {() => <WhoWeServe />}
      </Route>
      
      <Route path="/industry-insights">
        {() => <IndustryInsights />}
      </Route>
      
      <Route path="/valuation-services">
        {() => <ValuationServices />}
      </Route>
      
      <Route path="/european-markets">
        {() => <EuropeanMarkets />}
      </Route>
      
      <Route path="/success-stories">
        {() => <SuccessStories />}
      </Route>
      
      <Route path="/about-us">
        {() => <AboutUs />}
      </Route>
      
      <Route path="/our-team">
        {() => <OurTeam />}
      </Route>
      
      <Route path="/ai-test">
        {() => <AIFeatureTest />}
      </Route>
      
      <Route path="/emilia-showcase">
        {() => <EmiliaShowcase />}
      </Route>
      
      <Route path="/faq">
        {() => <FAQ />}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check for user data in localStorage to set logged in state
  useEffect(() => {
    // Clear any existing data - for testing purposes
    localStorage.removeItem('userData');
    localStorage.removeItem('companyId');
    localStorage.removeItem('businessData');
    
    const userData = localStorage.getItem('userData');
    const companyId = localStorage.getItem('companyId');
    setIsLoggedIn(!!(userData && companyId));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        {/* Navigation included for all routes */}
        <div className="navigation-wrapper">
          <Navigation isLoggedIn={isLoggedIn} />
        </div>
        
        {/* Main content */}
        <div className="flex-grow">
          <Router />
        </div>
        
        {/* Footer included for all routes */}
        <Footer />
      </div>
      <FloatingChatButton />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

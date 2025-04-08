import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, CheckCircle, UserPlus } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

type ValuationImprovementSuggestionsProps = {
  companyId: number | null;
};

export default function ValuationImprovementSuggestions({ companyId: propCompanyId }: ValuationImprovementSuggestionsProps) {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Try to get companyId from props or localStorage
  const [companyId, setCompanyId] = useState<number | null>(() => {
    if (propCompanyId) return propCompanyId;
    const saved = localStorage.getItem('companyId');
    return saved ? JSON.parse(saved) : null;
  });

  // Update localStorage if prop changes
  useEffect(() => {
    if (propCompanyId) {
      setCompanyId(propCompanyId);
      localStorage.setItem('companyId', JSON.stringify(propCompanyId));
    }
  }, [propCompanyId]);
  
  // Fetch recommendations
  const { data: recommendations, isLoading } = useQuery({
    queryKey: [`/api/companies/${companyId}/recommendations`],
    enabled: !!companyId,
  });
  
  // Show toast on error
  useEffect(() => {
    if (!companyId) {
      setLocation("/onboarding");
    }
  }, [companyId, setLocation]);
  
  if (!companyId) {
    return null;
  }
  
  const handleBackToValuation = () => {
    setLocation("/valuation");
  };
  
  const handleConnectExpert = () => {
    setLocation("/buyer-matches");
  };
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Digital Transformation": "blue",
      "AI Operations": "purple",
      "Financial Health": "green",
      "Branding & Visibility": "yellow",
      "Automation": "indigo",
      "Customer Diversification": "red"
    };
    
    return colors[category] || "gray";
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Increase Your Business Value
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              AI-powered recommendations tailored to your business
            </p>
          </div>
          <div className="mt-4 flex md:mt-0">
            <Button 
              variant="outline" 
              onClick={handleBackToValuation}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Valuation
            </Button>
          </div>
        </div>

        <Card className="shadow mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2">Value Growth Opportunities</h2>
            <p className="text-sm text-gray-600 mb-6">Based on your data, our AI has identified these key opportunities to increase your business value.</p>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="h-80 animate-pulse">
                    <CardHeader className="bg-gray-200 h-12"></CardHeader>
                    <CardContent className="p-4">
                      <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
                      <div className="space-y-2">
                        <div className="bg-gray-200 h-3 w-full rounded"></div>
                        <div className="bg-gray-200 h-3 w-full rounded"></div>
                        <div className="bg-gray-200 h-3 w-3/4 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec: any) => (
                  <Card key={rec.id} className="border border-gray-200 overflow-hidden">
                    <CardHeader className={`px-4 py-3 bg-${getCategoryColor(rec.category)}-50`}>
                      <CardTitle className={`text-md font-medium text-${getCategoryColor(rec.category)}-800`}>
                        {rec.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Impact Potential</span>
                        {renderStars(rec.impactPotential)}
                      </div>
                      <div className="space-y-3 mt-4">
                        {rec.suggestions.map((suggestion: string, idx: number) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                            <div className="ml-3 text-sm text-gray-700">
                              {suggestion}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        <span className="font-medium">Estimated Value Impact:</span> +{rec.estimatedValueImpactMin}-{rec.estimatedValueImpactMax}%
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">No recommendations available at this time.</p>
              </div>
            )}
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600 mb-4 sm:mb-0">Need help implementing these improvements?</p>
                <Button
                  onClick={handleConnectExpert}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Connect with a Digital Transformation Expert
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

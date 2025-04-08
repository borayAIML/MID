import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building, ChartLine, Handshake } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

type BuyerMatchRecommendationsProps = {
  companyId: number | null;
};

export default function BuyerMatchRecommendations({ companyId: propCompanyId }: BuyerMatchRecommendationsProps) {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [matchPreference, setMatchPreference] = useState("all");
  
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
  
  // Fetch buyer matches
  const { data: buyerMatches, isLoading } = useQuery({
    queryKey: [`/api/companies/${companyId}/buyer-matches`],
    enabled: !!companyId,
  });
  
  // Redirect if no companyId
  useEffect(() => {
    if (!companyId) {
      setLocation("/onboarding");
    }
  }, [companyId, setLocation]);
  
  if (!companyId) {
    return null;
  }
  
  const handleBackToRecommendations = () => {
    setLocation("/improvement-suggestions");
  };
  
  const handleRequestIntroduction = (matchId: number, matchName: string) => {
    toast({
      title: "Introduction Requested",
      description: `Your request to connect with ${matchName} has been sent.`,
    });
  };
  
  const handleFindMoreMatches = () => {
    toast({
      title: "Finding Matches",
      description: `Searching for ${matchPreference === 'all' ? 'all types of' : matchPreference} matches.`,
    });
  };
  
  const getMatchIcon = (type: string) => {
    switch (type) {
      case "Private Equity Firm":
        return <Building className="text-indigo-500 text-3xl" />;
      case "Strategic Buyer":
        return <ChartLine className="text-blue-500 text-3xl" />;
      case "Angel Investor Network":
        return <Handshake className="text-green-500 text-3xl" />;
      default:
        return <Building className="text-gray-500 text-3xl" />;
    }
  };
  
  const getDealTypeBadgeColor = (dealType: string) => {
    switch (dealType) {
      case "Strategic Investor":
        return "bg-blue-100 text-blue-800";
      case "Full Acquisition":
        return "bg-purple-100 text-purple-800";
      case "Angel Investment":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Potential Buyer/Investor Matches
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              We found potential matches in our network that align with your business profile
            </p>
          </div>
          <div className="mt-4 flex md:mt-0">
            <Button
              variant="outline"
              onClick={handleBackToRecommendations}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recommendations
            </Button>
          </div>
        </div>

        <Card className="shadow overflow-hidden mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-2">Buyer/Investor Matches</h2>
            <p className="text-sm text-gray-600 mb-6">Based on your business profile, industry, financial data, and goals, our AI has identified these potential matches.</p>
            
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse border border-gray-200 overflow-hidden shadow-sm">
                    <div className="md:flex">
                      <div className="md:flex-shrink-0 bg-gray-100 md:w-48 p-4 flex items-center justify-center">
                        <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="h-6 bg-gray-200 rounded w-24"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : buyerMatches && buyerMatches.length > 0 ? (
              <div className="space-y-6">
                {buyerMatches.map((match: any) => (
                  <Card key={match.id} className="border border-gray-200 overflow-hidden shadow-sm">
                    <div className="md:flex">
                      <div className={`md:flex-shrink-0 bg-${match.type === "Private Equity Firm" ? "indigo" : match.type === "Strategic Buyer" ? "blue" : "green"}-50 md:w-48 flex items-center justify-center p-4`}>
                        <div className="text-center">
                          <div className={`w-20 h-20 mx-auto rounded-full bg-${match.type === "Private Equity Firm" ? "indigo" : match.type === "Strategic Buyer" ? "blue" : "green"}-100 flex items-center justify-center`}>
                            {getMatchIcon(match.type)}
                          </div>
                          <div className="mt-2 text-center">
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {match.matchPercentage}% Match
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{match.name}</h3>
                            <p className="mt-1 text-sm text-gray-600">{match.type}</p>
                          </div>
                          <Badge className={getDealTypeBadgeColor(match.dealType)}>
                            {match.dealType}
                          </Badge>
                        </div>
                        <div className="mt-4 text-sm text-gray-700">
                          <p>{match.description}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {match.tags.map((tag: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="bg-gray-100 text-gray-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button 
                            variant="outline"
                            className="text-indigo-700 bg-indigo-100 hover:bg-indigo-200 border-0"
                            onClick={() => handleRequestIntroduction(match.id, match.name)}
                          >
                            Request Introduction
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">No buyer matches available at this time.</p>
              </div>
            )}
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <form className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col mb-4 sm:mb-0">
                  <label htmlFor="match-preferences" className="text-sm font-medium text-gray-700 mb-1">Refine your match preferences</label>
                  <Select
                    value={matchPreference}
                    onValueChange={setMatchPreference}
                  >
                    <SelectTrigger id="match-preferences" className="w-full sm:w-64">
                      <SelectValue placeholder="All Options" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-acquisition">Full Acquisition</SelectItem>
                      <SelectItem value="partial-investment">Partial Investment</SelectItem>
                      <SelectItem value="strategic-partnership">Strategic Partnership</SelectItem>
                      <SelectItem value="all">All Options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleFindMoreMatches}
                >
                  Find More Matches
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

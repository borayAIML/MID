import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AIThinkingLoader } from '@/components/ui/animated-loader';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';


export default function AiCompanyAnalysis() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [result, setResult] = useState<{
    companyId: number;
    companyName: string;
    timestamp: string;
    analysis: string;
  } | null>(null);

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const res = await apiRequest('/api/user');
        setCompanyId(res.companyId); 
        console.log("Company ID from user data:", res.companyId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchCompanyId();
  }, []);


  const userId = user?.id;
  // Get companies associated with the authenticated user
  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: [`/api/users/${userId}/companies`],
    queryFn: async () => {
      const res = await apiRequest(`/api/users/${userId}/companies`);
      return await res.json();
    },
    enabled: !!user,
  });

  console.log("Companies:",companies);
  // Get first company ID from user data
  //const companyId = companies && companies.length > 0 ? companies[0].id : null;
  console.log("Company ID from company analysis:",companyId);

  // const companyIdRaw = localStorage.getItem('companyId');
  // const companyId = companyIdRaw ? parseInt(companyIdRaw) : null;

  const analyzeCompany = async () => {
    if (!companyId) {
      setError("No company found for your account. Please create a company first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/api/ai/analyze-company', {
        method: 'POST',
        body: JSON.stringify({ 
          companyId: companyId 
        })
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">AI-Powered Company Analysis</CardTitle>
          <CardDescription>
            Analyze company data using artificial intelligence to get detailed valuation insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {isLoadingCompanies ? (
              <div className="text-sm text-gray-500">Loading your company data...</div>
            ) : !companyId ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>No Company Found</AlertTitle>
                <AlertDescription>
                  You need to create a company first. Please go to the Business Data Wizard to set up your company.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium">Ready to analyze:</h3>
                <p className="text-gray-700">
                {companies && companies.length > 0 
                    ? `${companies[0].name} (ID: ${companies[0].id})` 
                    : 'Company'}
                </p>
              </div>
            )}
            
            <Button 
              onClick={analyzeCompany} 
              disabled={loading || !companyId || isLoadingCompanies}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full"
            >
              Analyze My Company
            </Button>
          </div>

          {loading && (
            <div className="py-8 flex flex-col items-center">
              <AIThinkingLoader text="Analyzing company data with AI..." />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="my-4">
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && !loading && (
            <div className="mt-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Analysis for {result.companyName}</h3>
                  <div className="text-sm text-muted-foreground">
                    Analyzed on {new Date(result.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigator.clipboard.writeText(result.analysis)}
                    className="text-xs"
                  >
                    Copy Analysis
                  </Button>
                </div>
              </div>
              
              <div className="bg-card border shadow-sm rounded-lg p-6">
                <MarkdownRenderer 
                  content={result.analysis + "You can reach out to Emilia (Our AI assistant) at any time."} 
                  mode="enhanced"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Using real-time database data and AI analysis
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
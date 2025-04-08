import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AIThinkingLoader } from '@/components/ui/animated-loader';
import { apiRequest } from '@/lib/queryClient';

export default function AiCompanyAnalysis() {
  const [companyId, setCompanyId] = useState<string>('1'); // Default to company ID 1
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    companyId: number;
    companyName: string;
    timestamp: string;
    analysis: string;
  } | null>(null);

  const analyzeCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/api/ai/analyze-company', {
        method: 'POST',
        body: JSON.stringify({ 
          companyId: parseInt(companyId) 
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
          <div className="flex space-x-2 mb-4">
            <Input
              type="number"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              placeholder="Enter Company ID"
              className="w-40"
              min="1"
            />
            <Button 
              onClick={analyzeCompany} 
              disabled={loading || !companyId}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Analyze Company
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
              <h3 className="text-xl font-semibold mb-2">Analysis for {result.companyName}</h3>
              <div className="text-sm text-muted-foreground mb-4">
                Analyzed on {new Date(result.timestamp).toLocaleString()}
              </div>
              <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                {result.analysis}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Using real-time database data and OpenAI analysis
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
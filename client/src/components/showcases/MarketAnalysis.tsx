import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AIThinkingLoader } from '@/components/ui/animated-loader';
import { apiRequest } from '@/lib/queryClient';
import { gicsSectors, getIndustryGroupsBySectorId } from '@shared/gicsSectors';

export default function MarketAnalysis() {
  const [formData, setFormData] = useState({
    sector: '',
    industryGroup: '',
    companyName: '',
    location: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    sector: string;
    industryGroup: string | null;
    location: string | null;
    companyName: string | null;
    timestamp: string;
    analysis: string;
    citations: string[];
    provider: string;
  } | null>(null);
  const [industryGroups, setIndustryGroups] = useState<{ id: string; name: string }[]>([]);
  
  // Handle sector selection change
  const handleSectorChange = (value: string) => {
    // Find the sector object by ID
    const sector = gicsSectors.find(s => s.id === value);
    const sectorName = sector ? sector.name : value;
    
    // Get industry groups for this sector
    const groups = getIndustryGroupsBySectorId(value);
    setIndustryGroups(groups);
    
    // Update form data with sector and reset industry group
    setFormData({
      ...formData,
      sector: sectorName,
      industryGroup: ''
    });
  };
  
  // Handle industry group selection change
  const handleIndustryGroupChange = (value: string) => {
    // Find the industry group object by ID
    const group = industryGroups.find(g => g.id === value);
    const groupName = group ? group.name : value;
    
    // Update form data with industry group
    setFormData({
      ...formData,
      industryGroup: groupName
    });
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const performMarketAnalysis = async () => {
    if (!formData.sector) {
      setError("Sector is required for market analysis");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiRequest('/api/ai/market-analysis', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during market analysis');
      console.error('Market analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">AI-Powered Market Analysis</CardTitle>
          <CardDescription>
            Get detailed market insights, industry trends, and competitive landscape analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Sector</label>
              <Select onValueChange={handleSectorChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select business sector" />
                </SelectTrigger>
                <SelectContent>
                  {gicsSectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Industry Group</label>
              <Select 
                onValueChange={handleIndustryGroupChange}
                disabled={industryGroups.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    industryGroups.length === 0 
                      ? "Select a sector first" 
                      : "Select industry group"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {industryGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Company Name (Optional)</label>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Location (Optional)</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location (country/region)"
              />
            </div>
            
            <Button 
              onClick={performMarketAnalysis} 
              disabled={loading || !formData.sector}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mt-4"
            >
              {loading ? "Analyzing..." : "Generate Market Analysis"}
            </Button>
          </div>

          {loading && (
            <div className="py-8 flex flex-col items-center">
              <AIThinkingLoader text="Analyzing market data with AI..." />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="my-4">
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && !loading && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Market Analysis: {result.sector}</h3>
              {result.industryGroup && (
                <h4 className="text-lg text-muted-foreground mb-1">Industry: {result.industryGroup}</h4>
              )}
              <div className="text-sm text-muted-foreground mb-4">
                Generated on {new Date(result.timestamp).toLocaleString()} via {result.provider}
              </div>
              <div className="bg-muted p-6 rounded-lg whitespace-pre-line">
                {result.analysis}
              </div>
              
              {result.citations && result.citations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Sources & Citations</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {result.citations.map((citation, idx) => (
                      <li key={idx}>
                        <a 
                          href={citation} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {citation}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Powered by Perplexity AI with real-time market data
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
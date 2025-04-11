import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AIThinkingLoader } from '@/components/ui/animated-loader';
import { apiRequest } from '@/lib/queryClient';
import { gicsSectors, getIndustryGroupsBySectorId, getSectorById } from '@shared/gicsSectors';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper component to properly format the analysis with headings, tables, and lists
interface FormattedAnalysisProps {
  analysis: string;
}

function FormattedAnalysis({ analysis }: FormattedAnalysisProps) {
  // Helper to determine if a line is a heading (starts with ###)
  const checkHeading = (line: string): {isHeading: boolean, level: number} => {
    const match = line.match(/^(#{1,6})\s(.+)$/);
    if (match) {
      return { isHeading: true, level: match[1].length };
    }
    return { isHeading: false, level: 0 };
  };
  
  // Helper to parse a Markdown table
  const parseTable = (lines: string[], startIdx: number): { 
    table: JSX.Element, 
    endIdx: number 
  } => {
    const tableLines = [];
    let idx = startIdx;
    
    // Collect all table lines
    while (idx < lines.length && (lines[idx].trim().startsWith('|') || lines[idx].trim() === '')) {
      if (lines[idx].trim() !== '') {
        tableLines.push(lines[idx]);
      }
      idx++;
    }
    
    if (tableLines.length < 3) {
      return { 
        table: <p className="text-red-500">Invalid table format</p>, 
        endIdx: startIdx + tableLines.length 
      };
    }
    
    // Extract headers
    const headerRow = tableLines[0];
    const headers = headerRow
      .split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0);
    
    // Skip separator row (second row)
    
    // Extract data rows
    const dataRows = tableLines.slice(2).map(row => 
      row.split('|')
         .map(cell => cell.trim())
         .filter(cell => cell.length > 0)
    );
    
    // Create the table component
    const table = (
      <Table className="my-4 border">
        <TableHeader className="bg-muted/50">
          <TableRow>
            {headers.map((header, i) => (
              <TableHead key={i} className="font-medium">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
    
    return { table, endIdx: idx - 1 };
  };
  
  // Helper to parse a bullet point list
  const parseList = (lines: string[], startIdx: number): { 
    list: JSX.Element, 
    endIdx: number 
  } => {
    const listItems = [];
    let idx = startIdx;
    
    // Collect all list items
    while (idx < lines.length && (lines[idx].trim().match(/^[-*•]\s/) || lines[idx].trim() === '')) {
      if (lines[idx].trim() !== '') {
        // Remove the bullet point marker and trim
        listItems.push(lines[idx].replace(/^[-*•]\s/, '').trim());
      }
      idx++;
    }
    
    const list = (
      <ul className="list-disc pl-5 space-y-1 my-2">
        {listItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
    
    return { list, endIdx: idx - 1 };
  };
  
  // Helper to parse a number list
  const parseNumberList = (lines: string[], startIdx: number): { 
    list: JSX.Element, 
    endIdx: number 
  } => {
    const listItems = [];
    let idx = startIdx;
    
    // Collect all list items
    while (idx < lines.length && (lines[idx].trim().match(/^\d+\.\s/) || lines[idx].trim() === '')) {
      if (lines[idx].trim() !== '') {
        // Remove the number marker and trim
        listItems.push(lines[idx].replace(/^\d+\.\s/, '').trim());
      }
      idx++;
    }
    
    const list = (
      <ol className="list-decimal pl-5 space-y-1 my-2">
        {listItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    );
    
    return { list, endIdx: idx - 1 };
  };
  
  // Parse the full analysis
  const parseAnalysis = () => {
    const lines = analysis.split('\n');
    const elements: JSX.Element[] = [];
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (line === '') {
        i++;
        continue;
      }
      
      // Check if line is a heading
      const { isHeading, level } = checkHeading(line);
      if (isHeading) {
        const headingText = line.replace(/^#+\s/, '');
        
        // Choose heading element based on level
        switch (level) {
          case 1:
            elements.push(<h1 key={i} className="text-2xl font-bold mt-6 mb-4">{headingText}</h1>);
            break;
          case 2:
            elements.push(<h2 key={i} className="text-xl font-bold mt-5 mb-3">{headingText}</h2>);
            break;
          case 3:
            elements.push(<h3 key={i} className="text-lg font-bold mt-4 mb-2">{headingText}</h3>);
            break;
          case 4:
            elements.push(<h4 key={i} className="text-base font-bold mt-3 mb-2">{headingText}</h4>);
            break;
          default:
            elements.push(<h5 key={i} className="text-sm font-bold mt-2 mb-1">{headingText}</h5>);
        }
        i++;
        continue;
      }
      
      // Check if line is the start of a table
      if (line.startsWith('|') && i + 2 < lines.length && lines[i + 1].includes('|-')) {
        const { table, endIdx } = parseTable(lines, i);
        elements.push(<div key={i} className="overflow-x-auto my-4">{table}</div>);
        i = endIdx + 1;
        continue;
      }
      
      // Check if line is the start of a bullet list
      if (line.match(/^[-*•]\s/)) {
        const { list, endIdx } = parseList(lines, i);
        elements.push(<div key={i}>{list}</div>);
        i = endIdx + 1;
        continue;
      }
      
      // Check if line is the start of a numbered list
      if (line.match(/^\d+\.\s/)) {
        const { list, endIdx } = parseNumberList(lines, i);
        elements.push(<div key={i}>{list}</div>);
        i = endIdx + 1;
        continue;
      }
      
      // Regular paragraph
      // Check if there are multiple consecutive text lines to group
      let paragraph = line;
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== '' && 
             !checkHeading(lines[j]).isHeading && 
             !lines[j].trim().startsWith('|') && 
             !lines[j].trim().match(/^[-*•]\s/) &&
             !lines[j].trim().match(/^\d+\.\s/)) {
        paragraph += ' ' + lines[j].trim();
        j++;
      }
      
      // Add paragraph as element
      elements.push(<p key={i} className="my-2">{paragraph}</p>);
      i = j;
    }
    
    return elements;
  };
  
  return <>{parseAnalysis()}</>;
}

export default function MarketAnalysis() {
  const { user } = useAuth();
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
  
  // Get companies associated with the authenticated user
  const { data: companies, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['/api/companies'],
    queryFn: async () => {
      const res = await apiRequest('/api/companies');
      return await res.json();
    },
    enabled: !!user,
  });
  
  // Pre-populate form with company data when available
  useEffect(() => {
    if (companies && companies.length > 0) {
      const company = companies[0];
      
      // Set company name
      const companyName = company.name || '';
      
      // Set location if available from company data
      const location = company.location || company.country || '';
      
      // Set sector if available from company data
      let sectorName = '';
      let industryGroupName = '';
      
      if (company.sectorId) {
        const sector = getSectorById(company.sectorId);
        if (sector) {
          sectorName = sector.name;
          
          // If company has industry group, set that too
          if (company.industryGroupId) {
            const groups = getIndustryGroupsBySectorId(company.sectorId);
            setIndustryGroups(groups);
            
            const group = groups.find(g => g.id === company.industryGroupId);
            if (group) {
              industryGroupName = group.name;
            }
          }
        }
      }
      
      // Update form data with company information
      setFormData({
        sector: sectorName,
        industryGroup: industryGroupName,
        companyName: companyName,
        location: location
      });
    }
  }, [companies]);
  
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
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-semibold">Market Analysis: {result.sector}</h3>
                  {result.industryGroup && (
                    <h4 className="text-lg text-muted-foreground">Industry: {result.industryGroup}</h4>
                  )}
                  {result.companyName && (
                    <Badge variant="outline" className="mt-1">Company: {result.companyName}</Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Generated on {new Date(result.timestamp).toLocaleString()}
                  </div>
                  <Badge className="mt-1 bg-blue-100 text-blue-800 hover:bg-blue-200">{result.provider}</Badge>
                </div>
              </div>
              
              <Tabs defaultValue="formatted" className="mt-4">
                <TabsList className="mb-2">
                  <TabsTrigger value="formatted">Formatted Report</TabsTrigger>
                  <TabsTrigger value="raw">Raw Text</TabsTrigger>
                </TabsList>
                
                <TabsContent value="formatted" className="mt-0">
                  <div className="bg-card border rounded-lg p-6 prose prose-sm max-w-none">
                    <FormattedAnalysis analysis={result.analysis} />
                  </div>
                </TabsContent>
                
                <TabsContent value="raw" className="mt-0">
                  <div className="bg-muted p-6 rounded-lg whitespace-pre-line text-sm font-mono">
                    {result.analysis}
                  </div>
                </TabsContent>
              </Tabs>
              
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
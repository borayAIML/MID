import React from 'react';
import AiCompanyAnalysis from '@/components/showcases/AiCompanyAnalysis';
import MarketAnalysis from '@/components/showcases/MarketAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AIFeatureTest() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Feature Testing</h1>
      
      <Tabs defaultValue="company-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="company-analysis">Company Analysis</TabsTrigger>
          <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="company-analysis">
          <AiCompanyAnalysis />
        </TabsContent>
        <TabsContent value="market-analysis">
          <MarketAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
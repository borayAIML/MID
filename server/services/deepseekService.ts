/**
 * DeepSeekAI Service for the MANDA Institute platform
 * This service handles all interactions with the DeepSeekAI API
 */

export type DeepSeekMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
  };
  
  export type DeepSeekResponse = {
    id: string;
    model: string;
    choices: {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }[];
    created: number;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  
  export type DeepSeekModelName = 
    | 'deepseek-chat'
    | 'deepseek-coder'
    | 'deepseek-llm-67b-chat'
    | 'deepseek-1.3b-chat';
  
  /**
   * Send a request to the DeepSeekAI API for chat completions
   * @param messages Array of messages for the conversation
   * @param modelName DeepSeekAI model to use
   * @param temperature Temperature parameter for generation
   * @param maxTokens Maximum tokens to generate
   * @returns The DeepSeekAI API response
   */
  export async function chatCompletion(
    messages: DeepSeekMessage[],
    modelName: DeepSeekModelName = 'deepseek-chat',
    temperature: number = 0.3,
    maxTokens: number = 2000
  ): Promise<DeepSeekResponse> {
    try {
      console.log(`Sending request to DeepSeekAI API with model: ${modelName}`);
      
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: modelName,
          messages,
          temperature,
          max_tokens: maxTokens,
        })
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error('DeepSeekAI API Error:', errorData);
        throw new Error(`DeepSeekAI API error: ${response.status} ${errorData}`);
      }
  
      const data = await response.json();
      console.log('DeepSeekAI API response received successfully');
      return data;
    } catch (error) {
      console.error('Error calling DeepSeekAI API:', error);
      throw error;
    }
  }
  
  /**
   * Create a business analysis using the DeepSeekAI API
   * @param companyProfile Company profile data
   * @returns AI analysis of the company
   */
  export async function analyzeCompany(companyProfile: any): Promise<string> {
    try {
      const messages: DeepSeekMessage[] = [
        {
          role: 'system',
          content: 'You are a business valuation expert specializing in European small to medium businesses. Provide insightful analysis of business data to help owners understand their company\'s value and potential.'
        },
        {
          role: 'user',
          content: `Analyze this company data and provide a detailed valuation assessment with key strengths, risks, and 3 specific recommendations to increase value: ${JSON.stringify(companyProfile)}`
        }
      ];
  
      const response = await chatCompletion(messages);
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing company with DeepSeekAI:', error);
      throw error;
    }
  }
  
  /**
   * Generate market analysis for a specific sector and industry
   * @param prompt The analysis prompt
   * @returns Market analysis results
   */
  export async function generateMarketAnalysis(prompt: string): Promise<DeepSeekResponse> {
    try {
      const messages: DeepSeekMessage[] = [
        {
          role: 'system',
          content: 'You are a financial market analyst specializing in European business sectors. Provide detailed, fact-based analysis with specific data points and insights that would be valuable for business valuation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];
  
      return await chatCompletion(messages, 'deepseek-chat', 0.2, 2000);
    } catch (error) {
      console.error('Error generating market analysis with DeepSeekAI:', error);
      throw error;
    }
  }
  
  /**
   * Process a chat conversation with the AI assistant
   * @param messages Chat message history
   * @returns AI assistant response
   */
  export async function processChat(messages: DeepSeekMessage[]): Promise<string> {
    try {
      // Ensure the first message is a system message that sets the context
      if (messages.length === 0 || messages[0].role !== 'system') {
        messages.unshift({
          role: 'system',
          content: 'You are Emilia, an expert business valuation assistant for the MANDA Institute, specializing in European SMBs with EBITDA under €10 million. Provide helpful, concise advice about business valuation, mergers and acquisitions, and exit strategies.'
        });
      }
  
      const response = await chatCompletion(messages, 'deepseek-chat', 0.3, 1000);
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error in chat processing with DeepSeekAI:', error);
      throw error;
    }
  }
  
  /**
   * Analyze a document using DeepSeekAI
   * @param documentType Type of document being analyzed
   * @param documentContent Document content or relevant data
   * @returns AI analysis of the document
   */
  export async function analyzeDocument(documentType: string, documentContent: any): Promise<string> {
    try {
      // Create prompt based on the document type
      let systemPrompt = '';
      let userPrompt = '';
  
      switch (documentType) {
        case 'financial':
          systemPrompt = 'You are an expert financial analyst specializing in business valuation for European SMBs. Analyze financial documents to identify strengths, weaknesses, issues, and valuation impacts.';
          userPrompt = `Analyze this financial document data and provide a detailed assessment including validation issues, key metrics analysis, and valuation impact: ${JSON.stringify(documentContent)}`;
          break;
        case 'tax':
          systemPrompt = 'You are an expert tax consultant specializing in European SMB tax compliance and optimization. Analyze tax documents to identify compliance issues, risks, and valuation impacts.';
          userPrompt = `Analyze this tax document data and provide a detailed assessment including compliance issues, key metrics analysis, and valuation impact: ${JSON.stringify(documentContent)}`;
          break;
        case 'contract':
          systemPrompt = 'You are an expert legal consultant specializing in business contracts and M&A due diligence. Analyze contracts to identify risks, obligations, and valuation impacts.';
          userPrompt = `Analyze this contract data and provide a detailed assessment including risk exposure, favorability analysis, and valuation impact: ${JSON.stringify(documentContent)}`;
          break;
        default:
          systemPrompt = 'You are an expert business consultant specializing in document analysis for M&A due diligence. Analyze documents to identify issues, risks, and valuation impacts.';
          userPrompt = `Analyze this document data and provide a detailed assessment including validation issues and valuation impact: ${JSON.stringify(documentContent)}`;
      }
  
      const messages: DeepSeekMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];
  
      const response = await chatCompletion(messages, 'deepseek-chat', 0.2, 2000);
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing document with DeepSeekAI:', error);
      throw error;
    }
  }
  
  /**
   * Perform comprehensive document analysis using DeepSeekAI
   * @param documentsData Collection of company documents
   * @returns Comprehensive analysis of all documents
   */
  export async function analyzeComprehensiveDocuments(documentsData: any[]): Promise<string> {
    try {
      const systemPrompt = 'You are an expert business valuation consultant specializing in M&A due diligence. Provide comprehensive analysis of all company documents, identify inconsistencies across documents, assess overall validation quality, and determine valuation impact.';
      const userPrompt = `Perform a comprehensive analysis of these company documents and provide an assessment including overall validation score, cross-document consistency, identified issues, and valuation impact: ${JSON.stringify(documentsData)}`;
  
      const messages: DeepSeekMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];
  
      const response = await chatCompletion(messages, 'deepseek-chat', 0.3, 3000);
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error performing comprehensive document analysis with DeepSeekAI:', error);
      throw error;
    }
  }
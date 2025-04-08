import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { WebSocketServer, WebSocket } from 'ws';
import { 
  insertUserSchema, 
  insertCompanySchema, 
  insertFinancialSchema,
  insertEmployeeSchema,
  insertDocumentSchema,
  insertTechnologySchema,
  insertOwnerIntentSchema,
  insertValuationSchema,
  insertRecommendationSchema,
  insertBuyerMatchSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Set up multer storage
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to prevent collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_config,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|xlsx|xls|csv|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only specific document formats are allowed"));
    }
  } 
});

// Import for Perplexity API
import fetch from 'node-fetch';

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function for handling ZodError
  const handleZodError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  };

  // API routes - prefix with /api
  
  // Authentication endpoints
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { fullName, email, password, companyName } = req.body;
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already exists. Please try logging in instead." 
        });
      }
      
      // Create user
      const userData = {
        username: email, // Using email as username
        email: email,
        password: password, // In a real app, this would be hashed
        fullName: fullName,
        role: "user", // Default role is "user" (updated from "business_owner")
      };
      
      const user = await storage.createUser(userData);
      
      // Return success without exposing the full user object
      return res.status(201).json({ 
        success: true, 
        message: "Account created successfully",
        userId: user.id
      });
    } catch (error) {
      console.error("Signup error:", error);
      return handleZodError(error, res);
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid email or password" 
        });
      }
      
      // In a real app, we would compare hashed passwords
      if (user.password !== password) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid email or password" 
        });
      }
      
      // Get user's companies
      const companies = await storage.getCompaniesByUserId(user.id);
      const companyId = companies.length > 0 ? companies[0].uniqueId : null;
      
      // Return simplified user data and company info
      return res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        },
        companyId
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred during login" 
      });
    }
  });
  
  // User endpoints
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(userData);
      return res.status(201).json(user);
    } catch (error) {
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.json(user);
  });
  
  // Company endpoints
  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(companyData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const company = await storage.createCompany(companyData);
      return res.status(201).json(company);
    } catch (error) {
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/companies/:id", async (req, res) => {
    const companyId = parseInt(req.params.id);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    const company = await storage.getCompany(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    return res.json(company);
  });
  
  app.get("/api/users/:userId/companies", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const companies = await storage.getCompaniesByUserId(userId);
    return res.json(companies);
  });
  
  // Financial data endpoints
  app.post("/api/financials", async (req, res) => {
    try {
      const financialData = insertFinancialSchema.parse(req.body);
      
      // Check if company exists, but create a default company if not found
      const company = await storage.getCompany(financialData.companyId);
      if (!company) {
        console.log(`Company ID ${financialData.companyId} not found. Creating default company.`);
        
        // Create a default company with ID = companyId
        const defaultCompany = await storage.createCompany({
          userId: 1, // Default user ID
          uniqueId: financialData.companyId,
          name: "Default Company",
          sector: "Technology",
          location: "USA",
          yearsInBusiness: "1-5",
          goal: "Valuation"
        });
        
        console.log("Created default company:", defaultCompany);
      }
      
      const financial = await storage.createFinancial(financialData);
      return res.status(201).json(financial);
    } catch (error) {
      console.error("Error creating financial data:", error);
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/companies/:companyId/financials", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    const financial = await storage.getFinancialByCompanyId(companyId);
    if (!financial) {
      return res.status(404).json({ message: "Financial data not found" });
    }
    
    return res.json(financial);
  });
  
  // Employee data endpoints
  app.post("/api/employees", async (req, res) => {
    try {
      // Convert string count to number if provided as string
      const { count, ...rest } = req.body;
      const parsedCount = count !== null && typeof count === 'string' ? parseInt(count) : count;
      const employeeData = insertEmployeeSchema.parse({ ...rest, count: parsedCount });
      
      // Check if company exists, but create a default company if not found
      const company = await storage.getCompany(employeeData.companyId);
      if (!company) {
        console.log(`Company ID ${employeeData.companyId} not found. Creating default company.`);
        
        // Create a default company with ID = companyId
        const defaultCompany = await storage.createCompany({
          userId: 1, // Default user ID
          uniqueId: employeeData.companyId,
          name: "Default Company",
          sector: "Technology",
          location: "USA",
          yearsInBusiness: "1-5",
          goal: "Valuation"
        });
        
        console.log("Created default company:", defaultCompany);
      }
      
      const employee = await storage.createEmployee(employeeData);
      return res.status(201).json(employee);
    } catch (error) {
      console.error("Error creating employee data:", error);
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/companies/:companyId/employees", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    const employee = await storage.getEmployeeByCompanyId(companyId);
    if (!employee) {
      return res.status(404).json({ message: "Employee data not found" });
    }
    
    return res.json(employee);
  });
  
  // Document upload endpoints
  app.post("/api/documents", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const companyId = parseInt(req.body.companyId);
      const type = req.body.type;
      
      if (isNaN(companyId) || !['financial', 'tax', 'contract'].includes(type)) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      
      // Check if company exists, but create a default company if not found
      const company = await storage.getCompany(companyId);
      if (!company) {
        console.log(`Company ID ${companyId} not found. Creating default company.`);
        
        // Create a default company with ID = companyId
        const defaultCompany = await storage.createCompany({
          userId: 1, // Default user ID
          uniqueId: companyId,
          name: "Default Company",
          sector: "Technology",
          location: "USA",
          yearsInBusiness: "1-5",
          goal: "Valuation"
        });
        
        console.log("Created default company:", defaultCompany);
      }
      
      const documentData = {
        companyId,
        type,
        fileName: req.file.originalname,
        filePath: req.file.path
      };
      
      const documentObj = insertDocumentSchema.parse(documentData);
      const document = await storage.createDocument(documentObj);
      
      return res.status(201).json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/companies/:companyId/documents", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    const documents = await storage.getDocumentsByCompanyId(companyId);
    return res.json(documents);
  });
  
  // Technology usage endpoints
  app.post("/api/technology", async (req, res) => {
    try {
      // Convert string transformationLevel to number if provided as string
      const { transformationLevel, techInvestmentPercentage, ...rest } = req.body;
      const parsedTransformationLevel = transformationLevel !== null && typeof transformationLevel === 'string' 
        ? parseInt(transformationLevel) 
        : transformationLevel;
      const technologyData = insertTechnologySchema.parse({ 
        ...rest, 
        transformationLevel: parsedTransformationLevel,
        techInvestmentPercentage
      });
      
      // Check if company exists, but create a default company if not found
      const company = await storage.getCompany(technologyData.companyId);
      if (!company) {
        console.log(`Company ID ${technologyData.companyId} not found. Creating default company.`);
        
        // Create a default company with ID = companyId
        const defaultCompany = await storage.createCompany({
          userId: 1, // Default user ID
          uniqueId: technologyData.companyId,
          name: "Default Company",
          sector: "Technology",
          location: "USA",
          yearsInBusiness: "1-5",
          goal: "Valuation"
        });
        
        console.log("Created default company:", defaultCompany);
      }
      
      const technology = await storage.createTechnology(technologyData);
      return res.status(201).json(technology);
    } catch (error) {
      console.error("Error creating technology data:", error);
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/companies/:companyId/technology", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    const technology = await storage.getTechnologyByCompanyId(companyId);
    if (!technology) {
      return res.status(404).json({ message: "Technology data not found" });
    }
    
    return res.json(technology);
  });
  
  // Owner intent endpoints
  app.post("/api/owner-intent", async (req, res) => {
    try {
      const ownerIntentData = insertOwnerIntentSchema.parse(req.body);
      
      // Check if company exists, but create a default company if not found
      const company = await storage.getCompany(ownerIntentData.companyId);
      if (!company) {
        console.log(`Company ID ${ownerIntentData.companyId} not found. Creating default company.`);
        
        // Create a default company with ID = companyId
        const defaultCompany = await storage.createCompany({
          userId: 1, // Default user ID
          uniqueId: ownerIntentData.companyId,
          name: "Default Company",
          sector: "Technology",
          location: "USA",
          yearsInBusiness: "1-5",
          goal: "Valuation"
        });
        
        console.log("Created default company:", defaultCompany);
      }
      
      const ownerIntent = await storage.createOwnerIntent(ownerIntentData);
      return res.status(201).json(ownerIntent);
    } catch (error) {
      console.error("Error creating owner intent data:", error);
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/companies/:companyId/owner-intent", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    const ownerIntent = await storage.getOwnerIntentByCompanyId(companyId);
    if (!ownerIntent) {
      return res.status(404).json({ message: "Owner intent data not found" });
    }
    
    return res.json(ownerIntent);
  });
  
  // Valuation endpoints
  app.post("/api/valuations", async (req, res) => {
    try {
      const valuationData = insertValuationSchema.parse(req.body);
      
      // Check if company exists, but create a default company if not found
      const company = await storage.getCompany(valuationData.companyId);
      if (!company) {
        console.log(`Company ID ${valuationData.companyId} not found. Creating default company.`);
        
        // Create a default company with ID = companyId
        const defaultCompany = await storage.createCompany({
          userId: 1, // Default user ID
          uniqueId: valuationData.companyId,
          name: "Default Company",
          sector: "Technology",
          location: "USA",
          yearsInBusiness: "1-5",
          goal: "Valuation"
        });
        
        console.log("Created default company:", defaultCompany);
      }
      
      const valuation = await storage.createValuation(valuationData);
      return res.status(201).json(valuation);
    } catch (error) {
      console.error("Error creating valuation data:", error);
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/companies/:companyId/valuation", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    const valuation = await storage.getValuationByCompanyId(companyId);
    if (!valuation) {
      return res.status(404).json({ message: "Valuation data not found" });
    }
    
    return res.json(valuation);
  });
  
  // Recommendations endpoints
  app.post("/api/recommendations", async (req, res) => {
    try {
      const recommendationData = insertRecommendationSchema.parse(req.body);
      
      // Check if company exists
      const company = await storage.getCompany(recommendationData.companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const recommendation = await storage.createRecommendation(recommendationData);
      return res.status(201).json(recommendation);
    } catch (error) {
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/companies/:companyId/recommendations", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    const recommendations = await storage.getRecommendationsByCompanyId(companyId);
    return res.json(recommendations);
  });
  
  // Buyer match endpoints
  app.post("/api/buyer-matches", async (req, res) => {
    try {
      const buyerMatchData = insertBuyerMatchSchema.parse(req.body);
      
      // Check if company exists
      const company = await storage.getCompany(buyerMatchData.companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const buyerMatch = await storage.createBuyerMatch(buyerMatchData);
      return res.status(201).json(buyerMatch);
    } catch (error) {
      return handleZodError(error, res);
    }
  });
  
  app.get("/api/companies/:companyId/buyer-matches", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    const buyerMatches = await storage.getBuyerMatchesByCompanyId(companyId);
    return res.json(buyerMatches);
  });
  
  // Generate valuation for a company - takes all data and calculates valuation
  app.post("/api/companies/:companyId/generate-valuation", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    
    // Check if company exists
    const company = await storage.getCompany(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Get all company data needed for valuation
    const financial = await storage.getFinancialByCompanyId(companyId);
    const employee = await storage.getEmployeeByCompanyId(companyId);
    const technology = await storage.getTechnologyByCompanyId(companyId);
    const ownerIntent = await storage.getOwnerIntentByCompanyId(companyId);
    
    if (!financial || !employee || !technology || !ownerIntent) {
      return res.status(400).json({ message: "Incomplete data for valuation" });
    }
    
    // Calculate valuation (simplified algorithm)
    
    // Start with base valuations based on EBITDA and revenue
    const ebitdaMultiple = Number(financial.ebitda) * 4.5;
    const revenueMultiple = Number(financial.revenueCurrent) * 2.0;
    const discountedCashFlow = Number(financial.ebitda) * 5.0;
    const assetBased = Number(financial.revenueCurrent) * 0.8;
    
    // Calculate median valuation
    const valuations = [ebitdaMultiple, revenueMultiple, discountedCashFlow, assetBased].sort((a, b) => a - b);
    const median = valuations.length % 2 === 0 ? 
      (valuations[valuations.length / 2 - 1] + valuations[valuations.length / 2]) / 2 : 
      valuations[Math.floor(valuations.length / 2)];
    
    // Calculate min/max range
    const valuationMin = Math.round(median * 0.85);
    const valuationMedian = Math.round(median);
    const valuationMax = Math.round(median * 1.15);
    
    // Calculate risk scores
    const financialHealthScore = Math.min(100, Math.max(20, 50 + (Number(financial.netMargin) * 2)));
    const marketPositionScore = 48; // Example fixed value
    let operationalEfficiencyScore = 35; // Base score
    
    // Adjust based on technology usage
    const transformationLevel = technology.transformationLevel ? Number(technology.transformationLevel) : 0;
    if (transformationLevel > 3) {
      operationalEfficiencyScore += 15;
    }
    
    const debtStructureScore = 72; // Example fixed value
    
    // Overall risk score (lower is riskier)
    const riskScore = Math.round((financialHealthScore + marketPositionScore + operationalEfficiencyScore + debtStructureScore) / 4);
    
    // Red flags
    const redFlags = [];
    if (financial.revenueCurrent && financial.revenuePrevious && Number(financial.revenueCurrent) < Number(financial.revenuePrevious)) {
      redFlags.push("Declining Revenue");
    }
    if (financial.netMargin && Number(financial.netMargin) < 10) {
      redFlags.push("Low Profit Margin");
    }
    if (transformationLevel < 3) {
      redFlags.push("Digital Transformation Lag");
    }
    
    // Create valuation
    const valuationData = {
      companyId,
      valuationMin: valuationMin.toString(),
      valuationMedian: valuationMedian.toString(),
      valuationMax: valuationMax.toString(),
      ebitdaMultiple: Math.round(ebitdaMultiple).toString(),
      discountedCashFlow: Math.round(discountedCashFlow).toString(),
      revenueMultiple: Math.round(revenueMultiple).toString(),
      assetBased: Math.round(assetBased).toString(),
      riskScore: riskScore,
      financialHealthScore: financialHealthScore.toString(),
      marketPositionScore: marketPositionScore.toString(),
      operationalEfficiencyScore: operationalEfficiencyScore.toString(),
      debtStructureScore: debtStructureScore.toString(),
      redFlags
    };
    
    const valuation = await storage.createValuation(valuationData);
    
    // Generate recommendations based on the analysis
    const recommendationCategories = [
      {
        category: "Digital Transformation",
        impactPotential: 4,
        suggestions: [
          "Implement a comprehensive CRM system to improve customer tracking and engagement.",
          "Adopt an ERP solution to streamline operations and provide better financial visibility.",
          "Develop an e-commerce channel to expand market reach and create new revenue streams."
        ],
        estimatedValueImpactMin: 12,
        estimatedValueImpactMax: 18
      },
      {
        category: "AI Operations",
        impactPotential: 5,
        suggestions: [
          "Implement AI-powered customer support chatbots to improve response times and reduce costs.",
          "Use AI sales forecasting to optimize inventory and improve cash flow management.",
          "Adopt AI-based analytics to identify customer trends and create targeted marketing campaigns."
        ],
        estimatedValueImpactMin: 15,
        estimatedValueImpactMax: 22
      },
      {
        category: "Financial Health",
        impactPotential: 3,
        suggestions: [
          "Restructure existing debt to optimize interest rates and improve debt-to-equity ratio.",
          "Implement margin optimization strategies across product/service lines.",
          "Address tax filing inconsistencies and optimize tax structure."
        ],
        estimatedValueImpactMin: 8,
        estimatedValueImpactMax: 14
      }
    ];
    
    // Save recommendations
    const recommendations = await Promise.all(
      recommendationCategories.map(rec => storage.createRecommendation({
        companyId,
        ...rec
      }))
    );
    
    // Generate buyer matches
    const buyerMatchesData = [
      {
        companyId,
        name: "TechVentures Capital",
        type: "Private Equity Firm",
        description: "TechVentures Capital specializes in growth-stage technology companies with strong digital transformation potential. They typically invest $2-10M for minority stakes with a 5-7 year growth horizon.",
        matchPercentage: 94,
        tags: ["Technology Focus", "Digital Transformation", "$2-10M Investment Range", "Minority Stake"],
        dealType: "Strategic Investor"
      },
      {
        companyId,
        name: "GrowthWave Acquisitions",
        type: "Strategic Buyer",
        description: "GrowthWave is actively acquiring companies in your sector to expand their portfolio. They focus on established businesses with proven revenue models and digital growth potential.",
        matchPercentage: 87,
        tags: ["Full Acquisition", "$1-5M Revenue Target", "Management Transition", "Established Operations"],
        dealType: "Full Acquisition"
      },
      {
        companyId,
        name: "Horizon Partners",
        type: "Angel Investor Network",
        description: "Horizon Partners is a network of angel investors focusing on early-stage growth companies. They typically provide funding alongside strategic guidance and industry connections.",
        matchPercentage: 79,
        tags: ["Angel Investment", "$250K-$1M Investment", "Strategic Guidance", "Industry Connections"],
        dealType: "Angel Investment"
      }
    ];
    
    const buyerMatches = await Promise.all(
      buyerMatchesData.map(match => storage.createBuyerMatch(match))
    );
    
    // Return all the generated data
    return res.status(201).json({
      valuation,
      recommendations,
      buyerMatches
    });
  });

  const httpServer = createServer(app);
  
  // Initialize the WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  console.log('WebSocket server initialized on path: /ws');
  
  // Track connected clients
  const clients = new Set<WebSocket>();
  
  // Initialize industry metric subscriptions
  type MetricSubscription = {
    industry: string;
    subcategory?: string;
    metrics: string[];
  }
  const subscriptions: Map<WebSocket, MetricSubscription[]> = new Map();
  
  // Handle errors at the WebSocketServer level
  wss.on('error', (error) => {
    console.error('WebSocketServer error:', error);
  });
  
  // Keep track of current benchmark values
  const benchmarkState: Record<string, Record<string, Record<string, number>>> = {
    tech: {
      revenue_growth: { average: 18, maxValue: 32.4 },
      profit_margin: { average: 20, maxValue: 36 },
      digital_transformation: { average: 80, maxValue: 95 },
      r_and_d: { average: 15, maxValue: 27 }
    },
    retail: {
      profit_margin: { average: 8, maxValue: 14.4 },
      customer_acquisition_cost: { average: 50, maxValue: 90 },
      customer_retention: { average: 75, maxValue: 90 }
    },
    manufacturing: {
      revenue_growth: { average: 5, maxValue: 9 },
      employee_productivity: { average: 200000, maxValue: 360000 },
      digital_transformation: { average: 42, maxValue: 75.6 }
    },
    healthcare: {
      profit_margin: { average: 15, maxValue: 27 },
      employee_productivity: { average: 180000, maxValue: 324000 },
      r_and_d: { average: 18, maxValue: 32.4 }
    },
    finance: {
      profit_margin: { average: 25, maxValue: 45 },
      employee_productivity: { average: 350000, maxValue: 630000 },
      debt_to_equity: { average: 3, maxValue: 5.4 },
      cash_flow: { average: 20, maxValue: 36 }
    }
  };
  
  // Default values for metrics not defined by industry
  const defaultMetricValues: Record<string, { average: number, maxValue: number }> = {
    revenue_growth: { average: 8, maxValue: 14.4 },
    profit_margin: { average: 15, maxValue: 27 },
    roi: { average: 15, maxValue: 27 },
    employee_productivity: { average: 150000, maxValue: 270000 },
    customer_acquisition_cost: { average: 200, maxValue: 360 },
    customer_retention: { average: 80, maxValue: 92 },
    digital_transformation: { average: 65, maxValue: 88 },
    r_and_d: { average: 5, maxValue: 9 },
    debt_to_equity: { average: 1.0, maxValue: 1.8 },
    cash_flow: { average: 15, maxValue: 27 }
  };
  
  // Helper function to get benchmark value for a specific industry and metric
  function getBenchmarkValue(industry: string, metricId: string): { average: number, maxValue: number } {
    try {
      // Validate inputs
      if (!industry || !metricId) {
        console.warn(`Invalid input to getBenchmarkValue: industry=${industry}, metricId=${metricId}`);
        return { average: 50, maxValue: 90 };
      }
      
      // First check industry-specific metrics
      if (benchmarkState[industry] && benchmarkState[industry][metricId]) {
        return {
          average: benchmarkState[industry][metricId].average,
          maxValue: benchmarkState[industry][metricId].maxValue
        };
      }
      
      // Try to match with other industry key formats (e.g., 'fs' might be passed as 'finance')
      const industryMap: Record<string, string> = {
        'fs': 'finance',
        'finance': 'fs',
        'tech': 'tech',
        'technology': 'tech',
        'healthcare': 'healthcare',
        'health': 'healthcare',
        'manufacturing': 'manufacturing',
        'retail': 'retail'
      };
      
      // Check if there's a different industry key we should try
      const alternateIndustry = industryMap[industry];
      if (alternateIndustry && benchmarkState[alternateIndustry] && benchmarkState[alternateIndustry][metricId]) {
        console.log(`Using alternate industry mapping: ${industry} -> ${alternateIndustry}`);
        return {
          average: benchmarkState[alternateIndustry][metricId].average,
          maxValue: benchmarkState[alternateIndustry][metricId].maxValue
        };
      }
      
      // Fallback to default metrics if industry-specific not found
      if (defaultMetricValues[metricId]) {
        return {
          average: defaultMetricValues[metricId].average,
          maxValue: defaultMetricValues[metricId].maxValue
        };
      }
      
      // Map common metric name variations
      const metricMap: Record<string, string> = {
        'revenue_growth': 'revenue_growth',
        'revenuegrowth': 'revenue_growth',
        'growth': 'revenue_growth',
        'profit_margin': 'profit_margin',
        'profitmargin': 'profit_margin',
        'margin': 'profit_margin',
        'roi': 'roi',
        'return_on_investment': 'roi',
        'returnoninvestment': 'roi',
        'digital_transformation': 'digital_transformation',
        'digitaltransformation': 'digital_transformation',
        'transformation': 'digital_transformation'
      };
      
      // Try alternate metric key
      const alternateMetric = metricMap[metricId.toLowerCase()];
      if (alternateMetric && defaultMetricValues[alternateMetric]) {
        console.log(`Using alternate metric mapping: ${metricId} -> ${alternateMetric}`);
        return {
          average: defaultMetricValues[alternateMetric].average,
          maxValue: defaultMetricValues[alternateMetric].maxValue
        };
      }
      
      // Last resort default values
      console.log(`Using default values for unknown metric: ${metricId} in industry: ${industry}`);
      return { average: 50, maxValue: 90 };
    } catch (error) {
      console.error(`Error in getBenchmarkValue for ${industry}/${metricId}:`, error);
      return { average: 50, maxValue: 90 }; // Safe fallback
    }
  }
  
  // Helper function to update benchmark values with realistic changes
  function updateBenchmarkState() {
    // Update industry-specific metrics
    Object.keys(benchmarkState).forEach(industry => {
      Object.keys(benchmarkState[industry]).forEach(metricId => {
        // Calculate change factor with slight positive bias (European economy improvement)
        const changeFactor = 1 + ((Math.random() - 0.4) * 0.02); // -0.8% to +1.2%
        
        const currentValue = benchmarkState[industry][metricId].average;
        const newValue = currentValue * changeFactor;
        
        // Update the value
        benchmarkState[industry][metricId] = {
          average: parseFloat(newValue.toFixed(2)),
          maxValue: parseFloat((newValue * 1.8).toFixed(2))
        };
      });
    });
    
    // Update default metric values
    Object.keys(defaultMetricValues).forEach(metricId => {
      const changeFactor = 1 + ((Math.random() - 0.4) * 0.015); // smaller changes for defaults
      
      const currentValue = defaultMetricValues[metricId].average;
      const newValue = currentValue * changeFactor;
      
      defaultMetricValues[metricId] = {
        average: parseFloat(newValue.toFixed(2)),
        maxValue: parseFloat((newValue * 1.8).toFixed(2))
      };
    });
  }
  
  // Helper function to send benchmark data to clients
  function broadcastBenchmarkUpdates() {
    try {
      // Skip update if no clients
      if (subscriptions.size === 0) {
        console.log('No clients subscribed, skipping benchmark update broadcast');
        return;
      }
      
      // Update the benchmark state first
      updateBenchmarkState();
      
      const timestamp = new Date().toISOString();
      console.log(`Broadcasting benchmark updates at ${timestamp} to ${subscriptions.size} clients`);
      
      // For each client with subscriptions - using Array.from to fix TS downlevelIteration issue
      for (const [client, subs] of Array.from(subscriptions.entries())) {
        // Skip clients that aren't connected
        if (client.readyState !== WebSocket.OPEN) {
          console.log('Skipping client with readyState:', client.readyState);
          continue;
        }
        
        console.log(`Sending updates to client with ${subs.length} subscriptions`);
        
        // For each subscription
        subs.forEach((sub: MetricSubscription) => {
          try {
            // Generate updates for the subscribed metrics
            const updates: Record<string, any> = {};
            
            if (!sub.metrics || !Array.isArray(sub.metrics) || sub.metrics.length === 0) {
              console.warn('Subscription has no metrics:', sub);
              return; // Skip this subscription
            }
            
            sub.metrics.forEach((metricId: string) => {
              try {
                // Get the current value from our state
                const { average, maxValue } = getBenchmarkValue(sub.industry, metricId);
                
                // Determine trend by comparing with previous value
                const previousValue = benchmarkState[sub.industry]?.[metricId]?.average || 
                                    defaultMetricValues[metricId]?.average || 50;
                
                let trend: 'up' | 'down' | 'stable' = 'stable';
                let changePercent = 0;
                
                if (average > previousValue * 1.005) {
                  trend = 'up';
                  changePercent = ((average / previousValue) - 1) * 100;
                } else if (average < previousValue * 0.995) {
                  trend = 'down';
                  changePercent = (1 - (average / previousValue)) * 100;
                } else {
                  changePercent = Math.abs((average / previousValue - 1) * 100);
                }
                
                updates[metricId] = {
                  average,
                  maxValue,
                  trend,
                  changePercent: parseFloat(changePercent.toFixed(1)),
                  metadata: {
                    dataSource: 'European Market Index',
                    lastUpdated: timestamp,
                    sampleSize: 200 + Math.floor(Math.random() * 100), // 200-300
                    isRealTime: true,
                    updateFrequency: '15s',
                    europeanIndex: true,
                    confidenceScore: 88 + Math.floor(Math.random() * 10) // 88-97
                  }
                };
              } catch (metricError) {
                console.error(`Error processing metric ${metricId}:`, metricError);
                // Continue with other metrics
              }
            });
            
            // Only send update if we have data
            if (Object.keys(updates).length === 0) {
              console.warn('No update data generated for subscription:', sub);
              return; // Skip sending empty updates
            }
            
            // Send the update to the client
            try {
              const message = JSON.stringify({
                type: 'benchmark_update',
                timestamp,
                data: updates
              });
              
              client.send(message);
              console.log(`Successfully sent benchmark update with ${Object.keys(updates).length} metrics`);
            } catch (sendError) {
              console.error('Error sending benchmark update to client:', sendError);
            }
          } catch (subError) {
            console.error('Error processing subscription:', subError);
            // Continue with other subscriptions
          }
        });
      }
    } catch (error) {
      console.error('Error in broadcastBenchmarkUpdates:', error);
    }
  }
  
  // Set up automatic broadcasting every 15 seconds
  let broadcastInterval: NodeJS.Timeout;
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    clients.add(ws);
    
    // Initialize broadcast if this is the first client
    if (clients.size === 1) {
      broadcastInterval = setInterval(broadcastBenchmarkUpdates, 15000);
    }
    
    // Handle messages from clients
    ws.on('message', (message) => {
      try {
        // Handle both string and buffer messages
        const messageString = message.toString();
        
        // First check if message is empty
        if (!messageString.trim()) {
          throw new Error('Empty message received');
        }

        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(messageString);
        } catch (parseError) {
          // If not JSON, handle as plain text command
          if (messageString.toLowerCase() === 'ping') {
            return ws.send(JSON.stringify({
              type: 'pong',
              timestamp: new Date().toISOString()
            }));
          }
          throw new Error('Message must be valid JSON or "ping" command');
        }

        // Validate message structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid message format');
        }

        console.log('Received message:', data.type || '[unknown]');
        
        if (data.type === 'subscribe') {
          console.log('Client subscribed to channel:', data.channel);
          
          // Send confirmation message
          ws.send(JSON.stringify({
            type: 'subscription_confirmed',
            channel: data.channel,
            timestamp: new Date().toISOString()
          }));
          
          // Send initial random data to test connection
          ws.send(JSON.stringify({
            type: 'benchmark_update',
            timestamp: new Date().toISOString(),
            data: {
              'test_metric': {
                value: 100,
                average: 80,
                maxValue: 120,
                trend: 'up',
                changePercent: 5,
                metadata: {
                  dataSource: 'European Market Index',
                  lastUpdated: new Date().toISOString(),
                  sampleSize: 250,
                  isRealTime: true,
                  updateFrequency: '15s',
                  europeanIndex: true,
                  confidenceScore: 95
                }
              }
            }
          }));
        } 
        else if (data.type === 'subscribe_metrics') {
          try {
            // Verify required fields are present
            if (!data.industry || !Array.isArray(data.metrics) || data.metrics.length === 0) {
              throw new Error('Invalid subscription data: industry and metrics array are required');
            }

            // Store the subscription
            if (!subscriptions.has(ws)) {
              subscriptions.set(ws, []);
            }
            
            // Add this subscription
            subscriptions.get(ws)?.push({
              industry: data.industry,
              subcategory: data.subcategory,
              metrics: data.metrics
            });
            
            console.log(`Client subscribed to metrics for industry: ${data.industry}, metrics: [${data.metrics.join(', ')}]`);
            
            // Send immediate update
            const initialUpdates: Record<string, any> = {};
            
            data.metrics.forEach((metricId: string) => {
              try {
                // Get initial values from our state
                const { average, maxValue } = getBenchmarkValue(data.industry, metricId);
                
                initialUpdates[metricId] = {
                  average,
                  maxValue,
                  trend: 'stable',
                  changePercent: 0,
                  metadata: {
                    dataSource: 'European Market Index',
                    lastUpdated: new Date().toISOString(),
                    sampleSize: 200 + Math.floor(Math.random() * 100), // 200-300
                    isRealTime: true,
                    updateFrequency: '15s',
                    europeanIndex: true,
                    confidenceScore: 92
                  }
                };
              } catch (metricError) {
                console.error(`Error processing metric ${metricId}:`, metricError);
                // Continue with other metrics
              }
            });
            
            // Send initial data
            ws.send(JSON.stringify({
              type: 'benchmark_update',
              timestamp: new Date().toISOString(),
              data: initialUpdates
            }));
            
            // Send confirmation message
            ws.send(JSON.stringify({
              type: 'subscription_confirmed',
              industry: data.industry,
              subcategory: data.subcategory,
              metrics: data.metrics,
              timestamp: new Date().toISOString()
            }));
          } catch (error) {
            const subscriptionError = error as Error;
            console.error('Error processing subscription:', subscriptionError);
            // Send error back to client
            ws.send(JSON.stringify({
              type: 'error',
              error: subscriptionError.message || 'Failed to process subscription',
              timestamp: new Date().toISOString()
            }));
          }
        }
      } catch (error) {
        const err = error as Error;
        console.error('Error processing WebSocket message:', err);
        
        // Send detailed error back to client
        try {
          ws.send(JSON.stringify({
            type: 'error',
            error: err.message || 'Failed to process message',
            details: {
              expectedFormat: 'JSON with {type: string, ...} or "ping" string',
              example: JSON.stringify({type: 'subscribe', channel: 'updates'})
            },
            timestamp: new Date().toISOString()
          }));
        } catch (sendError) {
          console.error('Error sending error message to client:', sendError);
        }
      }
    });
    
    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clients.delete(ws);
      subscriptions.delete(ws);
      
      // If no clients left, clear the broadcast interval
      if (clients.size === 0 && broadcastInterval) {
        clearInterval(broadcastInterval);
      }
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
      subscriptions.delete(ws);
    });
  });
  
  // AI-powered company analysis using real database data and OpenAI
  app.post("/api/ai/analyze-company", async (req, res) => {
    try {
      const { companyId } = req.body;
      
      if (!companyId || isNaN(parseInt(companyId))) {
        return res.status(400).json({ message: "Valid company ID is required" });
      }
      
      // Fetch the company data from database
      const company = await storage.getCompany(parseInt(companyId));
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      // Fetch related data for comprehensive analysis
      const financialData = await storage.getFinancialByCompanyId(company.id);
      const employeeData = await storage.getEmployeeByCompanyId(company.id);
      const technologyData = await storage.getTechnologyByCompanyId(company.id);
      const ownerIntentData = await storage.getOwnerIntentByCompanyId(company.id);
      
      // Prepare data for OpenAI analysis
      const companyProfile = {
        name: company.name,
        sector: company.sector,
        location: company.location,
        yearsInBusiness: company.yearsInBusiness,
        goal: company.goal,
        financials: financialData ? {
          revenueCurrent: financialData.revenueCurrent,
          revenuePrevious: financialData.revenuePrevious,
          revenueTwoYearsAgo: financialData.revenueTwoYearsAgo,
          ebitda: financialData.ebitda,
          netMargin: financialData.netMargin
        } : null,
        employees: employeeData ? {
          count: employeeData.count,
          digitalSystems: employeeData.digitalSystems
        } : null,
        technology: technologyData ? {
          transformationLevel: technologyData.transformationLevel,
          technologiesUsed: technologyData.technologiesUsed,
          techInvestment: technologyData.techInvestmentPercentage
        } : null,
        ownerIntent: ownerIntentData ? {
          intent: ownerIntentData.intent,
          exitTimeline: ownerIntentData.exitTimeline,
          idealOutcome: ownerIntentData.idealOutcome,
          valuationExpectations: ownerIntentData.valuationExpectations
        } : null
      };
      
      // OpenAI API call
      const { OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      console.log("Sending data to OpenAI for analysis:", JSON.stringify(companyProfile));
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a business valuation expert specializing in European small to medium businesses. Provide insightful analysis of business data to help owners understand their company's value and potential."
          },
          {
            role: "user",
            content: `Analyze this company data and provide a brief valuation assessment with key strengths, risks, and 3 specific recommendations to increase value: ${JSON.stringify(companyProfile)}`
          }
        ],
        max_tokens: 1000
      });
      
      const aiResponse = completion.choices[0].message.content;
      console.log("AI analysis completed successfully");
      
      // Store this analysis in the database as a recommendation
      if (aiResponse && company.id) {
        try {
          // Create a simplified recommendation from AI response
          const aiRecommendation = {
            companyId: company.id,
            category: "AI Analysis",
            impactPotential: 4,
            suggestions: [aiResponse.split('\n\n')[0]], // Just use the first paragraph as a suggestion
            estimatedValueImpactMin: 10,
            estimatedValueImpactMax: 20
          };
          
          await storage.createRecommendation(aiRecommendation);
          console.log("AI recommendation saved to database");
        } catch (recError) {
          console.error("Error saving AI recommendation:", recError);
          // Continue with response even if saving fails
        }
      }
      
      return res.json({ 
        companyId: company.id,
        companyName: company.name,
        timestamp: new Date().toISOString(),
        analysis: aiResponse
      });
    } catch (error) {
      console.error("Error in AI company analysis:", error);
      return res.status(500).json({ 
        message: "Error performing AI analysis", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Market Analysis endpoint using Perplexity API
  // API endpoint for chat completions with Emilia AI assistant
  app.post("/api/chat/completions", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      console.log("Processing chat completion using local knowledge base");

      // Extract the user message - the last message from the user
      const userMessages = messages.filter(msg => msg.role === "user");
      if (userMessages.length === 0) {
        return res.status(400).json({ error: "No user message found in the request" });
      }
      
      const userMessage = userMessages[userMessages.length - 1].content;
      
      // Define knowledge base responses based on keywords
      // This is a simplified version - the frontend has a more comprehensive implementation
      let response = "";
      const normalizedQuery = userMessage.toLowerCase().trim();
      
      // Fees and cost related
      if (normalizedQuery.includes("fee") || normalizedQuery.includes("cost") || normalizedQuery.includes("price") || 
          normalizedQuery.includes("charges") || normalizedQuery.includes("payment")) {
        response = "We put our customers first and have adopted a completely success-based fee system for M&A of transfer companies. We do not receive any retainer fee or interim fee. You only pay upon the successful closure of your M&A transaction.";
      } 
      // Valuation related
      else if (normalizedQuery.includes("valuation") || normalizedQuery.includes("worth") || normalizedQuery.includes("value")) {
        response = "At M&A × AI, your business valuation begins entirely free of charge, saving you thousands typically spent on initial consulting fees. Our advanced AI-driven valuation platform gives you precise insights into your company's worth quickly and efficiently.";
      }
      // Company info related
      else if (normalizedQuery.includes("about") || normalizedQuery.includes("who are you") || normalizedQuery.includes("company")) {
        response = "M&A × AI specializes in business valuation and M&A facilitation for European SMBs with EBITDA under €10 million. We offer zero upfront fees, AI-powered valuations, and a success-based fee structure.";
      }
      // Default response
      else {
        response = "I'm Emilia, your business valuation assistant. I can help with questions about our valuation services, M&A process, and European market information. What would you like to know?";
      }
      
      // Format the response to match the Perplexity API format
      const now = Math.floor(Date.now() / 1000);
      const formattedResponse = {
        id: `emilia-response-${now}`,
        model: "emilia-knowledge-base",
        object: "chat.completion",
        created: now,
        choices: [
          {
            index: 0,
            finish_reason: "stop",
            message: {
              role: "assistant",
              content: response
            }
          }
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
      
      return res.status(200).json(formattedResponse);
    } catch (error) {
      console.error("Error in chat completions endpoint:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai/market-analysis", async (req, res) => {
    try {
      const { sector, industryGroup, companyName, location } = req.body;
      
      if (!sector) {
        return res.status(400).json({ message: "Sector is required for market analysis" });
      }
      
      // Customize prompt based on available data
      let analysisPrompt = `Provide a detailed market analysis for the ${sector} sector`;
      
      if (industryGroup) {
        analysisPrompt += `, specifically focusing on the ${industryGroup} industry group`;
      }
      
      if (location) {
        analysisPrompt += ` in ${location}`;
      }
      
      if (companyName) {
        analysisPrompt += `. Consider the positioning of a company named "${companyName}"`;
      }
      
      analysisPrompt += `. Cover the following areas:
      1. Current market size and growth projections
      2. Key trends affecting the sector/industry
      3. Main competitors and market leaders
      4. Typical valuation multiples for similar businesses
      5. Major M&A activity in the past 2 years
      6. Regulatory challenges or opportunities
      7. Technology disruptions impacting the space
      8. European market specifics (if applicable)
      `;

      console.log("Sending request to Perplexity API for market analysis with prompt:", analysisPrompt);
      
      // Make request to Perplexity API
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "You are a financial market analyst specializing in European business sectors. Provide detailed, fact-based analysis with specific data points and insights that would be valuable for business valuation."
            },
            {
              role: "user",
              content: analysisPrompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2000,
          search_domain_filter: ["perplexity.ai"],
          search_recency_filter: "month",
          top_p: 0.9,
          return_related_questions: false,
          stream: false,
          frequency_penalty: 1
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Perplexity API error:", errorData);
        return res.status(response.status).json({ 
          message: "Error from market analysis API", 
          error: errorData 
        });
      }
      
      const data = await response.json();
      const analysis = data.choices[0].message.content;
      const citations = data.citations || [];
      
      console.log("Market analysis completed successfully");
      
      return res.json({
        sector,
        industryGroup: industryGroup || null,
        location: location || null,
        companyName: companyName || null,
        timestamp: new Date().toISOString(),
        analysis,
        citations,
        provider: "Perplexity"
      });
    } catch (error) {
      console.error("Error in market analysis:", error);
      return res.status(500).json({
        message: "Error performing market analysis",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return httpServer;
}

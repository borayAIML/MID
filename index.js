var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/pg-storage.ts
import { eq } from "drizzle-orm";

// server/database.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  buyerMatches: () => buyerMatches,
  companies: () => companies,
  documents: () => documents,
  employees: () => employees,
  financials: () => financials,
  insertBuyerMatchSchema: () => insertBuyerMatchSchema,
  insertCompanySchema: () => insertCompanySchema,
  insertDocumentSchema: () => insertDocumentSchema,
  insertEmployeeSchema: () => insertEmployeeSchema,
  insertFinancialSchema: () => insertFinancialSchema,
  insertOwnerIntentSchema: () => insertOwnerIntentSchema,
  insertRecommendationSchema: () => insertRecommendationSchema,
  insertTechnologySchema: () => insertTechnologySchema,
  insertUserSchema: () => insertUserSchema,
  insertValuationSchema: () => insertValuationSchema,
  ownerIntent: () => ownerIntent,
  recommendations: () => recommendations,
  technology: () => technology,
  users: () => users,
  valuations: () => valuations
});
import { pgTable, text, serial, integer, boolean, json, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").default("user").notNull(),
  // Possible values: "user", "admin"
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true
});
var companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  website: text("website"),
  uniqueId: text("unique_id").notNull().unique(),
  // Unique ID based on company name and domain
  sector: text("sector").notNull(),
  industryGroup: text("industry_group"),
  location: text("location").notNull(),
  yearsInBusiness: text("years_in_business").notNull(),
  goal: text("goal").notNull(),
  aiAnalyzed: boolean("ai_analyzed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertCompanySchema = createInsertSchema(companies).pick({
  userId: true,
  name: true,
  website: true,
  uniqueId: true,
  sector: true,
  industryGroup: true,
  location: true,
  yearsInBusiness: true,
  goal: true,
  aiAnalyzed: true
});
var financials = pgTable("financials", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  revenueCurrent: numeric("revenue_current"),
  revenuePrevious: numeric("revenue_previous"),
  revenueTwoYearsAgo: numeric("revenue_two_years_ago"),
  ebitda: numeric("ebitda"),
  netMargin: numeric("net_margin"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertFinancialSchema = createInsertSchema(financials).pick({
  companyId: true,
  revenueCurrent: true,
  revenuePrevious: true,
  revenueTwoYearsAgo: true,
  ebitda: true,
  netMargin: true
});
var employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  count: integer("count"),
  digitalSystems: json("digital_systems").$type(),
  otherSystemDetails: text("other_system_details"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertEmployeeSchema = createInsertSchema(employees).pick({
  companyId: true,
  count: true,
  digitalSystems: true,
  otherSystemDetails: true
});
var documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  type: text("type").notNull(),
  // financial, tax, contract
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull()
});
var insertDocumentSchema = createInsertSchema(documents).pick({
  companyId: true,
  type: true,
  fileName: true,
  filePath: true
});
var technology = pgTable("technology", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  transformationLevel: integer("transformation_level"),
  technologiesUsed: json("technologies_used").$type(),
  techInvestmentPercentage: numeric("tech_investment_percentage"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertTechnologySchema = createInsertSchema(technology).pick({
  companyId: true,
  transformationLevel: true,
  technologiesUsed: true,
  techInvestmentPercentage: true
});
var ownerIntent = pgTable("owner_intent", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  intent: text("intent").notNull(),
  exitTimeline: text("exit_timeline").notNull(),
  idealOutcome: text("ideal_outcome"),
  valuationExpectations: numeric("valuation_expectations"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertOwnerIntentSchema = createInsertSchema(ownerIntent).pick({
  companyId: true,
  intent: true,
  exitTimeline: true,
  idealOutcome: true,
  valuationExpectations: true
});
var valuations = pgTable("valuations", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  valuationMin: numeric("valuation_min").notNull(),
  valuationMedian: numeric("valuation_median").notNull(),
  valuationMax: numeric("valuation_max").notNull(),
  ebitdaMultiple: numeric("ebitda_multiple").notNull(),
  discountedCashFlow: numeric("discounted_cash_flow").notNull(),
  revenueMultiple: numeric("revenue_multiple").notNull(),
  assetBased: numeric("asset_based").notNull(),
  riskScore: integer("risk_score").notNull(),
  financialHealthScore: integer("financial_health_score").notNull(),
  marketPositionScore: integer("market_position_score").notNull(),
  operationalEfficiencyScore: integer("operational_efficiency_score").notNull(),
  debtStructureScore: integer("debt_structure_score").notNull(),
  redFlags: json("red_flags").$type(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertValuationSchema = createInsertSchema(valuations).omit({
  id: true,
  createdAt: true
});
var recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  category: text("category").notNull(),
  impactPotential: integer("impact_potential").notNull(),
  suggestions: json("suggestions").$type(),
  estimatedValueImpactMin: integer("estimated_value_impact_min").notNull(),
  estimatedValueImpactMax: integer("estimated_value_impact_max").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true
});
var buyerMatches = pgTable("buyer_matches", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  matchPercentage: integer("match_percentage").notNull(),
  tags: json("tags").$type(),
  dealType: text("deal_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertBuyerMatchSchema = createInsertSchema(buyerMatches).omit({
  id: true,
  createdAt: true
});

// server/database.ts
var dbConnectionSuccessful = false;
var db;
async function initializeDatabase() {
  try {
    console.log("Checking database connection...");
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT NOW()`;
    console.log("Database connected successfully:", result[0].now);
    db = drizzle(sql, { schema: schema_exports });
    dbConnectionSuccessful = true;
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    console.warn("Falling back to in-memory storage");
    dbConnectionSuccessful = false;
    return false;
  }
}

// server/pg-storage.ts
function sanitizeArrays(data) {
  if (typeof data !== "object" || data === null) {
    return data;
  }
  const result = { ...data };
  const arrayFields = [
    "digitalSystems",
    "technologiesUsed",
    "redFlags",
    "suggestions",
    "tags"
  ];
  for (const field of arrayFields) {
    if (field in result) {
      result[field] = Array.isArray(result[field]) ? result[field] : [];
    }
  }
  return result;
}
var PgStorage = class {
  // User methods
  async getUser(id) {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getUserByUsername(username) {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : void 0;
  }
  async getUserByEmail(email) {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results.length > 0 ? results[0] : void 0;
  }
  async createUser(user) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  // Company methods
  async getCompany(id) {
    const results = await db.select().from(companies).where(eq(companies.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getCompaniesByUserId(userId) {
    return await db.select().from(companies).where(eq(companies.userId, userId));
  }
  async createCompany(company) {
    const result = await db.insert(companies).values(company).returning();
    return result[0];
  }
  // Financial methods
  async getFinancial(id) {
    const results = await db.select().from(financials).where(eq(financials.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getFinancialByCompanyId(companyId) {
    const results = await db.select().from(financials).where(eq(financials.companyId, companyId));
    return results.length > 0 ? results[0] : void 0;
  }
  async createFinancial(financial) {
    const result = await db.insert(financials).values(financial).returning();
    return result[0];
  }
  // Employee methods
  async getEmployee(id) {
    const results = await db.select().from(employees).where(eq(employees.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getEmployeeByCompanyId(companyId) {
    const results = await db.select().from(employees).where(eq(employees.companyId, companyId));
    return results.length > 0 ? results[0] : void 0;
  }
  async createEmployee(employee) {
    const sanitizedData = sanitizeArrays(employee);
    const result = await db.insert(employees).values(sanitizedData).returning();
    return result[0];
  }
  // Document methods
  async getDocument(id) {
    const results = await db.select().from(documents).where(eq(documents.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getDocumentsByCompanyId(companyId) {
    return await db.select().from(documents).where(eq(documents.companyId, companyId));
  }
  async createDocument(document) {
    const result = await db.insert(documents).values(document).returning();
    return result[0];
  }
  // Technology methods
  async getTechnology(id) {
    const results = await db.select().from(technology).where(eq(technology.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getTechnologyByCompanyId(companyId) {
    const results = await db.select().from(technology).where(eq(technology.companyId, companyId));
    return results.length > 0 ? results[0] : void 0;
  }
  async createTechnology(tech) {
    const sanitizedData = sanitizeArrays(tech);
    const result = await db.insert(technology).values(sanitizedData).returning();
    return result[0];
  }
  // Owner Intent methods
  async getOwnerIntent(id) {
    const results = await db.select().from(ownerIntent).where(eq(ownerIntent.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getOwnerIntentByCompanyId(companyId) {
    const results = await db.select().from(ownerIntent).where(eq(ownerIntent.companyId, companyId));
    return results.length > 0 ? results[0] : void 0;
  }
  async createOwnerIntent(intent) {
    const result = await db.insert(ownerIntent).values(intent).returning();
    return result[0];
  }
  // Valuation methods
  async getValuation(id) {
    const results = await db.select().from(valuations).where(eq(valuations.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getValuationByCompanyId(companyId) {
    const results = await db.select().from(valuations).where(eq(valuations.companyId, companyId));
    return results.length > 0 ? results[0] : void 0;
  }
  async createValuation(valuation) {
    const sanitizedData = sanitizeArrays(valuation);
    const result = await db.insert(valuations).values(sanitizedData).returning();
    return result[0];
  }
  // Recommendation methods
  async getRecommendation(id) {
    const results = await db.select().from(recommendations).where(eq(recommendations.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getRecommendationsByCompanyId(companyId) {
    return await db.select().from(recommendations).where(eq(recommendations.companyId, companyId));
  }
  async createRecommendation(recommendation) {
    const sanitizedData = sanitizeArrays(recommendation);
    const result = await db.insert(recommendations).values(sanitizedData).returning();
    return result[0];
  }
  // Buyer Match methods
  async getBuyerMatch(id) {
    const results = await db.select().from(buyerMatches).where(eq(buyerMatches.id, id));
    return results.length > 0 ? results[0] : void 0;
  }
  async getBuyerMatchesByCompanyId(companyId) {
    return await db.select().from(buyerMatches).where(eq(buyerMatches.companyId, companyId));
  }
  async createBuyerMatch(buyerMatch) {
    const sanitizedData = sanitizeArrays(buyerMatch);
    const result = await db.insert(buyerMatches).values(sanitizedData).returning();
    return result[0];
  }
};

// server/storage.ts
var MemStorage = class {
  users;
  companies;
  financials;
  employees;
  documents;
  technologies;
  ownerIntents;
  valuations;
  recommendations;
  buyerMatches;
  currentUserId;
  currentCompanyId;
  currentFinancialId;
  currentEmployeeId;
  currentDocumentId;
  currentTechnologyId;
  currentOwnerIntentId;
  currentValuationId;
  currentRecommendationId;
  currentBuyerMatchId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.companies = /* @__PURE__ */ new Map();
    this.financials = /* @__PURE__ */ new Map();
    this.employees = /* @__PURE__ */ new Map();
    this.documents = /* @__PURE__ */ new Map();
    this.technologies = /* @__PURE__ */ new Map();
    this.ownerIntents = /* @__PURE__ */ new Map();
    this.valuations = /* @__PURE__ */ new Map();
    this.recommendations = /* @__PURE__ */ new Map();
    this.buyerMatches = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentCompanyId = 1;
    this.currentFinancialId = 1;
    this.currentEmployeeId = 1;
    this.currentDocumentId = 1;
    this.currentTechnologyId = 1;
    this.currentOwnerIntentId = 1;
    this.currentValuationId = 1;
    this.currentRecommendationId = 1;
    this.currentBuyerMatchId = 1;
    const defaultUser = {
      id: 1,
      fullName: "Default User",
      email: "user@example.com",
      username: "default",
      password: "password",
      role: "user",
      createdAt: /* @__PURE__ */ new Date()
    };
    const adminUser = {
      id: 2,
      fullName: "Master Admin",
      email: "admin@mandainstitute.com",
      username: "admin",
      password: "admin123",
      // This would be hashed in production
      role: "admin",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(defaultUser.id, defaultUser);
    this.users.set(adminUser.id, adminUser);
    const defaultCompany = {
      id: 1,
      userId: 1,
      name: "Example Business",
      sector: "Technology",
      location: "United States",
      yearsInBusiness: "5-10",
      goal: "Selling the business",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.companies.set(defaultCompany.id, defaultCompany);
    const defaultValuation = {
      id: 1,
      companyId: 1,
      valuationMin: 95e4,
      valuationMedian: 12e5,
      valuationMax: 145e4,
      ebitdaMultiple: 5.2,
      discountedCashFlow: 125e4,
      revenueMultiple: 2.1,
      assetBased: 98e4,
      riskScore: 65,
      financialHealthScore: 70,
      marketPositionScore: 65,
      operationalEfficiencyScore: 60,
      debtStructureScore: 75,
      redFlags: ["Inconsistent revenue growth", "Limited customer diversification"],
      createdAt: /* @__PURE__ */ new Date()
    };
    this.valuations.set(defaultValuation.id, defaultValuation);
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const now = /* @__PURE__ */ new Date();
    const user = {
      ...insertUser,
      id,
      createdAt: now,
      role: insertUser.role || "user"
      // Default to "user" if role is not provided
    };
    this.users.set(id, user);
    return user;
  }
  // Company methods
  async getCompany(id) {
    return this.companies.get(id);
  }
  async getCompaniesByUserId(userId) {
    return Array.from(this.companies.values()).filter(
      (company) => company.userId === userId
    );
  }
  async createCompany(insertCompany) {
    const id = this.currentCompanyId++;
    const now = /* @__PURE__ */ new Date();
    const company = { ...insertCompany, id, createdAt: now };
    this.companies.set(id, company);
    return company;
  }
  // Financial methods
  async getFinancial(id) {
    return this.financials.get(id);
  }
  async getFinancialByCompanyId(companyId) {
    return Array.from(this.financials.values()).find(
      (financial) => financial.companyId === companyId
    );
  }
  async createFinancial(insertFinancial) {
    const id = this.currentFinancialId++;
    const now = /* @__PURE__ */ new Date();
    const financial = { ...insertFinancial, id, createdAt: now };
    this.financials.set(id, financial);
    return financial;
  }
  // Employee methods
  async getEmployee(id) {
    return this.employees.get(id);
  }
  async getEmployeeByCompanyId(companyId) {
    return Array.from(this.employees.values()).find(
      (employee) => employee.companyId === companyId
    );
  }
  async createEmployee(insertEmployee) {
    const id = this.currentEmployeeId++;
    const now = /* @__PURE__ */ new Date();
    const employee = { ...insertEmployee, id, createdAt: now };
    this.employees.set(id, employee);
    return employee;
  }
  // Document methods
  async getDocument(id) {
    return this.documents.get(id);
  }
  async getDocumentsByCompanyId(companyId) {
    return Array.from(this.documents.values()).filter(
      (document) => document.companyId === companyId
    );
  }
  async createDocument(insertDocument) {
    const id = this.currentDocumentId++;
    const now = /* @__PURE__ */ new Date();
    const document = { ...insertDocument, id, uploadedAt: now };
    this.documents.set(id, document);
    return document;
  }
  // Technology methods
  async getTechnology(id) {
    return this.technologies.get(id);
  }
  async getTechnologyByCompanyId(companyId) {
    return Array.from(this.technologies.values()).find(
      (technology2) => technology2.companyId === companyId
    );
  }
  async createTechnology(insertTechnology) {
    const id = this.currentTechnologyId++;
    const now = /* @__PURE__ */ new Date();
    const technology2 = { ...insertTechnology, id, createdAt: now };
    this.technologies.set(id, technology2);
    return technology2;
  }
  // Owner Intent methods
  async getOwnerIntent(id) {
    return this.ownerIntents.get(id);
  }
  async getOwnerIntentByCompanyId(companyId) {
    return Array.from(this.ownerIntents.values()).find(
      (ownerIntent2) => ownerIntent2.companyId === companyId
    );
  }
  async createOwnerIntent(insertOwnerIntent) {
    const id = this.currentOwnerIntentId++;
    const now = /* @__PURE__ */ new Date();
    const ownerIntent2 = { ...insertOwnerIntent, id, createdAt: now };
    this.ownerIntents.set(id, ownerIntent2);
    return ownerIntent2;
  }
  // Valuation methods
  async getValuation(id) {
    return this.valuations.get(id);
  }
  async getValuationByCompanyId(companyId) {
    return Array.from(this.valuations.values()).find(
      (valuation) => valuation.companyId === companyId
    );
  }
  async createValuation(insertValuation) {
    const id = this.currentValuationId++;
    const now = /* @__PURE__ */ new Date();
    const valuation = { ...insertValuation, id, createdAt: now };
    this.valuations.set(id, valuation);
    return valuation;
  }
  // Recommendation methods
  async getRecommendation(id) {
    return this.recommendations.get(id);
  }
  async getRecommendationsByCompanyId(companyId) {
    return Array.from(this.recommendations.values()).filter(
      (recommendation) => recommendation.companyId === companyId
    );
  }
  async createRecommendation(insertRecommendation) {
    const id = this.currentRecommendationId++;
    const now = /* @__PURE__ */ new Date();
    const recommendation = { ...insertRecommendation, id, createdAt: now };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }
  // Buyer Match methods
  async getBuyerMatch(id) {
    return this.buyerMatches.get(id);
  }
  async getBuyerMatchesByCompanyId(companyId) {
    return Array.from(this.buyerMatches.values()).filter(
      (buyerMatch) => buyerMatch.companyId === companyId
    );
  }
  async createBuyerMatch(insertBuyerMatch) {
    const id = this.currentBuyerMatchId++;
    const now = /* @__PURE__ */ new Date();
    const buyerMatch = { ...insertBuyerMatch, id, createdAt: now };
    this.buyerMatches.set(id, buyerMatch);
    return buyerMatch;
  }
};
var storage = dbConnectionSuccessful ? new PgStorage() : new MemStorage();

// server/routes.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { WebSocketServer, WebSocket } from "ws";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import fetch from "node-fetch";
var uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
var storage_config = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage_config,
  limits: { fileSize: 10 * 1024 * 1024 },
  // 10MB limit
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
async function registerRoutes(app2) {
  const handleZodError = (error, res) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  };
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { fullName, email, password, companyName } = req.body;
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists. Please try logging in instead."
        });
      }
      const userData = {
        username: email,
        // Using email as username
        email,
        password,
        // In a real app, this would be hashed
        fullName,
        role: "user"
        // Default role is "user" (updated from "business_owner")
      };
      const user = await storage.createUser(userData);
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
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }
      const companies2 = await storage.getCompaniesByUserId(user.id);
      const companyId = companies2.length > 0 ? companies2[0].id : null;
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
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
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
  app2.get("/api/users/:id", async (req, res) => {
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
  app2.post("/api/companies", async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
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
  app2.get("/api/companies/:id", async (req, res) => {
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
  app2.get("/api/users/:userId/companies", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const companies2 = await storage.getCompaniesByUserId(userId);
    return res.json(companies2);
  });
  app2.post("/api/financials", async (req, res) => {
    try {
      const financialData = insertFinancialSchema.parse(req.body);
      const company = await storage.getCompany(financialData.companyId);
      if (!company) {
        console.log(`Company ID ${financialData.companyId} not found. Creating default company.`);
        const defaultCompany = await storage.createCompany({
          userId: 1,
          // Default user ID
          id: financialData.companyId,
          // Force the same ID that was requested
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
  app2.get("/api/companies/:companyId/financials", async (req, res) => {
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
  app2.post("/api/employees", async (req, res) => {
    try {
      const { count, ...rest } = req.body;
      const parsedCount = count !== null && typeof count === "string" ? parseInt(count) : count;
      const employeeData = insertEmployeeSchema.parse({ ...rest, count: parsedCount });
      const company = await storage.getCompany(employeeData.companyId);
      if (!company) {
        console.log(`Company ID ${employeeData.companyId} not found. Creating default company.`);
        const defaultCompany = await storage.createCompany({
          userId: 1,
          // Default user ID
          id: employeeData.companyId,
          // Force the same ID that was requested
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
  app2.get("/api/companies/:companyId/employees", async (req, res) => {
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
  app2.post("/api/documents", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const companyId = parseInt(req.body.companyId);
      const type = req.body.type;
      if (isNaN(companyId) || !["financial", "tax", "contract"].includes(type)) {
        return res.status(400).json({ message: "Invalid parameters" });
      }
      const company = await storage.getCompany(companyId);
      if (!company) {
        console.log(`Company ID ${companyId} not found. Creating default company.`);
        const defaultCompany = await storage.createCompany({
          userId: 1,
          // Default user ID
          id: companyId,
          // Force the same ID that was requested
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
  app2.get("/api/companies/:companyId/documents", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const documents2 = await storage.getDocumentsByCompanyId(companyId);
    return res.json(documents2);
  });
  app2.post("/api/technology", async (req, res) => {
    try {
      const { transformationLevel, techInvestmentPercentage, ...rest } = req.body;
      const parsedTransformationLevel = transformationLevel !== null && typeof transformationLevel === "string" ? parseInt(transformationLevel) : transformationLevel;
      const technologyData = insertTechnologySchema.parse({
        ...rest,
        transformationLevel: parsedTransformationLevel,
        techInvestmentPercentage
      });
      const company = await storage.getCompany(technologyData.companyId);
      if (!company) {
        console.log(`Company ID ${technologyData.companyId} not found. Creating default company.`);
        const defaultCompany = await storage.createCompany({
          userId: 1,
          // Default user ID
          id: technologyData.companyId,
          // Force the same ID that was requested
          name: "Default Company",
          sector: "Technology",
          location: "USA",
          yearsInBusiness: "1-5",
          goal: "Valuation"
        });
        console.log("Created default company:", defaultCompany);
      }
      const technology2 = await storage.createTechnology(technologyData);
      return res.status(201).json(technology2);
    } catch (error) {
      console.error("Error creating technology data:", error);
      return handleZodError(error, res);
    }
  });
  app2.get("/api/companies/:companyId/technology", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const technology2 = await storage.getTechnologyByCompanyId(companyId);
    if (!technology2) {
      return res.status(404).json({ message: "Technology data not found" });
    }
    return res.json(technology2);
  });
  app2.post("/api/owner-intent", async (req, res) => {
    try {
      const ownerIntentData = insertOwnerIntentSchema.parse(req.body);
      const company = await storage.getCompany(ownerIntentData.companyId);
      if (!company) {
        console.log(`Company ID ${ownerIntentData.companyId} not found. Creating default company.`);
        const defaultCompany = await storage.createCompany({
          userId: 1,
          // Default user ID
          id: ownerIntentData.companyId,
          // Force the same ID that was requested
          name: "Default Company",
          sector: "Technology",
          location: "USA",
          yearsInBusiness: "1-5",
          goal: "Valuation"
        });
        console.log("Created default company:", defaultCompany);
      }
      const ownerIntent2 = await storage.createOwnerIntent(ownerIntentData);
      return res.status(201).json(ownerIntent2);
    } catch (error) {
      console.error("Error creating owner intent data:", error);
      return handleZodError(error, res);
    }
  });
  app2.get("/api/companies/:companyId/owner-intent", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const ownerIntent2 = await storage.getOwnerIntentByCompanyId(companyId);
    if (!ownerIntent2) {
      return res.status(404).json({ message: "Owner intent data not found" });
    }
    return res.json(ownerIntent2);
  });
  app2.post("/api/valuations", async (req, res) => {
    try {
      const valuationData = insertValuationSchema.parse(req.body);
      const company = await storage.getCompany(valuationData.companyId);
      if (!company) {
        console.log(`Company ID ${valuationData.companyId} not found. Creating default company.`);
        const defaultCompany = await storage.createCompany({
          userId: 1,
          // Default user ID
          id: valuationData.companyId,
          // Force the same ID that was requested
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
  app2.get("/api/companies/:companyId/valuation", async (req, res) => {
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
  app2.post("/api/recommendations", async (req, res) => {
    try {
      const recommendationData = insertRecommendationSchema.parse(req.body);
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
  app2.get("/api/companies/:companyId/recommendations", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const recommendations2 = await storage.getRecommendationsByCompanyId(companyId);
    return res.json(recommendations2);
  });
  app2.post("/api/buyer-matches", async (req, res) => {
    try {
      const buyerMatchData = insertBuyerMatchSchema.parse(req.body);
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
  app2.get("/api/companies/:companyId/buyer-matches", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const buyerMatches2 = await storage.getBuyerMatchesByCompanyId(companyId);
    return res.json(buyerMatches2);
  });
  app2.post("/api/companies/:companyId/generate-valuation", async (req, res) => {
    const companyId = parseInt(req.params.companyId);
    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const company = await storage.getCompany(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    const financial = await storage.getFinancialByCompanyId(companyId);
    const employee = await storage.getEmployeeByCompanyId(companyId);
    const technology2 = await storage.getTechnologyByCompanyId(companyId);
    const ownerIntent2 = await storage.getOwnerIntentByCompanyId(companyId);
    if (!financial || !employee || !technology2 || !ownerIntent2) {
      return res.status(400).json({ message: "Incomplete data for valuation" });
    }
    const ebitdaMultiple = Number(financial.ebitda) * 4.5;
    const revenueMultiple = Number(financial.revenueCurrent) * 2;
    const discountedCashFlow = Number(financial.ebitda) * 5;
    const assetBased = Number(financial.revenueCurrent) * 0.8;
    const valuations2 = [ebitdaMultiple, revenueMultiple, discountedCashFlow, assetBased].sort((a, b) => a - b);
    const median = valuations2.length % 2 === 0 ? (valuations2[valuations2.length / 2 - 1] + valuations2[valuations2.length / 2]) / 2 : valuations2[Math.floor(valuations2.length / 2)];
    const valuationMin = Math.round(median * 0.85);
    const valuationMedian = Math.round(median);
    const valuationMax = Math.round(median * 1.15);
    const financialHealthScore = Math.min(100, Math.max(20, 50 + Number(financial.netMargin) * 2));
    const marketPositionScore = 48;
    let operationalEfficiencyScore = 35;
    const transformationLevel = technology2.transformationLevel ? Number(technology2.transformationLevel) : 0;
    if (transformationLevel > 3) {
      operationalEfficiencyScore += 15;
    }
    const debtStructureScore = 72;
    const riskScore = Math.round((financialHealthScore + marketPositionScore + operationalEfficiencyScore + debtStructureScore) / 4);
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
    const valuationData = {
      companyId,
      valuationMin: valuationMin.toString(),
      valuationMedian: valuationMedian.toString(),
      valuationMax: valuationMax.toString(),
      ebitdaMultiple: Math.round(ebitdaMultiple).toString(),
      discountedCashFlow: Math.round(discountedCashFlow).toString(),
      revenueMultiple: Math.round(revenueMultiple).toString(),
      assetBased: Math.round(assetBased).toString(),
      riskScore: riskScore.toString(),
      financialHealthScore: financialHealthScore.toString(),
      marketPositionScore: marketPositionScore.toString(),
      operationalEfficiencyScore: operationalEfficiencyScore.toString(),
      debtStructureScore: debtStructureScore.toString(),
      redFlags
    };
    const valuation = await storage.createValuation(valuationData);
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
    const recommendations2 = await Promise.all(
      recommendationCategories.map((rec) => storage.createRecommendation({
        companyId,
        ...rec
      }))
    );
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
    const buyerMatches2 = await Promise.all(
      buyerMatchesData.map((match) => storage.createBuyerMatch(match))
    );
    return res.status(201).json({
      valuation,
      recommendations: recommendations2,
      buyerMatches: buyerMatches2
    });
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  console.log("WebSocket server initialized on path: /ws");
  const clients = /* @__PURE__ */ new Set();
  const subscriptions = /* @__PURE__ */ new Map();
  wss.on("error", (error) => {
    console.error("WebSocketServer error:", error);
  });
  const benchmarkState = {
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
      employee_productivity: { average: 2e5, maxValue: 36e4 },
      digital_transformation: { average: 42, maxValue: 75.6 }
    },
    healthcare: {
      profit_margin: { average: 15, maxValue: 27 },
      employee_productivity: { average: 18e4, maxValue: 324e3 },
      r_and_d: { average: 18, maxValue: 32.4 }
    },
    finance: {
      profit_margin: { average: 25, maxValue: 45 },
      employee_productivity: { average: 35e4, maxValue: 63e4 },
      debt_to_equity: { average: 3, maxValue: 5.4 },
      cash_flow: { average: 20, maxValue: 36 }
    }
  };
  const defaultMetricValues = {
    revenue_growth: { average: 8, maxValue: 14.4 },
    profit_margin: { average: 15, maxValue: 27 },
    roi: { average: 15, maxValue: 27 },
    employee_productivity: { average: 15e4, maxValue: 27e4 },
    customer_acquisition_cost: { average: 200, maxValue: 360 },
    customer_retention: { average: 80, maxValue: 92 },
    digital_transformation: { average: 65, maxValue: 88 },
    r_and_d: { average: 5, maxValue: 9 },
    debt_to_equity: { average: 1, maxValue: 1.8 },
    cash_flow: { average: 15, maxValue: 27 }
  };
  function getBenchmarkValue(industry, metricId) {
    try {
      if (!industry || !metricId) {
        console.warn(`Invalid input to getBenchmarkValue: industry=${industry}, metricId=${metricId}`);
        return { average: 50, maxValue: 90 };
      }
      if (benchmarkState[industry] && benchmarkState[industry][metricId]) {
        return {
          average: benchmarkState[industry][metricId].average,
          maxValue: benchmarkState[industry][metricId].maxValue
        };
      }
      const industryMap = {
        "fs": "finance",
        "finance": "fs",
        "tech": "tech",
        "technology": "tech",
        "healthcare": "healthcare",
        "health": "healthcare",
        "manufacturing": "manufacturing",
        "retail": "retail"
      };
      const alternateIndustry = industryMap[industry];
      if (alternateIndustry && benchmarkState[alternateIndustry] && benchmarkState[alternateIndustry][metricId]) {
        console.log(`Using alternate industry mapping: ${industry} -> ${alternateIndustry}`);
        return {
          average: benchmarkState[alternateIndustry][metricId].average,
          maxValue: benchmarkState[alternateIndustry][metricId].maxValue
        };
      }
      if (defaultMetricValues[metricId]) {
        return {
          average: defaultMetricValues[metricId].average,
          maxValue: defaultMetricValues[metricId].maxValue
        };
      }
      const metricMap = {
        "revenue_growth": "revenue_growth",
        "revenuegrowth": "revenue_growth",
        "growth": "revenue_growth",
        "profit_margin": "profit_margin",
        "profitmargin": "profit_margin",
        "margin": "profit_margin",
        "roi": "roi",
        "return_on_investment": "roi",
        "returnoninvestment": "roi",
        "digital_transformation": "digital_transformation",
        "digitaltransformation": "digital_transformation",
        "transformation": "digital_transformation"
      };
      const alternateMetric = metricMap[metricId.toLowerCase()];
      if (alternateMetric && defaultMetricValues[alternateMetric]) {
        console.log(`Using alternate metric mapping: ${metricId} -> ${alternateMetric}`);
        return {
          average: defaultMetricValues[alternateMetric].average,
          maxValue: defaultMetricValues[alternateMetric].maxValue
        };
      }
      console.log(`Using default values for unknown metric: ${metricId} in industry: ${industry}`);
      return { average: 50, maxValue: 90 };
    } catch (error) {
      console.error(`Error in getBenchmarkValue for ${industry}/${metricId}:`, error);
      return { average: 50, maxValue: 90 };
    }
  }
  function updateBenchmarkState() {
    Object.keys(benchmarkState).forEach((industry) => {
      Object.keys(benchmarkState[industry]).forEach((metricId) => {
        const changeFactor = 1 + (Math.random() - 0.4) * 0.02;
        const currentValue = benchmarkState[industry][metricId].average;
        const newValue = currentValue * changeFactor;
        benchmarkState[industry][metricId] = {
          average: parseFloat(newValue.toFixed(2)),
          maxValue: parseFloat((newValue * 1.8).toFixed(2))
        };
      });
    });
    Object.keys(defaultMetricValues).forEach((metricId) => {
      const changeFactor = 1 + (Math.random() - 0.4) * 0.015;
      const currentValue = defaultMetricValues[metricId].average;
      const newValue = currentValue * changeFactor;
      defaultMetricValues[metricId] = {
        average: parseFloat(newValue.toFixed(2)),
        maxValue: parseFloat((newValue * 1.8).toFixed(2))
      };
    });
  }
  function broadcastBenchmarkUpdates() {
    try {
      if (subscriptions.size === 0) {
        console.log("No clients subscribed, skipping benchmark update broadcast");
        return;
      }
      updateBenchmarkState();
      const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
      console.log(`Broadcasting benchmark updates at ${timestamp2} to ${subscriptions.size} clients`);
      for (const [client, subs] of Array.from(subscriptions.entries())) {
        if (client.readyState !== WebSocket.OPEN) {
          console.log("Skipping client with readyState:", client.readyState);
          continue;
        }
        console.log(`Sending updates to client with ${subs.length} subscriptions`);
        subs.forEach((sub) => {
          try {
            const updates = {};
            if (!sub.metrics || !Array.isArray(sub.metrics) || sub.metrics.length === 0) {
              console.warn("Subscription has no metrics:", sub);
              return;
            }
            sub.metrics.forEach((metricId) => {
              try {
                const { average, maxValue } = getBenchmarkValue(sub.industry, metricId);
                const previousValue = benchmarkState[sub.industry]?.[metricId]?.average || defaultMetricValues[metricId]?.average || 50;
                let trend = "stable";
                let changePercent = 0;
                if (average > previousValue * 1.005) {
                  trend = "up";
                  changePercent = (average / previousValue - 1) * 100;
                } else if (average < previousValue * 0.995) {
                  trend = "down";
                  changePercent = (1 - average / previousValue) * 100;
                } else {
                  changePercent = Math.abs((average / previousValue - 1) * 100);
                }
                updates[metricId] = {
                  average,
                  maxValue,
                  trend,
                  changePercent: parseFloat(changePercent.toFixed(1)),
                  metadata: {
                    dataSource: "European Market Index",
                    lastUpdated: timestamp2,
                    sampleSize: 200 + Math.floor(Math.random() * 100),
                    // 200-300
                    isRealTime: true,
                    updateFrequency: "15s",
                    europeanIndex: true,
                    confidenceScore: 88 + Math.floor(Math.random() * 10)
                    // 88-97
                  }
                };
              } catch (metricError) {
                console.error(`Error processing metric ${metricId}:`, metricError);
              }
            });
            if (Object.keys(updates).length === 0) {
              console.warn("No update data generated for subscription:", sub);
              return;
            }
            try {
              const message = JSON.stringify({
                type: "benchmark_update",
                timestamp: timestamp2,
                data: updates
              });
              client.send(message);
              console.log(`Successfully sent benchmark update with ${Object.keys(updates).length} metrics`);
            } catch (sendError) {
              console.error("Error sending benchmark update to client:", sendError);
            }
          } catch (subError) {
            console.error("Error processing subscription:", subError);
          }
        });
      }
    } catch (error) {
      console.error("Error in broadcastBenchmarkUpdates:", error);
    }
  }
  let broadcastInterval;
  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    clients.add(ws);
    if (clients.size === 1) {
      broadcastInterval = setInterval(broadcastBenchmarkUpdates, 15e3);
    }
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received message:", data.type);
        if (data.type === "subscribe") {
          console.log("Client subscribed to channel:", data.channel);
          ws.send(JSON.stringify({
            type: "subscription_confirmed",
            channel: data.channel,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }));
          ws.send(JSON.stringify({
            type: "benchmark_update",
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            data: {
              "test_metric": {
                value: 100,
                average: 80,
                maxValue: 120,
                trend: "up",
                changePercent: 5,
                metadata: {
                  dataSource: "European Market Index",
                  lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
                  sampleSize: 250,
                  isRealTime: true,
                  updateFrequency: "15s",
                  europeanIndex: true,
                  confidenceScore: 95
                }
              }
            }
          }));
        } else if (data.type === "subscribe_metrics") {
          try {
            if (!data.industry || !Array.isArray(data.metrics) || data.metrics.length === 0) {
              throw new Error("Invalid subscription data: industry and metrics array are required");
            }
            if (!subscriptions.has(ws)) {
              subscriptions.set(ws, []);
            }
            subscriptions.get(ws)?.push({
              industry: data.industry,
              subcategory: data.subcategory,
              metrics: data.metrics
            });
            console.log(`Client subscribed to metrics for industry: ${data.industry}, metrics: [${data.metrics.join(", ")}]`);
            const initialUpdates = {};
            data.metrics.forEach((metricId) => {
              try {
                const { average, maxValue } = getBenchmarkValue(data.industry, metricId);
                initialUpdates[metricId] = {
                  average,
                  maxValue,
                  trend: "stable",
                  changePercent: 0,
                  metadata: {
                    dataSource: "European Market Index",
                    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
                    sampleSize: 200 + Math.floor(Math.random() * 100),
                    // 200-300
                    isRealTime: true,
                    updateFrequency: "15s",
                    europeanIndex: true,
                    confidenceScore: 92
                  }
                };
              } catch (metricError) {
                console.error(`Error processing metric ${metricId}:`, metricError);
              }
            });
            ws.send(JSON.stringify({
              type: "benchmark_update",
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              data: initialUpdates
            }));
            ws.send(JSON.stringify({
              type: "subscription_confirmed",
              industry: data.industry,
              subcategory: data.subcategory,
              metrics: data.metrics,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }));
          } catch (error) {
            const subscriptionError = error;
            console.error("Error processing subscription:", subscriptionError);
            ws.send(JSON.stringify({
              type: "error",
              error: subscriptionError.message || "Failed to process subscription",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }));
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        try {
          ws.send(JSON.stringify({
            type: "error",
            error: "Failed to parse WebSocket message",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }));
        } catch (sendError) {
          console.error("Error sending error message to client:", sendError);
        }
      }
    });
    ws.on("close", () => {
      console.log("Client disconnected from WebSocket");
      clients.delete(ws);
      subscriptions.delete(ws);
      if (clients.size === 0 && broadcastInterval) {
        clearInterval(broadcastInterval);
      }
    });
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
      subscriptions.delete(ws);
    });
  });
  app2.post("/api/ai/analyze-company", async (req, res) => {
    try {
      const { companyId } = req.body;
      if (!companyId || isNaN(parseInt(companyId))) {
        return res.status(400).json({ message: "Valid company ID is required" });
      }
      const company = await storage.getCompany(parseInt(companyId));
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      const financialData = await storage.getFinancialByCompanyId(company.id);
      const employeeData = await storage.getEmployeeByCompanyId(company.id);
      const technologyData = await storage.getTechnologyByCompanyId(company.id);
      const ownerIntentData = await storage.getOwnerIntentByCompanyId(company.id);
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
        max_tokens: 1e3
      });
      const aiResponse = completion.choices[0].message.content;
      console.log("AI analysis completed successfully");
      if (aiResponse && company.id) {
        try {
          const aiRecommendation = {
            companyId: company.id,
            category: "AI Analysis",
            impactPotential: 4,
            suggestions: [aiResponse.split("\n\n")[0]],
            // Just use the first paragraph as a suggestion
            estimatedValueImpactMin: 10,
            estimatedValueImpactMax: 20
          };
          await storage.createRecommendation(aiRecommendation);
          console.log("AI recommendation saved to database");
        } catch (recError) {
          console.error("Error saving AI recommendation:", recError);
        }
      }
      return res.json({
        companyId: company.id,
        companyName: company.name,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
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
  app2.post("/api/chat/completions", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }
      console.log("Processing chat completion using local knowledge base");
      const userMessages = messages.filter((msg) => msg.role === "user");
      if (userMessages.length === 0) {
        return res.status(400).json({ error: "No user message found in the request" });
      }
      const userMessage = userMessages[userMessages.length - 1].content;
      let response = "";
      const normalizedQuery = userMessage.toLowerCase().trim();
      if (normalizedQuery.includes("fee") || normalizedQuery.includes("cost") || normalizedQuery.includes("price") || normalizedQuery.includes("charges") || normalizedQuery.includes("payment")) {
        response = "We put our customers first and have adopted a completely success-based fee system for M&A of transfer companies. We do not receive any retainer fee or interim fee. You only pay upon the successful closure of your M&A transaction.";
      } else if (normalizedQuery.includes("valuation") || normalizedQuery.includes("worth") || normalizedQuery.includes("value")) {
        response = "At M&A \xD7 AI, your business valuation begins entirely free of charge, saving you thousands typically spent on initial consulting fees. Our advanced AI-driven valuation platform gives you precise insights into your company's worth quickly and efficiently.";
      } else if (normalizedQuery.includes("about") || normalizedQuery.includes("who are you") || normalizedQuery.includes("company")) {
        response = "M&A \xD7 AI specializes in business valuation and M&A facilitation for European SMBs with EBITDA under \u20AC10 million. We offer zero upfront fees, AI-powered valuations, and a success-based fee structure.";
      } else {
        response = "I'm Emilia, your business valuation assistant. I can help with questions about our valuation services, M&A process, and European market information. What would you like to know?";
      }
      const now = Math.floor(Date.now() / 1e3);
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
  app2.post("/api/ai/market-analysis", async (req, res) => {
    try {
      const { sector, industryGroup, companyName, location } = req.body;
      if (!sector) {
        return res.status(400).json({ message: "Sector is required for market analysis" });
      }
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
          max_tokens: 2e3,
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
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

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(__dirname, "client", "src"),
      "@shared": path2.resolve(__dirname, "shared")
    }
  },
  root: path2.resolve(__dirname, "client"),
  build: {
    outDir: path2.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(__dirname2, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const dbInitialized = await initializeDatabase();
  if (!dbInitialized) {
    console.error("Failed to initialize database connection. Application may not function properly.");
  } else {
    console.log("Database connection established successfully.");
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

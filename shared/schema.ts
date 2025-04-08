import { pgTable, text, serial, integer, boolean, json, timestamp, varchar, numeric, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - store basic user information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").default("user").notNull(), // Possible values: "user", "admin"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true,
});

// Companies table - store company information
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  website: text("website"),
  uniqueId: text("unique_id").notNull().unique(), // Unique ID based on company name and domain
  sector: text("sector").notNull(),
  industryGroup: text("industry_group"),
  location: text("location").notNull(),
  yearsInBusiness: text("years_in_business").notNull(),
  goal: text("goal").notNull(),
  aiAnalyzed: boolean("ai_analyzed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(companies).pick({
  userId: true,
  name: true,
  website: true,
  uniqueId: true,
  sector: true,
  industryGroup: true,
  location: true,
  yearsInBusiness: true,
  goal: true,
  aiAnalyzed: true,
});

// Financial data table - store company financial information
export const financials = pgTable("financials", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  revenueCurrent: numeric("revenue_current"),
  revenuePrevious: numeric("revenue_previous"),
  revenueTwoYearsAgo: numeric("revenue_two_years_ago"),
  ebitda: numeric("ebitda"),
  netMargin: numeric("net_margin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFinancialSchema = createInsertSchema(financials).pick({
  companyId: true,
  revenueCurrent: true,
  revenuePrevious: true,
  revenueTwoYearsAgo: true,
  ebitda: true,
  netMargin: true,
});

// Employee data table - store employee information
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  count: integer("count"),
  digitalSystems: json("digital_systems").$type<string[]>(),
  otherSystemDetails: text("other_system_details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).pick({
  companyId: true,
  count: true,
  digitalSystems: true,
  otherSystemDetails: true,
});

// Document uploads table - store document upload references
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  type: text("type").notNull(), // financial, tax, contract
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  companyId: true,
  type: true,
  fileName: true,
  filePath: true,
});

// Technology usage table - store tech usage information
export const technology = pgTable("technology", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  transformationLevel: integer("transformation_level"),
  technologiesUsed: json("technologies_used").$type<string[]>(),
  techInvestmentPercentage: numeric("tech_investment_percentage"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTechnologySchema = createInsertSchema(technology).pick({
  companyId: true,
  transformationLevel: true,
  technologiesUsed: true,
  techInvestmentPercentage: true,
});

// Owner intent table - store owner intent information
export const ownerIntent = pgTable("owner_intent", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  intent: text("intent").notNull(),
  exitTimeline: text("exit_timeline").notNull(),
  idealOutcome: text("ideal_outcome"),
  valuationExpectations: numeric("valuation_expectations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOwnerIntentSchema = createInsertSchema(ownerIntent).pick({
  companyId: true,
  intent: true,
  exitTimeline: true,
  idealOutcome: true,
  valuationExpectations: true,
});

// Valuation results table - store valuation calculations
export const valuations = pgTable("valuations", {
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
  redFlags: json("red_flags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertValuationSchema = createInsertSchema(valuations).omit({
  id: true,
  createdAt: true,
});

// Recommendations table - store improvement recommendations
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  category: text("category").notNull(),
  impactPotential: integer("impact_potential").notNull(),
  suggestions: json("suggestions").$type<string[]>(),
  estimatedValueImpactMin: integer("estimated_value_impact_min").notNull(),
  estimatedValueImpactMax: integer("estimated_value_impact_max").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

// Buyer matches table - store potential buyer/investor matches
export const buyerMatches = pgTable("buyer_matches", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  matchPercentage: integer("match_percentage").notNull(),
  tags: json("tags").$type<string[]>(),
  dealType: text("deal_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBuyerMatchSchema = createInsertSchema(buyerMatches).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Financial = typeof financials.$inferSelect;
export type InsertFinancial = z.infer<typeof insertFinancialSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Technology = typeof technology.$inferSelect;
export type InsertTechnology = z.infer<typeof insertTechnologySchema>;

export type OwnerIntent = typeof ownerIntent.$inferSelect;
export type InsertOwnerIntent = z.infer<typeof insertOwnerIntentSchema>;

export type Valuation = typeof valuations.$inferSelect;
export type InsertValuation = z.infer<typeof insertValuationSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

export type BuyerMatch = typeof buyerMatches.$inferSelect;
export type InsertBuyerMatch = z.infer<typeof insertBuyerMatchSchema>;

// Form data types
export type OnboardingFormData = {
  fullName: string;
  email: string;
  companyName: string;
  website: string | null;
  sector: string;
  industryGroup: string;
  location: string;
  yearsInBusiness: string;
  goal: string;
};

export type BusinessDataWizardData = {
  financialData: {
    revenueCurrent: number | null;
    revenuePrevious: number | null;
    revenueTwoYearsAgo: number | null;
    ebitda: number | null;
    netMargin: number | null;
  };
  employeeData: {
    employeeCount: number | null;
    digitalSystems: string[];
    otherSystemDetails: string;
  };
  documentData: {
    financialStatements: File | null;
    taxDocuments: File | null;
    contracts: File | null;
  };
  technologyData: {
    transformationLevel: number;
    technologiesUsed: string[];
    techInvestmentPercentage: number | null;
  };
  ownerIntentData: {
    intent: string;
    exitTimeline: string;
    idealOutcome: string;
    valuationExpectations: number | null;
  };
};

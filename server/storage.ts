import {
  User, InsertUser, Company, InsertCompany, Financial, InsertFinancial,
  Employee, InsertEmployee, Document, InsertDocument, Technology, InsertTechnology,
  OwnerIntent, InsertOwnerIntent, Valuation, InsertValuation, Recommendation, InsertRecommendation,
  BuyerMatch, InsertBuyerMatch
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Company methods
  getCompany(id: number): Promise<Company | undefined>;
  getCompaniesByUserId(userId: number): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  
  // Financial methods
  getFinancial(id: number): Promise<Financial | undefined>;
  getFinancialByCompanyId(companyId: number): Promise<Financial | undefined>;
  createFinancial(financial: InsertFinancial): Promise<Financial>;
  
  // Employee methods
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByCompanyId(companyId: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  
  // Document methods
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByCompanyId(companyId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Technology methods
  getTechnology(id: number): Promise<Technology | undefined>;
  getTechnologyByCompanyId(companyId: number): Promise<Technology | undefined>;
  createTechnology(technology: InsertTechnology): Promise<Technology>;
  
  // Owner Intent methods
  getOwnerIntent(id: number): Promise<OwnerIntent | undefined>;
  getOwnerIntentByCompanyId(companyId: number): Promise<OwnerIntent | undefined>;
  createOwnerIntent(ownerIntent: InsertOwnerIntent): Promise<OwnerIntent>;
  
  // Valuation methods
  getValuation(id: number): Promise<Valuation | undefined>;
  getValuationByCompanyId(companyId: number): Promise<Valuation | undefined>;
  createValuation(valuation: InsertValuation): Promise<Valuation>;
  
  // Recommendation methods
  getRecommendation(id: number): Promise<Recommendation | undefined>;
  getRecommendationsByCompanyId(companyId: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  
  // Buyer Match methods
  getBuyerMatch(id: number): Promise<BuyerMatch | undefined>;
  getBuyerMatchesByCompanyId(companyId: number): Promise<BuyerMatch[]>;
  createBuyerMatch(buyerMatch: InsertBuyerMatch): Promise<BuyerMatch>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<number, Company>;
  private financials: Map<number, Financial>;
  private employees: Map<number, Employee>;
  private documents: Map<number, Document>;
  private technologies: Map<number, Technology>;
  private ownerIntents: Map<number, OwnerIntent>;
  private valuations: Map<number, Valuation>;
  private recommendations: Map<number, Recommendation>;
  private buyerMatches: Map<number, BuyerMatch>;
  
  private currentUserId: number;
  private currentCompanyId: number;
  private currentFinancialId: number;
  private currentEmployeeId: number;
  private currentDocumentId: number;
  private currentTechnologyId: number;
  private currentOwnerIntentId: number;
  private currentValuationId: number;
  private currentRecommendationId: number;
  private currentBuyerMatchId: number;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.financials = new Map();
    this.employees = new Map();
    this.documents = new Map();
    this.technologies = new Map();
    this.ownerIntents = new Map();
    this.valuations = new Map();
    this.recommendations = new Map();
    this.buyerMatches = new Map();
    
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
    
    // Create a default user for testing/demo purposes
    const defaultUser: User = {
      id: 1,
      fullName: "Default User",
      email: "user@example.com",
      username: "default",
      password: "password",
      role: "user",
      createdAt: new Date()
    };
    
    // Create a master admin user
    const adminUser: User = {
      id: 2,
      fullName: "Master Admin",
      email: "admin@mandainstitute.com",
      username: "admin",
      password: "admin123", // This would be hashed in production
      role: "admin",
      createdAt: new Date()
    };
    this.users.set(defaultUser.id, defaultUser);
    this.users.set(adminUser.id, adminUser);
    
    // Create a default company for testing/demo purposes
    const defaultCompany: Company = {
      id: 1,
      userId: 1,
      name: "Example Business",
      sector: "Technology",
      location: "United States",
      yearsInBusiness: "5-10",
      goal: "Selling the business",
      createdAt: new Date()
    };
    this.companies.set(defaultCompany.id, defaultCompany);
    
    // Create default valuation data
    const defaultValuation: Valuation = {
      id: 1,
      companyId: 1,
      valuationMin: 950000,
      valuationMedian: 1200000,
      valuationMax: 1450000,
      ebitdaMultiple: 5.2,
      discountedCashFlow: 1250000,
      revenueMultiple: 2.1,
      assetBased: 980000,
      riskScore: 65,
      financialHealthScore: 70,
      marketPositionScore: 65,
      operationalEfficiencyScore: 60,
      debtStructureScore: 75,
      redFlags: ["Inconsistent revenue growth", "Limited customer diversification"],
      createdAt: new Date()
    };
    this.valuations.set(defaultValuation.id, defaultValuation);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      role: insertUser.role || "user" // Default to "user" if role is not provided
    };
    this.users.set(id, user);
    return user;
  }
  
  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }
  
  async getCompaniesByUserId(userId: number): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(
      (company) => company.userId === userId,
    );
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentCompanyId++;
    const now = new Date();
    const company: Company = { ...insertCompany, id, createdAt: now };
    this.companies.set(id, company);
    return company;
  }
  
  // Financial methods
  async getFinancial(id: number): Promise<Financial | undefined> {
    return this.financials.get(id);
  }
  
  async getFinancialByCompanyId(companyId: number): Promise<Financial | undefined> {
    return Array.from(this.financials.values()).find(
      (financial) => financial.companyId === companyId,
    );
  }
  
  async createFinancial(insertFinancial: InsertFinancial): Promise<Financial> {
    const id = this.currentFinancialId++;
    const now = new Date();
    const financial: Financial = { ...insertFinancial, id, createdAt: now };
    this.financials.set(id, financial);
    return financial;
  }
  
  // Employee methods
  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }
  
  async getEmployeeByCompanyId(companyId: number): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.companyId === companyId,
    );
  }
  
  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = this.currentEmployeeId++;
    const now = new Date();
    const employee: Employee = { ...insertEmployee, id, createdAt: now };
    this.employees.set(id, employee);
    return employee;
  }
  
  // Document methods
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocumentsByCompanyId(companyId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.companyId === companyId,
    );
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const now = new Date();
    const document: Document = { ...insertDocument, id, uploadedAt: now };
    this.documents.set(id, document);
    return document;
  }
  
  // Technology methods
  async getTechnology(id: number): Promise<Technology | undefined> {
    return this.technologies.get(id);
  }
  
  async getTechnologyByCompanyId(companyId: number): Promise<Technology | undefined> {
    return Array.from(this.technologies.values()).find(
      (technology) => technology.companyId === companyId,
    );
  }
  
  async createTechnology(insertTechnology: InsertTechnology): Promise<Technology> {
    const id = this.currentTechnologyId++;
    const now = new Date();
    const technology: Technology = { ...insertTechnology, id, createdAt: now };
    this.technologies.set(id, technology);
    return technology;
  }
  
  // Owner Intent methods
  async getOwnerIntent(id: number): Promise<OwnerIntent | undefined> {
    return this.ownerIntents.get(id);
  }
  
  async getOwnerIntentByCompanyId(companyId: number): Promise<OwnerIntent | undefined> {
    return Array.from(this.ownerIntents.values()).find(
      (ownerIntent) => ownerIntent.companyId === companyId,
    );
  }
  
  async createOwnerIntent(insertOwnerIntent: InsertOwnerIntent): Promise<OwnerIntent> {
    const id = this.currentOwnerIntentId++;
    const now = new Date();
    const ownerIntent: OwnerIntent = { ...insertOwnerIntent, id, createdAt: now };
    this.ownerIntents.set(id, ownerIntent);
    return ownerIntent;
  }
  
  // Valuation methods
  async getValuation(id: number): Promise<Valuation | undefined> {
    return this.valuations.get(id);
  }
  
  async getValuationByCompanyId(companyId: number): Promise<Valuation | undefined> {
    return Array.from(this.valuations.values()).find(
      (valuation) => valuation.companyId === companyId,
    );
  }
  
  async createValuation(insertValuation: InsertValuation): Promise<Valuation> {
    const id = this.currentValuationId++;
    const now = new Date();
    const valuation: Valuation = { ...insertValuation, id, createdAt: now };
    this.valuations.set(id, valuation);
    return valuation;
  }
  
  // Recommendation methods
  async getRecommendation(id: number): Promise<Recommendation | undefined> {
    return this.recommendations.get(id);
  }
  
  async getRecommendationsByCompanyId(companyId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      (recommendation) => recommendation.companyId === companyId,
    );
  }
  
  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.currentRecommendationId++;
    const now = new Date();
    const recommendation: Recommendation = { ...insertRecommendation, id, createdAt: now };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }
  
  // Buyer Match methods
  async getBuyerMatch(id: number): Promise<BuyerMatch | undefined> {
    return this.buyerMatches.get(id);
  }
  
  async getBuyerMatchesByCompanyId(companyId: number): Promise<BuyerMatch[]> {
    return Array.from(this.buyerMatches.values()).filter(
      (buyerMatch) => buyerMatch.companyId === companyId,
    );
  }
  
  async createBuyerMatch(insertBuyerMatch: InsertBuyerMatch): Promise<BuyerMatch> {
    const id = this.currentBuyerMatchId++;
    const now = new Date();
    const buyerMatch: BuyerMatch = { ...insertBuyerMatch, id, createdAt: now };
    this.buyerMatches.set(id, buyerMatch);
    return buyerMatch;
  }
}

import { PgStorage } from './pg-storage';

// Use the PostgreSQL storage if we have a database connection, otherwise fallback to in-memory
import { dbConnectionSuccessful } from './database';

// Use PostgreSQL storage if the connection was successful, otherwise use in-memory storage
export const storage = dbConnectionSuccessful ? new PgStorage() : new MemStorage();

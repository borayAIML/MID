import { eq } from 'drizzle-orm';
import { db } from './database';
import { IStorage } from './storage';
import {
  users, companies, financials, employees, documents, technology, ownerIntent, valuations, recommendations, buyerMatches,
  User, InsertUser, Company, InsertCompany, Financial, InsertFinancial,
  Employee, InsertEmployee, Document, InsertDocument, Technology, InsertTechnology,
  OwnerIntent, InsertOwnerIntent, Valuation, InsertValuation,
  Recommendation, InsertRecommendation, BuyerMatch, InsertBuyerMatch
} from '@shared/schema';

/**
 * Helper function to sanitize array values before database insertion
 * This ensures all array fields are actually arrays before insertion into PostgreSQL
 */
function sanitizeArrays<T>(data: T): T {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const result = { ...data as any };
  
  // List of known array fields in our schema
  const arrayFields = [
    'digitalSystems', 'technologiesUsed', 'redFlags', 
    'suggestions', 'tags'
  ];
  
  // Convert each field to an array if it exists in the data
  for (const field of arrayFields) {
    if (field in result) {
      result[field] = Array.isArray(result[field]) ? result[field] : [];
    }
  }
  
  return result as T;
}

export class PgStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    const results = await db.select().from(companies).where(eq(companies.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getCompaniesByUserId(userId: number): Promise<Company[]> {
    return await db.select().from(companies).where(eq(companies.userId, userId));
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const result = await db.insert(companies).values(company).returning();
    return result[0];
  }

  // Financial methods
  async getFinancial(id: number): Promise<Financial | undefined> {
    const results = await db.select().from(financials).where(eq(financials.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getFinancialByCompanyId(companyId: number): Promise<Financial | undefined> {
    const results = await db.select().from(financials).where(eq(financials.companyId, companyId));
    return results.length > 0 ? results[0] : undefined;
  }

  async createFinancial(financial: InsertFinancial): Promise<Financial> {
    const result = await db.insert(financials).values(financial).returning();
    return result[0];
  }

  // Employee methods
  async getEmployee(id: number): Promise<Employee | undefined> {
    const results = await db.select().from(employees).where(eq(employees.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getEmployeeByCompanyId(companyId: number): Promise<Employee | undefined> {
    const results = await db.select().from(employees).where(eq(employees.companyId, companyId));
    return results.length > 0 ? results[0] : undefined;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const sanitizedData = sanitizeArrays(employee);
    const result = await db.insert(employees).values(sanitizedData as any).returning();
    return result[0];
  }

  // Document methods
  async getDocument(id: number): Promise<Document | undefined> {
    const results = await db.select().from(documents).where(eq(documents.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getDocumentsByCompanyId(companyId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.companyId, companyId));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const result = await db.insert(documents).values(document).returning();
    return result[0];
  }

  // Technology methods
  async getTechnology(id: number): Promise<Technology | undefined> {
    const results = await db.select().from(technology).where(eq(technology.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getTechnologyByCompanyId(companyId: number): Promise<Technology | undefined> {
    const results = await db.select().from(technology).where(eq(technology.companyId, companyId));
    return results.length > 0 ? results[0] : undefined;
  }

  async createTechnology(tech: InsertTechnology): Promise<Technology> {
    const sanitizedData = sanitizeArrays(tech);
    const result = await db.insert(technology).values(sanitizedData as any).returning();
    return result[0];
  }

  // Owner Intent methods
  async getOwnerIntent(id: number): Promise<OwnerIntent | undefined> {
    const results = await db.select().from(ownerIntent).where(eq(ownerIntent.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getOwnerIntentByCompanyId(companyId: number): Promise<OwnerIntent | undefined> {
    const results = await db.select().from(ownerIntent).where(eq(ownerIntent.companyId, companyId));
    return results.length > 0 ? results[0] : undefined;
  }

  async createOwnerIntent(intent: InsertOwnerIntent): Promise<OwnerIntent> {
    const result = await db.insert(ownerIntent).values(intent).returning();
    return result[0];
  }

  // Valuation methods
  async getValuation(id: number): Promise<Valuation | undefined> {
    const results = await db.select().from(valuations).where(eq(valuations.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getValuationByCompanyId(companyId: number): Promise<Valuation | undefined> {
    const results = await db.select().from(valuations).where(eq(valuations.companyId, companyId));
    return results.length > 0 ? results[0] : undefined;
  }

  async createValuation(valuation: InsertValuation): Promise<Valuation> {
    const sanitizedData = sanitizeArrays(valuation);
    const result = await db.insert(valuations).values(sanitizedData as any).returning();
    return result[0];
  }

  // Recommendation methods
  async getRecommendation(id: number): Promise<Recommendation | undefined> {
    const results = await db.select().from(recommendations).where(eq(recommendations.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getRecommendationsByCompanyId(companyId: number): Promise<Recommendation[]> {
    return await db.select().from(recommendations).where(eq(recommendations.companyId, companyId));
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const sanitizedData = sanitizeArrays(recommendation);
    const result = await db.insert(recommendations).values(sanitizedData as any).returning();
    return result[0];
  }

  // Buyer Match methods
  async getBuyerMatch(id: number): Promise<BuyerMatch | undefined> {
    const results = await db.select().from(buyerMatches).where(eq(buyerMatches.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getBuyerMatchesByCompanyId(companyId: number): Promise<BuyerMatch[]> {
    return await db.select().from(buyerMatches).where(eq(buyerMatches.companyId, companyId));
  }

  async createBuyerMatch(buyerMatch: InsertBuyerMatch): Promise<BuyerMatch> {
    const sanitizedData = sanitizeArrays(buyerMatch);
    const result = await db.insert(buyerMatches).values(sanitizedData as any).returning();
    return result[0];
  }
}
import { z } from "zod";

// Onboarding form validation schema
export const onboardingFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  companyName: z.string().min(1, "Company name is required"),
  sector: z.string().min(1, "Please select a sector"),
  location: z.string().min(1, "Location is required"),
  yearsInBusiness: z.string().min(1, "Please select years in business"),
  goal: z.string().min(1, "Please select your primary goal"),
});

// Financial information validation schema
export const financialInfoSchema = z.object({
  revenueCurrent: z.string().optional().transform(val => val ? parseFloat(val) : null),
  revenuePrevious: z.string().optional().transform(val => val ? parseFloat(val) : null),
  revenueTwoYearsAgo: z.string().optional().transform(val => val ? parseFloat(val) : null),
  ebitda: z.string().optional().transform(val => val ? parseFloat(val) : null),
  netMargin: z.string().optional().transform(val => val ? parseFloat(val) : null),
});

// Employee and systems validation schema
export const employeeSystemsSchema = z.object({
  employeeCount: z.string().optional().transform(val => val ? parseInt(val) : null),
  digitalSystems: z.array(z.string()),
  otherSystemText: z.string().optional(),
});

// Technology usage validation schema
export const technologyUsageSchema = z.object({
  transformationLevel: z.number().min(1).max(5),
  technologiesUsed: z.array(z.string()),
  techInvestmentPercentage: z.string().optional().transform(val => val ? parseFloat(val) : null),
});

// Owner intent validation schema
export const ownerIntentSchema = z.object({
  intent: z.string().min(1, "Please select your primary intention"),
  exitTimeline: z.string().min(1, "Please select your timeline"),
  idealOutcome: z.string().optional(),
  valuationExpectations: z.string().optional().transform(val => val ? parseFloat(val) : null),
});

// Valuation range type
export type ValuationRange = {
  min: number;
  median: number;
  max: number;
};

// Risk score type
export type RiskScore = {
  overall: number;
  financialHealth: number;
  marketPosition: number;
  operationalEfficiency: number;
  debtStructure: number;
};

// Document upload type
export type DocumentUploadData = {
  financialStatements: File | null;
  taxDocuments: File | null;
  contracts: File | null;
};

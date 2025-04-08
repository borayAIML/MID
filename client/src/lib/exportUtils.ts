import { saveAs } from 'file-saver';
import { Company, Valuation } from '@shared/schema';

/**
 * Formats company and valuation data into a CSV string
 */
export function formatDataAsCSV(company: Company, valuation: Valuation): string {
  // Create header row
  const headers = [
    'Company Name',
    'Sector',
    'Location',
    'Years in Business',
    'Valuation (Min)',
    'Valuation (Median)',
    'Valuation (Max)',
    'EBITDA Multiple',
    'Discounted Cash Flow',
    'Revenue Multiple',
    'Asset Based',
    'Risk Score'
  ];
  
  // Create data row
  const data = [
    company.name,
    company.sector,
    company.location,
    company.yearsInBusiness,
    valuation.valuationMin,
    valuation.valuationMedian,
    valuation.valuationMax,
    valuation.ebitdaMultiple,
    valuation.discountedCashFlow,
    valuation.revenueMultiple,
    valuation.assetBased,
    valuation.riskScore
  ];
  
  // Join headers and data into CSV string
  return headers.join(',') + '\n' + data.join(',');
}

/**
 * Formats company and valuation data into JSON
 */
export function formatDataAsJSON(company: Company, valuation: Valuation): string {
  const exportData = {
    company: {
      name: company.name,
      sector: company.sector,
      location: company.location,
      yearsInBusiness: company.yearsInBusiness,
      goal: company.goal
    },
    valuation: {
      min: valuation.valuationMin,
      median: valuation.valuationMedian,
      max: valuation.valuationMax,
      ebitdaMultiple: valuation.ebitdaMultiple,
      discountedCashFlow: valuation.discountedCashFlow,
      revenueMultiple: valuation.revenueMultiple,
      assetBased: valuation.assetBased,
      riskScore: valuation.riskScore,
      financialHealthScore: valuation.financialHealthScore,
      marketPositionScore: valuation.marketPositionScore,
      operationalEfficiencyScore: valuation.operationalEfficiencyScore,
      debtStructureScore: valuation.debtStructureScore
    }
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Exports company and valuation data as CSV
 */
export function exportAsCSV(company: Company, valuation: Valuation): void {
  const csvData = formatDataAsCSV(company, valuation);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${company.name.replace(/\s+/g, '_')}_valuation_data.csv`);
}

/**
 * Exports company and valuation data as JSON
 */
export function exportAsJSON(company: Company, valuation: Valuation): void {
  const jsonData = formatDataAsJSON(company, valuation);
  const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `${company.name.replace(/\s+/g, '_')}_valuation_data.json`);
}

/**
 * Exports company and valuation data as PDF (actually HTML styled as PDF)
 */
export async function exportAsPDF(company: Company, valuation: Valuation): Promise<void> {
  // Import the PDF generator dynamically to avoid unnecessarily loading it
  const { generatePdf } = await import('./pdfGenerator');
  await generatePdf(company, valuation);
}
import { saveAs } from 'file-saver';
import { Company, Valuation } from '@shared/schema';

/**
 * Generates a PDF representation of company valuation data
 * In a real application, this would use a proper PDF generation library
 * For this example, we'll create a stylized HTML string and convert it to a Blob
 */
export async function generatePdf(company: Company, valuation: Valuation): Promise<void> {
  // Create a styled HTML representation of the report
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Valuation Report - ${company.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 2px solid #4f46e5;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #4f46e5;
          margin: 0;
        }
        .subtitle {
          font-size: 16px;
          color: #666;
          margin: 5px 0 0;
        }
        .date {
          font-size: 12px;
          color: #888;
          margin: 5px 0 0;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #4f46e5;
        }
        .company-info {
          display: flex;
          flex-wrap: wrap;
        }
        .info-item {
          width: 50%;
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: bold;
          margin-right: 5px;
        }
        .valuation-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .valuation-table th {
          background-color: #f3f4f6;
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .valuation-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .risk-section {
          margin-top: 20px;
        }
        .risk-score {
          font-size: 16px;
          font-weight: bold;
        }
        .risk-details {
          display: flex;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .risk-item {
          width: 50%;
          margin-bottom: 10px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #888;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">Business Valuation Report</h1>
        <p class="subtitle">${company.name}</p>
        <p class="date">Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="section">
        <h2 class="section-title">Company Information</h2>
        <div class="company-info">
          <div class="info-item">
            <span class="info-label">Name:</span>
            <span>${company.name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Sector:</span>
            <span>${company.sector}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Location:</span>
            <span>${company.location}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Years in Business:</span>
            <span>${company.yearsInBusiness}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Business Goal:</span>
            <span>${company.goal}</span>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">Valuation Overview</h2>
        <table class="valuation-table">
          <tr>
            <th>Valuation Range</th>
            <td>$${Number(valuation.valuationMin).toLocaleString()} - $${Number(valuation.valuationMax).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Median Valuation</th>
            <td>$${Number(valuation.valuationMedian).toLocaleString()}</td>
          </tr>
          <tr>
            <th>EBITDA Multiple</th>
            <td>${valuation.ebitdaMultiple}x</td>
          </tr>
          <tr>
            <th>Discounted Cash Flow</th>
            <td>$${Number(valuation.discountedCashFlow).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Revenue Multiple</th>
            <td>${valuation.revenueMultiple}x</td>
          </tr>
          <tr>
            <th>Asset Based</th>
            <td>$${Number(valuation.assetBased).toLocaleString()}</td>
          </tr>
        </table>
      </div>
      
      <div class="section risk-section">
        <h2 class="section-title">Risk Assessment</h2>
        <div class="risk-score">
          Overall Risk Score: ${valuation.riskScore}/100
        </div>
        <div class="risk-details">
          <div class="risk-item">
            <span class="info-label">Financial Health:</span>
            <span>${valuation.financialHealthScore}/100</span>
          </div>
          <div class="risk-item">
            <span class="info-label">Market Position:</span>
            <span>${valuation.marketPositionScore}/100</span>
          </div>
          <div class="risk-item">
            <span class="info-label">Operational Efficiency:</span>
            <span>${valuation.operationalEfficiencyScore}/100</span>
          </div>
          <div class="risk-item">
            <span class="info-label">Debt Structure:</span>
            <span>${valuation.debtStructureScore}/100</span>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>This report is confidential and generated by Bizmeasure Valuation Platform. The information in this report is based on the data provided and may not reflect the actual market value. This report should not be used as the sole basis for any financial decision.</p>
      </div>
    </body>
    </html>
  `;

  // Convert the HTML string to a Blob
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${company.name.replace(/\s+/g, '_')}_valuation_report.html`);
}
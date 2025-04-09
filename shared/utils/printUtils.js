// Utility functions for printing documents
import { fetchWithTokenRefresh } from './auth';

// Global company info cache
let companyInfoCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches company information from the API
 * @returns {Promise<Object>} Company information
 */
export const getCompanyInfo = async () => {
  // Use cached info if it exists and is recent
  const now = Date.now();
  if (companyInfoCache && (now - lastFetchTime < CACHE_DURATION)) {
    return companyInfoCache;
  }

  try {
    const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/companies`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        // Use the first company in the list
        const company = data[0];
        companyInfoCache = {
          name: company.name || 'Your Company Name',
          address: company.address || 'Company Address',
          phone: company.phone || 'Phone Number',
          registration: company.registration_number || '',
          logo_url: company.logo_url || ''
        };
        lastFetchTime = now;
        return companyInfoCache;
      }
    }
    
    console.error('Failed to fetch company info');
    return getDefaultCompanyInfo();
  } catch (error) {
    console.error('Error fetching company info:', error);
    return getDefaultCompanyInfo();
  }
};

/**
 * Returns default company info when API call fails
 * @returns {Object} Default company information
 */
const getDefaultCompanyInfo = () => {
  return {
    name: 'Godere Hobby Shop',
    address: 'Jalan Nangka, Taman Gemilang Jaya, 14000, Bukit Mertajam, Pulau Pinang',
    phone: '018-9495988',
    registration: '003007191-X',
    logo_url: ''
  };
};

/**
 * Formats currency with proper symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (e.g., CNY, USD, MYR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'CNY'
  }).format(amount);
};

/**
 * Formats date in a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Generates and opens a printable sales order
 * @param {Object} order - The sales order object to print
 * @param {Function} formatCurrencyFn - Currency formatting function if custom one is needed
 * @param {Function} formatDateFn - Date formatting function if custom one is needed
 */
export const printSalesOrder = async (order, formatCurrencyFn, formatDateFn) => {
  // Use provided format functions or defaults
  const formatCurrencyValue = formatCurrencyFn || formatCurrency;
  const formatDateValue = formatDateFn || formatDate;
  
  // Get company info
  const companyInfo = await getCompanyInfo();
  const registrationText = companyInfo.registration ? ` (${companyInfo.registration})` : '';
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sales Order: ${order.order_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .order-number {
          text-align: center;
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 20px;
          padding: 10px;
          border: 2px solid #333;
          background-color: #f8f8f8;
        }
        .company-info {
          text-align: center;
          margin-bottom: 20px;
          font-size: 1em;
        }
        .logo-container {
          text-align: center;
          margin-bottom: 10px;
        }
        .logo {
          max-width: 200px;
          max-height: 100px;
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .order-info div {
          flex: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .total {
          text-align: right;
          font-weight: bold;
          margin-top: 20px;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .bank-info {
          margin-top: 20px;
          border: 1px solid #ddd;
          padding: 15px;
          background-color: #f9f9f9;
        }
        .bank-info h3 {
          margin-top: 0;
          font-size: 1.1em;
        }
        .remarks {
          margin-top: 30px;
          border: 1px solid #ddd;
          padding: 15px;
          background-color: #f9f9f9;
        }
        .remarks h3 {
          margin-top: 0;
          font-size: 1.1em;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 8px;
          margin-bottom: 10px;
        }
        .remark-content {
          white-space: pre-wrap;
          font-size: 1em;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="order-number">
        SALES ORDER: ${order.order_number}
      </div>
      
      ${companyInfo.logo_url ? `
        <div class="logo-container">
          <img src="${companyInfo.logo_url}" alt="${companyInfo.name}" class="logo">
        </div>
      ` : ''}
      
      <div class="company-info">
        <h2>${companyInfo.name}${registrationText}</h2>
        <p>${companyInfo.address.replace(/,/g, ',<br>')}<br>
        ${companyInfo.phone ? `Phone: ${companyInfo.phone}` : ''}</p>
      </div>
      
      <div class="order-info">
        <div>
          <p><strong>Customer:</strong> ${order.customer?.name || 'N/A'}</p>
          <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${order.customer?.email || 'N/A'}</p>
          <p><strong>Address:</strong> ${order.customer?.address || 'N/A'}</p>
        </div>
        <div>
          <p><strong>Order Date:</strong> ${formatDateValue(order.order_date)}</p>
          <p><strong>Expected Delivery:</strong> ${formatDateValue(order.expected_delivery_date)}</p>
          <p><strong>Status:</strong> ${order.status || 'N/A'}</p>
          <p><strong>Payment Status:</strong> ${order.payment_status || 'N/A'}</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items && order.items.map(item => `
            <tr>
              <td>${item.product?.name || item['all-product']?.name || 'Unknown Product'}</td>
              <td>${item.quantity}</td>
              <td>${formatCurrencyValue(item.unit_price, order.currency)}</td>
              <td>${formatCurrencyValue(item.line_total, order.currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="total">
        <p>Total Amount: ${formatCurrencyValue(order.total_amount, order.currency)}</p>
      </div>
      
      ${order.remark ? `
        <div class="remarks">
          <h3>Remarks</h3>
          <div class="remark-content">
            ${order.remark}
          </div>
        </div>
      ` : ''}
      
      <div class="bank-info">
        <h3>Payment Information</h3>
        <p><strong>Account 1:</strong> 7311256500 OCBC Bank Godere Hobby Shop</p>
        <p><strong>Account 2:</strong> 22600043063 Hong Leong Bank Godere Hobby Shop</p>
      </div>
      
      <div class="footer">
        <p style="text-align: center;">Thank you for your business!</p>
        <p style="text-align: center;">This document was generated on ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for content to load before printing
  printWindow.onload = function() {
    printWindow.print();
    // Don't close window automatically to allow user to see print preview
  };
};

/**
 * Generates and opens a printable invoice
 * @param {Object} invoice - The invoice object to print
 * @param {Function} formatCurrencyFn - Currency formatting function if custom one is needed
 * @param {Function} formatDateFn - Date formatting function if custom one is needed
 */
export const printInvoice = async (invoice, formatCurrencyFn, formatDateFn) => {
  // Use provided format functions or defaults
  const formatCurrencyValue = formatCurrencyFn || formatCurrency;
  const formatDateValue = formatDateFn || formatDate;
  
  // Get company info
  const companyInfo = await getCompanyInfo();
  const registrationText = companyInfo.registration ? ` (${companyInfo.registration})` : '';
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice: ${invoice.invoice_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .invoice-number {
          text-align: center;
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 20px;
          padding: 10px;
          border: 2px solid #333;
          background-color: #f8f8f8;
        }
        .company-info {
          text-align: center;
          margin-bottom: 20px;
          font-size: 1em;
        }
        .logo-container {
          text-align: center;
          margin-bottom: 10px;
        }
        .logo {
          max-width: 200px;
          max-height: 100px;
        }
        .invoice-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .invoice-info div {
          flex: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .total {
          text-align: right;
          font-weight: bold;
          margin-top: 20px;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .bank-info {
          margin-top: 20px;
          border: 1px solid #ddd;
          padding: 15px;
          background-color: #f9f9f9;
        }
        .bank-info h3 {
          margin-top: 0;
          font-size: 1.1em;
        }
        .remarks {
          margin-top: 30px;
          border: 1px solid #ddd;
          padding: 15px;
          background-color: #f9f9f9;
        }
        .remarks h3 {
          margin-top: 0;
          font-size: 1.1em;
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 8px;
          margin-bottom: 10px;
        }
        .remark-content {
          white-space: pre-wrap;
          font-size: 1em;
        }
        .payment-terms {
          margin-top: 20px;
          font-style: italic;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-number">
        INVOICE: ${invoice.invoice_number}
      </div>
      
      ${companyInfo.logo_url ? `
        <div class="logo-container">
          <img src="${companyInfo.logo_url}" alt="${companyInfo.name}" class="logo">
        </div>
      ` : ''}
      
      <div class="company-info">
        <h2>${companyInfo.name}${registrationText}</h2>
        <p>${companyInfo.address.replace(/,/g, ',<br>')}<br>
        ${companyInfo.phone ? `Phone: ${companyInfo.phone}` : ''}</p>
      </div>
      
      <div class="invoice-info">
        <div>
          <p><strong>Customer:</strong> ${invoice.customer?.name || 'N/A'}</p>
          <p><strong>Phone:</strong> ${invoice.customer?.phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${invoice.customer?.email || 'N/A'}</p>
          <p><strong>Address:</strong> ${invoice.customer?.address || 'N/A'}</p>
        </div>
        <div>
          <p><strong>Invoice Date:</strong> ${formatDateValue(invoice.issue_date || invoice.invoice_date)}</p>
          <p><strong>Due Date:</strong> ${formatDateValue(invoice.due_date)}</p>
          <p><strong>Status:</strong> ${invoice.status || 'N/A'}</p>
          <p><strong>Payment Status:</strong> ${invoice.payment_status || 'N/A'}</p>
          ${invoice.sales_order_number ? `<p><strong>Sales Order:</strong> ${invoice.sales_order_number}</p>` : ''}
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items && invoice.items.map(item => `
            <tr>
              <td>${item.product?.name || item['all-product']?.name || 'Unknown Product'}</td>
              <td>${item.quantity}</td>
              <td>${formatCurrencyValue(item.unit_price, invoice.currency)}</td>
              <td>${formatCurrencyValue(item.line_total, invoice.currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="total">
        <p>Subtotal: ${formatCurrencyValue(invoice.total_amount, invoice.currency)}</p>
        ${invoice.tax_amount ? `<p>Tax: ${formatCurrencyValue(invoice.tax_amount, invoice.currency)}</p>` : ''}
        ${invoice.discount_amount ? `<p>Discount: ${formatCurrencyValue(-invoice.discount_amount, invoice.currency)}</p>` : ''}
        <p style="font-size: 1.2em; margin-top: 10px;">
          <strong>Total: ${formatCurrencyValue(
            (parseFloat(invoice.total_amount) + 
            (parseFloat(invoice.tax_amount) || 0) - 
            (parseFloat(invoice.discount_amount) || 0)),
            invoice.currency
          )}</strong>
        </p>
      </div>
      
      <div class="payment-terms">
        <p><strong>Payment Terms:</strong> ${invoice.payment_terms || 'Due on receipt'}</p>
      </div>
      
      ${invoice.remark ? `
        <div class="remarks">
          <h3>Remarks</h3>
          <div class="remark-content">
            ${invoice.remark}
          </div>
        </div>
      ` : ''}
      
      <div class="bank-info">
        <h3>Payment Information</h3>
        <p><strong>Account 1:</strong> 7311256500 OCBC Bank Godere Hobby Shop</p>
        <p><strong>Account 2:</strong> 22600043063 Hong Leong Bank Godere Hobby Shop</p>
      </div>
      
      <div class="footer">
        <p style="text-align: center;">Thank you for your business!</p>
        <p style="text-align: center;">This document was generated on ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for content to load before printing
  printWindow.onload = function() {
    printWindow.print();
    // Don't close window automatically to allow user to see print preview
  };
}; 
// Utility functions for printing documents

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
export const printSalesOrder = (order, formatCurrencyFn, formatDateFn) => {
  // Use provided format functions or defaults
  const formatCurrencyValue = formatCurrencyFn || formatCurrency;
  const formatDateValue = formatDateFn || formatDate;

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
      
      <div class="company-info">
        <h2>Godere Hobby Shop (003007191-X)</h2>
        <p>Jalan Nangka, Taman Gemilang Jaya,<br>
        14000, Bukit Mertajam, Pulau Pinang<br>
        Phone: 018-9495988</p>
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
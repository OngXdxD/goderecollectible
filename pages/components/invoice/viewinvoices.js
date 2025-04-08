import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Row, Col, Table, Button, Form, Alert, Modal, Badge } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import { formatCurrency, formatDate } from '../../../shared/utils/printUtils';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import PaymentModal from '../../../shared/components/PaymentModal';

const ViewInvoices = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/invoices`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (invoiceId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(invoiceId)) {
      newExpandedRows.delete(invoiceId);
    } else {
      newExpandedRows.add(invoiceId);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'info';
      case 'paid':
        return 'success';
      case 'overdue':
        return 'danger';
      case 'cancelled':
        return 'dark';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'partial':
        return 'info';
      case 'refunded':
        return 'danger';
      case 'cancelled':
        return 'dark';
      default:
        return 'secondary';
    }
  };

  const handlePayment = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || invoice.payment_status === filterPaymentStatus;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  return (
    <>
      <Seo title="View Invoices" />
      <div>
        <Pageheader title="VIEW INVOICES" heading="Invoice" active="View Invoices" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex gap-3 align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Search by invoice number or customer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: '300px' }}
                    />
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{ width: '150px' }}
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                    <Form.Select
                      value={filterPaymentStatus}
                      onChange={(e) => setFilterPaymentStatus(e.target.value)}
                      style={{ width: '150px' }}
                    >
                      <option value="all">All Payment Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="partial">Partial</option>
                      <option value="refunded">Refunded</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/components/invoice/createinvoice')}
                  >
                    Create Invoice
                  </Button>
                </div>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Invoice Number</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Payment Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          No invoices found
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map(invoice => (
                        <React.Fragment key={invoice.id}>
                          <tr>
                            <td>
                              <Button
                                variant="link"
                                onClick={() => toggleRow(invoice.id)}
                                className="p-0"
                              >
                                {expandedRows.has(invoice.id) ? '▼' : '▶'}
                              </Button>
                            </td>
                            <td>{invoice.invoice_number}</td>
                            <td>{formatDate(invoice.issue_date)}</td>
                            <td>{invoice.customer?.name}</td>
                            <td>{formatCurrency(invoice.total_amount, invoice.currency)}</td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getPaymentStatusBadgeVariant(invoice.payment_status)}>
                                {invoice.payment_status}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {invoice.payment_status !== 'paid' && (
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handlePayment(invoice)}
                                  >
                                    Add Payment
                                  </Button>
                                )}
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={() => router.push(`/components/invoice/${invoice.id}`)}
                                >
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {expandedRows.has(invoice.id) && (
                            <tr>
                              <td colSpan="8">
                                <Table responsive size="sm" className="mb-0">
                                  <thead>
                                    <tr>
                                      <th>Product</th>
                                      <th>Quantity</th>
                                      <th>Unit Price</th>
                                      <th>Line Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {invoice.items.map(item => (
                                      <tr key={item.id}>
                                        <td>{item.product?.name || 'Unknown Product'}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatCurrency(item.unit_price, invoice.currency)}</td>
                                        <td>{formatCurrency(item.line_total, invoice.currency)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <PaymentModal
          show={showPaymentModal}
          onHide={() => {
            setShowPaymentModal(false);
            fetchInvoices(); // Refresh the list
          }}
          order={{ ...selectedInvoice, type: 'invoice' }}
          onSuccess={() => {
            setShowPaymentModal(false);
            fetchInvoices(); // Refresh the list
          }}
          onError={(error) => {
            setError(error);
            setShowPaymentModal(false);
          }}
        />
      </div>
    </>
  );
};

ViewInvoices.layout = "Contentlayout";

export default ViewInvoices; 
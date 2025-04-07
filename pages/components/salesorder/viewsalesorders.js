import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Row, Col, Table, Button, Form, Alert, Badge, Modal } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import Link from 'next/link';
import PaymentModal from '../../../shared/components/PaymentModal';

const ViewSalesOrders = () => {
  const router = useRouter();
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('order_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Fetch sales orders
  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/sales-orders`);
      
      if (response.status === 401) {
        setError('Authentication error: Please log in to view sales orders');
        return;
      }
      
      if (!response.ok) throw new Error(`Failed to fetch sales orders: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      setSalesOrders(data);
    } catch (err) {
      setError('Failed to load sales orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Toggle row expansion
  const toggleRow = (orderId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Filter and sort sales orders
  const filteredAndSortedOrders = salesOrders
    .filter(order => {
      const matchesSearch = 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'secondary';
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Get payment status badge variant
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
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'CNY'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = (order) => {
    router.push(`/components/salesorder/${order.id}`);
  };

  const handlePayment = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sales order?')) {
      try {
        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/sales-orders/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchSalesOrders(); // Refresh the list
        } else {
          setError('Failed to delete sales order');
        }
      } catch (err) {
        setError('Error deleting sales order');
      }
    }
  };

  return (
    <>
      <Seo title="View Sales Orders" />
      <div>
        <Pageheader title="VIEW SALES ORDERS" heading="Sales Orders" active="View Sales Orders" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex gap-3 align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Search by order number or customer..."
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
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </div>
                  <Link href="/components/salesorder/createsalesorder">
                    <Button variant="primary" className="d-flex align-items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        className="bi bi-plus-circle me-1" 
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>
                      New Sales Order
                    </Button>
                  </Link>
                </div>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th></th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('order_number')}
                      >
                        Order Number
                        {sortField === 'order_number' && (
                          <span className="ms-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('order_date')}
                      >
                        Order Date
                        {sortField === 'order_date' && (
                          <span className="ms-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th>Customer</th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('total_amount')}
                      >
                        Total Amount
                        {sortField === 'total_amount' && (
                          <span className="ms-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th>Expected Delivery</th>
                      <th>Status</th>
                      <th>Payment Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredAndSortedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          No sales orders found
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedOrders.map(order => (
                        <React.Fragment key={order.id}>
                          <tr>
                            <td>
                              <Button
                                variant="link"
                                onClick={() => toggleRow(order.id)}
                                className="p-0"
                              >
                                {expandedRows.has(order.id) ? '▼' : '▶'}
                              </Button>
                            </td>
                            <td>{order.order_number}</td>
                            <td>{formatDate(order.order_date)}</td>
                            <td>{order.customer?.name}</td>
                            <td>{formatCurrency(order.total_amount, order.currency)}</td>
                            <td>{formatDate(order.expected_delivery_date)}</td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(order.status)}>
                                {order.status || 'Unknown'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getPaymentStatusBadgeVariant(order.payment_status)}>
                                {order.payment_status || 'Unknown'}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handlePayment(order)}
                                >
                                  Pay
                                </Button>
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleEdit(order)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(order.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {expandedRows.has(order.id) && (
                            <tr>
                              <td colSpan="9">
                                <Table responsive size="sm" className="mb-0">
                                  <thead>
                                    <tr>
                                      <th>Product Name</th>
                                      <th>Quantity</th>
                                      <th>Unit Price</th>
                                      <th>Line Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items && order.items.map(item => (
                                      <tr key={item.id}>
                                        <td>{item.product?.name || item['all-product']?.name || 'Unknown Product'}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatCurrency(item.unit_price, order.currency)}</td>
                                        <td>{formatCurrency(item.line_total, order.currency)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  {order.remark && (
                                    <tfoot>
                                      <tr>
                                        <td colSpan="4">
                                          <strong>Remarks:</strong> {order.remark}
                                        </td>
                                      </tr>
                                    </tfoot>
                                  )}
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
          onHide={() => setShowPaymentModal(false)}
          order={selectedOrder}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedOrder(null);
            fetchSalesOrders(); // Refresh the list
          }}
          onError={(error) => setError(error)}
        />
      </div>
    </>
  );
};

ViewSalesOrders.layout = "Contentlayout";

export default ViewSalesOrders; 
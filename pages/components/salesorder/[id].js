import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Row, Col, Button, Form, Alert, Badge, Spinner, Table } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import { printSalesOrder, formatCurrency, formatDate } from '../../../shared/utils/printUtils';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import PaymentModal from '../../../shared/components/PaymentModal';

const SalesOrderDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch sales order data
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/sales-orders/${id}`);
        
        if (response.status === 401) {
          setError('Authentication error: Please log in to view this order');
          return;
        }
        
        if (!response.ok) throw new Error(`Failed to fetch order: ${response.status} ${response.statusText}`);
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError('Failed to load order: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Handle print
  const handlePrint = () => {
    if (order) {
      printSalesOrder(order, formatCurrency, formatDate);
    }
  };

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

  return (
    <>
      <Seo title={order ? `Sales Order ${order.order_number}` : 'Sales Order Details'} />
      <div>
        <Pageheader title="SALES ORDER DETAILS" heading="Sales Order" active="View Details" />
        
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : order ? (
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">Order #{order.order_number}</h4>
                  </div>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      onClick={handlePrint}
                    >
                      <i className="fe fe-printer me-1"></i>
                      Print Order
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowPaymentModal(true)}
                      disabled={order.payment_status === 'paid'}
                    >
                      <i className="fe fe-credit-card me-1"></i>
                      Process Payment
                    </Button>
                    <Button 
                      variant="info" 
                      onClick={() => router.push(`/components/salesorder/editsalesorder/${order.id}`)}
                    >
                      <i className="fe fe-edit me-1"></i>
                      Edit Order
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-4">
                    <Col md={6}>
                      <h5 className="mb-3">Customer Information</h5>
                      <p><strong>Name:</strong> {order.customer?.name}</p>
                      <p><strong>Email:</strong> {order.customer?.email}</p>
                      <p><strong>Phone:</strong> {order.customer?.phone}</p>
                      <p><strong>Address:</strong> {order.customer?.address}</p>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-3">Order Information</h5>
                      <p><strong>Order Date:</strong> {formatDate(order.order_date)}</p>
                      <p><strong>Expected Delivery:</strong> {formatDate(order.expected_delivery_date)}</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <Badge bg={getStatusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </p>
                      <p>
                        <strong>Payment Status:</strong>{' '}
                        <Badge bg={getPaymentStatusBadgeVariant(order.payment_status)}>
                          {order.payment_status}
                        </Badge>
                      </p>
                      <p><strong>Currency:</strong> {order.currency}</p>
                    </Col>
                  </Row>

                  <h5 className="mt-4 mb-3">Order Items</h5>
                  <Table responsive bordered hover>
                    <thead>
                      <tr>
                        <th>Product</th>
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
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                        <td><strong>{formatCurrency(order.total_amount, order.currency)}</strong></td>
                      </tr>
                    </tfoot>
                  </Table>

                  {order.remark && (
                    <div className="mt-4">
                      <h5>Remarks</h5>
                      <p>{order.remark}</p>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="secondary" 
                    onClick={() => router.push('/components/salesorder/viewsalesorders')}
                  >
                    Back to Orders
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        ) : (
          <Alert variant="warning">Order not found</Alert>
        )}
        
        <PaymentModal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          order={order}
          onSuccess={() => {
            setShowPaymentModal(false);
            // Refresh the order data
            router.reload();
          }}
          onError={(error) => setError(error)}
        />
      </div>
    </>
  );
};

SalesOrderDetail.layout = "Contentlayout";

export default SalesOrderDetail; 
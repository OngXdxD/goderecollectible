import { useState, useEffect } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Table, Button, Form, Alert, Badge, Modal } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PaymentModal from '../../../shared/components/PaymentModal';
import ReceiveModal from '../../../shared/components/ReceiveModal';

const ViewPurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('order_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const router = useRouter();

  // Fetch purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders`);
      
      if (response.status === 401) {
        setError('Authentication error: Please log in to view purchase orders');
        return;
      }
      
      if (!response.ok) throw new Error(`Failed to fetch purchase orders: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      setPurchaseOrders(data);
    } catch (err) {
      setError('Failed to load purchase orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
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

  // Filter and sort purchase orders
  const filteredAndSortedOrders = purchaseOrders
    .filter(order => {
      const matchesSearch = 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
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
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'completed':
        return 'info';
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
    router.push(`/components/purchaseorder/editpurchaseorder/${order.id}`);
  };

  const handleAction = (order) => {
    if (order.status === 'pending receive') {
      setSelectedOrder(order);
      setShowReceiveModal(true);
    } else {
      setSelectedOrder(order);
      setShowPaymentModal(true);
    }
  };

  const handleViewAttachment = async (attachment) => {
    if (attachment && attachment.url) {
      try {
        const response = await fetchWithTokenRefresh(attachment.url);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setAttachmentPreview(url);
          setCurrentAttachment(attachment);
          setShowAttachmentModal(true);
        } else {
          setError('Failed to load attachment');
        }
      } catch (err) {
        setError('Error loading attachment');
      }
    }
  };

  const handleCloseModal = () => {
    setShowAttachmentModal(false);
    if (attachmentPreview) {
      window.URL.revokeObjectURL(attachmentPreview);
    }
    setAttachmentPreview(null);
    setCurrentAttachment(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchPurchaseOrders(); // Refresh the list
        } else {
          setError('Failed to delete purchase order');
        }
      } catch (err) {
        setError('Error deleting purchase order');
      }
    }
  };

  return (
    <>
      <Seo title="View Purchase Orders" />
      <div>
        <Pageheader title="VIEW PURCHASE ORDERS" heading="Purchase Orders" active="View Purchase Orders" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex gap-3 align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Search by order number or supplier..."
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
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </div>
                  <Link href="/components/purchaseorder/createpurchaseorder">
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
                      New Purchase Order
                    </Button>
                  </Link>
                </div>

                <Table responsive hover>
                  <thead>
                    <tr>
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
                      <th>Supplier</th>
                      <th>Total Cost</th>
                      <th>Currency</th>
                      <th>Status</th>
                      <th>Attachment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredAndSortedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No purchase orders found
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.order_number}</td>
                          <td>{formatDate(order.order_date)}</td>
                          <td>{order.supplier?.name}</td>
                          <td>{formatCurrency(order.total_cost, order.currency)}</td>
                          <td>{order.currency}</td>
                          <td>
                            <Badge bg={getStatusBadgeVariant(order.status)}>
                              {order.status || 'Unknown'}
                            </Badge>
                          </td>
                          <td>
                            {order.attachments && order.attachments.length > 0 ? (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewAttachment(order.attachments[0])}
                              >
                                View
                              </Button>
                            ) : (
                              <span className="text-muted">No attachment</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {order.status === 'pending receive' ? (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleAction(order)}
                                >
                                  Receive
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleAction(order)}
                                >
                                  Pay
                                </Button>
                              )}
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
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <ReceiveModal
          show={showReceiveModal}
          onHide={() => setShowReceiveModal(false)}
          order={selectedOrder}
          onSuccess={() => {
            setShowReceiveModal(false);
            setSelectedOrder(null);
            fetchPurchaseOrders(); // Refresh the list
          }}
          onError={(error) => setError(error)}
        />

        <PaymentModal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          order={selectedOrder}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedOrder(null);
            fetchPurchaseOrders(); // Refresh the list
          }}
          onError={(error) => setError(error)}
        />

        <Modal
          show={showAttachmentModal}
          onHide={handleCloseModal}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Attachment Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentAttachment && (
              <div className="text-center">
                {currentAttachment.filename.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={attachmentPreview}
                    style={{ width: '100%', height: '70vh' }}
                    title="PDF Preview"
                  />
                ) : (
                  <img
                    src={attachmentPreview}
                    alt="Attachment Preview"
                    style={{ maxWidth: '100%', maxHeight: '70vh' }}
                  />
                )}
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

ViewPurchaseOrders.layout = "Contentlayout";

export default ViewPurchaseOrders; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Row, Col, Form, Button, Table, Alert, Modal, Badge } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import { formatCurrency, formatDate } from '../../../shared/utils/printUtils';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import PaymentModal from '../../../shared/components/PaymentModal';
import ProductModal from '../../../shared/components/ProductModal';

const CreateInvoice = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoice_number: '',
    sales_order_id: '',
    customer_id: '',
    total_amount: 0,
    payment_status: 'pending',
    currency: 'USD',
    status: 'sent',
    remark: '',
    items: [],
    issue_date: new Date().toISOString().split('T')[0]
  });
  const [creationMode, setCreationMode] = useState('fromScratch');
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/customers`);
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (err) {
        setError('Failed to load customers');
      }
    };

    fetchCustomers();
  }, []);

  // Fetch sales orders when customer is selected
  useEffect(() => {
    const fetchSalesOrders = async () => {
      if (!selectedCustomer) return;
      
      try {
        setLoading(true);
        const response = await fetchWithTokenRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/sales-orders/customer/${selectedCustomer.id}/non-completed`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch sales orders');
        }
        
        const data = await response.json();
        setSalesOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOrders();
  }, [selectedCustomer]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (err) {
        setError('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setInvoiceData(prev => ({
      ...prev,
      customer_id: customer.id
    }));
  };

  // Handle order selection
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setInvoiceData(prev => ({
      ...prev,
      sales_order_id: order.id,
      items: []
    }));
    setSelectedOrderItems([]);
    setShowOrderModal(true);
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedOrderItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, {
          ...item,
          product_id: item.product_id || item['all-product']?.id,
          product: item.product || item['all-product']
        }];
      }
    });
  };

  // Handle item selection confirmation
  const handleConfirmItems = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: selectedOrderItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total
      }))
    }));
    setShowOrderModal(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...invoiceData,
          invoice_number: generateInvoiceNumber(),
          sales_order_id: selectedOrder?.id || null,
          customer_id: selectedCustomer.id,
          total_amount: creationMode === 'fromOrder' 
            ? selectedOrderItems.reduce((sum, item) => sum + parseFloat(item.line_total), 0)
            : selectedProducts.reduce((sum, product) => sum + product.line_total, 0),
          items: creationMode === 'fromOrder'
            ? selectedOrderItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                line_total: item.line_total
              }))
            : selectedProducts.map(product => ({
                product_id: product.id,
                quantity: product.quantity,
                unit_price: product.unit_price,
                line_total: product.line_total
              }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedInvoice(data);
        setShowPaymentConfirmationModal(true);
      } else {
        setError('Failed to create invoice');
      }
    } catch (err) {
      setError('Error creating invoice: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product) => {
    setSelectedProducts(prev => [...prev, {
      ...product,
      quantity: 1,
      unit_price: product.foreign_price,
      line_total: product.foreign_price
    }]);
  };

  const handleOpenProductModal = () => {
    setShowProductModal(true);
  };

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = parseInt(value);
    updatedProducts[index].line_total = updatedProducts[index].quantity * updatedProducts[index].unit_price;
    setSelectedProducts(updatedProducts);
  };

  const handleUnitPriceChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].unit_price = parseFloat(value);
    updatedProducts[index].line_total = updatedProducts[index].quantity * updatedProducts[index].unit_price;
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, product) => sum + product.line_total, 0);
  };

  return (
    <>
      <Seo title="Create Invoice" />
      <div>
        <Pageheader title="CREATE INVOICE" heading="Invoice" active="Create Invoice" />
        
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="mb-4">
                  <Form.Check
                    type="radio"
                    label="Create from scratch"
                    name="creationMode"
                    id="fromScratch"
                    checked={creationMode === 'fromScratch'}
                    onChange={() => setCreationMode('fromScratch')}
                    inline
                    className="text-white"
                  />
                  <Form.Check
                    type="radio"
                    label="Create from sales order"
                    name="creationMode"
                    id="fromOrder"
                    checked={creationMode === 'fromOrder'}
                    onChange={() => setCreationMode('fromOrder')}
                    inline
                    className="text-white"
                  />
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Customer</Form.Label>
                        <Form.Select
                          value={selectedCustomer?.id || ''}
                          onChange={(e) => {
                            const customer = customers.find(c => c.id === e.target.value);
                            handleCustomerSelect(customer);
                          }}
                          required
                        >
                          <option value="">Select Customer</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Currency</Form.Label>
                        <Form.Select
                          value={invoiceData.currency}
                          onChange={(e) => setInvoiceData(prev => ({ ...prev, currency: e.target.value }))}
                          required
                        >
                          <option value="USD">USD</option>
                          <option value="CNY">CNY</option>
                          <option value="MYR">MYR</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Invoice Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={invoiceData.issue_date}
                          onChange={(e) => setInvoiceData(prev => ({ ...prev, issue_date: e.target.value }))}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {creationMode === 'fromOrder' ? (
                    <div className="mb-4">
                      <h5>Sales Orders</h5>
                      {loading ? (
                        <div className="text-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : salesOrders.length > 0 ? (
                        <Table responsive hover>
                          <thead>
                            <tr>
                              <th>Order Number</th>
                              <th>Date</th>
                              <th>Total Amount</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {salesOrders.map(order => (
                              <tr key={order.id}>
                                <td>{order.order_number}</td>
                                <td>{formatDate(order.order_date)}</td>
                                <td>{formatCurrency(order.total_amount, order.currency)}</td>
                                <td>
                                  <Badge bg={order.status === 'completed' ? 'success' : 'warning'}>
                                    {order.status}
                                  </Badge>
                                </td>
                                <td>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleOrderSelect(order)}
                                  >
                                    Select Items
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <Alert variant="info">No sales orders found for this customer</Alert>
                      )}

                      {selectedOrderItems.length > 0 && (
                        <div className="mt-4">
                          <h5>Selected Items</h5>
                          <Table responsive hover>
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Line Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrderItems.map(item => (
                                <tr key={item.id}>
                                  <td>{item.product?.name || item['all-product']?.name || 'Unknown Product'}</td>
                                  <td>{item.quantity}</td>
                                  <td>{formatCurrency(item.unit_price, selectedOrder?.currency)}</td>
                                  <td>{formatCurrency(item.line_total, selectedOrder?.currency)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                <td>
                                  <strong>
                                    {formatCurrency(
                                      selectedOrderItems.reduce((sum, item) => sum + parseFloat(item.line_total), 0),
                                      selectedOrder?.currency
                                    )}
                                  </strong>
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Add Product</Form.Label>
                            <div className="position-relative">
                              <Form.Control
                                type="text"
                                placeholder="Search products to add..."
                                value={searchTerm}
                                onChange={(e) => {
                                  const term = e.target.value;
                                  setSearchTerm(term);
                                  const filtered = products.filter(product => 
                                    product.name.toLowerCase().includes(term.toLowerCase()) ||
                                    product.brand.toLowerCase().includes(term.toLowerCase())
                                  );
                                  setFilteredProducts(filtered);
                                }}
                                className="border-end-0"
                              />
                              {searchTerm.trim() !== '' && (
                                <div 
                                  className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" 
                                  style={{ 
                                    maxHeight: '300px', 
                                    overflowY: 'auto', 
                                    zIndex: 1000 
                                  }}
                                >
                                  {filteredProducts.length === 0 ? (
                                    <div className="p-2 text-center text-muted">No products found</div>
                                  ) : (
                                    filteredProducts.map(product => (
                                      <div 
                                        key={product.id} 
                                        className="p-2 border-bottom hover-bg-light"
                                        onClick={() => {
                                          handleAddProduct(product);
                                          setSearchTerm('');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
                                      >
                                        <div className="d-flex justify-content-between">
                                          <div>
                                            <div><strong>{product.name}</strong></div>
                                            <div className="small text-muted">
                                              {product.brand}
                                            </div>
                                          </div>
                                          <div className="text-end">
                                            <div>{formatCurrency(product.foreign_price, invoiceData.currency)}</div>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>&nbsp;</Form.Label>
                            <Button 
                              variant="primary" 
                              onClick={handleOpenProductModal}
                              className="d-flex align-items-center w-100"
                            >
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
                              New Product
                            </Button>
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4>Selected Products</h4>
                        </div>

                        <Table responsive>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Brand</th>
                              <th>Quantity</th>
                              <th>Unit Cost</th>
                              <th>Line Total</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProducts.map((product, index) => (
                              <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.brand}</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    min="1"
                                    value={product.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    style={{ width: '100px' }}
                                  />
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    step="0.01"
                                    value={product.unit_price}
                                    onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                                    style={{ width: '120px' }}
                                  />
                                </td>
                                <td>{formatCurrency(product.line_total, invoiceData.currency)}</td>
                                <td>
                                  <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => handleRemoveProduct(index)}
                                    className="d-flex align-items-center"
                                  >
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      width="14" 
                                      height="14" 
                                      fill="currentColor" 
                                      className="bi bi-trash me-1" 
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                              <td><strong>{formatCurrency(calculateTotal(), invoiceData.currency)}</strong></td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                    </>
                  )}

                  <Form.Group className="mb-4">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={invoiceData.remark}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, remark: e.target.value }))}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => router.push('/components/invoice/viewinvoices')}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || (creationMode === 'fromOrder' ? selectedOrderItems.length === 0 : selectedProducts.length === 0)}
                    >
                      {loading ? 'Creating...' : 'Create Invoice'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Order Items Selection Modal */}
        <Modal
          show={showOrderModal}
          onHide={() => setShowOrderModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Select Items from Order #{selectedOrder?.order_number}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder?.items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedOrderItems.some(i => i.id === item.id)}
                        onChange={() => handleItemSelect(item)}
                      />
                    </td>
                    <td>{item.product?.name || item['all-product']?.name || 'Unknown Product'}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unit_price, selectedOrder?.currency)}</td>
                    <td>{formatCurrency(item.line_total, selectedOrder?.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmItems}>
              Confirm Selection
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Payment Confirmation Modal */}
        <Modal
          show={showPaymentConfirmationModal}
          onHide={() => {
            setShowPaymentConfirmationModal(false);
            router.push('/components/invoice/viewinvoices');
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Payment Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Has the customer paid for this invoice?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowPaymentConfirmationModal(false);
                router.push('/components/invoice/viewinvoices');
              }}
            >
              No
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowPaymentConfirmationModal(false);
                setShowPaymentModal(true);
              }}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Payment Modal */}
        <PaymentModal
          show={showPaymentModal}
          onHide={() => {
            setShowPaymentModal(false);
            router.push('/components/invoice/viewinvoices');
          }}
          order={selectedInvoice}
          onSuccess={() => {
            setShowPaymentModal(false);
            router.push('/components/invoice/viewinvoices');
          }}
          onError={(error) => {
            setError(error);
            setShowPaymentModal(false);
          }}
        />

        {/* Product Modal */}
        <ProductModal
          show={showProductModal}
          onHide={() => setShowProductModal(false)}
          onSuccess={(product) => {
            handleAddProduct(product);
            setShowProductModal(false);
          }}
          onError={(error) => {
            setError(error);
            setShowProductModal(false);
          }}
        />
      </div>
    </>
  );
};

CreateInvoice.layout = "Contentlayout";

export default CreateInvoice; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Row, Col, Alert, Table, Modal } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import PaymentModal from '../../../shared/components/PaymentModal';
import ProductModal from '../../../shared/components/ProductModal';

const CreateSalesOrder = () => {
  const router = useRouter();
  const [salesOrder, setSalesOrder] = useState({
    order_number: '',
    order_date: new Date().toISOString().split('T')[0],
    customer_id: '',
    currency: 'CNY',
    expected_delivery_date: '',
    remarks: '',
    payment_status: 'pending',
    status: 'draft',
    attachment: null
  });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    foreignPrice: '',
    currency: 'USD',
    localPrice: '',
    images: []
  });
  const [filePreview, setFilePreview] = useState(null);
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersResponse = await fetchWithTokenRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/customers`
        );
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          setCustomers(customersData);
        }

        // Fetch products
        const productsResponse = await fetchWithTokenRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products`
        );
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }
      } catch (err) {
        setError('Error loading data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter products when search term changes or products are loaded
    if (searchTerm.trim() === '') {
      setFilteredProducts([]);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.brand && product.brand.toLowerCase().includes(term)) ||
        (product.category && product.category.toLowerCase().includes(term))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleAddProduct = (product) => {
    setSelectedProducts(prev => [...prev, { 
      ...product, 
      quantity: 1, 
      unit_price: product.local_selling_price,
      line_total: product.local_selling_price
    }]);
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, value) => {
    setSelectedProducts(prev => prev.map((item, i) => 
      i === index ? { 
        ...item, 
        quantity: parseInt(value) || 0,
        line_total: (parseInt(value) || 0) * item.unit_price
      } : item
    ));
  };

  const handleUnitPriceChange = (index, value) => {
    setSelectedProducts(prev => prev.map((item, i) => 
      i === index ? { 
        ...item, 
        unit_price: parseFloat(value) || 0,
        line_total: item.quantity * (parseFloat(value) || 0)
      } : item
    ));
  };

  const handleCreateProduct = async (productData) => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/all-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productData.name,
          brand: productData.brand,
          category: productData.category,
          description: productData.description,
          foreign_selling_price: parseFloat(productData.foreignPrice),
          currency: productData.currency,
          local_selling_price: parseFloat(productData.localPrice),
          images: productData.images
        })
      });

      if (response.status === 401) {
        setError('Authentication error: Please log in to create products');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create product: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      handleAddProduct(data);
      setSuccess('Product created successfully!');
    } catch (err) {
      setError('Failed to create product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SO-${year}${month}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const requestData = {
        order_number: salesOrder.order_number,
        order_date: salesOrder.order_date,
        customer_id: salesOrder.customer_id,
        currency: salesOrder.currency,
        expected_delivery_date: salesOrder.expected_delivery_date,
        payment_status: salesOrder.payment_status,
        status: salesOrder.status,
        remark: salesOrder.remarks || '',
        total_amount: calculateTotal(),
        items: selectedProducts.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: (item.quantity * item.unit_price)
        }))
      };

      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/sales-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.status === 401) {
        setError('Authentication error: Please log in to create sales orders');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create sales order: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setCreatedOrder(data);
      setShowPaymentConfirmationModal(true);
      setSuccess('Sales order created successfully!');
    } catch (err) {
      setError('Failed to create sales order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
  };

  const handleOpenProductModal = () => {
    setShowProductModal(true);
  };

  const handlePaymentConfirmation = (hasPaid) => {
    setShowPaymentConfirmationModal(false);
    if (hasPaid) {
      setShowPaymentModal(true);
    } else {
      router.push('/components/salesorder/viewsalesorders');
    }
  };

  const handleGenerateOrder = async () => {
    try {
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/sales-orders/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: salesOrder.customer_id,
          currency: salesOrder.currency,
          order_date: salesOrder.order_date,
          expected_delivery_date: salesOrder.expected_delivery_date,
          remark: salesOrder.remarks
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate sales order');
      }

      const data = await response.json();
      setGeneratedOrder(data);
      setShowGenerateModal(true);
    } catch (err) {
      setError('Failed to generate sales order: ' + err.message);
    }
  };

  const handleAcceptGeneratedOrder = () => {
    if (generatedOrder && generatedOrder.items) {
      // Update the selectedProducts array with the items from the generated order
      const formattedItems = generatedOrder.items.map(item => ({
        id: item.product_id,
        name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total
      }));
      
      setSelectedProducts(formattedItems);
      
      // Update the total in the salesOrder state
      setSalesOrder(prev => ({
        ...prev,
        total_amount: generatedOrder.total_amount
      }));
      
      setShowGenerateModal(false);
    }
  };

  return (
    <>
      <Seo title="Create Sales Order" />
      <div>
        <Pageheader title="CREATE SALES ORDER" heading="Sales Orders" active="Create Sales Order" />
        <Row>
          <Col lg={12} md={12} sm={12}>
              <Card>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  
                  <Form id="salesOrderForm" onSubmit={handleSubmit}>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                        <Form.Label>Order Number</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control
                            type="text"
                            value={salesOrder.order_number}
                            onChange={(e) => setSalesOrder(prev => ({ ...prev, order_number: e.target.value }))}
                            required
                            placeholder="SO-2024-0001"
                          />
                          <Button 
                            variant="outline-secondary" 
                            onClick={async () => {
                              const newOrderNumber = await generateOrderNumber();
                              setSalesOrder(prev => ({ ...prev, order_number: newOrderNumber }));
                            }}
                            className="d-flex align-items-center"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" 
                              height="16" 
                              fill="currentColor" 
                              className="bi bi-arrow-clockwise me-1" 
                              viewBox="0 0 16 16"
                            >
                              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                            Regenerate
                          </Button>
                        </div>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Order Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={salesOrder.order_date}
                            onChange={(e) => setSalesOrder(prev => ({ ...prev, order_date: e.target.value }))}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expected Delivery Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={salesOrder.expected_delivery_date}
                            onChange={(e) => setSalesOrder(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                          />
                        </Form.Group>
                      </Col>

                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Customer *</Form.Label>
                          <Form.Select
                            value={salesOrder.customer_id}
                            onChange={(e) => setSalesOrder(prev => ({ ...prev, customer_id: e.target.value }))}
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
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Currency</Form.Label>
                          <Form.Select
                            value={salesOrder.currency}
                            onChange={(e) => setSalesOrder(prev => ({ ...prev, currency: e.target.value }))}
                            required
                          >
                            <option value="CNY">Chinese Yuan (CNY)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="MYR">Malaysian Ringgit (MYR)</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            value={salesOrder.status}
                            onChange={(e) => setSalesOrder(prev => ({ ...prev, status: e.target.value }))}
                            required
                          >
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Status</Form.Label>
                          <Form.Select
                            value={salesOrder.payment_status}
                            onChange={(e) => setSalesOrder(prev => ({ ...prev, payment_status: e.target.value }))}
                            required
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partial</option>
                            <option value="refunded">Refunded</option>
                            <option value="cancelled">Cancelled</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Add Product</Form.Label>
                            <div className="position-relative">
                            <Form.Control
                                type="text"
                                placeholder="Search products to add..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                            {product.brand} | {product.category}
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div>{product.local_selling_price}</div>
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
                            <td>{(product.quantity * product.unit_price).toFixed(2)}</td>
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
                          <td colSpan="5" className="text-end"><strong>Total:</strong></td>
                          <td><strong>{calculateTotal().toFixed(2)}</strong></td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </Table>
                </div>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={3}
                            value={salesOrder.remarks}
                            onChange={(e) => setSalesOrder(prev => ({ ...prev, remarks: e.target.value }))}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                    <div className="d-flex gap-2">
                    <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading || selectedProducts.length === 0}
                    className="d-flex align-items-center"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          fill="currentColor" 
                          className="bi bi-save me-1" 
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
                        </svg>
                        Create Sales Order
                      </>
                    )}
                  </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
        </Row>
      </div>

      {/* Replace the old Product Modal with the new reusable component */}
      <ProductModal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        onAddProduct={handleAddProduct}
        onCreateProduct={handleCreateProduct}
        products={products}
        loading={loading}
        error={error}
      />

      {/* Payment Confirmation Modal */}
      <Modal show={showPaymentConfirmationModal} onHide={() => setShowPaymentConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Would you like to add payment for this sales order now?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handlePaymentConfirmation(false)}>
            No, Later
          </Button>
          <Button variant="primary" onClick={() => handlePaymentConfirmation(true)}>
            Yes, Add Payment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Modal */}
      {createdOrder && (
        <PaymentModal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          order={createdOrder}
          onSuccess={() => {
            setShowPaymentModal(false);
            router.push('/components/salesorder/viewsalesorders');
          }}
          onError={(error) => setError(error)}
        />
      )}

      <Modal show={showGenerateModal} onHide={() => setShowGenerateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Generated Sales Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {generatedOrder && (
            <>
              <h5>Suggested Items</h5>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit_price}</td>
                      <td>{item.line_total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total Amount:</strong></td>
                    <td><strong>{generatedOrder.total_amount}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAcceptGeneratedOrder}>
            Accept Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

CreateSalesOrder.layout = "Contentlayout";

export default CreateSalesOrder; 
import { useState, useEffect } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Form, Button, Table, Alert, Modal } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';

const CreatePurchaseOrder = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
  const [purchaseOrder, setPurchaseOrder] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    supplier: '',
    notes: '',
    items: []
  });

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/all-products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product) => {
    setSelectedProducts(prev => [...prev, { ...product, quantity: 1, unitPrice: product.local_selling_price }]);
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, value) => {
    setSelectedProducts(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: parseInt(value) || 0 } : item
    ));
  };

  const handleUnitPriceChange = (index, value) => {
    setSelectedProducts(prev => prev.map((item, i) => 
      i === index ? { ...item, unitPrice: parseFloat(value) || 0 } : item
    ));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/all-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          brand: newProduct.brand,
          category: newProduct.category,
          description: newProduct.description,
          foreign_selling_price: parseFloat(newProduct.foreignPrice),
          currency: newProduct.currency,
          local_selling_price: parseFloat(newProduct.localPrice),
          images: newProduct.images
        })
      });

      if (!response.ok) throw new Error('Failed to create product');
      const data = await response.json();
      
      // Add the new product to the selected products
      handleAddProduct(data);
      setShowProductModal(false);
      setNewProduct({
        name: '',
        brand: '',
        category: '',
        description: '',
        foreignPrice: '',
        currency: 'USD',
        localPrice: '',
        images: []
      });
      setSuccess('Product created successfully!');
    } catch (err) {
      setError('Failed to create product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...purchaseOrder,
          items: selectedProducts.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to create purchase order');
      setSuccess('Purchase order created successfully!');
      setSelectedProducts([]);
      setPurchaseOrder({
        orderDate: new Date().toISOString().split('T')[0],
        supplier: '',
        notes: '',
        items: []
      });
    } catch (err) {
      setError('Failed to create purchase order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  return (
    <>
      <Seo title="Create Purchase Order" />
      <div>
        <Pageheader title="CREATE PURCHASE ORDER" heading="Purchase Orders" active="Create Purchase Order" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Order Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={purchaseOrder.orderDate}
                          onChange={(e) => setPurchaseOrder(prev => ({ ...prev, orderDate: e.target.value }))}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Supplier</Form.Label>
                        <Form.Control
                          type="text"
                          value={purchaseOrder.supplier}
                          onChange={(e) => setPurchaseOrder(prev => ({ ...prev, supplier: e.target.value }))}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4>Products</h4>
                      <Button variant="primary" onClick={() => setShowProductModal(true)}>
                        Add Product
                      </Button>
                    </div>

                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProducts.map((product, index) => (
                          <tr key={index}>
                            <td>{product.name}</td>
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
                                value={product.unitPrice}
                                onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                                style={{ width: '120px' }}
                              />
                            </td>
                            <td>{(product.quantity * product.unitPrice).toFixed(2)}</td>
                            <td>
                              <Button variant="danger" size="sm" onClick={() => handleRemoveProduct(index)}>
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                          <td><strong>{calculateTotal().toFixed(2)}</strong></td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={purchaseOrder.notes}
                      onChange={(e) => setPurchaseOrder(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" disabled={loading || selectedProducts.length === 0}>
                    {loading ? 'Creating...' : 'Create Purchase Order'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Product Selection Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h5>Select Existing Product</h5>
            <Table responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>{product.local_selling_price}</td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleAddProduct(product)}>
                        Add
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div>
            <h5>Create New Product</h5>
            <Form onSubmit={handleCreateProduct}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Blind Boxes">Blind Boxes</option>
                      <option value="Figures">Figures</option>
                      <option value="GK Resin">GK Resin</option>
                      <option value="Statues">Statues</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Form.Select
                      value={newProduct.currency}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, currency: e.target.value }))}
                      required
                    >
                      <option value="CNY">Chinese Yuan</option>
                      <option value="SGD">Singapore Dollar</option>
                      <option value="USD">US Dollar</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Foreign Price</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={newProduct.foreignPrice}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, foreignPrice: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Local Price (MYR)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={newProduct.localPrice}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, localPrice: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                />
              </Form.Group>

              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

CreatePurchaseOrder.layout = "Contentlayout";

export default CreatePurchaseOrder; 
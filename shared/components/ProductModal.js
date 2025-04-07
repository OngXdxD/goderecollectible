import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const ProductModal = ({ 
  show, 
  onHide, 
  onCreateProduct,
  loading = false,
  error = null
}) => {
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

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await onCreateProduct(newProduct);
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
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
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
                <Form.Control
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Currency</Form.Label>
                <Form.Select
                  value={newProduct.currency}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, currency: e.target.value }))}
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="CNY">Chinese Yuan (CNY)</option>
                  <option value="MYR">Malaysian Ringgit (MYR)</option>
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
                <Form.Label>Local Price</Form.Label>
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

          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal; 
import { useState, useEffect } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Form, Button, Table, Alert, Modal } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import PaymentModal from '../../../shared/components/PaymentModal';

const CreatePurchaseOrder = () => {
  // Function to generate order number
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${year}${month}-${random}`;
  };

  // Function to check if order number exists
  const checkOrderNumberExists = async (orderNumber) => {
    try {
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders/check-number/${orderNumber}`);
      if (!response.ok) throw new Error('Failed to check order number');
      const data = await response.json();
      return data.exists;
    } catch (err) {
      console.error('Error checking order number:', err);
      return false;
    }
  };

  // Function to generate unique order number
  const generateUniqueOrderNumber = async () => {
    let orderNumber = generateOrderNumber();
    let exists = await checkOrderNumberExists(orderNumber);
    
    // Keep generating until we find a unique number
    while (exists) {
      orderNumber = generateOrderNumber();
      exists = await checkOrderNumberExists(orderNumber);
    }
    
    return orderNumber;
  };

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState([]);
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
    order_number: generateOrderNumber(),
    order_date: new Date().toISOString().split('T')[0],
    supplier_id: '',
    currency: 'CNY',
    expected_delivery_date: '',
    remarks: '',
    attachment: null
  });

  // Add new state for file preview
  const [filePreview, setFilePreview] = useState(null);

  // Add new state for payment confirmation modal
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access-token');
        if (!token) {
          setError('You must be logged in to create purchase orders. Please log in first.');
        }
      }
    };

    checkAuth();
  }, []);

  // Fetch all products and suppliers
  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/all-products`);
      
      if (response.status === 401) {
        setError('Authentication error: Please log in to access this feature');
        return;
      }
      
      if (!response.ok) throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      // Check if data is an array directly, otherwise use the products property
      const productsData = Array.isArray(data) ? data : (data.products || []);
      setProducts(productsData);
    } catch (err) {
      setError('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/suppliers`);
      
      if (response.status === 401) {
        setError('Authentication error: Please log in to access this feature');
        return;
      }
      
      if (!response.ok) throw new Error(`Failed to fetch suppliers: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      // Check if data is an array directly, otherwise use the suppliers property
      const suppliersData = Array.isArray(data) ? data : (data.suppliers || []);
      setSuppliers(suppliersData);
    } catch (err) {
      setError('Failed to load suppliers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product) => {
    setSelectedProducts(prev => [...prev, { 
      ...product, 
      quantity: 1, 
      unit_cost: product.local_selling_price,
      unit_cost_local: product.local_selling_price
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
        line_total: (parseInt(value) || 0) * item.unit_cost
      } : item
    ));
  };

  const handleUnitPriceChange = (index, value) => {
    setSelectedProducts(prev => prev.map((item, i) => 
      i === index ? { 
        ...item, 
        unit_cost: parseFloat(value) || 0,
        unit_cost_local: parseFloat(value) || 0,
        line_total: item.quantity * (parseFloat(value) || 0)
      } : item
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

      if (response.status === 401) {
        setError('Authentication error: Please log in to create products');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create product: ${response.status} ${response.statusText}`);
      }
      
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

  // Update useEffect to generate order number on component mount
  useEffect(() => {
    const initializeOrderNumber = async () => {
      const uniqueOrderNumber = await generateUniqueOrderNumber();
      setPurchaseOrder(prev => ({ ...prev, order_number: uniqueOrderNumber }));
    };
    initializeOrderNumber();
  }, []);

  // Add handler for file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Get file extension from original file
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Create filename using order number and original extension
      const filename = `${purchaseOrder.order_number}.${fileExtension}`;
      
      setPurchaseOrder(prev => ({ ...prev, attachment: filename }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add handler for removing attachment
  const handleRemoveAttachment = () => {
    setPurchaseOrder(prev => ({ ...prev, attachment: null }));
    setFilePreview(null);
  };

  // Update handleSubmit to include attachment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all required fields in the exact order as the sample
      formData.append('order_number', purchaseOrder.order_number);
      formData.append('order_date', purchaseOrder.order_date);
      formData.append('supplier_id', purchaseOrder.supplier_id);
      formData.append('total_cost', calculateTotal().toFixed(2));
      formData.append('currency', purchaseOrder.currency);
      formData.append('expected_delivery_date', purchaseOrder.expected_delivery_date ? new Date(purchaseOrder.expected_delivery_date).toISOString() : null);
      formData.append('remark', purchaseOrder.remarks || '');
      formData.append('items', JSON.stringify(selectedProducts.map(item => ({
        "product_id": item.id,
        "quantity": item.quantity,
        "unit_cost": item.unit_cost.toString(),
        "unit_cost_local": item.unit_cost.toString()
      }))));
      
      // Add the files if they exist
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(file => {
          formData.append('attachments', file);
        });
      }
      
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create purchase order: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setCreatedOrder(data);
      setShowPaymentConfirmationModal(true);
      
    } catch (err) {
      setError('Failed to create purchase order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);
  };

  // When opening the modal, reset search
  const handleOpenProductModal = () => {
    setSearchTerm('');
    setFilteredProducts([]);
    setShowProductModal(true);
  };

  const handlePaymentConfirmation = (hasPaid) => {
    setShowPaymentConfirmationModal(false);
    if (hasPaid) {
      setShowPaymentModal(true);
    } else {
      // Reset form and show success message
      setSelectedProducts([]);
      setPurchaseOrder({
        order_number: generateOrderNumber(),
        order_date: new Date().toISOString().split('T')[0],
        supplier_id: '',
        currency: 'CNY',
        expected_delivery_date: '',
        remarks: '',
        attachment: null
      });
      setFilePreview(null);
      setSuccess('Purchase order created successfully!');
    }
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
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Order Number</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control
                            type="text"
                            value={purchaseOrder.order_number}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, order_number: e.target.value }))}
                            required
                            placeholder="e.g. PO-2024-0001"
                          />
                          <Button 
                            variant="outline-secondary" 
                            onClick={async () => {
                              const newOrderNumber = await generateUniqueOrderNumber();
                              setPurchaseOrder(prev => ({ ...prev, order_number: newOrderNumber }));
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
                          value={purchaseOrder.order_date}
                          onChange={(e) => setPurchaseOrder(prev => ({ ...prev, order_date: e.target.value }))}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expected Delivery Date</Form.Label>
                        <Form.Control
                          type="month"
                          value={purchaseOrder.expected_delivery_date}
                          onChange={(e) => setPurchaseOrder(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Supplier</Form.Label>
                        <Form.Select
                          value={purchaseOrder.supplier_id}
                          onChange={(e) => setPurchaseOrder(prev => ({ ...prev, supplier_id: e.target.value }))}
                          required
                        >
                          <option value="">Select a supplier</option>
                          {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Currency</Form.Label>
                        <Form.Select
                          value={purchaseOrder.currency}
                          onChange={(e) => setPurchaseOrder(prev => ({ ...prev, currency: e.target.value }))}
                          required
                        >
                          <option value="CNY">Chinese Yuan</option>
                          <option value="SGD">Singapore Dollar</option>
                          <option value="USD">US Dollar</option>
                          <option value="MYR">Malaysian Ringgit</option>
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
                          <th>Category</th>
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
                            <td>{product.category}</td>
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
                                value={product.unit_cost}
                                onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                                style={{ width: '120px' }}
                              />
                            </td>
                            <td>{(product.quantity * product.unit_cost).toFixed(2)}</td>
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
                          rows={2}
                          value={purchaseOrder.remarks}
                          onChange={(e) => setPurchaseOrder(prev => ({ ...prev, remarks: e.target.value }))}
                          placeholder="Add any additional notes or remarks here..."
                    />
                  </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Proof of Purchase Order</Form.Label>
                        <div className="d-flex gap-2 align-items-start">
                          <div className="flex-grow-1">
                            <Form.Control
                              type="file"
                              onChange={handleFileUpload}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="mb-2"
                            />
                            <small className="text-muted">
                              Accepted formats: PDF, JPG, JPEG, PNG. Maximum file size: 5MB
                            </small>
                          </div>
                          {filePreview && (
                            <Button 
                              variant="outline-danger" 
                              onClick={handleRemoveAttachment}
                              className="d-flex align-items-center"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                fill="currentColor" 
                                className="bi bi-trash me-1" 
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                              </svg>
                              Remove
                            </Button>
                          )}
                        </div>
                        {filePreview && (
                          <div className="mt-2">
                            {filePreview.startsWith('data:image') ? (
                              <img 
                                src={filePreview} 
                                alt="Preview" 
                                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                                className="border rounded"
                              />
                            ) : (
                              <div className="p-2 border rounded bg-light">
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="24" 
                                  height="24" 
                                  fill="currentColor" 
                                  className="bi bi-file-pdf me-2" 
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M5.523 12.424c.14-.082.293-.162.459-.238a4.493 4.493 0 0 1 1.56-.396c.28.04.521.18.642.413.121.232.121.484.121.707v.375a.622.622 0 0 1-.029.133A.076.076 0 0 1 8 14v1a.076.076 0 0 1-.029.133A.622.622 0 0 1 7.875 15.5v-.375c0-.61-.525-1.11-1.174-1.11-.373 0-.745.082-1.122.262a4.943 4.943 0 0 0-.88.45V11.85h1.96c.356 0 .638.139.638.414 0 .31-.319.517-.724.517z"/>
                                  <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                </svg>
                                PDF Document
                              </div>
                            )}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

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
                        Create Purchase Order
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Product Creation Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
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
                    className="bi bi-plus-circle me-1" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                  Create Product
                </>
              )}
              </Button>
            </Form>
        </Modal.Body>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal
        show={showPaymentConfirmationModal}
        onHide={() => setShowPaymentConfirmationModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Would you like to add payment details for this purchase order now?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => handlePaymentConfirmation(true)}>
            Yes, Add Payment
          </Button>
          <Button variant="secondary" onClick={() => handlePaymentConfirmation(false)}>
            No, Continue
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Modal */}
      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        order={createdOrder}
        onSuccess={() => {
          setSelectedProducts([]);
          setPurchaseOrder({
            order_number: generateOrderNumber(),
            order_date: new Date().toISOString().split('T')[0],
            supplier_id: '',
            currency: 'CNY',
            expected_delivery_date: '',
            remarks: '',
            attachment: null
          });
          setFilePreview(null);
          setSuccess('Purchase order and payment created successfully!');
        }}
        onError={(error) => setError(error)}
      />
    </>
  );
};

CreatePurchaseOrder.layout = "Contentlayout";

export default CreatePurchaseOrder; 
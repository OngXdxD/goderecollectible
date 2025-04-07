import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Row, Col, Alert, Modal, Table } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../../../../shared/utils/auth';
import Pageheader from "../../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../../shared/layout-components/seo/seo";

const EditPurchaseOrder = () => {
  const router = useRouter();
  const { id } = router.query;
  const [purchaseOrder, setPurchaseOrder] = useState({
    order_number: '',
    supplier_id: '',
    total_cost: '',
    currency: 'CNY',
    order_date: '',
    expected_delivery_date: '',
    actual_delivery_date: '',
    status: 'ordered',
    payment_status: 'pending',
    remark: '',
    items: [],
    payments: [],
    attachments: []
  });
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [newItem, setNewItem] = useState({
    product_id: '',
    quantity: 1,
    unit_cost: 0
  });
  const [initialOrder, setInitialOrder] = useState({
    order_number: '',
    supplier_id: '',
    total_cost: '',
    currency: 'CNY',
    order_date: '',
    expected_delivery_date: '',
    actual_delivery_date: '',
    status: 'ordered',
    payment_status: 'pending',
    remark: '',
    items: [],
    payments: [],
    attachments: []
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Don't fetch if no ID is available
      
      try {
        setLoading(true);
        setError('');

        // Fetch purchase order
        const orderResponse = await fetchWithTokenRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders/${id}`
        );
        
        if (!orderResponse.ok) {
          throw new Error('Failed to fetch purchase order');
        }
        
        const orderData = await orderResponse.json();
        console.log('Fetched order data:', orderData); // Debug log
        
        // Format dates for input fields
        const formattedOrderData = {
          ...orderData,
          order_date: orderData.order_date ? orderData.order_date.split('T')[0] : '',
          expected_delivery_date: orderData.expected_delivery_date ? orderData.expected_delivery_date.split('T')[0] : '',
          actual_delivery_date: orderData.actual_delivery_date ? orderData.actual_delivery_date.split('T')[0] : ''
        };
        
        setPurchaseOrder(formattedOrderData);
        setInitialOrder(formattedOrderData);

        // Fetch suppliers
        const suppliersResponse = await fetchWithTokenRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/suppliers`
        );
        if (suppliersResponse.ok) {
          const suppliersData = await suppliersResponse.json();
          setSuppliers(suppliersData);
        }

        // Fetch products
        const productsResponse = await fetchWithTokenRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products`
        );
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }

        // Handle attachment preview if exists
        if (orderData.attachments && orderData.attachments.length > 0) {
          try {
            const attachmentResponse = await fetchWithTokenRefresh(orderData.attachments[0].url);
            if (attachmentResponse.ok) {
              const blob = await attachmentResponse.blob();
              const url = window.URL.createObjectURL(blob);
              setFilePreview(url);
            }
          } catch (err) {
            console.error('Error loading attachment preview:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Error loading purchase order data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (filePreview) {
        window.URL.revokeObjectURL(filePreview);
      }
    };
  }, [id]); // Re-run effect when ID changes

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Revoke previous preview URL if it exists
      if (filePreview) {
        window.URL.revokeObjectURL(filePreview);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setPurchaseOrder(prev => ({
          ...prev,
          attachments: [{
            filename: `${purchaseOrder.order_number}.${file.name.split('.').pop()}`,
            file: file
          }]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = () => {
    if (filePreview) {
      window.URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    setPurchaseOrder(prev => ({
      ...prev,
      attachments: []
    }));
  };

  const handleUpdateItemCost = (index, newUnitCost) => {
    setPurchaseOrder(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        unit_cost: newUnitCost,
        line_total: (parseFloat(newUnitCost) * updatedItems[index].quantity).toFixed(2)
      };

      // Calculate new total cost
      const newTotalCost = updatedItems.reduce((sum, item) => 
        sum + parseFloat(item.line_total), 0
      ).toFixed(2);

      return {
        ...prev,
        items: updatedItems,
        total_cost: newTotalCost
      };
    });
  };

  const handleUpdateItemLocalCost = (index, newUnitCostLocal) => {
    setPurchaseOrder(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        unit_cost_local: newUnitCostLocal,
        line_total: (parseFloat(newUnitCostLocal) * updatedItems[index].quantity).toFixed(2)
      };

      // Calculate new total cost
      const newTotalCost = updatedItems.reduce((sum, item) => 
        sum + parseFloat(item.line_total), 0
      ).toFixed(2);

      return {
        ...prev,
        items: updatedItems,
        total_cost: newTotalCost
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      
      // Only append fields that have been changed
      if (purchaseOrder.order_number !== initialOrder.order_number) {
        formData.append('order_number', purchaseOrder.order_number);
      }
      
      if (purchaseOrder.supplier_id !== initialOrder.supplier_id) {
        formData.append('supplier_id', purchaseOrder.supplier_id);
      }
      
      if (purchaseOrder.total_cost !== initialOrder.total_cost) {
        formData.append('total_cost', purchaseOrder.total_cost);
      }
      
      if (purchaseOrder.currency !== initialOrder.currency) {
        formData.append('currency', purchaseOrder.currency);
      }
      
      if (purchaseOrder.order_date !== initialOrder.order_date) {
        formData.append('order_date', purchaseOrder.order_date);
      }
      
      if (purchaseOrder.expected_delivery_date !== initialOrder.expected_delivery_date) {
        formData.append('expected_delivery_date', purchaseOrder.expected_delivery_date);
      }
      
      if (purchaseOrder.actual_delivery_date !== initialOrder.actual_delivery_date) {
        formData.append('actual_delivery_date', purchaseOrder.actual_delivery_date || null);
      }
      
      if (purchaseOrder.status !== initialOrder.status) {
        formData.append('status', purchaseOrder.status);
      }
      
      if (purchaseOrder.payment_status !== initialOrder.payment_status) {
        formData.append('payment_status', purchaseOrder.payment_status);
      }
      
      if (purchaseOrder.remark !== initialOrder.remark) {
        formData.append('remark', purchaseOrder.remark || '');
      }
      
      // Check if items have been modified
      const itemsChanged = JSON.stringify(purchaseOrder.items) !== JSON.stringify(initialOrder.items);
      if (itemsChanged) {
        // Find which items have changed
        const changedItems = purchaseOrder.items.map((item, index) => {
          const initialItem = initialOrder.items[index];
          if (JSON.stringify(item) !== JSON.stringify(initialItem)) {
            return {
              product_id: item.product_id,
              quantity: parseInt(item.quantity),
              unit_cost: parseFloat(item.unit_cost),
              unit_cost_local: parseFloat(item.unit_cost_local)
            };
          }
          return null;
        }).filter(item => item !== null);

        if (changedItems.length > 0) {
          formData.append('items', JSON.stringify(changedItems));
        }
      }

      if (purchaseOrder.attachments && purchaseOrder.attachments.length > 0) {
        formData.append('attachment', purchaseOrder.attachments[0].file);
      }

      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders/${id}`, {
        method: 'PATCH',
        body: formData
      });

      if (response.ok) {
        setSuccess('Purchase order updated successfully');
        setTimeout(() => {
          router.push('/components/purchaseorder/viewpurchaseorders');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update purchase order');
      }
    } catch (err) {
      setError('Error updating purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
  };

  return (
    <>
      <Seo title="Edit Purchase Order" />
      <div>
        <Pageheader title="EDIT PURCHASE ORDER" heading="Purchase Orders" active="Edit Purchase Order" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <Card>
                <Card.Header>
                  <h4 className="card-title">Edit Purchase Order</h4>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Order Number</Form.Label>
                          <Form.Control
                            type="text"
                            value={purchaseOrder.order_number}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, order_number: e.target.value }))}
                            required
                          />
                        </Form.Group>
                      </Col>
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
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Total Cost</Form.Label>
                          <Form.Control
                            type="text"
                            value={`${purchaseOrder.total_cost} ${purchaseOrder.currency}`}
                            disabled
                          />
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
                            <option value="CNY">Chinese Yuan (CNY)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="MYR">Malaysian Ringgit (MYR)</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
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
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            value={purchaseOrder.status}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, status: e.target.value }))}
                            required
                          >
                            <option value="ordered">Ordered</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Status</Form.Label>
                          <Form.Select
                            value={purchaseOrder.payment_status}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, payment_status: e.target.value }))}
                            required
                          >
                            <option value="pending">Pending</option>
                            <option value="partial">Partial</option>
                            <option value="paid">Paid</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expected Delivery Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={purchaseOrder.expected_delivery_date}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Actual Delivery Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={purchaseOrder.actual_delivery_date || ''}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, actual_delivery_date: e.target.value }))}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Remarks</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={purchaseOrder.remark}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, remark: e.target.value }))}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Card className="mb-3">
                      <Card.Header>
                        <h5 className="card-title">Items</h5>
                      </Card.Header>
                      <Card.Body>
                        <Table responsive>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Brand</th>
                              <th>Quantity</th>
                              <th>Unit Cost (Foreign)</th>
                              <th>Unit Cost (Local)</th>
                              <th>Line Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {purchaseOrder.items.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <div>
                                    <strong>{item.product?.name}</strong>
                                    {item.product?.media && item.product.media.length > 0 && (
                                      <div className="mt-2">
                                        <img
                                          src={`${process.env.NEXT_PUBLIC_WIX_IMAGE_URL}/${item.product.media[0]}`}
                                          alt={item.product.name}
                                          style={{ maxWidth: '100px', maxHeight: '100px' }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td>{item.product?.brand}</td>
                                <td>{item.quantity}</td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={item.unit_cost}
                                    onChange={(e) => handleUpdateItemCost(index, e.target.value)}
                                  />
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={item.unit_cost_local}
                                    onChange={(e) => handleUpdateItemLocalCost(index, e.target.value)}
                                  />
                                </td>
                                <td>
                                  {item.line_total} {purchaseOrder.currency}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>

                    <Card className="mb-3">
                      <Card.Header>
                        <h5 className="card-title">Payments</h5>
                      </Card.Header>
                      <Card.Body>
                        <Table responsive>
                          <thead>
                            <tr>
                              <th>Payment Date</th>
                              <th>Foreign Amount</th>
                              <th>Local Amount</th>
                              <th>Attachments</th>
                            </tr>
                          </thead>
                          <tbody>
                            {purchaseOrder.payments.map((payment, index) => (
                              <tr key={index}>
                                <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                <td>
                                  {payment.foreign_amount} {purchaseOrder.currency}
                                </td>
                                <td>
                                  {payment.local_amount} MYR
                                </td>
                                <td>
                                  {payment.attachments && payment.attachments.length > 0 ? (
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => window.open(payment.attachments[0].url, '_blank')}
                                    >
                                      View Receipt
                                    </Button>
                                  ) : (
                                    <span className="text-muted">No receipt</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3" className="text-end">
                                <strong>Total Paid:</strong>
                              </td>
                              <td>
                                {purchaseOrder.payments.reduce((sum, payment) => 
                                  sum + parseFloat(payment.foreign_amount), 0
                                )} {purchaseOrder.currency}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="3" className="text-end">
                                <strong>Balance:</strong>
                              </td>
                              <td>
                                {parseFloat(purchaseOrder.total_cost) - 
                                 purchaseOrder.payments.reduce((sum, payment) => 
                                   sum + parseFloat(payment.foreign_amount), 0
                                )} {purchaseOrder.currency}
                              </td>
                            </tr>
                          </tfoot>
                        </Table>
                      </Card.Body>
                    </Card>

                    <Form.Group className="mb-3">
                      <Form.Label>Attachment</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf"
                      />
                      {filePreview && (
                        <div className="mt-2">
                          <img
                            src={filePreview}
                            alt="Preview"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="ms-2"
                            onClick={handleRemoveAttachment}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </Form.Group>

                    <Modal
                      show={showPreviewModal}
                      onHide={handleClosePreviewModal}
                      size="lg"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Attachment Preview</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {filePreview && (
                          <div className="text-center">
                            {filePreview.type === 'application/pdf' ? (
                              <iframe
                                src={filePreview}
                                style={{ width: '100%', height: '70vh' }}
                                title="PDF Preview"
                              />
                            ) : (
                              <img
                                src={filePreview}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '70vh' }}
                              />
                            )}
                          </div>
                        )}
                      </Modal.Body>
                    </Modal>

                    <div className="d-flex gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Purchase Order'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => router.push('/components/purchaseorder/viewpurchaseorders')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

EditPurchaseOrder.layout = "Contentlayout";

export default EditPurchaseOrder; 
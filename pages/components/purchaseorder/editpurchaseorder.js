import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Row, Col, Alert, Modal } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";

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
    remark: '',
    items: [],
    attachments: []
  });
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      if (!id) return;
      
      try {
        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPurchaseOrder(data);
          if (data.attachments && data.attachments.length > 0) {
            try {
              const attachmentResponse = await fetchWithTokenRefresh(data.attachments[0].url);
              if (attachmentResponse.ok) {
                const blob = await attachmentResponse.blob();
                const url = window.URL.createObjectURL(blob);
                setFilePreview(url);
              }
            } catch (err) {
              console.error('Error loading attachment preview:', err);
            }
          }
        } else {
          setError('Failed to fetch purchase order details');
        }
      } catch (err) {
        setError('Error fetching purchase order details');
      }
    };

    fetchPurchaseOrder();

    // Cleanup function to revoke object URLs
    return () => {
      if (filePreview) {
        window.URL.revokeObjectURL(filePreview);
      }
    };
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('order_number', purchaseOrder.order_number);
      formData.append('supplier_id', purchaseOrder.supplier_id);
      formData.append('total_cost', purchaseOrder.total_cost);
      formData.append('currency', purchaseOrder.currency);
      formData.append('order_date', purchaseOrder.order_date);
      formData.append('expected_delivery_date', purchaseOrder.expected_delivery_date);
      formData.append('remark', purchaseOrder.remark);
      formData.append('items', JSON.stringify(purchaseOrder.items));

      if (purchaseOrder.attachments && purchaseOrder.attachments.length > 0) {
        formData.append('attachment', purchaseOrder.attachments[0].file);
      }

      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders/${id}`, {
        method: 'PUT',
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
                          <Form.Control
                            type="text"
                            value={purchaseOrder.supplier_id}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, supplier_id: e.target.value }))}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Total Cost</Form.Label>
                          <Form.Control
                            type="number"
                            value={purchaseOrder.total_cost}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, total_cost: e.target.value }))}
                            required
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
                          <Form.Label>Expected Delivery Date</Form.Label>
                          <Form.Control
                            type="month"
                            value={purchaseOrder.expected_delivery_date}
                            onChange={(e) => setPurchaseOrder(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={purchaseOrder.remark}
                        onChange={(e) => setPurchaseOrder(prev => ({ ...prev, remark: e.target.value }))}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Attachment</Form.Label>
                      <div className="d-flex gap-2 align-items-center">
                        <Form.Control
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        {filePreview && (
                          <>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => setShowPreviewModal(true)}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={handleRemoveAttachment}
                            >
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
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
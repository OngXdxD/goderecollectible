import { useState } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../../shared/utils/auth';

const PaymentModal = ({ 
  show, 
  onHide, 
  order, 
  onSuccess,
  onError 
}) => {
  const [paymentDetails, setPaymentDetails] = useState({
    foreign_amount: order?.total_cost || '',
    local_amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    attachments: []
  });
  const [receiptPreviews, setReceiptPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleReceiptUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Clear previous previews
      receiptPreviews.forEach(preview => {
        window.URL.revokeObjectURL(preview);
      });

      const newPreviews = [];
      const newAttachments = [];

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          newAttachments.push(file);
          
          if (newPreviews.length === files.length) {
            setReceiptPreviews(newPreviews);
            setPaymentDetails(prev => ({
              ...prev,
              attachments: newAttachments
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveReceipt = (index) => {
    const newPreviews = [...receiptPreviews];
    const newAttachments = [...paymentDetails.attachments];
    
    window.URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    newAttachments.splice(index, 1);
    
    setReceiptPreviews(newPreviews);
    setPaymentDetails(prev => ({
      ...prev,
      attachments: newAttachments
    }));
  };

  const handleSubmitPayment = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('purchase_order_id', order.id);
      formData.append('foreign_amount', paymentDetails.foreign_amount);
      formData.append('local_amount', paymentDetails.local_amount);
      formData.append('payment_date', paymentDetails.payment_date);
      
      // Append each attachment
      paymentDetails.attachments.forEach((file, index) => {
        formData.append('attachments', file);
      });

      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-order-payments`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        onSuccess();
        onHide();
      } else {
        const data = await response.json();
        onError(data.message || 'Failed to process payment');
      }
    } catch (err) {
      onError('Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    receiptPreviews.forEach(preview => {
      window.URL.revokeObjectURL(preview);
    });
    setReceiptPreviews([]);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Process Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {order && (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Order Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={order.order_number}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Foreign Amount ({order.currency})</Form.Label>
                  <Form.Control
                    type="number"
                    value={paymentDetails.foreign_amount}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, foreign_amount: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Local Amount (MYR)</Form.Label>
                  <Form.Control
                    type="number"
                    value={paymentDetails.local_amount}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, local_amount: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={paymentDetails.payment_date}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, payment_date: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Payment Receipts</Form.Label>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="file"
                  onChange={handleReceiptUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                />
              </div>
              {receiptPreviews.length > 0 && (
                <div className="mt-3">
                  <div className="d-flex flex-wrap gap-2">
                    {receiptPreviews.map((preview, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={preview}
                          alt={`Receipt ${index + 1}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => handleRemoveReceipt(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitPayment}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Payment'}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal; 
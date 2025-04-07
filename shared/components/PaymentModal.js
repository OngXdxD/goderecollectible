import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../utils/auth';

const PaymentModal = ({ show, onHide, order, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    foreign_amount: '0',
    local_amount: '0',
    payment_date: new Date().toISOString().split('T')[0],
    attachments: null
  });
  const [attachmentsPreviews, setattachmentsPreviews] = useState([]);

  // Reset payment details when order changes
  useEffect(() => {
    if (order) {
      setPaymentDetails({
        foreign_amount: order.currency !== 'MYR' ? order.remaining_balance : '0',
        local_amount: order.currency === 'MYR' ? order.remaining_balance : '0',
        payment_date: new Date().toISOString().split('T')[0],
        attachments: null
      });
      setattachmentsPreviews([]); // Clear any existing attachments previews
      setError(''); // Clear any existing errors
    }
  }, [order]);

  const handleattachmentsUpload = (e) => {
    const files = Array.from(e.target.files);
    setPaymentDetails(prev => ({
      ...prev,
      attachments: files
    }));

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setattachmentsPreviews(previews);
  };

  const handleRemoveattachments = (index) => {
    setPaymentDetails(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
    setattachmentsPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('purchase_order_id', order.id);
      formData.append('foreign_amount', paymentDetails.foreign_amount);
      formData.append('local_amount', paymentDetails.local_amount);
      formData.append('payment_date', paymentDetails.payment_date);
      
      if (paymentDetails.attachments) {
        paymentDetails.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const response = await fetchWithTokenRefresh(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-order-payments`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit payment');
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Order Number</Form.Label>
            <Form.Control type="text" value={order?.order_number} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Foreign Amount ({order?.currency})</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={paymentDetails.foreign_amount}
              onChange={(e) => setPaymentDetails(prev => ({
                ...prev,
                foreign_amount: e.target.value
              }))}
              disabled={order?.currency === 'MYR'}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Local Amount (MYR)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={paymentDetails.local_amount}
              onChange={(e) => setPaymentDetails(prev => ({
                ...prev,
                local_amount: e.target.value
              }))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Date</Form.Label>
            <Form.Control
              type="date"
              value={paymentDetails.payment_date}
              onChange={(e) => setPaymentDetails(prev => ({
                ...prev,
                payment_date: e.target.value
              }))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Receipt</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleattachmentsUpload}
              accept="image/*,.pdf"
            />
            {attachmentsPreviews.length > 0 && (
              <div className="mt-2">
                {attachmentsPreviews.map((preview, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <img
                      src={preview}
                      alt={`attachments preview ${index + 1}`}
                      style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveattachments(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Payment'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal; 
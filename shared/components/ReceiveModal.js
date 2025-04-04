import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../utils/auth';

const ReceiveModal = ({ show, onHide, order, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchWithTokenRefresh(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/purchase-orders/${order.id}/receive`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update order status');
        onError(data.message || 'Failed to update order status');
      }
    } catch (err) {
      setError('Error updating order status');
      onError('Error updating order status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Are you sure you want to mark order <strong>{order?.order_number}</strong> as received?</p>
        <p>This will update the stock inventory with the received items.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleConfirm} disabled={loading}>
          {loading ? 'Processing...' : 'Yes, I have received the items'}
        </Button>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReceiveModal; 
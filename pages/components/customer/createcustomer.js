import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";

const CreateCustomer = () => {
  const router = useRouter();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    country: '',
    status: 'active'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer)
      });

      if (response.ok) {
        setSuccess('Customer created successfully');
        setTimeout(() => {
          router.push('/components/customer/viewcustomers');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create customer');
      }
    } catch (err) {
      setError('Error creating customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Create Customer" />
      <div>
        <Pageheader title="CREATE CUSTOMER" heading="Customers" active="Create Customer" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <Card>
                <Card.Header>
                  <h4 className="card-title">Create New Customer</h4>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name *</Form.Label>
                          <Form.Control
                            type="text"
                            value={customer.name}
                            onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                            required
                            maxLength={100}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="text"
                            value={customer.phone}
                            onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                            maxLength={20}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={customer.email}
                            onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                            maxLength={100}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            type="text"
                            value={customer.country}
                            onChange={(e) => setCustomer(prev => ({ ...prev, country: e.target.value }))}
                            maxLength={50}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={customer.address}
                            onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? 'Creating...' : 'Create Customer'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => router.push('/components/customer/viewcustomers')}
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

CreateCustomer.layout = "Contentlayout";

export default CreateCustomer; 
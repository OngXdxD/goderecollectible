import { useState } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';

const CreateSupplier = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [supplier, setSupplier] = useState({
    name: '',
    contact_info: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create supplier');
      }
      
      setSuccess('Supplier created successfully!');
      setSupplier({
        name: '',
        contact_info: ''
      });
    } catch (err) {
      setError('Failed to create supplier: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Create Supplier" />
      <div>
        <Pageheader title="CREATE SUPPLIER" heading="Suppliers" active="Create Supplier" />
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
                        <Form.Label>Supplier Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={supplier.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter supplier name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Info</Form.Label>
                        <Form.Control
                          type="text"
                          name="contact_info"
                          value={supplier.contact_info}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter contact information"
                        />
                        <Form.Text className="text-muted">
                          Contact information can be an email, phone number, or contact person's name.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Supplier'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

CreateSupplier.layout = "Contentlayout";

export default CreateSupplier; 
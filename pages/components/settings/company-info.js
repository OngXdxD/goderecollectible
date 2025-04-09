import { useState, useEffect } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';

const CompanyInfo = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    address: '',
    phone: '',
    registration_number: '',
  });

  // Fetch existing company info
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/companies`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data) {
            // Use the first company in the list
            setCompanyInfo({
              id: data.id,
              name: data.name || '',
              address: data.address || '',
              phone: data.phone || '',
              registration_number: data.registration_number || '',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching company info:', err);
        setError('Failed to load company information');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Check if we need to create or update
      let response;
      
      if (companyInfo.id) {
        // Update existing company
        response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/companies/${companyInfo.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: companyInfo.name,
            address: companyInfo.address,
            phone: companyInfo.phone,
            registration_number: companyInfo.registration_number,
          })
        });
      } else {
        // Create new company
        response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/companies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: companyInfo.name,
            address: companyInfo.address,
            phone: companyInfo.phone,
            registration_number: companyInfo.registration_number,
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save company information');
      }

      setSuccess('Company information saved successfully!');
    } catch (err) {
      console.error('Error saving company info:', err);
      setError(err.message || 'An error occurred while saving the company information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <>
      <Seo title="Company Information" />
      <div>
        <Pageheader title="COMPANY INFORMATION" heading="Settings" active="Company Information" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                {success && <Alert variant="success" className="mb-3">{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={companyInfo.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <Form.Label>Registration Number (Company ID)</Form.Label>
                    <Form.Control
                      type="text"
                      name="registration_number"
                      value={companyInfo.registration_number}
                      onChange={handleInputChange}
                      placeholder="Enter company registration number"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={companyInfo.phone}
                      onChange={handleInputChange}
                      placeholder="Enter company phone number"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="address"
                      value={companyInfo.address}
                      onChange={handleInputChange}
                      placeholder="Enter company address"
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Company Information'}
                    </Button>
                  </div>
                </Form>

                <div className="mt-4">
                  <p className="text-muted mb-0">
                    This information will be used on your sales orders, invoices, and other 
                    documents that are printed or shared with customers.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

CompanyInfo.layout = "Contentlayout";

export default CompanyInfo; 
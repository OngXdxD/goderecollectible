import { useState, useEffect } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';

const WixConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [config, setConfig] = useState({
    wix_account_id: '',
    wix_api_key: '',
    wix_site_id: ''
  });

  // Fetch existing config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/settings`);
        if (response.ok) {
          const data = await response.json();
          setConfig({
            wix_account_id: data.wix_account_id || '',
            wix_api_key: data.wix_api_key || '',
            wix_site_id: data.wix_site_id || ''
          });
        }
      } catch (err) {
        console.error('Error fetching Wix config:', err);
        setError('Failed to load Wix configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
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
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save configuration');
      }

      setSuccess('Wix configuration saved successfully!');
    } catch (err) {
      console.error('Error saving Wix config:', err);
      setError(err.message || 'An error occurred while saving the configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <>
      <Seo title="Wix Configuration" />
      <div>
        <Pageheader title="WIX CONFIGURATION" heading="Settings" active="Wix Configuration" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                {success && <Alert variant="success" className="mb-3">{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <Form.Label>Wix Account ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="wix_account_id"
                      value={config.wix_account_id}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your Wix Account ID"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <Form.Label>API Key</Form.Label>
                    <Form.Control
                      type="password"
                      name="wix_api_key"
                      value={config.wix_api_key}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your Wix API Key"
                    />
                  </div>

                  <div className="form-group mb-4">
                    <Form.Label>Site ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="wix_site_id"
                      value={config.wix_site_id}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your Wix Site ID"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </Form>

                <div className="mt-4">
                  <h5>How to find these values:</h5>
                  <ol className="ps-3">
                    <li>Log in to your Wix account</li>
                    <li>Go to the Developer Tools section</li>
                    <li>Navigate to the API Keys section</li>
                    <li>Your Account ID and Site ID will be displayed there</li>
                    <li>Generate a new API Key if you don't have one</li>
                  </ol>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

WixConfig.layout = "Contentlayout";

export default WixConfig; 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Table, Button, Alert, Spinner } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/suppliers?limit=25&sortBy=name:asc`);
      if (!response.ok) throw new Error('Failed to fetch suppliers');
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

  return (
    <>
      <Seo title="Suppliers" />
      <div>
        <Pageheader title="SUPPLIERS" heading="Suppliers" active="Suppliers List" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title">Suppliers List</h4>
                  <Link href="/components/supplier/createsupplier">
                    <Button variant="primary">Add New Supplier</Button>
                  </Link>
                </div>
                
                {loading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact Info</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center">No suppliers found</td>
                        </tr>
                      ) : (
                        suppliers.map((supplier) => (
                          <tr key={supplier.id}>
                            <td>{supplier.name}</td>
                            <td>{supplier.contact_info || '-'}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link href={`/components/supplier/edit/${supplier.id}`}>
                                  <Button variant="info" size="sm">Edit</Button>
                                </Link>
                                <Button 
                                  variant="danger" 
                                  size="sm"
                                  onClick={() => {
                                    // Delete functionality would go here
                                    alert('Delete functionality to be implemented');
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

Suppliers.layout = "Contentlayout";

export default Suppliers; 
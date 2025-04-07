import React, { useState, useEffect } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Table, Button, Form, Alert, Badge } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import Link from 'next/link';

const ViewInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('product_name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/inventory`);
      
      if (response.status === 401) {
        setError('Authentication error: Please log in to view inventory');
        return;
      }
      
      if (!response.ok) throw new Error(`Failed to fetch inventory: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      setError('Failed to load inventory: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort inventory
  const filteredAndSortedInventory = inventory
    .filter(item => {
      return (item?.product?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const aValue = sortField.includes('.') 
        ? sortField.split('.').reduce((obj, key) => obj?.[key], a)
        : a[sortField];
      const bValue = sortField.includes('.') 
        ? sortField.split('.').reduce((obj, key) => obj?.[key], b)
        : b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get stock status badge variant
  const getStockStatusVariant = (quantity_ordered, quantity_received) => {
    if (quantity_ordered < 0) return 'danger'; // Insufficient Stock
    if (quantity_ordered > 0 && quantity_received === 0) return 'warning'; // Pending Release
    return 'success'; // In Stock
  };

  // Get stock status text
  const getStockStatusText = (quantity_ordered, quantity_received) => {
    if (quantity_ordered < 0) return 'Insufficient Stock';
    if (quantity_ordered > 0 && quantity_received === 0) return 'Pending Release';
    return 'In Stock';
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'CNY'
    }).format(amount);
  };

  return (
    <>
      <Seo title="View Inventory" />
      <div>
        <Pageheader title="VIEW INVENTORY" heading="Inventory" active="View Inventory" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex gap-3 align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Search by product name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: '300px' }}
                    />
                  </div>
                  <Link href="/components/purchaseorder/createpurchaseorder">
                    <Button variant="primary" className="d-flex align-items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        className="bi bi-plus-circle me-1" 
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>
                      New Purchase Order
                    </Button>
                  </Link>
                </div>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('product.name')}
                      >
                        Product Name
                        {sortField === 'product.name' && (
                          <span className="ms-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('quantity_ordered')}
                      >
                        Ordered
                        {sortField === 'quantity_ordered' && (
                          <span className="ms-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('quantity_received')}
                      >
                        Stock On Hand
                        {sortField === 'quantity_received' && (
                          <span className="ms-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('unit_cost')}
                      >
                        Unit Cost
                        {sortField === 'unit_cost' && (
                          <span className="ms-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th>Total Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredAndSortedInventory.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No inventory items found
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedInventory.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product?.name}</td>
                          <td>{item.quantity_ordered}</td>
                          <td>{item.quantity_received}</td>
                          <td>{formatCurrency(item.unit_cost)}</td>
                          <td>{formatCurrency(item.unit_cost * item.quantity_received)}</td>
                          <td>
                            <Badge bg={getStockStatusVariant(item.quantity_ordered, item.quantity_received)}>
                              {getStockStatusText(item.quantity_ordered, item.quantity_received)}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

ViewInventory.layout = "Contentlayout";

export default ViewInventory; 
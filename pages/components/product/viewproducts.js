import { useState, useEffect } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Table, Button, Form, Alert, Badge } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const router = useRouter();

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products`);
      
      if (response.status === 401) {
        setError('Authentication error: Please log in to view products');
        return;
      }
      
      if (!response.ok) throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(product => product.category))].filter(Boolean);

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'CNY'
    }).format(amount);
  };

  const handleEdit = (product) => {
    router.push(`/components/product/editproduct/${product.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchProducts(); // Refresh the list
        } else {
          setError('Failed to delete product');
        }
      } catch (err) {
        setError('Error deleting product');
      }
    }
  };

  return (
    <>
      <Seo title="View Products" />
      <div>
        <Pageheader title="VIEW PRODUCTS" heading="Products" active="View Products" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex gap-3 align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Search by name, description, or SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: '300px' }}
                    />
                    <Form.Select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      style={{ width: '150px' }}
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <Link href="/components/product/createproduct">
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
                      New Product
                    </Button>
                  </Link>
                </div>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('name')}
                      >
                        Name
                        {sortField === 'name' && (
                          <span className="ms-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('price')}
                      >
                        Price
                        {sortField === 'price' && (
                          <span className="ms-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredAndSortedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedProducts.map(product => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.sku}</td>
                          <td>{product.category}</td>
                          <td>{product.description}</td>
                          <td>{formatCurrency(product.price, product.currency)}</td>
                          <td>
                            <Badge bg={product.status === 'active' ? 'success' : 'secondary'}>
                              {product.status || 'Inactive'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleEdit(product)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

ViewProducts.layout = "Contentlayout";

export default ViewProducts; 
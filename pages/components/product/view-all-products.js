import { useState, useEffect } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Table, Form, InputGroup, Pagination, Alert } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    sortBy: 'createdAt:desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  const categories = [
    'Blind Boxes',
    'Figures',
    'GK Resin',
    'Statues',
  ];

  const sortOptions = [
    { value: 'createdAt:desc', label: 'Newest First' },
    { value: 'createdAt:asc', label: 'Oldest First' },
    { value: 'local_selling_price:desc', label: 'Price: High to Low' },
    { value: 'local_selling_price:asc', label: 'Price: Low to High' },
    { value: 'name:asc', label: 'Name: A to Z' },
    { value: 'name:desc', label: 'Name: Z to A' },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/all-products?page=${currentPage}&limit=${limit}`;

      // Add filters to URL
      if (filters.brand) url += `&brand=${encodeURIComponent(filters.brand)}`;
      if (filters.category) url += `&category=${encodeURIComponent(filters.category)}`;
      if (filters.sortBy) url += `&sortBy=${encodeURIComponent(filters.sortBy)}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetchWithTokenRefresh(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.results);
      setTotalPages(Math.ceil(data.totalResults / limit));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters, searchTerm]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
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
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                
                {/* Filters */}
                <div className="filters-section mb-4">
                  <Row>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Search</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                          type="text"
                          name="brand"
                          value={filters.brand}
                          onChange={handleFilterChange}
                          placeholder="Filter by brand"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="category"
                          value={filters.category}
                          onChange={handleFilterChange}
                        >
                          <option value="">All Categories</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Sort By</Form.Label>
                        <Form.Select
                          name="sortBy"
                          value={filters.sortBy}
                          onChange={handleFilterChange}
                        >
                          {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Products Table */}
                <div className="table-responsive">
                  <Table className="table-hover">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Foreign Price</th>
                        <th>Local Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4">Loading...</td>
                        </tr>
                      ) : products.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4">No products found</td>
                        </tr>
                      ) : (
                        products.map(product => (
                          <tr key={product.id}>
                            <td>
                              <img
                                src={product.cover_photo || '/assets/images/no-image.png'}
                                alt={product.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.brand || '-'}</td>
                            <td>{product.category}</td>
                            <td>{formatPrice(product.foreign_selling_price, product.currency)}</td>
                            <td>{formatPrice(product.local_selling_price, 'MYR')}</td>
                            <td>
                              <button className="btn btn-primary btn-sm me-2">Edit</button>
                              <button className="btn btn-danger btn-sm">Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      />
                      
                      {[...Array(totalPages)].map((_, idx) => (
                        <Pagination.Item
                          key={idx + 1}
                          active={currentPage === idx + 1}
                          onClick={() => setCurrentPage(idx + 1)}
                        >
                          {idx + 1}
                        </Pagination.Item>
                      ))}
                      
                      <Pagination.Next
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      />
                      <Pagination.Last
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

ViewAllProducts.layout = "Contentlayout";

export default ViewAllProducts; 
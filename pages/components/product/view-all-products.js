import { useState, useEffect } from 'react';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Table, Form, InputGroup, Pagination, Alert, Badge, Button } from "react-bootstrap";
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
      setError('');
      
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
      
      // Check if data is already an array (direct response format)
      // or if it has a data property containing the products
      const productsData = Array.isArray(data) ? data : (data.data || []);
      
      setProducts(productsData);
      
      // Set total pages based on response metadata if available
      if (data.totalPages) {
        setTotalPages(data.totalPages);
      } else if (data.totalResults) {
        setTotalPages(Math.ceil(data.totalResults / limit));
      } else {
        // If no pagination info, assume we have all results
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'An error occurred while fetching products');
      setProducts([]);
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

  const ProductImage = ({ imageUrl, alt }) => {
    if (!imageUrl) {
      return (
        <div className="product-image-placeholder" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
      );
    }

    // Construct the full URL using the Wix image URL and the filename
    const fullUrl = `${process.env.NEXT_PUBLIC_WIX_IMAGE_URL}${imageUrl}`;

    return (
      <div className="product-image" style={{ width: '50px', height: '50px', overflow: 'hidden' }}>
        <img 
          src={fullUrl} 
          alt={alt || 'Product image'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = '/images/placeholder.png'; // Fallback image
          }}
        />
      </div>
    );
  };

  // Get the url from platform_urls array
  const getProductUrl = (platformUrls, urlType) => {
    if (!platformUrls || !Array.isArray(platformUrls) || platformUrls.length === 0) {
      return null;
    }

    // Find the first URL that has the requested type
    for (const urlObj of platformUrls) {
      if (urlObj && urlObj[urlType]) {
        return urlObj[urlType];
      }
    }
    
    return null;
  };

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                        <th>Shopee</th>
                        <th>Wix</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="9" className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : !Array.isArray(products) || products.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-4">No products found</td>
                        </tr>
                      ) : (
                        products.map(product => (
                          <tr key={product.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <ProductImage 
                                  imageUrl={Array.isArray(product.media) && product.media.length > 0 ? product.media[0] : null} 
                                  alt={product.name}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="ms-3">
                                <div className="fw-bold">{product.name}</div>
                              </div>
                            </td>
                            <td>{product.brand || '-'}</td>
                            <td>{product.category || '-'}</td>
                            <td>{formatPrice(product.foreign_selling_price, product.currency)}</td>
                            <td>{formatPrice(product.local_selling_price, 'MYR')}</td>
                            <td>
                              {/* Shopee URL */}
                              {product.shopee_url ? (
                                <a 
                                  href={product.shopee_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-link btn-sm p-0"
                                >
                                  Click here
                                </a>
                              ) : getProductUrl(product.platform_urls, 'shopee_url') ? (
                                <a 
                                  href={getProductUrl(product.platform_urls, 'shopee_url')} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-link btn-sm p-0"
                                >
                                  Click here
                                </a>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              {/* Wix URL */}
                              {getProductUrl(product.platform_urls, 'wix_url') ? (
                                <a 
                                  href={getProductUrl(product.platform_urls, 'wix_url')} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-link btn-sm p-0"
                                >
                                  Click here
                                </a>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => window.location.href = `/components/product/edit-all-product/${product.id}`}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this product?')) {
                                    // Handle delete
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First 
                        onClick={() => handlePageChange(1)} 
                        disabled={currentPage === 1}
                      />
                      <Pagination.Prev 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                      />
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pagination items around the current page
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <Pagination.Item
                            key={pageNumber}
                            active={pageNumber === currentPage}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </Pagination.Item>
                        );
                      })}
                      
                      <Pagination.Next 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                      />
                      <Pagination.Last 
                        onClick={() => handlePageChange(totalPages)} 
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
import { useState, useRef } from 'react';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { Card, Row, Col, Alert } from "react-bootstrap";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const CreateAllProduct = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const isUploadingRef = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    foreignPrice: '',
    currency: 'USD',
    localPrice: '',
    brand: '',
    category: '',
    description: ''
  });

  const currencies = [
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'USD', name: 'US Dollar' },
  ];

  const categories = [
    'Blind Boxes',
    'Figures',
    'GK Resin',
    'Statues',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpdate = async (fileItems) => {
    console.log('File Items:', fileItems);
    
    // If already uploading, skip
    if (isUploadingRef.current) {
      return;
    }

    // If there are no files, reset the uploaded media
    if (!fileItems.length) {
      setFiles([]);
      setUploadedMedia([]);
      return;
    }

    try {
      isUploadingRef.current = true;
      // Update files state
      setFiles(fileItems);
      
      // Get filenames of already uploaded media to prevent duplicates
      const existingFilenames = new Set(uploadedMedia.map(media => media.filename));
      
      // Filter out files that have already been uploaded
      const newFiles = fileItems.filter(item => !existingFilenames.has(item.filename))
        .map(item => item.file);
      
      // Only proceed with upload if there are new files
      if (newFiles.length > 0) {
        console.log('Uploading new files:', newFiles);

        const formData = new FormData();
        newFiles.forEach(file => {
          formData.append('files', file);
        });
        formData.append('displayName', 'product-images');
        formData.append('private', 'false');

        const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/media`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to upload images');
        }

        const data = await response.json();
        if (data.successful && data.successful.length > 0) {
          const newUploadedMedia = data.successful.map(item => ({
            wixMediaId: item.wixMediaId,
            mediaUrl: item.url,
            filename: item.filename
          }));
          
          setUploadedMedia(prevMedia => {
            const updatedMedia = [...prevMedia];
            newUploadedMedia.forEach(media => {
              if (!updatedMedia.some(existing => existing.wixMediaId === media.wixMediaId)) {
                updatedMedia.push(media);
              }
            });
            return updatedMedia;
          });
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image(s): ' + error.message);
    } finally {
      isUploadingRef.current = false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Prepare the product data
      const productData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        foreign_selling_price: parseFloat(formData.foreignPrice),
        currency: formData.currency,
        local_selling_price: parseFloat(formData.localPrice),
        wix_url: '', // Left blank as per requirement
        shopee_url: '', // Left blank as per requirement
        images: uploadedMedia.map(media => media.wixMediaId)
      };

      console.log('Submitting product data:', productData);

      const response = await fetchWithTokenRefresh(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/all-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        foreignPrice: '',
        currency: 'USD',
        localPrice: '',
        brand: '',
        category: '',
        description: ''
      });
      setFiles([]);
      setUploadedMedia([]);

    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'An error occurred while creating the product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Create Product" />
      <div>
        <Pageheader title="CREATE PRODUCT" heading="Products" active="Create Product" />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body>
                <div className="create-all-product-container">
                  {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                  {success && <Alert variant="success" className="mb-3">Product created successfully!</Alert>}
                  
                  <form onSubmit={handleSubmit}>
                    <Row>
                      {/* Left Side - Product Details */}
                      <Col md={6} className="product-details">
                        <div className="form-section">
                          <h2>Product Information</h2>
                          <div className="form-group">
                            <label htmlFor="name">Product Name *</label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              maxLength={100}
                              placeholder="Enter product name"
                            />
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="foreignPrice">Foreign Selling Price *</label>
                              <div className="price-input-group">
                                <input
                                  type="number"
                                  id="foreignPrice"
                                  name="foreignPrice"
                                  value={formData.foreignPrice}
                                  onChange={handleInputChange}
                                  step="0.01"
                                  min="0"
                                  required
                                  placeholder="0.00"
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label htmlFor="currency">Currency *</label>
                              <select
                                id="currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                                required
                                className="form-select"
                              >
                                {currencies.map(currency => (
                                  <option key={currency.code} value={currency.code}>
                                    {currency.code} - {currency.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="localPrice">Local Selling Price (MYR) *</label>
                            <div className="price-input-group">
                              <input
                                type="number"
                                id="localPrice"
                                name="localPrice"
                                value={formData.localPrice}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                required
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="brand">Brand</label>
                            <input
                              type="text"
                              id="brand"
                              name="brand"
                              value={formData.brand}
                              onChange={handleInputChange}
                              placeholder="Enter brand name"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              required
                              className="form-select"
                            >
                              <option value="">Select a category</option>
                              {categories.map(category => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              rows="6"
                              placeholder="Enter product description"
                            />
                          </div>
                        </div>

                        <div className="form-actions">
                          <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating Product...' : 'Create Product'}
                          </button>
                        </div>
                      </Col>

                      {/* Right Side - Image Upload */}
                      <Col md={6} className="image-upload">
                        <div className="form-section">
                          <h2>Product Images</h2>
                          <FilePond
                            files={files}
                            onupdatefiles={handleFileUpdate}
                            allowMultiple={true}
                            maxFiles={20}
                            name="files"
                            labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
                            className="product-filepond"
                          />
                          <div className="image-guidelines">
                            <h3>Image Guidelines:</h3>
                            <ul>
                              <li>Maximum 20 images allowed</li>
                              <li>Supported formats: JPG, PNG, WEBP</li>
                              <li>Maximum file size: 5MB per image</li>
                              <li>Recommended resolution: 1000x1000 pixels</li>
                              <li>First image will be used as the main product image</li>
                            </ul>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

CreateAllProduct.layout = "Contentlayout";

export default CreateAllProduct; 
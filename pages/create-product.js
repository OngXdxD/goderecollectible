import { useState, useEffect } from 'react';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Select from 'react-select';

registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

export default function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const [productOptions, setProductOptions] = useState([
    {
      name: "Shipping Fees",
      values: ["Shipping fees excluded contact us for quotation"]
    },
    {
      name: "Payment",
      values: ["Deposit", "Full Payment"]
    }
  ]);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [additionalInfoSections, setAdditionalInfoSections] = useState([
    {
      title: "Shipping Info",
      description: `Shipping fees for this product is EXCLUDED. 

We offer TAX FREE SHIPPING to every countries.

Air, sea, and railway shipping are available

You may message us for a quotation on the shipping fees first before making the payment.

The shipping fees will be quote after the payment made.

The shipping fees may vary depends on the country of the receiver.`
    },
    {
      title: "Product Info",
      description: ""
    }
  ]);

  const ribbonOptions = [
    { value: "Pre-Order", label: "Pre-Order" },
    { value: "Ready Stock", label: "Ready Stock" },
    { value: "Waiting List", label: "Waiting List" }
  ];

  const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDEyNjYyMjUsInVzZXJJZCI6MiwiaWF0IjoxNzM4Njc0MjI1fQ.GtsrP5Mmkc_5Txy2DNN5xILox8WEAHpJIJt9TgntWoc";

  const uploadImage = async (file) => {
    try {
      if (!file) {
        throw new Error('File is required');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('displayName', file.filename || 'product-image');
      formData.append('private', 'false');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authorization}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleAddOption = () => {
    setProductOptions([...productOptions, { name: "", values: [] }]);
  };

  const handleAddChoice = (optionIndex) => {
    const newOptions = [...productOptions];
    newOptions[optionIndex].values.push("");
    setProductOptions(newOptions);
  };

  const handleChoiceChange = (optionIndex, choiceIndex, value) => {
    const newOptions = [...productOptions];
    newOptions[optionIndex].values[choiceIndex] = value;
    setProductOptions(newOptions);
  };

  const handleOptionChange = (optionIndex, field, value) => {
    const newOptions = [...productOptions];
    newOptions[optionIndex][field] = value;
    setProductOptions(newOptions);
  };

  const handleRemoveOption = (optionIndex) => {
    const newOptions = productOptions.filter((_, index) => index !== optionIndex);
    setProductOptions(newOptions);
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products/collections`, {
        headers: {
          'Authorization': `Bearer ${authorization}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data = await response.json();
      const formattedCollections = data.collections.map(collection => ({
        value: collection.name,
        label: collection.name
      }));
      setCollections(formattedCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleInfoSectionChange = (index, field, value) => {
    const newSections = [...additionalInfoSections];
    newSections[index][field] = value;
    setAdditionalInfoSections(newSections);
  };

  const handleRibbonChange = (e) => {
    const ribbonValue = e.target.value;
    
    // Find matching collection
    const matchingCollection = collections.find(col => col.value === ribbonValue);
    
    if (matchingCollection) {
      // Add the matching collection to selected collections if not already present
      if (!selectedCollections.some(col => col.value === matchingCollection.value)) {
        setSelectedCollections([...selectedCollections, matchingCollection]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      let mediaUrl = '';
      if (files.length > 0) {
        mediaUrl = await uploadImage(files[0].file);
      }

      const formData = {
        name: e.target.name.value,
        slug: e.target.name.value.toLowerCase().replace(/ /g, '-'),
        productType: "physical",
        description: e.target.description.value,
        price: parseFloat(e.target.price.value),
        stock: parseInt(e.target.stock.value) || 0,
        sku: e.target.sku.value,
        brand: e.target.brand.value,
        mediaUrl: mediaUrl,
        visible: e.target.visible.checked,
        manageVariants: true,
        productOptions: productOptions,
        ribbon: e.target.ribbon.value,
        collections: selectedCollections.map(col => col.value),
        additionalInfoSections: additionalInfoSections
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authorization}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      setSuccess(true);
      e.target.reset();
      setFiles([]);
      setProductOptions([]);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-container">
      <div className="create-product-form">
        <h1>Create New Product</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Images</h2>
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={true}
              maxFiles={5}
              name="files"
              labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
              className="multiple-filepond"
            />
          </div>

          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU</label>
              <input type="text" id="sku" name="sku" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="4" />
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>
            {additionalInfoSections.map((section, index) => (
              <div key={index} className="info-section">
                <div className="form-group">
                  <label>Section Title</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleInfoSectionChange(index, 'title', e.target.value)}
                    className="form-input"
                    disabled={index === 0}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={section.description}
                    onChange={(e) => handleInfoSectionChange(index, 'description', e.target.value)}
                    className="form-textarea"
                    rows="6"
                    disabled={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="form-section">
            <h2>Pricing & Inventory</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (USD) *</label>
                <input type="number" id="price" name="price" step="0.01" required />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input type="number" id="stock" name="stock" min="0" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Product Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input type="text" id="brand" name="brand" />
              </div>

              <div className="form-group">
                <label htmlFor="ribbon">Product Status</label>
                <select 
                  id="ribbon" 
                  name="ribbon" 
                  className="form-select"
                  defaultValue=""
                  onChange={handleRibbonChange}
                >
                  <option value="" disabled>Select Status</option>
                  {ribbonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="collection">Collections</label>
              <Select
                id="collection"
                name="collection"
                value={selectedCollections}
                onChange={setSelectedCollections}
                options={collections}
                isMulti
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select Collections"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '46px',
                    background: '#fff',
                    borderColor: '#e2e8f0',
                    '&:hover': {
                      borderColor: '#4a90e2'
                    }
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#EBF5FF',
                    borderRadius: '4px',
                    margin: '2px',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#2B6CB0',
                    padding: '2px 6px',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#4299E1',
                    ':hover': {
                      backgroundColor: '#BEE3F8',
                      color: '#2C5282'
                    }
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected 
                      ? '#4a90e2' 
                      : state.isFocused 
                        ? '#f7fafc'
                        : undefined,
                    color: state.isSelected ? '#fff' : '#2d3748',
                    ':active': {
                      backgroundColor: '#4a90e2',
                      color: '#fff'
                    }
                  })
                }}
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Product Options</h2>
            <table className="options-table">
              <thead>
                <tr>
                  <th>Option Name</th>
                  <th>Values</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productOptions.map((option, optionIndex) => (
                  <tr key={optionIndex} className="option-row">
                    <td>
                      <input
                        type="text"
                        placeholder="Option Name"
                        value={option.name}
                        onChange={(e) => handleOptionChange(optionIndex, 'name', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <div className="values-group">
                        {option.values.map((value, valueIndex) => (
                          <input
                            key={valueIndex}
                            type="text"
                            placeholder="Enter option value"
                            value={value}
                            onChange={(e) => handleChoiceChange(optionIndex, valueIndex, e.target.value)}
                            className="table-input"
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() => handleAddChoice(optionIndex)}
                          className="btn-primary-light btn-sm"
                        >
                          + Value
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(optionIndex)}
                          className="btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button
              type="button"
              onClick={handleAddOption}
              className="btn-primary"
            >
              + Add New Option
            </button>
          </div>

          <div className="form-section">
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="visible" id="visible" />
                Visible in Store
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </form>

        {error && <div className="error-message">Error: {error}</div>}
        {success && <div className="success-message">Product created successfully!</div>}
      </div>

      <style jsx>{`
        .create-product-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 2rem;
        }

        .create-product-form {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h1 {
          color: #333;
          margin-bottom: 2rem;
          font-size: 1.8rem;
        }

        h2 {
          color: #666;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .form-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #555;
          font-weight: 500;
        }

        input[type="text"],
        input[type="number"],
        textarea,
        select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
          padding-right: 2.5rem;
        }

        .option-group {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .option-table {
          width: 100%;
        }

        .option-row {
          display: grid;
          grid-template-columns: minmax(200px, 1fr) 2fr;
          gap: 2rem;
          align-items: start;
        }

        .option-cell {
          display: flex;
          flex-direction: column;
        }

        .option-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .option-name-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .option-name-input:focus {
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
        }

        .values-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .choice-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.95rem;
          background: white;
          transition: all 0.2s;
        }

        .choice-input:focus {
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
        }

        input:disabled {
          background-color: #f8fafc;
          color: #718096;
          cursor: not-allowed;
          border-color: #edf2f7;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          font-size: 1rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .btn-primary-light {
          background: #eff6ff;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary-light:hover {
          background: #dbeafe;
          border-color: #93c5fd;
        }

        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.875rem;
          width: fit-content;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checkbox-group input[type="checkbox"] {
          width: 1.2rem;
          height: 1.2rem;
        }

        .form-actions {
          margin-top: 2rem;
          text-align: center;
        }

        .submit-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 4px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-btn:hover {
          background: #0056b3;
        }

        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 1rem;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .success-message {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 1rem;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .options-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .options-table th,
        .options-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: top;
        }

        .options-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #4a5568;
          text-align: left;
        }

        .table-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 0.95rem;
        }

        .values-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .table-actions {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .btn-danger {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-danger:hover {
          background: #fee2e2;
          border-color: #fca5a5;
        }

        @media (max-width: 768px) {
          .create-product-container {
            padding: 1rem;
          }

          .create-product-form {
            padding: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .option-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .options-table {
            display: block;
            overflow-x: auto;
          }
          
          .table-actions {
            flex-direction: column;
          }
        }

        .info-section {
          background: white;
          padding: 1.5rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          line-height: 1.5;
          resize: vertical;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }

        .form-textarea:disabled {
          background-color: #f8fafc;
          color: #718096;
          cursor: not-allowed;
        }

        .form-input:disabled {
          background-color: #f8fafc;
          color: #718096;
          cursor: not-allowed;
        }
      `}</style>

      <style jsx global>{`
        .react-select-container .react-select__control {
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          box-shadow: none;
        }

        .react-select-container .react-select__control:hover {
          border-color: #4a90e2;
        }

        .react-select-container .react-select__control--is-focused {
          border-color: #4a90e2;
          box-shadow: 0 0 0 1px #4a90e2;
        }

        .react-select-container .react-select__menu {
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .react-select-container .react-select__option {
          padding: 0.5rem 1rem;
          cursor: pointer;
        }

        .react-select-container .react-select__option--is-focused {
          background-color: #f7fafc;
        }

        .react-select-container .react-select__option--is-selected {
          background-color: #4a90e2;
          color: white;
        }

        .react-select-container .react-select__value-container {
          padding: 0.25rem 1rem;
        }

        .react-select-container .react-select__placeholder {
          color: #a0aec0;
        }

        .react-select-container .react-select__single-value {
          color: #2d3748;
        }

        .react-select-container .react-select__indicator-separator {
          background-color: #e2e8f0;
        }

        .react-select-container .react-select__clear-indicator,
        .react-select-container .react-select__dropdown-indicator {
          color: #a0aec0;
          padding: 0.5rem;
        }

        .react-select-container .react-select__clear-indicator:hover,
        .react-select-container .react-select__dropdown-indicator:hover {
          color: #4a5568;
        }

        .react-select-container .react-select__multi-value {
          background-color: #EBF5FF;
          border-radius: 4px;
          margin: 2px;
        }

        .react-select-container .react-select__multi-value__label {
          color: #2B6CB0;
          padding: 2px 6px;
          font-size: 0.875rem;
        }

        .react-select-container .react-select__multi-value__remove {
          color: #4299E1;
          cursor: pointer;
          padding: 0 4px;
        }

        .react-select-container .react-select__multi-value__remove:hover {
          background-color: #BEE3F8;
          color: #2C5282;
          border-radius: 0 4px 4px 0;
        }

        .react-select-container .react-select__value-container {
          padding: 2px 8px;
          flex-wrap: wrap;
          gap: 2px;
        }

        .react-select-container .react-select__value-container--is-multi {
          padding: 2px 8px;
        }
      `}</style>
    </div>
  );
} 
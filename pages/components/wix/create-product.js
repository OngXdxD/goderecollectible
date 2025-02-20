import { useState, useEffect, useRef } from 'react';
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Select from 'react-select';
import { components } from 'react-select';


registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

export default function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [seoData, setSeoData] = useState({
    tags: [],
    settings: {
      preventAutoRedirect: false,
      keywords: []
    }
  });
  const [keywordsInput, setKeywordsInput] = useState('');
  const [productOptions, setProductOptions] = useState([
    {
      name: "Shipping Fees",
      values: ["Shipping fees excluded contact us for quotation"],
      combinations: [
        {
          options: {
            "Shipping Fees": "Shipping fees excluded contact us for quotation"
          },
          prices: {
            fullPayment: "0"
          }
        }
      ]
    }
  ]);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
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
  const [allowDeposit, setAllowDeposit] = useState(false);
  const isUploadingRef = useRef(false);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const ribbonOptions = [
    { value: "Pre-Order", label: "Pre-Order" },
    { value: "Ready Stock", label: "Ready Stock" },
    { value: "Waiting List", label: "Waiting List" }
  ];

  const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDEyNjYyMjUsInVzZXJJZCI6MiwiaWF0IjoxNzM4Njc0MjI1fQ.GtsrP5Mmkc_5Txy2DNN5xILox8WEAHpJIJt9TgntWoc";

  const uploadImages = async (files) => {
    try {
      if (!files || files.length === 0) {
        throw new Error('No files to upload');
      }

      const formData = new FormData();

      files.forEach(file => {
        formData.append('files', file);
      });

      formData.append('displayName', 'product-images');
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
        throw new Error(error.message || 'Failed to upload images');
      }

      const data = await response.json();
      const mediaItems = data.successful || [];
      console.log(mediaItems);

      return mediaItems.map(item => ({
        wixMediaId: item.wixMediaId,
        mediaUrl: item.url
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
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
        const uploadedFiles = await uploadImages(newFiles);
        
        if (uploadedFiles?.length) {
          const newUploadedMedia = uploadedFiles.map(item => ({
            wixMediaId: item.wixMediaId,
            filename: item.filename // Store filename to check for duplicates
          }));
          
          // Update state with new media while preserving existing ones
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

  const generateCombinations = (options) => {
    const allCombinations = [];
    const mainPrice = document.getElementById('price')?.value || "0";
    
    // Get all values except shipping fees
    const optionValues = options.map(opt => ({
      name: opt.name,
      values: opt.values
    }));
    
    // Generate cartesian product of all values
    const cartesian = (...arrays) => {
      return arrays.reduce((acc, array) => {
        return acc.flatMap(x => array.values.map(y => ({
          ...x,
          [array.name]: y
        })));
      }, [{}]);
    };

    const combinations = cartesian(...optionValues);
    
    // Create combination objects with payment types and prices
    combinations.forEach(combo => {
      allCombinations.push({
        options: combo,
        prices: {
          fullPayment: mainPrice,
          ...(allowDeposit ? { deposit: mainPrice } : {})
        }
      });
    });

    return allCombinations;
  };

  const handleAddChoice = (optionIndex) => {
    const newOptions = [...productOptions];
    const newValue = "";
    newOptions[optionIndex].values.push(newValue);
    
    // Regenerate all combinations
    const combinations = generateCombinations(newOptions);
    newOptions[0].combinations = combinations;
    
    setProductOptions(newOptions);
  };

  const handleChoiceChange = (optionIndex, valueIndex, value, field) => {
    const newOptions = [...productOptions];
    
    if (field === 'values') {
      newOptions[optionIndex].values[valueIndex] = value;
      // Regenerate combinations when a value changes
      const combinations = generateCombinations(newOptions);
      newOptions[0].combinations = combinations;
    } else if (field === 'price') {
      const [priceType, combinationIndex] = value.type.split('-');
      newOptions[0].combinations[combinationIndex].prices[priceType] = value.amount;
    }
    
    setProductOptions(newOptions);
  };

  const handleOptionChange = (optionIndex, field, value) => {
    const newOptions = [...productOptions];
    newOptions[optionIndex][field] = value;
    
    // Regenerate combinations when option name changes
    const combinations = generateCombinations(newOptions);
    newOptions[0].combinations = combinations;
    
    setProductOptions(newOptions);
  };

  const handleRemoveOption = (optionIndex) => {
    const newOptions = productOptions.filter((_, index) => index !== optionIndex);
    
    // After removing the option, regenerate combinations
    if (newOptions.length > 0) {
      const combinations = generateCombinations(newOptions);
      newOptions[0].combinations = combinations;
    }
    
    setProductOptions(newOptions);
  };

  const fetchCollections = async (currentOffset = 0) => {
    try {
      if (isLoadingMore) return; // Prevent multiple simultaneous requests
      
      setIsLoadingMore(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/products/collections?offset=${currentOffset}`, {
          headers: {
            'Authorization': `Bearer ${authorization}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data = await response.json();
      
      const formattedCollections = data.collections.map(collection => ({
        value: collection.id,
        label: collection.name
      }));

      if (currentOffset === 0) {
        setCollections(formattedCollections);
      } else {
        setCollections(prev => [...prev, ...formattedCollections]);
      }

      setHasMore(data.collections.length > 0);
      setOffset(currentOffset + data.collections.length);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleMenuScrollToBottom = () => {
    if (!isLoadingMore && hasMore) {
      fetchCollections(offset);
    }
  };
  
  // Setup intersection observer when menu opens
  useEffect(() => {
    if (isMenuOpen && hasMore) {
      const options = {
        root: null,
        rootMargin: '20px',
        threshold: 1.0
      };

      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          fetchCollections(offset);
        }
      }, options);

      if (loadingRef.current) {
        observer.observe(loadingRef.current);
      }

      observerRef.current = observer;

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [isMenuOpen, offset, hasMore, isLoadingMore]);

  // Custom styles for the Select component
  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '46px',
      background: '#fff',
      borderColor: '#e2e8f0',
      '&:hover': {
        borderColor: '#4a90e2'
      }
    }),
    menu: (base) => ({
      ...base,
      position: 'absolute',
      width: '100%',
      zIndex: 2,
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      '-webkit-overflow-scrolling': 'touch'
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '200px',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '8px 0',
      '&::-webkit-scrollbar': {
        width: '6px'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#cbd5e0',
        borderRadius: '3px'
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
    }),
    loadingIndicator: (base) => ({
      ...base,
      color: '#4a90e2'
    }),
    loadingMessage: (base) => ({
      ...base,
      color: '#455568'
    })
  };

  // Custom components for the Select
  const customComponents = {
    MenuList: ({ children, ...props }) => (
      <components.MenuList {...props}>
        {children}
        {hasMore && (
          <div
            ref={loadingRef}
            style={{ 
              textAlign: 'center', 
              padding: '8px',
              fontSize: '14px',
              color: '#718096'
            }}
          >
            {isLoadingMore ? 'Loading more...' : 'Scroll for more'}
          </div>
        )}
      </components.MenuList>
    )
  };

  useEffect(() => {
    fetchCollections(0);
  }, []);

  const handleInfoSectionChange = (index, field, value) => {
    const newSections = [...additionalInfoSections];
    newSections[index][field] = value;
    setAdditionalInfoSections(newSections);
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    const newSections = [...additionalInfoSections];
    newSections[1].description = description;
    setAdditionalInfoSections(newSections);
  };

  const handleAllowDepositChange = (e) => {
    setAllowDeposit(e.target.checked);
    const newOptions = [...productOptions];
    newOptions[0].combinations.forEach(combo => {
      if (e.target.checked) {
        combo.prices.deposit = combo.prices.fullPayment;
      } else {
        delete combo.prices.deposit;
      }
    });
    setProductOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate deposit amounts if deposit is allowed
      if (allowDeposit) {
        const hasInvalidDeposit = productOptions[0].combinations.some(combo => 
          !combo.prices.deposit || parseFloat(combo.prices.deposit) <= 0
        );
        
        if (hasInvalidDeposit) {
          throw new Error('All deposit amounts must be greater than 0 when deposit payment is enabled');
        }
      }

      console.log('Uploaded Media before submit:', uploadedMedia);
      
      // Format product options and combinations
      const formattedOptions = productOptions.map(option => ({
        name: option.name,
        values: option.values
      }));

      const formattedCombinations = productOptions[0].combinations.map(combo => ({
        options: Object.entries(combo.options).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {}),
        prices: {
          fullPayment: combo.prices.fullPayment,
          ...(allowDeposit ? { deposit: combo.prices.deposit } : {})
        }
      }));

      const formData = {
        name: e.target.name.value,
        slug: e.target.name.value.toLowerCase().replace(/ /g, '-'),
        productType: "physical",
        description: e.target.description.value,
        price: parseFloat(e.target.price.value),
        stock: parseInt(e.target.stock.value) || 0,
        brand: e.target.brand.value,
        media: uploadedMedia.map(media => media.wixMediaId),
        visible: e.target.visible.checked,
        manageVariants: true,
        productOptions: formattedOptions,
        combinations: formattedCombinations,
        ribbon: e.target.ribbon.value,
        collections: selectedCollections.map(col => col.value),
        additionalInfoSections: additionalInfoSections,
        seoData: seoData
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
      setUploadedMedia([]);
      setProductOptions([
        {
          name: "Shipping Fees",
          values: ["Shipping fees excluded contact us for quotation"],
          combinations: [
            {
              options: {
                "Shipping Fees": "Shipping fees excluded contact us for quotation"
              },
              prices: {
                fullPayment: "0"
              }
            }
          ]
        }
      ]);
      setKeywordsInput('');
      setSeoData({
        tags: [],
        settings: {
          preventAutoRedirect: false,
          keywords: []
        }
      });
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Modify the add option button click handler to check the limit
  const handleAddOption = () => {
    if (productOptions.length >= 6) {
      setError('Maximum 6 product options allowed');
      return;
    }
    setProductOptions([...productOptions, { name: "", values: [], combinations: [] }]);
    setError(''); // Clear error if successful
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
              onupdatefiles={handleFileUpdate}
              allowMultiple={true}
              maxFiles={10}
              name="files"
              labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
              className="multiple-filepond"
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="name">Name * (max 80 characters)</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                maxLength={80}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (max 8000 characters)</label>
              <textarea 
                id="description" 
                name="description" 
                rows="4"
                maxLength={8000}
                onChange={handleDescriptionChange}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header" onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}>
              <h2>Additional Information</h2>
              <button type="button" className="collapse-button">
                {isSectionCollapsed ? '+' : '-'}
              </button>
            </div>
            <div className={`section-content ${isSectionCollapsed ? 'collapsed' : ''}`}>
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
                  defaultValue="Pre-Order"
                >
                  {ribbonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
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
                  onMenuScrollToBottom={handleMenuScrollToBottom}
                  onMenuOpen={() => setIsMenuOpen(true)}
                  onMenuClose={() => setIsMenuOpen(false)}
                  isLoading={isLoadingMore}
                  styles={customStyles}
                  components={customComponents}
                />
              </div>

              <div className="form-group">
                <label htmlFor="seoKeywords">SEO Keywords</label>
                <input
                  type="text"
                  id="seoKeywords"
                  value={keywordsInput}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setKeywordsInput(inputValue);
                    
                    const newSeoData = { ...seoData };
                    newSeoData.settings.keywords = inputValue
                      .split(',')
                      .map(keyword => keyword.trim())
                      .filter(keyword => keyword.length > 0)
                      .map(term => ({
                        term,
                        isMain: true
                      }));
                    setSeoData(newSeoData);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  className="form-input"
                />
              </div>
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
                            onChange={(e) => handleChoiceChange(optionIndex, valueIndex, e.target.value, 'values')}
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
                        {optionIndex !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(optionIndex)}
                            className="btn-danger btn-sm"
                          >
                            Remove
                          </button>
                        )}
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
              disabled={productOptions.length >= 6}
            >
              + Add New Option
            </button>

            <h3 className="combinations-title">Option Combinations Pricing</h3>
            <div className="combinations-header">
              <label className="allow-deposit-toggle">
                <input
                  type="checkbox"
                  checked={allowDeposit}
                  onChange={handleAllowDepositChange}
                />
                <span className="toggle-label">Allow Deposit Payment</span>
              </label>
            </div>
            <div className="combinations-table-wrapper">
              <table className="combinations-table">
                <thead>
                  <tr>
                    <th>Combination</th>
                    <th>Deposit Price</th>
                    <th>Full Payment Price</th>
                  </tr>
                </thead>
                <tbody>
                  {productOptions[0].combinations.map((combo, index) => (
                    <tr key={index}>
                      <td className="combination-name">
                        {Object.entries(combo.options).map(([key, value]) => (
                          <span key={key}>{key}: {value}<br /></span>
                        ))}
                      </td>
                      <td className="price-inputs">
                        <div className="price-input-wrapper">
                          <input
                            type="number"
                            value={combo.prices.deposit || combo.prices.fullPayment}
                            onChange={(e) => handleChoiceChange(0, index, {
                              type: 'deposit-' + index,
                              amount: e.target.value
                            }, 'price')}
                            className="price-input"
                            min="0"
                            step="0.01"
                            disabled={!allowDeposit}
                          />
                        </div>
                      </td>
                      <td className="price-inputs">
                        <div className="price-input-wrapper">
                          <input
                            type="number"
                            value={combo.prices.fullPayment}
                            onChange={(e) => handleChoiceChange(0, index, {
                              type: 'fullPayment-' + index,
                              amount: e.target.value
                            }, 'price')}
                            className="price-input"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            
          </div>

          <div className="form-section">
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="visible" id="visible" defaultChecked={true} />
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
    </div>
  );
} 
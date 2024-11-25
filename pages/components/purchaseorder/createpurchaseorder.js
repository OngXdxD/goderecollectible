import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormGroup, Pagination, Row, OverlayTrigger, Tooltip, InputGroup, Modal } from "react-bootstrap";
import Seo from "../../../shared/layout-components/seo/seo";
const Select = dynamic(() => import("react-select"), {ssr : false});
import dynamic from "next/dynamic";
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import { baseUrl } from '../../api/config'; 
import useFetchAndCache from '../../../shared/hook/useFetchAndCache';
import PurchaseOrderProductTable from "../tables/createPurchaseOrderTable";
import CreateProductModal from "../modals/createProductModal";
import CreateSupplierModal from "../modals/createSupplierModal";

const CreatePurchaseOrder = () => {

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    };

    const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
    const [businessList, setBusinessList] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [supplierList, setSupplierList] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [newSupplier, setNewSupplier] = useState(null);
    const [productList, setProductList] = useState(null);
    const [newProduct, setNewProduct] = useState(null);
    const [currency, setCurrency] = useState("");
    const [country, setCountry] = useState("");
    const [series, setSeries] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [poDate, setPoDate] = useState(getCurrentDate());;
    const [remark, setRemark] = useState("");
    const [productRows, setProductRows] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [price, setPrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [preOrder, setPreOrder] = useState("on");

    // Modal state
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const handleShowSupplierModal = () => setShowSupplierModal(true);
    const handleCloseSupplierModal = () => setShowSupplierModal(false);
    const handleShowProductModal = () => setShowProductModal(true);
    const handleCloseProductModal = () => setShowProductModal(false);

    useEffect(() => {
        fetchBusinessData();
        fetchSupplierData();
        fetchProductData();
    }, []);

    const fetchBusinessData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/business/selectall`);
            const data = await response.json();
            const businesses = data.map(business => ({
                value: business.Id,
                label: business.Name
            }));
            setBusinessList(businesses);
        } catch (error) {
            console.error("Error fetching business data:", error);
        }
    };

    const handleBusinessSelect = (selectedOption) => {
        setSelectedBusiness(selectedOption); // Update the selected business state
    };

    const fetchSupplierData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/supplier/selectall`);
            const data = await response.json();
            const suppliers = data.map(supplier => ({
                value: supplier.Id,
                label: supplier.Name
            }));
            setSupplierList(suppliers);
        } catch (error) {
            console.error("Error fetching supplier data:", error);
        }
    };

    const handleSupplierSelect = (selectedOption) => {
        setSelectedSupplier(selectedOption); // Update the selected business state
    };

    const handleCurrencySelect = (selectedOption) => {
        console.log(selectedOption)
        setCurrency(selectedOption); 
    };

    const fetchProductData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/customerproduct/selectall`);
            const data = await response.json();
            const products = data.map(product => ({
                value: product.Id,
                label: product.Name
            }));
            setProductList(products);
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(`${baseUrl}/api/customerproduct/details/${productId}`);
            const productDetails = await response.json();

            // Prevent duplicates by checking if productId already exists
            const isDuplicate = productRows.some((row) => row.id === productId);
            if (isDuplicate) {
                return;
            }

            const newRow = {
                id: productId,
                name: productDetails.Name,
                quantity: 1, // Default quantity
                cost: 0, // Default cost
                totalPrice: 0,
            };

            setProductRows((prevRows) => [...prevRows, newRow]);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const handleProductSelect = (selectedOptions) => {
        // Add new products to the table
        const selectedIds = selectedOptions.map((option) => option.value);
    
        // Add newly selected products
        selectedOptions.forEach((option) => {
            if (!productRows.find((row) => row.id === option.value)) {
                fetchProductDetails(option.value);
            }
        });
    
        // Remove products that are no longer in the dropdown
        const updatedRows = productRows.filter((row) => selectedIds.includes(row.id));
        setProductRows(updatedRows);
    
        // Update totals after modifying productRows
        const updatedTotal = updatedRows.reduce((acc, row) => acc + row.totalPrice, 0);
        setTotalAmount(updatedTotal);
    
        // Update the selected products
        setSelectedProduct(selectedOptions);
    };
    
    const updateTotals = () => {
        const total = productRows.reduce((acc, row) => acc + row.totalPrice, 0);
        setTotalAmount(total);
    };

    const updateRowQuantity = (index, quantity) => {
        const updatedRows = [...productRows];
        updatedRows[index].quantity = parseFloat(quantity) || 0;
        updatedRows[index].totalPrice = updatedRows[index].quantity * updatedRows[index].cost;
        setProductRows(updatedRows);
        updateTotals();
    };

    const updateRowCost = (index, cost) => {
        const updatedRows = [...productRows];
        updatedRows[index].cost = parseFloat(cost) || 0;
        updatedRows[index].totalPrice = updatedRows[index].quantity * updatedRows[index].cost;
        setProductRows(updatedRows);
        updateTotals();
    };

    const { data: dropdownData, loading, error } = useFetchAndCache(
        ["Currency", "Country", "Series", "Category", "Brand"],
        `${baseUrl}/api/masterdata`
    );
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const currencyOptions = dropdownData?.Currency?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const countryOptions = dropdownData?.Country?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const seriesOptions = dropdownData?.Series?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const categoryOptions = dropdownData?.Category?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const brandOptions = dropdownData?.Brand?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));
    
    // Function to fetch a generated PO number from the server
    const generatePO = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/purchaseorder/getPONumber`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error("Failed to fetch PO number");
            }
            const poNumber = await response.text();
            setPurchaseOrderNumber(poNumber.replace(/"/g, "")); // Update state with the generated PO number
        } catch (error) {
            console.error("Error fetching invoice number:", error);
        }
    };

    const handlePurchaseOrderInput = (event) => {
        setPurchaseOrderNumber(event.target.value); // Update state with the input value
    };
    
	return (
		<div>
			<Seo title={"Purchase Order"} />
			<Pageheader title="PURCHASE ORDER" heading="Purchase & Stock Inventory" active="Create Purchase Order" />

			{/* <!-- row --> */}
			<Row className="row-sm">
			
				<Col xl={6} lg={8} md={12}>
					<Card>
						<Card>
							<Card.Body className="pb-0">
								<FormGroup>
									<Form.Label className="form-label">Purchase Order Number</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="PO Number"
                                            value={purchaseOrderNumber}
                                            onChange={handlePurchaseOrderInput} // Handle manual input
                                        />
                                        <Button 
                                            variant='primary' 
                                            type="button"
                                            onClick={generatePO}>Auto Generate
                                        </Button>
                                        </InputGroup>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Business</Form.Label>
                                    <Select classNamePrefix="Select2"
                                        options={businessList}
                                        onChange={handleBusinessSelect}
                                        value={selectedBusiness} // Set the selected value
                                        placeholder="Select Business"
                                    />
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Supplier</Form.Label>
                                    <InputGroup>
                                        <Select  
                                            name="supplier" 
                                            className="basic-multi-select flex-grow-1"
                                            options={supplierList}
                                            onChange={handleSupplierSelect}
                                            value={selectedSupplier}
                                            classNamePrefix="Select2" 
                                            placeholder="Select Supplier"
                                            isClearable={true}
                                            isLoading={loading}
                                            noOptionsMessage={() => "No options available"} 
                                        />
                                        <Button className="btn btn-primary" type="button" onClick={handleShowSupplierModal}>Create Supplier</Button>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Product</Form.Label>
                                    <InputGroup>
                                        <Select  
                                            isMulti
                                            name="product" 
                                            className="basic-multi-select flex-grow-1"
                                            options={productList}
                                            onChange={handleProductSelect}
                                            value={selectedProduct}
                                            classNamePrefix="Select2" 
                                            placeholder="Select Product"
                                            isClearable={true}
                                            isLoading={loading}
                                            noOptionsMessage={() => "No options available"} 
                                        />
                                        <Button className="btn btn-primary" type="button" onClick={handleShowProductModal}>Create Product</Button>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Purchase Currency</Form.Label>
                                    <Select
                                        options={currencyOptions}
                                        value={currency.label}
                                        onChange={handleCurrencySelect}
                                        placeholder="Select Currency"
                                    />
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Date</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        id="input-date"
                                        value={poDate}
                                        onChange={(e) => setPoDate(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Pre-Order</Form.Label>
                                    <div className={`toggle  ${preOrder}`} onClick={() => { preOrder == "on" ? setPreOrder("off") : setPreOrder("on"); }}>
                                        <span></span>
                                    </div>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Remark</Form.Label>
                                    <textarea
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        className="form-control"
                                        placeholder="Optional"
                                    />
                                </FormGroup>
                            </Card.Body>

							<div className="py-2 px-3">
								<button className="btn btn-primary mt-2 mb-2 pb-2" type="submit">Filter</button>
							</div>
						</Card>
					</Card>
				</Col>
				{/* Preview Section */}
                <Col xl={6} lg={4} md={12}>
                <Card>
                    <Card.Header>
                    <h3 className="card-title">Purchase Order Preview</h3>
                    </Card.Header>
                    <Card.Body>
                    <div className="invoice-preview">
                        <h4>Purchase Order <span>{purchaseOrderNumber}</span></h4>

                        <div>
                            <h3>{selectedBusiness.label}</h3>
                        </div>
                        <div>
                            <h5>{poDate}</h5>
                        </div>
                        <br />
                        <h4>Purchase From</h4>
                        <div>
                            <h5>{selectedSupplier?.label || "No supplier selected"}</h5>
                        </div>
                        <br />
                        <div>
                            <PurchaseOrderProductTable
                                productRows={productRows}
                                updateRowQuantity={updateRowQuantity}
                                updateRowCost={updateRowCost}
                                totalAmount={totalAmount}
                                currency={currency.label}
                            />
                        </div>
                        <br />
                        <div>
                            <h5>Remark</h5>
                            <p>{remark}</p>
                        </div>
                    </div>
                    </Card.Body>
                </Card>
                </Col>

            </Row>

            {/* Modals for Supplier and Product */}
            <CreateSupplierModal
                show={showSupplierModal}
                onClose={handleCloseSupplierModal}
                countryOptions={countryOptions}
                baseUrl={baseUrl}
                populateSupplier={fetchSupplierData}
            />

            <CreateProductModal
                show={showProductModal}
                onClose={handleCloseProductModal}
                seriesOptions={seriesOptions}
                categoryOptions={categoryOptions}
                brandOptions={brandOptions}
                baseUrl={baseUrl}
                populateProduct={fetchProductData}
            />
		</div>
	);
};

CreatePurchaseOrder.layout = "Contentlayout";

export default CreatePurchaseOrder;
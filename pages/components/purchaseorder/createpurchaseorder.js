import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormGroup, Pagination, Row, OverlayTrigger, Tooltip, InputGroup, Modal } from "react-bootstrap";
import Seo from "../../../shared/layout-components/seo/seo";
const Select = dynamic(() => import("react-select"), {ssr : false});
import dynamic from "next/dynamic";
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import { baseUrl } from '../../api/config'; 
import useFetchAndCache from '../../../shared/hook/useFetchAndCache';

const CreatePurchaseOrder = () => {
    const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
    const [businessList, setBusinessList] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [supplierList, setSupplierList] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [product, setProduct] = useState(null);
    const [currency, setCurrency] = useState("1");
    const [country, setCountry] = useState("1");
    const [poDate, setPoDate] = useState("");
    const [preOrder, setPreOrder] = useState(false);
    const [remark, setRemark] = useState("");
    const [newSupplier, setNewSupplier] = useState("");

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

    const { data: dropdownData, loading, error } = useFetchAndCache(
        ["Currency", "Country"],
        `${baseUrl}/api/masterdata`
    );
    console.log(dropdownData)
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

    

    const fetchProductData = async () => {
        try {
        const response = await fetch(`${baseUrl}/api/product/selectall`);
        const data = await response.json();
        setProduct(data);
        } catch (error) {
        console.error("Error fetching product data:", error);
        }
    };

    const handleCreatePurchaseOrder = () => {
        const purchaseOrderData = {
        purchaseOrderNumber,
        business,
        supplier,
        product,
        currency,
        poDate,
        preOrder,
        remark
        };

        submitPurchaseOrder(purchaseOrderData);
    };

    const submitPurchaseOrder = (purchaseOrderData) => {
        const requestData = {
        PurchaseOrder: purchaseOrderData.purchaseOrderNumber,
        AdminId: localStorage.getItem('adminId'),
        Supplier: purchaseOrderData.supplier,
        BusinessID: purchaseOrderData.business,
        Currency: purchaseOrderData.currency,
        OrderDate: purchaseOrderData.poDate,
        PreOrder: purchaseOrderData.preOrder,
        Remark: purchaseOrderData.remark,
        Items: purchaseOrderData.product
        };

        // Submit data to the backend
        fetch(`${baseUrl}/api/purchaseorder/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
        alert("Purchase Order created successfully.");
        })
        .catch(error => {
        console.error("Error creating purchase order:", error);
        alert("Failed to create purchase order.");
        });
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
                                        <Form.Control type="text" className="" placeholder="PO Number"
                                            aria-label="PO Number" aria-describedby="button-auto-generate-po-number"
                                            value={purchaseOrderNumber}
                                            onChange={(e) => setPurchaseOrderNumber(e.target.value)}/>
                                            <Button variant='primary' className="" type="button"
                                            id="button-auto-generate-po-number">Auto Generate</Button>
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
                                        />
                                        <Button variant='' className="btn btn-primary" type="button" onClick={handleShowSupplierModal}>Create Supplier</Button>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Product</Form.Label>
                                    <InputGroup>
                                        <Select  
                                            name="colors" 
                                            className="basic-multi-select flex-grow-1"
                                            menuPlacement='auto' 
                                            onChange={setProduct}
                                            value={product}
                                            classNamePrefix="Select2" />
                                        <Button variant='' className="btn btn-primary" type="button">Create Product</Button>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Purchase Currency</Form.Label>
                                    <Select
                                        options={currencyOptions}
                                        value={currencyOptions?.find(option => option.value === currency)}
                                        onChange={(option) => setCurrency(option.value)}
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
                                    <Select classNamePrefix="Select2"
                                        
                                        placeholder='Select'
                                    />
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
                    <h3 className="card-title">Invoice Preview</h3>
                    </Card.Header>
                    <Card.Body>
                    <div className="invoice-preview">
                        <h4>Purchase Order <span>{purchaseOrderNumber}</span></h4>

                        <div>
                        <h5>Business</h5>
                        <p>{selectedBusiness.label}</p>
                        </div>

                        <div>
                        <h5>Supplier</h5>
                        <p></p>
                        </div>

                        <div>
                        <h5>Product</h5>
                        <p>{product}</p>
                        </div>

                        <div>
                        <h5>Purchase Currency</h5>
                        <p>{currency}</p>
                        </div>

                        <div>
                        <h5>Date</h5>
                        <p>{poDate}</p>
                        </div>

                        <div>
                        <h5>Pre-Order</h5>
                        <p>{preOrder ? "Yes" : "No"}</p>
                        </div>

                        <div>
                        <h5>Remark</h5>
                        <p>{remark}</p>
                        </div>
                    </div>
                    </Card.Body>
                </Card>
                </Col>

            </Row>

			{/* <!-- row closed --> */}

            {/* Modals for Supplier and Product */}
      <Modal show={showSupplierModal} onHide={handleCloseSupplierModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormGroup>
                <Form.Label className="form-label">Supplier Name</Form.Label>
                <InputGroup className="mb-3">
                    <Form.Control type="text" className="" placeholder="Supplier name"
                        aria-label="Supplier Name"
                        value={newSupplier}
                        onChange={(e) => setNewSupplier(e.target.value)}/>
                    </InputGroup>
            </FormGroup>
            <FormGroup className="form-group mt-2">
                <Form.Label className="form-label">Country</Form.Label>
                <Select
                    options={countryOptions}
                    value={countryOptions?.find(option => option.value === country)}
                    onChange={(option) => setCountry(option.value)}
                    placeholder="Select Country"
                />
            </FormGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary">Save Supplier</Button>
            <Button variant="secondary" onClick={handleCloseSupplierModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showProductModal} onHide={handleCloseProductModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Product form goes here */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProductModal}>Close</Button>
          <Button variant="primary">Save Product</Button>
        </Modal.Footer>
      </Modal>
		</div>
	);
};

CreatePurchaseOrder.layout = "Contentlayout";

export default CreatePurchaseOrder;

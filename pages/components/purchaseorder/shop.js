import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Button, Card, Col, Form, FormGroup, Pagination, Row, OverlayTrigger, Tooltip, InputGroup, } from "react-bootstrap";
import { Optioncategory1, OptionType, OptionMens, OptionWomen, OptionBabyKids, OptionElectronics, OptionSportBooksMore } from "../../../shared/data/pages/e-commerce/shop";
import Seo from "../../../shared/layout-components/seo/seo";
const Select = dynamic(() => import("react-select"), {ssr : false});
import dynamic from "next/dynamic";
import { addToCart, addToWishlist, setSelectedItem } from "../../../shared/redux/action";
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";

const Shop = () => {
    const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");
    const [business, setBusiness] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [product, setProduct] = useState(null);
    const [currency, setCurrency] = useState("1");
    const [poDate, setPoDate] = useState("");
    const [preOrder, setPreOrder] = useState(false);
    const [remark, setRemark] = useState("");
  
    // Modal state
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const handleShowSupplierModal = () => setShowSupplierModal(true);
    const handleCloseSupplierModal = () => setShowSupplierModal(false);
    const handleShowProductModal = () => setShowProductModal(true);
    const handleCloseProductModal = () => setShowProductModal(false);
  
    // Preview State (Optional fields)
    const previewData = {
      purchaseOrderNumber,
      business: business ? business.label : "",
      supplier: supplier ? supplier.label : "",
      product: product ? product.label : "",
      currencySymbol: currency === "1" ? "RM" : currency === "2" ? "$" : "¥",
      poDate,
      preOrder,
      remark
    };
  
    const handleCreatePurchaseOrder = () => {
      // Handle creation of purchase order here
      console.log("Create Purchase Order", previewData);
    };

	return (
		<div>
			<Seo title={"Purchase Order"} />
			<Pageheader title="PURCHASE ORDER" heading="Purchase Order" active="Create Purchase Order" />

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
										options={OptionWomen}
										placeholder='Select'
									/>
								</FormGroup>
								<FormGroup className="form-group mt-2">
									<Form.Label className="form-label">Supplier</Form.Label>
                                    <InputGroup>
                                        <Select  
                                            name="colors" 
                                            className="basic-multi-select flex-grow-1"
                                            menuPlacement='auto' 
                                            onChange={setSupplier}
                                            value={supplier}
                                            classNamePrefix="Select2" />
                                        <Button variant='' className="btn btn-primary" type="button">Create Supplier</Button>
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
									<Select classNamePrefix="Select2"
										options={OptionSportBooksMore}
										placeholder='Select'
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
										options={OptionSportBooksMore}
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
                        <h4>Purchase Order <span>{previewData.purchaseOrderNumber}</span></h4>

                        <div>
                        <h5>Business</h5>
                        <p>{previewData.business}</p>
                        </div>

                        <div>
                        <h5>Supplier</h5>
                        <p>{previewData.supplier}</p>
                        </div>

                        <div>
                        <h5>Product</h5>
                        <p>{previewData.product}</p>
                        </div>

                        <div>
                        <h5>Purchase Currency</h5>
                        <p>{previewData.currencySymbol}</p>
                        </div>

                        <div>
                        <h5>Date</h5>
                        <p>{previewData.poDate}</p>
                        </div>

                        <div>
                        <h5>Pre-Order</h5>
                        <p>{previewData.preOrder ? "Yes" : "No"}</p>
                        </div>

                        <div>
                        <h5>Remark</h5>
                        <p>{previewData.remark}</p>
                        </div>
                    </div>
                    </Card.Body>
                </Card>
                </Col>

            </Row>

			{/* <!-- row closed --> */}
		</div>
	);
};

Shop.layout = "Contentlayout";

export default Shop;

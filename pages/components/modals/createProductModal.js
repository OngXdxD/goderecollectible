import React, { useState } from "react";
import { Button, Modal, FormGroup, InputGroup, Form } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import useToast from "../toast/toastContext";

const CreateProductModal = ({
    show,
    onClose,
    seriesOptions,
    categoryOptions,
    brandOptions,
    onSave,
    baseUrl,
    populateProduct
}) => {
    const { triggerToast } = useToast();
    const [newProduct, setNewProduct] = useState("");
    const [series, setSeries] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");


    const validateProductInfo = () => {
        const errors = [];
        if (!newProduct.trim()) errors.push("Product Name is required.");
        if (!series) errors.push("Series is required.");
        if (!category) errors.push("Category is required.");
        if (!brand) errors.push("Brand is required.");
        if (!price || isNaN(price) || price <= 0) errors.push("Valid Product Price is required.");

        if (errors.length > 0) {
            triggerToast(errors.join("<br />"), "danger");
            return;
        }

        registerProduct(newProduct, series, category, brand, price);
    };

    const registerProduct = async (productName, seriesId, categoryId, brandId, productPrice) => {
        const CustomerProductDTO = {
            Name: productName,
            Series: seriesId,
            Category: categoryId,
            Brand: brandId,
            Price: productPrice
        };

        try {
            const response = await fetch(`${baseUrl}/api/customerproduct/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(CustomerProductDTO)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to register product.");
            }
            triggerToast("Product register successful!");
            onClose(); // Close modal
            populateProduct(); // Refresh product dropdown
            // Clear fields
            setNewProduct("");
            setSeries("");
            setCategory("");
            setBrand("");
            setPrice("");
        } catch (error) {
            triggerToast(error.message, "danger");
        }
    };

    return (

        <Modal 
            show={show}
            onHide={onClose}
            onExited={() => {
                // Clear fields when modal is completely closed
                setNewProduct("");
                setSeries("");
                setCategory("");
                setBrand("");
                setPrice("");
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>Create Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <Form.Label className="form-label">Product Name</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Product name"
                            value={newProduct}
                            onChange={(e) => setNewProduct(e.target.value)}
                        />
                    </InputGroup>
                </FormGroup>
                <FormGroup className="form-group mt-2">
                    <Form.Label className="form-label">Series</Form.Label>
                    <CreatableSelect
                        options={seriesOptions}
                        value={seriesOptions?.find((option) => option.value === series)}
                        onChange={(option) => setSeries(option.value)}
                        placeholder="Select Series"
                    />
                </FormGroup>
                <FormGroup className="form-group mt-2">
                    <Form.Label className="form-label">Category</Form.Label>
                    <CreatableSelect
                        options={categoryOptions}
                        value={categoryOptions?.find((option) => option.value === category)}
                        onChange={(option) => setCategory(option.value)}
                        placeholder="Select Category"
                    />
                </FormGroup>
                <FormGroup className="form-group mt-2">
                    <Form.Label className="form-label">Brand</Form.Label>
                    <CreatableSelect
                        options={brandOptions}
                        value={brandOptions?.find((option) => option.value === brand)}
                        onChange={(option) => setBrand(option.value)}
                        placeholder="Select Brand"
                    />
                </FormGroup>
                <FormGroup>
                    <Form.Label className="form-label">Recommended Price</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="number"
                            placeholder="Product price"
                            value={price}
                            onChange={(e) => {
                                const value = e.target.value.replace(/^0+/, ""); // Remove leading zeros
                                setPrice(value);
                            }}
                        />
                    </InputGroup>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={validateProductInfo}>
                    Save Product
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateProductModal;

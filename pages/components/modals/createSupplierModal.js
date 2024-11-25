import React, { useState } from "react";
import { Button, Modal, FormGroup, InputGroup, Form } from "react-bootstrap";
import Select from "react-select";
import useToast from "../toast/toastContext";

const CreateSuppplierModal = ({
    show,
    onClose,
    countryOptions,
    onSave,
    baseUrl,
    populateSupplier
}) => {
    const { triggerSuccessToast } = useToast();
    const [newSupplier, setNewSupplier] = useState("");
    const [country, setCountry] = useState("");

    const validateSupplierInfo = () => {
        const errors = [];
        if (!newSupplier.trim()) {
            errors.push("Supplier Name cannot be empty.");
        }
        if (!country) {
            errors.push("Country must be selected.");
        }
    
        if (errors.length > 0) {
            alert(errors.join("\n")); // Replace with your `message.display` equivalent
            return;
        }
    
        registerSupplier(newSupplier, country);
    };

    const registerSupplier = async (supplierName, countryId) => {
        const supplierDto = {
            Name: supplierName,
            Country: countryId,
        };
    
        try {
            const response = await fetch(`${baseUrl}/api/supplier/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplierDto),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || "Failed to register supplier.");
            }
    
            triggerSuccessToast("Supplier register successful!");
            onClose(); // Close modal after successful registration
            populateSupplier(); // Refresh supplier dropdown data
            setNewSupplier(""); // Clear input fields
            setCountry(""); // Reset country selection
        } catch (error) {
            alert(error.message);
        }
    };

    return (

        <Modal show={show} onHide={onClose}>
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
                <Button variant="primary" onClick={validateSupplierInfo}>Save Supplier</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateSuppplierModal;

import React, { useState } from "react";
import { Button, Modal, FormGroup, InputGroup, Form } from "react-bootstrap";
const Select = dynamic(() => import("react-select"), { ssr: false });
import dynamic from "next/dynamic";
import useToast from "../toast/toastContext";

const CreateCustomerModal = ({
    show,
    onClose,
    countryOptions,
    stateOptions,
    baseUrl,
    populateCustomer
}) => {
    const { triggerToast } = useToast();
    const [customerName, setCustomerName] = useState(null);
    const [customerPhone, setCustomerPhone] = useState("");
    const [detailedAddress, setDetailedAddress] = useState("");
    const [postcode, setPostcode] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("1");
    const [country, setCountry] = useState("");

    const validateCustomerInfo = () => {
        const errors = [];
        if (!customerName.trim()) {
            errors.push("Customer Name cannot be empty.");
        }

        if (!customerPhone.trim()) {
            errors.push("Customer Phone Number cannot be empty.");
        } else {
            if (!/^\d{10,11}$/.test(customerPhone)) {
                errors.push("Customer Phone Number must be 10 or 11 digits and contain only numbers.");
            }
        }
        if (!detailedAddress.trim()) {
            errors.push("Detailed Address cannot be empty.");
        }

        if (!postcode.trim()) {
            errors.push("Postcode cannot be empty.");
        }

        if (!city.trim()) {
            errors.push("City cannot be empty.");
        }

        if (!country) {
            errors.push("Country must be selected.");
        }

        if (!state.trim()) {
            errors.push("State must be selected.");
        }

        if (errors.length > 0) {
            alert(errors.join("\n")); // Replace with your `message.display` equivalent
            return;
        }

        registerCustomer(customerName, customerPhone, detailedAddress, postcode, city, country, state);
    };

    const registerCustomer = async (customerName, customerPhone, detailedAddress, postcode, city, country, state) => {
        const customerDto = {
            Name: customerName,
            PhoneNumber: customerPhone,
        };

        const addressDto = {
            DetailedAddress: detailedAddress,
            Postcode: postcode,
            City: city,
            Country: country,
            State: state,
        };

        const customerMixDto = {
            Customer: customerDto,
            Address: addressDto,
        };

        try {
            const response = await fetch(`${baseUrl}/api/customer/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerMixDto),
            });
            console.log('response', response)

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || "Failed to register customer.");
            }

            triggerToast("Customer register successful!");
            populateCustomer(); 
            setCustomerName("");
            setCustomerPhone("");
            setDetailedAddress("");
            setPostcode("");
            setCity("");
            setCountry("");
            setState("");
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
                setCustomerName("");
                setCustomerPhone("");
                setDetailedAddress("");
                setPostcode("");
                setCity("");
                setCountry("");
                setState("");
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>Create Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <Form.Label className="form-label">Customer Name</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" className="" placeholder="Customer name"
                            aria-label="Customer Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <Form.Label className="form-label">Customer Phone Number</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" className="" placeholder="Customer Phone Number"
                            aria-label="Customer Phone Number"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <Form.Label className="form-label">Detailed Address</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" className="" placeholder="Detailed Address"
                            aria-label="Detailed Address"
                            value={detailedAddress}
                            onChange={(e) => setDetailedAddress(e.target.value)} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <Form.Label className="form-label">Postcode</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" className="" placeholder="Postcode"
                            aria-label="Postcode"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)} />
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <Form.Label className="form-label">City</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" className="" placeholder="City"
                            aria-label="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)} />
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
                <FormGroup className="form-group mt-2">
                    <Form.Label className="form-label">State</Form.Label>
                    <Select
                        options={stateOptions}
                        value={stateOptions?.find(option => option.value === state)}
                        onChange={(option) => setState(option.value)}
                        placeholder="Select State"
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={validateCustomerInfo}>Save Customer</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCustomerModal;

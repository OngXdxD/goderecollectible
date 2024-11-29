import React, { useState } from "react";
import { Button, Modal, FormGroup, InputGroup, Form } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import useToast from "../toast/toastContext";

const CreateBankModal = ({
    show,
    onClose,
    baseUrl,
    populateBank,
}) => {
    const { triggerToast } = useToast();
    const [newBank, setNewBank] = useState("");

    const validateBankInfo = () => {
        const errors = [];
        if (!newBank.trim()) {
            errors.push("Supplier Name cannot be empty.");
        }
    
        if (errors.length > 0) {
            triggerToast(errors.join("<br />"), "danger"); // Replace with your `message.display` equivalent
            return;
        }
    
        registerBank(newBank);
    };

    const registerBank = async (bankName) => {
        const supplierDto = {
            Name: bankName,
        };
    
        try {
            const response = await fetch(`${baseUrl}/api/bank/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplierDto),
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || "Failed to register bank.");
            }
    
            triggerToast("bank register successful!");
            onClose(); // Close modal after successful registration
            setNewBank(""); // Clear input fields
            populateBank(); 

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
                setNewBank("");
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>Create Receiving Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <Form.Label className="form-label">Receiving Account Nickname:</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" className="" placeholder="Receiving Account Nickname"
                            aria-label="Receiving Account Nickname"
                            value={newBank}
                            onChange={(e) => setNewBank(e.target.value)}/>
                        </InputGroup>
                </FormGroup>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={validateBankInfo}>Save Bank</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBankModal;

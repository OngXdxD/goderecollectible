import React, { useEffect, useState } from "react";
import { Button, Modal, Card, FormGroup, InputGroup, Form } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import useToast from "../toast/toastContext";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
registerPlugin(FilePondPluginImagePreview, FilePondPluginImageExifOrientation);

const CreatePaymentModal = ({
    show,
    onClose,
    onSave,
    baseUrl
}) => {
    const { triggerToast } = useToast();
    const [payment, setPayment] = useState(0);
    const [bank, setBank] = useState("");
    const [bankOptions, setBankOptions] = useState([]); // Store bank options
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (show) {
            populateBank(); // Fetch bank options when the modal is opened
        }
    }, [show]);

    const populateBank = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/bank/selectall`);
            if (!response.ok) {
                throw new Error("Error fetching bank data");
            }
            const data = await response.json();
            const formattedData = data.map((bank) => ({
                value: bank.Id,
                label: bank.Name,
            }));
            setBankOptions(formattedData);
        } catch (error) {
            console.error("Error fetching banks:", error);
            triggerToast("Error fetching banks: " + error.message, "danger");
        }
    };

    return (

        <Modal 
            show={show}
            onHide={onClose}
            onExited={() => {
                // Clear fields when modal is completely closed
                setPayment("");
                setBank("");
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>Create Payment Record</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <Form.Label className="form-label">Amount Paid (MYR)</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control type="number" className="" placeholder="Payment made"
                            aria-label="Payment made"
                            value={payment}
                            onChange={(e) => {
                                const value = e.target.value.replace(/^0+/, ""); // Remove leading zeros
                                setPayment(value);
                            }}
                        />
                        </InputGroup>
                </FormGroup>
                <FormGroup className="form-group mt-2">
                    <Form.Label className="form-label">Bank</Form.Label>
                    <CreatableSelect
                        options={bankOptions}
                        value={bankOptions?.find(option => option.value === bank)}
                        onChange={(option) => setBank(option.value)}
                        placeholder="Select Bank"
                    />
                </FormGroup>
                <Card className="custom-card">
                    <Card.Header>
                        <div className="card-title">
                            Proof of Payment
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <FilePond className="multiple-filepond"
                            files={files}
                            onupdatefiles={setFiles}
                            allowMultiple={true}
                            maxFiles={3}
                            instantUpload={false}
                            imagePreviewHeight={200}
                            labelIdle='Drag & Drop your file here or click '
                        />
                    </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary">Submit Payment</Button>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreatePaymentModal;

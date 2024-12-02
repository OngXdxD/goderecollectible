import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteSalesOrderModal = ({ show, onClose, onConfirm, items }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {items.length === 1 ? (
                    <p>Are you sure you want to delete SO Number: <strong>{items[0]}</strong>?</p>
                ) : (
                    <div>
                        <p>Are you sure you want to delete the following SO Numbers?</p>
                        <ol>
                            {items.map((soNumber) => (
                                <strong><li key={soNumber}>{soNumber}</li></strong>
                            ))}
                        </ol>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteSalesOrderModal;

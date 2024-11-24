import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const SuccessToast = ({ message, show, onClose }) => {
    return (
        <ToastContainer   className="toast-container position-fixed top-0 end-0 p-3">
            <Toast
                className="toast colored-toast bg-success-transparent"
                role="alert"
                aria-live="assertive"
                onClose={onClose}
                show={show}
                delay={3000}
                autohide
                aria-atomic="true"
            >
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>
        
    );
};

export default SuccessToast;

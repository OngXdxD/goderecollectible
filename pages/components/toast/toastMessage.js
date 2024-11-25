import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastMessage = ({ message, show, onClose, type = "success" }) => {
    // Define classes for different types
    const toastClass = {
        success: "bg-success-transparent",
        danger: "bg-danger-transparent",
    };

    return (
        <ToastContainer className="toast-container position-fixed top-0 end-0 p-3">
            <Toast
                className={`toast colored-toast ${toastClass[type] || "bg-success-transparent"}`}
                role="alert"
                aria-live="assertive"
                onClose={onClose}
                show={show}
                delay={3000}
                autohide
                aria-atomic="true"
            >
                <Toast.Body dangerouslySetInnerHTML={{ __html: message }} />
            </Toast>
        </ToastContainer>
    );
};

export default ToastMessage;
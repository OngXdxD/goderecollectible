import React from 'react';
import { Toast } from 'react-bootstrap';

const ToastMessage = ({ message, show, onClose, type = 'success' }) => {
    return (
        <div className="toast-container position-fixed top-50 start-50 translate-middle">
            <Toast 
                show={show} 
                onClose={onClose} 
                className={`bg-${type} text-white`}
                delay={3000} 
                autohide
            >
                <Toast.Body>
                    <div dangerouslySetInnerHTML={{ __html: message }} />
                </Toast.Body>
            </Toast>
        </div>
    );
};

export default ToastMessage; 
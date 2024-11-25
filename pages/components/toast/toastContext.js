import React, { createContext, useState, useContext, useCallback } from "react";
import ToastMessage from "./toastMessage";

const ToastContext = createContext(); // Create the context

export const useToast = () => {
    return useContext(ToastContext);
};

export default useToast;

export const ToastProvider = ({ children }) => {
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState(false);

    const triggerToast = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

    return (
        <ToastContext.Provider value={{ triggerToast }}>
            {children}
            <ToastMessage
                message={toastMessage}
                show={showToast}
                onClose={handleCloseToast}
                type={toastType} // Pass the type here
            />
        </ToastContext.Provider>
    );
};
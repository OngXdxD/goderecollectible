import React, { createContext, useState, useContext, useCallback } from "react";
import SuccessToast from "./toastMessage";

const ToastContext = createContext(); // Create the context

export const useToast = () => {
    return useContext(ToastContext);
};

export default useToast;

export const ToastProvider = ({ children }) => {
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const triggerSuccessToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

    return (
        <ToastContext.Provider value={{ triggerSuccessToast }}>
            {children}
            <SuccessToast
                message={toastMessage}
                show={showToast}
                onClose={handleCloseToast}
            />
        </ToastContext.Provider>
    );
};
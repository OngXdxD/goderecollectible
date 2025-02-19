import React, { createContext, useState, useContext, useCallback } from "react";
import ToastMessage from "./toastMessage";

const ToastContext = createContext({
    triggerToast: () => {},
});

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        console.warn('useToast must be used within a ToastProvider');
        return { triggerToast: () => {} };
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("success");

    const triggerToast = useCallback((message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    }, []);

    const handleCloseToast = useCallback(() => {
        setShowToast(false);
    }, []);

    const value = React.useMemo(() => ({
        triggerToast
    }), [triggerToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {typeof window !== 'undefined' && (
                <ToastMessage
                    message={toastMessage}
                    show={showToast}
                    onClose={handleCloseToast}
                    type={toastType}
                />
            )}
        </ToastContext.Provider>
    );
}; 
import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Col, Form, FormGroup, Pagination, Row, OverlayTrigger, Tooltip, InputGroup, Modal } from "react-bootstrap";
import Seo from "../../../shared/layout-components/seo/seo";
const Select = dynamic(() => import("react-select"), { ssr: false });
import dynamic from "next/dynamic";
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import { baseUrl } from '../../api/config';
import useFetchAndCache from '../../../shared/hook/useFetchAndCache';
import { Toast, ToastContainer } from "react-bootstrap";
import SalesOrderTable from "../tables/createSalesOrderTable";
import { WidthNormal } from "@mui/icons-material";
import CreateProductModal from "../modals/createProductModal";
import CreateCustomerModal from "../modals/createCustomerModal";
import CreateBankModal from "../modals/createBankModal";
import useToast from "../toast/toastContext";

const CreateSalesOrder = () => {

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    };

    const [salesOrderNumber, setSalesOrderNumber] = useState("");
    const [businessList, setBusinessList] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [customerList, setCustomerList] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [bankList, setBankList] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [productList, setProductList] = useState(null);
    const [currency, setCurrency] = useState("");
    const [soDate, setSoDate] = useState(getCurrentDate());;
    const [paid, setPaid] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [remark, setRemark] = useState("");
    const [productRows, setProductRows] = useState([]);
    const [depositRows, setDepositRows] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [totalAmount, setTotalAmount] = useState("");
    const [totalDeposit, setTotalDeposit] = useState(0);
    const [balance, setBalance] = useState("");
    const { triggerToast } = useToast();
    const previewRef = useRef(null);


    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const handleShowCustomerModal = () => setShowCustomerModal(true);
    const handleCloseCustomerModal = () => setShowCustomerModal(false);
    const handleShowProductModal = () => setShowProductModal(true);
    const handleCloseProductModal = () => setShowProductModal(false);
    const handleShowBankModal = () => setShowBankModal(true);
    const handleCloseBankModal = () => setShowBankModal(false);

    useEffect(() => {
        fetchBusinessData();
        fetchCustomerData();
        fetchProductData();
        fetchBankData();
        generateSO();
        const total = productRows.reduce((acc, row) => acc + row.totalPrice, 0);
        setTotalAmount(total);
        const updatedBalance = totalAmount - paid;        
        setBalance(updatedBalance);
        const handleKeyPress = (event) => {
            if (event.ctrlKey && event.key === 'p') {
                event.preventDefault(); // Prevent the default print dialog
                handlePrint(); // Call your print function
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [productRows, paid]);

    const handlePrint = () => {
        const printContent = previewRef.current;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;

        window.print();

        document.body.innerHTML = originalContent;

    };

    const generateSO = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/bizsalesorder/getSONumber`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error("Failed to fetch SO number");
            }
            const soNumber = await response.text();
            setSalesOrderNumber(soNumber.replace(/"/g, ""));
        } catch (error) {
            console.error("Error fetching SO number:", error);
        }
    };

    const fetchBusinessData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/business/selectall`);
            const data = await response.json();
            const businesses = data.map(business => ({
                value: business.Id,
                label: business.Name
            }));
            setBusinessList(businesses);
        } catch (error) {
            console.error("Error fetching business data:", error);
        }
    };

    const handleBusinessSelect = (selectedOption) => {
        setSelectedBusiness(selectedOption); 
    };

    const fetchBankData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/bank/selectall`);
            const banks = await response.json();
            const formattedBanks = banks.map(bank => ({
                value: bank.Id, 
                label: bank.Name
            }));
            setBankList(formattedBanks);
        } catch (error) {
            console.error("Error fetching bank data:", error);
        }
    };

    const handleBankSelect = (selectedOption) => {
        setSelectedBank(selectedOption);
    };
    

    const fetchCustomerData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/customer/selectall`);
            const data = await response.json();
            const customers = data.map(customer => ({
                value: customer.Id,
                label: customer.Name,
            }));
            setCustomerList(customers);
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
    };

    const handleCustomerSelect = async (selectedOption) => {
        setSelectedCustomer(selectedOption); 

        if (!selectedOption) {
            setSelectedCustomer(null); 
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/customer/details/${selectedOption.value}`);
            if (!response.ok) {
                throw new Error("Failed to fetch customer details");
            }
            const customerDetails = await response.json();
            setSelectedCustomer(customerDetails);
        } catch (error) {
            console.error("Error fetching customer details:", error);
        }
    };

    const fetchProductData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/customerproduct/selectall`);
            const data = await response.json();
            const products = data.map(product => ({
                value: product.Id,
                label: product.Name
            }));
            setProductList(products);
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(`${baseUrl}/api/customerproduct/details/${productId}`);
            const productDetails = await response.json();

            const isDuplicate = productRows.some((row) => row.id === productId);
            if (isDuplicate) {
                return;
            }

            const newRow = {
                id: productId,
                name: productDetails.Name,
                quantity: 1, 
                price: productDetails.Price, 
                deposit: 0, 
                totalPrice: productDetails.Price,
            };

            setProductRows((prevRows) => [...prevRows, newRow]);
            setDepositRows((prevRows) => [...prevRows, newRow]);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const handleProductSelect = (selectedOptions) => {

        const selectedIds = selectedOptions.map((option) => option.value);
    

        selectedOptions.forEach((option) => {
            if (!productRows.find((row) => row.id === option.value)) {
                fetchProductDetails(option.value);
            }
        });
    

        const updatedRows = productRows.filter((row) => selectedIds.includes(row.id));
        setProductRows(updatedRows);
    
       
        const updatedTotal = updatedRows.reduce((acc, row) => acc + row.totalPrice, 0);
        setTotalAmount(updatedTotal);
    
        const updatedDeposit = updatedRows.reduce((acc, row) => acc + row.deposit, 0);
        setTotalDeposit(updatedDeposit);
    
        
        setSelectedProduct(selectedOptions);
    };

    const updateTotals = () => {
        const total = productRows.reduce((acc, row) => acc + row.totalPrice, 0);
        setTotalAmount(total);
    };

    const updateDeposit = () => {
        setDepositRows(currentRows => {
            const totalDeposit = currentRows.reduce((acc, row) => acc + (parseFloat(row.deposit) || 0), 0);
            setTotalDeposit(totalDeposit); 
            return currentRows;
        });
    };

    const updateRowQuantity = (index, quantity) => {
        const updatedRows = [...productRows];
        updatedRows[index].quantity = parseFloat(quantity) || 0;
        updatedRows[index].totalPrice = updatedRows[index].quantity * updatedRows[index].price;
        setProductRows(updatedRows);
        updateTotals(); 
    };

    const updateRowPrice = (index, price) => {
        const updatedRows = [...productRows];
        updatedRows[index].price = parseFloat(price) || 0;
        updatedRows[index].totalPrice = updatedRows[index].quantity * updatedRows[index].price;
        setProductRows(updatedRows);
        updateTotals(); 
    };

    const updateRowDeposit = (index, deposit) => {
        setDepositRows(currentRows => {
            const updatedRows = [...currentRows];
            if (!updatedRows[index]) {
                updatedRows[index] = { deposit: 0, totalDeposit: 0 };
            }
            updatedRows[index].deposit = parseFloat(deposit) || 0;
            return updatedRows;
        });
        updateDeposit(); 
    };

    const handleCurrencyChange = (selectedOption) => {
        setCurrency(selectedOption || {}); 
    };

    const handlePaymentMethodChange = (selectedOption) => {
        setSelectedPaymentMethod(selectedOption);
    };

    const { data: dropdownData, loading, error } = useFetchAndCache(
        ["Currency", "Country", "State", "PaymentMethod", "Series", "Category", "Brand"],
        `${baseUrl}/api/masterdata`
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const currencyOptions = dropdownData?.Currency?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const countryOptions = dropdownData?.Country?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const stateOptions = dropdownData?.State?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const paymentOptions = dropdownData?.PaymentMethod?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const seriesOptions = dropdownData?.Series?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const categoryOptions = dropdownData?.Category?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const brandOptions = dropdownData?.Brand?.map(item => ({
        value: item.Id,
        label: item.Name,
    }));

    const createSalesOrder = async () => {
        if (!selectedBusiness || !selectedCustomer || !currency || !selectedPaymentMethod || !selectedBank || productRows.length === 0) {
            triggerToast("Please select all required fields before submitting.", "danger");
            return; 
        }

        const salesTotal = totalAmount;
        const salesDeposit = totalDeposit;
        const salesData = {
            salesOrder: salesOrderNumber,
            AdminId: localStorage.getItem("adminId"),
            BusinessID: selectedBusiness?.value,
            Customer: selectedCustomer?.Customer.Id,
            PaymentMethod: selectedPaymentMethod?.value,
            ReceivingAccount: selectedBank?.value,
            TotalPrice: salesTotal,
            TotalDeposit: salesDeposit,
            Currency: currency?.value,
            OrderDate: soDate,
            Remark: remark,
            Items: productRows.map((row) => ({
                ProductID: row.id,
                Name: row.name,
                Quantity: row.quantity,
                Deposit: row.deposit,
                Price: row.price,
            })),
        };
    
        try {
            const response = await fetch(`${baseUrl}/api/bizsalesorder/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(salesData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "An error occurred while submitting the sales order.");
            }
    
            triggerToast("Sales Order Created Successfully!", "success");
            localStorage.setItem("selectedBusiness", selectedBusiness?.value || "");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.log('error', error)
        }
    };

    const resetForm = () => {
        setSalesOrderNumber("");
        setSelectedBusiness("");
        setSelectedCustomer("");
        setSelectedBank("");
        setSelectedPaymentMethod(null);
        setCurrency("");
        setSoDate(getCurrentDate());
        setPaid("");
        setRemark("");
        setProductRows([]);
        setDepositRows([]);
        setSelectedProduct([]);
        setTotalAmount("");
        setTotalDeposit(0);
        setBalance("");
    };
    

    return (
        <div>
            <Seo title={"Sales Order"} />
            <Pageheader title="Sales Order" heading="Create Sales Order" active="Create Sales Order" />

            {/* <!-- row --> */}
            <Row className="row-sm">

                <Col xl={6} lg={8} md={12}>
                    <Card>
                        <Card>
                            <Card.Body className="pb-0">

                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Business</Form.Label>
                                    <Select classNamePrefix="Select2"
                                        options={businessList}
                                        onChange={handleBusinessSelect}
                                        value={selectedBusiness} // Set the selected value
                                        placeholder="Select Business"
                                    />
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Customer</Form.Label>
                                    <InputGroup>
                                        <Select
                                            name="customer"
                                            className="basic-multi-select flex-grow-1"
                                            options={customerList}
                                            onChange={handleCustomerSelect}
                                            value={selectedCustomer?.Customer ? { value: selectedCustomer.Customer.Id, label: selectedCustomer.Customer.Name } : null}
                                            classNamePrefix="Select2"
                                            placeholder="Select Customer"
                                            isClearable={true}
                                            isLoading={loading}
                                            noOptionsMessage={() => "No options available"}
                                        />
                                        <Button variant='' className="btn btn-primary" type="button" onClick={handleShowCustomerModal}>Create Customer</Button>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Product</Form.Label>
                                    <InputGroup>
                                        <Select
                                            isMulti
                                            name="product"
                                            className="basic-multi-select flex-grow-1"
                                            options={productList}
                                            onChange={handleProductSelect}
                                            value={selectedProduct}
                                            classNamePrefix="Select2"
                                            placeholder="Select Product"
                                            isClearable={true}
                                            isLoading={loading}
                                            noOptionsMessage={() => "No options available"}
                                        />
                                        <Button variant='' className="btn btn-primary" type="button" onClick={handleShowProductModal}>Create Product</Button>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Payment Method</Form.Label>
                                    <Select
                                        options={paymentOptions}
                                        classNamePrefix="Select2"
                                        value={selectedPaymentMethod}
                                        onChange={handlePaymentMethodChange}
                                        placeholder="Select Payment Method"
                                    />
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Paid</Form.Label>
                                    <div className="d-flex" >
                                        <input
                                            value={paid}
                                            onChange={(e) => setPaid(e.target.value)}
                                            className="form-control"
                                            placeholder="Amount"
                                        />
                                        <Select
                                            options={currencyOptions}
                                            className="w-100"
                                            classNamePrefix="Select2"
                                            value={currency}
                                            onChange={handleCurrencyChange}
                                            placeholder="Select Currency"
                                        />
                                    </div>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Receiving Account</Form.Label>
                                    <InputGroup>
                                        <Select
                                            name="bank"
                                            className="basic-multi-select flex-grow-1"
                                            options={bankList}
                                            onChange={handleBankSelect}
                                            value={selectedBank}
                                            classNamePrefix="Select2"
                                            placeholder="Select Bank"
                                            isClearable={true}
                                            isLoading={loading}
                                            noOptionsMessage={() => "No options available"}
                                        />
                                        <Button variant='' className="btn btn-primary" type="button" onClick={handleShowBankModal}>Create Bank</Button>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        id="input-date"
                                        value={soDate}
                                        onChange={(e) => setSoDate(e.target.value)}
                                    />
                                </FormGroup>

                                <FormGroup className="form-group mt-2">
                                    <Form.Label className="form-label">Remark</Form.Label>
                                    <textarea
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        className="form-control"
                                        placeholder="Optional"
                                    />
                                </FormGroup>
                            </Card.Body>

                            <div className="d-flex justify-content-between py-2 px-3">
                                <button className="btn btn-primary" type="submit" onClick={createSalesOrder}>Create Sales Order</button>
                                <Button onClick={handlePrint} className="btn btn-warning">Print Sales Order</Button>
                                <button className="btn btn-danger" type="button" onClick={resetForm}>Clear All Items</button>
                            </div>
                        </Card>
                    </Card>
                </Col>
                {/* Preview Section */}
                <Col xl={6} lg={4} md={12}>
                    <Card ref={previewRef}>
                        <Card.Header>
                            <h3 className="card-title">Sales Order Preview</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="invoice-preview">
                                <h4>Sales Order <span>{salesOrderNumber}</span></h4>

                                <div>
                                    <h3>{selectedBusiness.label}</h3>
                                </div>

                                <div>
                                    <h5>{soDate}</h5>
                                </div>
                                <h4>BILL TO</h4>
                                <div>
                                    {selectedCustomer ? (
                                        <>
                                            <h5>{selectedCustomer.Customer?.Name}</h5>
                                            <h5>{selectedCustomer.Address?.DetailedAddress},</h5>
                                            <h5>
                                                {selectedCustomer.Address?.Postcode}{' '}
                                                {selectedCustomer.Address?.City && <span>{selectedCustomer.Address.City}, </span>}
                                                {selectedCustomer.Address?.State && <span>{selectedCustomer.Address.State}, </span>}
                                            </h5>
                                            <h5>{selectedCustomer.Address?.Country}</h5>
                                            <h5>{selectedCustomer.Customer?.PhoneNumber}</h5>
                                        </>
                                    ) : (
                                        <h5>No customer selected</h5>
                                    )}
                                </div>


                                <div>
                                    <SalesOrderTable
                                        productRows={productRows}
                                        updateRowQuantity={updateRowQuantity}
                                        updateRowPrice={updateRowPrice}
                                        updateRowDeposit={updateRowDeposit}
                                        totalAmount={totalAmount}
                                        totalDeposit={totalDeposit}
                                        totalPaid={paid}
                                        balance={balance}
                                        currency={currency.label}
                                    />
                                </div>

                                <div>
                                    <h5>Remark</h5>
                                    <p>{remark}</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            {/* <!-- row closed --> */}

            {/* Modals for Customer and Product */}

            <CreateCustomerModal
                show={showCustomerModal}
                onClose={handleCloseCustomerModal}
                countryOptions={countryOptions}
                stateOptions={stateOptions}
                baseUrl={baseUrl}
                populateCustomer={fetchCustomerData}
            />

            <CreateProductModal
                show={showProductModal}
                onClose={handleCloseProductModal}
                seriesOptions={seriesOptions}
                categoryOptions={categoryOptions}
                brandOptions={brandOptions}
                baseUrl={baseUrl}
                populateProduct={fetchProductData}
            />

            <CreateBankModal
                show={showBankModal}
                onClose={handleCloseBankModal}
                baseUrl={baseUrl}
                populateBank={fetchBankData}
            />

        </div>
    );
};

CreateSalesOrder.layout = "Contentlayout";

export default CreateSalesOrder;
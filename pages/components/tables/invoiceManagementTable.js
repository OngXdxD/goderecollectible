import React, { useState, useEffect } from "react";
import { baseUrl } from '../../api/config';
import { Table, InputGroup, Form, FormGroup, Button, Pagination, Dropdown, Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faFilter, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import DeleteSalesOrderModal from "../modals/deleteSalesOrderModal";
import useToast from "../toast/toastContext";
import SalesOrderFilterOffcanvas from "../offcanvas/salesOrderFilterOffcanvas";

const InvoiceManagementTable = () => {
    const [invoice, setInvoice] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState([]);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showModal, setShowModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState([]);
    const { triggerToast } = useToast();
    const [showFilter, setShowFilter] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minTotalPrice, setMinTotalPrice] = useState('');
    const [maxTotalPrice, setMaxTotalPrice] = useState('');



    useEffect(() => {
        fetchInvoice();
        fetchCustomerData();
        fetchBusinessData();
    }, [currentPage, itemsPerPage]);

    const fetchInvoice = async (
        search = searchTerm,
        field = sortField,
        order = sortOrder,
        customer = selectedCustomer,
        business = selectedBusiness,
        startDate = '',
        endDate = '',
        minPrice = minTotalPrice,
        maxPrice = maxTotalPrice) => {

        const offset = (currentPage - 1) * itemsPerPage;
        const sortQuery = field ? `&sortField=${field}&sortOrder=${order}` : '';
        const customerQuery = customer ? `&customerName=${encodeURIComponent(customer)}` : '';
        const businessQuery = business ? `&businessName=${encodeURIComponent(business)}` : '';
        const dateQuery = startDate || endDate ? `&startDate=${startDate}&endDate=${endDate}` : '';
        const minPriceQuery = minPrice ? `&minTotalPrice=${minPrice}` : '';
        const maxPriceQuery = maxPrice ? `&maxTotalPrice=${maxPrice}` : '';

        try {
            const response = await fetch(`${baseUrl}/api/customerinvoice/getAllInvoices?search=${encodeURIComponent(search)}&start=${offset}&length=${itemsPerPage}${sortQuery}${customerQuery}${businessQuery}${dateQuery}${minPriceQuery}${maxPriceQuery}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('data', data)
            setInvoice(data.data);
            setTotalRecords(data.recordsTotal);

        } catch (error) {
            console.error('Failed to fetch sales orders:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
        setCurrentPage(1);
        fetchInvoice('', 1, itemsPerPage);
    };
    const renderPagination = () => {
        const items = [];
        const pageCount = Math.ceil(totalRecords / itemsPerPage);

        for (let number = 1; number <= pageCount; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                    {number}
                </Pagination.Item>,
            );
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                    {items}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageCount} />
                    <Pagination.Last onClick={() => setCurrentPage(pageCount)} disabled={currentPage === pageCount} />
                </Pagination>
            </div>
        );
    };

    const handleCheckboxChange = (soNumber) => {
        setSelectedInvoice((prev) =>
            prev.includes(soNumber)
                ? prev.filter((num) => num !== soNumber)
                : [...prev, soNumber]
        );
    };

    const handleSelectAll = () => {
        setSelectAll((prev) => !prev);
        if (!selectAll) {
            setSelectedInvoice(invoice.map((i) => i.InvoiceNumber));
        } else {
            setSelectedInvoice([]);
        }
    };

    const handleDelete = (soNumber) => {
        setDeleteTarget(soNumber ? [soNumber] : selectedInvoice);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        deleteTarget.forEach(async (invoice) => {
            const response = await fetch(`${baseUrl}/api/customerinvoice/delete/${invoice}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log("Deleted:", invoice);
            } else {
                console.error("Failed to delete:", invoice);
            }
        });

        setInvoice(invoice.filter(invoice => !deleteTarget.includes(invoice.InvoiceNumber)));
        setSelectedInvoice(prev => prev.filter(invoice => !deleteTarget.includes(invoice)));
        setShowModal(false);
        triggerToast("Invoice Deleted Successfully!", "success");

    };

    const sortData = (field, order) => {
        const sortedData = [...invoice].sort((a, b) => {
            if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setInvoice(sortedData);
    };

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
        sortData(field, order);
    };

    const fetchCustomerData = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/customer/selectall`);
            const data = await response.json();
            const customers = data.map(customer => ({
                value: customer.Id,
                label: customer.Name,
            }));
            setCustomers(customers);
        } catch (error) {
            console.error("Error fetching customer data:", error);
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
            setBusinesses(businesses);
        } catch (error) {
            console.error("Error fetching business data:", error);
        }
    };

    const toggleFilter = () => setShowFilter(!showFilter);

    const applyFilters = () => {
        setCurrentPage(1);
        fetchInvoice(searchTerm, sortField, sortOrder, selectedCustomer, selectedBusiness, startDate, endDate, minTotalPrice, maxTotalPrice);
        setShowFilter(false);

    };

    const resetFilters = () => {
        setSelectedCustomer('');
        setSelectedBusiness('');
        setStartDate('');
        setEndDate('');
        setMinTotalPrice('');
        setMaxTotalPrice('');
        setSearchTerm('');
        setCurrentPage(1);

        fetchInvoice('', '', '', '', '', '', '', '');
        setShowFilter(false);

    };


    return (
        <div>
            <Form onSubmit={e => e.preventDefault()} className="mb-2">
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        value={searchTerm}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                fetchInvoice();
                            }
                        }}
                    />

                    {searchTerm && (
                        <Button variant="danger" onClick={handleClear}>
                            Clear
                        </Button>
                    )}
                    <Button variant="dark" onClick={() => fetchInvoice()}>
                        Search
                    </Button>

                </InputGroup>
            </Form>

            <Table striped bordered hover>
                <thead className="thead-dark">
                    <tr>
                        <th colSpan="7" className="bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="light" style={{ border: '1px solid #919090' }}>
                                            {itemsPerPage}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {[10, 25, 50, 100].map(size => (
                                                <Dropdown.Item key={size} onClick={() => setItemsPerPage(size)}>
                                                    {size}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Form.Label style={{ marginLeft: 8, marginBottom: 0 }}>Items per page</Form.Label>

                                </div>
                                <div>
                                    <Button variant="primary" className="me-2" onClick={toggleFilter}>
                                        <FontAwesomeIcon icon={faFilter} />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete()} disabled={selectedInvoice.length === 0}>
                                        <FontAwesomeIcon icon={faTrash} />

                                    </Button>

                                    <SalesOrderFilterOffcanvas
                                        show={showFilter}
                                        onClose={toggleFilter}
                                        customers={customers}
                                        businesses={businesses}
                                        selectedCustomer={selectedCustomer}
                                        setSelectedCustomer={setSelectedCustomer}
                                        selectedBusiness={selectedBusiness}
                                        setSelectedBusiness={setSelectedBusiness}
                                        startDate={startDate}
                                        setStartDate={setStartDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                        minTotalPrice={minTotalPrice}
                                        setMinTotalPrice={setMinTotalPrice}
                                        maxTotalPrice={maxTotalPrice}
                                        setMaxTotalPrice={setMaxTotalPrice}
                                        applyFilters={applyFilters}
                                        resetFilters={resetFilters}
                                    />
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "center" }}>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th onClick={() => handleSort('InvoiceNumber')}>
                            Invoice Number
                            <span style={{ float: 'right' }}>
                                {sortField === 'InvoiceNumber' ? (sortOrder === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />) : <FontAwesomeIcon icon={faSortDown} />}
                            </span>
                        </th>
                        <th onClick={() => handleSort('CustomerName')}>
                            Customer
                            <span style={{ float: 'right' }}>
                                {sortField === 'CustomerName' ? (sortOrder === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />) : <FontAwesomeIcon icon={faSortDown} />}
                            </span>
                        </th>
                        <th onClick={() => handleSort('BusinessName')}>
                            Business
                            <span style={{ float: 'right' }}>
                                {sortField === 'BusinessName' ? (sortOrder === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />) : <FontAwesomeIcon icon={faSortDown} />}
                            </span>
                        </th>
                        <th onClick={() => handleSort('InvoiceDate')}>
                            Date
                            <span style={{ float: 'right' }}>
                                {sortField === 'InvoiceDate' ? (sortOrder === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />) : <FontAwesomeIcon icon={faSortDown} />}
                            </span>
                        </th>
                        <th onClick={() => handleSort('TotalPrice')}>
                            Total Price
                            <span style={{ float: 'right' }}>
                                {sortField === 'TotalPrice' ? (sortOrder === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />) : <FontAwesomeIcon icon={faSortDown} />}
                            </span>
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.length > 0 ? (
                        invoice.map((invoice, index) => (
                            <tr key={invoice.InvoiceNumber}>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedInvoice.includes(invoice.InvoiceNumber)}
                                        onChange={() => handleCheckboxChange(invoice.InvoiceNumber)}
                                    />
                                </td>
                                <td>{invoice.InvoiceNumber}</td>
                                <td>{invoice.CustomerName}</td>
                                <td>{invoice.BusinessName}</td>
                                <td>{new Date(invoice.InvoiceDate).toLocaleDateString()}</td>
                                <td>{Intl.NumberFormat("en-US").format(invoice.TotalPrice)}</td>
                                <td>
                                    <Button className="me-2 btn-info" >
                                        <FontAwesomeIcon icon={faEye} />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(invoice.InvoiceNumber)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", fontSize: "15px" }}>No data available in table</td>
                        </tr>
                    )}
                </tbody>

            </Table>
            {renderPagination()}

            <DeleteSalesOrderModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmDelete}
                items={deleteTarget}
            />

        </div >
    );
};

export default InvoiceManagementTable;
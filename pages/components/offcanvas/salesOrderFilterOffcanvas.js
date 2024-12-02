import React from "react";
import { Offcanvas, Form, FormGroup, Button, Dropdown } from "react-bootstrap";

const SalesOrderFilterOffcanvas = ({
    show,
    onClose,
    customers,
    businesses,
    selectedCustomer,
    setSelectedCustomer,
    selectedBusiness,
    setSelectedBusiness,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    minTotalPrice,
    setMinTotalPrice,
    maxTotalPrice,
    setMaxTotalPrice,
    applyFilters,
    resetFilters,
}) => {
    return (
        <Offcanvas show={show} onHide={onClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Filter Sales Orders</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    {/* Customer Filter */}
                    <FormGroup className="mb-3">
                        <Form.Label>Customer</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle variant="light" style={{ width: "100%" }} className="d-flex justify-content-between align-items-center">
                                {selectedCustomer || "Select Customer"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {customers.map((customer) => (
                                    <Dropdown.Item
                                        key={customer.value}
                                        onClick={() => setSelectedCustomer(customer.label)}
                                    >
                                        {customer.label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </FormGroup>

                    {/* Business Filter */}
                    <FormGroup className="mb-3">
                        <Form.Label>Business</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle variant="light" style={{ width: "100%" }} className="d-flex justify-content-between align-items-center">
                                {selectedBusiness || "Select Business"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {businesses.map((business) => (
                                    <Dropdown.Item
                                        key={business.value}
                                        onClick={() => setSelectedBusiness(business.label)}
                                    >
                                        {business.label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </FormGroup>

                    {/* Date Filter */}
                    <FormGroup className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <div className="d-flex">
                            <Form.Control
                                type="date"
                                placeholder="Start date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="me-2"
                            />
                            <Form.Control
                                type="date"
                                placeholder="End date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </FormGroup>

                    {/* Total Price Filter */}
                    <FormGroup className="mb-3">
                        <Form.Label>Total Price</Form.Label>
                        <div className="d-flex">
                            <Form.Control
                                type="number"
                                placeholder="Min price"
                                value={minTotalPrice}
                                onChange={(e) => setMinTotalPrice(e.target.value)}
                                className="me-2"
                            />
                            <Form.Control
                                type="number"
                                placeholder="Max price"
                                value={maxTotalPrice}
                                onChange={(e) => setMaxTotalPrice(e.target.value)}
                            />
                        </div>
                    </FormGroup>

                    <Button variant="primary" onClick={applyFilters} className="me-2">
                        Apply Filters
                    </Button>
                    <Button variant="danger" onClick={resetFilters}>
                        Reset Filters
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default SalesOrderFilterOffcanvas;

import React from "react";
import { Table, InputGroup, Form } from "react-bootstrap";

const InvoiceTable = ({ productRows, updateRowQuantity, updateRowDeposit, updateRowPrice, totalAmount, totalDeposit, totalPaid, balance, currency }) => {

    return (
        <div>
            <Table striped bordered hover>
                <thead className="thead-dark">
                    <tr>
                        <th className="col-name">Product Name</th>
                        <th className="col-quantity">Quantity</th>
                        <th className="col-deposit">Deposit</th>
                        <th className="col-price">Price</th>
                        <th className="col-total">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {productRows.map((row, index) => (
                        <tr key={row.id || index}>
                            <td>{row.name}</td>
                            <td>
                                <Form.Control
                                    type="number"
                                    value={row.quantity}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (!isNaN(value)) {
                                            value = value.replace(/^0+/, ''); // Remove leading zeros
                                            updateRowQuantity(index, value === '' ? 0 : parseFloat(value)); // Update row cost
                                        }
                                    }}
                                    min="1"
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="number"
                                    value={row.deposit}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (!isNaN(value)) {
                                            value = value.replace(/^0+/, ''); // Remove leading zeros
                                            updateRowDeposit(index, value === '' ? 0 : parseFloat(value)); // Update row cost
                                        }
                                    }}
                                    min="0"
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="number"
                                    value={row.price}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (!isNaN(value)) {
                                            value = value.replace(/^0+/, ''); // Remove leading zeros
                                            updateRowPrice(index, value === '' ? 0 : parseFloat(value)); // Update row cost
                                        }
                                    }}
                                    min="0"
                                />
                            </td>
                            <td>{Intl.NumberFormat("en-US").format(row.totalPrice)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" className="text-end"><strong>Total Amount:</strong></td>
                        <td>{currency}</td>
                        <td> {Intl.NumberFormat("en-US").format(totalAmount)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" className="text-end"><strong>(Less) Deposit:</strong></td>
                        <td>{currency}</td>
                        <td> {Intl.NumberFormat("en-US").format(totalDeposit)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" className="text-end"><strong>Paid Amount:</strong></td>
                        <td>{currency}</td>
                        <td> {Intl.NumberFormat("en-US").format(totalPaid)}</td>
                    </tr>
                    <tr>
                        <td colSpan="3" className="text-end"><strong>Balance:</strong></td>
                        <td>{currency}</td>
                        <td> {Intl.NumberFormat("en-US").format(balance)}</td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    );
};

export default InvoiceTable;
import React from "react";
import { Table, InputGroup, Form } from "react-bootstrap";

const PurchaseOrderProductTable = ({ productRows, updateRowQuantity, updateRowCost, totalAmount, currency }) => {
    return (
        <div>
            <Table striped bordered hover className="fixed-width-table">
                <thead>
                    <tr>
                        <th className="col-name">Product Name</th>
                        <th className="col-quantity">Quantity</th>
                        <th className="col-cost">Cost</th>
                        <th className="col-total">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {productRows.map((row, index) => (
                        <tr key={row.id}>
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
                                    value={row.cost}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (!isNaN(value)) {
                                            value = value.replace(/^0+/, ''); // Remove leading zeros
                                            updateRowCost(index, value === '' ? 0 : parseFloat(value)); // Update row cost
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
						<td>{currency} {Intl.NumberFormat("en-US").format(totalAmount)}</td>
					</tr>
				</tfoot>
            </Table>
        </div>
    );
};

export default PurchaseOrderProductTable;
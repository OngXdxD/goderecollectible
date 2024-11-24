import React from "react";
import { Table, InputGroup, Form } from "react-bootstrap";

const PurchaseOrderProductTable = ({ productRows, updateRowQuantity, updateRowCost, totalAmount }) => {
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Cost</th>
                        <th>Total</th>
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
                                    onChange={(e) => updateRowQuantity(index, e.target.value)}
                                    min="1"
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="number"
                                    value={row.cost}
                                    onChange={(e) => updateRowCost(index, e.target.value)}
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
						<td>{totalAmount.toFixed(2)}</td>
					</tr>
				</tfoot>
            </Table>
        </div>
    );
};

export default PurchaseOrderProductTable;
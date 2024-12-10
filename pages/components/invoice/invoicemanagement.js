import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Col, Form, FormGroup, Pagination, Row, OverlayTrigger, Tooltip, InputGroup, Modal } from "react-bootstrap";
import Seo from "../../../shared/layout-components/seo/seo";
const Select = dynamic(() => import("react-select"), { ssr: false });
import dynamic from "next/dynamic";
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import { baseUrl } from '../../api/config';
import useFetchAndCache from '../../../shared/hook/useFetchAndCache';
import { Toast, ToastContainer } from "react-bootstrap";
import InvoiceManagementTable from "../tables/invoiceManagementTable";
import { WidthNormal } from "@mui/icons-material";
import CreateProductModal from "../modals/createProductModal";
import CreateCustomerModal from "../modals/createCustomerModal";
import CreateBankModal from "../modals/createBankModal";
import useToast from "../toast/toastContext";

const InvoiceManagement = () => {
    return (
        <div>
            <Seo title={"Invoice Management"} />
            <Pageheader title="Invoice Management" heading="Invoice" active="Invoice Management" />

            {/* <!-- row --> */}
            <Row className="row-sm">

                <Col xl={12} lg={16} md={24}>

                    <div>
                        <InvoiceManagementTable/>
                    </div>
                </Col>
            </Row>

            {/* <!-- row closed --> */}

            {/* Modals for Customer and Product */}

        </div>
    );
};

InvoiceManagement.layout = "Contentlayout";

export default InvoiceManagement;
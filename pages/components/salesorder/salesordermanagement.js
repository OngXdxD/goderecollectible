import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Col, Form, FormGroup, Pagination, Row, OverlayTrigger, Tooltip, InputGroup, Modal } from "react-bootstrap";
import Seo from "../../../shared/layout-components/seo/seo";
const Select = dynamic(() => import("react-select"), { ssr: false });
import dynamic from "next/dynamic";
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import { baseUrl } from '../../api/config';
import useFetchAndCache from '../../../shared/hook/useFetchAndCache';
import { Toast, ToastContainer } from "react-bootstrap";
import SalesOrderManagementTable from "../tables/salesOrderManagementTable";
import { WidthNormal } from "@mui/icons-material";
import CreateProductModal from "../modals/createProductModal";
import CreateCustomerModal from "../modals/createCustomerModal";
import CreateBankModal from "../modals/createBankModal";
import useToast from "../toast/toastContext";

const SalesOrderManagement = () => {
    return (
        <div>
            <Seo title={"Sales Order Management"} />
            <Pageheader title="Sales Order Management" heading="Sales Order Management" active="Sales Order Management" />

            {/* <!-- row --> */}
            <Row className="row-sm">

                <Col xl={12} lg={16} md={24}>

                    <div>
                        <SalesOrderManagementTable
                        />
                    </div>
                </Col>
            </Row>

            {/* <!-- row closed --> */}

            {/* Modals for Customer and Product */}

        </div>
    );
};

SalesOrderManagement.layout = "Contentlayout";

export default SalesOrderManagement;
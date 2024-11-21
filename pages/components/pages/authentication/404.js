import React from "react";
import { Container, Row } from "react-bootstrap";
import Link from "next/link";
import Seo from "../../../../shared/layout-components/seo/seo";
import { Helmet, HelmetProvider } from "react-helmet-async";

export const Error404 = () => {
	return (
		<div>
			<HelmetProvider>
				<Helmet>
					<body className='error-1 bg-primary'></body>
				</Helmet>
			</HelmetProvider>
			<Seo title={"404"} />

			<div className="square-box">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div className="page error-bg">
				{/*<!-- Start::error-page -->*/}
				<div className="main-error-wrapper page page-h pe-1">
					<Container className="">
						<div className="text-center my-auto">
							<Row className=" align-items-center justify-content-center h-100">
								<div>
									<h1 className="text-fixed-white">404<span className="fs-20">error</span></h1>
									<h2 className="text-fixed-white">Oops. The page you were looking for doesn't exist.</h2>
									<h6 className="text-fixed-white op-6">You may have mistyped the address or the page may have moved.</h6>
									<Link className="btn btn-light" href="/components/dashboards/dashboard1/">Back to Home</Link>
								</div>
							</Row>
						</div>
					</Container>
				</div>
			</div>
		</div>
	);
};

Error404.layout = "Authenticationlayout";

export default Error404;

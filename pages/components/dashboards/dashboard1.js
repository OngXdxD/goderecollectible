import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Breadcrumb, Col, Row, Card, Toast } from "react-bootstrap";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import * as Dashboarddata from "../../../shared/data/dashboards/dashboards1data";
import { BasicTable } from "../../../shared/data/dashboards/dashboards1data";
import Link from "next/link";
import Seo from "../../../shared/layout-components/seo/seo";
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
const Dashboard = () => {
	const [show5, setShow5] = useState(false);
	const router = useRouter();
    const [showToast, setShowToast] = useState(false);
    const [username, setUsername] = useState(""); 

	useEffect(() => {
        // Extract username from query parameters
        const { username } = router.query;
        if (username) {
            setUsername(username); // Update username
            setShowToast(true);    // Show toast notification
        }
    }, [router.query]);

	return (
		<>
			<Seo title={"Dashboard1"} />
			<React.Fragment>
				<Pageheader title="DASHBOARD" heading="Dashboard" active="Sales" />
				{/* <!-- row --> */}
				<div
					style={{
						position: "fixed",
						top: "20px",
						right: "20px",
						zIndex: 1050,
					}}
				>
					<Toast
                        id="successToast"
                        className="toast colored-toast bg-success-transparent"
                        role="alert"
                        aria-live="assertive"
                        onClose={() => setShowToast(false)}
                        show={showToast}
                        delay={3000}
                        autohide
                        aria-atomic="true"
                    >
                        <Toast.Header className="bg-success text-fixed-white">
                            <img
                                className="bd-placeholder-img rounded me-2"
                                src="../../../assets/images/brand-logos/toggle-dark.png"
                                alt="..."
                            />
                            <strong className="me-auto">Nowa</strong>
                        </Toast.Header>
                        <Toast.Body>Welcome back, {username}! You have successfully logged in.</Toast.Body>
                    </Toast>
				</div>
				<Row>
					<Col xxl={5} xl={12} lg={12} md={12} sm={12}>
						<Row>
							<Col xl={12} lg={12} md={12} xs={12}>
								<Card >
									<Card.Body >
										<Row >
											<Col xl={9} lg={7} md={6} sm={12} className="mb-sm-0 mb-4 ">
												<div className="text-justified align-items-center">
													<h3 className="text-dark fw-semibold mb-2 mt-0">Hi, Welcome Back <span className="text-primary">Nick!</span></h3>
													<p className="text-dark fs-14 mb-3 lh-3"> You have used the 85% of free plan storage. Please upgrade your plan to get unlimited storage.</p>
													<button className="btn btn-primary shadow">Upgrade Now</button>
												</div>
											</Col>
											<Col
												xl={3}
												lg={5}
												md={6}
												sm={12}
												className="d-flex align-items-center justify-content-center upgrade-chart-circle"
											>
												<div className="chart-circle" data-color>
													<div id="radialbar-basic1">
														<ReactApexChart
															options={Dashboarddata.Radialbar.options}
															series={Dashboarddata.Radialbar.series}
															type="radialBar"
															height={170} width={170}
														/>
													</div>
													<div className="chart-circle-value circle-style">
														<div className="fs-18 fw-semibold">85%</div>
													</div>
												</div>
											</Col>
										</Row>
									</Card.Body>
								</Card>
							</Col>
							<Col xl={6} lg={6} md={6} sm={6} xs={12}>
								<Card className=" sales-card">
									<Row >
										<div className="col-8">
											<div className="ps-4 pt-4 pe-3 pb-4">
												<div className="">
													<span className="mb-2 fs-12 fw-semibold d-block">Today Orders</span>
												</div>
												<div className="pb-0 mt-0">
													<div className="d-flex">
														<h4 className="fs-20 fw-semibold mb-2">5,472</h4>
													</div>
													<p className="mb-0 fs-12 text-muted">Last week<i className="bx bx-caret-up mx-2 text-success"></i>
														<span className="text-success fw-semibold"> +427</span>
													</p>
												</div>
											</div>
										</div>
										<div className="col-4">
											<div className="circle-icon bg-primary-transparent text-center align-self-center overflow-hidden">
												<i className="fe fe-shopping-bag fs-16 text-primary"></i>
											</div>
										</div>
									</Row>
								</Card>
							</Col>

							<Col xl={6} lg={6} md={6} sm={6} xs={12}>
								<Card className=" sales-card">
									<Row className="row">
										<div className="col-8">
											<div className="ps-4 pt-4 pe-3 pb-4">
												<div className="">
													<span className="mb-2 fs-12 fw-semibold d-block">Today Earnings</span>
												</div>
												<div className="pb-0 mt-0">
													<div className="d-flex">
														<h4 className="fs-20 fw-semibold mb-2">$7,589</h4>
													</div>
													<p className="mb-0 fs-12 text-muted">Last week<i className="bx bx-caret-down mx-2 text-danger"></i>
														<span className="fw-semibold text-danger"> -453</span>
													</p>
												</div>
											</div>
										</div>
										<div className="col-4">
											<div className="circle-icon bg-info-transparent text-center align-self-center overflow-hidden">
												<i className="fe fe-dollar-sign fs-16 text-info"></i>
											</div>
										</div>
									</Row>
								</Card>
							</Col>

							<Col xl={6} lg={6} md={6} sm={6} xs={12}>
								<Card className=" sales-card">
									<Row className="row">
										<div className="col-8">
											<div className="ps-4 pt-4 pe-3 pb-4">
												<div className="">
													<span className="mb-2 fs-12 fw-semibold d-block">Profit Gain</span>
												</div>
												<div className="pb-0 mt-0">
													<div className="d-flex">
														<h4 className="fs-20 fw-semibold mb-2">$8,943</h4>
													</div>
													<p className="mb-0 fs-12 text-muted">Last week<i className="bx bx-caret-up mx-2 text-success"></i>
														<span className=" text-success fw-semibold"> +788</span>
													</p>
												</div>
											</div>
										</div>
										<div className="col-4">
											<div className="circle-icon bg-secondary-transparent text-center align-self-center overflow-hidden">
												<i className="fe fe-external-link fs-16 text-secondary"></i>
											</div>
										</div>
									</Row>
								</Card>
							</Col>
							<Col xl={6} lg={6} md={6} sm={6} xs={12}>
								<Card className=" sales-card">
									<Row className="row">
										<div className="col-8">
											<div className="ps-4 pt-4 pe-3 pb-4">
												<div className="">
													<span className="mb-2 fs-12 fw-semibold d-block">Total Earnings</span>
												</div>
												<div className="pb-0 mt-0">
													<div className="d-flex">
														<h4 className="fs-20 fw-semibold mb-2">$57.2M</h4>
													</div>
													<p className="mb-0 fs-12  text-muted">Last week<i className="bx bx-caret-down mx-2 text-danger"></i>
														<span className="text-danger fw-semibold"> -693</span>
													</p>
												</div>
											</div>
										</div>
										<div className="col-4">
											<div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
												<i className="fe fe-credit-card fs-16 text-warning"></i>
											</div>
										</div>
									</Row>
								</Card>
							</Col>

							<Col xl={12} lg={12} md={12} sm={12} xs={12}>
								<Card >
									<Card.Header className=" pb-1">
										<h3 className="card-title mb-2">Browser Usage</h3>
									</Card.Header>
									<Card.Body className="card-body p-0">
										<div className="browser-stats">
											<div className="d-flex align-items-center item  border-bottom my-2">
												<div className="d-flex">
													<img src="../../../assets/images/svgicons/chrome.svg" alt="img" className="ht-30 wd-30 me-2" />
													<div className="truncate">
														<h6 className="">Chrome</h6>
														<span className="text-muted fs-12">Google, Inc.</span>
													</div>
												</div>
												<div className="ms-auto my-auto">
													<div className="d-flex">
														<span className="me-4 mt-1 fw-semibold fs-16">35,502</span>
														<span className="text-success fs-13 my-auto"><i className="fe fe-trending-up text-success mx-2 my-auto"></i>12.75%</span>
													</div>
												</div>
											</div>
											<div className="d-flex align-items-center item  border-bottom my-2">
												<div className="d-flex">
													<img src="../../../assets/images/svgicons/edge.svg" alt="img" className="ht-30 wd-30 me-2" />
													<div className="truncate">
														<h6 className="">Edge</h6>
														<span className="text-muted fs-12">Microsoft Corporation, Inc.</span>
													</div>
												</div>
												<div className="ms-auto my-auto">
													<div className="d-flex">
														<span className="me-4 mt-1 fw-semibold fs-16">25,364</span>
														<span className="text-success"><i className="fe fe-trending-down text-danger mx-2 my-auto"></i>24.37%</span>
													</div>
												</div>
											</div>
											<div className="d-flex align-items-center item  border-bottom my-2">
												<div className="d-flex">
													<img src="../../../assets/images/svgicons/firefox.svg" alt="img" className="ht-30 wd-30 me-2" />
													<div className="truncate">
														<h6 className="">Firefox</h6>
														<span className="text-muted fs-12">Mozilla Foundation, Inc.</span>
													</div>
												</div>
												<div className="ms-auto my-auto">
													<div className="d-flex">
														<span className="me-4 mt-1 fw-semibold fs-16">14,635</span>
														<span className="text-success"><i className="fe fe-trending-up text-success mx-2 my-auto"></i>15,63%</span>
													</div>
												</div>
											</div>
											<div className="d-flex align-items-center item  border-bottom my-2">
												<div className="d-flex">
													<img src="../../../assets/images/svgicons/safari.svg" alt="img" className="ht-30 wd-30 me-2" />
													<div className="truncate">
														<h6 className="">Safari</h6>
														<span className="text-muted fs-12">Apple Corporation, Inc.</span>
													</div>
												</div>
												<div className="ms-auto my-auto">
													<div className="d-flex">
														<span className="me-4 mt-1 fw-semibold fs-16">35,657</span>
														<span className="text-danger"><i className="fe fe-trending-up text-success mx-2 my-auto"></i>12.54%</span>
													</div>
												</div>
											</div>
											<div className="d-flex align-items-center item my-2 pb-3">
												<div className="d-flex">
													<img src="../../../assets/images/svgicons/opera.svg" alt="img" className="ht-30 wd-30 me-2" />
													<div className="truncate">
														<h6 className="">Opera</h6>
														<span className="text-muted fs-12">Opera, Inc.</span>
													</div>
												</div>
												<div className="ms-auto my-auto">
													<div className="d-flex">
														<span className="me-4 mt-1 fw-semibold fs-16">12,563</span>
														<span className="text-danger"><i className="fe fe-trending-down text-danger mx-2 my-auto"></i>15.12%</span>
													</div>
												</div>
											</div>
										</div>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Col>
					<Col xxl={7} xl={12} lg={12} md={12} sm={12} xs={12}>
						<Card className=" custom-card overflow-hidden">
							<Card.Header className=" border-bottom-0">
								<div>
									<h3 className="card-title mb-2 ">Project Budget</h3> <span className="d-block fs-12 mb-0 text-muted"></span>
								</div>
							</Card.Header>
							<Card.Body>
								<div id="statistics1">
									<Dashboarddata.Statistics1 />
								</div>
							</Card.Body>
						</Card>
						<Row >
							<Col xl={6} lg={12} sm={12} >
								<Card className=" overflow-hidden">
									<Card.Header className=" pb-1">
										<h3 className="card-title mb-2">Recent Customers</h3>
									</Card.Header>
									<Card.Body className=" p-0 customers mt-1">
										<div className="list-group list-lg-group list-group-flush">
											<Link href="#!" className="border-0">
												<div className="list-group-item list-group-item-action p-3 border-0">
													<div className="media mt-0">
														<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/2.jpg" alt="Image description" />
														<div className="media-body flex-fill">
															<div className="d-flex align-items-center">
																<div className="mt-0">
																	<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Samantha Melon</h5>
																	<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
																</div>
																<span className="ms-auto wd-45p fs-14">
																	<span className="float-end badge bg-success-transparent">
																		<span className="op-7 text-success fw-semibold">paid </span>
																	</span>
																</span>
															</div>
														</div>
													</div>
												</div>
											</Link>
											<Link href="#!" className="border-0">
												<div className="list-group-item list-group-item-action p-3 border-0" >
													<div className="media mt-0">
														<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/1.jpg" alt="Image description" />
														<div className="media-body flex-fill">
															<div className="d-flex align-items-center">
																<div className="mt-1">
																	<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Allie Grater</h5>
																	<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
																</div>
																<span className="ms-auto wd-45p fs-14">
																	<span className="float-end badge bg-danger-transparent ">
																		<span className="op-7 text-danger fw-semibold">Pending</span>
																	</span>
																</span>
															</div>
														</div>
													</div>
												</div>
											</Link>
											<Link href="#!" className="border-0">
												<div className="list-group-item list-group-item-action p-3 border-0" >
													<div className="media mt-0">
														<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/5.jpg" alt="Image description" />
														<div className="media-body flex-fill">
															<div className="d-flex align-items-center">
																<div className="mt-1">
																	<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Gabe Lackmen</h5>
																	<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
																</div>
																<span className="ms-auto wd-45p  fs-14">
																	<span className="float-end badge bg-danger-transparent ">
																		<span className="op-7 text-danger fw-semibold">Pending</span>
																	</span>
																</span>
															</div>
														</div>
													</div>
												</div>
											</Link>
											<Link href="#!" className="border-0">
												<div className="list-group-item list-group-item-action p-3 border-0" >
													<div className="media mt-0">
														<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/7.jpg" alt="Image description" />
														<div className="media-body flex-fill">
															<div className="d-flex align-items-center">
																<div className="mt-1">
																	<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Manuel Labor</h5>
																	<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
																</div>
																<span className="ms-auto wd-45p fs-14">
																	<span className="float-end badge bg-success-transparent ">
																		<span className="op-7 text-success fw-semibold">Paid</span>
																	</span>
																</span>
															</div>
														</div>
													</div>
												</div>
											</Link>
											<Link href="#!" className="border-0">
												<div className="list-group-item list-group-item-action p-3 border-0" >
													<div className="media mt-0">
														<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/9.jpg" alt="Image description" />
														<div className="media-body flex-fill">
															<div className="d-flex align-items-center">
																<div className="mt-1">
																	<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Hercules Bing</h5>
																	<p className="mb-0 fs-12 text-muted">User ID: #1754</p>
																</div>
																<span className="ms-auto wd-45p fs-14">
																	<span className="float-end badge bg-success-transparent ">
																		<span className="op-7 text-success fw-semibold">Paid</span>
																	</span>
																</span>
															</div>
														</div>
													</div>
												</div>
											</Link>
											<Link href="#!" className="border-0">
												<div className="list-group-item list-group-item-action p-3 border-0" >
													<div className="media mt-0">
														<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/11.jpg" alt="Image description" />
														<div className="media-body flex-fill">
															<div className="d-flex align-items-center">
																<div className="mt-1">
																	<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Manuel Labor</h5>
																	<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
																</div>
																<span className="ms-auto wd-45p fs-14">
																	<span className="float-end badge bg-danger-transparent ">
																		<span className="op-7 text-danger fw-semibold">Pending</span>
																	</span>
																</span>
															</div>
														</div>
													</div>
												</div>
											</Link>
										</div>
									</Card.Body>
								</Card>
							</Col>

							<Col xl={6} lg={12}   >
								<Card >
									<Card.Header className=" pb-3">
										<h3 className="card-title mb-2">MAIN TASKS</h3>
									</Card.Header>
									<Card.Body className=" p-0 customers mt-1">
										<div className="">
											<label className="p-2 d-flex">
												<span className="form-check mb-0 ms-2">
													<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked1" />
												</span>
												<span className="mx-3 my-auto">
													accurate information at any given point.
												</span>
												<span className="ms-auto"><span className="badge bg-primary-transparent fw-semibold px-2 py-1 fs-11 me-2">Today</span></span>
											</label>
											<label className="p-2 mt-1 d-flex">
												<span className="form-check mb-0 ms-2">
													<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked01" />
												</span>
												<span className="mx-3 my-auto">
													sharing the information with clients or stakeholders.
												</span>
												<span className="ms-auto"><span className="badge bg-primary-transparent fw-semibold px-2 py-1 fs-11 me-2">Today</span></span>
											</label>
											<label className="p-2 mt-1 d-flex">
												<span className="form-check mb-0 ms-2">
													<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked2" />
												</span>
												<span className="mx-3 my-auto">
													Hearing the information and responding .
												</span>
												<span className="ms-auto"><span className="badge bg-primary-transparent fw-semibold px-2 py-1 fs-11 me-2 float-end">22 hrs</span></span>
											</label>
											<label className="p-2 mt-1 d-flex">
												<span className="form-check mb-0 ms-2">
													<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked3" />
												</span>
												<span className="mx-3 my-auto">
													Setting up and customizing your own sales.
												</span>
												<span className="ms-auto"> <span className="badge bg-light-transparent fw-semibold px-2 py-1 fs-11 me-2">1 Day</span></span>
											</label>
											<label className="p-2 mt-1 d-flex">
												<span className="form-check mb-0 ms-2">
													<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked05" defaultChecked />
												</span>
												<span className="mx-3 my-auto">
													To have a complete 360° overview of sales information, having.
												</span>
												<span className="ms-auto"> <span className="badge bg-light-transparent fw-semibold px-2 py-1 fs-11 me-2">2 Days</span></span>
											</label>
											<label className="p-2 mt-1 d-flex">
												<span className="form-check mb-0 ms-2">
													<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked07" />
												</span>
												<span className="mx-3 my-auto">
													sharing the information with clients or stakeholders.
												</span>
												<span className="ms-auto"><span className="badge bg-primary-transparent fw-semibold px-2 py-1 fs-11 me-2">Today</span></span>
											</label>
											<label className="p-2 mt-1 d-flex">
												<span className="form-check mb-0 ms-2">
													<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked06" defaultChecked />
												</span>
												<span className="mx-3 my-auto">
													New Admin Launched.
												</span>
											</label>
											<label className="p-2 mt-1 d-flex">
												<span className="form-check mb-0 ms-2">
													<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked08" defaultChecked />
												</span>
												<span className="mx-3 my-auto">
													To maximize profits and improve productivity.
												</span>
											</label>
										</div>
									</Card.Body>
								</Card>
							</Col>

						</Row>
					</Col>

				</Row>
				{/* <!-- row closed --> */}
				{/* <!-- row --> */}
				<div className="row row-sm">

					<Col xl={6} lg={12} sm={12} xxl={3}>
						<Card >
							<Card.Header className=" pb-3">
								<h3 className="card-title mb-2">SALES ACTIVITY</h3>
							</Card.Header>
							<Card.Body className=" p-0 customers mt-1">
								<div className="country-card pt-0">
									<div className="mb-4">
										<div className="d-flex">
											<span className="fs-13 fw-semibold">India</span>
											<div className="ms-auto"><span className="text-danger mx-1"><i className="fe fe-trending-down"></i></span><span className="number-font">$32,879</span> (65%)</div>
										</div>
										<div className="progress ht-7 br-5 mt-2">
											<div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: "60%" }}></div>
										</div>
									</div>
									<div className="mb-4">
										<div className="d-flex mb-1">
											<span className="fs-13 fw-semibold">Russia</span>
											<div className="ms-auto"><span className="text-info mx-1"><i className="fe fe-trending-up"></i></span><span className="number-font">$22,710</span> (55%)</div>
										</div>
										<div className="progress ht-7 br-5 mt-2">
											<div className="progress-bar progress-bar-striped progress-bar-animated bg-info" style={{ width: "50%" }}></div>
										</div>
									</div>
									<div className="mb-4">
										<div className="d-flex">
											<span className="fs-13 fw-semibold">Canada</span>
											<div className="ms-auto"><span className="text-danger mx-1"><i className="fe fe-trending-down"></i></span><span className="number-font">$56,291</span> (69%)</div>
										</div>
										<div className="progress ht-7 br-5 mt-2">
											<div className="progress-bar progress-bar-striped progress-bar-animated bg-secondary" style={{ width: "80%" }}></div>
										</div>
									</div>
									<div className="mb-4">
										<div className="d-flex">
											<span className="fs-13 fw-semibold">Brazil</span>
											<div className="ms-auto"><span className="text-success mx-1"><i className="fe fe-trending-up"></i></span><span className="number-font">$34,209</span> (60%)</div>
										</div>
										<div className="progress ht-7 br-5 mt-2">
											<div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" style={{ width: "60%" }}></div>
										</div>
									</div>
									<div className="mb-4">
										<div className="d-flex">
											<span className="fs-13 fw-semibold">United States</span>
											<div className="ms-auto"><span className="text-success mx-1"><i className="fe fe-trending-up"></i></span><span className="number-font">$45,870</span> (86%)</div>
										</div>
										<div className="progress ht-7 br-5 mt-2">
											<div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" style={{ width: "80%" }}></div>
										</div>
									</div>
									<div className="mb-4">
										<div className="d-flex">
											<span className="fs-13 fw-semibold">Germany</span>
											<div className="ms-auto"><span className="text-success mx-1"><i className="fe fe-trending-up"></i></span><span className="number-font">$67,357</span> (73%)</div>
										</div>
										<div className="progress ht-7 br-5 mt-2">
											<div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{ width: "70%" }}></div>
										</div>
									</div>
									<div className="mb-0 pb-2">
										<div className="d-flex">
											<span className="fs-13 fw-semibold">U.A.E</span>
											<div className="ms-auto"><span className="text-danger mx-1"><i className="fe fe-trending-down"></i></span><span className="number-font">$56,291</span> (69%)</div>
										</div>
										<div className="progress ht-7 br-5 mt-2">
											<div className="progress-bar progress-bar-striped progress-bar-animated bg-purpple" style={{ width: "80%" }}></div>
										</div>
									</div>
								</div>

							</Card.Body>
						</Card>
					</Col>

					<Col xl={6} lg={12} md={12} xxl={3}>
						<Card className=" overflow-hidden">
							<Card.Header className=" pb-1">
								<div className="card-title mb-2">Warehouse Operating Costs</div>
							</Card.Header>
							<Card.Body className=" p-0">
								<div className="list-group projects-list border-0">
									<div className="list-group-item list-group-item-action flex-column align-items-start border-0">
										<div className="d-flex w-100 justify-content-between">
											<p className="fs-13 mb-2 fw-semibold text-dark">Order Picking</p>
											<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">3,876</h4>
										</div>
										<div className="d-flex w-100 justify-content-between">
											<span className="text-muted fs-12"><i className="bx bx-caret-up text-success me-1"></i> <span className="text-success">03%</span> last month</span>
											<span className="text-muted  fs-11">5 days ago</span>
										</div>
									</div>
									<div className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top">
										<div className="d-flex w-100 justify-content-between">
											<p className="fs-13 mb-2 fw-semibold text-dark">Storage</p>
											<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">2,178</h4>
										</div>
										<div className="d-flex w-100 justify-content-between">
											<span className="text-muted  fs-12"><i className="bx bx-caret-down text-danger me-1"></i><span className="text-danger"> 16%</span> last month</span>
											<span className="text-muted  fs-11">2 days ago</span>
										</div>
									</div>
									<div className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top">
										<div className="d-flex w-100 justify-content-between">
											<p className="fs-13 mb-2 fw-semibold text-dark">Shipping</p>
											<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">1,367</h4>
										</div>
										<div className="d-flex w-100 justify-content-between">
											<span className="text-muted  fs-12"><i className="bx bx-caret-up text-success me-1"></i><span className="text-success"> 06%</span> last month</span>
											<span className="text-muted  fs-11">1 days ago</span>
										</div>
									</div>
									<div className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top">
										<div className="d-flex w-100 justify-content-between">
											<p className="fs-13 mb-2 fw-semibold text-dark">Receiving</p>
											<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">678</h4>
										</div>
										<div className="d-flex w-100 justify-content-between">
											<span className="text-muted  fs-12"><i className="bx bx-caret-down text-danger me-1"></i><span className="text-danger"> 25%</span> last month</span>
											<span className="text-muted  fs-11">10 days ago</span>
										</div>
									</div>
									<div className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top">
										<div className="d-flex w-100 justify-content-between">
											<p className="fs-13 mb-2 fw-semibold text-dark">Review</p>
											<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">578</h4>
										</div>
										<div className="d-flex w-100 justify-content-between">
											<span className="text-muted  fs-12"><i className="bx bx-caret-up text-success me-1"></i><span className="text-success"> 55%</span> last month</span>
											<span className="text-muted  fs-11">11 days ago</span>
										</div>
									</div>
									<div className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top pb-3">
										<div className="d-flex w-100 justify-content-between">
											<p className="fs-13 mb-2 fw-semibold text-dark">Profit</p>
											<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">$27,215</h4>
										</div>
										<div className="d-flex w-100 justify-content-between">
											<span className="text-muted  fs-12"><i className="bx bx-caret-up text-success me-1"></i><span className="text-success"> 32%</span> last month</span>
											<span className="text-muted  fs-11">11 days ago</span>
										</div>
									</div>
								</div>
							</Card.Body>
						</Card>
					</Col>

					<Col xl={6} lg={12} xxl={3}>
						<Card >
							<Card.Header className=" bg-transparent pb-0">
								<div>
									<h3 className="card-title mb-2">Timeline</h3>
								</div>
							</Card.Header>
							<Card.Body className=" mt-0">
								<div className="latest-timelines mt-4">
									<ul className="timelines mb-0">
										<li>
											<div className="featured_icon danger">
												<i className="fas fa-circle"></i>
											</div>
										</li>
										<li className="mt-0 activity">
											<div><span className="fs-11 text-muted float-end">23 Sep, 2021</span></div>
											<Link href="#!" className="fs-12 text-dark">
												<p className="mb-1 fw-semibold text-dark fs-13">Anita Letterback</p>
											</Link>
											<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
										</li>
										<li>
											<div className="featured_icon success">
												<i className="fas fa-circle"></i>
											</div>
										</li>
										<li className="mt-0 activity">
											<div><span className="fs-11 text-muted float-end">16 Aug, 2021</span></div>
											<Link href="#!" className="fs-12 text-dark">
												<p className="mb-1 fw-semibold text-dark fs-13">Paddy O'Furniture</p>
											</Link>
											<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
										</li>
										<li>
											<div className="featured_icon primary">
												<i className="fas fa-circle"></i>
											</div>
										</li>
										<li className="mt-0 activity">
											<div><span className="fs-11 text-muted float-end">23 Feb, 2021</span></div>
											<Link href="#!" className="fs-12 text-dark">
												<p className="mb-1 fw-semibold text-dark fs-13">Olive Yew</p>
											</Link>
											<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
										</li>
										<li>
											<div className="featured_icon warning">
												<i className="fas fa-circle"></i>
											</div>
										</li>
										<li className="mt-0 activity">
											<div><span className="fs-11 text-muted float-end">21 june, 2021</span></div>
											<Link href="#!" className="fs-12 text-dark">
												<p className="mb-1 fw-semibold text-dark fs-13">Maureen Biologist</p>
											</Link>
											<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt. </p>
										</li>
										<li>
											<div className="featured_icon teal">
												<i className="fas fa-circle"></i>
											</div>
										</li>
										<li className="mt-0 activity">
											<div><span className="fs-11 text-muted float-end">04 Aug, 2021</span></div>
											<Link href="#!" className="fs-12 text-dark">
												<p className="mb-1 fw-semibold text-dark fs-13">Peg Legge</p>
											</Link>
											<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
										</li>
										<li>
											<div className="featured_icon info">
												<i className="fas fa-circle"></i>
											</div>
										</li>
										<li className="mt-0 activity">
											<div><span className="fs-11 text-muted float-end">04 Aug, 2021</span></div>
											<Link href="#!" className="fs-12 text-dark">
												<p className="mb-1 fw-semibold text-dark fs-13">Letterbac</p>
											</Link>
											<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
										</li>
										<li>
											<div className="featured_icon danger">
												<i className="fas fa-circle"></i>
											</div>
										</li>
										<li className="mt-0 activity mb-0">
											<div><span className="fs-11 text-muted float-end">23 Sep, 2021</span></div>
											<Link href="#!" className="fs-12 text-dark">
												<p className="mb-1 fw-semibold text-dark fs-13">Anita Letterback</p>
											</Link>
											<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
										</li>
									</ul>
								</div>
							</Card.Body>
						</Card>
					</Col>

					<Col xl={6} lg={12} md={12} xxl={3}>
						<Card >
							<Card.Header className=" pb-0">
								<h3 className="card-title mb-2">Weekly Visitors</h3>
							</Card.Header>
							<Card.Body className=" pb-0">
								<div className="row mb-4">
									<div className="col-6">
										<div className="text-muted fs-12 text-center mb-2">Average Male Visitors</div>
										<div className="d-flex justify-content-center align-items-center flex-wrap">
											<span className="me-3 fs-26 fw-semibold">2,132</span>
											<span className="text-success fw-semibold"><i className="fa fa-caret-up me-2"></i>0.23%</span>
										</div>
									</div>
									<div className="col-6">
										<div className="text-muted fs-12 text-center mb-2">Average Female Visitors</div>
										<div className="d-flex justify-content-center align-items-center flex-wrap">
											<span className="me-3 fs-26 fw-semibold">1,053</span>
											<span className="text-danger fw-semibold"><i className="fa fa-caret-down me-2"></i>0.11%</span>
										</div>
									</div>
								</div>
								<div id="Viewers">
									<Dashboarddata.Viewers />
								</div>
							</Card.Body>
						</Card>
					</Col>
				</div>
				{/* <!-- row closed --> */}
				{/* <!-- row  --> */}
				<Row>
					<Col sm={12} className="col-12">
						<Card>
							<Card.Header>
								<h4 className="card-title">Product Summary</h4>
							</Card.Header>
							<Card.Body className="pt-0 example1-table">
								<div className="table-responsive">
									<BasicTable />
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				{/* <!-- row closed --> */}
			</React.Fragment>
		</>
	);
};

Dashboard.layout = "Contentlayout";
export default Dashboard;

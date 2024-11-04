import React, { Fragment } from "react";
import { Col, Row, Card, Button, ProgressBar, Form } from "react-bootstrap";
import Link from "next/link";
import Seo from "../../../shared/layout-components/seo/seo";
import * as Dashboard3data from "../../../shared/data/dashboards/dashboard3data";
import { Tabledata3 } from "../../../shared/data/dashboards/dashboard3data";
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";

function dashboard3() {
	return (
		<Fragment>
			<Seo title={"Dashboard3"} />
			<Pageheader title="DASHBOARD" heading="Dashboard" active="Sales" />
			{/* <!-- row --> */}
			<Row className="">
				<Col xl={7} lg={12} md={12} sm={12}>

					<Card className="primary-custom-card1">
						<Card.Body className="">
							<Row className="">
								<Col xl={5} lg={6} md={12} sm={12}>
									<div className="prime-card">
										<img className="img-fluid" src="../../../assets/images/png/dashboard8.png" alt="" />
									</div>
								</Col>
								<Col xl={7} lg={6} md={12} sm={12}>
									<div className="text-justified align-items-center">
										<h2 className="text-dark fw-semibold mb-3 mt-2">Hi, Welcome Back <span className="text-primary">Nick!</span></h2>
										<p className="text-dark fs-17 mb-2 lh-3"> You have used the 100% of free plan storage. Please upgrade your plan to get unlimited storage.</p>
										<p className="fw-semibold fs-12 mb-4">For billing related queries, contact us through support chat or mail us at team@spruko.com </p>
										<Button variant="primary" className="btn  mb-3 shadow">Upgrade to new Plan</Button>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>

				</Col>
				<Col xl={5} lg={12} md={12} sm={12}>
					<div className="row">
						<div className="col-xl-6 col-lg-6 col-md-6 col-xs-12">
							<div className="card sales-card circle-image1">
								<div className="row">
									<div className="col-8">
										<div className="ps-4 pt-4 pe-3 pb-4">
											<div className="">
												<h6 className="mb-2 fs-12 ">Today Orders</h6>
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
								</div>
							</div>
						</div>
						<div className="col-xl-6 col-lg-6 col-md-6 col-xs-12">
							<div className="card sales-card circle-image2">
								<div className="row">
									<div className="col-8">
										<div className="ps-4 pt-4 pe-3 pb-4">
											<div className="">
												<h6 className="mb-2 fs-12">Today Earnings</h6>
											</div>
											<div className="pb-0 mt-0">
												<div className="d-flex">
													<h4 className="fs-20 fw-semibold mb-2">$47,589</h4>
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
								</div>
							</div>
						</div>
						<div className="col-xl-6 col-lg-6 col-md-6 col-xs-12">
							<div className="card sales-card circle-image3">
								<div className="row">
									<div className="col-8">
										<div className="ps-4 pt-4 pe-3 pb-4">
											<div className="">
												<h6 className="mb-2 fs-12">Profit Gain</h6>
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
								</div>
							</div>
						</div>
						<div className="col-xl-6 col-lg-6 col-md-6 col-xs-12">
							<div className="card sales-card circle-image4">
								<div className="row">
									<div className="col-8">
										<div className="ps-4 pt-4 pe-3 pb-4">
											<div className="">
												<h6 className="mb-2 fs-12">Total Earnings</h6>
											</div>
											<div className="pb-0 mt-0">
												<div className="d-flex">
													<h4 className="fs-20 fw-semibold mb-2">$57.12M</h4>
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
								</div>
							</div>
						</div>
					</div>
				</Col>
			</Row>
			{/* <!-- row closed --> */}
			{/* <!-- row --> */}
			<Row className="">
				<Col xxl={6} xl={12} lg={12} md={12} sm={12}>
					<Card className="card custom-card overflow-hidden">
						<Card.Header className="card-header border-bottom-0">
							<div>
								<h3 className="card-title mb-2 ">Project Budget</h3> <span className="d-block fs-12 mb-0 text-muted"></span>
							</div>
						</Card.Header>
						<Card.Body className="">
							<div id="statistics3"><Dashboard3data.Budget /></div>
						</Card.Body>
					</Card>
				</Col>
				<Col xxl={3} xl={6} lg={12} md={12} sm={12}>
					<Card className=" overflow-hidden">
						<Card.Header className=" pb-1">
							<h3 className="card-title mb-2">Recent Customers</h3>
						</Card.Header>
						<Card.Body className=" p-0 customers mt-1">
							<div className="list-group list-lg-group list-group-flush gap-1">
								<Link href="#!" className="border-0">
									<div className="list-group-item list-group-item-action border-0">
										<div className="media mt-0">
											<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/2.jpg" alt="Image description" />
											<div className="media-body flex-fill">
												<div className="d-flex align-items-center">
													<div className="mt-0">
														<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Samantha Melon</h5>
														<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
													</div>
													<span className="ms-auto wd-45p tx-14">
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
									<div className="list-group-item list-group-item-action border-0" >
										<div className="media mt-0">
											<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/1.jpg" alt="Image description" />
											<div className="media-body flex-fill">
												<div className="d-flex align-items-center">
													<div className="mt-1">
														<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Allie Grater</h5>
														<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
													</div>
													<span className="ms-auto wd-45p tx-14">
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
									<div className="list-group-item list-group-item-action border-0" >
										<div className="media mt-0">
											<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/5.jpg" alt="Image description" />
											<div className="media-body flex-fill">
												<div className="d-flex align-items-center">
													<div className="mt-1">
														<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Gabe Lackmen</h5>
														<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
													</div>
													<span className="ms-auto wd-45p  tx-14">
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
									<div className="list-group-item list-group-item-action border-0" >
										<div className="media mt-0">
											<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/7.jpg" alt="Image description" />
											<div className="media-body flex-fill">
												<div className="d-flex align-items-center">
													<div className="mt-1">
														<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Manuel Labor</h5>
														<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
													</div>
													<span className="ms-auto wd-45p tx-14">
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
									<div className="list-group-item list-group-item-action border-0" >
										<div className="media mt-0">
											<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/9.jpg" alt="Image description" />
											<div className="media-body flex-fill">
												<div className="d-flex align-items-center">
													<div className="mt-1">
														<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Hercules Bing</h5>
														<p className="mb-0 fs-12 text-muted">User ID: #1754</p>
													</div>
													<span className="ms-auto wd-45p tx-14">
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
									<div className="list-group-item list-group-item-action border-0 pb-4" >
										<div className="media mt-0">
											<img className="avatar-lg rounded-circle me-3 my-auto shadow" src="../../../assets/images/faces/11.jpg" alt="Image description" />
											<div className="media-body flex-fill">
												<div className="d-flex align-items-center">
													<div className="mt-1">
														<h5 className="mb-1 fs-13 font-weight-sembold text-dark">Manuel Labor</h5>
														<p className="mb-0 fs-12 text-muted">User ID: #1234</p>
													</div>
													<span className="ms-auto wd-45p tx-14">
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

				<Col xxl={3} xl={6} lg={12} md={12} sm={12}>
					<Card className="card overflow-hidden">
						<Card.Header className="card-header pb-1">
							<div className="card-title mb-2">Warehouse Operating Costs</div>
						</Card.Header>
						<Card.Body className="card-body p-0">
							<div className="list-group projects-list border-0">
								<Link href="#!" className="list-group-item list-group-item-action flex-column align-items-start border-0 rounded-0">
									<div className="d-flex w-100 justify-content-between">
										<p className="fs-13 mb-2 fw-semibold text-dark">Order Picking</p>
										<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">3,876</h4>
									</div>
									<div className="d-flex w-100 justify-content-between">
										<span className="text-muted fs-12"><i className="bx bx-caret-up text-success me-1"></i> <span className="text-success">03%</span> last month</span>
										<span className="text-muted  fs-11">5 days ago</span>
									</div>
								</Link>
								<Link href="#!" className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top">
									<div className="d-flex w-100 justify-content-between">
										<p className="fs-13 mb-2 fw-semibold text-dark">Storage</p>
										<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">2,178</h4>
									</div>
									<div className="d-flex w-100 justify-content-between">
										<span className="text-muted  fs-12"><i className="bx bx-caret-down text-danger me-1"></i><span className="text-danger"> 16%</span> last month</span>
										<span className="text-muted  fs-11">2 days ago</span>
									</div>
								</Link>
								<Link href="#!" className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top">
									<div className="d-flex w-100 justify-content-between">
										<p className="fs-13 mb-2 fw-semibold text-dark">Shipping</p>
										<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">1,367</h4>
									</div>
									<div className="d-flex w-100 justify-content-between">
										<span className="text-muted  fs-12"><i className="bx bx-caret-up text-success me-1"></i><span className="text-success"> 06%</span> last month</span>
										<span className="text-muted  fs-11">1 days ago</span>
									</div>
								</Link>
								<Link href="#!" className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top">
									<div className="d-flex w-100 justify-content-between">
										<p className="fs-13 mb-2 fw-semibold text-dark">Receiving</p>
										<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">678</h4>
									</div>
									<div className="d-flex w-100 justify-content-between">
										<span className="text-muted  fs-12"><i className="bx bx-caret-down text-danger me-1"></i><span className="text-danger"> 25%</span> last month</span>
										<span className="text-muted  fs-11">10 days ago</span>
									</div>
								</Link>
								<Link href="#!" className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top">
									<div className="d-flex w-100 justify-content-between">
										<p className="fs-13 mb-2 fw-semibold text-dark">Review</p>
										<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">578</h4>
									</div>
									<div className="d-flex w-100 justify-content-between">
										<span className="text-muted  fs-12"><i className="bx bx-caret-up text-success me-1"></i><span className="text-success"> 55%</span> last month</span>
										<span className="text-muted  fs-11">11 days ago</span>
									</div>
								</Link>
								<Link href="#!" className="list-group-item list-group-item-action flex-column align-items-start border-bottom-0  border-start-0 border-end-0 border-top">
									<div className="d-flex w-100 justify-content-between">
										<p className="fs-13 mb-2 fw-semibold text-dark">Profit</p>
										<h4 className="text-dark mb-0 fw-semibold text-dark fs-18">$27,215</h4>
									</div>
									<div className="d-flex w-100 justify-content-between">
										<span className="text-muted  fs-12"><i className="bx bx-caret-up text-success me-1"></i><span className="text-success"> 32%</span> last month</span>
										<span className="text-muted  fs-11">11 days ago</span>
									</div>
								</Link>
							</div>
						</Card.Body>
					</Card>
				</Col>

			</Row>
			{/* <!-- row closed --> */}
			{/* <!-- row --> */}
			<Row className="row-sm">
				<Col xxl={3} xl={6} lg={12} md={12} sm={12}>
					<Card className="card">
						<Card.Header className="card-header bg-transparent pb-0">
							<div>
								<h3 className="card-title mb-2">Timeline</h3>
							</div>
						</Card.Header>
						<Card.Body className="card-body mt-0">
							<div className="latest-timelines mt-4">
								<ul className="timelines mb-0">
									<li>
										<div className="featured_icon1">
										</div>
									</li>
									<li className="mt-0 activity border br-5 p-2">
										<div><span className="fs-11 text-muted float-end">23 Sep, 2021</span></div>
										<Link href="#!" className="fs-12 text-dark">
											<p className="mb-1 fw-semibold text-dark fs-13">Anita Letterback</p>
										</Link>
										<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
									</li>
									<li>
										<div className="featured_icon1">
										</div>
									</li>
									<li className="mt-0 activity border br-5 p-2">
										<div><span className="fs-11 text-muted float-end">16 Aug, 2021</span></div>
										<Link href="#!" className="fs-12 text-dark">
											<p className="mb-1 fw-semibold text-dark fs-13">Paddy O'Furniture</p>
										</Link>
										<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
									</li>
									<li>
										<div className="featured_icon1">
										</div>
									</li>
									<li className="mt-0 activity border br-5 p-2">
										<div><span className="fs-11 text-muted float-end">23 Feb, 2021</span></div>
										<Link href="#!" className="fs-12 text-dark">
											<p className="mb-1 fw-semibold text-dark">Olive Yew</p>
										</Link>
										<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
									</li>
									<li>
										<div className="featured_icon1">
										</div>
									</li>
									<li className="mt-0 activity border br-5 p-2">
										<div><span className="fs-11 text-muted float-end">21 june, 2021</span></div>
										<Link href="#!" className="fs-12 text-dark">
											<p className="mb-1 fw-semibold text-dark fs-13">Maureen Biologist</p>
										</Link>
										<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt. </p>
									</li>
									<li>
										<div className="featured_icon1">
										</div>
									</li>
									<li className="mt-0 activity border br-5 p-2">
										<div><span className="fs-11 text-muted float-end">04 Aug, 2021</span></div>
										<Link href="#!" className="fs-12 text-dark">
											<p className="mb-1 fw-semibold text-dark fs-13">Peg Legge</p>
										</Link>
										<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
									</li>
									<li>
										<div className="featured_icon1">
										</div>
									</li>
									<li className="mt-0 activity border br-5 p-2 mb-3">
										<div><span className="fs-11 text-muted float-end">01 Jan, 2022</span></div>
										<Link href="#!" className="fs-12 text-dark">
											<p className="mb-1 fw-semibold text-dark fs-13">Neetato</p>
										</Link>
										<p className="text-muted mt-0 mb-0 fs-12">Lorem ipsum dolor tempor incididunt . </p>
									</li>
								</ul>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xxl={3} xl={6} lg={12} md={12} sm={12}>
					<Card className="">
						<Card.Header className=" pb-2">
							<h3 className="card-title mb-2">MAIN TASKS</h3>
						</Card.Header>
						<Card.Body className=" p-0 customers mt-1">
							<div className="">
								<label className="p-2 d-flex">
									<span className="form-check mb-0 ms-2">
										<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked1" />
									</span>
									<span className="mx-3 my-auto text-truncate">
										accurate information at any given point.
									</span>
									<span className="ms-auto"><span className="badge bg-primary-transparent fw-semibold px-2 py-1 fs-11 me-2">Today</span></span>
								</label>
								<label className="p-2 mt-2 d-flex">
									<span className="form-check mb-0 ms-2">
										<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked2" />
									</span>
									<span className="mx-3 my-auto">
										sharing the information with clients or stakeholders.
									</span>
									<span className="ms-auto"><span className="badge bg-primary-transparent fw-semibold px-2 py-1 fs-11 me-2">Today</span></span>
								</label>
								<label className="p-2 mt-2 d-flex">
									<span className="form-check mb-0 ms-2">
										<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked3" />
									</span>
									<span className="mx-3 my-auto text-truncate">
										Hearing the information and responding .
									</span>
									<span className="ms-auto"><span className="badge bg-primary-transparent fw-semibold px-2 py-1 fs-11 me-2 float-end">22 hrs</span></span>
								</label>
								<label className="p-2 mt-2 d-flex">
									<span className="form-check mb-0 ms-2">
										<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked4" />
									</span>
									<span className="mx-3 my-auto">
										Setting up and customizing your own sales.
									</span>
									<span className="ms-auto"> <span className="badge bg-light-transparent fw-semibold px-2 py-1 fs-11 me-2">1 Day</span></span>
								</label>
								<label className="p-2 mt-2 d-flex">
									<span className="form-check mb-0 ms-2">
										<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked6" defaultChecked />
									</span>
									<span className="mx-3 my-auto">
										To have a complete 360° overview of sales information, having.
									</span>
									<span className="ms-auto"> <span className="badge bg-light-transparent fw-semibold px-2 py-1 fs-11 me-2">2 Days</span></span>
								</label>
								<label className="p-2 mt-2 d-flex">
									<span className="form-check mb-0 ms-2">
										<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked7" defaultChecked />
									</span>
									<span className="mx-3 my-auto">
										New Admin Launched.
									</span>
								</label>
								<label className="p-2 mt-2 d-flex">
									<span className="form-check mb-0 ms-2">
										<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked8" defaultChecked />
									</span>
									<span className="mx-3 my-auto">
										To maximize profits and improve productivity.
									</span>
								</label>
								<label className="p-2 mt-2 d-flex">
									<span className="form-check mb-0 ms-2">
										<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked9" defaultChecked />
									</span>
									<span className="mx-3 my-auto">
										Increase work state.
									</span>
								</label>
								<label className="p-2 mt-2 d-flex">
									<span className="form-check mb-0 ms-2">
										<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked5" />
									</span>
									<span className="mx-3 my-auto">
										Setting up and customizing your own sales.
									</span>
								</label>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xxl={3} xl={6} lg={12} md={12} sm={12}>
					<Card className="">
						<Card.Header className=" pb-3">
							<h3 className="card-title mb-2">SALES ACTIVITY</h3>
						</Card.Header>
						<Card.Body className=" p-0 customers mt-1">
							<div className="country-card pt-1">
								<div className="mb-4">
									<div className="d-flex">
										<span className="fs-13 fw-semibold">India</span>
										<div className="ms-auto"><span className="text-danger mx-1"><i className="fe fe-trending-down"></i></span><span className="number-font">$32,879</span> (65%)</div>
									</div>
									<ProgressBar className="ht-5 br-5 mt-2">
										<ProgressBar now={60} variant="primary" />
									</ProgressBar>
								</div>
								<div className="mb-4">
									<div className="d-flex mb-1">
										<span className="fs-13 fw-semibold">Russia</span>
										<div className="ms-auto"><span className="text-info mx-1"><i className="fe fe-trending-up"></i></span><span className="number-font">$22,710</span> (55%)</div>
									</div>

									<ProgressBar className="ht-5 br-5 mt-2">
										<ProgressBar now={50} variant="info" />
									</ProgressBar>
								</div>
								<div className="mb-4">
									<div className="d-flex">
										<span className="fs-13 fw-semibold">Canada</span>
										<div className="ms-auto"><span className="text-danger mx-1"><i className="fe fe-trending-down"></i></span><span className="number-font">$56,291</span> (69%)</div>
									</div>

									<ProgressBar className="ht-5 br-5 mt-2">
										<ProgressBar now={80} variant="secondary" />
									</ProgressBar>
								</div>
								<div className="mb-4">
									<div className="d-flex">
										<span className="fs-13 fw-semibold">Brazil</span>
										<div className="ms-auto"><span className="text-success mx-1"><i className="fe fe-trending-up"></i></span><span className="number-font">$34,209</span> (60%)</div>
									</div>

									<ProgressBar className="ht-5 br-5 mt-2">
										<ProgressBar now={60} variant="warning" />
									</ProgressBar>
								</div>
								<div className="mb-4">
									<div className="d-flex">
										<span className="fs-13 fw-semibold">United States</span>
										<div className="ms-auto"><span className="text-success mx-1"><i className="fe fe-trending-up"></i></span><span className="number-font">$45,870</span> (86%)</div>
									</div>

									<ProgressBar className="ht-5 br-5 mt-2">
										<ProgressBar now={80} variant="danger" />
									</ProgressBar>
								</div>
								<div className="mb-4">
									<div className="d-flex">
										<span className="fs-13 fw-semibold">Germany</span>
										<div className="ms-auto"><span className="text-success mx-1"><i className="fe fe-trending-up"></i></span><span className="number-font">$67,357</span> (73%)</div>
									</div>

									<ProgressBar className="ht-5 br-5 mt-2">
										<ProgressBar now={70} variant="success" />
									</ProgressBar>
								</div>
								<div className="mb-4">
									<div className="d-flex">
										<span className="fs-13 fw-semibold">Italy</span>
										<div className="ms-auto"><span className="text-success mx-1"><i className="fe fe-trending-up"></i></span><span className="number-font">$43,537</span> (73%)</div>
									</div>

									<ProgressBar className="ht-5 br-5 mt-2">
										<ProgressBar now={55} variant="orange" />
									</ProgressBar>
								</div>
								<div className="mb-3">
									<div className="d-flex">
										<span className="fs-13 fw-semibold">U.A.E</span>
										<div className="ms-auto"><span className="text-danger mx-1"><i className="fe fe-trending-down"></i></span><span className="number-font">$56,291</span> (69%)</div>
									</div>

									<ProgressBar className="ht-5 br-5 mt-2">
										<ProgressBar now={80} variant="purpple" />
									</ProgressBar>
								</div>
							</div>

						</Card.Body>
					</Card>
				</Col>
				<Col xxl={3} xl={6} lg={12} md={12} sm={12}>
					<div className="card">
						<div className="card-header pb-0">
							<h3 className="card-title mb-2">Weekly Visitors</h3>
						</div>
						<div className="card-body pb-0">
							<div className="row mb-5">
								<div className="col-6">
									<div className="text-muted fs-12 text-center mb-2">Average Male Visitors</div>
									<div className="d-flex justify-content-center align-items-center">
										<span className="me-3 fs-26 fw-semibold">2,132</span>
										<span className="text-success fw-semibold"><i className="bx bx-caret-up me-2"></i>0.23%</span>
									</div>
								</div>
								<div className="col-6">
									<div className="text-muted fs-12 text-center mb-2">Average Female Visitors</div>
									<div className="d-flex justify-content-center align-items-center">
										<span className="me-3 fs-26 fw-semibold">1,053</span>
										<span className="text-danger fw-semibold"><i className="bx bx-caret-down me-2"></i>0.11%</span>
									</div>
								</div>
							</div>
							<div id="Viewers2"><Dashboard3data.Visitors /></div>
						</div>
					</div>
				</Col>
			</Row>
			{/* <!-- row closed --> */}
			{/* <!-- row --> */}
			<Row >
				<div className="col-12 col-sm-12">
					<Card >
						<Card.Header>
							<h4 className="card-title">Product Summary</h4>
						</Card.Header>
						<Card.Body className=" pt-0">
							<div className="table-responsive">
								<Tabledata3 />
							</div>
						</Card.Body>
					</Card>
				</div>
			</Row>
			{/* <!-- row closed --> */}
		</Fragment>
	);
}
dashboard3.layout = "Contentlayout";
export default dashboard3;

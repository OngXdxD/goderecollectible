
import { auth } from "../shared/firebase/firebaseapi";
import { basePath } from "../next.config.js";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import { useEffect } from "react";
import Seo from "../shared/layout-components/seo/seo";

const baseUrl = 'https://kakihobby.com';

const Home = () => {
	const [passwordshow1, setpasswordshow1] = useState(false);
	const [err, setError] = useState("");
	const [data, setData] = useState({
		"email": "adminnextjs@gmail.com",
		"password": "1234567890",
	});
	const { email, password } = data;
	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
		setError("");
	};
	const navigate = useRouter();
	const routeChange = () => {
		const path = "/components/dashboards/dashboard1/";
		navigate.push(path);
	};

	const Login = async (e) => {
		e.preventDefault();
	
		try {
			// Make API request for login
			const response = await fetch(`${baseUrl}/api/bizadmin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                email: email,
				password: password
            });
	
			// Check the API response, handle success
			if (response.data && response.data.status === 'success') {
				console.log('Login successful', response.data);
				routeChange();  // Redirect to dashboard
			} else {
				setError('Invalid credentials or something went wrong.');
			}
		} catch (err) {
			// Handle errors from API call
			console.error('Error during login:', err);
			setError('Failed to login. Please try again.');
		}
	};
	
	useEffect(() => {
		if (document.body) {
			document.querySelector("body").classList.add("ltr", "error-page1", "bg-primary");
		}

		return () => {
			document.body.classList.remove("ltr", "error-page1", "bg-primary");
		};
	}, []);
	return (
		<Fragment>

			<Seo title={"Login"} />
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
			<Container>
				<div className="row justify-content-center align-items-center authentication authentication-basic h-100">
					<div className="col-xl-5 col-lg-6 col-md-8 col-sm-8 col-xs-10 card-sigin-main mx-auto my-auto py-4 justify-content-center">

						<div className="card-sigin">
							<Tab.Container defaultActiveKey='nextjs'>
								<Nav variant="pills" className="justify-content-center authentication-tabs">
									
									<Nav.Item>
										<Nav.Link eventKey="nextjs"><img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/brand-logos/nextjslogo.png`} alt='logo2' /></Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="firebase" > <img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/brand-logos/firbase.png`} alt='logo1' /></Nav.Link>
									</Nav.Item>
								</Nav>
								<Tab.Content>									
									<Tab.Pane eventKey='nextjs' className='border-0'>

										<div className="row g-0">
											{err && <Alert variant="danger">{err}</Alert>}
											<div className="col-12">
												<div className="main-card-signin d-md-flex">
													<div className="wd-100p"><div className="d-flex mb-4"><Link href="/components/dashboards/dashboard1"><img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/brand-logos/toggle-logo.png`} className="sign-favicon ht-40" alt="logo" /></Link></div>
														<div className="">
															<div className="main-signup-header">
																<h2>Welcome back!</h2>
																<h6 className="font-weight-semibold mb-4">Please sign in to continue.</h6>
																<div className="panel panel-primary">

																	<div className="panel-body tabs-menu-body border-0 p-3">
																		<form action="#">
																			<div className="form-group">
																				<label>Username</label> 
																				<Form.Control type="email" placeholder="Email" name='email' defaultValue={email} onChange={changeHandler} />
																			</div>
																			<div className="form-group">
																				<label htmlFor="signin-password" className=" d-block">Password</label>
																				<div className="input-group">
																					<Form.Control className="form-control form-control-lg" id="signin-password"
																						placeholder="Enter your password"
																						name="password"
																						type={(passwordshow1) ? "text" : "password"}
																						value={password}
																						onChange={changeHandler}
																						required />
																					<button className="btn btn-light bg-transparent" type="button"
																						onClick={() => setpasswordshow1(!passwordshow1)} id="button-addon2">
																						<i className={`${passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"} align-middle`}></i></button>
																				</div>
																			</div>
																			<Link href="/components/dashboards/dashboard1" className="btn btn-primary btn-block" onClick={Login}>Sign In</Link>
																			
																		</form>

																	</div>

																</div>

																
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</Tab.Pane>
									<Tab.Pane eventKey='firebase' className='border-0'>

										<div className="row g-0">
											{err && <Alert variant="danger">{err}</Alert>}
											<div className="col-12">
												<div className="main-card-signin d-md-flex">
													<div className="wd-100p"><div className="d-flex mb-4"><Link href="/components/dashboards/dashboard1"><img src={`${process.env.NODE_ENV === "production" ? basePath : ""}/assets/images/brand-logos/toggle-logo.png`} className="sign-favicon ht-40" alt="logo" /></Link></div>
														<div className="">
															<div className="main-signup-header">
																<h2>Welcome back!</h2>
																<h6 className="font-weight-semibold mb-4">Please sign in to continue.</h6>
																<div className="panel panel-primary">

																	<div className="panel-body tabs-menu-body border-0 p-3">
																		<form action="#">
																			<div className="form-group">
																				<label>Email</label> <Form.Control type="email" placeholder="Email" name='email' defaultValue={email} onChange={changeHandler} />
																			</div>
																			<div className="form-group">
																				<label htmlFor="signin-password" className="form-label text-default d-block">Password
																					<Link href={"/components/pages/authentication/forgot-password/"} className="float-end text-primary">Forget password ?</Link></label>
																				<div className="input-group">
																					<Form.Control className="form-control form-control-lg" id="signin-password"
																						placeholder="Enter your password"
																						name="password"
																						type={(passwordshow1) ? "text" : "password"}
																						value={password}
																						onChange={changeHandler}
																						required />
																					<button className="btn btn-light bg-transparent" type="button"
																						onClick={() => setpasswordshow1(!passwordshow1)} id="button-addon2">
																						<i className={`${passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"} align-middle`}></i></button>
																				</div>
																			</div>
																			<Link href="/components/dashboards/dashboard1" className="btn btn-primary btn-block" onClick={Login}>Sign In</Link>
																			<div className="mt-4 d-flex text-center justify-content-center mb-2">
																				<Link href="#!" className=" me-3">
																					<span className="btn-inner--icon"> <i className="ri-facebook-fill social-btn-icons fs-18 tx-prime"></i> </span>
																				</Link>
																				<Link href="#!" className=" me-3">
																					<span className="btn-inner--icon"> <i className="ri-twitter-x-line social-btn-icons fs-18 tx-prime"></i> </span>
																				</Link>
																				<Link href="#!" className=" me-3">
																					<span className="btn-inner--icon"> <i className="ri-linkedin-fill social-btn-icons fs-18 tx-prime"></i> </span>
																				</Link>
																				<Link href="#!" className=" me-3">
																					<span className="btn-inner--icon"> <i className="ri-instagram-fill social-btn-icons fs-18 tx-prime"></i> </span>
																				</Link>
																			</div>
																		</form>

																	</div>

																</div>

																<div className="main-signin-footer text-center mt-3">
																	<p><Link href="/components/pages/authentication/forgot-password" className="mb-3">Forgot password?</Link></p>
																	<p>Don't have an account? <Link href="/components/pages/authentication/sign-up">Create an Account</Link></p>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</Tab.Pane>
								</Tab.Content>
							</Tab.Container>
						</div>
					</div>
				</div>
			</Container>
		</Fragment>
	);
};
export default Home;

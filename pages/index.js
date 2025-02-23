import { auth } from "../shared/firebase/firebaseapi";
import { basePath } from "../next.config.js";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import { useEffect } from "react";
import Seo from "../shared/layout-components/seo/seo";

export default function AdminLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		const rememberedUsername = localStorage.getItem('rememberedUsername');
		if (rememberedUsername) {
			setEmail(rememberedUsername);
			setRememberMe(true);
		}
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();

		if (!email || !password) {
			setErrorMessage('Both email and password are required.');
			return;
		}

		const loginDto = {
			email: email,
			password: password
		};

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginDto),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(errorData.message || 'Login failed');
				return;
			}

			const data = await response.json();

			// Store auth data in localStorage
			localStorage.setItem('refresh-token', data.tokens.refresh.token);
			localStorage.setItem('access-token', data.tokens.access.token);
			localStorage.setItem('userId', data.user.id);
			localStorage.setItem('sessionTime', new Date().getTime());

			// Handle remember me
			if (rememberMe) {
				localStorage.setItem('rememberedUsername', email);
			} else {
				localStorage.removeItem('rememberedUsername');
			}

			// Redirect to dashboard
			window.location.href = `/components/dashboards/dashboard1`;
		} catch (error) {
			console.error('Login error:', error);
			setErrorMessage('An error occurred during login. Please try again.');
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
											{errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
																				<Form.Control
																					type="email"
																					placeholder="Email"
																					name='email'
																					defaultValue={email}
																					onChange={(e) => setEmail(e.target.value)}
																					onKeyDown={(e) => e.key === "Enter" && handleLogin(e)} />
																			</div>
																			<div className="form-group">
																				<label htmlFor="signin-password" className=" d-block">Password</label>
																				<div className="input-group">
																					<Form.Control className="form-control form-control-lg" id="signin-password"
																						placeholder="Enter your password"
																						name="password"
																						type="password"
																						value={password}
																						onChange={(e) => setPassword(e.target.value)}
																						onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
																						required />

																				</div>
																			</div>
																			<Button className="btn btn-primary btn-block" onClick={handleLogin}>Sign In</Button>

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
											{errorMessage && <div className="error-message">{errorMessage}</div>}
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
																				<Form.Control type="email" placeholder="Email" name='email' defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
																			</div>
																			<div className="form-group">
																				<label htmlFor="signin-password" className=" d-block">Password</label>
																				<div className="input-group">
																					<Form.Control className="form-control form-control-lg" id="signin-password"
																						placeholder="Enter your password"
																						name="password"
																						type="password"
																						value={password}
																						onChange={(e) => setPassword(e.target.value)}
																						required />

																				</div>
																			</div>
																			<Link href="/components/dashboards/dashboard1" className="btn btn-primary btn-block" onClick={handleLogin}>Sign In</Link>

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
								</Tab.Content>
							</Tab.Container>
						</div>
					</div>
				</div>
			</Container>
		</Fragment>
	);
};

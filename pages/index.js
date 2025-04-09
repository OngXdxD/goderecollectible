import { auth } from "../shared/firebase/firebaseapi";
import { basePath } from "../next.config.js";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Nav, Tab } from "react-bootstrap";
import Link from "next/link";
import { useEffect } from "react";
import Seo from "../shared/layout-components/seo/seo";
import { checkAuthAndRedirect } from "../shared/utils/auth";

export default function AdminLogin() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	// Check if user is already logged in
	useEffect(() => {
		const autoLogin = async () => {
			try {
				setIsLoading(true);
				// Attempt auto-login if tokens exist
				const isLoggedIn = await checkAuthAndRedirect();
				if (!isLoggedIn) {
					// Not logged in, show login form
					setIsLoading(false);
				}
			} catch (error) {
				console.error('Auto-login error:', error);
				setIsLoading(false);
			}
		};

		autoLogin();
	}, []);

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

			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 7);

			// Store auth data in localStorage
			localStorage.setItem('refresh-token', data.tokens.refresh.token);
			localStorage.setItem('access-token', data.tokens.access.token);
			
			// Store auth data in cookies
			document.cookie = `access-token=${data.tokens.access.token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=Strict`;
			document.cookie = `refresh-token=${data.tokens.refresh.token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=Strict`;
			document.cookie = `role-id=${data.user.role_id}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=Strict`;
			
			// Store non-sensitive data in localStorage
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

	if (isLoading) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

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
																			<div className="form-group mb-3">
																				<Form.Check
																					type="checkbox"
																					id="rememberMe"
																					label="Remember me"
																					checked={rememberMe}
																					onChange={(e) => setRememberMe(e.target.checked)}
																				/>
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
																			<div className="form-group mb-3">
																				<Form.Check
																					type="checkbox"
																					id="rememberMeFirebase"
																					label="Remember me"
																					checked={rememberMe}
																					onChange={(e) => setRememberMe(e.target.checked)}
																				/>
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

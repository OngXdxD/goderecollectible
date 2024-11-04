import React, { Fragment, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Provider } from "react-redux";
import { Helmet, HelmetProvider } from "react-helmet-async";
import store from "../../redux/store";
const Authenticationswitcher = dynamic(() => import("../../../shared/layout-components/switcher/authenticationswitcher"), {ssr: false,});

const Authenticationlayout = ({ children }) => {
	
	return (
		
		<Fragment>
			<Provider store={store}>
				<HelmetProvider>
					<Helmet>
						<body className=''></body>
					</Helmet>
					{children}
					<Authenticationswitcher />
				</HelmetProvider>
			</Provider>
		</Fragment>
		
	);
};

export default Authenticationlayout;

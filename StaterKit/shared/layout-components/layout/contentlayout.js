import React, { Fragment, useEffect, useState } from "react";
import { Provider } from "react-redux";
import TabToTop from "../tab-to-top/tab-to-top";
import store from "../../../shared/redux/store";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import Switcher from "../switcher/switcher";
import Footer from "../footer/footer";
const Contentlayout = ({ children }) => {
	const [lateLoad, setlateLoad] = useState(false);

	useEffect(() => {
		setlateLoad(true);
	});
	const remove = () => {

		if (document.querySelector(".card.search-result") != null) {
			document.querySelector(".card.search-result")?.classList.add("d-none");
		}

	};
	return (
		<Fragment>
			<Provider store={store}>
				<div style={{ display: `${lateLoad ? "block" : "none"}` }}>
					<Switcher />
					<div className="page">
						<Header />
						<Sidebar />
						<div className="main-content app-content">
							<div className="container-fluid layout" onClick={() => remove()}>
								{children}
							</div>
						</div>
						<Footer />
					</div>
					<TabToTop />
				</div>
			</Provider>
		</Fragment>
	);
};

export default Contentlayout;


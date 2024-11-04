import Link from "next/link";
import React, { Fragment } from "react";

const Footer = () => {
	return (
		<Fragment>
			<footer className="footer mt-auto py-3 bg-white text-center">
				<div className="container">
					<span className="text-muted"> Copyright © <span id="year"> 2024</span> <Link
						href="#!" className="text-primary">Nowa</Link>.
                    Designed with <span className="bi bi-heart-fill text-danger"></span> by <Link href="#!">
						<span className="fw-semibold text-primary text-decoration-underline">Spruko</span>
					</Link> All
                    rights
                    reserved
					</span>
				</div>
			</footer>
		</Fragment>
	);
};

export default Footer;

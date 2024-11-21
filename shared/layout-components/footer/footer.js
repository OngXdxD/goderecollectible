import Link from "next/link";
import React, { Fragment } from "react";

const Footer = () => {
	return (
		<Fragment>
			<footer className="footer mt-auto py-3 bg-white text-center">
				<div className="container">
					<span className="text-muted"> Copyright © <Link
						href="#!" className="text-primary">Godere Collectible</Link>.
					 All
                    rights
                    reserved
					</span>
				</div>
			</footer>
		</Fragment>
	);
};

export default Footer;

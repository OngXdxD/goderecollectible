import React, { Fragment } from "react";
import dynamic from "next/dynamic";
import Seo from "../../../shared/layout-components/seo/seo";
const Leafletmapsdata = dynamic(() => import("../../../shared/data/maps/leafletmapsdata"), { ssr: false });
const Leafletmaps = () => {

	return (
		<Fragment>
			<Seo title={"Leafletmaps"} />
			
			<Leafletmapsdata/>
		</Fragment>
	);
};
Leafletmaps.layout = "Contentlayout";
export default Leafletmaps;

import "../styles/globals.scss";
import Contentlayout from "../shared/layout-components/layout/contentlayout";
import Authenticationlayout from"../shared/layout-components/layout/authentication-layout";
import { SpeedInsights } from "@vercel/speed-insights/next"
const layouts = {
	Contentlayout: Contentlayout,
	Authenticationlayout:Authenticationlayout
};
function MyApp({ Component, pageProps }) {
	const Layout = layouts[Component.layout] || ((pageProps) => <Component>{pageProps}</Component>);
	return (
		<Layout>
			<SpeedInsights />
			<Component {...pageProps} />
			
		</Layout>
	);
}

export default MyApp;


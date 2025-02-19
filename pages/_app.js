import "../styles/globals.scss";
import "../styles/wix/create-product.scss";
import Contentlayout from "../shared/layout-components/layout/contentlayout";
import Authenticationlayout from"../shared/layout-components/layout/authentication-layout";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ToastProvider } from "../pages/components/toast/toastContext";

const layouts = {
	Contentlayout: Contentlayout,
	Authenticationlayout:Authenticationlayout
};
function MyApp({ Component, pageProps }) {
	const Layout = layouts[Component.layout] || ((pageProps) => <Component>{pageProps}</Component>);
	return (
		<ToastProvider>
			<Layout>
				<SpeedInsights />
				<Component {...pageProps} />
			</Layout>
		</ToastProvider>
		
	);
}

export default MyApp;


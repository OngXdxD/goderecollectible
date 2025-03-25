// Define role levels and their access
const roleAccess = {
	1: ['admin'], // Admin has access to everything
	2: ['manager'], // Manager has access to most features
	3: ['user'] // Regular user has limited access
};

export const MENUITEMS = [
	{
		menutitle: "Main",
		roles: [1, 2, 3], // All roles can see this section
	},
	{
		title: "Dashboards",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm7 7v-5h4v5h-4zm2-15.586 6 6V15l.001 5H16v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-9.586l6-6z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		roles: [1, 2, 3], // All roles can see dashboards
		children: [
			{
				path: "/components/dashboards/dashboard1",
				type: "link",
				active: false,
				selected: false,
				title: "Dashboard-1",
				roles: [1, 2, 3],
			},
			{
				path: "/components/dashboards/dashboard2",
				type: "link",
				active: false,
				selected: false,
				title: "Dashboard-2",
				roles: [1, 2, 3],
			},
			{
				path: "/components/dashboards/dashboard3",
				type: "link",
				active: false,
				selected: false,
				title: "Dashboard-3",
				roles: [1, 2, 3],
			},
		],
	},
	{
		menutitle: "Products",
		roles: [1, 2, 3],
	},
	{
		title: "Products",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.994 1.994 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8c.417 0 .79-.259.937-.648l3-8a1 1 0 0 0-.115-.921zM17.307 15h-6.64l-2.5-6h11.39l-2.25 6z" />
				<circle cx="10.5" cy="19.5" r="1.5" />
				<circle cx="17.5" cy="19.5" r="1.5" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		roles: [1, 2, 3], // All roles can see products menu
		children: [
			{
				path: "/components/product/create-product",
				type: "link",
				active: false,
				selected: false,
				title: "Upload Wix Product",
				roles: [1], // Only admin can upload Wix products
			},
			{
				path: "/components/product/create-all-product",
				type: "link",
				active: false,
				selected: false,
				title: "Create Product",
				roles: [1, 2], // Admin and manager can create products
			},
			{
				path: "/components/product/view-all-products",
				type: "link",
				active: false,
				selected: false,
				title: "View All Products",
				roles: [1, 2, 3], // All roles can view products
			}
		],
	},
	{
		type: "sub",
		active: false,
		selected: false,
		title: "Purchase & Stock Inventory",
		children: [
			{
				path: "/components/purchaseorder/createpurchaseorder",
				type: "link",
				active: false,
				selected: false,
				title: "Create Purchase Order",
			},
			{
				path: "/components/dashboards/dashboard10",
				type: "link",
				active: false,
				selected: false,
				title: "View Stock Balance (WIP)",
			},
		],
	},
	{
		menutitle: "Suppliers",
	},
	{
		title: "Suppliers",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M20 10h-2V7c0-1.103-.897-2-2-2h-6c-1.103 0-2 .897-2 2h-2c0-2.206 1.794-4 4-4h6c2.206 0 4 1.794 4 4v3zm-4 2H4c-1.103 0-2 .897-2 2v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7c0-1.103-.897-2-2-2zM4 12h7v2H4v-2zm9 0h7v2h-7v-2zm-9 4h7v2H4v-2zm9 0h7v2h-7v-2zm-9 4h7v2H4v-2zm9 0h7v2h-7v-2z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		children: [
			{
				path: "/components/supplier",
				type: "link",
				active: false,
				selected: false,
				title: "View Suppliers",
			},
			{
				path: "/components/supplier/createsupplier",
				type: "link",
				active: false,
				selected: false,
				title: "Add Supplier",
			},
		],
	},
	{
		menutitle: "WEB APPS",
	},
	{
		title: "Apps",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11-6h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 6h-4V5h4v4zm-9 4H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H5v-4h4v4zm8-6c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		children: [
			{
				path: "/components/apps/fullcalendar",
				type: "link",
				active: false,
				selected: false,
				title: "Full Calendar",
			},
			{
				path: "/components/apps/contacts",
				type: "link",
				active: false,
				selected: false,
				title: "Contacts",
			},
			{
				path: "/components/apps/gallery",
				type: "link",
				active: false,
				selected: false,
				title: "Gallery",
			},
			{
				path: "/components/apps/sweetalerts",
				type: "link",
				active: false,
				selected: false,
				title: "Sweet Alerts",
			},

			{
				path: "/components/apps/notifications",
				type: "link",
				active: false,
				selected: false,
				title: "Notifications",
			},
			{
				path: "/components/apps/widget-notification",
				type: "link",
				active: false,
				selected: false,
				title: "Widget-notification",
			},
			{
				path: "/components/apps/treeview",
				type: "link",
				active: false,
				selected: false,
				title: "Treeview",
			},
			{
				path: "/components/apps/file-manager",
				type: "link",
				active: false,
				selected: false,
				title: "File-manager",
			},
			{
				path: "/components/apps/file-manager1",
				type: "link",
				active: false,
				selected: false,
				title: "File-manager1",
			},
			{
				path: "/components/apps/file-details",
				type: "link",
				active: false,
				selected: false,
				title: "File-details",
			},
		],
	},
	{
		title: "Elements",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M20 17V7c0-2.168-3.663-4-8-4S4 4.832 4 7v10c0 2.168 3.663 4 8 4s8-1.832 8-4zM12 5c3.691 0 5.931 1.507 6 1.994C17.931 7.493 15.691 9 12 9S6.069 7.493 6 7.006C6.069 6.507 8.309 5 12 5zM6 9.607C7.479 10.454 9.637 11 12 11s4.521-.546 6-1.393v2.387c-.069.499-2.309 2.006-6 2.006s-5.931-1.507-6-2V9.607zM6 17v-2.393C7.479 15.454 9.637 16 12 16s4.521-.546 6-1.393v2.387c-.069.499-2.309 2.006-6 2.006s-5.931-1.507-6-2z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		children: [
			{
				path: "/components/elements/alerts",
				title: "Alerts",
				type: "link",
				active: false,
				selected: false,
			},

			{
				path: "/components/elements/breadcrumb",
				title: "Breadcrumbs",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/button-group",
				title: "Button Group",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/buttons",
				title: "Buttons",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/badge",
				title: "Badge",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/cards",
				title: "Cards",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/dropdowns",
				title: "Dropdowns",
				type: "link",
				active: false,
				selected: false,
			},
			{ path: "/components/elements/images&figures", type: "link", active: false, selected: false, dirchange: false, title: "Images & Figures" },
			{
				path: "/components/elements/listgroup",
				title: "List Group",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/navs-tabs",
				title: "Navs &Tabs",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/media-object",
				type: "link",
				active: false,
				selected: false,
				title: "Media Object",
			},

			{
				path: "/components/elements/pagination",
				title: "Pagination",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/popovers",
				title: "Popovers",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/progress",
				title: "Progress",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/spinners",
				title: "Spinners",
				type: "link",
				active: false,
				selected: false,
			},

			{
				path: "/components/elements/tooltips",
				title: "Tooltips",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/toasts",
				title: "Toasts",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/tags",
				title: "Tags",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/elements/typography",
				title: "Typography",
				type: "link",
				active: false,
				selected: false,
			},

		],
	},
	{
		title: "Advanced UI",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M20.995 6.9a.998.998 0 0 0-.548-.795l-8-4a1 1 0 0 0-.895 0l-8 4a1.002 1.002 0 0 0-.547.795c-.011.107-.961 10.767 8.589 15.014a.987.987 0 0 0 .812 0c9.55-4.247 8.6-14.906 8.589-15.014zM12 19.897C5.231 16.625 4.911 9.642 4.966 7.635L12 4.118l7.029 3.515c.037 1.989-.328 9.018-7.029 12.264z" />
				<path d="m11 12.586-2.293-2.293-1.414 1.414L11 15.414l5.707-5.707-1.414-1.414z" />
			</svg>
		),
		type: "sub",
		selected: false,
		bookmark: true,
		active: false,
		children: [
			{ path: "/components/advancedui/accordions-collapse", type: "link", active: false, selected: false, dirchange: false, title: "Accordions & Collapse" },
			{
				path: "/components/advancedui/carousel",
				type: "link",
				active: false,
				selected: false,
				title: "Carousel",
			},
			{ path: "/components/advancedui/draggable-cards", type: "link", active: false, selected: false, dirchange: false, title: "Draggable Cards" },
			{ path: "/components/advancedui/modals-closes", type: "link", active: false, selected: false, dirchange: false, title: "Modals & Closes" },
			{ path: "/components/advancedui/navbar", type: "link", active: false, selected: false, dirchange: false, title: "Navbar" },
			{ path: "/components/advancedui/offcanvas", type: "link", active: false, selected: false, dirchange: false, title: "Offcanvas" },
			{ path: "/components/advancedui/placeholders", type: "link", active: false, selected: false, dirchange: false, title: "Placeholders" },
			{ path: "/components/advancedui/ratings", type: "link", active: false, selected: false, dirchange: false, title: "Ratings" },
			{ path: "/components/advancedui/swiperjs", type: "link", active: false, selected: false, dirchange: false, title: "Swiper JS" },
			{
				path: "/components/advancedui/timeline",
				type: "link",
				active: false,
				selected: false,
				title: "Timeline",
			},

			{
				path: "/components/advancedui/search",
				type: "link",
				active: false,
				selected: false,
				title: "Search",
			},
			{
				path: "/components/advancedui/userlist",
				type: "link",
				active: false,
				selected: false,
				title: "Userlist",
			},
			{
				path: "/components/advancedui/blog",
				type: "link",
				active: false,
				selected: false,
				title: "Blog",
			},
			{
				path: "/components/advancedui/blog-details",
				type: "link",
				active: false,
				selected: false,
				title: "Blog-details",
			},
			{
				path: "/components/advancedui/edit-post",
				type: "link",
				active: false,
				selected: false,
				title: "Edit-post",
			},

		],
	},

	{
		menutitle: "PAGES",
	},
	{
		title: "Pages",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M22 7.999a1 1 0 0 0-.516-.874l-9.022-5a1.003 1.003 0 0 0-.968 0l-8.978 4.96a1 1 0 0 0-.003 1.748l9.022 5.04a.995.995 0 0 0 .973.001l8.978-5A1 1 0 0 0 22 7.999zm-9.977 3.855L5.06 7.965l6.917-3.822 6.964 3.859-6.918 3.852z" />
				<path d="M20.515 11.126 12 15.856l-8.515-4.73-.971 1.748 9 5a1 1 0 0 0 .971 0l9-5-.97-1.748z" />
				<path d="M20.515 15.126 12 19.856l-8.515-4.73-.971 1.748 9 5a1 1 0 0 0 .971 0l9-5-.97-1.748z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		children: [
			{
				title: "Authentication",
				type: "sub",
				selected: false,
				active: false,
				children: [
					{
						path: "/components/pages/authentication/sign-in",
						title: "Sign In",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/authentication/sign-up",
						title: "Sign Up",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/authentication/forgot-password",
						title: "Forgot Password",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/authentication/reset-password",
						title: "Reset Password",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/authentication/lockscreen",
						title: "Lockscreen",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/authentication/underconstruction",
						title: "UnderConstruction",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/authentication/404",
						title: "404 Error",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/authentication/500",
						title: "500 Error",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/authentication/501",
						title: "501 Error",
						type: "link",
						active: false,
						selected: false,
					},
				],
			},

			{
				title: "E-Commerce",
				type: "sub",
				selected: false,
				active: false,
				children: [
					{
						path: "/components/pages/e-commerce/shop",
						title: "Shop",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/e-commerce/product-details",
						title: "Product Details",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/e-commerce/cart",
						title: "Cart",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/e-commerce/checkout",
						title: "Checkout",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/e-commerce/wish-list",
						title: "Wish-list",
						type: "link",
						active: false,
						selected: false,
					},
				],
			},

			{
				path: "/components/pages/profile",
				title: "Profile",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/pages/notification-list",
				title: "Notification-list",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/pages/about-us",
				title: "About Us",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/pages/settings",
				title: "Settings",
				type: "link",
				active: false,
				selected: false,
			},
			{
				title: "Mail",
				type: "sub",
				selected: false,
				active: false,
				children: [
					{
						path: "/components/pages/mail/mail",
						title: "Mail",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/mail/mail-compose",
						title: "Mail Compose",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/mail/read-mail",
						title: "Read-Mail",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/mail/mail-settings",
						title: "Mail-Settings",
						type: "link",
						active: false,
						selected: false,
					},
					{
						path: "/components/pages/mail/chat",
						title: "Chat",
						type: "link",
						active: false,
						selected: false,
					},
				],
			},
			{
				path: "/components/pages/invoice",
				title: "Invoice",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/pages/pricing",
				title: "Pricing",
				type: "link",
				active: false,
				selected: false,
			},
			
			{
				path: "/components/pages/todotask",
				title: "Todo Task",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/pages/faqs",
				title: "FAQS",
				type: "link",
				active: false,
				selected: false,
			},
			{
				path: "/components/pages/empty-page",
				title: "Empty Page",
				type: "link",
				active: false,
				selected: false,
			},
		],
	},
	{
		title: "Utilities",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M12 22c4.879 0 9-4.121 9-9s-4.121-9-9-9-9 4.121-9 9 4.121 9 9 9zm0-16c3.794 0 7 3.206 7 7s-3.206 7-7 7-7-3.206-7-7 3.206-7 7-7zm5.284-2.293 1.412-1.416 3.01 3-1.413 1.417zM5.282 2.294 6.7 3.706l-2.99 3-1.417-1.413z" />
				<path d="M11 9h2v5h-2zm0 6h2v2h-2z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		children: [
			{ path: "/components/utilities/avatars", type: "link", active: false, selected: false, title: "Avatars" },
			{ path: "/components/utilities/borders", type: "link", active: false, selected: false, title: "Borders" },
			{ path: "/components/utilities/breakpoints", type: "link", active: false, selected: false, title: "Breakpoints" },
			{ path: "/components/utilities/colors", type: "link", active: false, selected: false, title: "Colors" },
			{ path: "/components/utilities/columns", type: "link", active: false, selected: false, title: "Columns" },
			{ path: "/components/utilities/flex", type: "link", active: false, selected: false, title: "Flex" },
			{ path: "/components/utilities/gutters", type: "link", active: false, selected: false, title: "Gutters" },
			{ path: "/components/utilities/helpers", type: "link", active: false, selected: false, title: "Helpers" },
			{ path: "/components/utilities/position", type: "link", active: false, selected: false, title: "Position" },
			{ path: "/components/utilities/additionalcontent", type: "link", active: false, selected: false, title: "Additional Content" }
		],
	},

	{
		menutitle: "GENERAL",
	},
	{
		title: "Icons",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M20 7h-1.209A4.92 4.92 0 0 0 19 5.5C19 3.57 17.43 2 15.5 2c-1.622 0-2.705 1.482-3.404 3.085C11.407 3.57 10.269 2 8.5 2 6.57 2 5 3.57 5 5.5c0 .596.079 1.089.209 1.5H4c-1.103 0-2 .897-2 2v2c0 1.103.897 2 2 2v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zm-4.5-3c.827 0 1.5.673 1.5 1.5C17 7 16.374 7 16 7h-2.478c.511-1.576 1.253-3 1.978-3zM7 5.5C7 4.673 7.673 4 8.5 4c.888 0 1.714 1.525 2.198 3H8c-.374 0-1 0-1-1.5zM4 9h7v2H4V9zm2 11v-7h5v7H6zm12 0h-5v-7h5v7zm-5-9V9.085L13.017 9H20l.001 2H13z" />
			</svg>
		),
		type: "link",
		selected: false,
		path:"/components/icons/icons"
	},
	{
		title: "Charts", icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M20 7h-4V4c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H4c-1.103 0-2 .897-2 2v9a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9c0-1.103-.897-2-2-2zM4 11h4v8H4v-8zm6-1V4h4v15h-4v-9zm10 9h-4V9h4v10z" />
			</svg>
		), type: "sub",
		children: [
			{
				title: "Apex Charts", type: "sub", menusub: true, active: false, selected: false, dirchange: false,
				children: [
					{ path: "/components/charts/apexcharts/linecharts", type: "link", active: false, selected: false, dirchange: false, title: "Line Charts" },
					{ path: "/components/charts/apexcharts/areacharts", type: "link", active: false, selected: false, dirchange: false, title: "Area Charts " },
					{ path: "/components/charts/apexcharts/columncharts", type: "link", active: false, selected: false, dirchange: false, title: "Column Charts " },
					{ path: "/components/charts/apexcharts/barcharts", type: "link", active: false, selected: false, dirchange: false, title: "Bar Charts" },
					{ path: "/components/charts/apexcharts/mixedcharts", type: "link", active: false, selected: false, dirchange: false, title: "Mixed Charts" },
					{ path: "/components/charts/apexcharts/rangeareacharts", type: "link", active: false, selected: false, dirchange: false, title: "Range Area Charts" },
					{ path: "/components/charts/apexcharts/timelinecharts", type: "link", active: false, selected: false, dirchange: false, title: "Timeline Charts" },
					{ path: "/components/charts/apexcharts/candlestickcharts", type: "link", active: false, selected: false, dirchange: false, title: "CandleStick Charts" },
					{ path: "/components/charts/apexcharts/boxplotcharts", type: "link", active: false, selected: false, dirchange: false, title: "Boxplot Charts" },
					{ path: "/components/charts/apexcharts/bubblecharts", type: "link", active: false, selected: false, dirchange: false, title: "Bubble Charts" },
					{ path: "/components/charts/apexcharts/scattercharts", type: "link", active: false, selected: false, dirchange: false, title: "Scatter Charts" },
					{ path: "/components/charts/apexcharts/heatmapcharts", type: "link", active: false, selected: false, dirchange: false, title: "Heatmap Charts" },
					{ path: "/components/charts/apexcharts/treemapcharts", type: "link", active: false, selected: false, dirchange: false, title: "Treemap Charts" },
					{ path: "/components/charts/apexcharts/piecharts", type: "link", active: false, selected: false, dirchange: false, title: "Pie Charts" },
					{ path: "/components/charts/apexcharts/radialbarcharts", type: "link", active: false, selected: false, dirchange: false, title: "Radialbar Charts" },
					{ path: "/components/charts/apexcharts/radarcharts", type: "link", active: false, selected: false, dirchange: false, title: "Radar Charts" },
					{ path: "/components/charts/apexcharts/polarareacharts", type: "link", active: false, selected: false, dirchange: false, title: "Polararea Charts" },
				],
			},
			{ path: "/components/charts/chartjscharts", type: "link", active: false, selected: false, dirchange: false, title: "ChartJS Charts" },
			{ path: "/components/charts/echartcharts", type: "link", active: false, selected: false, dirchange: false, title: "Echart Charts" },
		],
	},
	{
		menutitle: "COMPONENTS",
	},
	{
		title: "Forms",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M19.937 8.68c-.011-.032-.02-.063-.033-.094a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.99.99 0 0 0-.05-.258zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		children: [
			{
				title: "Form Elements", type: "sub", menusub: true, active: false, selected: false, dirchange: false,
				children: [
					{ path: "/components/forms/formelements/inputs", type: "link", active: false, selected: false, dirchange: false, title: "Inputs" },
					{ path: "/components/forms/formelements/checks&radios", type: "link", active: false, selected: false, dirchange: false, title: "checks&Radios" },
					{ path: "/components/forms/formelements/inputgroups", type: "link", active: false, selected: false, dirchange: false, title: "Input Group" },
					{ path: "/components/forms/formelements/formselect", type: "link", active: false, selected: false, dirchange: false, title: "Form Select" },
					{ path: "/components/forms/formelements/rangeslider", type: "link", active: false, selected: false, dirchange: false, title: "Range Slider" },
					{ path: "/components/forms/formelements/inputmasks", type: "link", active: false, selected: false, dirchange: false, title: "Input Masks" },
					{ path: "/components/forms/formelements/fileuploads", type: "link", active: false, selected: false, dirchange: false, title: "File Uploads" },
					{ path: "/components/forms/formelements/datetimepicker", title: "Date,Time Picker",type: "link",active: false,selected: false},
					{ path: "/components/forms/formelements/colorpickers",title: "Color Pickers",type: "link",active: false,selected: false }
				],
			},
			{ path: "/components/forms/floatinglabels", type: "link", active: false, selected: false, dirchange: false, title: "Floating Labels" },
			{ path: "/components/forms/formlayouts", type: "link", active: false, selected: false, dirchange: false, title: "Form Layouts" },
			{
				title: "Form Editors", type: "sub", menusub: true, active: false, selected: false, dirchange: false,
				children: [
					{ path: "/components/forms/formeditors/quilleditor", type: "link", active: false, selected: false, dirchange: false, title: "Quill Editors" },
				],
			},    
			{ path: "/components/forms/validation", type: "link", active: false, selected: false, dirchange: false, title: "Validation" },
			{ path: "/components/forms/select2", type: "link", active: false, selected: false, dirchange: false, title: "Select2" },
		],
	},
	{
		title: "Widgets",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg"  className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11 4h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4v4zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/></svg>

		),
		type: "link",
		selected: false,
		path:"/components/widgets/widgets"
	},
	{
		title: "Maps",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M2.002 9.63c-.023.411.207.794.581.966l7.504 3.442 3.442 7.503c.164.356.52.583.909.583l.057-.002a1 1 0 0 0 .894-.686l5.595-17.032c.117-.358.023-.753-.243-1.02s-.66-.358-1.02-.243L2.688 8.736a1 1 0 0 0-.686.894zm16.464-3.971-4.182 12.73-2.534-5.522a.998.998 0 0 0-.492-.492L5.734 9.841l12.732-4.182z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		children: [
			{ path: "/components/maps/leafletmaps", type: "link", active: false, selected: false, dirchange: false, title: "Leaflet Maps" },
			{ path: "/components/maps/vectormaps", type: "link", active: false, selected: false, dirchange: false, title: "Vector Maps" },
		],
	},
	{
		menutitle: "Settings",
		roles: [1], // Only admin can see settings section
	},
	{
		title: "Settings",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z" />
				<path d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		roles: [1], // Only admin can see settings
		children: [
			{
				path: "/components/settings/profile",
				type: "link",
				active: false,
				selected: false,
				title: "Profile Settings",
				roles: [1, 2, 3], // All users can access their profile
			},
			{
				path: "/components/settings/wix-config",
				type: "link",
				active: false,
				selected: false,
				title: "Wix Configuration",
				roles: [1], // Only admin can access Wix config
			}
		],
	},
];

// Function to filter menu items based on user role
export const filterMenuItemsByRole = (items, userRole) => {
	if (!userRole) return [];
	
	return items.filter(item => {
		// Check if the item has roles specified and if the user's role is included
		if (item.roles && !item.roles.includes(Number(userRole))) {
			return false;
		}

		// If item has children, filter them recursively
		if (item.children) {
			const filteredChildren = item.children.filter(child => 
				!child.roles || child.roles.includes(Number(userRole))
			);
			
			// Only include parent if it has visible children
			if (filteredChildren.length === 0) {
				return false;
			}
			
			// Update children array with filtered results
			item.children = filteredChildren;
		}

		return true;
	});
};

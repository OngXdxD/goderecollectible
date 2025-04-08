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
		menutitle: "Customers & Product",
		roles: [1, 2, 3],
	},
	{
		title: "Customers",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		roles: [1, 2, 3],
		children: [
			{
				path: "/components/customer/createcustomer",
				type: "link",
				active: false,
				selected: false,
				title: "Create Customer",
				roles: [1, 2, 3],
			},
			{
				path: "/components/customer/viewcustomers",
				type: "link",
				active: false,
				selected: false,
				title: "View Customers",
				roles: [1, 2, 3],
			}
		],
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
			},
			{
				title: "View Stock Balance",
				path: "/components/inventory/viewinventory",
				type: "link",
				active: false,
				selected: false,
				roles: [1, 2, 3],
			},
		],
	},
	{
		menutitle: "Sales & Invoice",
		roles: [1, 2, 3],
	},
	{
		title: "Sales Orders",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="side-menu__icon"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
				<path d="M7 12h2v5H7zm4-7h2v12h-2zm4 3h2v9h-2z" />
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		roles: [1, 2, 3],
		children: [
			{
				path: "/components/salesorder/createsalesorder",
				type: "link",
				active: false,
				selected: false,
				title: "Create Sales Order",
				roles: [1, 2, 3],
			},
			{
				path: "/components/salesorder/viewsalesorders",
				type: "link",
				active: false,
				selected: false,
				title: "View Sales Orders",
				roles: [1, 2, 3],
			}
		],
	},
	{
		id: "invoice",
		title: "Invoice",
		icon: <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
		type: "sub",
		active: false,
		children: [
			{
				id: "createinvoice",
				title: "Create Invoice",
				type: "link",
				active: false,
				selected: false,
				path: "/components/invoice/createinvoice",
			},
			{
				id: "viewinvoices",
				title: "View Invoices",
				type: "link",
				active: false,
				selected: false,
				path: "/components/invoice/viewinvoices",
			},
		],
	},
	{
		menutitle: "Purchase & Stock",
		roles: [1, 2, 3],
	},
	{
		title: "Purchase Orders",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="side-menu__icon"
			>
				<circle cx="9" cy="21" r="1"></circle>
				<circle cx="20" cy="21" r="1"></circle>
				<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
			</svg>
		),
		type: "sub",
		selected: false,
		active: false,
		roles: [1, 2, 3],
		children: [
			{
				title: "Create Purchase Order",
				path: "/components/purchaseorder/createpurchaseorder",
				type: "link",
				active: false,
				selected: false,
				roles: [1, 2],
			},
			{
				title: "View Purchase Orders",
				path: "/components/purchaseorder/viewpurchaseorders",
				type: "link",
				active: false,
				selected: false,
				roles: [1, 2, 3],
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
	}
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

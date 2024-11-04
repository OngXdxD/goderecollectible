export const MENUITEMS = [
	{
		menutitle: "Main",
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
		children: [
			{
				path: "/components/dashboards/dashboard1",
				type: "link",
				active: false,
				selected: false,
				title: "Dashboard-1",
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
						path: "/components/pages/authentication/404",
						title: "404 Error",
						type: "link",
						active: false,
						selected: false,
					},
				
				],
			},
		]
	},
	{
		menutitle: "MULTI LEVEL",
	},
	{
		title: "Menu Levels", icon: <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{
				path: "",
				title: "Level-1",
				type: "empty",
				active: false,
				selected: false,
			},
			{
				title: "Level-2",
				type: "sub",
				selected: false,
				active: false,
				children: [
					{
						path: "",
						title: "Level-2.1",
						type: "empty",
						active: false,
						selected: false,
					},
					{
						
						title: "Level-2.2",
						type: "sub",
						active: false,
						selected: false,
						children:[
							{
								path: "",
								title: "Level-2.2.1",
								type: "empty",
								active: false,
								selected: false,
							},
							{
								path: "",
								title: "Level-2.2.2",
								type: "empty",
								active: false,
								selected: false,
							},
						]
					},

				],
			},
		],
	},
];

const initialState = {
	lang: "en",
	dir: "ltr",
	dataThemeMode: "light",
	dataMenuStyles: "light",
	dataNavLayout: "vertical",
	dataHeaderStyles: "light",
	dataVerticalStyle: "overlay",
	StylebodyBg:"107 64 64",
	StyleDarkBg:"93 50 50",
	toggled:"",
	dataNavStyle:"",
	horStyle:"",
	dataPageStyle:"regular",
	dataWidth:"fullwidth",
	dataMenuPosition:"fixed",
	dataHeaderPosition:"fixed",
	iconOverlay:"",
	colorPrimaryRgb:"",
	bodyBg1:"",
	bodyBg:"",
	darkBg:"",
	Light:"",
	inputBorder:"",
	bgImg:"",
	iconText:"",
	body:{
		class:""
	},
};

export default function reducer(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {

	case "ThemeChanger":
		state = payload;
		return state;

	default:
		return state;
	}
}

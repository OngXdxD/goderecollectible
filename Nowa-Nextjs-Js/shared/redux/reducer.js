const ThemeChanger = "ThemeChanger";
const SET_SELECTED_ITEM = "SET_SELECTED_ITEM";
const ADD_TO_WISHLIST = "ADD_TO_WISHLIST";
const REMOVE_FROM_WISHLIST = "REMOVE_FROM_WISHLIST";
const Buynow_checkout = "Buynow_checkout";
const ADD_TO_CHECKOUT = "ADD_TO_CHECKOUT";
const ADD_TO_CART = "ADD_TO_CART"; // Define ADD_TO_CART as a constant
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_CART_QUANTITY = "UPDATE_CART_QUANTITY";
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
	selectedItem: null,
    wishlist: [],
    cart: [],
    count: 0,
    checkoutItems: [],
    products:[
		{
			id: "13",
			pic1: "../../../../assets/images/ecommerce/9.jpg",
			pic2: "../../../../assets/images/ecommerce/23.jpg",
			item: "Glass Flower pot",
			name: "Glass Flower pot",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/9.jpg",
			price: "55",
			stock: "In stock",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/9.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/55.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/56.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/57.jpg" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			stockbg: "success",
			prices: "$55",
			disc: "$59",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "14",
			pic1: "../../../../assets/images/ecommerce/2.png",
			pic2: "../../../../assets/images/ecommerce/3.png",
			item: "Mens party wear t-shirt",
			name: "Mens party wear t-shirt",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/2.png",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/2.png" },
				{ 'img': "../../../../assets/images/ecommerce/2.1.png" },
				{ 'img': "../../../../assets/images/ecommerce/2.2.png" },
				{ 'img': "../../../../assets/images/ecommerce/2.3.png" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "40",
			stock: "In stock",
			stockbg: "success",
			prices: "$40",
			disc: "$59",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "15",
			pic1: "../../../../assets/images/ecommerce/10.png",
			pic2: "../../../../assets/images/ecommerce/31.png",
			item: "Leather Wallet For girls",
			name: "Leather Wallet For girls",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/10.png",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/10.4.png" },
				{ 'img': "../../../../assets/images/ecommerce/10.1.png" },
				{ 'img': "../../../../assets/images/ecommerce/10.2.png" },
				{ 'img': "../../../../assets/images/ecommerce/10.3.png" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "95",
			stock: "In stock",
			stockbg: "success",
			prices: "$95",
			disc: "$59",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "16",
			pic1: "../../../../assets/images/ecommerce/11.png",
			pic2: "../../../../assets/images/ecommerce/23.png",
			item: "women party wear dress",
			name: "women party wear dress",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/1.jpg",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/11.png" },
				{ 'img': "../../../../assets/images/ecommerce/20.png" },
				{ 'img': "../../../../assets/images/ecommerce/21.png" },
				{ 'img': "../../../../assets/images/ecommerce/22.png" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "80",
			stock: "In stock",
			stockbg: "success",
			prices: "$80",
			disc: "$59",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "17",
			pic1: "../../../../assets/images/ecommerce/16.jpg",
			pic2: "../../../../assets/images/ecommerce/24.jpg",
			item: "White Ear buds",
			name: "White Ear buds",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/16.jpg",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/16.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/24.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/31.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/32.jpg" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "35",
			stock: "In stock",
			stockbg: "success",
			prices: "$35",
			disc: "$59",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "18",
			pic1: "../../../../assets/images/ecommerce/52.jpg",
			pic2: "../../../../assets/images/ecommerce/53.jpg",
			item: "simple white Chair",
			name: "simple white Chair",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/52.jpg",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/52.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/53.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/54.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/53.jpg" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "50",
			stock: "In stock",
			stockbg: "success",
			prices: "$50",
			disc: "$59",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "19",
			pic1: "../../../../assets/images/ecommerce/58.jpg",
			pic2: "../../../../assets/images/ecommerce/59.jpg",
			item: "Blue Jacket For Men",
			name: "Blue Jacket For Men",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/58.jpg",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/3.1.png" },
				{ 'img': "../../../../assets/images/ecommerce/3.2.png" },
				{ 'img': "../../../../assets/images/ecommerce/3.3.png" },
				{ 'img': "../../../../assets/images/ecommerce/3.4.png" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "45",
			stock: "In stock",
			stockbg: "success",
			prices: "$45",
			disc: "$59",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "20",
			pic1: "../../../../assets/images/ecommerce/47.jpg",
			pic2: "../../../../assets/images/ecommerce/51.jpg",
			item: "Lence Camara",
			name: "Lence Camara",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/47.jpg",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/47.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/48.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/49.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/50.jpg" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "55",
			stock: "In stock",
			stockbg: "success",
			prices: "$55",
			disc: "$59",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "21",
			pic1: "../../../../assets/images/ecommerce/37.jpg",
			pic2: "../../../../assets/images/ecommerce/41.jpg",
			item: "smooth and soft Kids wear",
			name: "smooth and soft Kids wear",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/7.jpg",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/37.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/38.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/39.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/40.jpg" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "70",
			stock: "In stock",
			stockbg: "success",
			prices: "$70",
			disc: "$59",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "22",
			pic1: "../../../../assets/images/ecommerce/11.jpg",
			pic2: "../../../../assets/images/ecommerce/10.jpg",
			item: "Branded Alaram clock",
			name: "Branded Alaram clock",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/11.jpg",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/11.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/33.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/34.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/35.jpg" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "80",
			stock: "In stock",
			stockbg: "success",
			prices: "$80",
			disc: "$70",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "23",
			pic1: "../../../../assets/images/ecommerce/13.jpg",
			pic2: "../../../../assets/images/ecommerce/12.jpg",
			item: "Branded black headset",
			name: "Branded black headset",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/13.jpg",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/13.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/36.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/13.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/36.jpg" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "550",
			stock: "In stock",
			stockbg: "success",
			prices: "$550",
			disc: "$239",
			size:"XXL",
		color:" purple color",
		},
		{
			id: "24",
			pic1: "../../../../assets/images/ecommerce/44.jpg",
			pic2: "../../../../assets/images/ecommerce/46.jpg",
			item: "Colorful coffee cup",
			name: "Colorful coffee cup",
			quantity: 2,
			src: "../../../../assets/images/ecommerce/14.jpg",
			images: [
				{ 'img': "../../../../assets/images/ecommerce/44.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/42.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/43.jpg" },
				{ 'img': "../../../../assets/images/ecommerce/45.jpg" }],
			description:"Lorem ipsum dolor sit amet consectetur adipisicing elit.",
			price: "60",
			stock: "In stock",
			stockbg: "success",
			prices: "$60",
			disc: "$49",
			size:"XXL",
		color:" purple color",
		},
	],
};

export default function reducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ThemeChanger:
            return {
                ...state,
                ...payload
            };
			
        case SET_SELECTED_ITEM:
            return {
                ...state,
                selectedItem: payload
            };
			
        case ADD_TO_WISHLIST:
            return {
                ...state,
                wishlist: [...state.wishlist, payload]
            };

        case REMOVE_FROM_WISHLIST:
            return {
                ...state,
                wishlist: state.wishlist.filter(item => item.id !== payload)
            };

        case Buynow_checkout:
            return {
                ...state,
                cart: [payload],
                actionType: action.actionType
            };

        case ADD_TO_CHECKOUT:
            return {
                ...state,
                checkoutItems: action.payload,
                actionType: action.actionType
            };

        case ADD_TO_CART: // Handle ADD_TO_CART action
            return {
                ...state,
                cart: [...state.cart, payload]
            };

        case REMOVE_FROM_CART:
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== payload)
            };

        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(0, action.payload.quantity) }
                        : item
                )
            };

        default:
            return state;
    }
}

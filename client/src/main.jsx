import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from "react-router-dom";
import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import App from "./App.jsx";
import store from "./store.js";

import PrivateRoute from "./components/PrivateRoute.jsx";
import HomeScreen from "./screens/homeScreen.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";
import CartScreen from "./screens/CartScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ShippingScreen from "./screens/ShippingScreen.jsx";
import PaymentScreen from "./screens/PaymentScreen.jsx";
import OrderScreen from "./screens/OrderScreen.jsx";

import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route index={true} path="/" element={<HomeScreen />} />
			<Route path="/product/:id" element={<ProductScreen />} />
			<Route path="/cart" element={<CartScreen />} />
			<Route path="/login" element={<LoginScreen />} />
			<Route path="/register" element={<RegisterScreen />} />

			<Route path="" element={<PrivateRoute />}>
				<Route path="/shipping" element={<ShippingScreen />} />
				<Route path="/payment" element={<PaymentScreen />} />
				<Route path="/placeorder" element={<PlaceOrderScreen />} />
				<Route path="/order/:id" element={<OrderScreen />} />
			</Route>
		</Route>
	)
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<PayPalScriptProvider
				deferLoading={true}
				options={{ clientId: "ASB8r7YLCXi3TN9mfA6rFWi_nC9KTS204O5HZj0KA4YHkqV8XIuX6Nm5tuX3bJPseEenanmCpf3XdBed" }}>
				<RouterProvider router={router} />
			</PayPalScriptProvider>
		</Provider>
	</StrictMode>
);

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
import AdminRoute from "./components/AdminRoute.jsx";

import HomeScreen from "./screens/homeScreen.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";
import CartScreen from "./screens/CartScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ShippingScreen from "./screens/ShippingScreen.jsx";
import PaymentScreen from "./screens/PaymentScreen.jsx";
import OrderScreen from "./screens/OrderScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import OrderListScreen from "./screens/admin/OrderListScreen.jsx";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.jsx";
import ProductListScreen from "./screens/admin/ProductListScreen.jsx";
import ProductEditScreen from "./screens/admin/ProductEditScreen.jsx";

import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";

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
				<Route path="/profile" element={<ProfileScreen />} />
			</Route>

			<Route path="" element={<AdminRoute />}>
				<Route path="/admin/orderlist" element={<OrderListScreen />} />
				<Route path="/admin/productlist" element={<ProductListScreen />} />
				<Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
			</Route>
		</Route>
	)
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<PayPalScriptProvider deferLoading={true}>
				<RouterProvider router={router} />
			</PayPalScriptProvider>
		</Provider>
	</StrictMode>
);

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/api";
import cartSliceReducer from "./slices/cart";
import authSliceReducer from "./slices/auth";

const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		cart: cartSliceReducer,
		auth: authSliceReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: true
});

export default store;

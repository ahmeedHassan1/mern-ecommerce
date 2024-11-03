import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

connectDB();

import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import uploadRoutes from "./routes/upload.js";
import promoCodeRoutes from "./routes/promoCode.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/promos", promoCodeRoutes);

app.get("/api/config/paypal", (req, res) =>
	res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
	// set static folder
	app.use(express.static(path.join(__dirname, "/client/dist")));

	// any route that is not an api route, serve the index.html
	app.get("*", (req, res) =>
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
	);
} else {
	app.get("/", (req, res) => {
		res.send("API is running...");
	});
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
	console.log("Server is running on port http://localhost:" + port);
});

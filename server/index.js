import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import { specs, swaggerUi } from "./config/swagger.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { apiLimiter } from "./middleware/rateLimiting.js";
import logger from "./utils/logger.js";

const port = process.env.PORT || 5000;

connectDB();

import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import uploadRoutes from "./routes/upload.js";
import promoCodeRoutes from "./routes/promoCode.js";
import authRoutes from "./routes/auth.js";

const app = express();

// HTTP request logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
} else {
	app.use(
		morgan("combined", {
			stream: {
				write: (message) => logger.info(message.trim())
			}
		})
	);
}

// Security middleware
app.use(
	helmet({
		crossOriginEmbedderPolicy: false,
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
				fontSrc: ["'self'", "https://fonts.gstatic.com"],
				imgSrc: ["'self'", "data:", "https:"],
				scriptSrc: ["'self'"],
				connectSrc: ["'self'"]
			}
		}
	})
);

// CORS configuration
const corsOptions = {
	origin:
		process.env.NODE_ENV === "production"
			? process.env.FRONTEND_URL
			: ["http://localhost:3000", "http://localhost:5173"],
	credentials: true,
	optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Apply rate limiting to all API routes
app.use("/api/", apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/promos", promoCodeRoutes);
app.use("/api/auth", authRoutes);

// API Documentation
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(specs, {
		explorer: true,
		customCss: ".swagger-ui .topbar { display: none }",
		customSiteTitle: "MERN E-commerce API Documentation"
	})
);

// API info endpoint
app.get("/api", (req, res) => {
	res.json({
		message: "Welcome to MERN E-commerce API",
		version: "1.0.0",
		documentation: "/api-docs",
		endpoints: {
			products: "/api/products",
			users: "/api/users",
			orders: "/api/orders",
			promos: "/api/promos",
			auth: "/api/auth",
			config: "/api/config/paypal"
		}
	});
});

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

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
	console.log("Server is running on port http://localhost:" + port);
});

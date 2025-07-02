import mongoose from "mongoose";

const connectDB = async () => {
	try {
		// Connection pooling and optimization options
		const connectionOptions = {
			// Connection pool settings
			maxPoolSize: 10, // Maximum number of connections in the pool
			minPoolSize: 5, // Minimum number of connections in the pool
			maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
			serverSelectionTimeoutMS: 5000, // How long to try selecting a server
			socketTimeoutMS: 45000, // How long a send or receive on a socket can take
			heartbeatFrequencyMS: 10000 // How often to check server status
		};

		const connection = await mongoose.connect(
			process.env.MONGO_URI,
			connectionOptions
		);

		console.log(`MongoDB connected: ${connection.connection.host}`);
		console.log(
			`Connection pool - Max: ${connectionOptions.maxPoolSize}, Min: ${connectionOptions.minPoolSize}`
		);

		// Connection event listeners for monitoring
		mongoose.connection.on("connected", () => {
			console.log("Mongoose connected to MongoDB");
		});

		mongoose.connection.on("error", (err) => {
			console.error("Mongoose connection error:", err);
		});

		mongoose.connection.on("disconnected", () => {
			console.log("Mongoose disconnected from MongoDB");
		});

		// Graceful shutdown
		process.on("SIGINT", async () => {
			await mongoose.connection.close();
			console.log("MongoDB connection closed through app termination");
			process.exit(0);
		});
	} catch (error) {
		console.error(`MongoDB connection error: ${error.message}`);
		process.exit(1);
	}
};

export default connectDB;

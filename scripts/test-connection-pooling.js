import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Test connection pooling functionality
async function testConnectionPooling() {
	console.log("🔄 Testing MongoDB Connection Pooling");
	console.log("=".repeat(50));

	try {
		const connectionOptions = {
			maxPoolSize: 10,
			minPoolSize: 5,
			maxIdleTimeMS: 30000,
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
			heartbeatFrequencyMS: 10000
		};

		console.log("1. Connecting with connection pool settings...");
		await mongoose.connect(process.env.MONGO_URI, connectionOptions);

		console.log("✅ Connected to MongoDB");
		console.log(`Connection pool configuration:
- Max Pool Size: ${connectionOptions.maxPoolSize}
- Min Pool Size: ${connectionOptions.minPoolSize}
- Max Idle Time: ${connectionOptions.maxIdleTimeMS}ms
- Socket Timeout: ${connectionOptions.socketTimeoutMS}ms`);

		// Test multiple concurrent operations to utilize connection pool
		console.log("\n2. Testing concurrent database operations...");

		const testPromises = [];
		for (let i = 0; i < 8; i++) {
			testPromises.push(mongoose.connection.db.admin().ping());
		}

		const results = await Promise.all(testPromises);
		console.log(
			`✅ Successfully executed ${results.length} concurrent operations`
		);

		// Get connection pool stats
		console.log("\n3. Connection pool information:");
		const adminDb = mongoose.connection.db.admin();
		const serverStatus = await adminDb.serverStatus();

		if (serverStatus.connections) {
			console.log(`Current connections: ${serverStatus.connections.current}`);
			console.log(
				`Available connections: ${serverStatus.connections.available}`
			);
		}

		console.log("\n🎉 Connection pooling test completed successfully!");
	} catch (error) {
		console.error("❌ Connection pooling test failed:", error.message);
	} finally {
		await mongoose.connection.close();
		console.log("✅ Connection closed");
	}
}

testConnectionPooling();

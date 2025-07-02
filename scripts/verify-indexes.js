import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

// Load environment variables
dotenv.config();

// Import models to ensure indexes are defined
import User from "../server/models/user.js";
import Product from "../server/models/product.js";
import Order from "../server/models/order.js";
import PromoCode from "../server/models/promoCode.js";

async function verifyIndexes() {
	try {
		console.log("🔍 Database Index Verification Tool".cyan.bold);
		console.log("=".repeat(50));

		// Connect to MongoDB
		console.log("\n📡 Connecting to MongoDB...".yellow);
		await mongoose.connect(process.env.MONGO_URI);
		console.log("✅ Connected to MongoDB".green);

		const db = mongoose.connection.db;

		// Check indexes for each collection
		await checkCollectionIndexes("users", User);
		await checkCollectionIndexes("products", Product);
		await checkCollectionIndexes("orders", Order);
		await checkCollectionIndexes("promocodes", PromoCode);

		// Performance test
		await performanceTest();

		console.log("\n🎉 Index verification complete!".green.bold);
	} catch (error) {
		console.error("❌ Error:", error.message.red);
	} finally {
		await mongoose.disconnect();
		console.log("\n📡 Disconnected from MongoDB".yellow);
	}
}

async function checkCollectionIndexes(collectionName, model) {
	console.log(
		`\n📊 Checking indexes for ${collectionName.toUpperCase()} collection:`.cyan
			.bold
	);
	console.log("-".repeat(40));

	try {
		const collection = mongoose.connection.db.collection(collectionName);
		const indexes = await collection.listIndexes().toArray();

		console.log(`Found ${indexes.length} indexes:`.green);

		indexes.forEach((index, i) => {
			console.log(`${i + 1}. ${JSON.stringify(index.key)}`.white);
			if (index.name !== "_id_") {
				console.log(`   Name: ${index.name}`.gray);
				if (index.unique) console.log(`   Type: UNIQUE`.blue);
				if (index.background) console.log(`   Built: Background`.gray);
			}
		});

		// Check if our custom indexes exist
		await verifyCustomIndexes(collectionName, indexes);
	} catch (error) {
		console.error(`❌ Error checking ${collectionName}:`, error.message.red);
	}
}

async function verifyCustomIndexes(collectionName, indexes) {
	const expectedIndexes = {
		users: ["email_1", "isAdmin_1", "createdAt_-1"],
		products: [
			"name_text",
			"rating_-1",
			"category_1",
			"brand_1",
			"price_1",
			"countInStock_1"
		],
		orders: ["user_1", "isPaid_1", "isDelivered_1", "createdAt_-1"],
		promocodes: ["code_1", "expiresAt_1"]
	};

	const expected = expectedIndexes[collectionName] || [];
	const existing = indexes.map((idx) => idx.name);

	console.log("\n🔍 Custom Index Status:".yellow);

	expected.forEach((expectedIndex) => {
		if (existing.includes(expectedIndex)) {
			console.log(`✅ ${expectedIndex}`.green);
		} else {
			console.log(`❌ ${expectedIndex} (missing)`.red);
		}
	});
}

async function performanceTest() {
	console.log("\n⚡ Performance Testing...".cyan.bold);
	console.log("-".repeat(40));

	try {
		// Test 1: User email lookup
		console.log("\n1. Testing User Email Lookup:".yellow);
		const startTime1 = Date.now();
		await User.findOne({ email: "admin@email.com" });
		const endTime1 = Date.now();
		console.log(`   Query time: ${endTime1 - startTime1}ms`.green);

		// Test 2: Product search
		console.log("\n2. Testing Product Text Search:".yellow);
		const startTime2 = Date.now();
		await Product.find({ $text: { $search: "phone" } }).limit(5);
		const endTime2 = Date.now();
		console.log(`   Query time: ${endTime2 - startTime2}ms`.green);

		// Test 3: Top products by rating
		console.log("\n3. Testing Top Products Query:".yellow);
		const startTime3 = Date.now();
		await Product.find({}).sort({ rating: -1 }).limit(3);
		const endTime3 = Date.now();
		console.log(`   Query time: ${endTime3 - startTime3}ms`.green);

		// Test 4: User orders
		console.log("\n4. Testing User Orders Query:".yellow);
		const startTime4 = Date.now();
		const users = await User.find({}).limit(1);
		if (users.length > 0) {
			await Order.find({ user: users[0]._id }).sort({ createdAt: -1 });
		}
		const endTime4 = Date.now();
		console.log(`   Query time: ${endTime4 - startTime4}ms`.green);

		// Test 5: Promo code lookup
		console.log("\n5. Testing Promo Code Lookup:".yellow);
		const startTime5 = Date.now();
		await PromoCode.findOne({ code: "TESTCODE" });
		const endTime5 = Date.now();
		console.log(`   Query time: ${endTime5 - startTime5}ms`.green);
	} catch (error) {
		console.error("❌ Performance test error:", error.message.red);
	}
}

async function queryExplain() {
	console.log("\n📈 Query Execution Plans:".cyan.bold);
	console.log("-".repeat(40));

	try {
		// Explain product search query
		console.log("\n🔍 Product Search Query Plan:".yellow);
		const explain = await Product.find({
			name: { $regex: "phone", $options: "i" }
		}).explain();
		console.log(`Execution Stats:`.green);
		console.log(
			`- Documents Examined: ${explain.executionStats.totalDocsExamined}`
		);
		console.log(
			`- Documents Returned: ${explain.executionStats.totalDocsReturned}`
		);
		console.log(
			`- Execution Time: ${explain.executionStats.executionTimeMillis}ms`
		);
		console.log(
			`- Index Used: ${explain.executionStats.indexesUsed ? "Yes" : "No"}`
		);
	} catch (error) {
		console.error("❌ Query explanation error:", error.message.red);
	}
}

async function showStatistics() {
	console.log("\n📊 Database Statistics:".cyan.bold);
	console.log("-".repeat(40));

	try {
		const collections = ["users", "products", "orders", "promocodes"];

		for (const collectionName of collections) {
			const collection = mongoose.connection.db.collection(collectionName);
			const stats = await collection.stats();

			console.log(`\n${collectionName.toUpperCase()}:`.yellow);
			console.log(`- Documents: ${stats.count}`);
			console.log(`- Size: ${(stats.size / 1024).toFixed(2)} KB`);
			console.log(`- Indexes: ${stats.nindexes}`);
			console.log(
				`- Index Size: ${(stats.totalIndexSize / 1024).toFixed(2)} KB`
			);
		}
	} catch (error) {
		console.error("❌ Statistics error:", error.message.red);
	}
}

// Usage instructions
console.log("Database Index Verification Tool".cyan.bold);
console.log("Usage: node verify-indexes.js [option]".yellow);
console.log("\nOptions:");
console.log("  (no option)  - Full verification and performance test");
console.log("  --explain    - Show query execution plans");
console.log("  --stats      - Show database statistics");

const arg = process.argv[2];

if (arg === "--explain") {
	mongoose
		.connect(process.env.MONGO_URI)
		.then(queryExplain)
		.then(() => mongoose.disconnect())
		.catch(console.error);
} else if (arg === "--stats") {
	mongoose
		.connect(process.env.MONGO_URI)
		.then(showStatistics)
		.then(() => mongoose.disconnect())
		.catch(console.error);
} else {
	verifyIndexes();
}

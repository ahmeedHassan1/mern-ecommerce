console.log("🧪 Simple Debug Test");

async function testSimple() {
	console.log("Testing basic functionality...");

	// Test basic promise
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log("✅ Async test completed");
			resolve();
		}, 100);
	});
}

console.log("Starting test...");
testSimple()
	.then(() => {
		console.log("✅ All tests completed");
	})
	.catch((error) => {
		console.error("❌ Error:", error);
	});

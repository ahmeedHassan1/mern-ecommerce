import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Test JWT Refresh Token implementation
async function testRefreshTokens() {
	console.log("🔄 Testing JWT Refresh Token Implementation");
	console.log("=".repeat(50));

	try {
		// Step 1: Login or register test user
		console.log("\n1. Logging in test user...");

		let loginResponse;
		try {
			// Try to login with existing user
			loginResponse = await axios.post(`${BASE_URL}/users/auth`, {
				email: "refreshtest@example.com",
				password: "Password123"
			});
			console.log("✅ Logged in with existing user");
		} catch (loginError) {
			// User doesn't exist, register new user
			console.log("User doesn't exist, registering new user...");
			loginResponse = await axios.post(`${BASE_URL}/users`, {
				name: "Refresh Test User",
				email: "refreshtest@example.com",
				password: "Password123"
			});
			console.log("✅ User registered and logged in successfully");
		}

		// Extract cookies from login/registration response
		const cookies = loginResponse.headers["set-cookie"];
		const cookieHeader = cookies ? cookies.join("; ") : "";

		// Step 2: Check token info
		console.log("\n2. Checking token info...");
		const tokenInfoResponse = await axios.get(`${BASE_URL}/auth/token-info`, {
			headers: { Cookie: cookieHeader }
		});

		console.log("Token info:", tokenInfoResponse.data);

		// Step 3: Wait a moment and refresh token
		console.log("\n3. Testing token refresh...");
		const refreshResponse = await axios.post(
			`${BASE_URL}/auth/refresh`,
			{},
			{
				headers: { Cookie: cookieHeader }
			}
		);

		if (refreshResponse.status === 200) {
			console.log("✅ Token refreshed successfully");
			console.log(
				"New token received for user:",
				refreshResponse.data.user.name
			);
		}

		// Step 4: Test logout from current device
		console.log("\n4. Testing logout from current device...");
		const logoutResponse = await axios.post(
			`${BASE_URL}/auth/logout`,
			{},
			{
				headers: { Cookie: cookieHeader }
			}
		);

		if (logoutResponse.status === 200) {
			console.log("✅ Logged out successfully");
		}

		// Step 5: Try to use refresh token after logout (should fail)
		console.log("\n5. Testing refresh after logout (should fail)...");
		try {
			await axios.post(
				`${BASE_URL}/auth/refresh`,
				{},
				{
					headers: { Cookie: cookieHeader }
				}
			);
			console.log("❌ Refresh should have failed after logout");
		} catch (error) {
			if (error.response && error.response.status === 401) {
				console.log("✅ Refresh correctly failed after logout");
			} else {
				console.log("❌ Unexpected error:", error.message);
			}
		}

		// Step 6: Login again to test logout all
		console.log("\n6. Logging in again to test logout all...");
		const secondLoginResponse = await axios.post(`${BASE_URL}/users/auth`, {
			email: "refreshtest@example.com",
			password: "Password123"
		});

		if (secondLoginResponse.status === 200) {
			console.log("✅ Logged in successfully");
		}

		const newCookies = secondLoginResponse.headers["set-cookie"];
		const newCookieHeader = newCookies ? newCookies.join("; ") : "";

		// Step 7: Test logout from all devices
		console.log("\n7. Testing logout from all devices...");
		const logoutAllResponse = await axios.post(
			`${BASE_URL}/auth/logout-all`,
			{},
			{
				headers: { Cookie: newCookieHeader }
			}
		);

		if (logoutAllResponse.status === 200) {
			console.log("✅ Logged out from all devices successfully");
		}

		console.log("\n🎉 JWT Refresh Token tests completed!");
	} catch (error) {
		console.error(
			"❌ Test failed:",
			error.response?.data?.message || error.message
		);
	}
}

// Test multiple sessions functionality
async function testMultipleSessions() {
	console.log("\n🔄 Testing Multiple Sessions Management");
	console.log("=".repeat(50));

	try {
		// Login multiple times to simulate multiple devices
		const sessions = [];

		for (let i = 1; i <= 3; i++) {
			console.log(`\n${i}. Creating session ${i}...`);

			const sessionLoginResponse = await axios.post(`${BASE_URL}/users/auth`, {
				email: "refreshtest@example.com",
				password: "Password123"
			});

			if (sessionLoginResponse.status === 200) {
				const cookies = sessionLoginResponse.headers["set-cookie"];
				sessions.push(cookies ? cookies.join("; ") : "");
				console.log(`✅ Session ${i} created`);
			}
		}

		// Check token info for first session
		console.log("\n4. Checking active sessions...");
		const tokenInfoResponse = await axios.get(`${BASE_URL}/auth/token-info`, {
			headers: { Cookie: sessions[0] }
		});

		console.log(`Active tokens: ${tokenInfoResponse.data.activeTokens}`);

		// Logout from one session
		console.log("\n5. Logging out from session 1...");
		await axios.post(
			`${BASE_URL}/auth/logout`,
			{},
			{
				headers: { Cookie: sessions[0] }
			}
		);

		// Check remaining sessions
		const updatedTokenInfo = await axios.get(`${BASE_URL}/auth/token-info`, {
			headers: { Cookie: sessions[1] }
		});

		console.log(
			`Remaining active tokens: ${updatedTokenInfo.data.activeTokens}`
		);

		console.log("\n🎉 Multiple sessions tests completed!");
	} catch (error) {
		console.error(
			"❌ Multiple sessions test failed:",
			error.response?.data?.message || error.message
		);
	}
}

// Run tests
async function runTests() {
	console.log("🧪 JWT Refresh Token Test Suite");
	console.log("=".repeat(50));
	console.log("Testing refresh token functionality...\n");

	// Check if server is accessible
	try {
		console.log("🔍 Checking server connection...");
		await axios.get(`${BASE_URL.replace("/api", "")}/`);
		console.log("✅ Server is accessible\n");
	} catch (error) {
		console.error(
			"❌ Cannot connect to server. Please ensure the server is running on port 5000"
		);
		console.error("Start server with: npm run server\n");
		return;
	}

	await testRefreshTokens();
	await testMultipleSessions();

	console.log("\n📊 Test Summary");
	console.log("=".repeat(50));
	console.log("- JWT Refresh Token implementation");
	console.log("- Multiple device session management");
	console.log("- Secure token refresh mechanism");
	console.log("- Proper logout functionality");
}

// Run if called directly
runTests().catch(console.error);

export { testRefreshTokens, testMultipleSessions };

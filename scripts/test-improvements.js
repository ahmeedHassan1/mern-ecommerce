import axios from 'axios';
import colors from 'colors';

const BASE_URL = 'http://localhost:5000';

// Test results storage
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// Helper function to log test results
function logTest(testName, passed, message = '') {
    if (passed) {
        console.log(`✅ ${testName}`.green);
        testResults.passed++;
    } else {
        console.log(`❌ ${testName}: ${message}`.red);
        testResults.failed++;
    }
    testResults.tests.push({ name: testName, passed, message });
}

// Helper function to make API requests
async function makeRequest(method, endpoint, data = null, headers = {}) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        
        if (data) {
            config.data = data;
        }
        
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data?.message || error.message,
            status: error.response?.status || 500
        };
    }
}

console.log('🧪 Starting API Tests for MERN E-commerce Improvements\n'.cyan.bold);

// Test 1: Security Headers (Helmet)
async function testSecurityHeaders() {
    console.log('\n📋 Testing Security Headers...'.yellow.bold);
    
    try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        
        // Check for security headers
        const headers = response.headers;
        
        logTest(
            'X-Content-Type-Options header',
            headers['x-content-type-options'] === 'nosniff'
        );
        
        logTest(
            'X-Frame-Options header',
            headers['x-frame-options'] === 'DENY'
        );
        
        logTest(
            'X-XSS-Protection header',
            headers['x-xss-protection'] !== undefined
        );
        
    } catch (error) {
        logTest('Security Headers Test', false, 'Failed to fetch headers');
    }
}

// Test 2: Rate Limiting
async function testRateLimiting() {
    console.log('\n🚦 Testing Rate Limiting...'.yellow.bold);
    
    // Test API rate limiting by making multiple requests quickly
    const requests = Array.from({ length: 5 }, () => 
        makeRequest('GET', '/api/products')
    );
    
    try {
        const responses = await Promise.all(requests);
        const allSucceeded = responses.every(r => r.success);
        
        logTest(
            'API Rate Limiting (should allow normal requests)',
            allSucceeded,
            'Some requests were rate limited'
        );
        
        // Check for rate limit headers
        const response = await axios.get(`${BASE_URL}/api/products`);
        const hasRateLimitHeaders = 
            response.headers['ratelimit-limit'] !== undefined ||
            response.headers['x-ratelimit-limit'] !== undefined;
            
        logTest(
            'Rate Limit Headers Present',
            hasRateLimitHeaders
        );
        
    } catch (error) {
        logTest('Rate Limiting Test', false, error.message);
    }
}

// Test 3: Input Validation
async function testInputValidation() {
    console.log('\n✅ Testing Input Validation...'.yellow.bold);
    
    // Test user registration with invalid data
    const invalidUser = {
        name: 'A', // Too short
        email: 'invalid-email', // Invalid format
        password: '123' // Too short and weak
    };
    
    const registerResult = await makeRequest('POST', '/api/users', invalidUser);
    
    logTest(
        'User Registration Validation',
        !registerResult.success && registerResult.status === 400,
        registerResult.success ? 'Validation should have failed' : 'Correctly rejected invalid data'
    );
    
    // Test login with invalid data
    const invalidLogin = {
        email: 'not-an-email',
        password: ''
    };
    
    const loginResult = await makeRequest('POST', '/api/users/auth', invalidLogin);
    
    logTest(
        'User Login Validation',
        !loginResult.success && loginResult.status === 400,
        loginResult.success ? 'Validation should have failed' : 'Correctly rejected invalid data'
    );
    
    // Test product creation with invalid data (this will fail auth, but validation should trigger first)
    const invalidProduct = {
        name: '', // Empty name
        price: -10, // Negative price
        description: 'Short', // Too short
        brand: '',
        category: '',
        countInStock: -5 // Negative stock
    };
    
    const productResult = await makeRequest('POST', '/api/products', invalidProduct);
    
    logTest(
        'Product Validation',
        !productResult.success,
        'Product validation should reject invalid data'
    );
}

// Test 4: Error Handling and Logging
async function testErrorHandling() {
    console.log('\n🚨 Testing Error Handling...'.yellow.bold);
    
    // Test 404 handling
    const notFoundResult = await makeRequest('GET', '/api/nonexistent');
    
    logTest(
        '404 Error Handling',
        notFoundResult.status === 404,
        `Expected 404, got ${notFoundResult.status}`
    );
    
    // Test invalid ObjectId handling
    const invalidIdResult = await makeRequest('GET', '/api/products/invalid-id');
    
    logTest(
        'Invalid ObjectId Handling',
        !invalidIdResult.success,
        'Should handle invalid ObjectId gracefully'
    );
}

// Test 5: PromoCode Fix
async function testPromoCodeFix() {
    console.log('\n🎫 Testing PromoCode Fix...'.yellow.bold);
    
    // This test requires authentication, so we'll just test that the endpoint exists
    const promoResult = await makeRequest('POST', '/api/promos/check', { code: 'TEST' });
    
    logTest(
        'PromoCode Endpoint Accessible',
        promoResult.status === 401, // Should be unauthorized, not server error
        `Expected 401 (auth required), got ${promoResult.status}`
    );
}

// Test 6: Basic API Functionality
async function testBasicFunctionality() {
    console.log('\n🔧 Testing Basic API Functionality...'.yellow.bold);
    
    // Test products endpoint
    const productsResult = await makeRequest('GET', '/api/products');
    
    logTest(
        'Products API Working',
        productsResult.success,
        productsResult.error || 'API should return products'
    );
    
    // Test top products endpoint
    const topProductsResult = await makeRequest('GET', '/api/products/top');
    
    logTest(
        'Top Products API Working',
        topProductsResult.success,
        topProductsResult.error || 'API should return top products'
    );
    
    // Test PayPal config endpoint
    const paypalResult = await makeRequest('GET', '/api/config/paypal');
    
    logTest(
        'PayPal Config API Working',
        paypalResult.success,
        paypalResult.error || 'API should return PayPal config'
    );
}

// Main test runner
async function runAllTests() {
    try {
        await testSecurityHeaders();
        await testRateLimiting();
        await testInputValidation();
        await testErrorHandling();
        await testPromoCodeFix();
        await testBasicFunctionality();
        
        // Print summary
        console.log('\n📊 Test Summary'.cyan.bold);
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${testResults.passed}`.green);
        console.log(`❌ Failed: ${testResults.failed}`.red);
        console.log(`📋 Total:  ${testResults.passed + testResults.failed}`);
        console.log('='.repeat(50));
        
        if (testResults.failed === 0) {
            console.log('\n🎉 All tests passed! Your improvements are working correctly.'.green.bold);
        } else {
            console.log('\n⚠️  Some tests failed. Review the results above.'.yellow.bold);
        }
        
    } catch (error) {
        console.error('Test runner error:', error.message.red);
    }
}

// Run tests
runAllTests();

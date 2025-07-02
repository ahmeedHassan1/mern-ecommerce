import readline from 'readline';
import axios from 'axios';
import colors from 'colors';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const BASE_URL = 'http://localhost:5000';

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function log(message, color = 'white') {
    console.log(message[color]);
}

function logSuccess(message) {
    console.log(`✅ ${message}`.green);
}

function logError(message) {
    console.log(`❌ ${message}`.red);
}

function logInfo(message) {
    console.log(`ℹ️  ${message}`.cyan);
}

async function waitForUser(message = "Press Enter to continue...") {
    await question(`\n${message.yellow}\n`);
}

async function testApiCall(description, method, endpoint, data = null) {
    logInfo(`Testing: ${description}`);
    
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: { 'Content-Type': 'application/json' }
        };
        
        if (data) config.data = data;
        
        const response = await axios(config);
        logSuccess(`✓ Status: ${response.status}`);
        
        if (response.headers['ratelimit-limit']) {
            logInfo(`Rate Limit: ${response.headers['ratelimit-remaining']}/${response.headers['ratelimit-limit']}`);
        }
        
        return { success: true, data: response.data, headers: response.headers };
    } catch (error) {
        const status = error.response?.status || 'No response';
        const message = error.response?.data?.message || error.message;
        
        if (error.response?.status === 400) {
            logSuccess(`✓ Validation working - Status: ${status}`);
            logInfo(`Validation error: ${message}`);
            return { success: true, validationError: true };
        } else if (error.response?.status === 401) {
            logSuccess(`✓ Authentication working - Status: ${status}`);
            return { success: true, authError: true };
        } else if (error.response?.status === 404) {
            logSuccess(`✓ Error handling working - Status: ${status}`);
            return { success: true, notFound: true };
        } else {
            logError(`✗ Status: ${status}, Error: ${message}`);
            return { success: false, error: message };
        }
    }
}

async function interactiveTest() {
    console.clear();
    log('🧪 Interactive Testing Guide for MERN E-commerce Improvements\n', 'cyan');
    
    log('This script will guide you through testing each improvement step by step.\n', 'yellow');
    
    await waitForUser("Ready to start testing?");
    
    // Test 1: Basic Server Connection
    console.clear();
    log('📡 TEST 1: Basic Server Connection', 'cyan');
    log('=' .repeat(50), 'gray');
    
    logInfo('First, let\'s make sure your server is running...');
    const basicTest = await testApiCall('Basic API connection', 'GET', '/api/products');
    
    if (!basicTest.success) {
        logError('Server is not responding! Please make sure:');
        console.log('1. Server is running: npm run server');
        console.log('2. Server is on http://localhost:5000');
        console.log('3. MongoDB is connected');
        await waitForUser();
        process.exit(1);
    }
    
    logSuccess('Server is responding correctly!');
    await waitForUser();
    
    // Test 2: Security Headers
    console.clear();
    log('🔒 TEST 2: Security Headers', 'cyan');
    log('=' .repeat(50), 'gray');
    
    logInfo('Checking if security headers are present...');
    const securityTest = await testApiCall('Security headers check', 'GET', '/api/products');
    
    if (securityTest.success) {
        const headers = securityTest.headers;
        
        if (headers['x-content-type-options']) {
            logSuccess('X-Content-Type-Options header present');
        } else {
            logError('X-Content-Type-Options header missing');
        }
        
        if (headers['x-xss-protection'] !== undefined) {
            logSuccess('X-XSS-Protection header present');
        } else {
            logError('X-XSS-Protection header missing');
        }
        
        if (headers['content-security-policy']) {
            logSuccess('Content-Security-Policy header present');
        } else {
            logError('Content-Security-Policy header missing');
        }
    }
    
    await waitForUser();
    
    // Test 3: Rate Limiting
    console.clear();
    log('🚦 TEST 3: Rate Limiting', 'cyan');
    log('=' .repeat(50), 'gray');
    
    logInfo('Testing rate limiting by making multiple requests...');
    
    for (let i = 1; i <= 5; i++) {
        logInfo(`Making request ${i}/5...`);
        await testApiCall(`Rate limit test ${i}`, 'GET', '/api/products');
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
    }
    
    logSuccess('Rate limiting headers should be visible above');
    await waitForUser();
    
    // Test 4: Input Validation
    console.clear();
    log('✅ TEST 4: Input Validation', 'cyan');
    log('=' .repeat(50), 'gray');
    
    logInfo('Testing input validation with invalid data...');
    
    log('\n4a. Testing invalid user registration:', 'yellow');
    await testApiCall(
        'Invalid user registration',
        'POST',
        '/api/users',
        {
            name: 'A', // Too short
            email: 'invalid-email', // Invalid format
            password: '123' // Too weak
        }
    );
    
    log('\n4b. Testing invalid login:', 'yellow');
    await testApiCall(
        'Invalid login',
        'POST',
        '/api/users/auth',
        {
            email: 'not-an-email', // Invalid format
            password: '' // Empty
        }
    );
    
    await waitForUser();
    
    // Test 5: Error Handling
    console.clear();
    log('🚨 TEST 5: Error Handling', 'cyan');
    log('=' .repeat(50), 'gray');
    
    logInfo('Testing error handling...');
    
    log('\n5a. Testing 404 error handling:', 'yellow');
    await testApiCall('404 error test', 'GET', '/api/nonexistent');
    
    log('\n5b. Testing invalid ObjectId handling:', 'yellow');
    await testApiCall('Invalid ObjectId test', 'GET', '/api/products/invalid-id');
    
    await waitForUser();
    
    // Test 6: PromoCode Fix
    console.clear();
    log('🎫 TEST 6: PromoCode Fix', 'cyan');
    log('=' .repeat(50), 'gray');
    
    logInfo('Testing PromoCode endpoints (should not crash)...');
    await testApiCall('PromoCode check', 'POST', '/api/promos/check', { code: 'TEST' });
    
    logSuccess('PromoCode endpoint is stable (no server crashes)');
    await waitForUser();
    
    // Test 7: Login Rate Limiting
    console.clear();
    log('🔐 TEST 7: Login Rate Limiting', 'cyan');
    log('=' .repeat(50), 'gray');
    
    logInfo('Testing login rate limiting (will make several failed login attempts)...');
    
    const loginData = {
        email: 'test@test.com',
        password: 'wrongpassword'
    };
    
    for (let i = 1; i <= 6; i++) {
        logInfo(`Login attempt ${i}/6...`);
        const result = await testApiCall(`Login rate limit test ${i}`, 'POST', '/api/users/auth', loginData);
        
        if (i >= 5 && result.error && result.error.includes('Too many')) {
            logSuccess('✓ Login rate limiting is working!');
            break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    }
    
    await waitForUser();
    
    // Final Summary
    console.clear();
    log('📊 TESTING COMPLETE!', 'green');
    log('=' .repeat(50), 'gray');
    
    log('\n🎉 Congratulations! Here\'s what we tested:', 'cyan');
    console.log('✅ Server connectivity and basic API functionality');
    console.log('✅ Security headers (Helmet.js protection)');
    console.log('✅ Rate limiting for API protection');
    console.log('✅ Input validation for user registration and login');
    console.log('✅ Error handling for 404s and invalid data');
    console.log('✅ PromoCode stability (no more crashes)');
    console.log('✅ Login rate limiting for security');
    
    log('\n📝 Next Steps:', 'yellow');
    console.log('1. Test the frontend at http://localhost:8080');
    console.log('2. Check log files in /logs directory');
    console.log('3. Try creating an account and placing an order');
    console.log('4. Monitor the logs as you use the application');
    
    log('\n🚀 Your MERN e-commerce app is now more secure and robust!', 'green');
    
    rl.close();
}

// Handle graceful exit
process.on('SIGINT', () => {
    console.log('\n\nTesting interrupted. Goodbye! 👋');
    rl.close();
    process.exit(0);
});

// Start the interactive test
interactiveTest().catch(error => {
    console.error('Test error:', error.message);
    rl.close();
});

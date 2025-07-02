# MERN E-commerce Project

> A comprehensive, secure, and scalable full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). Features enterprise-grade security, performance optimizations, comprehensive API documentation, and production-ready infrastructure.

<img src="./client/public/images/screens.png">

## 🎯 **Project Overview**

This is a complete e-commerce platform designed for modern online retail, featuring:
- 🔒 **Enterprise Security** - JWT refresh tokens, rate limiting, input validation, security headers
- 📚 **Interactive API Documentation** - Swagger UI with comprehensive endpoint coverage
- ⚡ **Performance Optimized** - Strategic database indexing, query optimization, connection pooling
- 📱 **Responsive Design** - Mobile-first approach with React Bootstrap
- 🛡️ **Production Ready** - Security hardened with structured logging and error handling
- 📊 **Monitoring & Analytics** - Winston logging, request tracking, performance metrics

## 📚 **Documentation**

- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Complete REST API reference
- **[Interactive API Docs](http://localhost:5000/api-docs)** - Swagger UI (when server running)
- **[JWT Refresh Tokens Guide](./docs/JWT_REFRESH_TOKENS.md)** - Security implementation details
- **[Postman Collection](./docs/MERN-Ecommerce-API.postman_collection.json)** - Ready-to-use API testing

## 🧪 **Testing Infrastructure**

This project includes comprehensive testing tools and scripts:

- **[scripts/test-improvements.js](./scripts/test-improvements.js)** - Automated testing for security, validation, and rate limiting
- **[scripts/interactive-test.js](./scripts/interactive-test.js)** - Interactive CLI tool for manual testing
- **[scripts/test-refresh-tokens.js](./scripts/test-refresh-tokens.js)** - JWT refresh token system testing
- **[scripts/verify-indexes.js](./scripts/verify-indexes.js)** - Database index verification and benchmarking

Run tests with:
```bash
npm run test:security      # Test security features
npm run test:interactive   # Interactive testing tool
npm run test:refresh       # Test JWT refresh tokens
npm run test:pooling       # Test MongoDB connection pooling
npm run verify:indexes     # Verify database indexes
```

## ✨ **Core Features**

### **E-commerce Functionality**
- 🛒 **Full-featured shopping cart** with persistent state
- 🏷️ **Advanced promo codes system** with usage tracking
- ⭐ **Product reviews and ratings** with user verification
- 🎠 **Top products carousel** with dynamic content
- 📄 **Product pagination** with search and filtering
- 🔍 **Real-time product search** with text indexing
- 👤 **User profiles** with complete order history
- 💳 **Comprehensive checkout** (shipping, payment, confirmation)
- 💰 **PayPal & credit card integration** with secure processing

### **Admin Management**
- 📦 **Product management** - CRUD operations with image upload
- 👥 **User management** - Account control and role assignment
- 🏷️ **Promo code management** - Create, edit, track usage
- 📋 **Order management** - Status updates and delivery tracking

### **Security Features** 🔒
- 🔐 **JWT Refresh Tokens** - Short-lived access tokens (15min) with secure refresh tokens (7 days)
- 🛡️ **Rate Limiting** - Global (200 req/15min) and route-specific limits with Redis-ready architecture
- ✅ **Input Validation** - Comprehensive request validation using express-validator
- � **Security Headers** - Helmet.js protection against common vulnerabilities
- � **Structured Logging** - Winston-based error, access, and security event logging
- 🌐 **CORS Configuration** - Secure cross-origin request handling with credential support
- 🍪 **Secure Cookies** - HttpOnly, Secure, SameSite cookies for token management
- 🔑 **Session Management** - Multi-device logout, token blacklisting, secure refresh flow
- 🛡️ **Error Handling** - Secure error responses without information leakage

### **Performance Optimizations** ⚡
- 📈 **Strategic Database Indexing** - Compound and text indexes for optimal query performance
  - User indexes: email (unique), email+password, text search
  - Product indexes: category+price, rating, createdAt, text search on name+description
  - Order indexes: user+createdAt, isPaid+paidAt, compound filtering
  - PromoCode indexes: code (unique), active+validUntil, usage tracking
- 🔄 **Connection Pooling** - Configured MongoDB connection pool (Max: 10, Min: 5) with optimized timeouts
- 📱 **Index Verification** - Built-in tools for monitoring index performance and usage
- ⚡ **Response Caching** - Strategic caching headers and ETags

### **Monitoring & Logging** 📊
- � **Request Logging** - Morgan HTTP request logging with custom formats
- 🐛 **Error Tracking** - Structured error logging with stack traces and context
- 📈 **Performance Monitoring** - Request timing and database query analysis
- 🔍 **Security Event Logging** - Login attempts, rate limiting, validation failures
- 📁 **Log Management** - Organized log files with rotation and archiving ready

## 🛠️ **Technologies & Dependencies**

### **Frontend Stack**
- **React 18** - Modern React with hooks and concurrent features
- **Redux Toolkit** - State management with RTK Query
- **React Bootstrap** - Responsive UI components
- **React Router** - Client-side routing
- **Vite** - Fast build tool and development server

### **Backend Stack**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **bcrypt.js** - Password hashing

### **Security & Validation**
- **Helmet** - Security headers middleware
- **express-rate-limit** - Rate limiting middleware
- **express-validator** - Request validation
- **cors** - Cross-origin resource sharing
- **cookie-parser** - Cookie handling

### **Development & Testing**
- **Winston** - Structured logging with multiple transports
- **Morgan** - HTTP request logging middleware
- **Swagger/OpenAPI** - Interactive API documentation
- **express-validator** - Request validation middleware
- **Nodemon** - Development auto-restart
- **Concurrently** - Run multiple commands
- **Custom Test Suite** - Automated security and performance testing

## 📊 **API Endpoints Overview**

### **Authentication & Users** (`/api/users`, `/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users` | Register new user | Public |
| POST | `/users/auth` | Login user | Public |
| POST | `/users/logout` | Logout user | Private |
| GET | `/users/profile` | Get user profile | Private |
| PUT | `/users/profile` | Update profile | Private |
| GET | `/users` | Get all users | Admin |
| POST | `/auth/refresh` | Refresh access token | Refresh Token |
| POST | `/auth/logout-all` | Logout all devices | Private |

### **Products** (`/api/products`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Get products (paginated) | Public |
| GET | `/products/top` | Get top rated products | Public |
| GET | `/products/:id` | Get product by ID | Public |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |
| POST | `/products/:id/reviews` | Add review | Private |

### **Orders** (`/api/orders`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Create new order | Private |
| GET | `/orders/mine` | Get user orders | Private |
| GET | `/orders/:id` | Get order by ID | Private |
| PUT | `/orders/:id/pay` | Update to paid | Private |
| PUT | `/orders/:id/deliver` | Mark as delivered | Admin |
| GET | `/orders` | Get all orders | Admin |

### **Promo Codes** (`/api/promos`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/promos/check` | Validate promo code | Private |
| POST | `/promos/use` | Apply promo code | Private |
| GET | `/promos` | Get all promo codes | Admin |
| POST | `/promos` | Create promo code | Admin |
| PUT | `/promos/:id` | Update promo code | Admin |
| DELETE | `/promos/:id` | Delete promo code | Admin |

## 🚀 **Quick Start**

- Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a PayPal account and obtain your `Client ID` - [PayPal Developer](https://developer.paypal.com/)

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_strong_jwt_secret_minimum_32_characters
JWT_REFRESH_SECRET=your_strong_refresh_secret_minimum_32_characters
PAYPAL_CLIENT_ID=your_paypal_client_id
PAGINATION_LIMIT=8
```

> **Security Note**: Use strong, randomly generated secrets for JWT tokens. Consider using different secrets for different environments.

## Installation & Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/mern-ecommerce.git
    cd mern-ecommerce
    ```

2. **Install server dependencies:**
    ```bash
    npm install
    ```

3. **Install client dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

4. **Set up environment variables:**
    ```bash
    cp example.env .env
    # Edit .env with your actual values
    ```

5. **Initialize the database:**
    ```bash
    npm run data:import
    ```

6. **Verify database indexes (optional):**
    ```bash
    npm run verify:indexes
    ```

## Development

### **Start Development Server**

1. **Run both client and server concurrently:**
    ```bash
    npm run dev
    ```

2. **Or run them separately:**
    ```bash
    # Terminal 1 - Backend (localhost:5000)
    npm run server
    
    # Terminal 2 - Frontend (localhost:8080)
    npm run client
    ```

3. **Access the application:**
    - Frontend: `http://localhost:8080`
    - Backend API: `http://localhost:5000`
    - API Documentation: `http://localhost:5000/api-docs`

### **Available Scripts**

```bash
# Development
npm run dev              # Run client and server concurrently
npm run server           # Start backend server with nodemon
npm run client           # Start frontend development server

# Testing
npm run test:security    # Test security features and validation
npm run test:interactive # Interactive testing tool
npm run test:refresh     # Test JWT refresh token system
npm run test:pooling     # Test MongoDB connection pooling
npm run verify:indexes   # Verify and benchmark database indexes

# Database
npm run data:import      # Seed database with sample data
npm run data:destroy     # Clear all data from database

# Production
npm run build            # Build client for production
npm start               # Start production server
```

## Testing

This project includes comprehensive testing infrastructure to ensure all features work correctly.

### **Automated Testing**

1. **Security and Validation Testing:**
    ```bash
    npm run test:security
    ```
    Tests rate limiting, input validation, authentication, and security headers.

2. **JWT Refresh Token Testing:**
    ```bash
    npm run test:refresh
    ```
    Tests token generation, refresh, expiration, and session management.

3. **Database Index Verification:**
    ```bash
    npm run verify:indexes
    ```
    Verifies all indexes exist and benchmarks query performance.

4. **Connection Pooling Testing:**
    ```bash
    npm run test:pooling
    ```
    Tests MongoDB connection pool configuration and concurrent operations.

### **Interactive Testing**

```bash
npm run test:interactive
```
Provides an interactive CLI tool for manual testing of all endpoints with real-time feedback.

### **API Documentation Testing**

1. **Swagger UI:** Visit `http://localhost:5000/api-docs` (when server is running)
2. **Postman Collection:** Import `docs/MERN-Ecommerce-API.postman_collection.json`

### **Test Users**

Default test accounts (after running `npm run data:import`):

```
Admin Account:
Email: admin@email.com
Password: 123456

Customer Accounts:
Email: john@email.com
Password: 123456

Email: jane@email.com
Password: 123456
```

## Production Deployment

### **Build for Production**

1. **Create optimized client build:**
    ```bash
    npm run build
    ```
    This creates a `client/dist` folder with production-ready static files.

2. **Start production server:**
    ```bash
    npm start
    ```

### **Environment Configuration**

For production deployment, ensure you:

1. **Set production environment variables:**
    ```env
    NODE_ENV=production
    MONGO_URI=your_production_mongodb_uri
    JWT_SECRET=strong_production_secret_32_chars_minimum
    JWT_REFRESH_SECRET=different_strong_secret_32_chars_minimum
    ```

2. **Configure CORS for your domain:**
    ```javascript
    // In server/index.js, update CORS configuration
    app.use(cors({
      origin: 'https://yourdomain.com',
      credentials: true
    }));
    ```

3. **Set up SSL/HTTPS** for secure cookie transmission

## Security Considerations

This project implements multiple security layers:

- **🔐 Authentication:** JWT tokens with refresh mechanism
- **🛡️ Authorization:** Role-based access control (User/Admin)
- **🔒 Input Validation:** All inputs validated and sanitized
- **🚫 Rate Limiting:** Prevents abuse and DDoS attacks
- **🍪 Secure Cookies:** HttpOnly, Secure, SameSite cookies
- **📊 Logging:** Security events and errors logged
- **🔧 Headers:** Security headers via Helmet.js

For production deployment, also consider:
- SSL/TLS certificates
- Environment variable security
- Database connection security
- Regular security updates

### Seed Database

You can use the following commands to seed the database with sample users, products, and promo codes:

```bash
# Import sample data
npm run data:import

# Clear all data
npm run data:destroy
```

The sample data includes:
- **Users:** Admin and customer accounts with different roles
- **Products:** Electronics with images, descriptions, and reviews
- **Promo Codes:** Various discount codes for testing

### Sample User Accounts

After importing data, you can log in with these accounts:

```
🔑 Admin Account (Full Access):
Email: admin@email.com
Password: 123456

👤 Customer Accounts:
Email: john@email.com
Password: 123456

Email: jane@email.com  
Password: 123456
```

## Project Structure

```
mern-ecommerce/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # Page components
│   │   ├── slices/         # Redux state management
│   │   └── utils/          # Helper functions
│   └── public/             # Static assets
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   └── config/             # Configuration files
├── scripts/                # Testing and utility scripts
├── docs/                   # Documentation files
└── logs/                   # Application logs (generated)
```

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Run the test suite:** `npm run test:security`
5. **Commit your changes:** `git commit -m 'Add amazing feature'`
6. **Push to the branch:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use meaningful commit messages

## Acknowledgments

- Built with the MERN stack (MongoDB, Express.js, React, Node.js)
- UI components from React Bootstrap
- Security implementations
- Performance optimizations based on Node.js best practices
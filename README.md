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
- 🔧 **Enhanced Validation** - Advanced password security and partial update support
- 📁 **Robust File Management** - Comprehensive upload handling with error recovery
- 🔍 **Advanced User Search** - Real-time user search for admin operations
- 🎫 **Smart Promo Management** - User-specific promo code assignment with searchable interface

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
- 📦 **Product management** - CRUD operations with enhanced image upload
- 👥 **User management** - Account control with advanced search functionality
- 🏷️ **Smart Promo Management** - User-specific targeting with searchable interface
- 📋 **Order management** - Status updates and delivery tracking
- 📁 **File Management** - Upload monitoring, verification, and cleanup tools
- 🔍 **Real-time Search** - Dynamic user lookup for promo assignment
- ✅ **Partial Updates** - Modify only the fields you want to change

### **Security Features** 🔒
- 🔐 **JWT Refresh Tokens** - Short-lived access tokens (15min) with secure refresh tokens (7 days)
- 🛡️ **Rate Limiting** - Global (200 req/15min) and route-specific limits with Redis-ready architecture
- ✅ **Advanced Input Validation** - Enhanced password requirements and smart partial updates
- 🔒 **Password Security** - Minimum 6 chars with uppercase, lowercase, and numbers
- 🎯 **Smart Field Updates** - Only validates and updates provided fields
- 🛡️ **Security Headers** - Helmet.js protection against common vulnerabilities
- 📊 **Structured Logging** - Winston-based error, access, and security event logging
- 🌐 **CORS Configuration** - Secure cross-origin request handling with credential support
- 🍪 **Secure Cookies** - HttpOnly, Secure, SameSite cookies for token management
- 🔑 **Session Management** - Multi-device logout, token blacklisting, secure refresh flow
- 🛡️ **Error Handling** - Secure error responses without information leakage
- 📁 **File Security** - Comprehensive upload validation and error handling

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

## 🔌 **API Endpoints**

### **Authentication & User Management**

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `POST` | `/api/users` | Register a new user | ❌ | ❌ |
| `POST` | `/api/users/auth` | Login user | ❌ | ❌ |
| `POST` | `/api/users/logout` | Logout user | ❌ | ❌ |
| `GET` | `/api/users/profile` | Get user profile | ✅ | ❌ |
| `PUT` | `/api/users/profile` | Update user profile | ✅ | ❌ |
| `GET` | `/api/users` | Get all users | ✅ | ✅ |
| `GET` | `/api/users/search` | Search users by name/email | ✅ | ✅ |
| `POST` | `/api/users/by-ids` | Get users by array of IDs | ✅ | ✅ |
| `GET` | `/api/users/:id` | Get user by ID | ✅ | ✅ |
| `PUT` | `/api/users/:id` | Update user by ID | ✅ | ✅ |
| `DELETE` | `/api/users/:id` | Delete user by ID | ✅ | ✅ |

### **JWT Token Management**

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `POST` | `/api/auth/refresh` | Refresh access token | ❌ | ❌ |
| `POST` | `/api/auth/logout` | Logout from current device | ✅ | ❌ |
| `POST` | `/api/auth/logout-all` | Logout from all devices | ✅ | ❌ |
| `GET` | `/api/auth/token-info` | Get current token info | ✅ | ❌ |

### **Products & Reviews**

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `GET` | `/api/products` | Get all products (with pagination & search) | ❌ | ❌ |
| `GET` | `/api/products/top` | Get top rated products | ❌ | ❌ |
| `GET` | `/api/products/:id` | Get product by ID | ❌ | ❌ |
| `POST` | `/api/products` | Create new product | ✅ | ✅ |
| `PUT` | `/api/products/:id` | Update product by ID | ✅ | ✅ |
| `DELETE` | `/api/products/:id` | Delete product by ID | ✅ | ✅ |
| `POST` | `/api/products/:id/reviews` | Create product review | ✅ | ❌ |

### **Orders & Payment**

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `POST` | `/api/orders` | Create new order | ✅ | ❌ |
| `GET` | `/api/orders` | Get all orders | ✅ | ✅ |
| `GET` | `/api/orders/mine` | Get current user's orders | ✅ | ❌ |
| `GET` | `/api/orders/:id` | Get order by ID | ✅ | ❌ |
| `PUT` | `/api/orders/:id/pay` | Update order to paid | ✅ | ❌ |
| `PUT` | `/api/orders/:id/deliver` | Update order to delivered | ✅ | ✅ |

### **Promo Codes**

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `GET` | `/api/promos` | Get all promo codes | ✅ | ✅ |
| `POST` | `/api/promos` | Create new promo code | ✅ | ✅ |
| `POST` | `/api/promos/check` | Check if promo code is valid | ✅ | ❌ |
| `POST` | `/api/promos/use` | Use a promo code | ✅ | ❌ |
| `GET` | `/api/promos/:id` | Get promo code by ID | ✅ | ✅ |
| `PUT` | `/api/promos/:id` | Update promo code by ID | ✅ | ✅ |
| `DELETE` | `/api/promos/:id` | Delete promo code by ID | ✅ | ✅ |

### **File Upload Management**

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| `POST` | `/api/upload` | Upload image file | ❌ | ❌ |
| `GET` | `/api/upload/check/:filename` | Check if file exists | ❌ | ❌ |
| `GET` | `/api/upload/list` | List all uploaded files | ❌ | ❌ |
| `DELETE` | `/api/upload/:filename` | Delete uploaded file | ❌ | ❌ |

### **API Features**

#### **Authentication & Security**
- **JWT Refresh Token System**: Short-lived access tokens (15min) with secure refresh tokens (7 days)
- **Rate Limiting**: Global and endpoint-specific limits with strict controls on sensitive operations
- **Password Requirements**: Minimum 6 characters with uppercase, lowercase, and numbers
- **Partial Updates**: Only validates and updates fields that are actually provided

#### **Search & Filtering**
- **Product Search**: Text search on product name and description with pagination
- **User Search**: Real-time search by name or email for admin operations
- **Order Filtering**: Filter orders by payment status, delivery status, and date ranges

#### **File Management**
- **Secure Upload**: Image validation with file type and size restrictions
- **File Verification**: Check file existence and metadata before operations
- **Upload Monitoring**: List all uploaded files with detailed information
- **Error Handling**: Comprehensive error responses for failed uploads

#### **Validation & Error Handling**
- **Input Validation**: Server-side validation using express-validator
- **Smart Updates**: Optional field validation that only applies to provided fields
- **Consistent Errors**: Structured JSON error responses across all endpoints
- **Security Validation**: Input sanitization and XSS protection

#### **Performance Features**
- **Database Indexing**: Strategic indexes on frequently queried fields
- **Pagination**: Efficient pagination for large datasets
- **Connection Pooling**: Optimized MongoDB connection management
- **Query Optimization**: Optimized database queries with proper field selection

## ✨ **Recent Improvements & Features**

### **🔐 Enhanced Security & Validation**
- **Strong Password Requirements**: Minimum 6 characters with uppercase, lowercase, and numbers
- **Smart Partial Updates**: Only validates and updates fields that are actually modified
- **Improved Validation Logic**: Uses `optional({ values: "falsy" })` for proper optional field handling
- **Secure File Upload**: Comprehensive error handling and file existence verification

### **📁 Advanced File Management**
- **Robust Upload System**: Enhanced error handling with detailed feedback
- **File Verification**: Real-time file existence checking via `/api/upload/check/:filename`
- **Upload Monitoring**: List and manage uploaded files via `/api/upload/list`
- **Graceful Error Handling**: Missing files return JSON responses instead of server crashes
- **File Cleanup**: Delete functionality via `/api/upload/:filename`

### **👥 Enhanced User Management**
- **Real-time User Search**: `/api/users/search` with name and email filtering
- **Batch User Retrieval**: `/api/users/by-ids` for efficient multi-user fetching
- **Searchable Admin Interface**: Dynamic user dropdown for promo code eligibility
- **Partial Profile Updates**: Update any combination of user fields independently

### **🎫 Smart Promo Code System**
- **User-Specific Targeting**: Assign promo codes to specific users
- **Searchable User Selection**: Real-time user search in admin promo interface
- **Usage Tracking**: Comprehensive promo code analytics and limits
- **Flexible Validation**: Improved expiry and usage validation logic

## 📋 **Changelog & Recent Updates**

### **Version 2.1.0 - Enhanced Security & User Management** (Current)

#### 🆕 **New Features**
- **Real-time User Search**: `/api/users/search` endpoint for dynamic user lookup
- **Batch User Retrieval**: `/api/users/by-ids` for efficient multi-user operations  
- **Enhanced File Management**: File verification, listing, and deletion endpoints
- **Smart Promo Interface**: Searchable user dropdown for promo code assignment
- **File Upload Monitoring**: Comprehensive upload status and error handling

#### ✅ **Improvements**
- **Enhanced Password Validation**: Strong password requirements with proper complexity rules
- **Smart Partial Updates**: Only validate and update fields that are actually provided
- **Improved Error Handling**: Better file upload error responses and recovery
- **Validation Logic**: Fixed optional field validation using `optional({ values: "falsy" })`
- **Admin UX**: Better user selection interface for promo code management

#### 🔧 **Technical Enhancements** 
- **Validation Middleware**: Improved handling of optional fields in updates
- **File System**: Robust upload directory management and error handling
- **Database Queries**: Optimized user search with text indexing
- **Error Responses**: Consistent JSON error formatting across all endpoints
- **Security**: Enhanced input validation and sanitization

#### 🐛 **Bug Fixes**
- Fixed partial update validation triggering on unchanged fields
- Improved file upload error handling and missing file responses
- Enhanced promo code validation logic for expiry and usage limits
- Better error messaging for validation failures

### **Migration Notes**
- Update any frontend code to handle new password requirements
- Test existing user update flows with new validation logic
- Update any scripts using file upload to handle new error responses

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
- **Password Validation**: Ensure new endpoints follow enhanced validation patterns
- **File Handling**: Implement proper error handling for file operations  
- **Partial Updates**: Use smart field validation for optional updates
- **Search Functionality**: Implement proper text indexing for searchable fields

### **Code Quality Standards**
- **Validation**: Use `optional({ values: "falsy" })` for optional field validation
- **Error Handling**: Return consistent JSON error responses
- **File Operations**: Always verify file existence before operations
- **Security**: Implement proper input sanitization and rate limiting
- **Documentation**: Update API docs for any new endpoints

## Acknowledgments

- Built with the MERN stack (MongoDB, Express.js, React, Node.js)
- UI components from React Bootstrap
- Security implementations
- Performance optimizations based on Node.js best practices
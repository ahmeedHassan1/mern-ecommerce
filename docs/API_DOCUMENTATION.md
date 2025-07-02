# MERN E-commerce API Documentation

Welcome to the comprehensive API documentation for the MERN E-commerce platform. This API provides secure, scalable endpoints for managing users, products, orders, and promotional codes.

## 🚀 Quick Start

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-production-url.com/api
```

### Interactive Documentation
- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **API Info**: [http://localhost:5000/api](http://localhost:5000/api)

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Note**: Tokens are also stored in httpOnly cookies for web applications.

## 📊 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Login endpoint**: 5 requests per 15 minutes  
- **Strict operations**: 10 requests per 15 minutes (admin operations)

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Rate limit reset time

## 🏷️ API Endpoints Overview

### Authentication & Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users` | Register new user | No |
| POST | `/users/auth` | Login user | No |
| POST | `/users/logout` | Logout user | No |
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update user profile | Yes |
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| PUT | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | No |
| GET | `/products/top` | Get top rated products | No |
| GET | `/products/:id` | Get product by ID | No |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |
| POST | `/products/:id/reviews` | Add product review | Yes |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create new order | Yes |
| GET | `/orders/mine` | Get user's orders | Yes |
| GET | `/orders` | Get all orders | Admin |
| GET | `/orders/:id` | Get order by ID | Yes |
| PUT | `/orders/:id/pay` | Update order to paid | Yes |
| PUT | `/orders/:id/deliver` | Mark order as delivered | Admin |

### Promo Codes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/promos/check` | Check promo code validity | Yes |
| POST | `/promos/use` | Use promo code | Yes |
| GET | `/promos` | Get all promo codes | Admin |
| POST | `/promos` | Create promo code | Admin |
| GET | `/promos/:id` | Get promo code by ID | Admin |
| PUT | `/promos/:id` | Update promo code | Admin |
| DELETE | `/promos/:id` | Delete promo code | Admin |

### Configuration
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/config/paypal` | Get PayPal configuration | No |

## 📝 Request/Response Examples

### User Registration
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "createdAt": "2025-07-02T12:00:00.000Z"
}
```

### Product Search
```http
GET /api/products?keyword=iphone&pageNumber=1
```

**Response (200 OK):**
```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "iPhone 13 Pro",
      "price": 999.99,
      "description": "Latest iPhone with advanced camera system",
      "image": "/images/phone.jpg",
      "brand": "Apple",
      "category": "Electronics",
      "rating": 4.5,
      "numReviews": 12,
      "countInStock": 10
    }
  ],
  "page": 1,
  "pages": 3
}
```

### Create Order
```http
POST /api/orders
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "orderItems": [
    {
      "name": "iPhone 13 Pro",
      "qty": 1,
      "image": "/images/phone.jpg",
      "price": 999.99,
      "product": "507f1f77bcf86cd799439012"
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "PayPal",
  "itemsPrice": 999.99,
  "taxPrice": 100.00,
  "shippingPrice": 10.00,
  "totalPrice": 1109.99
}
```

## 🔒 Security Features

### Input Validation
All endpoints include comprehensive input validation:
- **Required fields**: Validated for presence
- **Email format**: Validated using regex
- **Password strength**: Minimum length requirements
- **Data types**: Strict type checking
- **Sanitization**: XSS protection

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Content Security Policy
- XSS protection

### Rate Limiting
- API-wide rate limiting
- Endpoint-specific limits
- IP-based tracking
- Automatic cleanup

## ❌ Error Handling

### Standard Error Response
```json
{
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

### Validation Error Response
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🧪 Testing

### Postman Collection
Import the provided Postman collection: `docs/MERN-Ecommerce-API.postman_collection.json`

**Environment Variables:**
- `base_url`: API base URL
- `jwt_token`: Authentication token (auto-set after login)
- `user_id`: User ID (auto-set after login)
- `product_id`: Product ID for testing
- `order_id`: Order ID for testing

### Automated Testing
```bash
# Run API tests
npm run test-improvements

# Interactive testing
npm run test-interactive
```

## 📊 Performance Features

### Database Optimization
- Strategic indexes on all collections
- Compound indexes for complex queries
- Text search index for products
- Query performance monitoring

### Caching
- Mongoose query optimization
- Connection pooling
- Efficient pagination

## 🔧 Development Tools

### API Verification
```bash
# Check database indexes and performance
npm run verify-indexes

# Test all improvements
npm run test-improvements
```

### Monitoring
- Structured logging with Winston
- Request/response logging
- Error tracking
- Performance metrics

## 🌐 Deployment Considerations

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Production Settings
- Enable CORS for your domain
- Configure proper rate limits
- Set up SSL/TLS certificates
- Enable request logging
- Configure error monitoring

## 📞 Support

### API Status
Check API health: `GET /api`

### Documentation
- Interactive docs: `/api-docs`
- This README: Complete API reference
- Postman collection: Ready-to-use requests

---

**Version**: 1.0.0  
**Last Updated**: July 2, 2025  
**Maintained by**: MERN E-commerce Team

For technical support or feature requests, please refer to the project repository.

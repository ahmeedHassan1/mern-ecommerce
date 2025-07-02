import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "MERN E-commerce API",
			version: "1.0.0",
			description:
				"A comprehensive e-commerce API built with Node.js, Express, and MongoDB",
			contact: {
				name: "API Support",
				email: "support@example.com"
			},
			license: {
				name: "MIT",
				url: "https://opensource.org/licenses/MIT"
			}
		},
		servers: [
			{
				url: "http://localhost:5000",
				description: "Development server"
			},
			{
				url: "https://your-production-url.com",
				description: "Production server"
			}
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "JWT Authorization header using the Bearer scheme"
				}
			},
			schemas: {
				User: {
					type: "object",
					required: ["name", "email", "password"],
					properties: {
						_id: {
							type: "string",
							description: "User ID"
						},
						name: {
							type: "string",
							description: "User full name",
							example: "John Doe"
						},
						email: {
							type: "string",
							format: "email",
							description: "User email address",
							example: "john@example.com"
						},
						isAdmin: {
							type: "boolean",
							description: "Admin status",
							default: false
						},
						createdAt: {
							type: "string",
							format: "date-time",
							description: "Account creation date"
						}
					}
				},
				Product: {
					type: "object",
					required: [
						"name",
						"price",
						"description",
						"image",
						"brand",
						"category",
						"countInStock"
					],
					properties: {
						_id: {
							type: "string",
							description: "Product ID"
						},
						name: {
							type: "string",
							description: "Product name",
							example: "iPhone 13 Pro"
						},
						image: {
							type: "string",
							description: "Product image URL",
							example: "/images/phone.jpg"
						},
						description: {
							type: "string",
							description: "Product description",
							example: "Latest iPhone with advanced camera system"
						},
						brand: {
							type: "string",
							description: "Product brand",
							example: "Apple"
						},
						category: {
							type: "string",
							description: "Product category",
							example: "Electronics"
						},
						price: {
							type: "number",
							description: "Product price",
							example: 999.99
						},
						countInStock: {
							type: "integer",
							description: "Available quantity",
							example: 10
						},
						rating: {
							type: "number",
							description: "Average rating",
							example: 4.5
						},
						numReviews: {
							type: "integer",
							description: "Number of reviews",
							example: 12
						}
					}
				},
				Order: {
					type: "object",
					properties: {
						_id: {
							type: "string",
							description: "Order ID"
						},
						user: {
							type: "string",
							description: "User ID who placed the order"
						},
						orderItems: {
							type: "array",
							items: {
								type: "object",
								properties: {
									name: { type: "string" },
									qty: { type: "integer" },
									image: { type: "string" },
									price: { type: "number" },
									product: { type: "string" }
								}
							}
						},
						shippingAddress: {
							type: "object",
							properties: {
								address: { type: "string" },
								city: { type: "string" },
								postalCode: { type: "string" },
								country: { type: "string" }
							}
						},
						paymentMethod: {
							type: "string",
							example: "PayPal"
						},
						totalPrice: {
							type: "number",
							example: 1299.99
						},
						isPaid: {
							type: "boolean",
							default: false
						},
						isDelivered: {
							type: "boolean",
							default: false
						}
					}
				},
				PromoCode: {
					type: "object",
					properties: {
						_id: {
							type: "string",
							description: "Promo code ID"
						},
						code: {
							type: "string",
							description: "Promo code",
							example: "SAVE20"
						},
						discountType: {
							type: "string",
							enum: ["percentage", "fixed"],
							description: "Type of discount"
						},
						discountValue: {
							type: "number",
							description: "Discount amount",
							example: 20
						},
						expiresAt: {
							type: "string",
							format: "date-time",
							description: "Expiration date"
						},
						uses: {
							type: "integer",
							description: "Current usage count",
							default: 0
						},
						maxUses: {
							type: "integer",
							description: "Maximum allowed uses"
						}
					}
				},
				Error: {
					type: "object",
					properties: {
						message: {
							type: "string",
							description: "Error message"
						},
						stack: {
							type: "string",
							description: "Error stack trace (development only)"
						}
					}
				},
				ValidationError: {
					type: "object",
					properties: {
						message: {
							type: "string",
							example: "Validation failed"
						},
						errors: {
							type: "array",
							items: {
								type: "object",
								properties: {
									field: { type: "string" },
									message: { type: "string" }
								}
							}
						}
					}
				}
			},
			responses: {
				UnauthorizedError: {
					description: "Authentication required",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error"
							},
							example: {
								message: "Not authorized, token failed"
							}
						}
					}
				},
				ValidationError: {
					description: "Validation error",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ValidationError"
							}
						}
					}
				},
				RateLimitError: {
					description: "Rate limit exceeded",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error"
							},
							example: {
								message: "Too many requests, please try again later"
							}
						}
					}
				}
			}
		},
		security: [
			{
				bearerAuth: []
			}
		],
		tags: [
			{
				name: "Authentication",
				description: "User authentication and authorization"
			},
			{
				name: "Users",
				description: "User management operations"
			},
			{
				name: "Products",
				description: "Product catalog operations"
			},
			{
				name: "Orders",
				description: "Order management operations"
			},
			{
				name: "Promo Codes",
				description: "Promotional code operations"
			}
		]
	},
	apis: ["./server/routes/*.js", "./server/controllers/*.js"]
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };

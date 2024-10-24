# MERN E-commerce Project

> This is a full-stack e-commerce application built using the MERN stack (MongoDB, Express.js, React, Node.js), designed for small to medium-sized online retailers looking for a feature-rich platform to manage their online sales.

<img src="./client/public/images/screens.png">

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Run](#run)
- [Build & Deploy](#build--deploy)
  - [Seed Database](#seed-database)

## Features

- Full-featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search functionality
- User profiles with order history
- Admin product management
- Admin user management
- Admin order details page
- Option to mark orders as delivered
- Comprehensive checkout process (shipping, payment method, etc.)
- PayPal and credit card payment integration
- Database seeder for products and users

## Technologies Used

- **Frontend**: React, Redux, React-Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Payment Integration**: PayPal API
- **Authentication**: JSON Web Tokens (JWT), bcrypt.js

## Usage

- Create a MongoDB database and obtain your `MongoDB URI` - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a PayPal account and obtain your `Client ID` - [PayPal Developer](https://developer.paypal.com/)

### Environment Variables

Rename the `.env.example` file to `.env` and add the following

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET = 'abc123'
PAYPAL_CLIENT_ID = your paypal client id
PAGINATION_LIMIT = 8
```

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/mern-ecommerce.git
    cd mern-ecommerce
    ```

2. Install server dependencies:
    ```bash
    npm install
    ```

3. Install client dependencies:
    ```bash
    cd client
    npm install
    ```

## Run

1. Run server (:5000):
    ```bash
    npm run server
    ```

2. Run client (:8080):
    ```bash
    npm run client
    ```

3. Alternatively, you can run both concurrently:
    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:8080`

## Build & Deploy

1. Create client production build (client/dist):
    ```bash
    npm run build
    ```

2. Deploy to a platform (e.g., Heroku, Vercel):
    - Follow the platform-specific instructions for deploying a Node.js application.

### Seed Database

You can use the following commands to seed the database with some sample users and products as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

```
The sample user logins provided include an admin for managing the site and two customer accounts for testing the user experience.

admin@email.com (Admin)
123456

john@email.com (Customer)
123456

jane@email.com (Customer)
123456
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

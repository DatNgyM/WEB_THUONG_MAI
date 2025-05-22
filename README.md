# Five:07 E-commerce Platform

## About the Project

Five:07 is a comprehensive e-commerce platform specializing in tech products. The platform offers user registration, product browsing, cart functionality, secure checkout, seller capabilities, and premium membership features.

## Key Features

### User Management
- User registration and authentication
- Profile management with CCCD (Citizen ID) validation
- Role-based access control (buyer, seller, admin)

### Shopping Experience
- Product catalog with search and filter
- Product details with images and specifications
- Shopping cart and wishlist functionality
- Secure checkout process

### Seller Capabilities
- Seller registration with CCCD verification
- Product listing and management
- Order fulfillment and tracking
- Sales analytics and reporting

### Premium Membership
- Tiered membership plans
- Exclusive discounts and benefits
- Early access to new products
- Free shipping vouchers

## CCCD Implementation

The platform includes a sophisticated CCCD (Citizen ID) management system that:

1. Allows users to register without providing a CCCD initially
2. Generates a temporary CCCD for users who don't provide one
3. Requires a valid CCCD for premium features and seller registration
4. Provides user-friendly UI for updating temporary CCCDs
5. Includes validation to ensure CCCD format correctness

For detailed information, see:
- [CCCD Implementation Guide](CCCD_implementation_guide.md)
- [CCCD Testing Guide](CCCD_testing_guide.md)
- [CCCD Test Plan](CCCD_test_plan.md)
- [Admin CCCD Guide](admin_cccd_guide.md)

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** Custom token-based authentication

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- PostgreSQL (v12.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/WEB_THUONG_MAI.git
```

2. Navigate to the project directory:
```
cd WEB_THUONG_MAI
```

3. Install dependencies:
```
npm install
```

4. Set up the database:
```
psql -U postgres -f New.sql
```

5. Start the development server:
```
npm start
```

## Usage

Open your browser and navigate to `http://localhost:3000` to access the application.

### Admin Access
- Username: admin
- Password: admin123

### Test Accounts
- Buyer: user@example.com / password123
- Seller: seller@example.com / password123

## Documentation

Comprehensive documentation is available in the `/docs` directory, including:

- User Guide
- Admin Guide
- API Documentation
- Database Schema

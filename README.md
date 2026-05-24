# FlaryBerry E-Commerce Application

## Project Overview
FlareBerry is a full-stack e-commerce web application for a clothing store. Users can browse products, filter by categories (Best Sellers, Featured, New Arrival), add items to cart, manage wishlist, and place orders. All data is persisted using SQLite database.

## Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5, jQuery, Isotope
- **Backend:** Node.js, Express.js
- **Database:** SQLite

## System Requirements
- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser (Chrome, Firefox, Edge)

## Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd E-commerce
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Step 4: Open the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## Features

### User Features
- Browse products with image gallery
- Filter products by category (Best Sellers, Featured, New Arrival)
- Add products to shopping cart
- Add products to wishlist
- Update cart quantities
- Remove items from cart and wishlist
- Place orders with checkout form
- View order history
- Newsletter subscription


## API Endpoints

### Cart Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get all cart items |
| POST | /api/cart | Add item to cart |
| PUT | /api/cart/:id | Update item quantity |
| DELETE | /api/cart/:id | Remove item from cart |
| DELETE | /api/cart/clear/all | Clear entire cart |

### Wishlist Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/wishlist | Get all wishlist items |
| POST | /api/wishlist | Add item to wishlist |
| DELETE | /api/wishlist/:id | Remove item from wishlist |
| DELETE | /api/wishlist/clear/all | Clear entire wishlist |

### Orders Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | Get all orders |
| GET | /api/orders/:id | Get single order details |
| POST | /api/orders | Create new order |
| PUT | /api/orders/:id/status | Update order status |
| POST | /api/orders/subscribe | Subscribe to newsletter |

## Project Structure
```
E-commerce/
├── backend/
│   ├── database/
│   │   └── shop.db          (auto-created on first run)
│   ├── middleware/
│   │   └── validation.js    (server-side validation)
│   ├── routes/
│   │   ├── cart.js          (cart API endpoints)
│   │   ├── orders.js        (orders API endpoints)
│   │   └── wishlist.js      (wishlist API endpoints)
│   ├── database.js          (database setup and initialization)
│   ├── package.json         (dependencies and scripts)
│   └── server.js            (main server entry point)
├── frontend/
│   ├── img/                 (product images)
│   ├── cart.html            (shopping cart page)
│   ├── collection.html      (product listing page)
│   ├── index.html           (homepage)
│   ├── orders.html          (order history page)
│   ├── popular.html         (popular products page)
│   ├── wishlist.html        (wishlist page)
│   ├── script.js            (client-side JavaScript)
│   └── style.css            (custom styles)
├── .gitignore               (Git ignore file)
└── README.md                (this file)
```

## Database Schema
The SQLite database contains four tables. 
Note: The shop.db file is a binary SQLite database file. It cannot be opened as a text file. 
To view its contents, use a SQLite browser application such as:
DB Browser for SQLite (free)

Tables:
### cart
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| product_id | TEXT | Product identifier |
| product_name | TEXT | Name of product |
| product_price | REAL | Price of product |
| product_image | TEXT | Image filename |
| product_category | TEXT | Category (best/feat/new) |
| quantity | INTEGER | Quantity in cart |
| added_at | DATETIME | Timestamp |

### wishlist
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| product_id | TEXT | Unique product identifier |
| product_name | TEXT | Name of product |
| product_price | REAL | Price of product |
| product_image | TEXT | Image filename |
| product_category | TEXT | Category (best/feat/new) |
| added_at | DATETIME | Timestamp |

### orders
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| customer_name | TEXT | Customer full name |
| customer_email | TEXT | Customer email |
| customer_address | TEXT | Shipping address |
| items | TEXT | JSON string of order items |
| total_amount | REAL | Order total |
| status | TEXT | Order status (pending/processing/shipped/delivered/cancelled) |
| created_at | DATETIME | Order date |

### subscribers
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| email | TEXT | Subscriber email (unique) |
| subscribed_at | DATETIME | Subscription date |

## Validation

### Client-Side Validation
- Email format validation for newsletter
- Form field validation for checkout
- Cart quantity validation

### Server-Side Validation
- Product ID validation
- Price validation (must be positive)
- Email format validation
- Customer name validation (minimum 2 characters)
- Address validation (minimum 5 characters)
- Cart empty validation before order

## Error Handling

The application returns appropriate HTTP status codes:
- `200` - Success
- `201` - Resource created
- `400` - Bad request (validation failed)
- `404` - Resource not found
- `500` - Server error

## Troubleshooting

### Database error
```bash
# Delete the database file and restart
rm -rf backend/database/shop.db
npm run dev
```


## Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Homepage | http://localhost:3000/index.html | Main landing page with special offers |
| Collection | http://localhost:3000/collection.html | All products with category filters |
| Popular | http://localhost:3000/popular.html | Popular products section |
| Cart | http://localhost:3000/cart.html | Shopping cart management |
| Wishlist | http://localhost:3000/wishlist.html | Saved products |
| Orders | http://localhost:3000/orders.html | Order history |

## Future Improvements
- User authentication and registration
- Product search functionality
- Payment gateway integration
- Email confirmation for orders
- Product reviews and ratings
- Wishlist adding functionality
- Discount codes and promotions
- Image upload for products

## Author
Created for Full Stack Web Development Assignment by Isil Sengul - End of May 2026
Neptun Code: HZ8QH5

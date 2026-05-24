const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let db;
//creating the db and the tables
async function initializeDatabase() {
    const dbDir = path.join(__dirname, 'database');
    
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log('Created database folder');
    }
    
    db = await open({
        filename: path.join(dbDir, 'shop.db'),
        driver: sqlite3.Database
    });
//cart table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT NOT NULL,
            product_name TEXT NOT NULL,
            product_price REAL NOT NULL,
            product_image TEXT NOT NULL,
            product_category TEXT NOT NULL,
            quantity INTEGER DEFAULT 1,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
//wishlist table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id TEXT NOT NULL UNIQUE,
            product_name TEXT NOT NULL,
            product_price REAL NOT NULL,
            product_image TEXT NOT NULL,
            product_category TEXT NOT NULL,
            product_rating INTEGER DEFAULT 5,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
//orders table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_address TEXT NOT NULL,
            items TEXT NOT NULL,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
//table for subscription to newsletter
    await db.exec(`
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database initialized successfully');
    console.log('Database path:', path.join(dbDir, 'shop.db'));
    return db;
}

function getDb() {
    return db;
}

module.exports = { initializeDatabase, getDb };
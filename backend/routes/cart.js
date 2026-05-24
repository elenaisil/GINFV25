const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { validateCartItem } = require('../middleware/validation');

router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const cart = await db.all('SELECT * FROM cart ORDER BY added_at DESC');
        const total = cart.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
        res.json({ success: true, cart, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/', validateCartItem, async (req, res) => {
    try {
        const db = getDb();
        const { product_id, product_name, product_price, product_image, product_category, quantity } = req.body;
        
        const existing = await db.get('SELECT * FROM cart WHERE product_id = ?', product_id);
        
        if (existing) {
            await db.run('UPDATE cart SET quantity = quantity + ? WHERE product_id = ?', [quantity, product_id]);
        } else {
            await db.run(
                `INSERT INTO cart (product_id, product_name, product_price, product_image, product_category, quantity) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [product_id, product_name, product_price, product_image, product_category, quantity]
            );
        }
        
        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const db = getDb();
        const { quantity } = req.body;
        
        if (!quantity || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
        }
        
        const result = await db.run('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, req.params.id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }
        
        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const db = getDb();
        const result = await db.run('DELETE FROM cart WHERE id = ?', req.params.id);
        
        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }
        
        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/clear/all', async (req, res) => {
    try {
        const db = getDb();
        await db.run('DELETE FROM cart');
        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
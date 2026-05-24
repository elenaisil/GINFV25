const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { validateWishlistItem } = require('../middleware/validation');

router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const wishlist = await db.all('SELECT * FROM wishlist ORDER BY added_at DESC');
        res.json({ success: true, wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/', validateWishlistItem, async (req, res) => {
    try {
        const db = getDb();
        const { product_id, product_name, product_price, product_image, product_category } = req.body;
        
        const existing = await db.get('SELECT * FROM wishlist WHERE product_id = ?', product_id);
        
        if (existing) {
            return res.status(400).json({ success: false, message: 'Already in wishlist' });
        }
        
        await db.run(
            `INSERT INTO wishlist (product_id, product_name, product_price, product_image, product_category) 
             VALUES (?, ?, ?, ?, ?)`,
            [product_id, product_name, product_price, product_image, product_category]
        );
        
        res.json({ success: true, message: 'Added to wishlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const db = getDb();
        const result = await db.run('DELETE FROM wishlist WHERE id = ?', req.params.id);
        
        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: 'Wishlist item not found' });
        }
        
        res.json({ success: true, message: 'Item removed from wishlist' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/clear/all', async (req, res) => {
    try {
        const db = getDb();
        await db.run('DELETE FROM wishlist');
        res.json({ success: true, message: 'Wishlist cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
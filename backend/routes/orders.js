const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { validateOrder, validateSubscription } = require('../middleware/validation');

router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        const order = await db.get('SELECT * FROM orders WHERE id = ?', req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        let items = [];
        try {
            items = JSON.parse(order.items);
        } catch (e) {
            items = [];
        }
        
        order.items = items;
        res.json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/', validateOrder, async (req, res) => {
    try {
        const db = getDb();
        const { customer_name, customer_email, customer_address, items, total } = req.body;
        
        const result = await db.run(
            `INSERT INTO orders (customer_name, customer_email, customer_address, items, total_amount, status) 
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [customer_name, customer_email, customer_address, JSON.stringify(items), total]
        );
        
        await db.run('DELETE FROM cart');
        
        res.status(201).json({ 
            success: true, 
            order_id: result.lastID,
            message: 'Order placed successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const db = getDb();
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        
        const result = await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/subscribe', validateSubscription, async (req, res) => {
    try {
        const db = getDb();
        const { email } = req.body;
        
        await db.run('INSERT OR IGNORE INTO subscribers (email) VALUES (?)', email);
        res.json({ success: true, message: 'Subscribed successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
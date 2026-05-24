//required pachages for the server like express cors
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { initializeDatabase } = require('./database');
//routes
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/orders');
//express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
//api routes
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'FlareBerry API is running' });
});
//error handling
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});
//func to start the server after database
async function startServer() {
    try {
        await initializeDatabase();
        console.log('Database initialized successfully');
        
        app.listen(PORT, () => {
            console.log(`\n=================================`);
            console.log(`FlaryBerry Server Running`);
            console.log(`=================================`);
            console.log(`Server: http://localhost:${PORT}`);
            console.log(`Frontend: http://localhost:${PORT}`);
            console.log(`=================================\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
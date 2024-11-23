require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const seatRoutes = require('./routes/seatRoutes');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to decode token and attach user to request
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({ error: 'Invalid or expired token' });
    }
    next();
});

app.use('/api/v1', authRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', seatRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
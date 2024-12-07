const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Endpoint for sales chart data
router.get('/chart/sales', async (req, res) => {
    try {
        const salesData = await db.getSalesData();
        res.status(200).send(salesData);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).send({ message: 'An error occurred while fetching sales data' });
    }
});

// Endpoint for user growth chart data
router.get('/chart/user-growth', async (req, res) => {
    try {
        const userGrowthData = await db.getUserGrowthData();
        res.status(200).send(userGrowthData);
    } catch (error) {
        console.error('Error fetching user growth data:', error);
        res.status(500).send({ message: 'An error occurred while fetching user growth data' });
    }
});

// Endpoint for most product sold chart data
router.get('/chart/most-product', async (req, res) => {
    try {
        const mostProductData = await db.getMostProductSold();
        res.status(200).send(mostProductData);
    } catch (error) {
        console.error('Error fetching most product data:', error);
        res.status(500).send({ message: 'An error occurred while fetching most product data' });
    }
});

module.exports = router;
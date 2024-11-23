const db = require('../models/db');

async function getAllSeats (req, res)  {
    try {
        const results = await db.getAllSeats();
        res.send({results: results});
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
};

async function startOrder (req, res)  {
    const { table_id, order_id } = req.body;

    if (!table_id) {
        res.status(400)
        return res.send({ error: 'Table ID is required' });
    }
    try {
        // Kiểm tra bàn khả dụng
        const table = await db.checkTableAvailability(table_id);
        if (!table) {
            res.status(400)
            return res.send({ error: 'Table is not available or does not exist' });
        }

        // Đánh dấu bàn là không khả dụng
        const updatedTable = await db.updateTableWithOrder(table_id, order_id);
        res.status(200)
        res.send({
            message: 'Order started successfully',
            table: updatedTable,
        });
    } catch (error) {
        console.error('Error starting order:', error);
        res.status(500)
        res.send({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllSeats,
    startOrder
};
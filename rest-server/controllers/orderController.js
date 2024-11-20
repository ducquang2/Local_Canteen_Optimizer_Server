const db = require('../models/db');

async function getAllOrders(req, res) {
    try {
        const results = await db.getAllOrders();
        res.send({ results });
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).send({ message: 'An error occurred while getting the orders' });
    }
}

async function deleteOrderById(req, res) {
    try {
        const { id } = req.params;
        const deletedOrder = await db.deleteOrderById(id);
        if (!deletedOrder) {
            res.status(404).send({ message: "Order not found" });
        } else {
            res.status(200).send({ message: "Order deleted successfully", order: deletedOrder });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).send({ message: 'An error occurred while deleting the order' });
    }
}

async function addOrder(req, res) {
    try {
        const { customer_id, order_status, total_price } = req.body;
        if (!total_price) {
            return res.status(400).send({ message: "Price is required" });
        }
        const newOrder = await db.addOrder({ customer_id, order_status, total_price });
        res.status(201).send({ message: "Order added successfully", order: newOrder });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).send({ message: 'An error occurred while adding the order' });
    }
}

async function updateOrderByID(req, res) {
    try {
        const { id } = req.params;
        const { customer_id, order_status, total_price } = req.body;
        const updatedOrder = await db.updateOrderByID(id, { customer_id, order_status, total_price });
        if (!updatedOrder) {
            return res.status(404).send({ message: "Order not found" });
        }
        res.status(200).send({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send({ message: 'An error occurred while updating the order' });
    }
}

async function addOrderItem(req, res) {
    try {
        const orderId = req.params.orderId;
        const { product_id, quantity, price } = req.body;
        const newItem = await db.addOrderItem({ orderId, product_id, quantity, price });
        res.status(201).send({ message: "Order item added successfully", orderItem: newItem });
    } catch (error) {
        console.error('Error adding order item:', error);
        res.status(500).send({ message: 'An error occurred while adding the order item' });
    }
}

async function getOrderItemByOrderId(req, res) {
    try {
        const orderId = req.params.orderId;
        const orderItems = await db.getOrderItemByOrderId(orderId);
        res.status(201).send({ orderItems });
    } catch (error) {
        console.error('Error getting order item:', error);
        res.status(500).send({ message: 'An error occurred while getting the order item' });
    }
}

module.exports = {
    getAllOrders,
    deleteOrderById,
    addOrder,
    updateOrderByID,
    addOrderItem,
    getOrderItemByOrderId
};
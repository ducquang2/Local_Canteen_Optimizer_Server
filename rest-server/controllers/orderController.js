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
        res.status(201).send({ items: orderItems });
    } catch (error) {
        console.error('Error getting order item:', error);
        res.status(500).send({ message: 'An error occurred while getting the order item' });
    }
}

async function getOrderItemByTableId(req, res) {
    const { tableId } = req.params;

    try {
        const orderId = await db.getCurrentOrderIdByTableId(tableId);

        if (!orderId) {
            return res.send(400,  {error: 'No order associated with this table' });
        }

        const order = await db.getOrderById(orderId);

        if (!order) {
            return res.send(400, { error: 'Order not found' });
        }

        // Lấy thông tin sản phẩm trong đơn hàng
        const orderItems = await db.getOrderItems(orderId);

        res.send(200,{
            order,
            items: orderItems,
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.send(500,{ error: 'Internal Server Error' });
    }
}

// checkout
async function checkout(req, res) {
    const {table_id} = req.body;
    if (!table_id) {
        res.status(400)
        return res.send({ message: "Table ID is required" });
    }
    try {
        const order_id = await db.getCurrentOrderIdByTableId(table_id);

        if (!order_id) {
            return res.send(400,  {error: 'No order associated with this table' });
        }
        // Cập nhật trạng thái đơn hàng
        const updatedOrder = await db.completeOrder(order_id);
        // Đặt lại trạng thái bàn
        const resetTable = await db.resetTableAfterPayment(table_id)
        
        res.status(200)
        res.send({
            message: 'Checkout completed successfully',
            table: resetTable,
            order: updatedOrder,
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500)
        res.json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllOrders,
    deleteOrderById,
    addOrder,
    updateOrderByID,
    addOrderItem,
    getOrderItemByOrderId,
    getOrderItemByTableId,
    checkout,
};
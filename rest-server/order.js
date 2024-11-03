const db = require('./db');

async function getAllOrders (req, res)  {
    try {
        const results = await db.getAllOrders();
        res.send({results: results});
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
};

async function deleteOrderById (req, res) {
    try {
        const { id } = req.params; // Lấy Order ID từ request parameters
        const deletedOrder = await db.deleteOrderById(id);

        if (!deletedOrder) {
            res.status(404);
            res.send({ message: "Order not found" });
        } else {
            // Nếu xoá thành công, gửi phản hồi 200 OK với thông tin sản phẩm đã xoá
            res.status(200);
            res.send({ message: "Order deleted successfully", order: deletedOrder });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500);
        res.send({ message: "An error occurred while deleting the order" });
    }
}

async function addOrder (req, res) {
    try {
        const { customer_id, order_status, total_price } = req.body; // Lấy thông tin sản phẩm từ request body

        if (!total_price) {
            return res.status(400).send({ message: "price is required" });
        }

        const newOrder = await db.addOrder({ customer_id, order_status, total_price });

        res.status(201);
        res.send({ message: "Order added successfully", order: newOrder });
    } catch (error) {
        console.error("Error adding order:", error);
        res.status(500)
        res.send({ message: "An error occurred while adding the order" });
    }
}

async function updateOrderByID (req, res) {
    try {
        const { id } = req.params; // Lấy product ID từ request parameters
        const { customer_id, order_status, total_price  } = req.body;

        // if (!name && !price && !description) {
        //     return res.status(400).send({ message: "At least one field (name, price, or description) is required" });
        // }

        const updatedOrder = await db.updateOrderByID(id, { customer_id, order_status, total_price  });

        if (!updatedOrder) {
            res.status(404)
            res.send({ message: "Order not found" });
            return
        }

        res.status(200)
        res.send({ message: "order updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500)
        res.send({ message: "An error occurred while updating the order" });
    }
}

// Order Detail
async function addOrderItem (req, res) {
    try {
        const orderId = req.params.orderId;
        const { product_id, quantity, price } = req.body;

        const newItem = await db.addOrderItem({orderId, product_id, quantity, price })

        res.status(201);
        res.send({ message: "Order item added successfully", orderItem: newItem });
    } catch (error) {
        console.error("Error adding order item:", error);
        res.status(500)
        res.send({ message: "An error occurred while adding the order item" });
    }
}

async function getOrderItemByOrderId (req, res) {
    try {
        const orderId = req.params.orderId;

        const orderItems = await db.getOrderItemByOrderId(orderId);

        res.status(201);
        res.send({ orderItems: orderItems});
    } catch (error) {
        console.error("Error get order item:", error);
        res.status(500)
        res.send({ message: "An error occurred while get the order item" });
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
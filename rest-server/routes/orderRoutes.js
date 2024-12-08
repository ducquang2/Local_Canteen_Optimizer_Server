const express = require('express');
const { 
    getAllOrders,
    deleteOrderById,
    addOrder,
    updateOrderByID,
    addOrderItem,
    getOrderItemByOrderId, 
    checkout,
    getOrderItemByTableId,
    deleteOrderItemsByOrderId
} = require('../controllers/orderController');
const { checkSupervisorPermission } = require('../middlewares/permissions');

const router = express.Router();

router.get('/orders', getAllOrders);
router.delete('/orders/:id', checkSupervisorPermission, deleteOrderById);
router.delete('/order-items/:orderId',deleteOrderItemsByOrderId );
router.post('/orders',addOrder);
router.put('/orders/:id', checkSupervisorPermission, updateOrderByID);
router.post('/orders/:orderId/items', addOrderItem);
router.get('/orders/:orderId/items', getOrderItemByOrderId);
router.get('/orders/:tableId', getOrderItemByTableId);
router.post("/orders/checkout", checkout);

module.exports = router;
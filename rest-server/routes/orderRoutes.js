const express = require('express');
const { 
    getAllOrders,
    deleteOrderById,
    addOrder,
    updateOrderByID,
    addOrderItem,
    getOrderItemByOrderId, 
    checkout
} = require('../controllers/orderController');

const { checkSupervisorPermission } = require('../middlewares/permissions');

const router = express.Router();

router.get('/orders', getAllOrders);
router.delete('/orders/:id', checkSupervisorPermission, deleteOrderById);
router.post('/orders', checkSupervisorPermission, addOrder);
router.put('/orders/:id', checkSupervisorPermission, updateOrderByID);
router.post('/orders/:orderId/items', checkSupervisorPermission, addOrderItem);
router.get('/orders/:orderId/items', getOrderItemByOrderId);
router.post("/orders/checkout", checkSupervisorPermission, checkout);

module.exports = router;
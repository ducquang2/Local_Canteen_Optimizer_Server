const express = require('express');
const { getAllProducts, deleteProductById, addProduct, updateProductByID } = require('../controllers/productController');
const { checkSupervisorPermission } = require('../middlewares/permissions');

const router = express.Router();

router.get('/products', getAllProducts);
router.delete('/products/:id', checkSupervisorPermission, deleteProductById);
router.post('/products', checkSupervisorPermission, addProduct);
router.put('/products/:id', checkSupervisorPermission, updateProductByID);

module.exports = router;
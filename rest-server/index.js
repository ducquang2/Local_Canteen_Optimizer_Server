require('dotenv').config();

const restify = require('restify');
const restifyJwt = require('restify-jwt-community');
const auth = require('./auth');
const db = require('./db');

const product = require('./product')
const order = require('./order')
const user = require('./user')

const jwt = require('jsonwebtoken');


const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/auth', auth.authorize);

// get all products
server.get("/api/v1/products", product.getAllProducts);

// get all orders
server.get("/api/v1/orders", order.getAllOrders);

// Middleware to decode token and attach user to request
server.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1];
    console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = decoded;
    } catch (err) {
        return res.send(401, { error: 'Invalid or expired token' });
    }
    next();
});

server.get("/", (req, res, next) => {
    res.send('Hello World!')
});

// Protected route with permissions
server.get('/admin', (req, res, next) => {
    req.route = { requiredRole: 'admin' };
    auth.checkPermissions(req, res, next);
}, (req, res, next) => {
    res.send({ message: 'Welcome, Admin!' });
    return next();
});

// Middleware check role
function checkAdminPermissions(req, res, next) {
    req.route = { requiredRole: 'admin' };
    auth.checkPermissions(req, res, next);
}

function checkManagerPermissions(req, res, next) {
    req.route = { requiredRole: 'manager' };
    auth.checkPermissions(req, res, next);
}

// Get all users
server.get("/api/v1/users", checkManagerPermissions, user.getAllUsers);

// Delete products by id
server.get("/api/v1/products/delete/:id", checkAdminPermissions, product.deleteProductById);

// add products
server.post("/api/v1/products/add", checkAdminPermissions, product.addProduct);

// update product
server.post("/api/v1/products/update/:id", checkAdminPermissions, product.updateProductByID);

// Delete order by id
server.get("/api/v1/orders/delete/:id", checkAdminPermissions, order.deleteOrderById);

// add orders
server.post("/api/v1/orders/add", checkAdminPermissions, order.addOrder);

// update order
server.post("/api/v1/orders/update/:id", checkAdminPermissions, order.updateOrderByID);

// add order item
server.post("/api/v1/orders-item/add/:orderId", checkAdminPermissions, order.addOrderItem);

// get order item
server.get("/api/v1/orders-item/:orderId", order.getOrderItemByOrderId);

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
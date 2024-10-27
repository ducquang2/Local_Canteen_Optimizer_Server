require('dotenv').config();

const restify = require('restify');
const restifyJwt = require('restify-jwt-community');
const auth = require('./auth');
const db = require('./db');

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.post('/auth', auth.authorize);

// Middleware to decode token and attach user to request
server.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.send(401, { error: 'Invalid or expired token' });
    }
    next();
});

// Protected route with permissions
server.get('/admin', (req, res, next) => {
    req.route = { requiredRole: 'admin' };
    auth.checkPermissions(req, res, next);
}, (req, res, next) => {
    res.send({ message: 'Welcome, Admin!' });
    return next();
});

// server.use(restifyJwt({ secret: process.env.JWT_SECRET }).unless({ path: ['/auth'] }));
// server.use(auth.authorize); // Apply authorization middleware
// server.use(auth.checkPermissions); // Apply permission check middleware

// server.get('/protected', { requiredRole: 'staff' }, async (req, res, next) => {
//     res.send({ message: `Hello ${req.user.username}, you are authenticated as ${req.user.role}!` });
//     next();
// });

// server.get('/manager-only', { requiredRole: 'manager' }, async (req, res, next) => {
//     res.send({ message: 'This is a manager-only route.' });
//     next();
// });

// server.get('/admin-only', { requiredRole: 'admin' }, async (req, res, next) => {
//     res.send({ message: 'This is an admin-only route.' });
//     next();
// });

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
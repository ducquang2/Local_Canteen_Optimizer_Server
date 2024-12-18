const jwt = require('jsonwebtoken');
const db = require('../models/db');

async function authorize(req, res) {
    const { username, password } = req.body;
    try {
        const user = await db.getUserByUsername(username);
        if (!user || password !== user.password) {
            return res.send(401, { error: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );
        res.send({
            token, user: {
                username: user.username,
                full_name: user.full_name,
                phone_number: user.phone_number,
                role: user.role,
            }
        });
    } catch (error) {
        return res.send(500, { error: error.message });
    }
}

function checkPermissions(req, res, next) {
    const requiredRole = req.route.requiredRole;
    if (!requiredRole) return next();

    const userRole = req.user.role;
    if (userRole !== 'admin' && requiredRole === 'admin') {
        return res.send(403, { error: 'Insufficient permissions' });
    }
    if (userRole !== 'manager' && userRole !== 'admin' && requiredRole === 'manager') {
        return res.send(403, { error: 'Insufficient permissions' });
    }
    next();
}

module.exports = { authorize, checkPermissions };
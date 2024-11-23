const jwt = require('jsonwebtoken');

function checkSupervisorPermission(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: 'Invalid token' });
        if (user.role !== 'admin' && user.role !== 'manager') {
            return res.status(403).send({ message: 'Access denied' });
        }

        req.user = user;
        next();
    });
}

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

module.exports = {
    checkSupervisorPermission,
    authenticateToken,
};
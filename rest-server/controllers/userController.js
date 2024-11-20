const db = require('../models/db');

async function getAllUsers(req, res) {
    try {
        const page = parseInt(req.query.page, 10);
        const pageSize = parseInt(req.query.pageSize, 10);
        const search = req.query.search;
        const sort = req.query.sort;
        const sortBy = req.query.sortBy || 'user_id';
        const { totalItems, results } = await db.getAllUsers({ page, pageSize, search, sort, sortBy });
        res.send({ totalItems, results });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).send({ message: 'An error occurred while getting the users' });
    }
}

async function addUser(req, res) {
    const { username, password, full_name, phone_number, role } = req.body;
    const userRole = await db.getUserRole(req.user.username);

    if (userRole !== 'admin' && userRole !== 'manager') {
        return res.status(403).send({ message: 'Access denied' });
    }

    if (await db.usernameExists(username)) {
        return res.status(400).send({ message: 'Username already exists' });
    }

    if (password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    }

    if (userRole === 'manager' && role !== 'staff') {
        return res.status(403).send({ message: 'Managers can only add staff users' });
    }

    try {
        const newUser = await db.createUser(username, password, full_name, phone_number, role);
        res.status(201).send({ message: "User added successfully", user: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send({ message: 'An error occurred while adding the user' });
    }
}

async function updateUser(req, res) {
    const { username } = req.params;
    const { password, full_name, phone_number, role } = req.body;
    const userRole = await db.getUserRole(req.user.username);

    if (userRole !== 'admin' && userRole !== 'manager') {
        return res.status(403).send({ message: 'Access denied' });
    }

    const existingUser = await db.getUserByUsername(username);
    if (!existingUser) {
        return res.status(404).send({ message: 'User not found' });
    }

    if (userRole === 'manager' && existingUser.role !== 'staff') {
        return res.status(403).send({ message: 'Managers can only update staff users' });
    }

    if (userRole === 'manager' && role && role !== existingUser.role) {
        return res.status(403).send({ message: 'Managers cannot change user roles' });
    }

    if (password && password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    }

    const updates = { password, full_name, phone_number, role };
    if (password) {
        updates.password = await bcrypt.hash(password, 10);
    }

    try {
        const updatedUser = await db.updateUser(username, updates);
        res.send(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ message: 'An error occurred while updating the user' });
    }
}

module.exports = {
    getAllUsers,
    addUser,
    updateUser,
};
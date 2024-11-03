const db = require('./db');
const restify = require('restify');

async function getAllUsers (req, res)  {
    try {
        const page = parseInt(req.query.page, 10);
        const pageSize = parseInt(req.query.pageSize, 10);
        const search = req.query.search;
        const sort = req.query.sort;
        const sortBy = req.query.sortBy || 'user_id';

        console.log({ page, pageSize, search, sort })

        const { totalItems, results } = await db.getAllUsers({ page, pageSize, search, sort, sortBy });
        res.send({ totalItems, results });
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
};

module.exports = {
    getAllUsers,
};
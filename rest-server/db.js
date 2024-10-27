require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
});

async function createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    try {
        const result = await pool.query(
            'INSERT INTO "Users" (username, password_hash) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function getUserByUsername(username) {
    try {
        const result = await pool.query(
            'SELECT * FROM "Users" WHERE username = $1',
            [username]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

async function getUserRole(username) {
    try {
        const result = await pool.query(
            'SELECT role FROM "Users" WHERE username = $1',
            [username]
        );
        return result.rows[0]?.role || 'staff'; // Default to 'staff' if no role is found
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserRole
};

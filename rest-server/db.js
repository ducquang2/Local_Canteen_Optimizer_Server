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

// Products
async function getAllProducts({ page, pageSize, search, sort}) {
    try {
        const queryValues = [];
        const countValues = [];
        let query = 'SELECT * FROM "Products"';
        let countQuery = 'SELECT COUNT(*) FROM "Products"';

        // Điều kiện tìm kiếm
        if (search) {
            query += ' WHERE "product_name" ILIKE $1';
            countQuery += ' WHERE "product_name" ILIKE $1';
            queryValues.push(`%${search}%`);
            countValues.push(`%${search}%`);
        }

        // Điều kiện sắp xếp
        if (sort) {
            query += ` ORDER BY "product_name" ${sort === 'desc' ? 'DESC' : 'ASC'}`;
        }

        // Phân trang
        if (page && pageSize) {
            const offset = (page - 1) * pageSize;
            query += ` LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}`;
            queryValues.push(pageSize, offset);
        }

        // Thực hiện truy vấn để lấy danh sách sản phẩm
        const result = await pool.query(query, queryValues);
        const results = result?.rows;

        // Thực hiện truy vấn để đếm tổng số sản phẩm
        const countResult = await pool.query(countQuery, countValues);
        const totalItems = parseInt(countResult.rows[0].count, 10);

        return { totalItems, results };
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
}

async function deleteProductById(id) {
    try {
        const result = await pool.query(
            'DELETE FROM "Products" WHERE product_id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            console.log(`No product found with id: ${id}`);
            return null;
        }
        
        console.log(`Product with id ${id} deleted successfully`);
        return result.rows[0]; // Return the deleted product data if needed
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

async function addProduct(product) {
    try {
        const { product_name, category_id, price, description, stock_quantity, image_url, is_active } = product;
        const result = await pool.query(
            'INSERT INTO "Products" (product_name, category_id, price, description, stock_quantity, image_url, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [product_name, category_id, price, description, stock_quantity, image_url, is_active]
        );
        return result.rows[0]; // Return the deleted product data if needed
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

async function updateProductByID(id, product) {
    try {
        const entries = Object.entries(product).filter(([_, value]) => value !== undefined && value !== null);
        if (entries.length === 0) return null;

        const fields = entries.map(([key], index) => `${key} = $${index + 1}`);
        const values = entries.map(([_, value]) => value);

        const query = `UPDATE "Products" SET ${fields.join(", ")} WHERE product_id = $${entries.length + 1} RETURNING *`;
        values.push(id);

        const result = await pool.query(query, values);
        return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserRole,
    getAllProducts,
    deleteProductById,
    addProduct,
    updateProductByID
};

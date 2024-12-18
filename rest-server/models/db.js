require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
});

async function createUser(username, password, full_name, phone_number, role) {
  try {
    const result = await pool.query(
      'INSERT INTO "Users" (username, password, full_name, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, password, full_name, phone_number, role]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function updateUser(id, updates) {
  const entries = Object.entries(updates).filter(
    ([_, value]) => value !== undefined && value !== null
  );
  if (entries.length === 0) return null;

  const fields = entries.map(([key], index) => `${key} = $${index + 1}`);
  const values = entries.map(([_, value]) => value);

  const query = `UPDATE "Users" SET ${fields.join(", ")} WHERE user_id = $${
    entries.length + 1
  } RETURNING *`;
  values.push(id);

  try {
    const result = await pool.query(query, values);
    return result.rowCount > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

async function usernameExists(username) {
  try {
    const result = await pool.query(
      'SELECT 1 FROM "Users" WHERE username = $1',
      [username]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error checking username existence:", error);
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
    console.error("Error getting user:", error);
    throw error;
  }
}

async function getUserById(id) {
  try {
    const result = await pool.query(
      'SELECT * FROM "Users" WHERE user_id = $1',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

async function getUserRole(username) {
  try {
    const result = await pool.query(
      'SELECT role FROM "Users" WHERE username = $1',
      [username]
    );
    return result.rows[0]?.role || "staff"; // Default to 'staff' if no role is found
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error;
  }
}

async function getAllUsers({ page, pageSize, search, sort, sortBy }) {
  try {
    const queryValues = [];
    const countValues = [];
    let query = 'SELECT * FROM "Users"';
    let countQuery = 'SELECT COUNT(*) FROM "Users"';

    // Điều kiện tìm kiếm
    if (search) {
      query += ' WHERE "username" ILIKE $1';
      countQuery += ' WHERE "username" ILIKE $1';
      queryValues.push(`%${search}%`);
      countValues.push(`%${search}%`);
    }

    // Điều kiện sắp xếp
    if (sort) {
      query += ` ORDER BY "${sortBy || "user_id"}" ${
        sort === "desc" ? "DESC" : "ASC"
      }`;
    }

    // Phân trang
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      query += ` LIMIT $${queryValues.length + 1} OFFSET $${
        queryValues.length + 2
      }`;
      queryValues.push(pageSize, offset);
    }

    const result = await pool.query(query, queryValues);
    const results = result?.rows;

    const countResult = await pool.query(countQuery, countValues);
    const totalItems = parseInt(countResult.rows[0].count, 10);

    return { totalItems, results };
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error;
  }
}

// Products
async function getAllProducts({ page, pageSize, search, sort, minPrice, maxPrice}) {
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

        if (minPrice && maxPrice) {
            if (queryValues.length > 0) {
                query += ' AND "price" BETWEEN $' + (queryValues.length + 1) + ' AND $' + (queryValues.length + 2);
                countQuery += ' AND "price" BETWEEN $' + (countValues.length + 1) + ' AND $' + (countValues.length + 2);
            } else {
                query += ' WHERE "price" BETWEEN $' + (queryValues.length + 1) + ' AND $' + (queryValues.length + 2);
                countQuery += ' WHERE "price" BETWEEN $' + (countValues.length + 1) + ' AND $' + (countValues.length + 2);
            }
            queryValues.push(minPrice, maxPrice);
            countValues.push(minPrice, maxPrice);
        } else if (maxPrice) {
            // Chỉ có maxPrice (có thể là 0)
            if (queryValues.length > 0) {
                query += ' AND "price" <= $' + (queryValues.length + 1);
                countQuery += ' AND "price" <= $' + (countValues.length + 1);
            } else {
                query += ' WHERE "price" <= $' + (queryValues.length + 1);
                countQuery += ' WHERE "price" <= $' + (countValues.length + 1);
            }
            queryValues.push(maxPrice);
            countValues.push(maxPrice);
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

// Order
async function getAllOrders({ page, pageSize, sort}) {
    try {
        const queryValues = [];
        const countValues = [];
        let query = 'SELECT * FROM "Orders"';
        let countQuery = 'SELECT COUNT(*) FROM "Orders"';

        if (sort) {
            query += ` ORDER BY "created_at" ${sort === 'desc' ? 'DESC' : 'ASC'}`;
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

        return results ;
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
}

async function deleteOrderById(id) {
    try {
        const result = await pool.query(
            'DELETE FROM "Orders" WHERE order_id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            console.log(`No order found with id: ${id}`);
            return null;
        }
        
        console.log(`Order with id ${id} deleted successfully`);
        return result.rows[0]; // Return the deleted product data if needed
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

async function addOrder(order) {
    try {
        const { customer_id, order_status, total_price} = order;
        const result = await pool.query(
            'INSERT INTO "Orders" (customer_id, order_status, total_price) VALUES ($1, $2, $3) RETURNING *',
            [customer_id, order_status, total_price]
        );
        return result.rows[0]; // Return the deleted product data if needed
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
}

async function updateOrderByID(id, order) {
    try {
        const entries = Object.entries(order).filter(([_, value]) => value !== undefined && value !== null);
        if (entries.length === 0) return null;

        const fields = entries.map(([key], index) => `${key} = $${index + 1}`);
        const values = entries.map(([_, value]) => value);

        const query = `UPDATE "Orders" SET ${fields.join(", ")} WHERE order_id = $${entries.length + 1} RETURNING *`;
        values.push(id);

        const result = await pool.query(query, values);
        return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
}

// Order Details
async function addOrderItem(orderItem) {
    try {
        const {orderId ,product_id, quantity, price } = orderItem;
        const result = await pool.query(
            `INSERT INTO "Order_Items" (order_id, product_id, quantity, price) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [orderId, product_id, quantity, price]
        );
        await pool.query(
            `UPDATE "Orders" SET total_price = total_price + $1 WHERE order_id = $2`,
            [quantity * price, orderId]
        );
        return result.rows[0]; // Return the deleted product data if needed
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
}

async function deleteOrderItemsByOrderId(orderId) {
    try {
        const query = `
            DELETE FROM "Order_Items"
            WHERE "order_id" = $1;
        `;
        const result = await pool.query(query, [orderId]);
        await pool.query(
            `UPDATE "Orders" SET total_price = 0 WHERE order_id = $1`,
            [orderId]
        );
        return result.rowCount;
    } catch (error) {
        console.error('Error deleting order items:', error);
        throw error;
    }
}

// Order Id
async function getOrderItemByOrderId(orderId) {
    try {
        
        const result = await pool.query(
            `SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity, oi.price, 
                    p.product_name, p.image_url
             FROM "Order_Items" oi
             JOIN "Products" p ON oi.product_id = p.product_id
             WHERE oi.order_id = $1`,
            [orderId]
        );
        return result.rows; // Return the deleted product data if needed
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
}


// update order after checkout
async function completeOrder(order_id) {
    const query = `
        UPDATE "Orders"
        SET order_status = 'confirmed'
        WHERE order_id = $1
        RETURNING *;
    `;
    const result = await pool.query(query, [order_id]);
    return result.rows[0];
}

async function getOrderById(order_id) {
    const query = `
        SELECT * 
        FROM "Orders"
        WHERE order_id = $1;
    `;
    const result = await pool.query(query, [order_id]);
    return result.rows[0];
}

async function getOrderItems(order_id) {
    const query = `
        SELECT oi.*, p.product_name, p.image_url
        FROM "Order_Items" AS oi
        JOIN "Products" AS p ON oi.product_id = p.product_id
        WHERE oi.order_id = $1;
    `;
    const result = await pool.query(query, [order_id]);
    return result.rows;
}


// Seats
async function getAllSeats() {
    try {
        let query = 'SELECT * FROM "Tables" ORDER BY table_id ASC';

        // Thực hiện truy vấn để lấy danh sách order
        const result = await pool.query(query);
        const results = result?.rows;

        return results ;
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
}

// check table is available
async function checkTableAvailability(table_id) {
    const query = 'SELECT * FROM "Tables" WHERE table_id = $1 AND is_available = true';
    const result = await pool.query(query, [table_id]);
    return result.rows[0]; // Trả về bàn nếu tìm thấy, ngược lại là undefined
}

// update status of table
async function updateTableWithOrder(table_id, order_id) {
    const query = `
        UPDATE "Tables"
        SET is_available = false, current_order_id = $1, updated_at = NOW()
        WHERE table_id = $2
        RETURNING *;
    `;
    const result = await pool.query(query, [order_id, table_id]);
    return result.rows[0];
}

async function resetTableAfterPayment(table_id) {
    const query = `
        UPDATE "Tables"
        SET is_available = true, current_order_id = null, updated_at = NOW()
        WHERE table_id = $1
        RETURNING *;
    `;
    const result = await pool.query(query, [table_id]);
    return result.rows[0];
}

async function getCurrentOrderIdByTableId(tableId) {
    const query = `
        SELECT current_order_id
        FROM "Tables"
        WHERE table_id = $1;
    `;
    const result = await pool.query(query, [tableId]);
    return result.rows[0]?.current_order_id || null;
}

// Chart
async function getSalesData() {
  try {
    const result = await pool.query(`
            SELECT DATE_TRUNC('month', created_at) AS month, SUM(total_price) AS total_sales
            FROM "Orders"
            GROUP BY month
            ORDER BY month
        `);
    return result.rows;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
}

async function getUserGrowthData() {
  try {
    const result = await pool.query(`
            SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) AS user_count
            FROM "Users"
            GROUP BY month
            ORDER BY month
        `);
    return result.rows;
  } catch (error) {
    console.error("Error fetching user growth data:", error);
    throw error;
  }
}

async function getMostProductSold() {
  try {
    const result = await pool.query(`
            SELECT DATE_TRUNC('month', o.created_at) AS month, p.product_name, SUM(oi.quantity) AS total_quantity
            FROM "Order_Items" oi
            JOIN "Orders" o ON oi.order_id = o.order_id
            JOIN "Products" p ON oi.product_id = p.product_id
            GROUP BY month, p.product_name
            ORDER BY month, total_quantity DESC
        `);
    return result.rows;
  } catch (error) {
    console.error("Error fetching user growth data:", error);
    throw error;
  }
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserRole,
    getAllUsers,
    updateUser,
    usernameExists,
    getAllProducts,
    deleteProductById,
    addProduct,
    updateProductByID,
    getAllOrders,
    deleteOrderById,
    addOrder,
    updateOrderByID,
    addOrderItem,
    getOrderItemByOrderId,
    completeOrder,
    deleteOrderItemsByOrderId,
    getAllSeats,
    checkTableAvailability,
    updateTableWithOrder,
    resetTableAfterPayment,
    getOrderById,
    getOrderItems,
    getCurrentOrderIdByTableId,
    getSalesData,
    getUserGrowthData,
    getMostProductSold,
    getUserById
};

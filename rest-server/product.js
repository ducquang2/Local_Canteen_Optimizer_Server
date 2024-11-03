const db = require('./db');
const restify = require('restify');

async function getAllProducts (req, res)  {
    try {
        const page = parseInt(req.query.page, 10);
        const pageSize = parseInt(req.query.pageSize, 10);
        const search = req.query.search;
        const sort = req.query.sort;

        console.log({ page, pageSize, search, sort })

        const {totalItems, results} = await db.getAllProducts({ page, pageSize, search, sort });
        res.send({totalItems, results});
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
};

async function deleteProductById (req, res) {
    try {
        const { id } = req.params; // Lấy product ID từ request parameters
        const deletedProduct = await db.deleteProductById(id);

        if (!deletedProduct) {
            res.status(404);
            res.send({ message: "Product not found" });
        } else {
            // Nếu xoá thành công, gửi phản hồi 200 OK với thông tin sản phẩm đã xoá
            res.status(200);
            res.send({ message: "Product deleted successfully", product: deletedProduct });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500);
        res.send({ message: "An error occurred while deleting the product" });
    }
}

async function addProduct (req, res) {
    try {
        console.log("add")
        const { product_name, category_id, price, description, stock_quantity, image_url, is_active } = req.body; // Lấy thông tin sản phẩm từ request body

        if (!product_name || !price) {
            return res.status(400).send({ message: "Name and price are required" });
        }

        const newProduct = await db.addProduct({ product_name, category_id, price, description, stock_quantity, image_url, is_active });

        res.status(201);
        res.send({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500)
        res.send({ message: "An error occurred while adding the product" });
    }
}

async function updateProductByID (req, res) {
    try {
        const { id } = req.params; // Lấy product ID từ request parameters
        console.log("update")
        const { product_name, category_id, price, description, stock_quantity, image_url, is_active } = req.body;

        // if (!name && !price && !description) {
        //     return res.status(400).send({ message: "At least one field (name, price, or description) is required" });
        // }

        const updatedProduct = await db.updateProductByID(id, { product_name, category_id, price, description, stock_quantity, image_url, is_active });

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200)
        res.send({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500)
        res.send({ message: "An error occurred while updating the product" });
    }
}

module.exports = {
    getAllProducts,
    deleteProductById,
    addProduct,
    updateProductByID
};
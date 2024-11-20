const db = require('../models/db');

async function getAllProducts(req, res) {
    try {
        const page = parseInt(req.query.page, 10);
        const pageSize = parseInt(req.query.pageSize, 10);
        const search = req.query.search;
        const sort = req.query.sort;
        const { totalItems, results } = await db.getAllProducts({ page, pageSize, search, sort });
        res.send({ totalItems, results });
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).send({ message: 'An error occurred while getting the products' });
    }
}

async function deleteProductById(req, res) {
    try {
        const { id } = req.params;
        const deletedProduct = await db.deleteProductById(id);
        if (!deletedProduct) {
            res.status(404).send({ message: "Product not found" });
        } else {
            res.status(200).send({ message: "Product deleted successfully", product: deletedProduct });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send({ message: 'An error occurred while deleting the product' });
    }
}

async function addProduct(req, res) {
    try {
        const { product_name, category_id, price, description, stock_quantity, image_url, is_active } = req.body;
        if (!product_name || !price) {
            return res.status(400).send({ message: "Name and price are required" });
        }
        const newProduct = await db.addProduct({ product_name, category_id, price, description, stock_quantity, image_url, is_active });
        res.status(201).send({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send({ message: 'An error occurred while adding the product' });
    }
}

async function updateProductByID(req, res) {
    try {
        const { id } = req.params;
        const { product_name, category_id, price, description, stock_quantity, image_url, is_active } = req.body;
        const updatedProduct = await db.updateProductByID(id, { product_name, category_id, price, description, stock_quantity, image_url, is_active });
        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.status(200).send({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send({ message: 'An error occurred while updating the product' });
    }
}

module.exports = {
    getAllProducts,
    deleteProductById,
    addProduct,
    updateProductByID
};
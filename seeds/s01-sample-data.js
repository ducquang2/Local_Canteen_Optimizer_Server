/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('Order_Promotions').del();
  await knex('Promotions').del();
  await knex('Purchase_Order_Items').del();
  await knex('Purchase_Orders').del();
  await knex('Order_Items').del();
  await knex('Orders').del();
  await knex('Products').del();
  await knex('Categories').del();
  await knex('Customers').del();
  await knex('Users').del();
  await knex('Expenses').del();

  // Insert sample users
  await knex('Users').insert([
    { username: 'admin01', password: 'password123', full_name: 'Admin User', phone_number: '0987654321', role: 'admin' },
    { username: 'manager01', password: 'password123', full_name: 'Manager User', phone_number: '0987654322', role: 'manager' },
    { username: 'staff01', password: 'password123', full_name: 'Staff User', phone_number: '0987654323', role: 'staff' },
  ]);

  // Insert sample customers
  await knex('Customers').insert([
    { full_name: 'John Doe', email: 'john@example.com', phone_number: '0987654324', address: '123 Main St' },
    { full_name: 'Jane Smith', email: 'jane@example.com', phone_number: '0987654325', address: '456 Elm St' },
  ]);

  // Insert sample categories
  await knex('Categories').insert([
    { category_name: 'Electronics', description: 'Devices and gadgets' },
    { category_name: 'Books', description: 'Books of various genres' },
    { category_name: 'Clothing', description: 'Apparel and accessories' },
  ]);

  // Insert sample products
  await knex('Products').insert([
    { product_name: 'Smartphone', category_id: 1, price: 299.99, description: 'Latest model smartphone', stock_quantity: 50, image_url: 'image_url_1', is_active: true },
    { product_name: 'Laptop', category_id: 1, price: 999.99, description: 'High-performance laptop', stock_quantity: 30, image_url: 'image_url_2', is_active: true },
    { product_name: 'Novel', category_id: 2, price: 19.99, description: 'Best-selling novel', stock_quantity: 100, image_url: 'image_url_3', is_active: true },
    { product_name: 'T-shirt', category_id: 3, price: 14.99, description: 'Comfortable cotton t-shirt', stock_quantity: 200, image_url: 'image_url_4', is_active: true },
  ]);

  // Insert sample orders
  await knex('Orders').insert([
    { customer_id: 1, order_status: 'confirmed', total_price: 299.99 },
    { customer_id: 2, order_status: 'pending', total_price: 19.99 },
  ]);

  // Insert sample order items
  await knex('Order_Items').insert([
    { order_id: 1, product_id: 1, quantity: 1, price: 299.99 },
    { order_id: 2, product_id: 3, quantity: 1, price: 19.99 },
  ]);

  // Insert sample purchase orders
  await knex('Purchase_Orders').insert([
    { total_price: 13500.00 },
    { total_price: 1500.00 },
  ]);

  // Insert sample purchase order items
  await knex('Purchase_Order_Items').insert([
    { purchase_order_id: 1, product_id: 1, quantity: 20, price: 250.00 },
    { purchase_order_id: 1, product_id: 2, quantity: 10, price: 850.00 },
    { purchase_order_id: 2, product_id: 3, quantity: 100, price: 15.00 },
  ]);

  // Insert sample promotions
  await knex('Promotions').insert([
    { promotion_name: 'Black Friday Sale', description: 'Huge discounts on all items', discount_type: 'percentage', discount_value: 10.00, start_date: '2024-11-25', end_date: '2024-11-30', min_order_value: 50.00, max_discount_amount: 100.00, is_active: true },
    { promotion_name: 'New Year Sale', description: 'Discount on new year shopping', discount_type: 'fixed_amount', discount_value: 5.00, start_date: '2025-01-01', end_date: '2025-01-07', min_order_value: 30.00, max_discount_amount: 50.00, is_active: true },
  ]);

  // Insert sample order promotions
  await knex('Order_Promotions').insert([
    { order_id: 1, promotion_id: 1, discount_amount: 30.00 },
  ]);

  // Insert sample expenses
  await knex('Expenses').insert([
    { amount: 1000.00, description: 'Office rent for October' },
    { amount: 200.00, description: 'Utility bills for September' },
  ]);
};

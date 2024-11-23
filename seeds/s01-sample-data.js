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
    { category_name: 'Main Course', description: 'Full meal options' },  
    { category_name: 'Snacks', description: 'Light snacks and appetizers' },  
    { category_name: 'Desserts', description: 'Sweet treats and desserts' }, 
  ]);

  // Insert sample products
  await knex('Products').insert([  
    { product_name: 'Sandwich', category_id: 1, price: 5.00, description: 'Delicious sandwich with fresh ingredients', stock_quantity: 50, image_url: 'https://d28b9t9gqzccgt.cloudfront.net/z4815769629555_506670e39f83d4bb8c81deee715f8e5f.jpg', is_active: true },  
    { product_name: 'Pizza', category_id: 1, price: 8.00, description: 'Cheesy pizza with various toppings', stock_quantity: 40, image_url: 'https://t3.ftcdn.net/jpg/01/02/97/10/360_F_102971073_l5ygYH1qCvejA8efcfuAYCRm7epxBEjn.jpg', is_active: true },  
    { product_name: 'Pepperoni Pizza', category_id: 1, price: 8.00, description: 'Cheesy pizza with various toppings', stock_quantity: 40, image_url: 'https://c8.alamy.com/comp/JF5KXJ/pepperoni-pizza-italian-pizza-on-white-background-isolated-JF5KXJ.jpg', is_active: true },  
    { product_name: 'Pasta', category_id: 1, price: 7.00, description: 'Pasta with tomato sauce and herbs', stock_quantity: 30, image_url: 'https://img.freepik.com/premium-photo/pasta-spaghetti-bolognese-white-plate-white-background-bolognese-sauce-is-classic-italian_763111-5934.jpg', is_active: true },  
    { product_name: 'Chips', category_id: 2, price: 1.50, description: 'Crispy potato chips', stock_quantity: 100, image_url: 'https://media.istockphoto.com/id/175012912/photo/crisps.jpg?s=612x612&w=0&k=20&c=wiKGE9D2MPtqZV6VYKm-K7mcFfHaGSPEpSzTu59_eHk=', is_active: true },  
    { product_name: 'Cookies', category_id: 2, price: 2.00, description: 'Freshly baked cookies', stock_quantity: 80, image_url: 'https://i.pinimg.com/736x/b3/7d/03/b37d033c1d92143eb5f2063b7510df5b.jpg', is_active: true },  
    { product_name: 'Ice Cream', category_id: 3, price: 3.00, description: 'Creamy vanilla ice cream', stock_quantity: 60, image_url: 'https://img.freepik.com/premium-photo/ice-cream-with-white-background-high-quality-ultra_670382-88894.jpg', is_active: true },  
    { product_name: 'Brownie', category_id: 3, price: 2.50, description: 'Chocolate brownie with nuts', stock_quantity: 70, image_url: 'https://img.freepik.com/premium-photo/delicious-chocolate-brownies-white-background-tasty-dessert_495423-51062.jpg', is_active: true }  
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

  
  // Insert sample tables

  await knex('Tables').insert([
    { table_name: 'Bàn 1', is_available: true},
    { table_name: 'Bàn 2', is_available: true},
    { table_name: 'Bàn 3', is_available: true},
    { table_name: 'Bàn 4', is_available: true},
    { table_name: 'Bàn 5', is_available: true},
    { table_name: 'Bàn 6', is_available: true},
    { table_name: 'Bàn 7', is_available: true},
    { table_name: 'Bàn 8', is_available: true},
    { table_name: 'Bàn 9', is_available: true},
    { table_name: 'Bàn 10', is_available: true},
    { table_name: 'Bàn 11', is_available: true},
    { table_name: 'Bàn 12', is_available: true},
    { table_name: 'Bàn 13', is_available: true},
    { table_name: 'Bàn 14', is_available: true},
    { table_name: 'Bàn 15', is_available: true},
    { table_name: 'Bàn 16', is_available: true},
    { table_name: 'Bàn 17', is_available: true},
    { table_name: 'Bàn 18', is_available: true},
    { table_name: 'Bàn 19', is_available: true},
    { table_name: 'Bàn 20', is_available: true},
  ]);
};

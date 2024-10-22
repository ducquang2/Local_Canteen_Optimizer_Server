/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    // Users table
    await knex.schema.createTable('Users', (table) => {
        table.increments('user_id').primary();
        table.string('username', 100).unique().notNullable();
        table.string('password', 255).notNullable();
        table.string('full_name', 255);
        table.string('phone_number', 20);
        table
            .string('role', 20)
            .defaultTo('staff')
            .checkIn(['admin', 'manager', 'staff']);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });

    // Customers table
    await knex.schema.createTable('Customers', (table) => {
        table.increments('customer_id').primary();
        table.string('full_name', 255).notNullable();
        table.string('email', 100).unique();
        table.string('phone_number', 20);
        table.string('address', 255);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });

    // Categories table
    await knex.schema.createTable('Categories', (table) => {
        table.increments('category_id').primary();
        table.string('category_name', 255).notNullable();
        table.text('description');
    });

    // Products table
    await knex.schema.createTable('Products', (table) => {
        table.increments('product_id').primary();
        table.string('product_name', 255).notNullable();
        table
            .integer('category_id')
            .references('category_id')
            .inTable('Categories')
            .onDelete('CASCADE');
        table.decimal('price', 10, 2).notNullable();
        table.text('description');
        table.integer('stock_quantity').defaultTo(0);
        table.string('image_url', 255);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.boolean('is_active');
    });

    // Orders table
    await knex.schema.createTable('Orders', (table) => {
        table.increments('order_id').primary();
        table
            .integer('customer_id')
            .references('customer_id')
            .inTable('Customers')
            .onDelete('SET NULL');
        table
            .enu('order_status', ['pending', 'confirmed', 'cancelled'])
            .defaultTo('pending');
        table.decimal('total_price', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });

    // Order_Items table
    await knex.schema.createTable('Order_Items', (table) => {
        table.increments('order_item_id').primary();
        table
            .integer('order_id')
            .references('order_id')
            .inTable('Orders')
            .onDelete('CASCADE');
        table
            .integer('product_id')
            .references('product_id')
            .inTable('Products')
            .onDelete('CASCADE');
        table.integer('quantity').notNullable();
        table.decimal('price', 10, 2).notNullable();
    });

    // Purchase_Orders table
    await knex.schema.createTable('Purchase_Orders', (table) => {
        table.increments('purchase_order_id').primary();
        table.decimal('total_price', 10, 2);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });

    // Purchase_Order_Items table
    await knex.schema.createTable('Purchase_Order_Items', (table) => {
        table.increments('purchase_order_item_id').primary();
        table
            .integer('purchase_order_id')
            .references('purchase_order_id')
            .inTable('Purchase_Orders')
            .onDelete('CASCADE');
        table
            .integer('product_id')
            .references('product_id')
            .inTable('Products')
            .onDelete('CASCADE');
        table.integer('quantity').notNullable();
        table.decimal('price', 10, 2).notNullable();
    });

    // Promotions table
    await knex.schema.createTable('Promotions', (table) => {
        table.increments('promotion_id').primary();
        table.string('promotion_name', 255).notNullable();
        table.text('description');
        table
            .enu('discount_type', ['percentage', 'fixed_amount'])
            .notNullable();
        table.decimal('discount_value', 10, 2).notNullable();
        table.date('start_date').notNullable();
        table.date('end_date').notNullable();
        table.decimal('min_order_value', 10, 2);
        table.decimal('max_discount_amount', 10, 2);
        table.boolean('is_active').defaultTo(true);
    });

    // Order_Promotions table
    await knex.schema.createTable('Order_Promotions', (table) => {
        table.increments('order_promotion_id').primary();
        table
            .integer('order_id')
            .references('order_id')
            .inTable('Orders')
            .onDelete('CASCADE');
        table
            .integer('promotion_id')
            .references('promotion_id')
            .inTable('Promotions')
            .onDelete('CASCADE');
        table.decimal('discount_amount', 10, 2).notNullable();
    });

    // Expenses table
    await knex.schema.createTable('Expenses', (table) => {
        table.increments('expense_id').primary();
        table.decimal('amount', 10, 2).notNullable();
        table.text('description');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('Expenses');
    await knex.schema.dropTableIfExists('Order_Promotions');
    await knex.schema.dropTableIfExists('Promotions');
    await knex.schema.dropTableIfExists('Purchase_Order_Items');
    await knex.schema.dropTableIfExists('Purchase_Orders');
    await knex.schema.dropTableIfExists('Order_Items');
    await knex.schema.dropTableIfExists('Orders');
    await knex.schema.dropTableIfExists('Products');
    await knex.schema.dropTableIfExists('Categories');
    await knex.schema.dropTableIfExists('Customers');
    await knex.schema.dropTableIfExists('Users');
};
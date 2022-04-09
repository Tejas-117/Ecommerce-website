const db = require("../config/db-config");
const SqlString = require("sqlstring");
const { newHttpError } = require("../utils/error");

const getAllOrders = async (req, res, next) => {
  try {
    const { rows } = await db.query(`SELECT * FROM orders ORDER BY delivery_status, id DESC`);
    res.status(200).json({ data: { orders: rows } });
  } catch (error) {
    return next(newHttpError(500, "Internal Server Error"));
  }
};

const createOrder = async (req, res, next) => {
  const { shipping_info: shipping, order_info, products } = req.body;
  const { id: user_id } = req.session.user;

  try {
    // // Create a order
    const {
      rows: [{ id: order_id }],
    } = await db.query(
      `INSERT INTO orders (user_id, payment_status, shipping_date, price, currency) 
          VALUES ($1, $2, $3, $4, $5) RETURNING id, currency`,
      [
        user_id,
        order_info.payment_status,
        order_info.shipping_date,
        order_info.price,
        order_info.currency,
      ]
    );

    // // Add shipping information
    await db.query(
      `INSERT INTO shipping_address (order_id, address, city, state, country, postal_code, phone)
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        order_id,
        shipping.address,
        shipping.city,
        shipping.state,
        shipping.country,
        shipping.pinCode,
        shipping.phone,
      ]
    );

    // Add all products of the order
    const allProducts = [];
    products.forEach((product) => {
      const eachProductList = [
        order_id,
        Number(product.id),
        product.quantity,
        product.quantity * product.price,
        order_info.currency,
      ];

      allProducts.push(eachProductList);
    });

    const insertProductsQuery = SqlString.format(
      `INSERT INTO order_items (order_id, product_id, quantity, subtotal, currency)
      VALUES ?`,
      [allProducts]
    );
    await db.query(insertProductsQuery);

    return res.status(200).json({ data: { message: "Order Added", order_id } });
  } catch (err) {
    return next(newHttpError(500, "Internal server error"));
  }
};

const getAllOrdersOfUser = async (req, res, next) => {
  const { id: user_id } = req.session.user;

  try {
    const { rows } = await db.query(
      `SELECT orders.id, payment_status, created_at, price, currency, address, city, state, country, postal_code, phone
         FROM orders 
         JOIN shipping_address 
           ON orders.id = shipping_address.order_id
         WHERE user_id = $1
         ORDER BY orders.id DESC`,
      [user_id]
    );

    return res.status(200).json({ data: { orders: rows } });
  } catch (err) {
    next(newHttpError(500, "Internal Server Error"));
  }
};

const updatePaymentStatus = async (req, res, next) => {
  const { orderID } = req.params;

  try {
    await db.query(
      `UPDATE orders SET payment_status = 'paid', delivery_status='processing' WHERE id = $1`,
      [orderID]
    );
    return res
      .status(200)
      .json({ data: { message: "Payment status updated" } });
  } catch (err) {
    return next(newHttpError(500, "Internal server error"));
  }
};

const fulfillOrder = async (req, res, next) => {
  const { shippingDate } = req.body;
  const { orderID } = req.params;

  try {
    await db.query(
      `UPDATE orders SET shipping_date = $1, delivery_status = 'shipped' WHERE id = $2`,
      [shippingDate, orderID]
    );

    res.status(200).json({ data: { message: "Order fulfilled" } });
  } catch (error) {
    return next(newHttpError(500, "Internal Server Error"));
  }
};

const getOrderById = async (req, res, next) => {
  const { orderID } = req.params;

  try {
    const { rows } = await db.query(
      `
         SELECT products.id, products.name, products.price, order_items.quantity, order_items.subtotal, images.image_url
         FROM order_items
         JOIN products
           ON order_items.product_id = products.id
         JOIN images
           ON images.product_id = order_items.product_id AND images.id = (SELECT MIN(id) FROM images WHERE product_id = products.id)                                                     
         WHERE order_id = $1
      `,
      [orderID]
    );

    return res.status(200).json({ data: { order: rows } });
  } catch (err) {
    return next(newHttpError(500, "Internal server error"));
  }
};

const deleteOrderById = async (req, res, next) => {
  const { orderID } = req.params;

  try {
    await db.query(`DELETE FROM orders WHERE id = $1`, [orderID]);
    res.status(200).json({ data: { message: "Order deleted" } });
  } catch (error) {
    return next(newHttpError(500, "Internal server error"));
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updatePaymentStatus,
  fulfillOrder,
  getAllOrdersOfUser,
  getOrderById,
  deleteOrderById,
};

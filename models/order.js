module.exports = class Order {
  static getUserOrders(userId) {
    return process.postgresql.query(
      "Select * from orders join order_item on order_item.order_id = orders.id join products on products.id = order_item.product_id where orders.user_id = $1",
      [userId],
    );
  }
};

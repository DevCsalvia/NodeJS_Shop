module.exports = class Cart {
  static createCart(userId) {
    return process.postgresql.query("Insert into cart (user_id) values ($1)", [
      userId,
    ]);
  }

  static async getCurrentUserCart(userId) {
    const rows = await process.postgresql.query(
      "select * from cart where user_id = $1",
      [userId],
    );

    return rows[0];
  }

  static async getAllCartItems(userId) {
    const { id: cartId } = await Cart.getCurrentUserCart(userId);

    return await process.postgresql.query(
      "Select * from cart_item join products on products.id = cart_item.product_id where cart_id = $1",
      [cartId],
    );
  }

  static async getCartItem(cartId, productId) {
    const rows = await process.postgresql.query(
      "select * from cart_item where cart_id = $1 and product_id = $2",
      [cartId, productId],
    );

    return rows[0];
  }

  static async addProductToCart(prodId, userId) {
    const cart = await this.getCurrentUserCart(userId);

    const cart_item = await this.getCartItem(cart.id, prodId);

    return process.postgresql.query(
      cart_item
        ? "update cart_item set quantity = quantity + 1 where cart_id = $1 and product_id = $2"
        : "insert into cart_item (cart_id, product_id, quantity) values ($1, $2, 1)",
      [cart.id, prodId],
    );
  }

  static async deleteCartItem(prodId, userId) {
    const cart = await this.getCurrentUserCart(userId);

    return await process.postgresql.query(
      "delete from cart_item where cart_id = $1 and product_id = $2",
      [cart.id, prodId],
    );
  }
};

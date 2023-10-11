module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  static async fetchUserProducts(userId) {
    return (await userId)
      ? process.postgresql.query("Select * from products where user_id = $1", [
          userId,
        ])
      : process.postgresql.query("Select * from products");
  }

  static async findById(id) {
    return await process.postgresql.query(
      "Select * from products where id = $1",
      [id],
    );
  }

  static async deleteById(id, userId) {
    return await process.postgresql.query(
      "Delete from products where id = $1 and user_id = $2",
      [id, userId],
    );
  }

  updateProduct() {
    console.log(
      this.title,
      this.price,
      this.imageUrl,
      this.description,
      this.id,
    );

    return process.postgresql.query(
      "Update products set title = $1, price = $2, image_url = $3, description = $4 where id = $5",
      [this.title, this.price, this.imageUrl, this.description, this.id],
    );
  }

  save(userId) {
    return process.postgresql.query(
      `INSERT INTO "products" ("title", "price", "image_url", "description", "user_id") 
      values ($1, $2, $3, $4, $5)
      ON CONFLICT DO NOTHING;`,
      [this.title, this.price, this.imageUrl, this.description, userId],
    );
  }
};

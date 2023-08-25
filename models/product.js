module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  static fetchAll(cb) {
    return process.postgresql.query("Select * from products");
  }

  static findById(id) {
    return process.postgresql.query(
      `Select * from products where products.id = $1`,
      [id],
    );
  }

  static deleteById(id) {}

  save() {
    return process.postgresql.query(
      `INSERT INTO "products" ("title", "price", "imageUrl", "description") 
      values ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING;`,
      [this.title, this.price, this.imageUrl, this.description],
    );
  }
};

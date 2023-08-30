const Cart = require("./models/cart");
const User = require("./models/user");
const path = require("path");
const Product = require("./models/product");
const sequelize = require("./util/database");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const bodyParser = require("body-parser");
const express = require("express");
const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
sequelize
  // .sync({ force: true })
  .sync()
  .then((res) => {
    return User.findByPk(1);
    // console.log(res);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Artur", email: "test@test.com" });
    }
    return user;
  })
  // .then((user) => {
  //   // console.log(user);
  //   return user.createCart();
  // })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

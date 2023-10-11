const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.fetchUserProducts()
    .then((rows) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) =>
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product[0].title,
        path: "/products",
      }),
    )
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchUserProducts()
    .then((rows) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = async (req, res, next) => {
  const cartItems = await Cart.getAllCartItems(req.session.user.id);

  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: cartItems,
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  await Cart.addProductToCart(prodId, req.session.user.id);
  res.redirect("/cart");
};

exports.postCartDeleteItem = async (req, res, next) => {
  const prodId = req.body.productId;

  await Cart.deleteCartItem(prodId, req.session.user.id);

  res.redirect("/cart");
};

exports.getOrders = async (req, res, next) => {
  const orders = await Order.getUserOrders(req.session.user.id);

  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders: orders,
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(null, title, imageUrl, price, description);
  product
    .save(req.session.user.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  Product.findById(prodId).then((rows) => {
    const product = rows[0];
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDesc,
  );

  Product.findById(prodId).then((rows) => {
    const productToUpdate = rows[0];
    if (productToUpdate?.userId !== req.session.user.id) {
      return res.redirect("/");
    }

    updatedProduct.updateProduct().then(() => {
      res.redirect("/admin/products");
    });
  });
};

exports.getProducts = async (req, res, next) => {
  const rows = await Product.fetchUserProducts(req.session.user.id);

  res.render("admin/products", {
    prods: rows,
    pageTitle: "Admin Products",
    path: "/admin/products",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await Product.deleteById(prodId, req.session.user.id);
  res.redirect("/admin/products");
};

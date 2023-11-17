const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const ErrorHandler = require("./ErrorHandler");

// Models
const Product = require("./models/product");

// koneksi ke mongoose
mongoose
  .connect("mongodb://127.0.0.1/ecom")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //digunakan untuk membaca body
app.use(methodOverride("_method")); // untuk menggantikan method yang disematkan ke dalam form

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "All" });
  }
});

app.get("/products/create", (req, res) => {
  res.render("products/create");
});

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`);
});

app.get(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/show", { product });
  })
);

app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", { product });
  })
);

app.put(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/products/${product._id}`);
  })
);

app.delete(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  })
);

app.use((err, req, res, next) => {
  console.dir(err);
  if (err.name === "ValidationError") {
    err.status = 400;
    err.message = Object.values(err.errors).map((item) => item.message);
  }
  if (err.name === "CastError") {
    err.status = 404;
    err.message = "Product not found";
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`ecom app listening on http://127.0.0.1:${port}`);
});

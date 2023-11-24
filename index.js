const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const ErrorHandler = require("./ErrorHandler");
const cookieParser = require("cookie-parser");

// Models
const Product = require("./models/product");
const Konveksi = require("./models/konveksi");

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

// define middleware
app.use(express.urlencoded({ extended: true })); //digunakan untuk membaca body
app.use(methodOverride("_method")); // untuk menggantikan method yang disematkan ke dalam form
app.use(cookieParser("secret-key"));

//define routes
app.use("/theater", require("./routes/theater"));
app.use("/movies", require("./routes/movies"));
app.use("/admin", require("./routes/admin"));

//route untuk membuat cookie
app.get("/signingin", (req, res) => {
  res.cookie("shiping", "bags", { signed: true });
  res.send("signed in");
});

//route untuk mendapatkan data cookie
app.get("/verifycookies", (req, res) => {
  const cookies = req.signedCookies;
  res.send(cookies);
});

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get(
  "/konveksis",
  wrapAsync(async (req, res) => {
    const konveksis = await Konveksi.find({});
    res.render("konveksi/index", { konveksis });
  })
);

app.get("/konveksis/create", (req, res) => {
  res.render("konveksi/create");
});

app.post(
  "/konveksis",
  wrapAsync(async (req, res) => {
    const konveksi = new Konveksi(req.body);
    await konveksi.save();
    res.redirect(`/konveksis`);
  })
);

app.get(
  "/konveksis/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const konveksi = await Konveksi.findById(id).populate("products");
    res.render("konveksi/show", { konveksi });
  })
);

// route untuk mengedit konveksi yang sekaligus berpengaruh dengan product
app.get("/konveksis/:konveksi_id/products/create", async (req, res) => {
  const { konveksi_id } = req.params;
  res.render("products/create", { konveksi_id });
});

// /konveksis/:konveksi_id/product/
app.post(
  "/konveksis/:konveksi_id/products",
  wrapAsync(async (req, res) => {
    const { konveksi_id } = req.params;
    const konveksi = await Konveksi.findById(konveksi_id); // find data konveksi  id dimasukkan ke object konveksi
    const product = new Product(req.body); // menyiapkan data product yg otomatis punya id
    konveksi.products.push(product); // data product ditambahkan ke objek konveksi
    product.konveksi = konveksi; // data konveksi ditambahkan ke data product
    await konveksi.save(); // disave dikonveksi
    await product.save(); // disave di bagian product
    res.redirect(`/konveksis/${konveksi_id}`);
  })
);

app.delete("/konveksis/:konveksi_id", async (req, res) => {
  const { konveksi_id } = req.params;
  const konveksi = await Konveksi.findOneAndDelete({ _id: konveksi_id });
  res.redirect("/konveksis");
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
    const product = await Product.findById(id).populate("konveksi");
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

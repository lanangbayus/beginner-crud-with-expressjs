const mongoose = require("mongoose");
const Product = require("./models/product");
const port = 3000;

mongoose
  .connect("mongodb://127.0.0.1/ecom")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

const seedProducts = [
  {
    name: "Kemeja Flanel",
    brand: "Hollister",
    price: 750000,
    color: "biru muda",
    size: "L",
    category: "Baju",
  },
  {
    name: "Celana Chino",
    brand: "Levi's",
    price: 900000,
    color: "krem",
    size: "L",
    category: "Celana",
  },
  {
    name: "Sweater",
    brand: "Gap",
    price: 650000,
    color: "merah muda",
    size: "XL",
    category: "Jaket",
  },
  {
    name: "Tas Ransel",
    brand: "Herschel",
    price: 1500000,
    color: "biru",
    size: "L",
    category: "Aksesoris",
  },
  {
    name: "Kacamata Aviator",
    brand: "Ray-Ban",
    price: 2000000,
    color: "emas",
    size: "L",
    category: "Aksesoris",
  },
  {
    name: "Baju Renang",
    brand: "Speedo",
    price: 500000,
    color: "biru tua",
    size: "M",
    category: "Baju",
  },
  {
    name: "Topi Baseball",
    brand: "New Era",
    price: 350000,
    color: "hitam",
    size: "L",
    category: "Aksesoris",
  },
  {
    name: "Rompi",
    brand: "Zara",
    price: 850000,
    color: "abu-abu",
    size: "S",
    category: "Aksesoris",
  },
  {
    name: "Jas",
    brand: "Hugo Boss",
    price: 4500000,
    color: "hitam",
    size: "XL",
    category: "Baju",
  },
];

Product.insertMany(seedProducts)
  .then(() => {
    console.log("data inserted");
  })
  .catch((err) => {
    console.log(err);
  });

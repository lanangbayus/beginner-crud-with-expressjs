const mongoose = require("mongoose");
const Product = require("./product");

const konveksiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama tidak boleh kosong"],
  },
  location: {
    type: String,
  },
  contact: {
    type: String,
    required: [true, "Kontak tidak boleh kosong"],
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

konveksiSchema.post("findOneAndDelete", async function (konveksi) {
  // object konveksi yang menjalankan findOneAndDelete
  if (konveksi.products.length) {
    // jika konveksi yang dihapus apakah memiliki data products
    const res = await Product.deleteMany({
      // jika ada deleteMay berdasarkan _id
      _id: {
        $in: konveksi.products,
      },
    });
    console.log(res);
  }
});

const Konveksi = mongoose.model("Konveksi", konveksiSchema);

module.exports = Konveksi;

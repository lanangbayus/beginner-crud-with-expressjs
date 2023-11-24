const express = require("express");
const router = express.Router();

// restful theater
router.get("/", (req, res) => {
  res.send("movie index");
});

router.get("/create", (req, res) => {
  res.send("movie create");
});

router.post("/", (req, res) => {
  res.send("movie store");
});

router.get("/:id", (req, res) => {
  res.send("movie show");
});

router.put("/:id", (req, res) => {
  res.send("movie update");
});

router.delete("/:id", (req, res) => {
  res.send("movie delete");
});

module.exports = router;

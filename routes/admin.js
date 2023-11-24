const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.query.isAdmin) {
    next();
  }
  res.send("You are not an administrator");
});

router.get("/", (req, res) => {
  res.cookie("token", "123456abcd");
  res.cookie("user", "admin");
  res.send("administrator");
});

module.exports = router;

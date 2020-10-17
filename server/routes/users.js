const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json([
    { id: 1, username: "Yuseonggeun" },
    { id: 2, username: "Jangseongkyun" },
  ]);
});

module.exports = router;

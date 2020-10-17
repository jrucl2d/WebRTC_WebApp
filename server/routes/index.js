const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.send("zz");
});

module.exports = router;

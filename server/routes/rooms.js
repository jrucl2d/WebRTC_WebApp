const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.send("a");
});

router.post("/make", async (req, res, next) => {});

module.exports = router;

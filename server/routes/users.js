const router = require("express").Router();
const userData = require("../userData");

router.get("/", (req, res, next) => {
  res.json([
    { id: 1, username: "Yuseonggeun" },
    { id: 2, username: "Jangseongkyun" },
  ]);
});

router.post("/login", (req, res, next) => {
  const wantToLogin = req.body;
  let exUser = null;
  userData.forEach((user) => {
    if (user.id === wantToLogin.id) {
      exUser = user;
    }
  });
  if (exUser) {
    if (exUser.password === wantToLogin.password) {
      return res.send({ message: "ok" });
    } else {
      return res.send({ message: "pwErr" });
    }
  } else {
    return res.send({ message: "noUser" });
  }
});

module.exports = router;

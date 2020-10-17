const router = require("express").Router();
const fs = require("fs").promises;

router.get("/", (req, res, next) => {
  res.send("");
});

router.post("/login", async (req, res, next) => {
  const wantToLogin = req.body;
  const userDataFile = await fs.readFile("./userData.json");
  const userData = JSON.parse(userDataFile);
  if (userData[wantToLogin.id]) {
    if (userData[wantToLogin.id].password === wantToLogin.password) {
      return res.send({ message: "ok" });
    } else {
      return res.send({ message: "pwErr" });
    }
  } else {
    return res.send({ message: "noUser" });
  }
});

router.post("/register", async (req, res, next) => {
  const newUser = req.body;
  const userDataFile = await fs.readFile("./userData.json");
  const userData = JSON.parse(userDataFile);

  if (userData[newUser.id]) {
    return res.send({ message: "exist" });
  }
  userData[newUser.id] = { password: newUser.password };
  await fs.writeFile("./userData.json", JSON.stringify(userData));
  res.send({ message: "ok" });
});

module.exports = router;

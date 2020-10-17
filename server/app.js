const express = require("express");
const path = require("path");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 8000);

app.get("/", (req, res, next) => {
  res.send("ok");
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} error`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(`${err.message} => 
  ${process.env.NODE_ENV !== "production" ? err : {}}`);
});

app.listen(app.get("port"), () => {
  console.log(`server is running on port ${app.get("port")}`);
});

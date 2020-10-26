const express = require("express");
const path = require("path");
const morgan = require("morgan");
const app = express();
const webSocket = require("./socket");

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 8000);

// Routing
app.use("/rooms", require("./routes/rooms"));

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

const server = app.listen(app.get("port"), () => {
  console.log(`server is running on port ${app.get("port")}`);
});

webSocket(server);

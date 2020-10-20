const socketIO = require("socket.io");

module.exports = (server) => {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    socket.on("onCollabo", (id) => {
      console.log(id, "가 참여");
    });
  });
};

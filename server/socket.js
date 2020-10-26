const socketIO = require("socket.io");

module.exports = (server) => {
  const io = socketIO(server);

  io.on("connect", (socket) => {});
};

const socketIO = require("socket.io");
const rooms = require("./roomData");

module.exports = (server) => {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    // 새로운 멤버가 join했을 때
    socket.on("join", ({ roomID }) => {
      socket.broadcast.to(roomID).emit("newMemberJoined", rooms);
    });
  });
};

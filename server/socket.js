const socketIO = require("socket.io");

const rooms = {};

module.exports = async (server) => {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    socket.on("join room", (roomID) => {
      if (rooms[roomID]) {
        rooms[roomID].push(socket.id);
      } else {
        rooms[roomID] = [socket.id]; // 방장은 배열에 넣어서 처음 넣어줌
      }
      const otherUser = rooms[roomID].find((id) => id !== socket.id);
      if (otherUser) {
        socket.emit("other user", otherUser); // 본인에게 기존 사람이 있다고 알림
        socket.to(otherUser).emit("user joined", socket.id); // 기존 사람에게는 본인이 새로 들어간다고 알림
      }
    });
    socket.on("offer", (payload) => {
      io.to(payload.target).emit("offer", payload); // 전송하고 싶은 offer을 target에게 재전송
    });
    socket.on("answer", (payload) => {
      io.to(payload.target).emit("answer", payload);
    });
    socket.on("ice-candidate", (incoming) => {
      io.to(incoming.target).emit("ice-candidate", incoming);
    });
  });
};

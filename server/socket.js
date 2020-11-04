const socketIO = require("socket.io");

const rooms = {
  wlekgjweljgkwelkgj12421: {
    roomName: "바보방",
    members: [],
  },
};

module.exports = async (server) => {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    socket.on("get room list", () => {
      socket.emit("give room list", rooms);
    });
    socket.on("make room", ({ roomName, roomID }) => {
      // 방 생성
      console.log(roomName + "방 생성!");
      rooms[roomID] = {
        roomName,
        members: [],
      };
      socket.emit("give room list", rooms);
    });

    socket.on("join room", (roomID) => {
      if (rooms[roomID]) {
        rooms[roomID].push(socket.id);
      } else {
        rooms[roomID] = [socket.id]; // 방장은 배열에 넣어서 처음 넣어줌
      }
      const otherUsers = rooms[roomID].filter((id) => id !== socket.id);
      if (otherUsers) {
        socket.emit("other users", otherUsers); // 본인에게 기존 사람이 있다고 알림
        socket.broadcast.emit("user joined", socket.id); // 기존 사람들에게는 본인이 새로 들어간다고 알림
      }
    });
    socket.on("offer", (payload) => {
      io.to(payload.target).emit("offer", payload); // 전송하고 싶은 offer을 target에게 재전송
    });
    socket.on("answer", (payload) => {
      io.to(payload.target).emit("answer", payload);
    });
    socket.on("ice-candidate", (incoming) => {
      socket.broadcast.emit("ice-candidate", incoming);
    });

    socket.on("out room", (id) => {
      console.log(`${id}가 나갔누.`);
      io.emit("member out", id);
    });
  });
};

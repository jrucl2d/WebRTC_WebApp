const socketIO = require("socket.io");
const rooms = require("./roomsData");

const getExactRoom = (roomID) => {
  let exRoom = null;
  rooms.forEach((v) => {
    if (v.roomID === roomID) {
      exRoom = v;
    }
  });
  return exRoom;
};

module.exports = (server) => {
  const io = socketIO(server);

  io.on("connect", (socket) => {
    socket.on("getRoomList", () => {
      socket.emit("giveRoomList", rooms);
    });
    socket.on("makeRoom", (roomID) => {
      const exRoom = getExactRoom(roomID);
      if (!exRoom) {
        // 기존에 없는 방이면 생성
        rooms.push({ roomID, members: [] });
        socket.emit("makeRoomSuccess", { message: "방을 생성했습니다", rooms });
      } else {
        socket.emit("makeRoomFailure", { message: "이미 존재하는 방입니다" });
      }
    });
  });
};

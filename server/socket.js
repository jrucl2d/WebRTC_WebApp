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
      rooms.push({ roomID, member: [] });
      socket.emit("giveRoomList", rooms);
    });
  });
};

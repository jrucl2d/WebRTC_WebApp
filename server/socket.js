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
    // room에 들어가기 전 room과 관련한 통신
    socket.on("getRoomList", () => {
      socket.emit("giveRoomList", rooms);
    });
    socket.on("makeRoom", (roomID) => {
      rooms.push({ roomID, member: [] });
      io.emit("giveRoomList", rooms); // 전체에게 전달
    });
    socket.on("joinRoom", ({ roomID, username }) => {
      const exRoom = getExactRoom(roomID);
      exRoom.members.push(username);
      socket.join(roomID);
      // console.log(socket.adapter.rooms);
    });

    // room에 들어간 후 멤버와 관련된 통신
    socket.on("getMemberList", (roomID) => {
      const exRoom = getExactRoom(roomID);
      io.emit("giveMemberList", exRoom.members);
    });
  });
};

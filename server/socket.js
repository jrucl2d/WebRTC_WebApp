const socketIO = require("socket.io");
const fs = require("fs").promises;

const getExactRoom = (rooms, roomID) => {
  let exRoom = null;
  rooms.forEach((v) => {
    if (v.roomID === roomID) {
      exRoom = v;
    }
  });
  return exRoom;
};

module.exports = async (server) => {
  const io = socketIO(server);
  const roomsFile = await fs.readFile("./roomsData.json");
  const rooms = JSON.parse(roomsFile).rooms;

  io.on("connect", (socket) => {
    // room에 들어가기 전 room과 관련한 통신
    socket.on("getRoomList", () => {
      socket.emit("giveRoomList", rooms);
    });
    socket.on("makeRoom", async (roomID) => {
      rooms.push({ roomID, member: [] });
      await fs.writeFile(
        "./roomsData.json",
        JSON.stringify({
          rooms,
        })
      );
      io.emit("giveRoomList", rooms); // 전체에게 전달
    });
    socket.on("joinRoom", async ({ roomID, username }) => {
      const exRoom = getExactRoom(rooms, roomID);
      exRoom.members.push(username);
      await fs.writeFile(
        "./roomsData.json",
        JSON.stringify({
          rooms,
        })
      );
      socket.join(roomID);
      socket.broadcast.emit("giveMemberList", exRoom.members);
    });
    socket.on("memberDisconnect", async ({ username, roomID }) => {
      socket.leave(roomID);
      const exRoom = getExactRoom(rooms, roomID);
      if (!exRoom) {
        return;
      }
      const newMembers = exRoom.members.filter((v) => v !== username);
      exRoom.members = newMembers;
      await fs.writeFile(
        "./roomsData.json",
        JSON.stringify({
          rooms,
        })
      );
      io.emit("giveMemberList", exRoom.members);
    });

    // room에 들어간 후 멤버와 관련된 통신
    socket.on("getMemberList", (roomID) => {
      const exRoom = getExactRoom(rooms, roomID);
      if (!exRoom) {
        io.emit("noRoom");
      } else {
        io.emit("giveMemberList", exRoom.members);
      }
    });

    // webRTC 관련 통신
    socket.on("join room", ({ roomID, username }) => {
      const exRoom = getExactRoom(rooms, roomID);
      const otherIndex = exRoom.members.findIndex(
        (member) => member != username
      );
      if (otherIndex !== -1) {
        socket.emit("other user", exRoom.members[otherIndex]);
      }
    });
    socket.on("offer", (payload) => {
      socket.broadcast.emit("offer", payload);
    });
    socket.on("answer", (payload) => {
      socket.broadcast.emit("answer", payload);
    });
    socket.on("iceCandidate", (gotInfo) => {
      socket.broadcast.emit("iceCandidate", gotInfo.candidate);
    });
  });
};

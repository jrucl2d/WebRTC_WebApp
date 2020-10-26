const socketIO = require("socket.io");
const rooms = require("./roomData");

module.exports = (server) => {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    // 새로운 멤버가 join했을 때
    socket.on("join", ({ roomID, roomPW, member }) => {
      console.log(`${roomID}, ${roomPW}, ${member}`);
      let exroom = null;
      rooms.forEach((room) => {
        if (room.roomID === roomID) {
          exRoom = room;
        }
      });
      if (exRoom.roomPW === roomPW) {
        exRoom.member.push(member); // 해당 방에 멤버로 참여
        socket.emit("welcome", { message: "방에 입장합니다" });
        return;
      }
      socket.emit("wrongPW", { message: "비밀번호가 틀렸습니다" });
      // socket.broadcast.to(roomID).emit("newMemberJoined", rooms); // 나머지 멤버들에게 broadcast
      // socket.join(roomID); // 해당 room에 join
    });
  });
};

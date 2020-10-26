const socketIO = require("socket.io");
const rooms = require("./roomData");

const getExactRoom = (roomID) => {
  let exRoom = null;
  rooms.forEach((room) => {
    if (room.roomID === roomID) {
      exRoom = room;
    }
  });
  return exRoom;
};

module.exports = (server) => {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    // 새로운 멤버가 join했을 때
    socket.on("join", ({ roomID, roomPW, member }) => {
      console.log(`${roomID}, ${roomPW}, ${member}`);
      const exRoom = getExactRoom(roomID);
      if (exRoom.roomPW === roomPW) {
        exRoom.member.push(member); // 해당 방에 멤버로 참여
        socket.join(roomID);
        socket.emit("welcome");
        socket.broadcast.emit("memberChanged", exRoom.member);
        return;
      }
      socket.emit("wrongPW", { message: "비밀번호가 틀렸습니다" });
    });

    // 해당 유저(socket)이 연결을 해제함
    socket.on("disconnect", ({ roomID, member }) => {
      // const exRoom = getExactRoom(roomID);
      // exRoom.member = exRoom.member.filter((v) => v !== member); // 방에서 해당 멤버 제거
      // io.to(roomID).emit("memberChanged", exRoom.member);
    });

    // 유저가 새로 방에 join 하고 멤버 정보를 요청
    socket.on("roomInfo", ({ roomID }) => {
      const exRoom = getExactRoom(roomID);
      socket.emit("roomInfoFromServer", exRoom);
    });
  });
};

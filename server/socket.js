const socketIO = require("socket.io");

const rooms = {};

// 해당 socket이 방을 나가는 경우
const outRoom = (socket) => {
  let theID = "";
  Object.entries(rooms).forEach((room) => {
    let username = "";
    let exUserStreamID = "";
    const newRoomMembers = room[1].members.filter((v) => {
      if (v.socketID === socket.id) {
        theID = room[0];
        username = v.userName;
        exUserStreamID = v.streamID;
        socket.to(theID).broadcast.emit("out user", {
          username,
          streamID: exUserStreamID,
        }); // 나머지 인원에게 나간 사람 정보 broadcast
      }
      socket.leave(theID);
      if (v.socketID !== socket.id) {
        return v;
      }
    });
    room[1].members = newRoomMembers; // rooms의 정보 갱신
  });
  socket.to(theID).broadcast.emit("give room list", rooms);
};

module.exports = async (server) => {
  const io = socketIO(server);
  io.on("connection", (socket) => {
    socket.on("get room list", () => {
      socket.emit("give room list", rooms);
    });
    socket.on("make room", ({ roomName, roomID }) => {
      // 방 생성
      console.log(roomName + "/" + roomID + "방 생성!");
      rooms[roomID] = {
        roomName,
        members: [],
      };
      io.emit("give room list", rooms);
    });

    socket.on("join room", ({ roomID, streamID, userName }) => {
      if (rooms[roomID]) {
        rooms[roomID].members.push({ socketID: socket.id, streamID, userName });
      } else {
        rooms[roomID].members = [{ socketID: socket.id, streamID, userName }]; // 방장은 배열에 넣어서 처음 넣어줌
      }
      const otherUsers = rooms[roomID].members.filter(
        (id) => id.socketID !== socket.id
      );
      socket.join(roomID);
      if (otherUsers) {
        socket.emit("other users", otherUsers); // 본인에게 기존 사람이 있다고 알림
        socket.to(roomID).broadcast.emit("user joined", {
          socketID: socket.id,
          streamID,
          userName,
        }); // 기존 사람들에게는 본인이 새로 들어간다고 알림
      }
    });
    socket.on("offer", (payload) => {
      io.to(payload.target).emit("offer", payload); // 전송하고 싶은 offer을 target에게 재전송
    });
    socket.on("answer", (payload) => {
      io.to(payload.target).emit("answer", payload);
    });
    socket.on("ice-candidate", (incoming) => {
      socket.to(incoming.roomID).broadcast.emit("ice-candidate", incoming);
    });

    // 창을 완전히 닫았을 경우
    socket.on("disconnect", () => {
      outRoom(socket);
    });

    // 뒤로가기로 방을 나갔을 경우
    socket.on("out room", () => {
      outRoom(socket);
    });
  });
};

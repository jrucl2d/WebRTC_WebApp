const router = require("express").Router();
const rooms = [
  {
    roomID: "굉장한방",
    roomPW: "123",
    member: [],
  },
];

// 방 정보를 요구
router.get("/all", async (req, res, next) => {
  res.json(rooms);
});

router.get("/:roomID/members", (req, res, next) => {
  let exRoom = null;
  rooms.forEach((room) => {
    if (room.roomID === req.params.roomID) {
      exRoom = room;
    }
  });
  res.send(exRoom.member);
});

router.post("/make", async (req, res, next) => {
  const newRoom = req.body;
  let exRoom = null;
  rooms.forEach((room) => {
    if (room.roomID === newRoom.roomID) {
      exRoom = room;
    }
  });
  if (exRoom) {
    return res.send({ message: "exist" });
  } else {
    rooms.push(newRoom);
    return res.send({ message: "ok" });
  }
});

router.post("/join", async (req, res, next) => {
  const { roomID, roomPW, member } = req.body;
  let exRoom = null;
  rooms.forEach((room) => {
    if (room.roomID === roomID) {
      exRoom = room;
    }
  });
  if (exRoom.roomPW === roomPW) {
    exRoom.member.push(member); // 해당 방에 멤버로 참여
    return res.send({ message: "ok" });
  }
  res.send({ message: "pwErr" });
});

module.exports = router;

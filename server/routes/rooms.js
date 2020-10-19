const router = require("express").Router();
const rooms = [
  {
    roomID: "굉장한 방",
    roomPW: "123",
  },
];

// 방 정보를 요구
router.get("/all", async (req, res, next) => {
  res.json(rooms);
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
  const { roomID, roomPW } = req.body;
  let exRoom = null;
  rooms.forEach((room) => {
    if (room.roomID === roomID) {
      exRoom = room;
    }
  });
  if (exRoom.roomPW === roomPW) {
    return res.send({ message: "ok" });
  }
  res.send({ message: "pwErr" });
});

module.exports = router;

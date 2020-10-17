const router = require("express").Router();
const rooms = [
  {
    roomID: "123",
    roomPW: "123",
  },
];

router.get("/", (req, res, next) => {
  res.send("a");
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
  const wantRoom = req.body;
  let exRoom = null;
  rooms.forEach((room) => {
    if (room.roomID === wantRoom.roomID) {
      exRoom = room;
    }
  });
  if (!exRoom) {
    return res.send({ message: "no" });
  }
  if (exRoom.roomPW === wantRoom.roomPW) {
    return res.send({ message: "ok" });
  } else {
    return res.send({ message: "pwErr" });
  }
});

module.exports = router;

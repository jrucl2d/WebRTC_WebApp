const router = require("express").Router();
const rooms = require("../roomData");

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

module.exports = router;

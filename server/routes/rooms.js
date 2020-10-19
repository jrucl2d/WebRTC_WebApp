const router = require("express").Router();
const rooms = [
  {
    roomID: "굉장한 방",
    roomPW: "123",
  },
];

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
router.get("/all", async (req, res, next) => {
  res.json(rooms);
});

module.exports = router;

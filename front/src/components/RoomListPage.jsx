import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const SERVERLOCATION = "localhost:8000";
let socket;

function RoomListPage() {
  const roomIDRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [roomID, setRoomID] = useState("");

  useEffect(() => {
    socket = io(SERVERLOCATION);
    socket.emit("getRoomList");
  }, []);
  useEffect(() => {
    socket.on("giveRoomList", (rooms) => {
      setRooms(rooms);
    });
  }, [rooms]);

  const onChangeRoomID = (e) => {
    setRoomID(e.target.value);
  };
  const onClickMakeRoom = (e) => {
    e.preventDefault();
    if (roomID === "") {
      alert("방 이름을 입력하세요");
      return;
    }
    let exRoom = null;
    rooms.forEach((room) => {
      if (room.roomID === roomID) {
        exRoom = room;
      }
    });
    if (exRoom) {
      alert("이미 존재하는 방입니다");
      return;
    }
    alert(`[${roomID}] 방이 생성되었습니다`);
    setRoomID("");
    roomIDRef.current.value = "";
    socket.emit("makeRoom", roomID);
  };

  return (
    <div>
      <h1>회의방 목록</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.roomID}>
            <Link to={`/room/${room.roomID}`}>{room.roomID}</Link>
          </li>
        ))}
      </ul>
      <form>
        <h2>방 새로 만들기</h2>
        <input
          type="text"
          name="roomID"
          value={roomID}
          onChange={onChangeRoomID}
          placeholder="방 이름을 입력하세요"
          ref={roomIDRef}
        />
        <button onClick={onClickMakeRoom}>생성</button>
      </form>
    </div>
  );
}

export default RoomListPage;

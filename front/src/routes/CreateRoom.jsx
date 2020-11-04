import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";

const SERVERLOCATION = "localhost:8000";
let socket;

function CreateRoom() {
  const roomNameRef = useRef(null);
  const [rooms, setRooms] = useState({});
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket = io(SERVERLOCATION);
    // console.log(socket);

    socket.emit("get room list");
  }, []);
  useEffect(() => {
    socket.on("give room list", (rooms) => {
      setRooms(rooms);
    });
  }, [rooms]);

  const onChangeRoomName = (e) => {
    setRoomName(e.target.value);
  };
  const onClickMakeRoom = (e) => {
    e.preventDefault();
    if (roomName === "") {
      alert("방 이름을 입력하세요");
      return;
    }
    let roomNameCheck = false;
    Object.entries(rooms).map((room) => {
      if (room[1].roomName === roomName) {
        alert("이미 있는 방 이름입니다!");
        roomNameRef.current.value = "";
        roomNameCheck = true;
        return;
      }
    });
    if (!roomNameCheck) {
      socket.emit("make room", { roomName, roomID: uuid() });
      alert(`[${roomName}] 방이 생성되었습니다`);
      setRoomName("");
      roomNameRef.current.value = "";
    }
  };

  const onClickJoin = (e) => {
    socket.emit("join room", {
      roomID: e.target.name,
      username: localStorage.username,
      socketID: socket.id,
    });
    alert(`[${e.target.name}] 방에 입장합니다!`);
  };

  return (
    <div>
      <h1>회의방 목록</h1>
      <ul>
        {Object.entries(rooms).map((room) => {
          return (
            <li key={room[0]}>
              <Link
                onClick={onClickJoin}
                to={`/room/${room[0]}`}
                name={room[1].roomName}
              >
                {room[1].roomName}
              </Link>
            </li>
          );
        })}
      </ul>
      <form>
        <h2>방 새로 만들기</h2>
        <input
          type="text"
          name="roomName"
          value={roomName}
          onChange={onChangeRoomName}
          placeholder="방 이름을 입력하세요"
          ref={roomNameRef}
        />
        <button onClick={onClickMakeRoom}>생성</button>
      </form>
    </div>
  );
}

export default CreateRoom;

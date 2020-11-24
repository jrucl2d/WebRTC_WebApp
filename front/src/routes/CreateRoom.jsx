import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";

function CreateRoom() {
  const SERVER_LOCATION = useRef("localhost:8000");
  const socket = useRef();
  const roomNameRef = useRef(null);
  const [rooms, setRooms] = useState({});
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.current = io(SERVER_LOCATION.current);
    socket.current.emit("get room list");
  }, []);
  useEffect(() => {
    socket.current.on("give room list", (rooms) => {
      setRooms(rooms);
    });
  }, [rooms]);

  const onChangeRoomName = useCallback((e) => {
    setRoomName(e.target.value);
  }, []);

  const onClickMakeRoom = useCallback(
    (e) => {
      e.preventDefault();
      if (roomName === "") {
        alert("방 이름을 입력하세요");
        return;
      }
      let roomNameCheck = false;
      // eslint-disable-next-line
      Object.entries(rooms).map((room) => {
        if (room[1].roomName === roomName) {
          alert("이미 있는 방 이름입니다!");
          roomNameRef.current.value = "";
          roomNameCheck = true;
          // eslint-disable-next-line
          return;
        }
      });
      if (!roomNameCheck) {
        socket.current.emit("make room", { roomName, roomID: uuid() });
        alert(`[${roomName}] 방이 생성되었습니다`);
        setRoomName("");
        roomNameRef.current.value = "";
      }
    },
    [roomName, rooms]
  );

  const onClickJoin = useCallback((e) => {
    localStorage.roomName = e.target.name;
    alert(`[${e.target.name}] 방에 입장합니다!`);
  }, []);

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

export default React.memo(CreateRoom);

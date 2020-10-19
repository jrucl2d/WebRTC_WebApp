import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function RoomComponent() {
  const roomIDRef = useRef(null);
  const roomPWRef = useRef(null);
  const [roomInfo, setRoomInfo] = useState({ roomID: "", roomPW: "" });
  const [roomList, setRoomList] = useState([]);
  const onChangeRoomInfo = (e) => {
    setRoomInfo({
      ...roomInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onClickMake = (e) => {
    e.preventDefault();
    if (roomInfo.roomID === "" && roomInfo.roomPW === "") {
      alert("방 정보를 입력하세요");
      return;
    }
    (async () => {
      const res = await axios.post("/rooms/make", roomInfo);
      if (res.data.message === "ok") {
        // 방 목록 업데이트
        const res = await axios.get("/rooms/all");
        setRoomList(res.data);
        setRoomInfo({ roomID: "", roomPW: "" });
        roomIDRef.current.value = "";
        roomPWRef.current.value = "";
      } else if (res.data.message === "exist") {
        alert("이미 존재하는 방 이름입니다");
        return;
      }
    })();
  };

  const onClickJoin = (e, selectedRoom) => {
    e.preventDefault();
    const passwordInput = prompt("방 비밀번호를 입력하세요");
    if (!passwordInput) {
      return;
    }
    (async () => {
      const check = await axios.post("/rooms/join", {
        roomID: selectedRoom,
        roomPW: passwordInput,
        member: localStorage.user,
      });
      if (check.data.message === "pwErr") {
        alert("비밀번호가 틀렸습니다");
        return;
      }
      window.location.href = `/room/${encodeURIComponent(selectedRoom)}`;
    })();
  };

  useEffect(() => {
    (async () => {
      const res = await axios.get("/rooms/all");
      setRoomList(res.data);
    })();
  }, []);

  const makeForm = (
    <form>
      <input
        type="text"
        name="roomID"
        placeholder="방 이름을 입력하세요"
        onChange={onChangeRoomInfo}
        ref={roomIDRef}
      />
      <input
        type="password"
        name="roomPW"
        placeholder="방 비밀번호를 입력하세요"
        onChange={onChangeRoomInfo}
        ref={roomPWRef}
      />
      <button onClick={onClickMake}>방 만들기</button>
    </form>
  );

  return (
    <div>
      <h2>새로운 방 만들기</h2>
      {makeForm}
      <br />
      <hr />
      <h2>방 목록</h2>
      {roomList &&
        roomList.map((room) => (
          <div key={room.roomID}>
            <span>방 이름 : {room.roomID} </span>
            <button
              onClick={(e) => {
                onClickJoin(e, room.roomID);
              }}
            >
              참가
            </button>
          </div>
        ))}
    </div>
  );
}

export default RoomComponent;

import React, { useState, useEffect } from "react";
import axios from "axios";

function RoomComponent() {
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
    (async () => {
      const res = await axios.post("/rooms/make", roomInfo);
      if (res.data.message === "ok") {
        // 새로 생성된 방으로 이동시키는 로직
      } else if (res.data.message === "exist") {
        alert("이미 존재하는 방 이름입니다");
        return;
      }
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
      />
      <input
        type="password"
        name="roomPW"
        placeholder="방 비밀번호를 입력하세요"
        onChange={onChangeRoomInfo}
      />
      <button onClick={onClickMake}>방 만들기</button>
    </form>
  );

  return (
    <div>
      <h1>회의방</h1>
      {makeForm}
      <br />
      <hr />
      {roomList &&
        roomList.map((room) => (
          <div key={room.roomID}>
            <span>방 이름 : {room.roomID} </span>
            <button>참가</button>
          </div>
        ))}
    </div>
  );
}

export default RoomComponent;

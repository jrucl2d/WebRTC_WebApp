import React, { useState } from "react";
import axios from "axios";

function RoomComponent({ location }) {
  const makeOrJoin = location.search.split("=")[1];
  const [roomInfo, setRoomInfo] = useState({ roomID: "", roomPW: "" });
  const onChangeRoomInfo = (e) => {
    setRoomInfo({
      ...roomInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onClickJoin = (e) => {
    e.preventDefault();
    console.log(roomInfo);
  };
  const onClickMake = (e) => {
    e.preventDefault();
    (async () => {
      const res = await axios.post("/rooms/make", roomInfo);
    })();
  };

  const joinForm = (
    <form>
      <input
        type="text"
        name="roomID"
        placeholder="방 번호를 입력하세요"
        onChange={onChangeRoomInfo}
      />
      <input
        type="password"
        name="roomPW"
        placeholder="방 비밀번호를 입력하세요"
        onChange={onChangeRoomInfo}
      />
      <button onClick={onClickJoin}>방 입장하기</button>
    </form>
  );
  const makeForm = (
    <form>
      <input
        type="text"
        name="roomID"
        placeholder="방 번호를 입력하세요"
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
      <h1>방</h1>
      {makeOrJoin === "join" ? joinForm : makeForm}
    </div>
  );
}

export default RoomComponent;

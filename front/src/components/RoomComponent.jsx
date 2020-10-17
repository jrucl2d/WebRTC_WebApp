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
    (async () => {
      const res = await axios.post("/rooms/join", roomInfo);
      if (res.data.message === "no") {
        alert("존재하지 않는 방입니다");
        return;
      } else if (res.data.message === "pwErr") {
        alert("비밀번호가 틀렸습니다");
        return;
      } else {
        // 해당 방으로 이동 시키는 로직
      }
    })();
  };
  const onClickMake = (e) => {
    e.preventDefault();
    (async () => {
      const res = await axios.post("/rooms/make", roomInfo);
      if (res.data.message === "ok") {
        // 새로 생성된 방으로 이동시키는 로직
        alert("zz");
      } else if (res.data.message === "exist") {
        alert("이미 존재하는 방 이름입니다");
        return;
      }
    })();
  };

  const joinForm = (
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
      <button onClick={onClickJoin}>방 입장하기</button>
    </form>
  );
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
      <h1>방</h1>
      {makeOrJoin === "join" ? joinForm : makeForm}
    </div>
  );
}

export default RoomComponent;

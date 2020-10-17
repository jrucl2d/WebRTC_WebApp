import React from "react";

function RoomComponent({ location }) {
  const makeOrJoin = location.search.split("=")[1];

  const joinForm = (
    <form>
      <input type="text" name="roomID" placeholder="방 번호를 입력하세요" />
      <input
        type="password"
        name="roomPW"
        placeholder="방 비밀번호를 입력하세요"
      />
      <button>방 입장하기</button>
    </form>
  );
  const makeForm = (
    <form>
      <input type="text" name="roomID" placeholder="방 번호를 입력하세요" />
      <input
        type="password"
        name="roomPW"
        placeholder="방 비밀번호를 입력하세요"
      />
      <button>방 만들기</button>
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

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const SERVERCLIENT = "localhost:8000";
let socket;

function MainPage({ location }) {
  const [username, setUsername] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
    socket = io(SERVERCLIENT);
  }, [location]);

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const onClickUsername = (e) => {
    e.preventDefault();
    localStorage.username = username;
    setLoggedInUser(username);
  };
  const onClickLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("username");
    setLoggedInUser("");
  };
  return (
    <div>
      <h1>main page</h1>
      {loggedInUser !== "" || localStorage.username ? (
        <div>
          <div>{localStorage.username}님 안녕하세요</div>
          <button onClick={onClickLogout}>로그아웃</button>
        </div>
      ) : (
        <form>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            name={username}
            onChange={onChangeUsername}
          />
          <button onClick={onClickUsername}>입력</button>
        </form>
      )}
    </div>
  );
}

export default MainPage;

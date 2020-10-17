import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const pw1Ref = useRef(null);
  const pw2Ref = useRef(null);
  const [user, setUser] = useState({});
  const [loginForm, setLoginForm] = useState({
    id: "",
    password1: "",
    password2: "",
  });

  useEffect(() => {
    (async () => {
      const res = await axios.get("/users");
      setUser(res.data);
    })();
  }, []);

  const onChangeLoginForm = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };
  const onClickLogin = (e) => {
    e.preventDefault();
    if (loginForm.password1 !== loginForm.password2) {
      alert("비밀번호가 맞지 않습니다.");
      setLoginForm({
        ...loginForm,
        password1: "",
        password2: "",
      });
      pw1Ref.current.value = "";
      pw2Ref.current.value = "";
    }
  };
  const onClickRegister = (e) => {
    e.preventDefault();
  };

  const beforeLoggedIn = (
    <form>
      <input
        type="text"
        name="id"
        placeholder="ID를 입력하세요"
        onChange={onChangeLoginForm}
      />
      <br />
      <input
        type="password"
        name="password1"
        placeholder="비밀번호를 입력하세요"
        onChange={onChangeLoginForm}
        ref={pw1Ref}
      />
      <br />
      <input
        type="password"
        name="password2"
        placeholder="비밀번호를 재입력하세요"
        onChange={onChangeLoginForm}
        ref={pw2Ref}
      />
      <br />
      <button onClick={onClickLogin}>로그인</button>
      <button onClick={onClickRegister}>회원가입</button>
    </form>
  );

  const afterLoggedIn = (
    <div>
      <div>{user.id}님 안녕하세요!</div>
      <button>로그아웃</button>
      <button>방 만들기</button>
      <button>방 참가하기</button>
    </div>
  );

  return (
    <div className="App">
      <h1>화상 회의 서비스</h1>
      {!user.id ? beforeLoggedIn : afterLoggedIn}
    </div>
  );
}

export default App;

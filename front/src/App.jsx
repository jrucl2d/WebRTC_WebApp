import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const idRef = useRef(null);
  const pw1Ref = useRef(null);
  const pw2Ref = useRef(null);
  const [user, setUser] = useState("");
  const [loginForm, setLoginForm] = useState({
    id: "",
    password1: "",
    password2: "",
  });
  useEffect(() => {
    if (localStorage.user && localStorage.user !== "") {
      setUser(localStorage.user);
    }
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
      return;
    }
    (async () => {
      const res = await axios.post("/users/login", {
        id: loginForm.id,
        password: loginForm.password1,
      });
      if (res.data.message === "ok") {
        localStorage.user = loginForm.id;
        alert(`${loginForm.id}님 안녕하세요!`);
        setUser(loginForm.id);
        setLoginForm({ id: "", password1: "", password2: "" });
      } else if (res.data.message === "pwErr") {
        alert("비밀번호가 틀렸습니다");
        setLoginForm({
          ...loginForm,
          password1: "",
          password2: "",
        });
        pw1Ref.current.value = "";
        pw2Ref.current.value = "";
      } else {
        alert("없는 아이디입니다.");
        setLoginForm({
          ...loginForm,
          password1: "",
          password2: "",
        });
        idRef.current.value = "";
        pw1Ref.current.value = "";
        pw2Ref.current.value = "";
      }
    })();
  };
  const onClickRegister = (e) => {
    e.preventDefault();
  };
  const onClickLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    setUser("");
  };

  const beforeLoggedIn = (
    <form>
      <input
        type="text"
        name="id"
        placeholder="ID를 입력하세요"
        onChange={onChangeLoginForm}
        ref={idRef}
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
      <div>{user}님 안녕하세요!</div>
      <button onClick={onClickLogout}>로그아웃</button>
      <button>방 만들기</button>
      <button>방 참가하기</button>
    </div>
  );

  return (
    <div className="App">
      <h1>화상 회의 서비스</h1>
      {user === "" ? beforeLoggedIn : afterLoggedIn}
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function LoginForm() {
  const idRef = useRef(null);
  const pw1Ref = useRef(null);
  const [user, setUser] = useState("");
  const [loginForm, setLoginForm] = useState({
    id: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    id: "",
    password1: "",
    password2: "",
  });
  const [register, setRegister] = useState(false);
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
  const onChangeRegisterForm = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };
  const onClickLogin = (e) => {
    e.preventDefault();
    if (loginForm.id === "") {
      alert("아이디와 비밀번호를 입력하세요");
      return;
    }
    (async () => {
      const res = await axios.post("/users/login", {
        id: loginForm.id,
        password: loginForm.password,
      });
      if (res.data.message === "ok") {
        localStorage.user = loginForm.id;
        alert(`${loginForm.id}님 안녕하세요!`);
        setUser(loginForm.id);
        setLoginForm({ id: "", password: "", password: "" });
      } else if (res.data.message === "pwErr") {
        alert("비밀번호가 틀렸습니다");
        setLoginForm({
          ...loginForm,
          password: "",
        });
        pw1Ref.current.value = "";
      } else {
        alert("없는 아이디입니다.");
        setLoginForm({
          ...loginForm,
          password: "",
        });
        idRef.current.value = "";
        pw1Ref.current.value = "";
      }
    })();
  };
  const onClickRegister = (e) => {
    e.preventDefault();
    if (
      registerForm.id === "" ||
      registerForm.password1 === "" ||
      registerForm.password2 === ""
    ) {
      alert("모든 정보를 입력하세요");
      return;
    }
    if (registerForm.password1 !== registerForm.password2) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }
    (async () => {
      const res = await axios.post("/users/register", {
        id: registerForm.id,
        password: registerForm.password1,
      });
      if (res.data.message === "ok") {
        alert("회원가입 되었습니다");
        setRegister(false);
      } else if (res.data.message === "exist") {
        alert("이미 있는 회원입니다");
      }
    })();
  };
  const onClickRegisterFormOpen = (e) => {
    e.preventDefault();
    setRegister(true);
    setRegisterForm({ id: "", password1: "", password2: "" });
  };
  const onClickLogout = (e) => {
    e.preventDefault();
    alert(`${localStorage.user}님 안녕히 가세요`);
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
        name="password"
        placeholder="비밀번호를 입력하세요"
        onChange={onChangeLoginForm}
        ref={pw1Ref}
      />
      <br />
      <button type="submit" onClick={onClickLogin}>
        로그인
      </button>
      <button onClick={onClickRegisterFormOpen}>회원가입</button>
    </form>
  );

  const afterLoggedIn = (
    <div>
      <div>{user}님 안녕하세요!</div>
      <button onClick={onClickLogout}>로그아웃</button>
      <button>
        <Link to="/room?todo=make">방 만들기</Link>
      </button>
      <button>
        <Link to="/room?todo=join">방 참가하기</Link>
      </button>
    </div>
  );
  const clickRegister = (
    <div>
      <div>회원가입</div>
      <form>
        <input
          type="text"
          name="id"
          placeholder="ID를 입력하세요"
          onChange={onChangeRegisterForm}
          ref={idRef}
        />
        <br />
        <input
          type="password"
          name="password1"
          placeholder="비밀번호를 입력하세요"
          onChange={onChangeRegisterForm}
          ref={pw1Ref}
        />
        <br />
        <input
          type="password"
          name="password2"
          placeholder="비밀번호 확인"
          onChange={onChangeRegisterForm}
          ref={pw1Ref}
        />
        <br />
        <button type="submit" onClick={onClickRegister}>
          회원가입
        </button>
        <button onClick={() => setRegister(false)}>돌아가기</button>
      </form>
    </div>
  );

  return (
    <div>
      <h1>화상 회의 서비스</h1>
      {register ? clickRegister : user === "" ? beforeLoggedIn : afterLoggedIn}
    </div>
  );
}

export default LoginForm;

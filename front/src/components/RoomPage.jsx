import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import MyVideo from "./MyVideo";

const SERVERLOCATION = "localhost:8000";
let socket;

function RoomPage({ location, history }) {
  const ROOMNAME = location.pathname.split("/")[2];
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket = io(SERVERLOCATION);
    socket.emit("getMemberList", ROOMNAME);
    socket.on("noRoom", () => {
      alert("존재하지 않는 방입니다");
      history.push("/room");
    });
    return () => {
      socket.emit("memberDisconnect", {
        username: localStorage.username,
        roomID: ROOMNAME,
      });
      socket.off();
    };
  }, [ROOMNAME, history]);

  // 새 멤버 들어오는 경우
  useEffect(() => {
    socket.on("giveMemberList", (memberList) => {
      if (
        memberList.findIndex((member) => member === localStorage.username) ===
        -1
      ) {
        alert("방에 입장할 자격이 없습니다");
        history.push("/room");
      }
      setMembers(memberList);
    });
    // eslint-disable-next-line
  }, [members]);

  return (
    <div>
      <h1>{ROOMNAME}</h1>
      <ul>
        {members.map((member, index) => (
          <li key={member}>
            {index === 0 && "방장: "}
            {member}
          </li>
        ))}
      </ul>
      <MyVideo isInitiator={members.length === 1 ? true : false} />
    </div>
  );
}

export default RoomPage;

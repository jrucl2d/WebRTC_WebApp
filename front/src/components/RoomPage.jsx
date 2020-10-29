import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const SERVERLOCATION = "localhost:8000";
let socket;

function RoomPage({ location, history }) {
  const ROOMNAME = location.pathname.split("/")[2];
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket = io(SERVERLOCATION);
    socket.emit("getMemberList", ROOMNAME);
    return () => {
      socket.emit("memberDisconnect", {
        username: localStorage.username,
        roomID: ROOMNAME,
      });
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("giveMemberList", (memberList) => {
      setMembers(memberList);
      if (
        memberList.findIndex((member) => member == localStorage.username) === -1
      ) {
        alert("방에 입장할 자격이 없습니다");
        history.push("/room");
      }
    });
  }, [members]);

  return (
    <div>
      <h1>{ROOMNAME}</h1>
      <ul>
        {members.map((member, index) => (
          <li key={member}>
            {index == 0 && "방장: "}
            {member}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomPage;

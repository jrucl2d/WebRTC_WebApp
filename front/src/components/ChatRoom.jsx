import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import VideoScreen from "./VideoScreen";

const SERVERLOCATION = "localhost:8000";
let socket;

function ChatRoom({ location }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket = io(SERVERLOCATION);
    socket.emit("roomInfo");
    socket.on("roomInfoFromServer", ({ rooms }) => {
      const isMemeber = rooms[0].member.findIndex(
        (v) => v === localStorage.user
      );
      if (isMemeber === -1) {
        alert("방에 참가할 자격이 없습니다");
        window.location.href = "/";
      }
      setMembers(rooms[0].member);
    });
  }, []);

  // 새로운 멤버 추가
  useEffect(() => {
    socket.on("newMemberJoined", (rooms) => {
      const gotMembers = rooms[0].member;
      setMembers(gotMembers);
    });
  }, [members]);

  return (
    <div>
      <h1>{location.pathname.split("/")[2]}</h1>
      <div>
        <div>멤버 목록</div>
        <ul>
          {members.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
        {/* <VideoScreen isInitiator={members.length === 1} /> */}
      </div>
    </div>
  );
}

export default ChatRoom;

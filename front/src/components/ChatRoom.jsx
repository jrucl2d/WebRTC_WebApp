import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import VideoScreen from "./VideoScreen";

const SERVERLOCATION = "localhost:8000";
let socket;

function ChatRoom({ location }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket = io(SERVERLOCATION);
    socket.emit("roomInfo", { roomID: location.pathname.split("/")[2] });
    let room;
    socket.on("roomInfoFromServer", (room) => {
      room = room;
      const isMemeber = room.member.findIndex((v) => v === localStorage.user);
      if (isMemeber === -1) {
        alert("방에 참가할 자격이 없습니다");
        window.location.href = "/";
      }
      setMembers(room.member);
    });
    return () => {
      // socket.emit("disconnect", {
      //   roomID: room.roomID,
      //   member: localStorage.user,
      // }); // disconnect 이벤트 emit하고
      // socket.off(); // socket 자체를 닫아버림
    };
  }, []);

  // 새로운 멤버 추가
  useEffect(() => {
    socket.on("memberChanged", (gotMembers) => {
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

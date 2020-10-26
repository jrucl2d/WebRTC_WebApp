import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoScreen from "./VideoScreen";

function ChatRoom({ location }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    (async () => {
      const roomMembers = await axios.get(
        `/rooms/${location.pathname.split("/")[2]}/members`
      );
      setMembers(roomMembers.data);
      // url 접근 방지
      const isMember = roomMembers.data.findIndex(
        (v) => v === localStorage.user
      );
      if (isMember === -1) {
        alert("방에 참여할 자격이 없습니다");
        window.location.href = "/";
      }
    })();
  }, []);

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

import React from "react";
import Videos from "./Videos";
import io from "socket.io-client";
const SERVER_ADDRESS = "localhost:8000";
const socket = io(SERVER_ADDRESS);

function Room({ match }) {
  return (
    <div>
      <h1>방 이름 : {localStorage.roomName}</h1>
      <Videos match={match} socket={socket} />
    </div>
  );
}

export default Room;

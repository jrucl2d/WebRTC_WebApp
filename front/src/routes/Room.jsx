import React from "react";
import Videos from "./Videos";

function Room({ match }) {
  return (
    <div>
      <h1>Room 입장</h1>
      <Videos match={match} />
    </div>
  );
}

export default Room;

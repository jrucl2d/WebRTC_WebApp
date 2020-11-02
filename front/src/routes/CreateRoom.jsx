import React from "react";
import { v4 as uuid } from "uuid";

function CreateRoom({ history }) {
  const create = () => {
    const id = uuid();
    history.push(`/room/${id}`);
  };
  return (
    <div>
      <h1>Create Room</h1>
      <button onClick={create}>Create Room</button>
    </div>
  );
}

export default CreateRoom;

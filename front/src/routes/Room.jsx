import React, { useRef, useEffect } from "react";
import io from "socket.io-client";

function Room({ match }) {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();

  const getStream = (stream) => {
    userVideo.current.srcObject = stream;
    userStream.current = stream;

    socketRef.current = io.connect("/");
    socketRef.current.emit("join room", match.params.roomID);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(getStream);
  }, []);

  return (
    <div>
      <h1>Video Chat</h1>
      <video autoPlay ref={userVideo} />
      <video autoPlay ref={partnerVideo} />
    </div>
  );
}

export default Room;

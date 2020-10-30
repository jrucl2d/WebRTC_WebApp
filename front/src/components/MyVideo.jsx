import React, { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

let pc;
const SERVERLOCATION = "localhost:8000";
let socket;

function MyVideo({ isInitiator, isChannelReady }) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState([]);
  const [messageFromServer, setMessageFromServer] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const localVideo = useRef(null);
  socket = io(SERVERLOCATION);

  // 스트림 요청 성공시
  const getStream = useCallback(
    (stream) => {
      console.log("local stream added");
      setLocalStream(stream);
      localVideo.current.srcObject = stream;
      socket.emit("message", "newUserMedia");
      if (isInitiator) {
        maybeStart();
      }
    },
    [localStream]
  );
  const createPeerConnection = useCallback(() => {
    try {
      pc = new RTCPeerConnection(null);
      pc.onicecandidate = handleIceCandidate;
      pc.onaddstream = handleRemoteStreamAdded;
      console.log("RTCPeerConnection created");
    } catch (err) {
      alert("RTCPeerConnection 오류!");
      return;
    }
  });
  const handleIceCandidate = useCallback((event) => {
    if (event.candidate) {
      socket.emit("message", {
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      });
    } else {
      console.log("end of candidate");
    }
  });

  const handleRemoteStreamAdded = useCallback(
    (event) => {
      console.log("remote stream added");
      let newRemoteStream = [...remoteStream];
      newRemoteStream.push(event.stream);
      setRemoteStream(newRemoteStream);
    },
    [remoteStream]
  );
  const maybeStart = useCallback(() => {
    console.log("maybeStart : ", isStarted, localStream, isChannelReady);
    if (!isStarted && typeof localStream !== "undefined" && isChannelReady) {
      console.log("create peer connection");
      createPeerConnection(); // 자신의 RTCPeerConnection을 초기화, 상대방의 RTCPeerConnection과 연결
      pc.addStream(localStream);
      setIsStarted(true);
      console.log("isInitiator : ", isInitiator);
      if (isInitiator) {
        doCall();
      }
    } else {
      console.log("maybeStart error");
    }
  });
  const setLocal = (sessionDescription) => {
    pc.setLocalDescription(sessionDescription);
    socket.emit("message", sessionDescription);
  };
  const doCall = () => {
    console.log("do createOffer");
    pc.createOffer(setLocal, (event) => {
      console.error("createOffer error : ", event);
    });
  };
  const doAnswer = () => {
    console.log("Send answer to peer");
    pc.createAnswer().then(setLocal, (error) => {
      console.error("session description create error ", error);
    });
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessageFromServer(message);
      console.log("Client got message : ", message);
      if (message === "newUserMedia") {
        maybeStart();
      } else if (message.type === "offer") {
        if (!isInitiator && !isStarted) {
          maybeStart();
        }
        pc.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer();
      } else if (message.type === "answer" && isStarted) {
        pc.setRemoteDescription(new RTCSessionDescription(message));
      } else if (message.type === "candidate" && isStarted) {
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: message.label,
          candidate: message.candidate,
        });
        pc.addIceCandidate(candidate);
      }
    });
  }, [messageFromServer]);

  const onPlayCamera = (e) => {
    e.preventDefault();
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(getStream)
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <button onClick={onPlayCamera}>카메라 켜기</button>
      <video ref={localVideo} autoPlay width="200px"></video>
      {remoteStream.map((stream) => (
        <video src={stream} autoPlay width="200px"></video>
      ))}
    </div>
  );
}

export default MyVideo;

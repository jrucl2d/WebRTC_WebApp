import React, { useRef, useState } from "react";
import { Socket } from "socket.io-client";
import produce from "immer";

const pcConfig = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "turn:numb.viagenie.ca",
      credential: "muazkh",
      username: "webrtc@live.com",
    },
  ],
};

function VideoScreen({ isInitiator }) {
  const [localStream, setLocalStream] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isChannelReady, setIsChannelReady] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [pc, setPc] = useState(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  const sendMessage = (message) => {
    console.log("Client Message : " + message);
    Socket.emit("message", message);
  };

  // 스트림 요청 성공시
  const gotStream = (stream) => {
    console.log("local stream added");
    setLocalStream(stream);
    localVideo.current.srcObject = stream;
    sendMessage("got user media");
    if (isInitiator) {
      maybeStart();
    }
  };

  // RTCPeerConnection
  function maybeStart() {
    console.log(">>MaybeStart() : ", isStarted, localStream, isChannelReady);
    if (!isStarted && typeof localStream !== "undefined" && isChannelReady) {
      console.log(">>>>> creating peer connection");
      createPeerConnection();
      const newPc = produce(pc, (draftState) => {
        draftState.addStream(localStream);
      });
      setPc(newPc);
      setIsStarted(true);
      console.log("isInitiator : ", isInitiator);
      if (isInitiator) {
        doCall();
      }
    } else {
      console.error("maybeStart not Started!");
    }
  }
  function createPeerConnection() {
    try {
      const newPc = produce(pc, (draftState) => {
        draftState = new RTCPeerConnection(null);
        draftState.onicecandidate = handleIceCandidate;
        draftState.onaddstream = handleRemoteStreamAdded;
      });
      setPc(newPc);
      console.log("Created RTCPeerConnection");
    } catch (e) {
      alert("connot create RTCPeerConnection object");
      return;
    }
  }

  function handleIceCandidate(event) {
    console.log("iceCandidateEvent", event);
    if (event.candidate) {
      sendMessage({
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      });
    } else {
      console.log("end of candidates");
    }
  }

  function handleRemoteStreamAdded(event) {
    console.log("remote stream added");
    const newStream = event.stream;
    remoteVideo.srcObject = newStream;
    setRemoteStream(newStream);
  }
  function doCall() {
    console.log("Sending offer to peer");
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
  }
  function setLocalAndSendMessage(sessionDescription) {
    pc.setLocalDescription(sessionDescription);
    sendMessage(sessionDescription);
  }
  function handleCreateOfferError(event) {
    console.log("createOffer() error: ", event);
  }

  function doAnswer() {
    console.log("Sending answer to peer");
    pc.createAnswer().then(
      setLocalAndSendMessage,
      onCreateSessionDescriptionError
    );
  }

  const onPlayCamera = (e) => {
    e.preventDefault();
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(gotStream)
      .catch((err) => console.error(err));
  };

  Socket.on("message", (message) => {
    console.log("Client received message :", message);
    if (message === "got user media") {
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

  Socket.on("connect", () => {
    Socket.emit("onCollabo", Socket.id);
  });
  Socket.on("collabo", function (room) {
    socket.emit("create or join", room);
    console.log("Attempted to create or  join room", room);
  });
  Socket.on("join", function (room) {
    console.log("Another peer made a request to join room " + room);
    console.log("This peer is the initiator of room " + room + "!");
    setIsChannelReady(true);
  });
  Socket.on("joined", function (room) {
    console.log("joined: " + room);
    isChannelReady = true;
  });

  return (
    <div>
      <button onClick={onPlayCamera}>카메라 켜기</button>
      <video ref={localVideo} autoPlay width="200px"></video>
      <video ref={remoteVideo} autoPlay width="200px"></video>
      <script src="/socket.io/socket.io.js"></script>
    </div>
  );
}

export default VideoScreen;

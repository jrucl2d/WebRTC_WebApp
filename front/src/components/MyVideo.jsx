import React, { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";

const SERVERLOCATION = "localhost:8000";
let socket;

function MyVideo({ roomID }) {
  const localVideo = useRef();
  const otherVideo = useRef();
  const userStream = useRef();
  const otherUser = useRef();
  const peerRef = useRef();

  useEffect(() => {
    socket = io(SERVERLOCATION);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(getStream);
  }, []);
  const getStream = (stream) => {
    localVideo.current.srcObject = stream;
    userStream.current = stream;
    socket.emit("join room", { roomID, username: localStorage.username, socketID : socket.id });

    socket.on("other user", (userID) => {
      callUser(userID);
      otherUser.current = userID;
    });

    // socket.on("user joined", (userID) => {
    //   otherUser.current = userID;
    // });
    socket.on("offer", handleRecieveCall);
    socket.on("answer", handleAnswer);
    socket.on("iceCandidate", handleNewICECandidateMsg);
  };
  // 상대방에게 전화 걸기(Caller의 입장)
  const callUser = (userID) => {
    peerRef.current = createPeer(userID); // 상대방의 peer을 생성
    userStream.current // 상대방 peer에 현재 user의 peer을 추가
      .getTracks()
      .forEach((track) => peerRef.current.addTrack(track, userStream.current));
  };
  const createPeer = (userID) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });
    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);
    return peer;
  };
  const handleNegotiationNeededEvent = (userID) => {
    peerRef.current
      .createOffer()
      .then((offer) => peerRef.current.setLocalDescription(offer))
      .then(() => {
        const userOffer = {
          target: userID,
          caller: localStorage.username,
          sdp: peerRef.current.localDescription,
        };
        socket.emit("offer", userOffer);
      })
      .catch((err) => console.log(err));
  };

  // 상대방에게서 전화 받기(Callee의 입장)
  const handleRecieveCall = (gotInfo) => {
    peerRef.current = createPeer();
    const description = new RTCSessionDescription(gotInfo.sdp); // 상대방에게서 받은 sdp
    peerRef.current
      .setRemoteDescription(description) // 상대방 sdp 설정하고
      .then(() =>
        userStream.current
          .getTracks()
          .forEach((track) =>
            peerRef.current.addTrack(track, userStream.current)
          )
      )
      .then(() => {
        return peerRef.current.createAnswer(); // anwer(자신의 sdp) 생성
      })
      .then((answer) => {
        return peerRef.current.setLocalDescription(answer); // 자신의 sdp를 설정
      })
      .then(() => {
        const userOffer = {
          target: gotInfo.caller,
          caller: localStorage.username,
          sdp: peerRef.current.localDescription,
        };
        socket.emit("answer", userOffer); // 자신의 설정한 sdp를 answer로 전송
      });
  };
  const handleAnswer = (message) => {
    const description = new RTCSessionDescription(message.sdp); // answer로 전달받은 sdp를 상대방 sdp로 설정
    peerRef.current
      .setRemoteDescription(description)
      .catch((err) => console.log(err));
  };
  // 실제 peer에 ICE 후보가 전달되면 설정하는 것
  const handleICECandidateEvent = (e) => {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socket.emit("iceCandidate", payload);
    }
  };
  // 상대가 전송한 ICE 후보를 보고 자신의 ICE 후보를 설정하는 것
  const handleNewICECandidateMsg = (gotInfo) => {
    const candidate = new RTCIceCandidate(gotInfo);
    peerRef.current.addIceCandidate(candidate).catch((err) => console.log(err));
  };
  const handleTrackEvent = (e) => {
    console.log(e.stream);
    otherVideo.current.srcObject = e.stream;
  };

  return (
    <div>
      <video ref={localVideo} autoPlay width="200px"></video>
      <video ref={otherVideo} autoPlay width="200px"></video>
    </div>
  );
}

export default MyVideo;

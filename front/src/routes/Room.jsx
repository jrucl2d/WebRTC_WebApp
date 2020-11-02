import React, { useRef, useEffect } from "react";
import io from "socket.io-client";

function Room({ match }) {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef(); // 다른 유저의 userID를 저장
  const userStream = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(getStream);
  }, []);

  const getStream = (stream) => {
    userVideo.current.srcObject = stream;
    userStream.current = stream;

    socketRef.current = io.connect("/");
    socketRef.current.emit("join room", match.params.roomID);

    // 새로 들어간 사람 입장에서 다른 사람이 있음을 전해들음
    socketRef.current.on("other user", (userID) => {
      callUser(userID); // userID는 이미 존재하던 사람이고, 그 사람에게 call
      otherUser.current = userID;
    });

    // 기존 사람 입장에서 다른 유저가 들어왔음을 확인 -> call은 나중에 들어온 사람이 하는 것으로
    socketRef.current.on("user joined", (userID) => {
      otherUser.current = userID;
    });
    socketRef.current.on("offer", handleRecieveCall); // Callee는 Caller의 offer을 들을 것
    socketRef.current.on("answer", handleAnswer); // Caller은 Callee의 answer을 들을 것
    socketRef.current.on("ice-candidate", handleNewICECandidateMsg); // IceCandidate 정보를 서로 주고 받음
  };

  const callUser = (userID) => {
    peerRef.current = createPeer(userID); // 상대방의 userID로 peer 객체를 생성
    userStream.current // 상대방에게 offer하기 위해서 stream 정보를 peer의 track에 추가
      .getTracks()
      .forEach((track) => peerRef.current.addTrack(track, userStream.current));
  };

  // 나 자신의 peer 객체를 생성하는데 상대방(userID)와의 offer, answer작업에 대한 콜백 함수를 설정
  const createPeer = (userID) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org", // stun 서버
        },
        {
          urls: "turn:numb.viagenie.ca", // turn 서버
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent; // Ice Candidate 이벤트 발생시 정보 전송
    peer.ontrack = handleTrackEvent; // 상대방의 stream을 track에 추가
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID); // offer과 answer 작업

    return peer;
  };

  // Caller 입장에서 Offer을 제공(offer 이벤트를 emit)
  const handleNegotiationNeededEvent = (userID) => {
    peerRef.current
      .createOffer()
      .then((offer) => {
        return peerRef.current.setLocalDescription(offer); // offer을 생성하고 해당 offer을 local description으로 설정
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  };
  // Callee 입장에서 'offer' 이벤트를 listen했을 때
  function handleRecieveCall(incoming) {
    peerRef.current = createPeer(); // negotiate을 하는 Caller의 입장이 아니므로 상대방 userID를 보낼 필요 없음
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current.getTracks().forEach(
          (track) => peerRef.current.addTrack(track, userStream.current) // 상대방에게 나의 stream 정보를 answer하기 위해 peer에 track 정보추가
        );
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer) => {
        return peerRef.current.setLocalDescription(answer); // offer와 유사하게 sdp 정보를 가지고 있음
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("answer", payload);
      });
  }

  // Caller 입장에서 Callee의 answer을 받았을 때
  const handleAnswer = (message) => {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  };

  // Ice Candidate 정보는 서로 주고 받음
  // Ice Candidate 이벤트가 발생하면 상대방에게 해당 정보를 전송
  const handleICECandidateEvent = (e) => {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current.emit("ice-candidate", payload);
    }
  };

  // Ice Cnadidate 이벤트가 발생해서 상대방이 해당 정보를 전송하면, 그 정보를 받음
  const handleNewICECandidateMsg = (incoming) => {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  };

  const handleTrackEvent = (e) => {
    partnerVideo.current.srcObject = e.streams[0];
  };

  return (
    <div>
      <h1>Video Chat</h1>
      <video autoPlay ref={userVideo} />
      <video autoPlay ref={partnerVideo} />
    </div>
  );
}

export default Room;

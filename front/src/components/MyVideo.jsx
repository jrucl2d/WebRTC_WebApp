import React, { useRef, useState } from "react";

function MyVideo({ isInitiator }) {
  const [localStream, setLocalStream] = useState(null);
  const localVideo = useRef(null);

  // 스트림 요청 성공시
  const getStream = (stream) => {
    console.log("local stream added");
    setLocalStream(stream);
    localVideo.current.srcObject = stream;

    if (isInitiator) {
      console.log("내가 했다");
    }
  };

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
    </div>
  );
}

export default MyVideo;

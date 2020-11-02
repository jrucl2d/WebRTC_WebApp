import React from "react";
import { Route } from "react-router-dom";
// import MainPage from "./components/MainPage";
// import RoomListPage from "./components/RoomListPage";
// import RoomPage from "./components/RoomPage";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";

function App() {
  return (
    <div className="App">
      {/* <Route exact path="/" component={MainPage} />
      <Route exact path="/room" component={RoomListPage} />
      <Route path="/room/:id" component={RoomPage} /> */}
      <Route path="/" exact component={CreateRoom} />
      <Route path="/room/:roomID" exact component={Room} />
    </div>
  );
}

export default App;

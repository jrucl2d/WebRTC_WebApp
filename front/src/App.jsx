import React from "react";
import { Route } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import MainPage from "./routes/MainPage";

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={MainPage} />
      <Route path="/room" exact component={CreateRoom} />
      <Route path="/room/:roomID" exact component={Room} />
    </div>
  );
}

export default App;

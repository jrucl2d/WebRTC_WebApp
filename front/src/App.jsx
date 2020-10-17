import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get("/users");
      setUsers(res.data);
    })();
  }, []);

  return (
    <div className="App">
      {users.map((user) => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
}

export default App;

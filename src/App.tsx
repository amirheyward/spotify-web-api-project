import "./App.css";
import { getCurrentTrack } from "./api";
import { useState } from "react";

function App() {
  const [content, setContent] = useState("");

  return (
    <div>
      <button
        onClick={async () => {
          const data = await getCurrentTrack();
          setContent(JSON.stringify(data));
        }}
      >click</button>
      <div>{content}</div>
    </div>
  );
}

export default App;

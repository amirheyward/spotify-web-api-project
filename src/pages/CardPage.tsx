import { getCurrentTrack } from "../api.ts";
import { useContext, useState } from "react";
import Card from "../components/Card.tsx";
import { UserContext } from "../contexts/UserContext.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CardPage.css"

function CardPage() {
  const [content, setContent] = useState(<></>);
  const { accessToken, setAccessToken } = useContext(UserContext);
  const navigate = useNavigate();

  async function setCardDetails() {
    let token = accessToken;
    if (!token) {
      try {
        console.log("here");
        const response = await axios.post("http://127.0.0.1:8080/login", null, {
          withCredentials: true,
        });
        token = response.data.access_token;
        setAccessToken(token); // react states are ayncronous --> you can't use states right after setting one (thats why im using a local)
      } catch (e) {
        console.error(e);
        navigate("/login");
        return;
      }
    }
    
    const track = await getCurrentTrack(token);
    setContent(
      <Card
        album={track.album}
        song={track.song}
        artist={track.artist}
        playing={track.playing}
        cover={track.cover}
      />,
    );
  }

  return (
    <div className="mainContainer">
      <button onClick={async () => setCardDetails()}>click</button>
      <div>{content}</div>
    </div>
  );
}

export default CardPage;

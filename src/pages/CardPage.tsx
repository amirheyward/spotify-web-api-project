import { getCurrentTrack } from "../api.ts";
import { useContext, useState } from "react";
import Card from "../components/Card.tsx";
import { UserContext } from "../contexts/UserContext.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

function CardPage() {
  const [content, setContent] = useState(<></>);
  const { accessToken, setAccessToken } = useContext(UserContext);
  const navigate = useNavigate();

  async function setCardDetails() {
    if (!accessToken) {
      try {
        const response = await axios.post("http://127.0.0.1:8080/login");
        setAccessToken(response.data.access_token);
      } catch (e) {
        console.error(e)
        navigate("/login");
        return;
      }
    }

    const track = await getCurrentTrack(accessToken);
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
    <div>
      <button onClick={async () => setCardDetails()}>click</button>
      <div>{content}</div>
    </div>
  );
}

export default CardPage;

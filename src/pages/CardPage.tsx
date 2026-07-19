import { getCurrentTrack } from "../api.ts";
import { useContext, useState } from "react";
import Card from "../components/Card.tsx";
import { UserContext } from "../contexts/UserContext.tsx";

function CardPage() {
  const [content, setContent] = useState(<></>);
  const {accessToken, setAccessToken} = useContext(UserContext);

  return (
    <div>
      <button
        onClick={async () => {
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
        }}
      >
        click
      </button>
      <div>{content}</div>
    </div>
  );
}

export default CardPage;

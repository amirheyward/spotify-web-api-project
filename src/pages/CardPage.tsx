import { getCurrentTrack } from "../api.ts";
import { useState } from "react";
import Card from "../components/Card.tsx";

function CardPage() {
  const [content, setContent] = useState(<></>);
  return (
    <div>
      <button
        onClick={async () => {
          const data = await getCurrentTrack();
          setContent(
            <Card
              album={data.album}
              song={data.song}
              artist={data.artist}
              playing={data.playing}
              cover={data.cover}
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

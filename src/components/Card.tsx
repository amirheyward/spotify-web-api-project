import "./Card.css"
import templateImage from "../assets/Baby_Keem_-_Casino.png"

interface CardProps {
    album: string;
    song: string;
    artist: string;
    playing: boolean;
    cover: string; // url
}

function Card(props: CardProps) {
    const {album, song, artist, playing, cover} = props;
  return (
    <div className="cardContainer">
      <div className="coverContainer">
        <img src={cover} alt="Album Cover" />
      </div>
      <div className="detailContainer">
        <ul>
            <li>Album: {album}</li>
            <li>Song: {song}</li>
            <li>Artist: {artist}</li>
            <li>Playing: {String(playing)}</li>
        </ul>
      </div>
    </div>
  );
}

export default Card;

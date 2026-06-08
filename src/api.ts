import axios from "axios";

async function getCurrentTrack() {
   const response = await axios.get(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: "Bearer " + "[insert auth token]",
      },
    },
  );

  return response.data;
}

export { getCurrentTrack };

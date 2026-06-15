import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/getCurrentTrack", async (req, res) => {
  const response = await axios.get(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization:
          "Bearer " +
          req.access_token,
      },
    },
  );
});
export default router;

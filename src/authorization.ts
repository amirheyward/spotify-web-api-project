import express from "express";
import crypto from "crypto";
import axios from "axios";

const client_id = "[xxx]";
const client_secret = "[xxx]";
const redirect_uri = "http://127.0.0.1:8080/callback";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: "user-read-private user-read-email user-read-recently-played user-read-currently-playing",
    redirect_uri: redirect_uri,
    state: crypto.randomBytes(16).toString("hex").slice(0, 16),
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

app.get("/callback", async function (req, res) {
  const code = req.query.code;
  const state = req.query.state;

  if (!state) {
    return res.redirect("/#?error=state_mismatch");
  }

  const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64",
  );

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      code: String(code),
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
    },
  );

  const data = response.data;

  res.send(data);
});

app.listen(8080, () => {
  console.log(`Server running at http://127.0.0.1:8080`);
});


import express from "express";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import apiRoutes from "./api.js";
import { connect, addUser, findUser } from "./db.js";

dotenv.config({
  path: path.resolve("./backend/.env"),
});

await connect();

let access_token = undefined;
const client_id = "eb7977f5176849c99c47f413b5cdd2fc";
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://127.0.0.1:8080/callback";

let states = [];

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", (req, res, next) => {
  req.access_token = access_token;
  next();
});
app.use("/api", apiRoutes);

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const user = await findUser(username);
  if (user) {
    const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64",
    );

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: user.refresh_token,
        client_id: client_id,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authHeader}`,
        },
      },
    );

    const data = response.data;
    res.status(200).json({ access_token: data.access_token });
  } else {
    res.status(401).json({ error: "user not found" });
  }
});

app.get("/authenticate", (req, res) => {
  const username = req.query.username;
  const state = crypto.randomBytes(16).toString("hex").slice(0, 16);
  states.push({ state: state, username: username });
  const params = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope:
      "user-read-private user-read-email user-read-recently-played user-read-currently-playing",
    redirect_uri: redirect_uri,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

app.get("/callback", async function (req, res) {
  const code = req.query.code;
  const state = req.query.state;

  if (!state) {
    return res.redirect("/#?error=state_mismatch");
  }

  const username = states.find((n) => n.state === state).username;
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
  const _ = await addUser(username, data.refresh_token);
  res.redirect("http://127.0.0.1:5173/login")
});

app.get("/refresh", async (req, res) => {
  const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64",
  );

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.REFRESH_TOKEN,
      client_id: client_id,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
    },
  );

  const data = response.data;
  access_token = data.access_token;
  res.status(200).send("refreshed");
});

app.listen(8080, () => {
  console.log(`Server running at http://127.0.0.1:8080`);
});

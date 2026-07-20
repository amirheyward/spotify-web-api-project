import express from "express";
import session from "express-session";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { connect, addUser, findUser } from "./db.js";

axios.defaults.withCredentials = true;
// credentials = cookies and things of that
// if a client sends credentials in a request, the server must have specified origins in CORS, or else it would be at risk of CSRF (cooke attack)
// spotify CORS accepts all origins, so i have to not send credentials whenever its a spotify endpoint
// this is a global config in memory, so imports will get this too

dotenv.config({
  path: path.resolve("./backend/.env"),
});

await connect();

const client_id = "eb7977f5176849c99c47f413b5cdd2fc";
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://127.0.0.1:8080/callback";
const session_secret = process.env.SESSION_SECRET;

let states = [];

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "http://127.0.0.1:8080",
    "http://127.0.0.1:5173"
  ],
  credentials: true // needed for cookies from front end
}));
app.use(
  session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60, // one hour
    },
  }),
);

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.sessionID);
  next();
})

app.post("/login", async (req, res) => {
  const username = req.session.username ?? req.body.username;
  const user = await findUser(username);
  if (user) {
    const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64",
    );
    try {
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
      req.session.username = username;
      res.status(200).json({ access_token: data.access_token });
    } catch (e) {
      res.status(400).json({ error: "authorization failed" });
    }
  } else {
    res.status(401).json({ error: "user not found" });
  }
});

app.get("/authenticate", async (req, res) => {
  const username = req.query.username;
  const user = await findUser(username);
  if (user) {
    res.redirect("http://127.0.0.1:5173/login?signupFailed=true");
    return;
  }

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
      withCredentials: false,
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
  res.redirect("http://127.0.0.1:5173/login");
});

app.listen(8080, () => {
  console.log(`Server running at http://127.0.0.1:8080`);
});

import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

dotenv.config({
  path: path.resolve("./backend/.env"),
});

const userSchema = new mongoose.Schema({
  username: String,
  refresh_token: String,
});

// mongoose auto determines what collection to put the model in
// 1. lowercases name
// 2. pluralizes name
// User --> user --> users
const User = mongoose.model("User", userSchema);

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (e) {
    console.error("Database connection failed:", e);
    process.exit(1);
  }
}

async function addUser(username, refresh_token) {
  await User.create({
    username: username,
    refresh_token: refresh_token,
  });
}

async function findUser(username) {
  return await User.findOne({username: username});
}

export { connect, addUser, findUser };

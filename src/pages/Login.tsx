import { useRef } from "react";
import axios from "axios";

function Login() {
  const inputRef = useRef<HTMLInputElement>(null);
  let access_token = undefined;

  async function login() {
    const username = inputRef.current!.value;
    const response = await axios.post("http://127.0.0.1:8080/login", {
      username: username,
    });

    if (response.data.access_token) {
      access_token = response.data.access_token;
    }
  }

  async function createUser() {
    const username = inputRef.current!.value;
    window.location.assign(
      `http://127.0.0.1:8080/authenticate?username=${username}`,
    );
  }

  return (
    <div className="loginContainer">
      Username:
      <input ref={inputRef} type="username" />
      <br />
      <button className="login" onClick={async () => login()}>
        Login
      </button>
      <button className="createUser" onClick={async () => createUser()}>
        Create User
      </button>
    </div>
  );
}

export default Login;

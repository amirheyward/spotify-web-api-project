import { useContext, useRef } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { accessToken, setAccessToken } = useContext(UserContext);

  async function login() {
    const username = inputRef.current!.value;
    const response = await axios.post("http://127.0.0.1:8080/login", {
      username: username,
    });

    if (response.data.access_token) {
      setAccessToken(response.data.access_token);
      navigate("/cardPage");
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

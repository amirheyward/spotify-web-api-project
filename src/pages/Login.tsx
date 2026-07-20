import { useContext, useRef, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

axios.defaults.withCredentials = true;

function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const signupFailed = Boolean(searchParams.get("signupFailed")) ?? false;
  let [loginFailed, setLoginFailed] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { accessToken, setAccessToken } = useContext(UserContext);

  async function login() {
    const username = inputRef.current!.value;
    try {
      const response = await axios.post("http://127.0.0.1:8080/login", {
        username: username,
      });

      if (response.data.access_token) {
        setAccessToken(response.data.access_token);
        navigate("/cardPage");
      }
    } catch (e) {
      setLoginFailed(true);
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
      {(loginFailed && <p>User Does not Exist</p>) || (signupFailed && <p>User Already Exists</p>)}
    </div>
  );
}

export default Login;

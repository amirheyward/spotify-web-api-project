function Login() {
    return (
        <form action="/login" method="POST">
            Username:
            <input name="username" type="text" />
            <br />
            <button type="submit">Submit</button>
        </form>
    )
}

export default Login;

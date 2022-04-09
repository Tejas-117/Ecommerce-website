import React, { Fragment, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "./Login.css";
import { StateContext } from "../../context/StateProvider";
import Loader from "../../components/layout/Loader/Loader";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [state, dispatch] = useContext(StateContext);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/v1/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    setLoading(false);
    
    if (data.user) {
      setMessage(data.message);
      dispatch({ type: "set_user", payload: { user: data.user } });
    }
    else if(data.error){
      setMessage(data.error.message);
    }
  }

  useEffect(() => {
    // if user is already logged in, navigate to previous page
    if(state.user){
      navigate(from || '/', { replace: true });
    }
  }, [state.user])
  
  useEffect(() => {
    if(from){
      setMessage("Login to view the page")
    }
  }, [])

  return (
    <Fragment>
      <form className="login_form" onSubmit={handleSubmit}>
        <h1 className="login_heading">Login</h1>

        <label htmlFor="email">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="on"
        />

        <label htmlFor="password">Password *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit">Login</button>
      </form>


      <div className="message_container">
        {isLoading && <Loader />}

        {message && (
          <div className="message">
            {message}
            <CloseIcon className="close" onClick={() => setMessage("")} />
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default Login;

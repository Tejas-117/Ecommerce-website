import React, { Fragment, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "./Register.css";
import { StateContext } from "../../context/StateProvider";
import Loader from "../../components/layout/Loader/Loader";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [state, dispatch] = useContext(StateContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setisLoading(true);

    const response = await fetch(
      "/api/v1/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      }
    );
    const data = await response.json();

    dispatch({ type: "set_user", payload: { user: data.user } });
    setisLoading(false);
    
    if (data.user) {
      setMessage(data.message);
      setTimeout(() => {
        navigate("/");
      }, 1500)
    }
    else if(data.error){
      setMessage(data.error.message)
    }
  }

  return (
    <Fragment>
      <form className="register_form" onSubmit={handleSubmit}>
        <h1 className="register_heading">Sign In</h1>
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="email">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="password">Password *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit">Register</button>
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

export default Register;

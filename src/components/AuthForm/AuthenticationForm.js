import React, { useState } from "react";
import "./auth.scss";
import { Button, ForgetPassword } from "../../Elements";
import { useNavigate } from "react-router-dom";
import classes from "./Layout.module.scss";
import API from "../../api/index";
import { validate } from "react-email-validator";
const initialState = {
  email: " ",
  password: " ",
};

const LoginContainer = () => {
  const [credentials, setCredentials] = useState(initialState);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    console.log(credentials);
  };

  const style = {
    margin: "10px 0",
  };

  const [state, setState] = useState({ focused: false, value: "" });

  const focusField = () => {
    const { focused } = state;
    setState({
      focused: !focused,
    });
  };
  const { focused, value } = state;

  let inputClass = "fluid-input";

  if (focused) {
    inputClass += " fluid-input--focus";
  } else if (value !== "") {
    inputClass += " fluid-input--open";
  }

  //------------------------------------------------------------------------
  const [error, setError] = useState({ bool: false, Message: " " });
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  //------------------------------------------------------------------------

  const handleSubmit = (e) => {
    if (credentials.email.includes(" ") || credentials.email.length === 0) {
      setEmailError(true);
      return;
    } else {
      if (!validate(credentials.email)) {
        setEmailError(true);
        return;
      } else {
        setEmailError(false);
      }
    }

    if (
      credentials.password.includes(" ") ||
      credentials.password.length === 0
    ) {
      console.log("you have to set password !");
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    API.post("login", credentials)
      .then((res) => {
        if (res.status === 200) {
          const user = res?.data?.result;
          const token = res?.data?.token;
          localStorage.setItem("curentUser", JSON.stringify({ user, token }));
          window.location.reload(false);
          navigate("/profile");
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            setError({ bool: true, Message: err.response.data.Message });
          }
        } else {
          setError({ bool: true, Message: "server not responding !" });
        }
      });
  };

  return (
    <div className={classes.container}>
      <div className="login-container">
        <div className="title">Login</div>
        {/* <FluidInput
        type="email"
        label="Email f"
        style={style}
        id="email1"
        name="email"
        onChange={handleChange}
      /> */}
        <div className={inputClass} style={style}>
          <div className="fluid-input-holder">
            <input
              name="email"
              className="fluid-input-input"
              type="email"
              id="email"
              onFocus={focusField}
              onBlur={focusField}
              autoComplete="off"
              onChange={handleChange}
              placeholder="Email"
            />
          </div>
        </div>
        {emailError ? (
          <p style={{ color: "red", fontSize: "10px" }}>
            {" "}
            please check your email
          </p>
        ) : null}
        <div className={inputClass} style={style}>
          <div className="fluid-input-holder">
            <input
              name="password"
              className="fluid-input-input"
              type="password"
              id="password"
              onFocus={focusField}
              onBlur={focusField}
              autoComplete="off"
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
        </div>
        {passwordError ? (
          <p style={{ color: "red", fontSize: "10px" }}>
            {" "}
            please check your password
          </p>
        ) : null}
        <ForgetPassword
          buttonText="forget password ?"
          buttonClass="forget-pasword-button"
        />
        <Button
          buttonText="login"
          buttonClass="login-button"
          onClick={handleSubmit}
        />
        {error.bool ? (
          <p style={{ color: "red", fontSize: "15px" }}> {error.Message} </p>
        ) : null}
      </div>
    </div>
  );
};

export default LoginContainer;

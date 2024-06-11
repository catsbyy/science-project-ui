import React, { useState } from "react";
import { MailOutline } from "react-ionicons";
import { PersonCircleOutline } from "react-ionicons";
import { LockClosedOutline } from "react-ionicons";
import "./LoginPage.css";

interface Props {}

function LoginPage({}: Props) {
  const [action, setAction] = useState("Sign In");

  return (
    <div className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"> </div>
          <div className="wave -two"></div>
        </div>

        <div className="login-container">
          <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
          </div>

          <div className="inputs">
            {action === "Sign In" ? (
              <div></div>
            ) : (
              <div className="input">
                <PersonCircleOutline color={"#00000"} title={"person"} height="25px" width="25px" />
                <input type="text" placeholder="Name" />
              </div>
            )}

            <div className="input">
              <MailOutline color={"#00000"} title={"email"} height="25px" width="25px" />
              <input type="email" placeholder="Email" />
            </div>

            <div className="input">
              <LockClosedOutline color={"#00000"} title={"password"} height="25px" width="25px" />
              <input type="password" placeholder="Password" />
            </div>

            {action !== "Sign In" ? (
              <div className="input">
                <LockClosedOutline color={"#00000"} title={"password"} height="25px" width="25px" />
                <input type="password" placeholder="Confirm Password" />
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {action !== "Sign In" ? (
            <div></div>
          ) : (
            <div className="forgot-password">
              Forget Password? <span>Click here</span>
            </div>
          )}

          <div className="submit-container">
            <div className={action === "Sign Up" ? "submit grey" : "submit"} onClick={() => setAction("Sign In")}>
              Sign In
            </div>
            <div className={action === "Sign In" ? "submit grey" : "submit"} onClick={() => setAction("Sign Up")}>
              Sign Up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

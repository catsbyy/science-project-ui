import React, { useState } from "react";
import { MailOutline } from "react-ionicons";
import { PersonCircleOutline } from "react-ionicons";
import { LockClosedOutline } from "react-ionicons";
import "./LoginPage.css";

interface Props {}

function LoginPage({}: Props) {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"> </div>
          <div className="wave -two"></div>
        </div>

        <div className="login-container">
          <div className="header">
            <div className="text">{isSignIn ? "Sign In" : "Sign Up"}</div>
            <div className="underline"></div>
          </div>

          <div className="inputs">
            {!isSignIn && (
              <div>
                <div className="radio">
                  <label>
                    <input type="radio" value="option1" checked={true} />
                    Option 1
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" value="option2" />
                    Option 2
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" value="option3" />
                    Option 3
                  </label>
                </div>
              </div>
            )}

            {!isSignIn && (
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

            {!isSignIn && (
              <div className="input">
                <LockClosedOutline color={"#00000"} title={"password"} height="25px" width="25px" />
                <input type="password" placeholder="Confirm Password" />
              </div>
            )}
          </div>

          {isSignIn && (
            <div className="forgot-password">
              Forget Password? <span>Click here</span>
            </div>
          )}

          <div className="submit-container">
            <div className={!isSignIn ? "submit grey" : "submit"} onClick={() => setIsSignIn(true)}>
              Sign In
            </div>
            <div className={isSignIn ? "submit grey" : "submit"} onClick={() => setIsSignIn(false)}>
              Sign Up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

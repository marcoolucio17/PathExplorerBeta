import React, { useState, useRef, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { LoginForm } from "../components/Login/LoginForm";
import "./../styles/Login.css";
import "./../index.css";

const Login = () => {
  return (
    <div id="login-main-div" className="loginMainDiv">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      
      <div id="image-background" className="imageBackground">
        <div id="image-header-main-div" className="imageHeaderMainDiv">
          <div id="image-header-div" className="mb-3">
            <h1
              className="page-title"
              style={{ width: "30%", fontSize: "72px" }}
            >
              Path Explorer
            </h1>
          </div>

          <div id="image-subheader-div" style={{ position: "relative", height: "120px" }}>
            <div
              className="subtitle-light"
              style={{ 
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%"
              }}
            >
              <TypeAnimation
                sequence={[
                  "Welcome to your next opportunity.",
                  2000,
                  "Discover where your skills can take you.",
                  2000,
                  "Start your journey with Accenture.",
                  2000,
                ]}
                wrapper="p"
                cursor={true}
                repeat={Infinity}
                style={{ 
                  textAlign: "start", 
                  fontSize: "30px",
                  margin: 0,
                  lineHeight: "1.2",
                  width: "100%"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div id="login-form" style={{ display: "flex", alignItems: "center" }}>
        <div className="loginForm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;

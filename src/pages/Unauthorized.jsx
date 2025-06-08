import React from "react";
import { GlassCard } from "src/components/shared/GlassCard";
import "src/styles/Login.css";
import { useNavigate } from "react-router";
import Button from "src/components/shared/Button";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div
      id="login-form"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2rem",
      }}
    >
      <div className="loginForm">
        <div className="mainLoginForm p-5">
          <img
            src="/images/accenture.png"
            width="230"
            height="60"
            className="accenture-logo"
            alt="Accenture Logo"
          />
          <p className="text-light mt-5 mb-5 text-xl">
            It seems you don't have access to this site. Please retry your
            login.
          </p>
          <Button type="secondary" onClick={() => navigate("/")}>
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

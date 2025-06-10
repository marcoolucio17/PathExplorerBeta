import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button2 from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Navigate, Link, useNavigate, NavLink } from "react-router";
import Spinner from "react-bootstrap/Spinner";
import "../../styles/Login.css";
import "src/index.css";
import Button from "src/components/shared/Button/Button.jsx"
import axios from "axios";

const DB_URL = "https://pathexplorer-backend.onrender.com/";
//const DB_URL = "http://localhost:8080/";

const roleMap = {
  Manager: "manager",
  User: "empleado",
  TFS: "tfs",
};

export const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eyeChanging, setEyeChanging] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    if (inputEmail && !validateEmail(inputEmail)) {
      setEmailError("Employee ID must be in format: firstname.lastname");
    } else {
      setEmailError("");
    }
  };

  const togglePassword = () => {
    setEyeChanging(true);
    setTimeout(() => {
      setShowPassword(!showPassword);
      setEyeChanging(false);
    }, 150);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleLogin();
    }
  };

  const getSpecificErrorMessage = (error) => {
    const errorMessage = error.response?.data?.error || error.message;
    const statusCode = error.response?.status;
    
    // Handle specific HTTP status codes
    if (statusCode === 400) {
      return "Invalid Employee ID or password. Please check your credentials and try again.";
    } else if (statusCode === 401) {
      return "Access denied. Please verify your credentials.";
    } else if (statusCode === 403) {
      return "Account access restricted. Please contact your administrator.";
    } else if (statusCode === 404) {
      return "Employee ID not found. Please verify your Employee ID.";
    } else if (statusCode === 500) {
      return "Server error. Please try again in a moment.";
    } else if (statusCode >= 500) {
      return "Server temporarily unavailable. Please try again later.";
    }
    
    // Handle specific error message content
    if (errorMessage.toLowerCase().includes('password')) {
      return "Incorrect password. Please check your password and try again.";
    } else if (errorMessage.toLowerCase().includes('user') || errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('not found')) {
      return "Employee ID not found. Please verify your Employee ID.";
    } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('timeout')) {
      return "Network error. Please check your connection and try again.";
    } else if (errorMessage.toLowerCase().includes('server')) {
      return "Server temporarily unavailable. Please try again in a moment.";
    } else if (errorMessage.toLowerCase().includes('missing')) {
      return "Please fill in all required fields.";
    } else if (errorMessage.toLowerCase().includes('invalid credentials') || errorMessage.toLowerCase().includes('authentication failed')) {
      return "Invalid Employee ID or password. Please check your credentials.";
    } else {
      return `Authentication failed: ${errorMessage}`;
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    setIsLoading(true);
    
    // Client-side validation
    if (!email.trim()) {
      setIsLoading(false);
      setLoginError("Employee ID is required.");
      setTimeout(() => setLoginError(""), 5000);
      return;
    }
    
    if (!password.trim()) {
      setIsLoading(false);
      setLoginError("Password is required.");
      setTimeout(() => setLoginError(""), 5000);
      return;
    }
    
    if (emailError) {
      setIsLoading(false);
      setLoginError("Please enter a valid Employee ID in the correct format.");
      setTimeout(() => setLoginError(""), 5000);
      return;
    }

    try {
      const res = await axios.post(
        DB_URL + "api/authenticate",
        { providerid: email, password },
        { withCredentials: true }
      );

      let authz = res.data.authz;
      localStorage.setItem("role", roleMap[authz]);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.user.idusuario);
      setIsLoading(false);
      navigate(roleMap[authz]);
    } catch (err) {
      setIsLoading(false);
      setLoginError(getSpecificErrorMessage(err));

      setTimeout(() => {
        setLoginError("");
      }, 6000);                                                      
    }
  };

  useEffect(() => {

  }, [])

  return (
    <div className="mainLoginForm">
      <img 
        src="/images/accenture.png" 
        width="230" 
        height="60" 
        className="accenture-logo mb-3"
        alt="Accenture Logo"
      />

      <p className="title-light" style={{ fontSize: "56px", textAlign: "center" }}>
        Sign in
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="loginFormContainer">
        <Form.Group className="form-group-animated subtitle-light" controlId="formBasicEmail">
          <input
            className="transparent-input"
            type="email"
            placeholder="Enter Employee ID"
            onChange={handleEmailChange}
            onKeyPress={handleKeyPress}
            value={email}
          />
          {emailError && (
            <div className="error-message">
              <small className="text-danger">{emailError}</small>
            </div>
          )}
        </Form.Group>

        <Form.Group className="form-group-animated subtitle-light" controlId="formBasicPassword">
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              value={password}
              className="transparent-input"
            />
            <Button2
              variant="link"
              className="position-absolute top-50 end-0 translate-middle-y me-4 p-0"
              onClick={togglePassword}
              aria-label="Toggle password visibility"
            >
              <i
                className={`bi ${
                  showPassword ? "bi-eye-slash" : "bi-eye"
                } fs-3 text-white eye-icon eye-transition ${eyeChanging ? 'changing' : ''}`}
              />
            </Button2>
          </div>
        </Form.Group>

        <Button
          type="primary"
          onClick={handleLogin}
          className="customSubmitButton mt-4"
          disabled={isLoading}
        >
          Submit
          {isLoading && (
            <Spinner
              animation="border"
              role="status"
              size="sm"
              className="ms-2"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </Button>

        {loginError && (
          <div className="login-error-container">
            <Alert className="login-error-alert" variant="danger">
              {loginError}
            </Alert>
          </div>
        )}
      </form>
    </div>
  );
};

import React from "react";
import styles from "./GlassCard.module.css";
import { useNavigate } from "react-router";

const GlassCard = ({ children, className, idrol, id }) => {
  const navigate = useNavigate();
  const authState = localStorage.getItem("role");

  // whenever the user presses this card, we save the id and redirect
  const onPress = () => {
    localStorage.setItem("projectid", id);
    localStorage.setItem("idrol", idrol);
    navigate(`/${authState}/proyecto`);
  };

  return (
    <div
      id={id}
      className={`${styles.glassCard} ${className || ""}`}
      onClick={onPress}
    >
      {children}
    </div>
  );
};

export default GlassCard;

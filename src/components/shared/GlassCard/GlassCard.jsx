import React from "react";
import styles from "./GlassCard.module.css";
import { useNavigate } from "react-router";

const GlassCard = ({ children, className }) => {

  return (
    <div
      className={`${styles.glassCard} ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;

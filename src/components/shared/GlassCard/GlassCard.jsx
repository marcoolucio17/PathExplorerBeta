import React from "react";
import styles from "./GlassCard.module.css";
import { useNavigate } from "react-router";

const GlassCard = ({ children, className, onClick, style, ...otherProps }) => {

  return (
    <div
      className={`${styles.glassCard} ${className || ""}`}
      onClick={onClick}
      style={style}
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default GlassCard;

import React from "react";
import styles from "./GlassCard.module.css";
import { useNavigate } from "react-router";

const GlassCard = ({ children, className, idrol, id, disableNavigation = false }) => {
  const navigate = useNavigate();
  const authState = localStorage.getItem("role");

  //when user clicks card, save ids and redirect with params
  const onPress = () => {
    //don't navigate if disabled
    if (disableNavigation) {
      return;
    }
    localStorage.setItem("projectid", id);
    localStorage.setItem("idrol", idrol);
    navigate(`/${authState}/proyecto/${id}/${idrol}`);
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

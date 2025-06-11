import React from "react";
import styles from "./SuccessNotification.module.css";

/**
 * Success notification component for project applications
 * 
 * @param {Object} props
 * @param {string} props.message - Success message to display
 * @param {boolean} props.isVisible - Whether the notification is visible
 */
const SuccessNotification = ({ 
  message = 'Applied to Project!',
  isVisible = false
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.notificationOverlay}>
      <div className={styles.notificationContent}>
        <div className={styles.successIcon}>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div className={styles.checkIcon}>
            <i className="bi bi-check-circle-fill"></i>
          </div>
        </div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default SuccessNotification;
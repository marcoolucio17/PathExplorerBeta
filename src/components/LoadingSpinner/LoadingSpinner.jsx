import React from "react";
import styles from "./LoadingSpinner.module.css";

/**
 * Loading spinner component for project/role transitions
 * 
 * @param {Object} props
 * @param {string} props.size - Size variant: 'small', 'medium', 'large'
 * @param {string} props.message - Optional loading message to display
 * @param {boolean} props.overlay - Whether to show as full-screen overlay
 * @param {string} props.variant - Visual variant: 'default', 'minimal', 'pulse'
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading project...', 
  overlay = false,
  variant = 'default' 
}) => {
  const containerClass = `${styles.container} ${overlay ? styles.overlay : ''} ${styles[size]}`;
  const spinnerClass = `${styles.spinner} ${styles[variant]}`;

  if (overlay) {
    return (
      <div className={containerClass}>
        <div className={styles.content}>
          <div className={spinnerClass}>
            <div className={styles.ring}></div>
            <div className={styles.ring}></div>
            <div className={styles.ring}></div>
          </div>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={spinnerClass}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
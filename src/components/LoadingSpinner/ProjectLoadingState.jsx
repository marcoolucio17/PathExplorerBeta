import React from "react";
import styles from "./ProjectLoadingState.module.css";

/**
 * Project-specific loading component for dashboard transitions
 * 
 * @param {Object} props
 * @param {string} props.message - Loading message to display
 * @param {boolean} props.showSkeletonCards - Whether to show skeleton project cards
 * @param {number} props.skeletonCount - Number of skeleton cards to show
 * @param {string} props.viewMode - 'grid' or 'list' to match current view
 */
const ProjectLoadingState = ({ 
  message = 'Loading projects...', 
  showSkeletonCards = true,
  skeletonCount = 6,
  viewMode = 'grid'
}) => {
  const containerClass = viewMode === 'grid' ? styles.gridContainer : styles.listContainer;

  if (!showSkeletonCards) {
    return (
      <div className={styles.centerLoader}>
        <div className={styles.spinner}>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
        </div>
        <p className={styles.message}>{message}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={containerClass}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.skeletonHeader}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonRole}></div>
            </div>
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLineShort}></div>
            </div>
            <div className={styles.skeletonFooter}>
              <div className={styles.skeletonChip}></div>
              <div className={styles.skeletonChip}></div>
              <div className={styles.skeletonDate}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectLoadingState;
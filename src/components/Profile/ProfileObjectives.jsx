import React, { useEffect } from "react";
import styles from "./ProfileObjectives.module.css";

/**
 * ProfileObjectives component for displaying and managing objectives
 * @param {Array} objectives - Array of objective objects
 * @param {Function} onObjectiveToggle - Function to handle objective toggle
 * @param {boolean} readOnly - Whether the component is in read-only mode
 * @returns {JSX.Element}
 */
export const ProfileObjectives = ({
  objectives = [],
  onObjectiveToggle,
  isLoading,
  readOnly = false,
}) => {
  //format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  //get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "var(--status-urgent)";
      case "medium":
        return "var(--status-progress)";
      case "low":
        return "var(--status-complete)";
      default:
        return "var(--text-muted)";
    }
  };

  //check if objective is overdue
  const isOverdue = (targetDate, completed) => {
    if (completed) return false;
    return new Date(targetDate) < new Date();
  };

  useEffect(() => {}, [isLoading]);

  return (
    <div className={styles.objectivesSection}>
      <div className={styles.objectivesList}>
        {objectives.length === 0 ? (
          <div className={styles.placeholder}>
            <i className="bi bi-bullseye"></i>
            <p>No career objectives set yet</p>
            <span>Define your professional goals to track your progress</span>
          </div>
        ) : (
          objectives.map((obj) => (
            <div
              key={obj.id}
              className={`${styles.objectiveCard} ${
                obj.completed ? styles.completed : ""
              } ${
                isOverdue(obj.targetDate, obj.completed) ? styles.overdue : ""
              }`}
            >
              <div className={styles.objectiveContent}>
                {/* left side: checkbox, title, and description */}
                <div className={styles.objectiveLeft}>
                  <div className={styles.objectiveCheckboxContainer}>
                    <input
                      type="checkbox"
                      id={`objective-${obj.id}`}
                      checked={obj.completed}
                      onChange={!readOnly ? () => onObjectiveToggle(obj) : undefined}
                      className={styles.objectiveCheckbox}
                      disabled={readOnly}
                    />
                    <div className={styles.objectiveTitleDescription}>
                      <label
                        htmlFor={`objective-${obj.id}`}
                        className={styles.objectiveTitle}
                      >
                        {obj.title}
                      </label>
                      <p className={styles.objectiveDescription}>
                        {obj.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* right side: priority and date badges */}
                <div className={styles.objectiveMeta}>
                  <span
                    className={styles.priorityBadge}
                    style={{ backgroundColor: getPriorityColor(obj.priority) }}
                  >
                    {obj.priority}
                  </span>
                  <span
                    className={`${styles.dateBadge} ${
                      isOverdue(obj.targetDate, obj.completed)
                        ? styles.overdueBadge
                        : ""
                    }`}
                  >
                    <i className="bi bi-calendar3"></i>
                    {formatDate(obj.targetDate)}
                  </span>
                </div>
              </div>

              {obj.completed && (
                <div className={styles.completedIndicator}>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Completed</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileObjectives;

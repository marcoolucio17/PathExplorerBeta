import React from "react";
import styles from "./SkillChip.module.css";

const SkillChip = ({
  text,
  iconClass,
  isUserSkill,
  isExpandTag,
  onClick,
  disabled,
  onRemove,
}) => {
  const chipClasses = [
    styles.skillChip,
    isUserSkill && styles.userSkill,
    isExpandTag && styles.expandTag,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={chipClasses} onClick={disabled ? undefined : onClick}>
      {iconClass && <i className={iconClass} />}
      {text}
      {onRemove && (
        <button
          className={styles.removeButton}
          title="Remove certificate"
          onClick={(e) => {
            onRemove();
          }}
        >
          x
        </button>
      )}
    </div>
  );
};

export default SkillChip;

import React from "react";
import { GlassCard } from "../shared/GlassCard";
import { SkillChip } from "../SkillChip";
import CustomScrollbar from "../CustomScrollbar";
import styles from "/src/components/Profile/ProfileSkills.module.css";

/**
 * ProfileSkills component for displaying skills with categories
 * @param {Object} data 
 * @param {Function} onSkillsClick - Function to handle skills button click
 * @returns {JSX.Element}
 */
export const TrendsCard = ({ data, onSkillsClick }) => {
  const skills = Array.isArray(data?.result) ? data.result : [];  const hasNoSkills = skills.length === 0 ;

  console.log("Raw data:", data);
  console.log("skills:", Array.isArray(data?.result) ? data.result : []);

  return (
    <GlassCard className={styles.skillsCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Trends</h2>
      </div>
      <div className={styles.skillsScrollContainer}>
        <CustomScrollbar fadeBackground="transparent" fadeHeight={40}>
          <div className={styles.skillsContent}>
            {hasNoSkills ? (
              <div className={styles.placeholder}>
                <i className="bi bi-gear-wide-connected"></i>
                <p>Loading...</p>
                <span>Fetching Skills</span>
              </div>
            ) : (
              <>
                {skills.length > 0 && (
                  <div className={styles.skillCategory}>
                    <h3 className={styles.categoryHeader}>Most Popular Skills</h3>
                    <div className={styles.divider}></div>
                    <div className={styles.skillChipsContainer}>
                      {skills.map((skill, index) => (
                        <SkillChip key={`hard-${skill}-${index}`} text={skill} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CustomScrollbar>
      </div>
    </GlassCard>
  );
};

export default TrendsCard;
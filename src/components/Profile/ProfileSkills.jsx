import React, { useState } from "react";
import { GlassCard } from "../shared/GlassCard";
import { SkillChip } from "../SkillChip";
import CustomScrollbar from "../CustomScrollbar";
import styles from "./ProfileSkills.module.css";
import "src/index.css";

import axios from "axios";

import LoadingSpinner from "src/components/LoadingSpinner";


const DB_URL = "https://pathexplorer-backend.onrender.com/";

/**
 * ProfileSkills component for displaying skills with categories
 * @param {Object} categorizedSkills - Object with hardSkills and softSkills arrays
 * @param {Function} onSkillsClick - Function to handle skills button click
 * @param {boolean} readOnly - Whether the component is in read-only mode
 * @returns {JSX.Element}
 */
export const ProfileSkills = ({
  categorizedSkills = { hardSkills: [], softSkills: [] },
  onSkillsClick,
  setIsLoading,
  readOnly = false,
}) => {
  const { hardSkills, softSkills } = categorizedSkills;
  const hasNoSkills = hardSkills.length === 0 && softSkills.length === 0;

  //function to remove a skill from user
  const handleRemove = async (id) => {
    if (readOnly) return;
    
    setIsLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const res = await axios.delete(
        DB_URL +
          "api/habilidades/usuario/" +
          localStorage.getItem("id") +
          "/" +
          id,
        config
      );
    } catch {
      console.log("oopsie");
    }

    setIsLoading(false);
  };


  return (
    <GlassCard className={styles.skillsCard}>
      <div className={styles.sectionHeader}>
        <h2 className="sectionTitle">My Skills</h2>
        {!readOnly && (
          <button className={styles.sectionAddBtn} onClick={onSkillsClick}>
            <i className="bi bi-plus-lg" />
          </button>
        )}
      </div>
      <div className={styles.skillsScrollContainer}>
        <CustomScrollbar fadeBackground="transparent" fadeHeight={40}>
          <div className={styles.skillsContent}>
            {hasNoSkills ? (
              <div className={styles.placeholder}>
                <i className="bi bi-gear-wide-connected"></i>
                <p>No skills added yet</p>
                <span>
                  Add your technical and soft skills to showcase your expertise
                </span>
              </div>
            ) : (
              <>
                {hardSkills.length > 0 && (
                  <div className={styles.skillCategory}>
                    <h3 className={styles.categoryHeader}>Hard Skills</h3>
                    <div className={styles.divider}></div>
                    <div className={styles.skillChipsContainer}>
                      {hardSkills.map((skill, index) => (
                        <SkillChip
                          key={`hard-${index}`}
                          text={skill.nombre}
                          onRemove={!readOnly ? () => handleRemove(skill.idhabilidad) : undefined}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {softSkills.length > 0 && (
                  <div className={styles.skillCategory}>
                    <h3 className={styles.categoryHeader}>Soft Skills</h3>
                    <div className={styles.divider}></div>
                    <div className={styles.skillChipsContainer}>
                      {softSkills.map((skill, index) => (
                        <SkillChip
                          key={`soft-${index}`}
                          text={skill.nombre}
                          onRemove={!readOnly ? () => handleRemove(skill.idhabilidad) : undefined}
                        />
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

export default ProfileSkills;

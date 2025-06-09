import React, { useState, useEffect } from "react";
import modalStyles from "src/styles/Modals/Modal.module.css";
import styles from "./SkillsModal.module.css";
import { SkillChip } from "src/components/SkillChip";
import ModalScrollbar from "src/components/Modals/ModalScrollbar";

import axios from "axios";

function groupSkillsByCategory(skillsArray) {
  return skillsArray.reduce((acc, skill) => {
    const category = skill.categoria?.cnombre || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});
}

const getFilteredCategories = (data, selectedCategory, searchTerm) => {
  const filtered = {};

  Object.entries(data).forEach(([category, skills]) => {
    // Apply category filter first
    let shouldInclude = false;

    if (selectedCategory === "all") {
      shouldInclude = true;
    } else if (selectedCategory === "hard") {
      // For hard skills, exclude soft skill categories
      shouldInclude =
        category !== "Soft Skills" &&
        category !== "Collaboration & Product Skills" &&
        category !== "Project Management & Agile";
    } else if (selectedCategory === "soft") {
      // For soft skills, only include the relevant categories
      shouldInclude =
        category === "Soft Skills" ||
        category === "Collaboration & Product Skills" ||
        category === "Project Management & Agile";
    }

    if (shouldInclude) {
      // Then filter skills by search term if there is one
      if (searchTerm) {
        const filteredSkills = skills.filter((skill) =>
          skill.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredSkills.length > 0) {
          filtered[category] = filteredSkills;
        }
      } else {
        // If no search term, include all skills in the category
        filtered[category] = skills;
      }
    }
  });

  return filtered;
};

const DB_URL = "https://pathexplorer-backend.onrender.com/";

export const SkillsModal = ({
  isOpen,
  onClose,
  userSkills = [],
  onUpdateSkills,
  onUpdateSkillsFilter = () => { },
  disabledSkills = [],
  setLoad = () => { },
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState(new Set(userSkills));
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const disabledSkillsSet = new Set(disabledSkills.map((skill) => skill.idhabilidad));
  const [SKILLS_DATA, setSkillsData] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      setSelectedSkills(new Set(userSkills));
    }

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const fetchSkills = async () => {
      const res = await axios.get(DB_URL + "api/habilidades", config);
      setSkillsData(groupSkillsByCategory(res.data));
    };
    fetchSkills();
  }, [isOpen]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const toggleSkill = (skill) => {
    const newSelectedSkills = new Set(selectedSkills);
    if (newSelectedSkills.has(skill)) {
      newSelectedSkills.delete(skill);
    } else {
      newSelectedSkills.add(skill);
    }
    setSelectedSkills(newSelectedSkills);
  };

  const toggleCategory = (category) => {
    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(category)) {
      newExpandedCategories.delete(category);
    } else {
      newExpandedCategories.add(category);
    }
    setExpandedCategories(newExpandedCategories);
  };

  const handleSave = async () => {
    setLoad(true);
    await onUpdateSkills(Array.from(selectedSkills));
    onUpdateSkillsFilter(Array.from(selectedSkills));
    handleClose();
    setLoad(false);
  };

  const filteredCategories = getFilteredCategories(
    SKILLS_DATA,
    selectedCategory,
    searchTerm
  );

  return (
    <div
      className={`${modalStyles.modalBackdrop} ${
        isClosing ? modalStyles.closing : ""
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${modalStyles.modalContent} ${
          isClosing ? modalStyles.closing : ""
        }`}
      >
        <button className={modalStyles.closeButton} onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.title}>Manage Skills</h2>
          <p className={modalStyles.subtitle}>
            Add or remove skills from your profile
          </p>
          <p className={styles.selectedCount}>
            {selectedSkills.size} skills selected
          </p>

          <div className={styles.searchBox}>
            <i className={`bi bi-search ${styles.searchIcon}`}></i>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                selectedCategory === "all" ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory("all")}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${
                selectedCategory === "hard" ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory("hard")}
            >
              Hard Skills
            </button>
            <button
              className={`${styles.filterButton} ${
                selectedCategory === "soft" ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory("soft")}
            >
              Soft Skills
            </button>
          </div>
        </div>

        <div
          className={modalStyles.modalBody}
          style={{ height: "calc(100% - 200px)" }}
        >
          {Object.entries(filteredCategories).map(([category, skills]) => (
            <div key={category} className={styles.categorySection}>
              <button
                className={`${styles.categoryHeader} ${
                  expandedCategories.has(category) ? styles.expanded : ""
                }`}
                onClick={() => toggleCategory(category)}
              >
                <span>{category}</span>
                <i className={`bi bi-chevron-down`}></i>
              </button>

              {expandedCategories.has(category) && (
                <div className={styles.skillsList}>
                  {skills.map((skill) => (
                    <SkillChip
                      key={skill.idhabilidad}
                      text={skill.nombre}
                      iconClass={
                        selectedSkills.has(skill.nombre)
                          ? "bi bi-check-circle-fill"
                          : null
                      }
                      isUserSkill={selectedSkills.has(skill.nombre)}
                      onClick={() => toggleSkill(skill.nombre)}
                      disabled={disabledSkillsSet.has(skill.idhabilidad)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={modalStyles.buttonGroup}>
          <button onClick={handleClose} className={modalStyles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSave} className={modalStyles.saveButton}>
            <i className="bi bi-check-lg"></i>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

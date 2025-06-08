import React, { useEffect } from "react";
import ProjectCard from "src/components/GridList/Project/ProjectCard";
import { ProjectLoadingState } from "src/components/LoadingSpinner";
import styles from "src/styles/GridList/GridListContainer.module.css";

import { Navigate, Link, useNavigate, NavLink } from "react-router";

/**
 * ProjectList component to display projects in grid or list view
 *
 * @param {Object} props
 * @param {Array} props.projects - Array of project objects to display
 * @param {string} props.viewMode - 'grid' or 'list' display mode
 * @param {boolean} props.showCompatibility - Whether to show compatibility circle
 * @param {Array} props.selectedSkillFilters - Array of selected skill filters to highlight
 * @param {Array} props.userSkills - Array of skills that the current user has
 * @param {Function} props.calculateMatchPercentage - Function to calculate match percentage
 * @param {Function} props.onClearFilters - Function called when Clear Filters button is clicked
 * @param {boolean} props.isLoading - Whether items are currently loading
 */
const ProjectList = ({
  tabSelected = "All",
  projects = [],
  viewMode,
  showCompatibility,
  selectedSkillFilters = [],
  userSkills = [],
  onClearFilters,
  isLoading = false,
}) => {

  // Safety check for undefined/null projects array
  const safeProjects = Array.isArray(projects) ? projects : [];
  //if loading, show enhanced project loading state
  if (isLoading) {
    return (
      <ProjectLoadingState 
        message="Loading projects..." 
        viewMode={viewMode}
        showSkeletonCards={true}
        skeletonCount={6}
      />
    );
  }

  // If no projects, show empty state

  if (safeProjects.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.noItemsMessage}>
          <i
            className="bi bi-briefcase"
            style={{ fontSize: "2rem", marginBottom: "1rem" }}
          ></i>
          <p>No projects match your selected filters</p>
          <button
            className={styles.clearFiltersButton}
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  // Container class based on viewMode
  const containerClass =
    viewMode === "grid" ? styles.gridContainer : styles.listContainer;
  // Create a unique key for the container to force re-render and animation restart
  const containerKey = `container-projects-${viewMode}`;
  return (
    <div key={containerKey} className={containerClass}>
      {safeProjects.map((item, index) => {

        // Check if item has the expected
        // structure

        if (!item || !item.project) {
          return null; // Skip rendering this item
        }

        // For project cards (My Projects tab), we don't have proyecto_rol
        const isProjectCard = item.isProjectCard || false;
        const isApplyCard = item.isApplyCard || false;
        const projectId = item.idproject || item.project.idproyecto || item.project.proyecto.idproyecto || "unknown";

        if (!isProjectCard && !isApplyCard) {

          if (Array.isArray(item.proyecto_rol)) {

            return item.proyecto_rol.map((rol, rolindex) => {

              // Fix role ID extraction - check the nested structure
              let roleId = null;

              if (!isProjectCard && rol) {
                roleId = rol.idrol || null;
              }
              let compatibilityValue = null;
              if (!isProjectCard && rol) {
                compatibilityValue = rol.roles.compability || 0; // Default to 0 if not available
              }
              // Force cards to always re-render when filter changes with a unique key
              const renderKey = `${projectId}-${roleId || 'project'}-${index}-${rolindex}`;

              return (
                <div key={renderKey} className={styles.item}>

                  <ProjectCard

                    id={projectId}
                    idrol={roleId}
                    project={item.project}
                    proyecto_rol={rol.roles}
                    viewMode={viewMode}
                    compatibilityValue={compatibilityValue}
                    showCompatibility={showCompatibility}
                    selectedSkillFilters={selectedSkillFilters}
                    userSkills={userSkills}
                    index={index}
                    isProjectCard={isProjectCard}
                  />
                </div>
              );

            });
          } else {
            // Fix role ID extraction - check the nested structure
            let roleId = null;

            if (!isProjectCard && item.proyecto_rol) {
              roleId = item.proyecto_rol.idrol || null;
            } else {
              roleId = item.project.idrol || null; // Fallback to idrol if proyecto_rol is not available
            }
            let compatibilityValue = null;
            if (!isProjectCard && item.proyect) {
              compatibilityValue = item.proyect.compability || 0; // Default to 0 if not available
            } else {

              compatibilityValue = item.project.compability || 0; // Default to 0 if not available
            }

            const renderKey = `${projectId}-${roleId || 'project'}`;
            return (


              // Force cards to always re-render when filter changes with a unique key

              <div key={renderKey} className={styles.item}>

                <ProjectCard
                  id={projectId}
                  idrol={roleId}
                  project={item.project}
                  proyecto_rol={item.proyecto_rol ? item.proyecto_rol : null}
                  viewMode={viewMode}
                  compatibilityValue={compatibilityValue}
                  showCompatibility={showCompatibility}
                  selectedSkillFilters={selectedSkillFilters}
                  userSkills={userSkills}
                  index={index}
                  isProjectCard={isProjectCard}
                  tabActive={tabSelected}
                />
              </div>
            );
          }
        }
        else if (isProjectCard && !isApplyCard) {
          // For project cards, we only have the project object

          return (
            <div key={`${projectId}-${index}`} className={styles.item}>
              <ProjectCard
                id={projectId}
                project={item.project}
                viewMode={viewMode}
                showCompatibility={showCompatibility}
                selectedSkillFilters={selectedSkillFilters}
                userSkills={userSkills}
                isProjectCard={true} // Indicate this is a project-level card
                tabActive={tabSelected}
              />
            </div>
          );
        } else if (isApplyCard && !isProjectCard) {
          // For applied to cards, we only have the project object

          return (
            <div key={`${projectId}-${item.idaplicacion}-${item.project.roles.idrol}`} className={styles.item}>
              <ProjectCard
                id={projectId}
                project={item.project}
                viewMode={viewMode}
                showCompatibility={showCompatibility}
                selectedSkillFilters={selectedSkillFilters}
                userSkills={userSkills}
                isApplyCard={true} // Indicate this is an applied to card
                tabActive={tabSelected}
              />
            </div>
          );
        }

      })}
    </div>
  );
};

export default ProjectList;
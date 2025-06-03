import React from "react";
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
  tabSelected,
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
  console.log("View Mode:", viewMode);
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
        // Check if item has the expected structure
        if (!item || !item.project || !item.proyecto_rol) {
          console.warn("Invalid project item structure:", item);
          return null; // Skip rendering this item
        }

        // Calculate match percentage if function is provided
        /*const matchPercentage = calculateMatchPercentage ? 
          calculateMatchPercentage(item.project, item.proyecto_rol) : 0;*/

        // Force cards to always re-render when filter changes with a unique key
        const renderKey = `${item.project.idproyecto || "unknown"}-${
          item.proyecto_rol.idrol || "unknown"
        }-${index}`;
        console.log(item);
        console.log(item.project.proyecto_roles)

        return (
          <div key={renderKey} className={styles.item}>
            {tabSelected === "All" && (
            <ProjectCard
              id = {item.project.idproyecto}
                idrol={item.proyecto_rol.idrol}
              project={item.project}
              proyecto_rol={item.proyecto_rol}
              viewMode={viewMode}
                compatibilityValue={item.proyecto_rol.compability}
              showCompatibility={showCompatibility}
              selectedSkillFilters={selectedSkillFilters}
              userSkills={userSkills}
              index={index}
              />)}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectList;
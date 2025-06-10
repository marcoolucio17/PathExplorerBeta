import React from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "src/components/GridList/User/UserCard";
import { ProjectLoadingState } from "src/components/LoadingSpinner";
import styles from "src/styles/GridList/GridListContainer.module.css";

/**
 * userlist component to display users in grid or list view
 *
 * @param {Object} props
 * @param {Array} props.projects - array of user objects to display (keeping name for consistency)
 * @param {string} props.viewMode - 'grid' or 'list' display mode
 * @param {boolean} props.showCompatibility - whether to show compatibility circle
 * @param {Array} props.selectedSkillFilters - array of selected skill filters to highlight
 * @param {Array} props.userSkills - array of skills that the current user has
 * @param {Function} props.calculateMatchPercentage - function to calculate match percentage
 * @param {Function} props.onClearFilters - function called when clear filters button is clicked
 * @param {boolean} props.isLoading - whether items are currently loading
 */
const UserList = ({
  projects: users = [], //keeping projects name for consistency with existing components
  viewMode,
  showCompatibility,
  selectedSkillFilters = [],
  userSkills = [],
  onClearFilters,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  //handle user card click to navigate to employee profile
  const handleUserClick = (user) => {
    if (user && user.idusuario) {
      const userRole = localStorage.getItem("role") || "empleado";
      navigate(`/${userRole}/employee/${user.idusuario}`);
    }
  };

  //safety check for undefined/null users array
  const safeUsers = Array.isArray(users) ? users : [];

  //if loading, show enhanced loading state
  if (isLoading) {
    return (
      <ProjectLoadingState 
        message="Loading users..." 
        viewMode={viewMode}
        showSkeletonCards={true}
        skeletonCount={6}
      />
    );
  }

  //if no users, show empty state
  if (safeUsers.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        <div className={styles.noItemsMessage}>
          <i
            className="bi bi-people"
            style={{ fontSize: "2rem", marginBottom: "1rem" }}
          ></i>
          <p>no users match your selected filters</p>
          <button
            className={styles.clearFiltersButton}
            onClick={onClearFilters}
          >
            clear filters
          </button>
        </div>
      </div>
    );
  }

  //container class based on viewMode
  const containerClass =
    viewMode === "grid" ? styles.gridContainer : styles.listContainer;

  //create a unique key for the container to force re-render and animation restart
  const containerKey = `container-users-${viewMode}`;

  return (
    <div key={containerKey} className={containerClass}>
      {safeUsers.map((user, index) => {
        //check if user has the expected structure
        if (!user || !user.idusuario) {
          console.warn("invalid user item structure:", user);
          return null; //skip rendering this item
        }

        //force cards to always re-render when filter changes with a unique key
        const renderKey = `${user.idusuario || "unknown"}-${index}`;

        return (
          <div key={renderKey} className={styles.item}>
            <UserCard
              user={user}
              viewMode={viewMode}
              showCompatibility={showCompatibility}
              selectedSkillFilters={selectedSkillFilters}
              userSkills={userSkills}
              index={index}
              onClick={() => handleUserClick(user)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default UserList;

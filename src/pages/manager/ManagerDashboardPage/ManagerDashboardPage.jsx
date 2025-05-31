import React from "react";

// Custom Hooks
import useManagerDashboardPage from '../../../hooks/dashboard/useManagerDashboardPage';
import useDashboardHeaderConfig from '../../../hooks/dashboard/useDashboardHeaderConfig';

// Components
import ProjectList from '../../../components/GridList/Project/ProjectList';
import CustomScrollbar from '../../../components/CustomScrollbar';
import { SkillsModal } from "../../../components/Modals/SkillsModal";
import { ClientsModal } from "../../../components/Modals/ClientsModal";
import { RolesModal } from "../../../components/Modals/RolesModal";
import { SearchHeader } from "../../../components/SearchHeader";
import { Tabs } from "../../../components/Tabs";
import Button from "../../../components/shared/Button";
import { useNavigate, NavLink } from "react-router";
// CSS
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";

// Modals
import { CreateProjectModal } from "src/components/Modals/CreateProjectModal";

/**
 * Dashboard component for Manager role
 */
export const ManagerDashboardPage = () => {
  // Use the manager-specific dashboard hook
  const dashboardPage = useManagerDashboardPage();

  // Get header configuration
  const headerProps = useDashboardHeaderConfig(dashboardPage);

  // Handle creating a new project
  const handleCreateProject = () => {
    dashboardPage.toggleCreateProjectModal()
  };

  console.log("Client name", dashboardPage.clientNameSelected);
  console.log("Client ID", dashboardPage.clientId);
  console.log("Role ID", dashboardPage.roleId);
  console.log("Role name", dashboardPage.roleNameSelected);
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Project Dashboard</h1>
        </div>

        {/* Search header with filters */}
        <SearchHeader {...headerProps} />

        {/* Tabs for different project statuses */}
        <Tabs
          tabs={dashboardPage.tabNames.map(tab => ({
            name: tab,
            notificationCount: dashboardPage.tabCounts[tab] || 0
          }))}
          activeTab={dashboardPage.activeTab}
          onTabClick={dashboardPage.setActiveTab}
        />

        {/* Main content area with projects list */}
        <div className={styles.cardsContainer}>
          {/* New Project button for My Projects tab */}
          {dashboardPage.activeTab === 'My Projects' && (
            <div className={styles.tabActionSimple}>
              <Button
                type="primary"
                icon="bi-plus"
                onClick={handleCreateProject}
                className={styles.createProjectButton}
              >
                New Project
              </Button>
            </div>
          )}

          <CustomScrollbar
            fadeBackground="transparent"
            fadeHeight={40}
            showHorizontalScroll={false}
            showSideFades={false}
          >
            <ProjectList
              projects={dashboardPage.displayProjects}
              viewMode={dashboardPage.viewMode}
              showCompatibility={dashboardPage.showCompatibility}
              selectedSkillFilters={dashboardPage.selectedSkillFilters}
              userSkills={dashboardPage.userSkills}
              calculateMatchPercentage={dashboardPage.calculateMatchPercentage}
              onClearFilters={dashboardPage.handleClearFilters}
              isLoading={dashboardPage.isLoading}
              dashboardShow={dashboardPage.activeTab}
            />
          </CustomScrollbar>
        </div>
      </div>

      {/* Modals */}
      <SkillsModal
        isOpen={dashboardPage.modals.skillsFilter}
        onClose={() => dashboardPage.closeModal('skillsFilter')}
        userSkills={dashboardPage.selectedSkillFilters}
        onUpdateSkills={dashboardPage.handleApplySkillFilters}
      />

      <NavLink to="/manager/create-project">
        <button className="btn btn-primary">
          Crear Proyecto
        </button>
      </NavLink>


    </div>
  );
};

export default ManagerDashboardPage;

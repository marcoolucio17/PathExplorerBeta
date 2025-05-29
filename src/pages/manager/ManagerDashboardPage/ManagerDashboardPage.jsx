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

// CSS
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";


export const ManagerDashboardPage = () => {
  //use the manager-specific dashboard hook
  const dashboardPage = useManagerDashboardPage();

  //get header configuration
  const headerProps = useDashboardHeaderConfig(dashboardPage);


  //handle creating a new project
  const handleCreateProject = () => {
    // wait TODO:Add logic to open create project modal or navigate to create project page
    console.log('Creating new project...');
  };

  console.log(dashboardPage.modals.skillsFilter);
  console.log(dashboardPage.modals.clientsFilter);
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
      <ClientsModal
        isOpen={dashboardPage.modals.clientsFilter}
        onClose={() => dashboardPage.closeModal('clientsFilter')}
        selectedClients={dashboardPage.selectedClientFilters}
        onClientSelected={dashboardPage.handleApplyClientFilters}
        clients={dashboardPage.clients}
      />

      <RolesModal
        isOpen={dashboardPage.modals.rolesFilter}
        onClose={() => dashboardPage.closeModal('rolesFilter')}
        selectedRole={dashboardPage.selectedRoleFilters}
        onRoleSelected={dashboardPage.handleApplyRoleFilters}
        roles={dashboardPage.roles}
      />
    </div>
  );
};

export default ManagerDashboardPage;

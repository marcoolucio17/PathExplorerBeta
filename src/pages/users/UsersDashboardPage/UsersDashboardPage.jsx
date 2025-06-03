import React from "react";

// Custom Hooks
import useUsersDashboardPage from '../../../hooks/users/useUsersDashboardPage';
import useUsersDashboardHeaderConfig from '../../../hooks/users/useUsersDashboardHeaderConfig';

// Components
import UserList from '../../../components/GridList/User/UserList';
import CustomScrollbar from '../../../components/CustomScrollbar';
import { SkillsModal } from "../../../components/Modals/SkillsModal";
import { SearchHeader } from "../../../components/SearchHeader";
import { Tabs } from "../../../components/Tabs";

// CSS
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";

/**
 * dashboard component for users
 * displays all users with filtering and search capabilities
 */
export const UsersDashboardPage = () => {
  //use the users-specific dashboard hook
  const dashboardPage = useUsersDashboardPage();
  
  //get users-specific header configuration
  const headerProps = useUsersDashboardHeaderConfig(dashboardPage);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Employees Dashboard</h1>
        </div>
        
        <SearchHeader {...headerProps} />
        
        <Tabs 
          tabs={dashboardPage.tabNames.map(tab => ({
            name: tab,
            notificationCount: dashboardPage.tabCounts[tab] || 0
          }))}
          activeTab={dashboardPage.activeTab}
          onTabClick={dashboardPage.setActiveTab}
        />

        {/* main content area with users list */}
        <div className={styles.cardsContainer}>
          <CustomScrollbar fadeBackground="transparent" fadeHeight={40} showHorizontalScroll={false}>
            <UserList 
              projects={dashboardPage.displayProjects}
              viewMode={dashboardPage.viewMode}
              showCompatibility={dashboardPage.showCompatibility}
              selectedSkillFilters={dashboardPage.selectedSkillFilters}
              userSkills={dashboardPage.userSkills}
              calculateMatchPercentage={dashboardPage.calculateMatchPercentage}
              onClearFilters={dashboardPage.handleClearFilters}
              isLoading={dashboardPage.isLoading}
            />
          </CustomScrollbar>
        </div>
      </div>

      {/* modals */}
      <SkillsModal 
        isOpen={dashboardPage.modals.skillsFilter}
        onClose={() => dashboardPage.closeModal('skillsFilter')}
        userSkills={dashboardPage.selectedSkillFilters}
        onUpdateSkills={dashboardPage.handleApplySkillFilters}
      />
    </div>
  );
};

export default UsersDashboardPage;

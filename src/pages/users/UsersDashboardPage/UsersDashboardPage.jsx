import React from "react";

import useUsersDashboardPage from '../../../hooks/users/useUsersDashboardPage';
import useUsersDashboardHeaderConfig from '../../../hooks/users/useUsersDashboardHeaderConfig';

import UserList from '../../../components/GridList/User/UserList';
import CustomScrollbar from '../../../components/CustomScrollbar';
import { SkillsModal } from "../../../components/Modals/SkillsModal";
import { RoleFilterModal } from "../../../components/Modals/RoleFilterModal";
import { SearchHeader } from "../../../components/SearchHeader";
import { Tabs } from "../../../components/Tabs";

import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";

/**
 * dashboard component for users
 * displays all users with filtering and search capabilities
 */
export const UsersDashboardPage = () => {
  const dashboardPage = useUsersDashboardPage();
  
  const headerProps = useUsersDashboardHeaderConfig(dashboardPage);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Employees Dashboard</h1>
        </div>
        
        <SearchHeader {...headerProps} />
        
        <Tabs 
          tabs={[{
            name: 'All Employees',
            notificationCount: dashboardPage.tabCounts['All Employees'] || 0
          }]}
          activeTab={dashboardPage.activeTab}
          onTabClick={dashboardPage.setActiveTab}
        />

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

      <SkillsModal 
        isOpen={dashboardPage.modals.skillsFilter}
        onClose={() => dashboardPage.closeModal('skillsFilter')}
        userSkills={dashboardPage.selectedSkillFilters}
        onUpdateSkills={dashboardPage.handleApplySkillFilters}
      />

      <RoleFilterModal
        isOpen={dashboardPage.modals.roleFilter}
        onClose={() => dashboardPage.closeModal('roleFilter')}
        selectedRoles={dashboardPage.filterStates?.selectedRoles || []}
        onUpdateRoles={dashboardPage.handleApplyRoleFilters}
      />
    </div>
  );
};

export default UsersDashboardPage;
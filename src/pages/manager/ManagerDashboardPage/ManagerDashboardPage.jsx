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
import { NavLink } from "react-router";

// CCS
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";

/**
 * Dashboard component for Manager role
 * 
 */
export const ManagerDashboardPage = () => {
  // Use the manager-specific dashboard hook
  const dashboardPage = useManagerDashboardPage();
  // Get manager-specific header configuration
  const headerProps = useDashboardHeaderConfig({...dashboardPage, activeTab: dashboardPage.activeTab});


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
        {/* Main content area with projects list with the create project button */}
        <div className={styles.cardsContainer}>
          {/* The create project button appears only in the My Projects active tab */}
          {dashboardPage.activeTab === 'My Projects' && (
            <div className={styles.tabActionSimple}>
              <NavLink to="/manager/create-project">
                <Button
                  type="primary"
                  icon="bi-plus"
                >
                  New Project
                </Button>
              </NavLink>
            </div>
          )}

          <CustomScrollbar
            fadeBackground="transparent"
            fadeHeight={40}
            showHorizontalScroll={false}
          >

            <ProjectList
              tabSelected={dashboardPage.activeTab}
              projects={dashboardPage.displayProjects}
              viewMode={dashboardPage.viewMode}
              showCompatibility={dashboardPage.showCompatibility}
              selectedSkillFilters={dashboardPage.selectedSkillFilters}
              userSkills={dashboardPage.userSkills}
              onClearFilters={dashboardPage.handleClearFilters}
              isLoading={dashboardPage.isLoading}
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
        roleNameStatus={dashboardPage.roleNameSelected}
        roleIdStatus={dashboardPage.roleId}
        onRoleSelected={dashboardPage.handleApplyRoleFilters}
        roles={dashboardPage.roles}
      />
    </div>
  );
};

export default ManagerDashboardPage;

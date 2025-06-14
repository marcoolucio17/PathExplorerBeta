import React, { useState, useEffect, useRef } from "react";

// Custom Hooks
import useEmpleadoDashboardPage from '../../../hooks/dashboard/useEmpleadoDashboardPage';
import useEmpleadoDashboardHeaderConfig from '../../../hooks/dashboard/useEmpleadoDashboardHeaderConfig';

// Components
import ProjectList from '../../../components/GridList/Project/ProjectList';
import CustomScrollbar from '../../../components/CustomScrollbar';
import { SkillsModal } from "../../../components/Modals/SkillsModal";
import { ClientsModal } from "../../../components/Modals/ClientsModal";
import { RolesModal } from "../../../components/Modals/RolesModal";
import { ViewApplicationModal } from "../../../components/Modals/ViewApplicationModal";
import { SearchHeader } from "../../../components/SearchHeader";
import { Tabs } from "../../../components/Tabs";
import Alert from "react-bootstrap/Alert";
// CSS
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";

/**
 * Dashboard component for Employee role
 * 
 */
export const EmpleadoDashboardPage = () => {

  // Use the employee-specific dashboard hook
  const dashboardPage = useEmpleadoDashboardPage();

  
  // Get employee-specific header configuration (excludes manager buttons)
  const headerProps = useEmpleadoDashboardHeaderConfig(dashboardPage);

  return (
    <>
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Project Dashboard</h1>
        </div>
        
        {/* Search header with filters */}
        <SearchHeader {...headerProps} />
          {dashboardPage.errorUserSkills && <div className="login-error-container" style={{ width: "100%" }}>
            <Alert className="login-error-alert" variant="danger">
              {dashboardPage.errorUserSkills}
            </Alert>
          </div >}
        {/* Tabs for different project statuses */}
          {!dashboardPage.errorUserSkills && <><Tabs 
          tabs={dashboardPage.tabNames.map(tab => ({
            name: tab,
            notificationCount: dashboardPage.tabCounts[tab] || 0
          }))}
          activeTab={dashboardPage.activeTab}
          onTabClick={dashboardPage.setActiveTab}
        />

            {/* Main content area with projects list */}

            <div className={styles.cardsContainer}>
            <CustomScrollbar fadeBackground="transparent" fadeHeight={40} showHorizontalScroll={false}>
              {dashboardPage.allErrorProjectsDashboard[dashboardPage.activeTab] && <div className="login-error-container" style={{ width: "100%" }}>
                <Alert className="login-error-alert" variant="danger">
                  {dashboardPage.allErrorProjectsDashboard[dashboardPage.activeTab]}
                </Alert>
              </div >}
              {!dashboardPage.allErrorProjectsDashboard[dashboardPage.activeTab] && <ProjectList
                tabSelected={dashboardPage.activeTab}
                projects={dashboardPage.displayProjects}
                viewMode={dashboardPage.viewMode}
                showCompatibility={dashboardPage.showCompatibility}
                selectedSkillFilters={dashboardPage.selectedSkillFilters}
                userSkills={dashboardPage.userSkills}
                onClearFilters={dashboardPage.handleClearFilters}
                isLoading={dashboardPage.isLoading}
                onViewApplication={dashboardPage.handleViewApplication}
              />}
              </CustomScrollbar>
            </div></>}
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
        clientNameStatus={dashboardPage.clientNameSelected}
        clientIdStatus={dashboardPage.clientId}
        selectedClients={dashboardPage.selectedClientFilters}
        onClientSelected={dashboardPage.handleApplyClientFilters}
          clients={dashboardPage.clients}
          error={dashboardPage.errorClients}
      />
      <RolesModal
        isOpen={dashboardPage.modals.rolesFilter}
        onClose={() => dashboardPage.closeModal('rolesFilter')}
        roleNameStatus={dashboardPage.roleNameSelected}
        roleIdStatus={dashboardPage.roleId}
        onRoleSelected={dashboardPage.handleApplyRoleFilters}
          roles={dashboardPage.roles}
          error={dashboardPage.errorRoles}
      />
      <ViewApplicationModal
        isOpen={dashboardPage.modals.viewApplication}
        onClose={dashboardPage.handleCloseViewApplication}
        applicant={dashboardPage.transformApplicationData(dashboardPage.selectedApplication)}
        readOnly={true}
        messageOnly={true}
      />

      </div>

    </>
  );
};

export default EmpleadoDashboardPage;
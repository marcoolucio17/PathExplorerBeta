import React, { useState, useEffect, useRef } from "react";

// Custom Hooks
import useTFSApplicantsPage from '../../../hooks/applicants/useTFSApplicantsPage';
import useTFSApplicantsHeaderConfig from '../../../hooks/applicants/useTFSApplicantsHeaderConfig';

// Components
import Button from '../../../components/shared/Button';
import ApplicantsList from "../../../components/GridList/Applicant/ApplicantsList";
import CustomScrollbar from '../../../components/CustomScrollbar';
import { SkillsModal } from "../../../components/Modals/SkillsModal";
import { ProjectFilterModal } from "../../../components/Modals/ProjectFilterModal";
import { ViewApplicationModal } from "../../../components/Modals/ViewApplicationModal";
import { SearchHeader } from "../../../components/SearchHeader";
import { Tabs } from "../../../components/Tabs";
import Alert from "react-bootstrap/Alert";

// CSS
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";

/**
 * TFS Applicants component
 * Shows applications for TFS to manage assignment process
 */
export const TFSApplicantsPage = () => {
  const [loadingError, setLoadingError] = useState(true);
  const [dataError, setDataError] = useState("Error fetching your data. Please try again later.");
  // Use the custom hook to handle all logic
  const applicantsPage = useTFSApplicantsPage();
  
  // Get header configuration
  const headerProps = useTFSApplicantsHeaderConfig(applicantsPage);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <div className={styles.pageHeader}>
          <Button 
            type="secondary"
            variant="back"
            icon="bi bi-arrow-left"
            onClick={applicantsPage.handleBack}
          >
            Back to Dashboard
          </Button>
          <h1 className={styles.pageTitle}>Application Management</h1>
        </div>
        
        {/* Search header with filters */}
        <SearchHeader {...headerProps} />
        {loadingError && <div className="login-error-container" style={{ width: "100%" }}>
          <Alert className="login-error-alert" variant="danger">
            {dataError}
          </Alert>
        </div >}
        {/* Tabs for different application statuses */}
        <Tabs 
          tabs={applicantsPage.tabNames.map(tab => ({
            name: tab,
            notificationCount: applicantsPage.tabCounts[tab] || 0
          }))}
          activeTab={applicantsPage.activeTab}
          onTabClick={applicantsPage.setActiveTab}
        />

        {/* Main content area with applicants list */}
        <div className={styles.cardsContainer}>
          <CustomScrollbar fadeBackground="transparent" fadeHeight={40} showHorizontalScroll={false}>
            <ApplicantsList 
              applicants={applicantsPage.visibleItems}
              viewMode={applicantsPage.viewMode}
              showCompatibility={applicantsPage.showCompatibility}
              activeTab={applicantsPage.activeTab}
              isLoading={applicantsPage.isLoading}
              calculateMatchPercentage={applicantsPage.calculateMatchPercentage}
              onViewRequest={applicantsPage.handleViewRequest}
              onViewReason={applicantsPage.handleViewApplicant}
              onViewAssign={applicantsPage.handleViewApplicant}
              onClearFilters={applicantsPage.handleClearFilters}
            />
          </CustomScrollbar>
        </div>
      </div>
      
      {/* Modals */}
      <ProjectFilterModal
        isOpen={applicantsPage.modals.projectFilter}
        onClose={() => applicantsPage.closeModal('projectFilter')}
        currentProject={applicantsPage.filterStates.selectedProject}
        projectOptions={applicantsPage.projectOptions}
        onSelectProject={value => {
          applicantsPage.filterStates.setSelectedProject(value);
          applicantsPage.closeModal('projectFilter');
        }}
      />

      <SkillsModal 
        isOpen={applicantsPage.modals.skillsFilter}
        onClose={() => applicantsPage.closeModal('skillsFilter')}
        userSkills={applicantsPage.filterStates.selectedSkills}
        onUpdateSkills={skills => {
          applicantsPage.filterStates.setSelectedSkills(skills);
          applicantsPage.closeModal('skillsFilter');
        }}
        availableSkills={applicantsPage.skillOptions}
      />

      <ViewApplicationModal
        isOpen={applicantsPage.modals.viewRequest}
        onClose={() => applicantsPage.closeModal('viewRequest')}
        applicant={applicantsPage.selectedItem}
        onAccept={applicantsPage.handleAcceptApplicant}
        onDeny={applicantsPage.handleDenyApplicant}
        onViewProfile={applicantsPage.handleViewProfile}
        readOnly={applicantsPage.activeTab === 'Pending Assignment'}
      />
    </div>
  );
};

export default TFSApplicantsPage;
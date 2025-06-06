import React from "react";

// Custom Hooks
import useApplicantsPage from '../../../hooks/applicants/useApplicantsPage';
import useApplicantsHeaderConfig from '../../../hooks/applicants/useApplicantsHeaderConfig';

// Components
import Button from '../../../components/shared/Button';
import ApplicantsList from "../../../components/GridList/Applicant/ApplicantsList";
import CustomScrollbar from '../../../components/CustomScrollbar';
import { SkillsModal } from "../../../components/Modals/SkillsModal";
import { DenialReasonModal } from "../../../components/Modals/DenialReasonModal";
import { ProjectFilterModal } from "../../../components/Modals/ProjectFilterModal";
import { CVModal } from "src/components/Modals/CVModal";
import { ViewApplicationModal } from "../../../components/Modals/ViewApplicationModal";
import { AssignEmployeeModal } from "../../../components/Modals/AssignEmployeeModal";
import { SearchHeader } from "../../../components/SearchHeader";
import { Tabs } from "../../../components/Tabs";

// CSS
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";

/**
 * Applicants component for Manager role
 * Shows all applicants for the manager's projects with tabs for different application statuses
 */
export const ManagerApplicantsPage = () => {
  // Use the custom hook to handle all logic
  const applicantsPage = useApplicantsPage();
  
  // Get header configuration
  const headerProps = useApplicantsHeaderConfig(applicantsPage);

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
          <h1 className={styles.pageTitle}>Project Applicants</h1>
        </div>
        
        {/* Search header with filters */}
        <SearchHeader {...headerProps} />
        
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

      <DenialReasonModal
        isOpen={applicantsPage.modals.denialReason}
        onClose={() => applicantsPage.closeModal('denialReason')}
        applicant={applicantsPage.selectedItem}
        onAccept={applicantsPage.handleAcceptDeniedApplicant}
        onAppeal={applicantsPage.handleAppealDeniedApplicant}
      />

      <CVModal
        isOpen={applicantsPage.modals.assign}
        onClose={() => applicantsPage.closeModal('assign')}
        applicant={applicantsPage.selectedItem}
      />

      <ViewApplicationModal
        isOpen={applicantsPage.modals.viewRequest}
        onClose={() => applicantsPage.closeModal('viewRequest')}
        applicant={applicantsPage.selectedItem}
        onAccept={applicantsPage.handleAcceptApplicant}
        onDeny={applicantsPage.handleDenyApplicant}
        onViewProfile={applicantsPage.handleViewProfile}
        readOnly={applicantsPage.selectedItem?.status === 'In Review'}
      />

      <AssignEmployeeModal
        isOpen={applicantsPage.modals.assignEmployee}
        onClose={() => applicantsPage.closeModal('assignEmployee')}
        applicant={applicantsPage.selectedItem}
        onDeny={applicantsPage.handleDenyApplicant}
        onAssignSuccess={applicantsPage.handleAssignSuccess}
      />
    </div>
  );
};

export default ManagerApplicantsPage;
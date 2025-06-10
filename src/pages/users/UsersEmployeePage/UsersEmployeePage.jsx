import React from "react";
import { useParams } from "react-router-dom";

//custom hooks
import useUserProfilePage from '../../../hooks/profile/useUserProfilePage';

//components
import { Tabs } from "../../../components/Tabs";
import Button from "../../../components/shared/Button";
import CustomScrollbar from "../../../components/CustomScrollbar";
import {
  ProfileExperience,
  ProfileContactInfo,
  ProfileObjectives,
  ProfileSkills,
  ProfileCertificates,
  ProfileHeaderCard
} from "../../../components/Profile";

//modals (read-only)
import { CertificateModal } from "../../../components/Modals/CertificateModal";
import { CVModal } from "../../../components/Modals/CVModal";

import LoadingSpinner from "src/components/LoadingSpinner";

//css
import styles from "src/styles/Pages/Employee/EmpleadoPerfilPage.module.css";

/**
 * read-only profile page for viewing other employees
 */
export const UsersEmployeePage = () => {
  const { userId } = useParams();
  const profilePage = useUserProfilePage(userId);

  //loading state
  if (profilePage.isLoading) {
    return (
      <LoadingSpinner 
        overlay={true}
        size="large"
        message="Loading employee profile..."
        variant="default"
      />
    );
  }

  const renderTabContent = () => {
    switch (profilePage.activeTab) {
      case "Experience":
        return <ProfileExperience experienceItems={profilePage.userExperience} />;
      case "Contact Information":
        return <ProfileContactInfo userProfile={profilePage.userProfile} />;
      case "Objectives":
        return (
          <ProfileObjectives
            objectives={profilePage.objectives}
            isLoading={profilePage.isLoading}
            readOnly={true}
          />
        );
      default:
        return <ProfileContactInfo userProfile={profilePage.userProfile} />;
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileContent}>
        {/* left column - profile info and tabs */}
        <div className={styles.profileColumnLeft}>
          <ProfileHeaderCard user={profilePage.userProfile} url={profilePage.pic} />

          <Tabs
            tabs={profilePage.tabNames.map(tab => ({
              name: tab
            }))}
            activeTab={profilePage.activeTab}
            onTabClick={profilePage.setActiveTab}
            borderStyle='tab-only'
            actionButtons={
              <Button
                type="secondary"
                icon="bi-file-earmark-text"
                onClick={profilePage.handleCVClick}
                title="View CV"
              >
                CV
              </Button>
            }
          />

          <div className={styles.tabContentContainer}>
            <CustomScrollbar fadeBackground="transparent" fadeHeight={40}>
              {renderTabContent()}
            </CustomScrollbar>
          </div>
        </div>

        {/* right column - sidebar */}
        <div className={styles.profileSidebar}>
          <ProfileSkills
            className={styles.sidebarSection}
            categorizedSkills={profilePage.categorizedSkills}
            readOnly={true}
          />

          <ProfileCertificates
            className={styles.sidebarSection}
            certificates={profilePage.userCertificates}
            onCertificateClick={profilePage.handleCertificateClick}
            readOnly={true}
          />
        </div>
      </div>

      {/* modals (read-only) */}
      <CertificateModal
        certificate={profilePage.selectedCertificate}
        isOpen={profilePage.modals.certificate}
        onClose={profilePage.closeCertificateModal}
        onAnimationComplete={() => {}}
      />

      <CVModal
        isOpen={profilePage.modals.cv}
        onClose={profilePage.closeCVModal}
        readOnly={true}
        userId={userId}
      />
    </div>
  );
};

export default UsersEmployeePage;

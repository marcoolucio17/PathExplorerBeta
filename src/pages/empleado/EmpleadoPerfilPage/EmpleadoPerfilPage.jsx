import React, { useEffect, useState } from "react";

// Custom Hooks
import useProfilePage from '../../../hooks/profile/useProfilePage';

// Components
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
import Alert from "react-bootstrap/Alert";
// Modals
import { CertificateModal } from "../../../components/Modals/CertificateModal";
import { CVModal } from "../../../components/Modals/CVModal";
import { SkillsModal } from "../../../components/Modals/SkillsModal";
import { AddCertificateModal } from "../../../components/Modals/AddCertificateModal";
import { EditProfileModal } from "../../../components/Modals/EditProfileModal";
import { EditContactModal } from "../../../components/Modals/EditContactModal";
import { EditExperienceModal } from "../../../components/Modals/EditExperienceModal";
import { EditObjectivesModal } from "../../../components/Modals/EditObjectivesModal";
import { EditProfileDetailsModal } from "../../../components/Modals/EditProfileDetailsModal";

import LoadingSpinner from "src/components/LoadingSpinner";

// CSS
import styles from "src/styles/Pages/Employee/EmpleadoPerfilPage.module.css";

/**
 * Profile page component for Employee role
 */
export const EmpleadoPerfilPage = () => {
  // this is for triggering reloads from modals
  const [load, setLoad] = useState(false);

  const [loadingError, setLoadingError] = useState(true);
  const [dataError, setDataError] = useState("Error fetching your data. Please try again later.");
  // Use the custom hook to handle all logic
  const profilePage = useProfilePage(load, setLoad);

  const skills = [...profilePage.categorizedSkills["softSkills"], ...profilePage.categorizedSkills["hardSkills"]];
  
  //loading state
  if (profilePage.isLoading) {

    return (
      <LoadingSpinner 
        overlay={true}
        size="large"
        message="Loading profile details..."
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
        return <ProfileObjectives
          objectives={profilePage.objectives}
          onObjectiveToggle={profilePage.handleObjectiveToggle}
          isLoading={profilePage.isLoading}
        />;
      default:
        return <ProfileContactInfo userProfile={profilePage.userProfile} />;
    }
  };

  //loading state
  if (profilePage.loading || profilePage.isLoading) {
    return (
      <LoadingSpinner 
        overlay={true}
        size="large"
        message="Loading project details..."
        variant="default"
      />
    );
  }

  const handleEditSection = (section) => {
    // Handle editing specific sections
    console.log('Edit section:', section);
    console.log('Current modals state:', profilePage.modals);
    switch (section) {
      case 'contact':
        console.log('Opening contact modal');
        profilePage.openModal('editContact');
        break;
      case 'experience':
        console.log('Opening experience modal');
        profilePage.openModal('editExperience');
        break;
      case 'objectives':
        console.log('Opening objectives modal');
        profilePage.openModal('editObjectives');
        break;
      case 'profile':
        console.log('Opening profile details modal');
        profilePage.openModal('editProfileDetails');
        break;
      default:
        break;
    }
  };

  // Save handlers for edit modals
  const handleSaveContact = (contactData) => {
    profilePage.setUserProfile(prev => ({
      ...prev,
      ...contactData
    }));
  };

  const handleSaveExperience = (experienceData) => {
    profilePage.setUserExperience(experienceData);
  };

  const handleSaveObjectives = (objectivesData) => {
    profilePage.setObjectives(objectivesData);
  };

  const handleSaveProfileDetails = (profileData) => {
    profilePage.setUserProfile(prev => ({
      ...prev,
      ...profileData
    }));
  };

  // Certificate removal handler
  const handleRemoveCertificate = (certificateId) => {
    profilePage.handleRemoveCertificate(certificateId);
  };

  return (
    <>

    <div className={styles.profileContainer}>

      <div className={styles.profileContent}>
        {/* Left Column - Profile info and tabs */}
        <div className={styles.profileColumnLeft}>
          <ProfileHeaderCard user={profilePage.userProfile} url = {profilePage.pic} />

          <Tabs
            tabs={profilePage.tabNames.map(tab => ({
              name: tab
            }))}
            activeTab={profilePage.activeTab}
            onTabClick={profilePage.setActiveTab}
            borderStyle='tab-only'
            actionButtons={
              <>
                <Button
                  type="secondary"
                  icon="bi-file-earmark-text"
                  onClick={profilePage.handleCVClick}
                  title="View CV"
                >
                  CV
                </Button>
                <Button
                  type="primary"
                  icon="bi-pencil-fill"
                  onClick={profilePage.handleEditClick}
                  title="Edit Profile"
                >
                  Edit
                </Button>
              </>
            }
          />

          <div className={styles.tabContentContainer}>
            <CustomScrollbar fadeBackground="transparent" fadeHeight={40}>
              {renderTabContent()}
            </CustomScrollbar>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className={styles.profileSidebar}>
          <ProfileSkills
            className={styles.sidebarSection}
            categorizedSkills={profilePage.categorizedSkills}
            onSkillsClick={profilePage.handleSkillsClick}
            setIsLoading = {setLoad}
          />

          <ProfileCertificates
            className={styles.sidebarSection}
            certificates={profilePage.userCertificates}
            onCertificateClick={profilePage.handleCertificateClick}
            onAddCertificateClick={profilePage.handleAddCertificateClick}
            onRemoveCertificate={handleRemoveCertificate}
          />
        </div>
      </div>

      {/* Modals */}
      <CertificateModal
        certificate={profilePage.selectedCertificate}
        isOpen={profilePage.modals.certificate}
        onClose={profilePage.closeCertificateModal}
        onAnimationComplete={() => profilePage.setSelectedCertificate(null)}
      />

      <CVModal
        isOpen={profilePage.modals.cv}
        onClose={() => profilePage.closeModal('cv')}
      />

      <SkillsModal
        isOpen={profilePage.modals.skills}
        onClose={() => profilePage.closeModal('skills')}
        userSkills={profilePage.userSkills}
        onUpdateSkills={profilePage.handleUpdateSkills}
        disabledSkills={skills}
        setLoad={setLoad}
      />

      <AddCertificateModal
        isOpen={profilePage.modals.addCertificate}
        onClose={() => profilePage.closeModal('addCertificate')}
        onAddCertificate={profilePage.handleAddCertificate}
        setLoad={setLoad}
      />

      <EditProfileModal
        isOpen={profilePage.modals.editProfile}
        onClose={() => profilePage.closeModal('editProfile')}
        onEditSection={handleEditSection}
      />

      <EditContactModal
        isOpen={profilePage.modals.editContact}
        onClose={() => profilePage.closeModal('editContact')}
        contactInfo={profilePage.userProfile}
        onSave={handleSaveContact}
        setLoad={setLoad}
      />

      <EditExperienceModal
        isOpen={profilePage.modals.editExperience}
        onClose={() => profilePage.closeModal('editExperience')}
        experiences={profilePage.userExperience}
        onSave={handleSaveExperience}
      />

      <EditObjectivesModal
        isOpen={profilePage.modals.editObjectives}
        onClose={() => profilePage.closeModal('editObjectives')}
        objectives={profilePage.objectives}
        onSave={handleSaveObjectives}
        setLoad={setLoad}
      />

      <EditProfileDetailsModal
        isOpen={profilePage.modals.editProfileDetails}
        onClose={() => profilePage.closeModal('editProfileDetails')}
        profileData={profilePage.userProfile}
        onSave={handleSaveProfileDetails}
        setLoad={setLoad}
        />

      </div>
      {profilePage.error && profilePage.error.split('\n').map((line, index) => (<div className="login-error-container" style={{ width: "65%", marginLeft: "17.5%", marginRight: "17.5%" }}>
        <Alert key={index} className="login-error-alert" variant="danger">
          {line}
        </Alert>
      </div >))}
    </>
  );
};

export default EmpleadoPerfilPage;
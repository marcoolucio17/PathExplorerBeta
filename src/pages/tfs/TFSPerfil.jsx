import React, {useState} from 'react'

// Custom Hooks
import useProfilePage from 'src/hooks/profile/useProfilePage';

// Components
import { Tabs } from "src/components/Tabs";
import Button from "src/components/shared/Button";
import CustomScrollbar from "src/components/CustomScrollbar";
import {
  ProfileExperience,
  ProfileContactInfo,
  ProfileObjectives,
  ProfileSkills,
  ProfileCertificates,
  ProfileHeaderCard
} from "src/components/Profile";

// Modals
import { CertificateModal } from "src/components/Modals/CertificateModal";
import { CVModal } from "src/components/Modals/CVModal";
import { SkillsModal } from "src/components/Modals/SkillsModal";
import { AddCertificateModal } from "src/components/Modals/AddCertificateModal";
import { EditProfileModal } from "src/components/Modals/EditProfileModal";
import { EditContactModal } from "src/components/Modals/EditContactModal";
import { EditExperienceModal } from "src/components/Modals/EditExperienceModal";
import { EditObjectivesModal } from "src/components/Modals/EditObjectivesModal";
import { EditProfileDetailsModal } from "src/components/Modals/EditProfileDetailsModal";

import LoadingSpinner from "src/components/LoadingSpinner";

// CSS
import styles from "src/styles/Pages/Employee/EmpleadoPerfilPage.module.css";


export const TFSPerfil = () => {
  // this is for triggering reloads from modals
  const [load, setLoad] = useState(false);

  // Use the custom hook to handle all logic
  const profilePage = useProfilePage(load);

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
  );
}

export default TFSPerfil;
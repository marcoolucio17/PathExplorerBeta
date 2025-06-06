import React from 'react';

// Custom Hooks
import useManagerProjectPage from '../../../hooks/proyecto/useManagerProjectPage.js';

//components
import { GlassCard } from '../../../components/shared/GlassCard';
import { ProgressBar } from '../../../components/ProgressBar';
import Button from '../../../components/shared/Button';
import CustomScrollbar from '../../../components/CustomScrollbar';
import LoadingSpinner from '../../../components/LoadingSpinner';

//modals
import { FeedbackModal } from "../../../components/Modals/FeedbackModal";
import { EditProjectModal } from "../../../components/Modals/EditProjectModal";

//css
import styles from "../../../styles/Pages/Proyecto/ManagerProjectPage.module.css";
import peopleStyles from "../../../styles/Pages/Proyecto/PeopleSection.module.css";

/**
 * project management page for manager role
 * allows viewing project details and assigning feedback to team members
 */
export const ManagerProjectPage = () => {
  console.log("ManagerProjectPage component loaded");
  
  const projectPage = useManagerProjectPage();
  const { projectData, projectUsers, isLoading, error } = projectPage;

  console.log("ManagerProjectPage state:", { projectData, projectUsers, isLoading, error });
  
  //debug project data from completo endpoint
  if (projectData) console.log("NEW PROJECT DATA FROM /COMPLETO:", projectData);

  //loading state
  if (isLoading) {
    return (
      <LoadingSpinner 
        overlay={true}
        size="large"
        message="Loading project details..."
        variant="default"
      />
    );
  }

  //error state  
  if (error) {
    return (
      <div className={styles.projectContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '50vh', justifyContent: 'center' }}>
          <h2>Error loading project</h2>
          <p>There was an error loading the project details. Please try again later.</p>
          <p>Error: {error.message}</p>
        </div>
      </div>
    );
  }

  //if project data is not found
  if (!projectData) {
    return (
      <div className={styles.projectContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '50vh', justifyContent: 'center' }}>
          <h2>Project not found</h2>
          <p>The requested project could not be found.</p>
          <p>Check browser console for API debugging info.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectContainer}>
      <div className={styles.projectContent}>
        {/* Left Column - Project Details */}
        <div className={styles.projectDetails}>
          <div className={styles.pageHeader}>
            <div className={styles.titleContainer}>
              <h1 className={styles.pageTitle}>
                {projectData.pnombre || 'Project Management'}
              </h1>
              <p className={styles.pageSubtitle}>
                Manage team members and assign feedback
              </p>
            </div>
          </div>
          
          <div className={styles.projectDates}>
            <span>Start: {projectData.fechainicio || 'N/A'}</span>
            <span>End: {projectData.fechafin || 'N/A'}</span>
            <span>Progress: {projectData.progreso || 0}%</span>
          </div>
          
          <div className={styles.projectProgress}>
            <ProgressBar percentage={projectData.progreso || 0} />
          </div>

          {/* Description Section */}
          <div className={styles.projectDescription}>
            <CustomScrollbar fadeBackground="transparent" fadeHeight={40} showHorizontalScroll={false}>
              <div className={styles.projectDescriptionContent}>
                {/* Project Description */}
                <div className={styles.descriptionSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.iconContainer}>
                      <i className="bi bi-file-text"></i>
                    </div>
                    <h2 className={styles.sectionTitle}>Project Description</h2>
                  </div>
                  <p className={styles.sectionText}>
                    {projectData.descripcion || 'No description available for this project.'}
                  </p>
                </div>

                {/* Project Deliverables */}
                {projectData.deliverables && projectData.deliverables.length > 0 && (
                  <div className={styles.descriptionSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.iconContainer}>
                        <i className="bi bi-box-seam"></i>
                      </div>
                      <h2 className={styles.sectionTitle}>Project Deliverables</h2>
                    </div>
                    <ul className={styles.sectionText}>
                      {projectData.deliverables.map((deliverable, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          <i className="bi bi-check-lg" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i>
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Client Information */}
                {projectData.cliente && (
                  <div className={styles.descriptionSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.iconContainer}>
                        <i className="bi bi-building"></i>
                      </div>
                      <h2 className={styles.sectionTitle}>Client</h2>
                    </div>
                    <div className={styles.sectionText} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {projectData.cliente.logo && (
                        <img 
                          src={projectData.cliente.logo} 
                          alt={projectData.cliente.nombre}
                          style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px' }}
                        />
                      )}
                      <span>{projectData.cliente.nombre}</span>
                    </div>
                  </div>
                )}

                {/* Project Status */}
                <div className={styles.descriptionSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.iconContainer}>
                      <i className="bi bi-info-circle"></i>
                    </div>
                    <h2 className={styles.sectionTitle}>Project Status</h2>
                  </div>
                  <p className={styles.sectionText}>
                    This project currently has {projectUsers?.length || 0} team members assigned.
                    Use the team section to review member performance and assign feedback.
                  </p>
                </div>
              </div>
            </CustomScrollbar>
          </div>

          {/* Action buttons */}
          <div className={styles.projectActions}>
            <Button 
              type="secondary"
              icon="bi-arrow-left"
              onClick={projectPage.handleBackToDashboard}
            >
              Back to Dashboard
            </Button>
            
            <Button 
              type="primary"
              icon="bi-people"
              onClick={projectPage.handleRefreshData}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh Team Data"}
            </Button>
          </div>
        </div>

        {/* Right Column - Team Members and Roles */}
        <div className={styles.projectSidebar}>
          {/* Team Members Section */}
          <GlassCard className={styles.sidebarSection}>
            <div className={peopleStyles.peopleSection}>
              <h2 className={peopleStyles.peopleTitle}>Team Members</h2>
              <div className={peopleStyles.peopleContent}>
                <CustomScrollbar fadeBackground="transparent" fadeHeight={30} showHorizontalScroll={false}>
                  {projectUsers && projectUsers.length > 0 ? (
                    projectUsers.map((userProject, index) => (
                      <div key={`${userProject.usuario.idusuario}-${userProject.idutp}-${index}`} className={peopleStyles.person}>
                        <div className={peopleStyles.personAvatar}>
                          {userProject.usuario.fotodeperfil_url ? (
                            <img 
                              src={userProject.usuario.fotodeperfil_url} 
                              alt={userProject.usuario.nombre} 
                              className={peopleStyles.personAvatarImg}
                            />
                          ) : (
                            <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
                          )}
                        </div>
                        <div className={peopleStyles.personInfo}>
                          <div className={peopleStyles.personName}>{userProject.usuario.nombre}</div>
                          <div className={peopleStyles.personRole}>{userProject.aplicacion.roles.nombrerol || 'Role'}</div>
                          <div className={peopleStyles.personEmail}>{userProject.usuario.correoelectronico}</div>
                        </div>
                        <div className={peopleStyles.personActions}>
                          <Button
                            type="primary"
                            size="small"
                            icon="bi-chat-dots"
                            onClick={() => projectPage.handleAssignFeedback(userProject.usuario)}
                          >
                            Feedback
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={peopleStyles.emptyState}>
                      <i className="bi bi-people" style={{ fontSize: '2rem', color: '#6c757d', marginBottom: '1rem' }}></i>
                      <p>No team members assigned to this project yet.</p>
                    </div>
                  )}
                </CustomScrollbar>
              </div>
            </div>
          </GlassCard>

          {/* Available Roles Section */}
          <GlassCard className={styles.sidebarSection}>
            <div className={peopleStyles.peopleSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className={peopleStyles.peopleTitle}>Available Roles</h2>
                <Button
                  type="primary"
                  size="small"
                  icon="bi-pencil"
                  onClick={() => projectPage.openModal('editProject')}
                >
                  Edit Project
                </Button>
              </div>
              <div className={peopleStyles.peopleContent}>
                <CustomScrollbar fadeBackground="transparent" fadeHeight={30} showHorizontalScroll={false}>
                  {projectData && projectData.roles && projectData.roles.length > 0 ? (
                    projectData.roles.map((proyectoRole, index) => (
                      <div key={`${proyectoRole.idrol}-${index}`} className={peopleStyles.person}>
                        <div className={peopleStyles.personAvatar}>
                          <i className="bi bi-person-workspace" style={{ fontSize: '1.5rem', color: '#6c757d' }}></i>
                        </div>
                        <div className={peopleStyles.personInfo}>
                          <div className={peopleStyles.personName}>
                            {proyectoRole.roles?.nombrerol || `Role ${proyectoRole.idrol}`}
                          </div>
                          <div className={peopleStyles.personRole}>
                            Level {proyectoRole.roles?.nivelrol || 'N/A'}
                          </div>
                          <div className={peopleStyles.personEmail} style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                            Status: {proyectoRole.estado || 'Unknown'}
                          </div>
                        </div>
                        <div className={peopleStyles.personActions}>
                          <Button
                            type="danger"
                            size="small"
                            icon="bi-x"
                            onClick={() => projectPage.handleDeleteRole(proyectoRole.idrol)}
                            style={{ 
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              minWidth: 'auto'
                            }}
                          >
                            
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={peopleStyles.emptyState}>
                      <i className="bi bi-person-workspace" style={{ fontSize: '2rem', color: '#6c757d', marginBottom: '1rem' }}></i>
                      <p>No roles defined for this project yet.</p>
                    </div>
                  )}
                </CustomScrollbar>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={projectPage.modals.feedback}
        onClose={() => projectPage.closeModal('feedback')}
        selectedUser={projectPage.selectedUser}
        projectData={projectData}
        onSubmitFeedback={projectPage.handleSubmitFeedback}
        isLoading={projectPage.feedbackLoading}
      />

      {/* Edit Project Modal */}
      {projectData && (
        <EditProjectModal
          isOpen={projectPage.modals.editProject}
          onClose={() => projectPage.closeModal('editProject')}
          projectData={projectData}
          onUpdateProject={projectPage.handleUpdateProject}
        />
      )}
    </div>
  );
};

export default ManagerProjectPage;

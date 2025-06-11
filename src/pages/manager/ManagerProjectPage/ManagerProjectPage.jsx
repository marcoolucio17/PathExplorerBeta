import React from 'react';
import { useNavigate } from 'react-router-dom';

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

export const ManagerProjectPage = () => {
  const navigate = useNavigate();
  
  //handle back navigation based on user role in localStorage
  const handleBackToDashboard = () => {
    const userRole = localStorage.getItem('role');
    
    switch(userRole) {
      case 'empleado':
        navigate('/empleado/dashboard');
        break;
      case 'manager':
        navigate('/manager/dashboard');
        break;
      case 'admin':
        navigate('/TFS/dashboard');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };
  
  const projectPage = useManagerProjectPage();
  const { projectData, projectUsers, isLoading, error } = projectPage;

  console.log("ManagerProjectPage state:", { projectData, projectUsers, isLoading, error });
  
  if (projectData) console.log("NEW PROJECT DATA FROM /COMPLETO:", projectData);

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
        <div className={styles.projectDetails}>
          <div className={styles.pageHeader}>
            <Button 
              type="secondary"
              variant="back"
              icon="bi bi-arrow-left"
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </Button>
            <h1 className={styles.pageTitle}>
              {projectData.pnombre || 'Project Management'}
            </h1>
          </div>
          
          <div className={styles.projectDates}>
            <span>Start Date: {projectData.fechainicio || 'N/A'}</span>
            <span>Est. Finish Date: {projectData.fechafin || 'N/A'}</span>
          </div>
          
          <div className={styles.projectProgress}>
            <ProgressBar percentage={projectData.progreso || 0} />
          </div>

          <div className={styles.projectDescription}>
            <CustomScrollbar fadeBackground="transparent" fadeHeight={40} showHorizontalScroll={false}>
              <div className={styles.projectDescriptionContent}>
                <div className={styles.descriptionSection}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.iconContainer}>
                      <i className="bi bi-bullseye"></i>
                    </div>
                    <h2 className={styles.sectionTitle}>Project Goal</h2>
                  </div>
                  <p className={styles.sectionText}>
                    {projectData.descripcion || 'No description available for this project.'}
                  </p>
                </div>

                {projectData.deliverables && projectData.deliverables.length > 0 && (
                  <div className={styles.descriptionSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.iconContainer}>
                        <i className="bi bi-box-seam"></i>
                      </div>
                      <h2 className={styles.sectionTitle}>Deliverables</h2>
                    </div>
                    <ul className={styles.deliverablesList}>
                      {projectData.deliverables.map((deliverable, index) => (
                        <li key={index}>
                          <i className={`bi bi-check-lg ${styles.checkmarkIcon}`}></i>
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
              </div>
            </CustomScrollbar>
          </div>

          <div className={styles.projectActions}>
            <Button 
              type="secondary"
              onClick={projectPage.handleRefreshData}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </Button>
            
            <Button 
              type="primary"
              icon="bi-pencil"
              onClick={() => projectPage.openModal('editProject')}
            >
              Edit Project
            </Button>
          </div>
        </div>

        <div className={styles.projectSidebar}>
          <GlassCard className={styles.sidebarSection}>
            <div className={peopleStyles.peopleSection}>
              <h2 className={peopleStyles.peopleTitle}>Team Members</h2>
              <div className={peopleStyles.peopleContent}>
                <CustomScrollbar fadeBackground="transparent" fadeHeight={30} showHorizontalScroll={false}>
                  {projectUsers && projectUsers.length > 0 ? (
                    projectUsers.map((userProject, index) => (
                      <div key={`${userProject.usuario.idusuario}-${userProject.idutp}-${index}`} className={peopleStyles.person}>
                        {userProject.usuario.fotodeperfil_url ? (
                          <div className={peopleStyles.personAvatar}>
                            <img 
                              src={userProject.usuario.fotodeperfil_url} 
                              alt={userProject.usuario.nombre} 
                              className={peopleStyles.personAvatarImg}
                            />
                          </div>
                        ) : (
                          <div className={peopleStyles.personAvatarPlaceholder}>
                            <i className="bi bi-person-fill"></i>
                          </div>
                        )}
                        <div className={peopleStyles.personInfo}>
                          <div className={peopleStyles.personName}>{userProject.usuario.nombre}</div>
                          <div className={peopleStyles.personRole}>{userProject.aplicacion.roles.nombrerol || 'Role'}</div>
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
                      <p>This project has no members yet.</p>
                    </div>
                  )}
                </CustomScrollbar>
              </div>
            </div>
          </GlassCard>

          <GlassCard className={styles.sidebarSection}>
            <div className={peopleStyles.peopleSection}>
              <h2 className={peopleStyles.peopleTitle}>Available Roles</h2>
              <div className={peopleStyles.peopleContent}>
                <CustomScrollbar fadeBackground="transparent" fadeHeight={30} showHorizontalScroll={false}>
                  {projectData && projectData.roles && projectData.roles.filter(proyectoRole => proyectoRole.estado !== "Aceptado").length > 0 ? (
                    projectData.roles
                      .filter(proyectoRole => proyectoRole.estado !== "Aceptado")
                      .map((proyectoRole, index) => (
                      <div key={`${proyectoRole.idrol}-${index}`} className={peopleStyles.person}>
                        <div className={peopleStyles.personAvatar}>
                          <i className="bi bi-person-workspace" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                        </div>
                        <div className={peopleStyles.personInfo}>
                          <div className={peopleStyles.personName}>
                            {proyectoRole.roles?.nombrerol || `Role ${proyectoRole.idrol}`}
                          </div>
                          <div className={peopleStyles.personRole}>
                            Level {proyectoRole.roles?.nivelrol || 'N/A'}
                          </div>
                        </div>
                        <div className={peopleStyles.personActions}>
                          <Button
                            type="secondary"
                            size="small"
                            icon="bi-x"
                            onClick={() => projectPage.handleDeleteRole(proyectoRole.idrol)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={peopleStyles.emptyState}>
                      <i className="bi bi-person-workspace" style={{ fontSize: '2rem', color: '#6c757d', marginBottom: '1rem' }}></i>
                      <p>No available roles at the moment. All roles may be filled or none have been defined yet.</p>
                    </div>
                  )}
                </CustomScrollbar>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <FeedbackModal
        isOpen={projectPage.modals.feedback}
        onClose={() => projectPage.closeModal('feedback')}
        selectedUser={projectPage.selectedUser}
        projectData={projectData}
        onSubmitFeedback={projectPage.handleSubmitFeedback}
        isLoading={projectPage.feedbackLoading}
      />

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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from 'src/components/shared/GlassCard';
import GlassCardNavigation from 'src/components/shared/GlassCard/GlassCardNavigation'; // el import es un poquito diferente
import { ProgressCircle } from 'src/components/ProgressCircle';
import SkillChip from 'src/components/SkillChip/SkillChip';
import styles from 'src/styles/GridList/GridListCard.module.css';
import customStyles from 'src/styles/GridList/ProjectCard.module.css';

import Button from 'src/components/shared/Button';
const ProjectCard = ({
  id,
  idrol,
  project,
  proyecto_rol,
  viewMode,
  compatibilityValue,
  showCompatibility,
  onClick,
  selectedSkillFilters = [],
  userSkills = [],
  isProjectCard = false, //new prop to indicate project-level card
  isApplyCard = false, //new prop to indicate applied to card
  onViewApplication,
}) => {

  const navigate = useNavigate();

  //custom navigation for project cards
  const handleProjectCardClick = (e) => {
    if (isProjectCard) {
      e.preventDefault();
      e.stopPropagation();
      console.log("navigating to:", `/manager/project/${id}`);
      navigate(`/manager/project/${id}`);
    }
  };

  //stable duration calculation based on project id to prevent fluctuation
  const ensureRoleData = () => {
    if (isProjectCard && !isApplyCard) {
      //debug data structure for project cards
      console.log("Project Card - Full project data:", project);
      console.log("Project Card - Available keys:", Object.keys(project));
      
      //comprehensive mapping for client logo for project cards
      const clientLogo = project.cliente?.fotodecliente_url || 
                        project.client?.fotodecliente_url ||
                        project.fotodecliente_url ||
                        project.clientLogo ||
                        project.cliente?.logo ||
                        project.client?.logo ||
                        project.logo ||
                        "/images/ImagenProyectoDefault.png";
      
      console.log("Project Card - Client logo check:", {
        "project.cliente?.fotodecliente_url": project.cliente?.fotodecliente_url,
        "project.client?.fotodecliente_url": project.client?.fotodecliente_url,
        "project.fotodecliente_url": project.fotodecliente_url,
        "project.clientLogo": project.clientLogo,
        "final clientLogo": clientLogo
      });
      
      //for project cards, show project name as title
      return {
        roleName: project.pnombre || 'Project',
        projectName: '', //no subtitle for project cards
        duration: project.duracionMes ? project.duracionMes : project.duracionMes === 0 ? "< 1" : "TBD",
        roleCount: project.proyecto_roles ? project.proyecto_roles.length : 0,
        clientLogo: clientLogo
      };
    } else if (isApplyCard && !isProjectCard) {
      //debug data structure for applied to cards
      console.log("Applied To Card - Full project data:", project);
      console.log("Applied To Card - Available keys:", Object.keys(project));
      
      //comprehensive mapping for role name
      const roleName = project.roles?.nombrerol || 
                      project.rol?.nombrerol || 
                      project.role?.nombrerol ||
                      project.nombrerol || 
                      project.roleName ||
                      'Unknown Role';
      
      //comprehensive mapping for project name - try all possible paths
      const projectName = project.proyecto?.pnombre || 
                         project.proyectos?.pnombre || 
                         project.project?.pnombre ||
                         project.project?.name ||
                         project.pnombre || 
                         project.projectName ||
                         project.name ||
                         project.proyecto?.nombre ||
                         project.proyectos?.nombre ||
                         project.nombre ||
                         'Unknown Project';
      
      //comprehensive mapping for client logo
      const clientLogo = project.proyecto?.cliente?.fotodecliente_url || 
                        project.proyectos?.cliente?.fotodecliente_url ||
                        project.project?.cliente?.fotodecliente_url ||
                        project.cliente?.fotodecliente_url ||
                        project.proyecto?.fotodecliente_url ||
                        project.proyectos?.fotodecliente_url ||
                        project.project?.fotodecliente_url ||
                        project.fotodecliente_url ||
                        project.clientLogo ||
                        "/images/ImagenProyectoDefault.png";
      
      //comprehensive mapping for description
      const description = project.proyecto?.descripcion || 
                         project.proyectos?.descripcion || 
                         project.project?.descripcion ||
                         project.descripcion || 
                         project.description ||
                         project.proyecto?.description ||
                         project.proyectos?.description ||
                         'No description available';
      
      //comprehensive mapping for duration
      const duration = project.proyecto?.duracionMes || 
                      project.proyectos?.duracionMes || 
                      project.project?.duracionMes ||
                      project.duracionMes || 
                      project.duration ||
                      project.proyecto?.duration ||
                      project.proyectos?.duration ||
                      "TBD";
      
      //convert spanish status to english
      const convertStatusToEnglish = (status) => {
        const statusMap = {
          'Pendiente': 'Pending',
          'RolAsignado': 'Assigned',
          'Rechazado': 'Rejected',
          'Aprobado': 'Approved',
          'En Revision': 'Under Review',
          'Cancelado': 'Cancelled'
        };
        return statusMap[status] || status;
      };
      
      console.log("Applied To Card - Extracted data:", {
        roleName,
        projectName, 
        clientLogo,
        description,
        duration,
        status: project.estatus,
        statusEnglish: convertStatusToEnglish(project.estatus),
        date: project.fechaaplicacion
      });
      
      console.log("Applied To Card - Project name check:", {
        "project.proyecto?.pnombre": project.proyecto?.pnombre,
        "project.proyectos?.pnombre": project.proyectos?.pnombre,
        "project.pnombre": project.pnombre,
        "project.name": project.name,
        "final projectName": projectName
      });
      
      return {
        roleName,
        projectName,
        status: convertStatusToEnglish(project.estatus) || 'Unknown Status',
        date: project.fechaaplicacion || 'Unknown Date',
        description,
        duration: duration ? (duration === 0 ? "< 1" : duration) : "TBD",
        clientLogo
      }
    }

    //regular role cards for All tab
    const clientLogo = project.cliente?.fotodecliente_url || 
                      project.client?.fotodecliente_url ||
                      project.fotodecliente_url || 
                      project.clientLogo ||
                      project.cliente?.logo ||
                      project.client?.logo ||
                      project.logo ||
                      "/images/ImagenProyectoDefault.png";
    
    return {
      roleName: project.nombrerol || 'Developer',
      projectName: project.pnombre || 'Project',
      duration: project.duracionMes ? project.duracionMes : project.duracionMes === 0 ? "< 1" : "TBD",
      description: project.descripcion || 'No description available',
      clientLogo: clientLogo
    };
  };

  const ensureSkillsData = () => {
    //for project cards, don't show skills
    if (isProjectCard || isApplyCard) {
      return [];
    }


    if (!project.requerimientos_roles || project.requerimientos_roles.length === 0) {
      return [];
    }

    const skills = project.requerimientos_roles.map(req_roles => {
      const habilidad = req_roles.requerimientos?.habilidades;
      if (!habilidad) {
        return null;
      }
      const skillName = habilidad.nombre || 'Unknown Skill';
      const isUserSkill = userSkills.includes(skillName) || selectedSkillFilters.includes(skillName);
      return {
        id: habilidad.idhabilidad,
        name: skillName,
        isUser: isUserSkill
      };
    });

    return skills;
  };
  const roleData = ensureRoleData();
  const skillsData = ensureSkillsData();

  //check if this is an assigned role card
  const isAssignedRole = isApplyCard && roleData.status === "Assigned";

  //determine card styling based on assignment status
  const getCardClass = () => {
    let baseClass = viewMode === 'grid'
      ? styles.cardGrid
      : `${styles.cardList} ${customStyles.cardList}`;
    
    if (isAssignedRole) {
      baseClass += ` ${styles.assignedCard}`;
    }
    
    return baseClass;
  };

  //get card props for data attributes
  const getCardProps = () => {
    const props = {};
    if (viewMode === 'list' && isApplyCard) {
      props['data-card-type'] = 'apply';
    }
    return props;
  };

  const renderSkills = () => {
    //don't render skills for project cards
    if (isProjectCard || isApplyCard || skillsData.length === 0) {
      return null;
    }
    
    const showMoreButton = skillsData.length > 2;
    const visibleSkills = skillsData.slice(0, showMoreButton ? 2 : Math.min(3, skillsData.length));

    return (
      <>
        {visibleSkills.map((skill) => (
          <SkillChip
            key={`skill-${skill.id}`}
            text={skill.name}
            isUserSkill={skill.isUser}
            iconClass={skill.isUser ? "bi bi-check" : null}
          />
        ))}

        {showMoreButton && (
          <SkillChip
            key="more-skills"
            text={`+${skillsData.length - 2}`}
            isExpandTag={true}
          />
        )}
      </>
    );
  };

  const gridContent = (
    <>
      
      
      <div className={styles.cardHeader}>
        <img
          className={styles.cardAvatar}
          src={roleData.clientLogo || "/images/ImagenProyectoDefault.png"}
          alt={`${roleData.projectName || 'Project'} logo`}
        />
        {!isApplyCard && (<>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardTitle}>{roleData.roleName}</h3>
          {roleData.projectName && <p className={styles.cardSubtitle}>for {roleData.projectName}</p>}
          {isProjectCard && roleData.roleCount > 0 && (
            <p className={styles.cardSubtitle}>{roleData.roleCount} roles available</p>
          )}
          </div></>)}
        {isApplyCard && (
          <div className={styles.cardInfo}>
            <h3 className={styles.cardTitle}>{roleData.roleName}</h3>
            {isAssignedRole && (
              <p className={styles.congratsMessage}>Congratulations! You've been assigned to this role!</p>
            )}
          </div>
        )}
      </div>

      {!isApplyCard && <div className={`${styles.cardDescription} ${styles.reducedMargin}`}>
        <p className={styles.descriptionText}>
          {roleData.description || 'This project aims to develop a comprehensive solution that meets client requirements while leveraging modern technologies...'}
        </p>
      </div>}

      <div className={styles.cardDetails}>
        {!isApplyCard && <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <i className="bi bi-clock"></i> Duration:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {(roleData.duration !== "< 1") && <span className={styles.detailValue}>
              {roleData.duration} months
            </span>}
            {(roleData.duration === "< 1") && <span className={styles.detailValue}>
              {roleData.duration} month
            </span>}
            
            {showCompatibility && !isProjectCard && !isApplyCard && (
              <ProgressCircle
                value={compatibilityValue}
                size={40}
                fontSize="0.7rem"
                strokeWidth={5}
                fontWeight="light"
              />
            )}
          </div>
        </div>}

        {isApplyCard && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>
              <i className="bi bi-folder"></i> Applied for:
            </span>
            <span className={styles.detailValue}>{roleData.projectName}</span>
          </div>
        )}

        {isApplyCard && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>
              <i className="bi bi-clock"></i> Status:
            </span>
            <span className={`${styles.detailValue} ${isAssignedRole ? styles.assignedStatus : ''}`}>
              {isAssignedRole ? "Assigned" : roleData.status}
            </span>
          </div>)
        }
      </div>

      {isApplyCard && (
        <div className={styles.cardFooter}>
          {isAssignedRole ? (
            <Button
              type="primary"
              variant="success"
              icon="bi-rocket-takeoff"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                //navigate to project details or team dashboard
              }}
            >
              View Project
            </Button>
          ) : (
            <Button
              type="secondary"
              variant="view"
              icon="bi-file-earmark-text"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                //open modal with application data
                if (onViewApplication) {
                  onViewApplication(project);
                }
              }}
            >
              View Request
            </Button>
          )}
        </div>
      )}
      {!isProjectCard && !isApplyCard && (
        <div className={styles.cardSkills}>
          {renderSkills()}
        </div>
      )}
    </>
  );

  const listContent = (
    <>
      <div className={styles.cardHeader}>
        <img
          className={styles.cardAvatar}
          src={roleData.clientLogo || "/images/ImagenProyectoDefault.png"}
          alt={`${roleData.projectName || 'Project'} logo`}
        />
      </div>

      <div className={customStyles.titleContainer}>
        <h3 className={styles.cardTitle}>{roleData.roleName}</h3>
        {roleData.projectName && <p className={styles.cardSubtitle}>for {roleData.projectName}</p>}
        {isProjectCard && !isApplyCard && roleData.roleCount > 0 && (
          <p className={styles.cardSubtitle}>{roleData.roleCount} roles available</p>
        )}
        {isApplyCard && (
          <p className={styles.cardSubtitle}>Applied on {new Date(roleData.date).toLocaleDateString()}</p>
        )}
      </div>

      <div className={customStyles.floatingDescription}>
        <p className={styles.descriptionText}>
          {roleData.description || `Description for Project ${roleData.projectName || 'Unknown'}`}
        </p>
      </div>

      {!isApplyCard && (
        <div className={customStyles.skillsCircleContainer}>
          <div className={`${styles.cardSkills} ${customStyles.cardSkills}`}>
            {renderSkills()}
          </div>
        </div>
      )}

      <div className={customStyles.durationColumn}>
        <span className={styles.detailLabel}>
          <i className="bi bi-clock"></i> {isApplyCard ? 'Duration' : 'Duration'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={customStyles.durationValue}>
            {roleData.duration === "< 1" ? "< 1 month" : `${roleData.duration} months`}
          </span>
          
          {showCompatibility && !isApplyCard && (
            <ProgressCircle
              value={compatibilityValue}
              size={40}
              strokeWidth={4}
              fontSize="0.8rem"
              fontWeight="light"
            />
          )}
        </div>
      </div>

      {isApplyCard && (
        <div className={styles.cardFooter}>
          {isAssignedRole ? (
            <Button
              type="primary"
              variant="success"
              icon="bi-rocket-takeoff"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                //navigate to project details or team dashboard
              }}
            >
              View Project
            </Button>
          ) : (
            <Button
              type="secondary"
              variant="view"
              icon="bi-file-earmark-text"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                //open modal with application data
                if (onViewApplication) {
                  onViewApplication(project);
                }
              }}
            >
              View Request
            </Button>
          )}
        </div>
      )}
    </>
  );

  if (viewMode === 'grid') {
    if (isProjectCard) {
      return (
        <div 
          onClick={handleProjectCardClick}
          style={{ 
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
        >
          <GlassCard className={getCardClass()}>
            {gridContent}
          </GlassCard>
        </div>
      );
    }
    if (isApplyCard) {
      return (
        <GlassCard className={getCardClass()} tabActive={"Applied To"} {...getCardProps()}>
          {gridContent}
        </GlassCard>
      );
    }
    return (
      <GlassCardNavigation id={id} idrol={idrol} className={getCardClass()} onClick={onClick}>
        {gridContent}
      </GlassCardNavigation>
    );
  }

  if (isProjectCard) {
    return (
      <div 
        onClick={handleProjectCardClick}
        style={{ 
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}
      >
        <GlassCard className={getCardClass()}>
          {listContent}
        </GlassCard>
      </div>
    );
  }
  if (isApplyCard) {
    return (
      <GlassCard className={getCardClass()} tabActive={"Applied To"} {...getCardProps()}>
        {listContent}
      </GlassCard>
    );
  }

  return (
    <GlassCardNavigation id={id} idrol={idrol} className={getCardClass()} onClick={onClick}>
      {listContent}
    </GlassCardNavigation>
  );
};

export default ProjectCard;
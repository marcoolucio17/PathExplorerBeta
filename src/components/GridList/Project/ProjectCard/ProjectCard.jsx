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
  
  const cardClass = viewMode === 'grid'
    ? styles.cardGrid
    : `${styles.cardList} ${customStyles.cardList}`;

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
      //for project cards, show project name as title

      return {
        roleName: project.pnombre || 'Project',
        projectName: '', //no subtitle for project cards
        duration: project.duracionMes ? project.duracionMes : project.duracionMes === 0 ? "< 1" : "TBD",
        roleCount: project.proyecto_roles ? project.proyecto_roles.length : 0
      };
    } else if (isApplyCard && !isProjectCard) {
      return {
        roleName: project.roles.nombrerol,
        projectName: project.proyecto.pnombre || 'Project',
        status: project.estatus,
        date: project.fechaaplicacion,

      }
    }

    //proyecto_rol.nombrerol ||
    return {
      roleName: project.nombrerol || 'Developer',

      projectName: project.pnombre || 'Project',
      duration: project.duracionMes ? project.duracionMes : project.duracionMes === 0 ? "< 1" : "TBD"
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
      {showCompatibility && !isProjectCard && !isApplyCard && (
        <div className={styles.statusCircle}>
          <ProgressCircle
            value={compatibilityValue}
            size={60}
            fontSize="1.1rem"
            strokeWidth={6}
            fontWeight="light"
          />
        </div>
      )}

      <div className={styles.cardHeader}>
        <img
          className={styles.cardAvatar}
          src={project.cliente?.fotodecliente_url || project.fotodecliente_url || "/images/ImagenProyectoDefault.png"}
          alt={`${project.pnombre} logo`}
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
          </div>
        )}
      </div>

      {!isApplyCard && <div className={`${styles.cardDescription} ${styles.reducedMargin}`}>
        <p className={styles.descriptionText}>
          {project.descripcion || 'This project aims to develop a comprehensive solution that meets client requirements while leveraging modern technologies...'}
        </p>
      </div>}

      <div className={styles.cardDetails}>
        {!isApplyCard && <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <i className="bi bi-clock"></i> Duration:
          </span>
          {(roleData.duration !== "< 1") && <span className={styles.detailValue}>
            {roleData.duration} months
          </span>}
          {(roleData.duration === "< 1") && <span className={styles.detailValue}>
            {roleData.duration} month
          </span>}
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
            <span className={styles.detailValue}>
              {roleData.status}
            </span>
          </div>)
        }
      </div>

      {isApplyCard && (
        <div className={styles.cardFooter}>
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
          src={project.cliente?.fotodecliente_url || "/images/ImagenProyectoDefault.png"}
          alt={`${project.pnombre} logo`}
        />
      </div>

      <div className={customStyles.titleContainer}>
        <h3 className={styles.cardTitle}>{roleData.roleName}</h3>
        {roleData.projectName && <p className={styles.cardSubtitle}>for {roleData.projectName}</p>}
        {isProjectCard && !isApplyCard && roleData.roleCount > 0 && (
          <p className={styles.cardSubtitle}>{roleData.roleCount} roles available</p>
        )}
      </div>

      <div className={customStyles.floatingDescription}>
        <p className={styles.descriptionText}>
          {isProjectCard ? project.descripcion : `Description for Project ${project.pnombre || '5'}`}
        </p>
      </div>

      {isProjectCard && (
        <div className={customStyles.skillsCircleContainer}>
          <div className={`${styles.cardSkills} ${customStyles.cardSkills}`}>
            {renderSkills()}
          </div>

          {!showCompatibility && (
            <div className={`${styles.statusCircle} ${customStyles.statusCircle}`}>
              <ProgressCircle
                value={compatibilityValue}
                size={60}
                strokeWidth={6}
                fontSize="1rem"
                fontWeight="light"
              />
            </div>
          )}
        </div>
      )}

      <div className={customStyles.durationColumn}>
        <span className={styles.detailLabel}>
          <i className="bi bi-clock"></i> Duration
        </span>
        <span className={customStyles.durationValue}>
          {roleData.duration} months
        </span>
      </div>
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
          <GlassCard className={cardClass}>
            {gridContent}
          </GlassCard>
        </div>
      );
    }
    if (isApplyCard) {
      return (
        <GlassCard className={cardClass} tabActive={"Applied To"}>
          {gridContent}
        </GlassCard>
      );
    }
    return (
      <GlassCardNavigation id={id} idrol={idrol} className={cardClass} onClick={onClick}>
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
        <GlassCard className={cardClass}>
          {listContent}
        </GlassCard>
      </div>
    );
  }
  if (isApplyCard) {
    return (
      <GlassCard className={cardClass} tabActive={"Applied To"}>
        {listContent}
      </GlassCard>
    );
  }

  return (
    <GlassCardNavigation id={id} idrol={idrol} className={cardClass} onClick={onClick}>
      {listContent}
    </GlassCardNavigation>
  );
};

export default ProjectCard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from 'src/components/shared/GlassCard';
import GlassCardNavigation from 'src/components/shared/GlassCard/GlassCardNavigation'; // el import es un poquito diferente
import { ProgressCircle } from 'src/components/ProgressCircle';
import SkillChip from 'src/components/SkillChip/SkillChip';
import styles from 'src/styles/GridList/GridListCard.module.css';
import customStyles from 'src/styles/GridList/ProjectCard.module.css';
import useGetFetch from 'src/hooks/useGetFetch';

const ProjectCard = ({
  id,
  project,
  proyecto_rol,
  viewMode,
  idEmployee,
  idrol,
  showCompatibility,
  onClick,
  selectedSkillFilters = [],
  userSkills = [],
  isProjectCard = false //new prop to indicate project-level card
}) => {
  const navigate = useNavigate();
  const cardClass = viewMode === 'grid'
    ? styles.cardGrid
    : `${styles.cardList} ${customStyles.cardList}`;

  //custom navigation for project cards
  const handleProjectCardClick = (e) => {
    console.log("project card clicked:", { id, isProjectCard, event: e });
    if (isProjectCard) {
      e.preventDefault();
      e.stopPropagation();
      console.log("navigating to:", `/manager/project/${id}`);
      navigate(`/manager/project/${id}`);
    }
  };

  //debugging: log props to see what we're getting
  console.log("ProjectCard render:", { 
    id, 
    idrol, 
    isProjectCard, 
    project: project?.pnombre,
    proyecto_rol: proyecto_rol?.roles?.idrol 
  });

  //stable duration calculation based on project id to prevent fluctuation
  const ensureRoleData = () => {
    if (isProjectCard) {
      //for project cards, show project name as title
      return {
        roleName: project.pnombre || 'Project',
        projectName: '', //no subtitle for project cards
        duration: project.idproyecto ? ((project.idproyecto % 16) + 3) : 8,
        roleCount: project.proyecto_roles ? project.proyecto_roles.length : 0
      };
    }
    
    return {
      roleName: proyecto_rol.roles?.nombrerol || 'Developer',
      projectName: project.pnombre || 'Project',
      duration: project.idproyecto ? ((project.idproyecto % 16) + 3) : 8
    };
  };

  const ensureSkillsData = () => {
    //for project cards, don't show skills
    if (isProjectCard) {
      return [];
    }
    
    if (!proyecto_rol.roles?.requerimientos_roles || proyecto_rol.roles.requerimientos_roles.length === 0) {
      return [
        { id: 'demo-1', name: 'JavaScript', isUser: true },
        { id: 'demo-2', name: 'React', isUser: false },
        { id: 'demo-3', name: 'Python', isUser: false },
        { id: 'demo-4', name: 'Node.js', isUser: true }
      ];
    }

    return proyecto_rol.roles.requerimientos_roles.map(req_rol => ({
      id: req_rol.requerimientos.habilidades.idhabilidad,
      name: req_rol.requerimientos.habilidades.nombre,
      isUser: userSkills.includes(req_rol.requerimientos.habilidades.nombre) ||
        selectedSkillFilters.includes(req_rol.requerimientos.habilidades.nombre)
    }));
  };


  const matchPercentage = 0;/*useGetFetch({
    rutaApi: `compability?id_rol=${idr*ol}&idusuario=${idEmployee}`
  })*/


  const matchPercentageValue = matchPercentageData ? matchPercentageData : 0;
  const roleData = ensureRoleData();
  const skillsData = ensureSkillsData();

  const renderSkills = () => {
    //don't render skills for project cards
    if (isProjectCard || skillsData.length === 0) {
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
      {showCompatibility && !isProjectCard && (
        <div className={styles.statusCircle}>
          <ProgressCircle
            value={matchPercentageValue}
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
          src={project.imagen || "/images/ImagenProyectoDefault.png"}
          alt={`${project.pnombre} logo`}
        />
        <div className={styles.cardInfo}>
          <h3 className={styles.cardTitle}>{roleData.roleName}</h3>
          {roleData.projectName && <p className={styles.cardSubtitle}>for {roleData.projectName}</p>}
          {isProjectCard && roleData.roleCount > 0 && (
            <p className={styles.cardSubtitle}>{roleData.roleCount} roles available</p>
          )}
        </div>
      </div>

      <div className={`${styles.cardDescription} ${styles.reducedMargin}`}>
        <p className={styles.descriptionText}>
          {project.descripcion || 'This project aims to develop a comprehensive solution that meets client requirements while leveraging modern technologies...'}
        </p>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <i className="bi bi-clock"></i> Duration:
          </span>
          <span className={styles.detailValue}>
            {roleData.duration} months
          </span>
        </div>
      </div>

      {!isProjectCard && (
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
          src={project.imagen || "/images/ImagenProyectoDefault.png"}
          alt={`${project.pnombre} logo`}
        />
      </div>

      <div className={customStyles.titleContainer}>
        <h3 className={styles.cardTitle}>{roleData.roleName}</h3>
        {roleData.projectName && <p className={styles.cardSubtitle}>for {roleData.projectName}</p>}
        {isProjectCard && roleData.roleCount > 0 && (
          <p className={styles.cardSubtitle}>{roleData.roleCount} roles available</p>
        )}
      </div>

      <div className={customStyles.floatingDescription}>
        <p className={styles.descriptionText}>
          {isProjectCard ? project.descripcion : `Description for Project ${project.pnombre || '5'}`}
        </p>
      </div>

      {!isProjectCard && (
        <div className={customStyles.skillsCircleContainer}>
          <div className={`${styles.cardSkills} ${customStyles.cardSkills}`}>
            {renderSkills()}
          </div>

          {showCompatibility && (
            <div className={`${styles.statusCircle} ${customStyles.statusCircle}`}>
              <ProgressCircle
                value={matchPercentageValue}
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

  return (
    <GlassCardNavigation id={id} idrol={idrol} className={cardClass} onClick={onClick}>
      {listContent}
    </GlassCardNavigation>
  );
};

export default ProjectCard;

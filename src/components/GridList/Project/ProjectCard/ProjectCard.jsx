import React from 'react';
import { GlassCard } from 'src/components/shared/GlassCard';
import { ProgressCircle } from 'src/components/ProgressCircle';
import SkillChip from 'src/components/SkillChip/SkillChip';
import styles from 'src/styles/GridList/GridListCard.module.css';
import customStyles from 'src/styles/GridList/ProjectCard.module.css';
import useGetFetch from 'src/hooks/useGetFetch';

const ProjectCard = ({
  project,
  proyecto_rol,
  viewMode,
  idEmployee,
  idrol,
  showCompatibility,
  selectedSkillFilters = [],
  userSkills = []
}) => {
  const cardClass = viewMode === 'grid'
    ? styles.cardGrid
    : `${styles.cardList} ${customStyles.cardList}`;

  //stable duration calculation based on project id to prevent fluctuation
  const ensureRoleData = () => {
    return {
      roleName: proyecto_rol.roles?.nombrerol || 'Developer',
      projectName: project.pnombre || 'Project',
      duration: project.idproyecto ? ((project.idproyecto % 16) + 3) : 8
    };
  };

  const ensureSkillsData = () => {
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

  const { data: matchPercentageData } = useGetFetch({
    rutaApi: `compability?id_rol=${idrol}&idusuario=${idEmployee}`
  });

  const matchPercentageValue = matchPercentageData ? matchPercentageData : 0;
  const roleData = ensureRoleData();
  const skillsData = ensureSkillsData();

  const renderSkills = () => {
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
      {showCompatibility && (
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
          <p className={styles.cardSubtitle}>for {roleData.projectName}</p>
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

      <div className={styles.cardSkills}>
        {renderSkills()}
      </div>
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
        <p className={styles.cardSubtitle}>for {roleData.projectName}</p>
      </div>

      <div className={customStyles.floatingDescription}>
        <p className={styles.descriptionText}>
          Description for Project {project.pnombre || '5'}
        </p>
      </div>

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
    return (
      <GlassCard className={cardClass}>
        {gridContent}
      </GlassCard>
    );
  }

  return (
    <GlassCard className={cardClass}>
      {listContent}
    </GlassCard>
  );
};

export default ProjectCard;

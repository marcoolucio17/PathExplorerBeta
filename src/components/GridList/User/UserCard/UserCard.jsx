import React from 'react';
import { GlassCard } from 'src/components/shared/GlassCard';
import { ProgressCircle } from 'src/components/ProgressCircle';
import SkillChip from 'src/components/SkillChip/SkillChip';
import styles from 'src/styles/GridList/GridListCard.module.css';
import customStyles from 'src/styles/GridList/UserCard.module.css';

const UserCard = ({
  user,
  viewMode,
  showCompatibility,
  onClick,
  selectedSkillFilters = [],
  userSkills = []
}) => {
  const cardClass = viewMode === 'grid'
    ? styles.cardGrid
    : `${styles.cardList} ${customStyles.cardList}`;

  //stable user data
  const ensureUserData = () => {
    //extract current project from utp array
    const currentProject = user.utp && user.utp.length > 0 
      ? user.utp[0].proyecto?.pnombre || 'Project assigned'
      : 'No project assigned';
    
    //extract current role from utp array  
    const currentRole = user.utp && user.utp.length > 0
      ? user.utp[0].aplicacion?.roles?.nombrerol || 'Role assigned'
      : 'No role assigned';

    return {
      userName: user.nombre || 'User',
      userEmail: user.correoelectronico || 'user@example.com',
      userType: user.tipo || 'Employee',
      currentProject: currentProject,
      currentRole: currentRole,
      employeeId: user.employeeeid || 'N/A',
      profilePicture: user.fotodeperfil_url || null,
      isInProject: user.estaenproyecto || false
    };
  };

  //debugging: log user object
  console.log("usercard received user:", user);
  console.log("user utp array:", user.utp);

  const userData = ensureUserData();

  //render avatar with real profile picture or default icon
  const renderAvatar = () => {
    if (userData.profilePicture) {
      return (
        <img 
          className={styles.cardAvatar}
          src={userData.profilePicture}
          alt={`${userData.userName} profile`}
          style={{ 
            width: '2.5rem', 
            height: '2.5rem', 
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      );
    }
    return (
      <div className={styles.cardAvatar}>
        <i className="bi bi-person-circle" style={{ fontSize: '2.5rem', color: '#6c757d' }}></i>
      </div>
    );
  };

  //handle card click
  const handleCardClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(user);
    }
  };

  const gridContent = (
    <>
      <div className={styles.cardHeader}>
        {renderAvatar()}
        <div className={styles.cardInfo}>
          <h3 className={styles.cardTitle}>{userData.userName}</h3>
          <p className={styles.cardSubtitle}>{userData.userType}</p>
        </div>
      </div>

      <div className={`${styles.cardDescription} ${styles.reducedMargin}`}>
        <p className={styles.descriptionText}>
          {userData.userEmail}
        </p>
      </div>

      <div className={styles.cardDetails}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <i className="bi bi-briefcase"></i> Project:
          </span>
          <span className={styles.detailValue}>
            {userData.currentProject}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            <i className="bi bi-person-badge"></i> Role:
          </span>
          <span className={styles.detailValue}>
            {userData.currentRole}
          </span>
        </div>
      </div>
    </>
  );

  const listContent = (
    <>
      <div className={styles.cardHeader}>
        {renderAvatar()}
      </div>

      <div className={customStyles.titleContainer}>
        <h3 className={styles.cardTitle}>{userData.userName}</h3>
        <p className={styles.cardSubtitle}>{userData.userType}</p>
      </div>

      <div className={customStyles.floatingDescription}>
        <p className={styles.descriptionText}>
          {userData.userEmail}
        </p>
      </div>

      <div className={customStyles.projectColumn}>
        <span className={styles.detailLabel}>
          <i className="bi bi-briefcase"></i> Project
        </span>
        <span className={customStyles.projectValue}>
          {userData.currentProject}
        </span>
      </div>

      <div className={customStyles.roleColumn}>
        <span className={styles.detailLabel}>
          <i className="bi bi-person-badge"></i> Role
        </span>
        <span className={customStyles.roleValue}>
          {userData.currentRole}
        </span>
      </div>
    </>
  );

  //add clickable styling if onclick is provided
  const cardStyle = onClick ? { cursor: 'pointer' } : {};

  if (viewMode === 'grid') {
    return (
      <GlassCard 
        className={cardClass} 
        onClick={handleCardClick}
        style={cardStyle}
      >
        {gridContent}
      </GlassCard>
    );
  }

  return (
    <GlassCard 
      className={cardClass} 
      onClick={handleCardClick}
      style={cardStyle}
    >
      {listContent}
    </GlassCard>
  );
};

export default UserCard;

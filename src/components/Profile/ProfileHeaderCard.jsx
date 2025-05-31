import React from 'react';
import { GlassCard } from "../shared/GlassCard";
import styles from './ProfileHeaderCard.module.css';

import useFetch from 'src/hooks/useFetch';

function formatDateToMonthYear(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

const ProfileHeaderCard = ({ user }) => {

  const { data, loading, error } = useFetch(
    "profile-url/" + localStorage.getItem("id")
  );

  const userTitle = user.role == "User" ? "Employee" : user.role;

  return (
    <GlassCard className={styles.profileHeaderCard}>
      <div className={styles.profileHeaderMain}>
        <div className={styles.employeeSection}>
          <img
            src={data.url}
            alt={`${user.name}`}
            className={styles.avatarXl}
          />
          <div className={styles.employeeMeta}>
            <h1>{user.name}</h1>
            <h2>{userTitle} at {user.company}</h2>
            <p className={styles.location}>
              <i className="bi bi-geo-alt-fill" /> {user.location}
            </p>
          </div>
        </div>
        
        <div className={styles.projectSection}>
          <div className={styles.projectMeta}>
            <h3>{user.pnombre}</h3>
            <p className={styles.projectDuration}>{formatDateToMonthYear(user.finicio)} - {formatDateToMonthYear(user.fechafin)}</p>
            <p className={styles.projectRole}>{user.title}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProfileHeaderCard;
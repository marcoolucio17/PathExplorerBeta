import React from "react";
import { GlassCard } from "../shared/GlassCard";
import { SkillChip } from "../SkillChip";
import CustomScrollbar from "../CustomScrollbar";
import styles from "/src/components/Profile/ProfileSkills.module.css";
import certStyles from "src/components/Profile/ProfileCertificates.module.css";
import "src/index.css";

/**
 * ProfileSkills component for displaying skills with categories
 * @param {Object} data 
 * @param {Function} onSkillsClick - Function to handle skills button click
 * @returns {JSX.Element}
 */
export const TrendsCard = ({ data, onSkillsClick }) => {
  const skills = Array.isArray(data) ? data : [];  const hasNoSkills = skills.length === 0 ;

  const certsWithImages = [
    {
      id: 3,
      title: "Agile Methodology Explorer",
      issuer: "IBM Skillsbuild",
      img: "/images/ibmskillsbuild.png",
      alt: "Certificate for Agile Methodology Explorer",
    },
    {
      id: 4, 
      title: "Javascript for Beginners",
      issuer: "JS Institute",
      img: "/images/jscert.png",
      alt: "Certificate for Javascript Development",
    }
  ];

  console.log("Raw data:", data);
  console.log("skills:", Array.isArray(data?.result) ? data.result : []);

  return (
    <GlassCard className={styles.skillsCard}>
      <div className={styles.sectionHeader}>
        <h2 className="sectionTitle">Trends</h2>
      </div>
      <div className={styles.skillsScrollContainer}>
        <CustomScrollbar fadeBackground="transparent" fadeHeight={40}>
          <div className={styles.skillsContent}>
            {hasNoSkills ? (
              <div className={styles.placeholder}>
                <i className="bi bi-gear-wide-connected"></i>
                <p>Loading...</p>
                <span>Fetching Skills</span>
              </div>
            ) : (
              <>
                {skills.length > 0 && (
                  <div className={styles.skillCategory}>
                    <h3 className="subtitle">Most Popular Skills</h3>
                    <div className={styles.divider}></div>
                    <div className={styles.skillChipsContainer}>
                      {skills.map((skill, index) => (
                        <SkillChip key={`hard-${skill}-${index}`} text={`${skill.name} (${skill.percentage}%)`} />
                      ))}
                    </div>
                  </div>
                )}
              </>
              
            )}
          </div>
          <br></br>
          <h3 className="subtitle">Most Popular Certificates</h3>
          <div className={styles.divider}></div>
          <br></br>

          <div className={certStyles.certificatesContent}>
            {certsWithImages.length === 0 ? (
              <div className={certStyles.placeholder}>
                <i className="bi bi-award"></i>
                <p>No certificates yet</p>
                <span>Add your first certificate to showcase your achievements</span>
              </div>
            ) : (
              certsWithImages.map(cert => (
                <article 
                  key={cert.id} 
                  className={certStyles.certificate}
                  onClick={() => onCertificateClick(cert)}
                >
                  <img src={cert.img} alt={cert.alt} />
                  <div>
                    <h3>{cert.title}</h3>
                    <p>by {cert.issuer}</p>
                  </div>
                </article>
              ))
            )}
          </div>
          
        </CustomScrollbar>
      </div>
    </GlassCard>
  );
};

export default TrendsCard;
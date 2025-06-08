import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import components
import { GlassCard } from "../../../components/shared/GlassCard";
import SkillChip from "../../../components/SkillChip/SkillChip";
import Button from "../../../components/shared/Button/Button";
//import page-specific styles
import pageStyles from "./ManagerHomePage.module.css";
//import styles for specific sections
import quickActionsStyles from "./QuickActions.module.css";
import useFetch from "src/hooks/useFetch";
import { formatName } from "src/hooks/profile/useProfilePage";
import ImageCarousel from "src/pages/empleado/EmpleadoHomePage/ImageCarousel";
import { TrendsCard } from "src/components/Home/TrendsCard";
import useEmpleadoDashboardPage from "src/hooks/dashboard/useEmpleadoDashboardPage";
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";
import CustomScrollbar from "src/components/CustomScrollbar";
import { ProjectList } from "src/components/GridList/Project";

const hardcodedSkillsData = {
  message: "Habilidades conseguidas fácilmente",
  result: [
    { id: 1, name: "Python", percentage: "11.95" },
    { id: 4, name: "JavaScript", percentage: "8.18" },
    { id: 2, name: "Comunicación", percentage: "6.92" },
    { id: 6, name: "C#", percentage: "4.40" },
    { id: 31, name: "CI/CD", percentage: "3.14" }
  ]
};

export const ManagerHomePage = () => {
  const navigate = useNavigate();
  
  //api stuff needed for the page
  const { data, error, loading } = useFetch(
    "usuario/" + localStorage.getItem("id")
  );

  const {data1, loading1, error1} = useFetch(
    "habilidades/top/5"
  )

  if (loading1) return <p>Loading skills...</p>;
  if (error1) return <p>Error loading skills: {error1.message}</p>;

  console.log(data1);

  const handleApplyToProject = (projectId) => {
    console.log(`Applying to project ${projectId}`);
    //handle application logic here
  };

  const quickActions = [
    {
      id: 1,
      icon: "bi-person-fill",
      title: "My Profile",
      path: "/empleado/perfil"
    },
    {
      id: 2,
      icon: "bi-laptop",
      title: "Project Dashboard",
      path: "/empleado/dashboard"
    },
    {
      id: 3,
      icon: "bi-folder-fill",
      title: "My Project",
      path: "/empleado/proyectos"
    }
  ];

  const dashboardPage = useEmpleadoDashboardPage();
  
  
  return (
    <div className={pageStyles.homeLayout}>
      <div className={pageStyles.mainContentWrapper}>
        {/* header section */}
        <div className={pageStyles.headerSection}>
          <h1 className={pageStyles.mainTitle}>{`Welcome back, ${formatName(data?.user?.nombre) || "..."}!`}</h1>
        </div>

        {/* main content area */}
        <div className={pageStyles.contentSection}>
          <div className={pageStyles.mainbar}>
            {/* progress section*/}
            <div className={pageStyles.progressCard}>
              <div className={pageStyles.progressContent}>
                <GlassCard className={pageStyles.mainbarAnnouncementCard}>
                  <ImageCarousel />
                </GlassCard>
              </div>
            </div>

            {/* project recommendations section */}
            <div className={pageStyles.recommendationsCard}>
              <h3 className={pageStyles.recommendationTitle}>
                Based on your profile, you'd be a great fit for these projects:
              </h3>
              
            <div className={styles.cardsContainer}>
                <ProjectList 
                  projects={dashboardPage.topProjects}
                  viewMode={dashboardPage.viewMode}
                  showCompatibility={dashboardPage.showCompatibility}
                  selectedSkillFilters={dashboardPage.selectedSkillFilters}
                  userSkills={dashboardPage.userSkills}
                  calculateMatchPercentage={dashboardPage.calculateMatchPercentage}
                  onClearFilters={dashboardPage.handleClearFilters}
                  isLoading={dashboardPage.isLoading}
                />
            </div>
            </div>
          </div>
        </div>

        {/* sidebar */}
        <div className={pageStyles.sidebar}>
          {/* quick actions card */}
          <GlassCard className={pageStyles.sidebarCard}>
            <h2 className={pageStyles.sectionTitle}>Quick Actions</h2>
            <div className={quickActionsStyles.actionsContainer}>
              {quickActions.map((action) => (
                <div key={action.id} className={quickActionsStyles.actionItem}>
                  <div className={quickActionsStyles.actionInfo}>
                    <i className={`${action.icon} ${quickActionsStyles.actionIcon}`} />
                    <span className={quickActionsStyles.actionTitle}>{action.title}</span>
                  </div>
                  <button
                    onClick={() => navigate(action.path)}
                    className={quickActionsStyles.actionButton}
                  >
                    <i className="bi bi-arrow-right-circle-fill" />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* trends card at bottom */}
          <div className={pageStyles.trendsContainer}>
            <TrendsCard 
              className={pageStyles.sidebarSection}
              data={hardcodedSkillsData.result} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

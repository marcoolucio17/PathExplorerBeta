import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import components
import { GlassCard } from "../../../components/shared/GlassCard";
import SkillChip from "../../../components/SkillChip/SkillChip";
import Button from "../../../components/shared/Button/Button";
//import page-specific styles
import pageStyles from "./EmpleadoHomePage.module.css";
//import styles for specific sections
import quickActionsStyles from "./QuickActions.module.css";
import useFetch from "src/hooks/useFetch";
import { formatName } from "src/hooks/profile/useProfilePage";
import ImageCarousel from "./ImageCarousel";
import { TrendsCard } from "src/components/Home/TrendsCard";
import useEmpleadoDashboardPage from "src/hooks/dashboard/useEmpleadoDashboardPage";
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";
import CustomScrollbar from "src/components/CustomScrollbar";
import { ProjectList } from "src/components/GridList/Project";

//mock data - in a real app, this would come from props or API
const MOCK_RECOMMENDED_PROJECTS = [
  {
    idproyecto: 1,
    pnombre: "Project Pepsi",
    matchPercentage: 98,
    skills: ["Figma", "Figma", "Figma"],
    status: "open"
  },
  {
    idproyecto: 2,
    pnombre: "Project Pepsi",
    matchPercentage: 98,
    skills: ["Figma", "Figma", "Figma"],
    status: "open"
  },
  {
    idproyecto: 3,
    pnombre: "Project Pepsi",
    matchPercentage: 98,
    skills: ["Figma", "Figma", "Figma"],
    status: "open"
  }
];

export const EmpleadoHomePage = () => {
  const navigate = useNavigate();
  const [recommendedProjects] = useState(MOCK_RECOMMENDED_PROJECTS);

  const [goalProgress] = useState(1); //1/3
  const [projectProgress] = useState(96); //96%
  
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
              <CustomScrollbar fadeBackground="transparent" fadeHeight={40} showHorizontalScroll={false}>
                <ProjectList 
                  projects={dashboardPage.displayProjects}
                  viewMode={dashboardPage.viewMode}
                  showCompatibility={dashboardPage.showCompatibility}
                  selectedSkillFilters={dashboardPage.selectedSkillFilters}
                  userSkills={dashboardPage.userSkills}
                  calculateMatchPercentage={dashboardPage.calculateMatchPercentage}
                  onClearFilters={dashboardPage.handleClearFilters}
                  isLoading={dashboardPage.isLoading}
                />
              </CustomScrollbar>
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
              data={data1} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

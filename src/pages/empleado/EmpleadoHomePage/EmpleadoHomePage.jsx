import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "../../../components/shared/GlassCard";
import SkillChip from "../../../components/SkillChip/SkillChip";
import Button from "../../../components/shared/Button/Button";
import Alert from "react-bootstrap/Alert";
import pageStyles from "./EmpleadoHomePage.module.css";
import quickActionsStyles from "./QuickActions.module.css";
import useFetch from "src/hooks/useFetch";
import { formatName } from "src/hooks/profile/useProfilePage";
import ImageCarousel from "./ImageCarousel";
import { TrendsCard } from "src/components/Home/TrendsCard";
import useEmpleadoDashboardPage from "src/hooks/dashboard/useEmpleadoDashboardPage";
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";
import CustomScrollbar from "src/components/CustomScrollbar";
import { ProjectList } from "src/components/GridList/Project";
import useGetFetch from "src/hooks/useGetFetch";
import "src/index.css";

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

export const EmpleadoHomePage = () => {
  const navigate = useNavigate();
  
  const { data, error, loading } = useFetch(
    "usuario/" + localStorage.getItem("id")
  );


  const userRole = localStorage.getItem("role");

  const getQuickActionsByRole = (role) => {
    switch(role) {
      case "manager":
        return [
          {
            id: 1,
            icon: "bi-person-fill",
            title: "My Profile",
            path: "/manager/perfil"
          },
          {
            id: 2,
            icon: "bi-folder-fill",
            title: "Project Dashboard",
            path: "/manager/dashboard"
          },
          {
            id: 3,
            icon: "bi-people-fill",
            title: "Employees Dashboard",
            path: "/manager/employee-dashboard"
          }
        ];
      
      case "empleado":
        return [
          {
            id: 1,
            icon: "bi-person-fill",
            title: "My Profile",
            path: "/empleado/perfil"
          },
          {
            icon: "bi-folder-fill",
            title: "Project Dashboard",
            path: "/empleado/dashboard"
          },
          {
            id: 3,
            icon: "bi-people-fill",
            title: "Employees Dashboard",
            path: "/empleado/employee-dashboard"
          }
        ];
      
      case "tfs":
        return [
          {
            id: 1,
            icon: "bi-person-fill",
            title: "My Profile",
            path: "/tfs/perfil"
          },
          {
            icon: "bi-folder-fill",
            title: "Applicants",
            path: "/tfs/applicants"
          },
          {
            id: 3,
            icon: "bi-people-fill",
            title: "Employees Dashboard",
            path: "/tfs/employee-dashboard"
          }
        ];
      
      default:
        return [
          {
            id: 1,
            icon: "bi-person-fill",
            title: "My Profile",
            path: "/empleado/perfil"
          },
          {
            id: 2,
            icon: "bi-laptop",
            title: "Dashboard",
            path: "/empleado/dashboard"
          }
        ];
    }
  };

  const quickActions = getQuickActionsByRole(userRole);

  const dashboardPage = useEmpleadoDashboardPage();

  const {data: data1, loading: loading1, error: error1} = useFetch(
    "habilidades/top/5"
  );
  
  return (
    <>

      <style>{`
        .empleado-home-cards [class*="gridContainer"] {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
          gap: 1rem !important;
          padding: 0.5rem !important;
          max-width: 100% !important;
        }
        .empleado-home-cards [class*="item"] {
          height: 260px !important;
          min-height: 260px !important;
        }
        .empleado-home-cards [class*="item"] > * {
          height: 100% !important;
        }
        .empleado-home-cards [class*="item"] img {
          width: 50px !important;
          height: 50px !important;
          object-fit: cover !important;
        }
        .empleado-home-cards [class*="item"] h3 {
          font-size: 0.9rem !important;
          line-height: 1.2 !important;
        }
        .empleado-home-cards [class*="item"] p {
          font-size: 0.8rem !important;
          line-height: 1.3 !important;
        }
        .empleado-home-cards [class*="skillChip"] {
          font-size: 0.7rem !important;
          padding: 0.2rem 0.4rem !important;
        }
        .empleado-home-cards [class*="skeletonCard"] {
          height: 245px !important;
          min-height: 245px !important;
          width: 400px !important;
          min-width: 400px !important;
        }
      `}</style>

      {error && <div className="login-error-container" style={{ width: "65%", marginLeft: "17.5%", marginRight: "17.5%" }}>
        <Alert className="login-error-alert" variant="danger">
          {error}
        </Alert>
      </div >}
      <div className={pageStyles.homeLayout}>

        <div className={pageStyles.mainContentWrapper}>

          <div className={pageStyles.headerSection}>
            <h1 className={pageStyles.mainTitle}>{`Welcome back, ${formatName(data?.user?.nombre) || "..."}!`}</h1>
          </div>

          <div className={pageStyles.contentSection}>
            <div className={pageStyles.mainbar}>
              <div className={pageStyles.progressCard}>
                <div className={pageStyles.progressContent}>
                  <GlassCard className={pageStyles.mainbarAnnouncementCard}>
                    <ImageCarousel />
                  </GlassCard>
                </div>
              </div>

              <div className={pageStyles.recommendationsCard}>
                <h3 className={pageStyles.recommendationTitle}>
                  Based on your profile, you'd be a great fit for these projects:
                </h3>
                {dashboardPage.errorTopProjects && <Alert className="login-error-alert" variant="danger">
                  {dashboardPage.errorTopProjects}
                </Alert>}
                {!dashboardPage.errorTopProjects && <div className="empleado-home-cards" style={{ display: 'block', width: '100%', marginTop: '-0.78rem' }}>
                  <ProjectList 
                    tabSelected={"topProjects"}
                    projects={dashboardPage.topProjects}
                    viewMode={dashboardPage.viewMode}
                    showCompatibility={dashboardPage.showCompatibility}
                    selectedSkillFilters={dashboardPage.selectedSkillFilters}
                    userSkills={dashboardPage.userSkills}
                    calculateMatchPercentage={dashboardPage.calculateMatchPercentage}
                    onClearFilters={dashboardPage.handleClearFilters}
                    isLoading={dashboardPage.isLoading}
                    skeletonCount={2}
                  />
                </div>}
              </div>
            </div>
          </div>

          <div className={pageStyles.sidebar}>
            <GlassCard className={pageStyles.sidebarCard}>
              <h2 className="sectionTitle">Quick Actions</h2>
              <div className={quickActionsStyles.actionsContainer}>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => navigate(action.path)}
                  className={quickActionsStyles.actionItem} // Make the entire item the button
                >
                  <div className={quickActionsStyles.actionInfo}>
                    <i className={`${action.icon} ${quickActionsStyles.actionIcon}`} />
                    <span className="title-light">{action.title}</span>
                  </div>
                  <i className="bi bi-arrow-right-circle-fill" />
                </button>
              ))}
              </div>
            </GlassCard>

            <div className={pageStyles.trendsContainer}>

              <TrendsCard 
                className={pageStyles.sidebarSection}
                data={data1.result} 
                error={error1}
              />
            </div>
          </div>
        </div>
      </div>

    </>
  );
};
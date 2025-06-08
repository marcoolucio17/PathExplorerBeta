import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "src/components/shared/GlassCard";
import { SkillChip } from "src/components/SkillChip";
import Button from "src/components/shared/Button";
import pageStyles from "src/pages/empleado/EmpleadoHomePage/EmpleadoHomePage.module.css";
import quickActionsStyles from "src/pages/empleado/EmpleadoHomePage/QuickActions.module.css";
import useFetch from "src/hooks/useFetch";
import { formatName } from "src/hooks/profile/useProfilePage";
import ImageCarousel from "../empleado/EmpleadoHomePage/ImageCarousel";
import { TrendsCard } from "src/components/Home/TrendsCard";
import useEmpleadoDashboardPage from "src/hooks/dashboard/useEmpleadoDashboardPage";
import styles from "src/styles/Pages/GridList/GridListDashboard.module.css";
import CustomScrollbar from "src/components/CustomScrollbar";
import { ProjectList } from "src/components/GridList/Project";
import useGetFetch from "src/hooks/useGetFetch";

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

export const TfsHomePage = () => {
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
            icon: "bi-gear-fill",
            title: "System Admin",
            path: "/tfs/admin"
          },
          {
            id: 2,
            icon: "bi-database",
            title: "Data Management",
            path: "/tfs/data"
          },
          {
            id: 3,
            icon: "bi-shield-check",
            title: "Security Settings",
            path: "/tfs/security"
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
  console.log("datos:", data1);
  
  return (
    <>
      <style>{`
        .empleado-home-cards [class*="gridContainer"] {
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) !important;
          gap: 1.5rem !important;
          padding: 1rem !important;
        }
        .empleado-home-cards [class*="item"] {
          height: 280px !important;
        }
        .empleado-home-cards [class*="item"] > * {
          height: 100% !important;
        }
      `}</style>
      
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
                
                <div className="empleado-home-cards" style={{ display: 'block', width: '100%'}}>
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

          <div className={pageStyles.sidebar}>
            <GlassCard className={pageStyles.sidebarCard}>
              <h2 className={pageStyles.sectionTitle}>Quick Actions</h2>
              <div className={quickActionsStyles.actionsContainer}>
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => navigate(action.path)}
                  className={quickActionsStyles.actionItem} // Make the entire item the button
                >
                  <div className={quickActionsStyles.actionInfo}>
                    <i className={`${action.icon} ${quickActionsStyles.actionIcon}`} />
                    <span className={quickActionsStyles.actionTitle}>{action.title}</span>
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
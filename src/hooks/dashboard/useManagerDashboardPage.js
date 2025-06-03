import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useDashboardData from "./useDashboardData";
import useListPage from "../useListPage";
import useModalControl from "../useModalControl";
import useToggleState from "../useToggleState";

export const useManagerDashboardPage = () => {
  const navigate = useNavigate();
  const dashboardData = useDashboardData();
  const tabNames = ["All", "Applied To", "My Projects"];

  const { modals, openModal, closeModal, toggleModal } = useModalControl({
    skillsFilter: false,
    createProject: false,
    clientsFilter: false,
    rolesFilter: false,
  });

  const { state: showCompatibility, toggle: toggleCompatibility } = useToggleState(false);

  const listPage = useListPage({
    data: dashboardData.projects,
    defaultSortOption: "date_desc",
    defaultViewMode: "grid",
    tabConfig: {
      defaultTab: "All",
      tabNameField: "status",
    },
    filterConfig: {},
    sortFunction: dashboardData.sortProjects,
    baseUrl: "/manager/dashboard",
  });

  const toggleViewMode = useCallback(() => {
    listPage.toggleViewMode();
    setTimeout(() => {
      if (listPage.resetAnimation) {
        listPage.resetAnimation();
      }
      setTimeout(() => {
        if (listPage.triggerAnimationSequence) {
          listPage.triggerAnimationSequence();
        }
      });
    });
  }, [listPage]);

  const toggleSkillsFilterModal = () => toggleModal("skillsFilter");
  const toggleClientsFilterModal = () => toggleModal("clientsFilter");
  const toggleRolesFilterModal = () => toggleModal("rolesFilter");

  const handleViewApplicants = useCallback(() => {
    console.log("Navigating to applicants page...");
    try {
      navigate("/manager/applicants", { replace: false });
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/manager/applicants";
    }
  }, [navigate]);

  const idusuarioActual = useMemo(() => 
    localStorage.getItem("id") || sessionStorage.getItem("id"), 
    []
  );

  //stable effect that won't cause infinite loops
  useEffect(() => {
    const currentTab = listPage.activeTab;
    
    if (currentTab === "All") {
      const { idusuario, ...rest } = dashboardData.filterOptions;
      dashboardData.setFilterOptions(rest);
    } else if (currentTab === "My Projects") {
      dashboardData.setFilterOptions({
        ...dashboardData.filterOptions,
        idusuario: idusuarioActual,
      });
    }
  }, [listPage.activeTab, idusuarioActual]); //removed unstable dependencies

  const getTabProjects = useCallback(() => {
    let filteredProjects;

    switch (listPage.activeTab) {
      case "All":
        filteredProjects = dashboardData.projects;
        break;
      case "Applied To":
        filteredProjects = dashboardData.projects.filter(
          (project) => project.userHasApplied === true
        );
        break;
      case "My Projects":
        filteredProjects = dashboardData.projects;
        break;
      default:
        filteredProjects = dashboardData.projects;
    }

    return dashboardData.sortProjects(filteredProjects, listPage.sortOption);
  }, [dashboardData.projects, listPage.activeTab, listPage.sortOption, dashboardData.sortProjects]);

  const getActiveFilters = useCallback(() => {
    const filters = {};

    if (dashboardData.selectedSkillFilters.length > 0) {
      filters.skills = {
        label: "Skill",
        values: dashboardData.selectedSkillFilters,
        color: "rgba(139, 92, 246, 0.2)",
        borderColor: "rgba(139, 92, 246, 0.5)",
      };
    }

    if (dashboardData.clientNameSelected !== "Clients") {
      filters.clients = {
        label: "Client",
        values: [dashboardData.clientNameSelected],
        color: "rgba(0, 123, 255, 0.2)",
        borderColor: "rgba(0, 123, 255, 0.5)",
      };
    }

    if (dashboardData.roleNameSelected !== "Roles") {
      filters.roles = {
        label: "Role",
        values: [dashboardData.roleNameSelected],
        color: "rgba(0, 123, 255, 0.2)",
        borderColor: "rgba(0, 123, 255, 0.5)",
      };
    }
    return filters;
  }, [
    dashboardData.selectedSkillFilters,
    dashboardData.clientNameSelected,
    dashboardData.roleNameSelected
  ]);

  const handleRemoveFilter = useCallback((filterType, value) => {
    if (filterType === "skills") {
      dashboardData.removeSkillFilter(value);
    } else if (filterType === "clients") {
      dashboardData.removeClientFilter();
    } else if (filterType === "roles") {
      dashboardData.removeRoleFilter();
    }
  }, [dashboardData]);

  const handleClearFilters = useCallback(() => {
    dashboardData.clearAllSkillFilters();
    listPage.handleClearFilters();
    dashboardData.removeRoleFilter();
    dashboardData.removeClientFilter();
  }, [dashboardData, listPage]);

  const handleCreateProject = useCallback(() => {
    //add project creation logic
  }, []);

  const displayProjects = useMemo(() => 
    dashboardData.flattenProjectsForList(getTabProjects()),
    [dashboardData, getTabProjects]
  );

  const correctedTabCounts = useMemo(() => {
    if (!dashboardData.projects || dashboardData.projects.length === 0) {
      return { All: 0, "Applied To": 0, "My Projects": 0 };
    }

    const counts = { All: 0, "Applied To": 0, "My Projects": 0 };

    const appliedToProjects = dashboardData.projects.filter(
      (project) => project.userHasApplied === true
    );
    counts["Applied To"] = dashboardData.flattenProjectsForList(appliedToProjects).length;

    const myProjects = dashboardData.projects.filter(
      (project) =>
        project.managerId === dashboardData.currentUserId ||
        project.ownerId === dashboardData.currentUserId
    );
    counts["My Projects"] = dashboardData.flattenProjectsForList(myProjects).length;

    return counts;
  }, [dashboardData.projects, dashboardData.flattenProjectsForList, dashboardData.currentUserId]);

  return {
    ...listPage,
    ...dashboardData,
    displayProjects,
    tabNames,
    showCompatibility,
    toggleCompatibility,
    modals,
    openModal,
    closeModal,
    toggleSkillsFilterModal,
    toggleClientsFilterModal,
    toggleRolesFilterModal,
    handleViewApplicants,
    getActiveFilters,
    handleRemoveFilter,
    handleClearFilters,
    handleCreateProject,
    toggleViewMode,
    tabCounts: correctedTabCounts,
    setTabActual: dashboardData.setTabActual,
    tabActual: dashboardData.tabActual,
  };
};

export default useManagerDashboardPage;

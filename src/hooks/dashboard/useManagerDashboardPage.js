import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../useFetch";
import useDashboardData from "./useDashboardData";
import useListPage from "../useListPage";
import useModalControl from "../useModalControl";
import useToggleState from "../useToggleState";

export const useManagerDashboardPage = () => {
  const navigate = useNavigate();
  const dashboardData = useDashboardData();
  const tabNames = ["All", "Applied To", "My Projects"];

  //get current user id from localStorage
  const currentUserId = useMemo(() => 
    localStorage.getItem("id") || sessionStorage.getItem("id"), 
    []
  );

  //fetch user's created projects for my projects tab
  const { data: myProjectsData, loading: myProjectsLoading, error: myProjectsError } = useFetch(
    currentUserId ? `creador/${currentUserId}` : null
  );

  //debugging: log my projects data
  useEffect(() => {
    if (myProjectsData) {
      console.log("my projects data from /creador endpoint:", myProjectsData);
    }
    if (myProjectsError) {
      console.error("error fetching my projects:", myProjectsError);
    }
  }, [myProjectsData, myProjectsError]);

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
        //use projects from /creador endpoint
        filteredProjects = Array.isArray(myProjectsData) ? myProjectsData : [];
        break;
      default:
        filteredProjects = dashboardData.projects;
    }

    return dashboardData.sortProjects(filteredProjects, listPage.sortOption);
  }, [dashboardData.projects, myProjectsData, listPage.activeTab, listPage.sortOption, dashboardData.sortProjects]);

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

  const displayProjects = useMemo(() => {
    const tabProjects = getTabProjects();
    
    //for my projects tab, don't flatten - show each project as one card
    if (listPage.activeTab === "My Projects") {
      //create project cards without flattening roles
      return tabProjects.map(project => ({
        project,
        proyecto_rol: null, //no specific role for project-level cards
        isProjectCard: true //flag to indicate this is a project card, not role card
      }));
    }
    
    //for other tabs, use normal flattening
    return dashboardData.flattenProjectsForList(tabProjects);
  }, [dashboardData, getTabProjects, listPage.activeTab]);

  //determine loading state based on active tab
  const isLoading = useMemo(() => {
    if (listPage.activeTab === "My Projects") {
      return myProjectsLoading;
    }
    return dashboardData.isLoading || false;
  }, [listPage.activeTab, myProjectsLoading, dashboardData.isLoading]);

  const correctedTabCounts = useMemo(() => {
    if (!dashboardData.projects || dashboardData.projects.length === 0) {
      return { All: 0, "Applied To": 0, "My Projects": 0 };
    }

    const counts = { All: 0, "Applied To": 0, "My Projects": 0 };

    const appliedToProjects = dashboardData.projects.filter(
      (project) => project.userHasApplied === true
    );
    counts["Applied To"] = dashboardData.flattenProjectsForList(appliedToProjects).length;

    //for my projects, count actual projects (not flattened roles)
    if (Array.isArray(myProjectsData)) {
      counts["My Projects"] = myProjectsData.length;
    }

    return counts;
  }, [dashboardData.projects, dashboardData.flattenProjectsForList, myProjectsData]);

  return {
    ...listPage,
    ...dashboardData,
    displayProjects,
    tabNames,
    showCompatibility: listPage.activeTab === "My Projects" ? false : showCompatibility,
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
    isLoading,
    //expose my projects data for debugging
    myProjectsData,
    myProjectsError,
    currentUserId
  };
};

export default useManagerDashboardPage;

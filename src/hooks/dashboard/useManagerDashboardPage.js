import { useState, useEffect, useMemo, useCallback, use } from "react";
import { useNavigate } from "react-router-dom";

import useDashboardData from "./useDashboardData";
import useListPage from "../useListPage";
import useModalControl from "../useModalControl";
import useToggleState from "../useToggleState";
import useGetFetchProjectsFilters from "../useGetFetchProjectsFilters";
import axios from "axios";

export const useManagerDashboardPage = () => {
  const navigate = useNavigate();
  const dashboardData = useDashboardData();
  const tabNames = ["All", "Applied To", "My Projects"];

  //get current user id from localStorage
  const currentUserId = useMemo(
    () => localStorage.getItem("id") || sessionStorage.getItem("id"),
    []
  );
  const [myProjectsData, setMyProjectsData] = useState([]);
  const [myProjectsLoading, setMyProjectsLoading] = useState(true);
  const [myProjectsError, setMyProjectsError] = useState(null);

  let url = "https://pathexplorer-backend.onrender.com/api";
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    params: dashboardData.filterOptionsMyProjects, // 👈 correct way to send query parameters
  };

  useEffect(() => {
    const fetchMyProjects = async () => {
      setMyProjectsLoading(true);

      try {
        const response = await axios.get(`${url}/projects`, config);
        setMyProjectsData(response.data);
      } catch (error) {
        console.error("Error fetching my projects:", error);
        setMyProjectsError(error);
      } finally {
        setMyProjectsLoading(false);
      }
    };

    fetchMyProjects();
  }, [dashboardData.filterOptionsMyProjects]);
  const { modals, openModal, closeModal, toggleModal } = useModalControl({
    skillsFilter: false,
    createProject: false,
    clientsFilter: false,
    rolesFilter: false,
  });

  const { state: showCompatibility, toggle: toggleCompatibility } =
    useToggleState(false);

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
    baseUrl: "/manager/bNamdashboard",
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
    try {
      navigate("/manager/applicants", { replace: false });
    } catch (error) {
      window.location.href = "/manager/applicants";
    }
  }, [navigate]);

  const getTabProjects = useCallback(() => {
    let filteredProjects;

    switch (listPage.activeTab) {
      case "All":
        filteredProjects = dashboardData.projects ? dashboardData.projects : [];
        break;
      case "Applied To":
        filteredProjects = dashboardData.projectsApp
          ? dashboardData.projectsApp
          : [];
        break;
      case "My Projects":
        //use projects from /creador endpoint
        filteredProjects = myProjectsData ? myProjectsData : [];
        break;
      default:
        filteredProjects = dashboardData.projects;
    }

    return dashboardData.sortProjects(filteredProjects, listPage.sortOption);
  }, [
    dashboardData.projects,
    myProjectsData,
    listPage.activeTab,
    listPage.sortOption,
    dashboardData.sortProjects,
  ]);

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
    dashboardData.roleNameSelected,
  ]);

  const handleRemoveFilter = useCallback(
    (filterType, value) => {
      if (filterType === "skills") {
        dashboardData.removeSkillFilter(value);
      } else if (filterType === "clients") {
        dashboardData.removeClientFilter();
      } else if (filterType === "roles") {
        dashboardData.removeRoleFilter();
      }
    },
    [dashboardData]
  );

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

    if (listPage.activeTab === "All") {
      return tabProjects.map((project) => ({
        project,
        proyecto_rol: project.proyecto_roles,
      }));
    }
    //for my projects tab, don't flatten - show each project as one card
    else if (listPage.activeTab === "My Projects") {
      //create project cards without flattening roles
      return tabProjects.map((project) => ({
        project: project,
        proyecto_rol: null, //no specific role for project-level cards
        isProjectCard: true, //flag to indicate this is a project card, not role card*/
      }));
    } else if (listPage.activeTab === "Applied To") {
      //for applied to tab, flatten roles but keep project structure
      return tabProjects.map((project) => ({
        project: project,
        proyecto_rol: null, //indicate this is a role card
        isApplyCard: true, //indicate this is an applied to card
      }));
    }

    //for other tabs, use normal flattening
    return dashboardData.flattenProjectsForList(tabProjects);
  }, [dashboardData, getTabProjects, listPage.activeTab]);
  //determine loading state based on active tab
  const isLoading = useMemo(() => {
    if (listPage.activeTab === "All") {
      return dashboardData.projectsLoading;
    } else if (listPage.activeTab === "My Projects") {
      return myProjectsLoading;
    } else if (listPage.activeTab === "Applied To") {
      return dashboardData.applyLoading;
    }
    return false;
  }, [
    listPage.activeTab,
    myProjectsLoading,
    dashboardData.projectsLoading,
    dashboardData.applyLoading,
  ]);

  const correctedTabCounts = useMemo(() => {
    if (!dashboardData.projects || dashboardData.projects.length === 0) {
      return { All: 0, "Applied To": 0, "My Projects": 0 };
    }

    const counts = { All: 0, "Applied To": 0, "My Projects": 0 };

    counts["All"] = dashboardData.projects.length;
    counts["Applied To"] = dashboardData.projectsApp.length;

    //for my projects, count actual projects (not flattened roles)
    if (Array.isArray(myProjectsData)) {
      counts["My Projects"] = myProjectsData.length;
    }

    return counts;
  }, [dashboardData.projects, dashboardData.projectsApp, myProjectsData]);

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
    isLoading,
    //expose my projects data for debugging
    myProjectsData,
    myProjectsError,
    currentUserId,
  };
};

export default useManagerDashboardPage;

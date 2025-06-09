import { useState, useEffect, useMemo, useCallback, use } from "react";
import { useNavigate } from "react-router-dom";

import useDashboardData from "./useDashboardData";
import useListPage from "../useListPage";
import useModalControl from "../useModalControl";
import useToggleState from "../useToggleState";
import useGetFetchProjectsFilters from "../useGetFetchProjectsFilters";
import axios from "axios";

/**
 * Manager-specific Dashboard hook
 * Tabs: "All", "Applied To", "My Projects"
 * @returns {Object} Complete state and functions for the Manager Dashboard page
 */
export const useManagerDashboardPage = () => {
  const navigate = useNavigate();
  // Get dashboard data
  const dashboardData = useDashboardData();
  // Manager-specific tab names
  const tabNames = ["All", "Applied To", "My Projects"];

  //get current user id from localStorage
  const currentUserId = useMemo(
    () => localStorage.getItem("id") || sessionStorage.getItem("id"),
    []
  );

  // Variables to fetch projects for "My Projects" tab
  // This for the projects created by the user
  const [myProjectsData, setMyProjectsData] = useState([]);
  // Loading and error states for "My Projects" tab
  const [myProjectsLoading, setMyProjectsLoading] = useState(true);
  const [myProjectsError, setMyProjectsError] = useState(null);

  // Configuration for fetching my projects
  let url = "https://pathexplorer-backend.onrender.com/api";
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    params: dashboardData.filterOptionsMyProjects, // 👈 correct way to send query parameters
  };
  // Fetch projects for "My Projects" tab
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

  // Modal controls
  const { modals, openModal, closeModal, toggleModal } = useModalControl({
    skillsFilter: false,
    createProject: false,
    clientsFilter: false,
    rolesFilter: false,
  });

  // Toggle for compatibility view
  const { state: showCompatibility, toggle: toggleCompatibility } =
    useToggleState(false);

  // Setup list page logic
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
    removeClientFilter: dashboardData.removeClientFilter,
    removeRoleFilter: dashboardData.removeRoleFilter,
    baseUrl: "/manager/dashboard",
  });

  // Override toggleViewMode to ensure animation works consistently
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
      }, 50);
    }, 50);
  }, [listPage]);

  // Helper to toggle skills filter modal
  const toggleSkillsFilterModal = () => toggleModal("skillsFilter");
  // Helper to toggle clients filter modals
  const toggleClientsFilterModal = () => toggleModal("clientsFilter");
  // Helper to toggle roles filter modals
  const toggleRolesFilterModal = () => toggleModal("rolesFilter");

  // Function to navigate to applicants page
  const handleViewApplicants = useCallback(() => {
    try {
      navigate("/manager/applicants", { replace: false });
    } catch (error) {
      window.location.href = "/manager/applicants";
    }
  }, [navigate]);

  // Get filtered projects for the current tab
  const getTabProjects = useCallback(() => {
    let filteredProjects;

    switch (listPage.activeTab) {
      case "All":
        // Projects with roles available for the user
        filteredProjects = dashboardData.projects ? dashboardData.projects : [];
        break;
      case "Applied To":
        // Projects where the user has applied to a role
        filteredProjects = dashboardData.projectsApp
          ? dashboardData.projectsApp
          : [];
        break;
      case "My Projects":
        // Projects created by the user
        filteredProjects = myProjectsData ? myProjectsData : [];
        break;
      default:
        filteredProjects = dashboardData.projects;
    }

    return dashboardData.sortProjects(
      filteredProjects,
      listPage.sortOption,
      listPage.activeTab
    );
  }, [
    dashboardData.projects,
    myProjectsData,
    listPage.activeTab,
    listPage.sortOption,
    dashboardData.sortProjects,
  ]);

  // Generate active filters for header
  const getActiveFilters = useCallback(() => {
    const filters = {};
    // Check if there are any skill filters selected
    if (dashboardData.selectedSkillFilters.length > 0) {
      filters.skills = {
        label: "Skill",
        values: dashboardData.selectedSkillFilters,
        color: "rgba(139, 92, 246, 0.2)",
        borderColor: "rgba(139, 92, 246, 0.5)",
      };
    }
    // Check if a client is selected
    if (dashboardData.clientNameSelected !== "Clients") {
      filters.clients = {
        label: "Client",
        values: [dashboardData.clientNameSelected],
        color: "rgba(0, 123, 255, 0.2)",
        borderColor: "rgba(0, 123, 255, 0.5)",
      };
    }
    // Check if a role is selected
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

  // Handle clear filters action
  const handleClearFilters = useCallback(() => {
    dashboardData.clearAllSkillFilters();
    dashboardData.removeRoleFilter();
    dashboardData.removeClientFilter();
    listPage.handleClearFilters();
  }, [dashboardData, listPage]);

  const handleCreateProject = useCallback(() => {
    //add project creation logic
  }, []);

  // Compute flattened projects for display
  const displayProjects = useMemo(() => {
    const tabProjects = getTabProjects();

    if (listPage.activeTab === "All") {
      tabProjects.map((project) => ({
        project: project,
      }));
    }
    //for my projects tab, don't flatten - show each project as one card
    else if (listPage.activeTab === "My Projects") {
      //create project cards without flattening roles
      tabProjects.map((project) => ({
        project: project,
        //no specific role for project-level cards
        isProjectCard: true, //flag to indicate this is a project card, not role card*/
      }));
    } else if (listPage.activeTab === "Applied To") {
      //for applied to tab, flatten roles but keep project structure
      tabProjects.map((project) => ({
        project: project,
        //indicate this is a role card
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
    console.log("displayProjects", displayProjects.length);
    counts["All"] = displayProjects.length;
    counts["Applied To"] = dashboardData.projectsApp.length;

    //for my projects, count actual projects (not flattened roles)
    if (Array.isArray(myProjectsData)) {
      counts["My Projects"] = myProjectsData.length;
    }

    return counts;
  }, [
    displayProjects,
    dashboardData.projects,
    dashboardData.projectsApp,
    myProjectsData,
  ]);

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

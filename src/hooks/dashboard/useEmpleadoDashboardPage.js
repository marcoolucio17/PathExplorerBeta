import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboardData from './useDashboardData';
import useListPage from '../useListPage';
import useModalControl from '../useModalControl';
import useToggleState from '../useToggleState';

/**
 * Employee-specific Dashboard hook
 * Tabs: "All" (no notification badge), "Applied to"
 * 
 * @returns {Object} Complete state and functions for the Employee Dashboard page
 */
export const useEmpleadoDashboardPage = () => {
  const navigate = useNavigate();

  // Get dashboard data
  const dashboardData = useDashboardData();

  // Employee-specific tab names
  const tabNames = ["All", "Applied to"];

  // Get current user ID from localStorage or sessionStorage
  const currentUserId = useMemo(
    () => localStorage.getItem("id") || sessionStorage.getItem("id"),
    []
  );
  // Modal controls
  const { modals, openModal, closeModal, toggleModal } = useModalControl({
    skillsFilter: false,
    viewApplication: false,
  });

  // Toggle for compatibility view
  const { state: showCompatibility, toggle: toggleCompatibility } =
    useToggleState(false);

  // State for selected application to view
  const [selectedApplication, setSelectedApplication] = useState(null);

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
    baseUrl: "/empleado/dashboard",
  });

  // Override toggleViewMode to ensure animation works consistently
  const toggleViewMode = useCallback(() => {
    // Toggle view mode using the original function
    listPage.toggleViewMode();

    // Force animation refresh for the newly displayed items
    setTimeout(() => {
      // Reset any placeholders immediately
      if (listPage.resetAnimation) {
        listPage.resetAnimation();
      }

      // Trigger a full animation sequence after a short delay
      setTimeout(() => {
        if (listPage.triggerAnimationSequence) {
          listPage.triggerAnimationSequence();
        }
      }, 50);
    }, 50);
  }, [listPage]);

  // Helper to toggle skills filter modal
  const toggleSkillsFilterModal = () => {
    toggleModal("skillsFilter");
  };
  const toggleClientsFilterModal = () => toggleModal("clientsFilter");
  const toggleRolesFilterModal = () => toggleModal("rolesFilter");

  // Handle viewing application details
  const handleViewApplication = useCallback((applicationData) => {
    console.log("opening view application modal with data:", applicationData);
    setSelectedApplication(applicationData);
    openModal('viewApplication');
  }, [openModal]);

  // Transform application data to match modal format
  const transformApplicationData = useCallback((appData) => {
    if (!appData) return null;
    
    return {
      id: appData.idaplicacion,
      userId: null, //no user data available in this structure
      name: 'You', //since this is the user viewing their own application
      email: '', //not available in application data
      role: appData.roles?.nombrerol || 'Unknown Role',
      project: appData.proyecto?.pnombre || 'Unknown Project',
      message: appData.message || 'No message provided',
      appliedDate: appData.fechaaplicacion || 'Unknown Date',
      status: appData.estatus || 'Unknown',
      avatar: null //not available
    };
  }, []);

  // Handle closing view application modal
  const handleCloseViewApplication = useCallback(() => {
    closeModal('viewApplication');
    setSelectedApplication(null);
  }, [closeModal]);

  // Get filtered projects for the current tab
  const getTabProjects = useCallback(() => {
    let filteredProjects;

    switch (listPage.activeTab) {
      case "All":
        filteredProjects = dashboardData.projects ? dashboardData.projects : [];
        break;
      case "Applied to":
        // Projects where the user has applied to a role
        // Filter out applications where role has been assigned (RolAsignado)
        filteredProjects = dashboardData.projectsApp
          ? dashboardData.projectsApp.filter(app => app.estatus !== "RolAsignado")
          : [];
        break;
      default:
        filteredProjects = dashboardData.projects;
    }

    return dashboardData.sortProjects(filteredProjects, listPage.sortOption);
  }, [
    dashboardData.projects,
    dashboardData.projectsApp,
    listPage.activeTab,
    listPage.sortOption,
    dashboardData.sortProjects,
  ]);

  // Generate active filters for header
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

  // Handle removing a specific filter
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
    listPage.handleClearFilters();
    dashboardData.removeRoleFilter();
    dashboardData.removeClientFilter();
  }, [dashboardData, listPage]);

  // Compute flattened projects for display
  const displayProjects = useMemo(() => {
    const tabProjects = getTabProjects();
    console.log("computing displayProjects for tab:", listPage.activeTab);
    console.log("tabProjects:", tabProjects);

    if (listPage.activeTab === "All") {
      //use flattenProjectsForList to filter out roles with estado "Aceptado"
      const result = dashboardData.flattenProjectsForList(tabProjects);
      console.log("all tab displayProjects result:", result);
      console.log("all tab displayProjects length:", result.length);
      if (result.length > 0) {
        console.log("first item in result:", result[0]);
        console.log("first item project:", result[0]?.project);
        console.log("first item proyecto_rol:", result[0]?.proyecto_rol);
      }
      return result;
    } else if (listPage.activeTab === "Applied to") {
      //for applied to tab, flatten roles but keep project structure
      console.log("processing applied to tab, count:", tabProjects.length);
      const result = tabProjects.map((project) => ({
        project: project,
        proyecto_rol: null, //indicate this is a role card
        isApplyCard: true, //indicate this is an applied to card
      }));
      console.log("applied to tab displayProjects count:", result.length);
      return result;
    }

    const result = dashboardData.flattenProjectsForList(tabProjects);
    console.log("default tab displayProjects:", result);
    return result;
  }, [dashboardData, getTabProjects, listPage.activeTab]);

  // Determine the loading
  const isLoading = useMemo(() => {
    if (listPage.activeTab === "All") {
      return dashboardData.projectsLoading;
    } else if (listPage.activeTab === "Applied to") {
      return dashboardData.applyLoading;
    }
    return false;
  }, [
    listPage.activeTab,
    dashboardData.projectsLoading,
    dashboardData.applyLoading,
  ]);
  // Get top three projects based on compatibility for HOME
  const getTopProjects = () => {
    let filteredProjects;

    switch (listPage.activeTab) {
      case "All":
        filteredProjects = dashboardData.top;
        break;
      default:
        filteredProjects = dashboardData.top;
    }

    return dashboardData.sortProjects(filteredProjects, listPage.sortOption);
  };

  const topProjects = dashboardData.flattenProjectsForList(getTopProjects());

  // Calculate correct tab counts based on flattened projects
  const correctedTabCounts = useMemo(() => {
    if (!dashboardData.projects || dashboardData.projects.length === 0) {
      return { All: 0, "Applied to": 0 };
    }

    // Initial counts
    const counts = {
      All: 0, // Will be calculated using filtered results
      "Applied to": 0,
    };

    // Calculate flattened projects (roles) for each tab
    // All projects - use same filtering logic as display
    const filteredAllProjects = dashboardData.flattenProjectsForList(dashboardData.projects);
    counts["All"] = filteredAllProjects.length;

    // Applied to projects - exclude RolAsignado status
    counts["Applied to"] = dashboardData.projectsApp.filter(app => app.estatus !== "RolAsignado").length;

    return counts;
  }, [dashboardData.projects, dashboardData.projectsApp, dashboardData.flattenProjectsForList]);

  return {
    ...listPage,
    ...dashboardData,
    displayProjects,
    topProjects,

    tabNames,
    showCompatibility,
    toggleCompatibility,
    modals,
    openModal,
    closeModal,
    toggleSkillsFilterModal,
    getActiveFilters,
    handleRemoveFilter,
    handleClearFilters,
    // Override toggleViewMode with our custom implementation
    toggleViewMode,
    // Override tab counts with our corrected counts
    tabCounts: correctedTabCounts,
    isLoading,
    currentUserId,
    //view application modal
    selectedApplication,
    transformApplicationData,
    handleViewApplication,
    handleCloseViewApplication,
  };
};

export default useEmpleadoDashboardPage;
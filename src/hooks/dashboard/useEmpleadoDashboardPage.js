import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboardData from './useDashboardData';
import useListPage from '../useListPage';
import useModalControl from '../useModalControl';
import useToggleState from '../useToggleState';

/**
 * Employee-specific Dashboard hook
 * Tabs: "All" (no notification badge), "Applied To"
 * 
 * @returns {Object} Complete state and functions for the Employee Dashboard page
 */
export const useEmpleadoDashboardPage = () => {
  const navigate = useNavigate();

  // Get dashboard data
  const dashboardData = useDashboardData();

  // Employee-specific tab names
  const tabNames = ["All", "Applied To"];

  // Get current user ID from localStorage or sessionStorage
  const currentUserId = useMemo(
    () => localStorage.getItem("id") || sessionStorage.getItem("id"),
    []
  );
  // Modal controls
  const { modals, openModal, closeModal, toggleModal } = useModalControl({
    skillsFilter: false,
    viewApplication: false,
    clientsFilter: false,
    rolesFilter: false,

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
    removeClientFilter: dashboardData.removeClientFilter,
    removeRoleFilter: dashboardData.removeRoleFilter,
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
  // Helper to toggle clients filter modals
  const toggleClientsFilterModal = () => toggleModal("clientsFilter");
  // Helper to toggle roles filter modals
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
        // Projects with roles available for the user
        filteredProjects = dashboardData.projects ? dashboardData.projects : [];
        break;
      case "Applied To":
        // Projects where the user has Applied To a role
        // Filter out applications where role has been assigned (RolAsignado)
        filteredProjects = dashboardData.projectsApp
          ? dashboardData.projectsApp
          : [];
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
    listPage.activeTab,
    listPage.sortOption,
    dashboardData.sortProjects,
  ]);

  // Generate active filters for header
  const getActiveFilters = useCallback(() => {
    const filters = {};
    // Check if any skills are selected
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
    dashboardData.removeRoleFilter();
    dashboardData.removeClientFilter();
    listPage.handleClearFilters();
  }, [dashboardData, listPage]);

  // Compute flattened projects for display
  const displayProjects = useMemo(() => {
    const tabProjects = getTabProjects();

    if (listPage.activeTab === "All") {
      return dashboardData.flattenProjectsForList(tabProjects);
    } else if (listPage.activeTab === "Applied To") {
      //for Applied To tab, flatten roles but keep project structure
      return tabProjects.map((project) => ({
        project: project,
        isApplyCard: true, //indicate this is an Applied To card
        idaplicacion: project.idaplicacion,
      }));
    }

    return dashboardData.flattenProjectsForList(tabProjects);
  }, [dashboardData, getTabProjects, listPage.activeTab]);

  // Determine the loading
  const isLoading = useMemo(() => {
    if (listPage.activeTab === "All") {
      return dashboardData.projectsLoading;
    } else if (listPage.activeTab === "Applied To") {
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
    // Initial counts
    const counts = {
      All: 0, // Will be calculated using filtered results
      "Applied To": 0,
    };

    // Calculate flattened projects (roles) for each tab
    // All projects - use same filtering logic as display
    if (listPage.activeTab === "All") {
      counts["All"] = displayProjects.length || 0;
    } else {
      counts["All"] = dashboardData.projects.length || 0;
    }

    counts["Applied To"] = dashboardData.projectsApp.length || 0;

    return counts;
  }, [
    displayProjects,
    dashboardData.projects,
    dashboardData.projectsApp,
    dashboardData.flattenProjectsForList,
  ]);

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
    toggleClientsFilterModal,
    toggleRolesFilterModal,
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
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

  // Get filtered projects for the current tab
  const getTabProjects = useCallback(() => {
    let filteredProjects;

    switch (listPage.activeTab) {
      case "All":
        // Projects with roles available for the user
        filteredProjects = dashboardData.projects ? dashboardData.projects : [];
        break;
      case "Applied to":
        // Projects where the user has applied to a role
        filteredProjects = dashboardData.projectsApp
          ? dashboardData.projectsApp
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
      return tabProjects.map((project) => ({
        project: project,
        proyecto_rol: null,
      }));
    } else if (listPage.activeTab === "Applied to") {
      //for applied to tab, flatten roles but keep project structure
      return tabProjects.map((project) => ({
        project: project,
        proyecto_rol: null, //indicate this is a role card
        isApplyCard: true, //indicate this is an applied to card
      }));
    }

    return dashboardData.flattenProjectsForList(tabProjects);
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
      All: 0, // Will be set to 0 to hide notification badge
      "Applied to": 0,
    };

    // Calculate flattened projects (roles) for each tab
    // All projects - set to 0 to hide notification badge as requested
    counts["All"] = dashboardData.projects.length;

    // Applied to projects
    counts["Applied to"] = dashboardData.projectsApp.length;

    return counts;
  }, [dashboardData.projects, dashboardData.projectsApp]);
  console.log("Corrected tab counts:", correctedTabCounts);
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
  };
};

export default useEmpleadoDashboardPage;
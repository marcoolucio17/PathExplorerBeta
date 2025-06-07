import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../useFetch';
import useListPage from '../useListPage';
import useModalControl from '../useModalControl';
import useToggleState from '../useToggleState';

/**
 * users dashboard hook
 * tabs: "all employees"
 * 
 * @returns {Object} complete state and functions for the users dashboard page
 */
export const useUsersDashboardPage = () => {
  const navigate = useNavigate();
  
  const { data: usuarios, loading: isLoading, error } = useFetch("usuarios/total");
  
  useEffect(() => {
    if (usuarios && usuarios.length > 0) {
      console.log("users data from backend:", usuarios);
      console.log("first user structure:", usuarios[0]);
      console.log("user keys:", Object.keys(usuarios[0]));
    }
  }, [usuarios]);
  
  const tabNames = ['All Employees'];
  
  const { 
    modals, 
    openModal, 
    closeModal, 
    toggleModal 
  } = useModalControl({
    skillsFilter: false,
    roleFilter: false
  });
  
  const { 
    state: showCompatibility,
    toggle: toggleCompatibility 
  } = useToggleState(false);
  

  const listPage = useListPage({
    data: usuarios || [],
    defaultSortOption: 'name_asc',
    defaultViewMode: 'grid',
    tabConfig: { 
      defaultTab: 'All Employees', 
      tabNameField: 'status',
      singleTab: true
    },
    filterConfig: {
      roleField: 'tipo',
      nameField: 'nombre', 
      emailField: 'correoelectronico'
    },
    sortFunction: sortUsers,
    baseUrl: '/employee-dashboard'
  });

  function sortUsers(users, sortOption) {
    if (!users || users.length === 0) return [];
    
    const sortedUsers = [...users];
    
    switch (sortOption) {
      case 'name_asc':
        return sortedUsers.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
      case 'name_desc':
        return sortedUsers.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
      case 'email_asc':
        return sortedUsers.sort((a, b) => (a.correoelectronico || '').localeCompare(b.correoelectronico || ''));
      case 'email_desc':
        return sortedUsers.sort((a, b) => (b.correoelectronico || '').localeCompare(a.correoelectronico || ''));
      case 'role_asc':
        return sortedUsers.sort((a, b) => (a.tipo || '').localeCompare(b.tipo || ''));
      case 'role_desc':
        return sortedUsers.sort((a, b) => (b.tipo || '').localeCompare(a.tipo || ''));
      default:
        return sortedUsers;
    }
  }

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
  
  const toggleSkillsFilterModal = () => {
    toggleModal('skillsFilter');
  };

  const toggleRoleFilterModal = () => {
    toggleModal('roleFilter');
  };

  const handleApplyRoleFilters = (roles) => {
    console.log('Applying role filters:', roles);
    if (listPage.filterStates.setSelectedRoles) {
      listPage.filterStates.setSelectedRoles(roles);
    }
  };
  
  const getTabUsers = () => {
    return listPage.filteredData || usuarios || [];
  };
  
  const getActiveFilters = () => {
    const filters = {};
    
    if (listPage.filterStates.selectedRoles && listPage.filterStates.selectedRoles.length > 0) {
      filters.roles = {
        label: 'Role',
        values: listPage.filterStates.selectedRoles
      };
    }
    
    return filters;
  };
  
  const handleRemoveFilter = (filterType, value) => {
    if (filterType === 'roles' && listPage.filterStates.setSelectedRoles) {
      const currentRoles = listPage.filterStates.selectedRoles || [];
      const newRoles = currentRoles.filter(role => role !== value);
      listPage.filterStates.setSelectedRoles(newRoles);
    }
  };
  
  const handleClearFilters = () => {
    console.log('Clearing all filters');
    if (listPage.filterStates.setSelectedRoles) {
      listPage.filterStates.setSelectedRoles([]);
    }
    listPage.handleClearFilters();
  };
  
  const displayUsers = getTabUsers();
  
  const tabCounts = useMemo(() => {
    return { 'All Employees': usuarios?.length || 0 }; 
  }, [usuarios]);

  useEffect(() => {
    console.log('Current search term:', listPage.searchTerm);
    console.log('Selected roles:', listPage.filterStates?.selectedRoles);
    console.log('Filtered data length:', displayUsers?.length);
  }, [listPage.searchTerm, listPage.filterStates?.selectedRoles, displayUsers]);

  return {
    ...listPage,
    displayProjects: displayUsers, 
    usuarios,
    tabNames,
    activeTab: 'All Employees',
    setActiveTab: () => {}, 
    showCompatibility,
    toggleCompatibility,
    modals,
    openModal,
    closeModal,
    toggleSkillsFilterModal,
    toggleRoleFilterModal,
    getActiveFilters,
    handleRemoveFilter,
    handleClearFilters,
    handleApplyRoleFilters,
    toggleViewMode,
    tabCounts,
    isLoading,
    error,
    userSkills: [],
    selectedSkillFilters: [], 
    calculateMatchPercentage: () => 0 
  };
};

export default useUsersDashboardPage;
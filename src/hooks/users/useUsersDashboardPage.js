import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../useFetch';
import useListPage from '../useListPage';
import useModalControl from '../useModalControl';
import useToggleState from '../useToggleState';

/**
 * users dashboard hook
 * tabs: "all", "active", "inactive"
 * 
 * @returns {Object} complete state and functions for the users dashboard page
 */
export const useUsersDashboardPage = () => {
  const navigate = useNavigate();
  
  //get users data from api
  const { data: usuarios, loading: isLoading, error } = useFetch("usuarios/total");
  
  //debugging: log user data structure
  useEffect(() => {
    if (usuarios && usuarios.length > 0) {
      console.log("users data from backend:", usuarios);
      console.log("first user structure:", usuarios[0]);
      console.log("user keys:", Object.keys(usuarios[0]));
    }
  }, [usuarios]);
  
  //user-specific tab names - only show all
  const tabNames = ['all'];
  
  //modal controls
  const { 
    modals, 
    openModal, 
    closeModal, 
    toggleModal 
  } = useModalControl({
    skillsFilter: false
  });
  
  //toggle for compatibility view (not used for users but keeping for consistency)
  const { 
    state: showCompatibility,
    toggle: toggleCompatibility 
  } = useToggleState(false);
  
  //setup list page logic
  const listPage = useListPage({
    data: usuarios || [],
    defaultSortOption: 'name_asc',
    defaultViewMode: 'grid',
    tabConfig: { 
      defaultTab: 'all', 
      tabNameField: 'status' 
    },
    filterConfig: {},
    sortFunction: sortUsers,
    baseUrl: '/employee-dashboard'
  });
  
  //user sorting function
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
  
  //override toggleViewMode to ensure animation works consistently
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
  
  //helper to toggle skills filter modal
  const toggleSkillsFilterModal = () => {
    toggleModal('skillsFilter');
  };
  
  //get filtered users for the current tab
  const getTabUsers = () => {
    //only show all users, no filtering
    return sortUsers(usuarios || [], listPage.sortOption);
  };
  
  //generate active filters for header
  const getActiveFilters = () => {
    const filters = {};
    //no skill filters for users, keeping for consistency
    return filters;
  };
  
  //handle removing a specific filter
  const handleRemoveFilter = (filterType, value) => {
    //no filters to remove for users
  };
  
  //handle clear filters action
  const handleClearFilters = () => {
    listPage.handleClearFilters();
  };
  
  //compute display users
  const displayUsers = getTabUsers();
  
  //calculate tab counts - set to 0 to hide badges
  const tabCounts = useMemo(() => {
    return { 'all': 0 }; //no badges
  }, [usuarios]);

  return {
    ...listPage,
    displayProjects: displayUsers, //keeping same property name for consistency with components
    usuarios,
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
    toggleViewMode,
    tabCounts,
    isLoading,
    error,
    //user-specific properties
    userSkills: [], //empty for consistency
    selectedSkillFilters: [], //empty for consistency
    calculateMatchPercentage: () => 0 //empty function for consistency
  };
};

export default useUsersDashboardPage;

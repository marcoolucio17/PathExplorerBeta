import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import useModalControl from '../useModalControl';
import useToggleState from '../useToggleState';

/**
 * users dashboard hook - now with backend search like projects
 * tabs: "all employees"
 * 
 * @returns {Object} complete state and functions for the users dashboard page
 */
export const useUsersDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFromURL = searchParams.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(searchFromURL);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('name_asc');
  
  //filter options for backend
  const [filterOptions, setFilterOptions] = useState({});
  
  //update url when search term changes
  useEffect(() => {
    if (searchTerm) {
      const params = new URLSearchParams(location.search);
      params.set("search", searchTerm);
      handleApplyNameFilter(searchTerm);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    } else if (searchFromURL) {
      const params = new URLSearchParams(location.search);
      params.delete("search");
      handleApplyNameFilter();
      navigate(
        `${location.pathname}${
          params.toString() ? `?${params.toString()}` : ""
        }`,
        { replace: true }
      );
    }
  }, [searchTerm, navigate, location.pathname, location.search, searchFromURL]);

  //handle search filtering - similar to projects
  const handleApplyNameFilter = (searchName) => {
    if (searchName && searchName.trim() !== "") {
      setFilterOptions((prev) => ({ ...prev, nombre: searchName.trim() }));
    } else {
      const { nombre, ...rest } = filterOptions;
      setFilterOptions(rest);
    }
  };

  //fetch users with backend filtering
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const url = "https://pathexplorer-backend.onrender.com/api";
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: filterOptions,
        };
        
        console.log("=== FETCHING USERS WITH BACKEND SEARCH ===");
        console.log("Search term:", searchTerm);
        console.log("Filter options:", filterOptions);
        console.log("Request config:", config);
        console.log("Full API URL:", `${url}/usuarios/total`);
        console.log("Query parameters that will be sent:", config.params);
        
        const { data } = await axios.get(`${url}/usuarios/total`, config);
        
        console.log("=== API RESPONSE ===");
        console.log("Users returned from backend:", data);
        console.log("Users count:", data?.length);
        console.log("Search term was:", searchTerm);
        console.log("Expected: should be filtered by nombre =", filterOptions.nombre);
        
        if (data && data.length > 0) {
          console.log("First user structure:", data[0]);
          console.log("User keys:", Object.keys(data[0]));
          console.log("All user names returned:", data.map(u => u.nombre));
        }
        
        setUsuarios(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [filterOptions]);
  
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
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);
  
  const toggleSkillsFilterModal = () => {
    toggleModal('skillsFilter');
  };

  const toggleRoleFilterModal = () => {
    toggleModal('roleFilter');
  };

  const handleApplyRoleFilters = (roles) => {
    console.log('Applying role filters:', roles);
    //implement role filtering if needed
  };
  
  const getActiveFilters = () => {
    const filters = {};
    
    //add active filters here if needed
    
    return filters;
  };
  
  const handleRemoveFilter = (filterType, value) => {
    //implement filter removal if needed
  };
  
  const handleClearFilters = () => {
    console.log('Clearing all filters');
    setSearchTerm("");
  };
  
  //sort and filter the users (fallback if backend doesn't filter)
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = usuarios;
    
    //if we have a search term but backend returned all users, filter on frontend
    if (searchTerm && searchTerm.trim() && usuarios.length > 0) {
      const lowerSearch = searchTerm.toLowerCase().trim();
      console.log("=== FRONTEND FILTERING FALLBACK ===");
      console.log("Filtering frontend for:", lowerSearch);
      
      filtered = usuarios.filter(user => {
        const nombre = (user.nombre || '').toLowerCase();
        const email = (user.correoelectronico || '').toLowerCase();
        const matches = nombre.includes(lowerSearch) || email.includes(lowerSearch);
        
        if (matches) {
          console.log(`✓ MATCH: ${user.nombre} (${user.correoelectronico})`);
        }
        
        return matches;
      });
      
      console.log(`Frontend filtered: ${filtered.length} out of ${usuarios.length} users`);
      console.log("=====================================");
    }
    
    //sort the filtered results
    return sortUsers(filtered, sortOption);
  }, [usuarios, sortOption, searchTerm]);
  
  const tabCounts = useMemo(() => {
    return { 'All Employees': filteredAndSortedUsers?.length || 0 }; 
  }, [filteredAndSortedUsers]);

  return {
    //states
    viewMode,
    searchTerm,
    activeTab: 'All Employees',
    sortOption,
    isLoading,
    
    //data
    displayProjects: filteredAndSortedUsers, //keeping this name for compatibility 
    usuarios,
    tabNames,
    tabCounts,
    
    //functions
    setViewMode,
    toggleViewMode,
    setSortOption,
    setSearchTerm,
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
    error,
    userSkills: [],
    selectedSkillFilters: [], 
    calculateMatchPercentage: () => 0,
    
    //filter states for compatibility
    filterStates: {
      selectedRoles: [],
      setSelectedRoles: () => {},
    }
  };
};

export default useUsersDashboardPage;
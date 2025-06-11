import { useState, useEffect, useRef, useMemo } from 'react';
import useListPage from '../useListPage';
import useFetch from '../useFetch';
import axios from 'axios';
import { sortApplicants } from '../../utils/sortApplicants';

export const useApplicantsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const matchPercentagesRef = useRef({});
  
  //stabilize manager id to prevent re-renders and multiple fetches
  const managerId = useMemo(() => {
    return localStorage.getItem("id") || sessionStorage.getItem("id") || 4;
  }, []);
  
  console.log("Using manager ID:", managerId); //debug log
  
  const {
    data: apiData,
    loading: apiLoading,
    error: apiError,
  } = useFetch(`creador/${managerId}/aplicaciones`);
  
  console.log("API Data:", apiData);
  
  const mapStatusToTab = (estatus) => {
    console.log('mapping status:', estatus);
    const statusMap = {
      'Pendiente': 'Pending',
      'Revision': 'In Review', 
      'Asignado': 'Accepted',
      'Rechazado': 'Denied',
      'RolAsignado': null //dont show these in any tab - they should be filtered out
    };
    
    //check if the status exists in the map
    if (statusMap.hasOwnProperty(estatus)) {
      const mapped = statusMap[estatus];
      console.log('mapped to:', mapped);
      return mapped;
    } else {
      //unknown status, default to pending
      console.log('unknown status, defaulting to Pending');
      return 'Pending';
    }
  };
  
  const transformApiData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    console.log('=== RAW BACKEND DATA ===');
    rawData.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.idaplicacion,
        status: item.estatus,
        user: item.usuario?.nombre,
        project: item.nombreproyecto,
        fullItem: item
      });
    });
    console.log('=== END RAW DATA ===');
    
    const transformed = rawData
      .map(item => {
        const mappedStatus = mapStatusToTab(item.estatus);
        console.log(`Processing item ${item.idaplicacion}: ${item.estatus} -> ${mappedStatus}`);
        
        //filter out items that shouldnt be shown (RolAsignado)
        if (mappedStatus === null) {
          console.log('FILTERING OUT item with status:', item.estatus, 'mapped to:', mappedStatus);
          return null;
        }
        
        console.log('KEEPING item with status:', item.estatus, 'mapped to:', mappedStatus);
        
        return {
          id: item.idaplicacion,
          name: item.usuario?.nombre || 'Unknown User',
          email: item.usuario?.correoelectronico || '',
          avatar: item.usuario?.fotodeperfil_url || null,
          profileImage: item.usuario?.fotodeperfil_url || null,
          status: mappedStatus,
          date: item.fechaaplicacion,
          appliedDate: item.fechaaplicacion,
          lastActive: item.fechaaplicacion,
          message: item.message || '',
          project: item.nombreproyecto || 'Unknown Project',
          projectId: item.idproyecto,
          role: item.roles?.nombrerol || 'Unknown Role',
          roleDescription: item.roles?.descripcionrol || '',
          userId: item.idusuario,
          roleId: item.idrol,
          experience: '2+ years',
          skills: ['JavaScript', 'React'],
          compatibility: Math.floor(Math.random() * 101)
        };
      })
      .filter(item => {
        const kept = item !== null;
        console.log('Filter result:', kept ? 'KEPT' : 'REMOVED');
        return kept;
      });
      
    console.log('FINAL TRANSFORMED ITEMS:', transformed.length);
    console.log('FINAL ITEMS:', transformed);
    return transformed;
  };
  
  const finalApplicants = useMemo(() => {
    if (apiLoading) {
      console.log('API still loading...');
      return [];
    }
    if (apiError) {
      console.log('API Error:', apiError);
      return [];
    }
    if (apiData && Array.isArray(apiData)) {
      const transformed = transformApiData(apiData);
      console.log('Using transformed API data:', transformed);
      return transformed;
    }
    console.log('No API data available, using empty array');
    return [];
  }, [apiData, apiLoading, apiError]);

  //calculate tab counts from finalApplicants data like TFS does
  const tabCounts = useMemo(() => {
    const counts = { 'Pending': 0, 'In Review': 0, 'Accepted': 0, 'Denied': 0 };
    
    finalApplicants.forEach(applicant => {
      if (counts.hasOwnProperty(applicant.status)) {
        counts[applicant.status]++;
      }
    });
    
    console.log('Manager Tab counts:', counts);
    return counts;
  }, [finalApplicants]);

  const projectOptions = useMemo(() => {
    const projects = finalApplicants.map(app => app.project).filter(Boolean);
    const uniqueProjects = [...new Set(projects)];
    return ['All Projects', ...uniqueProjects];
  }, [finalApplicants]);
  
  const skillOptions = useMemo(() => {
    const allSkills = finalApplicants.flatMap(app => app.skills || []);
    return [...new Set(allSkills)];
  }, [finalApplicants]);

  //only log debug info once when data changes, not on every render
  useEffect(() => {
    if (!apiLoading && finalApplicants.length > 0) {
      console.log('debug Information for manager:', managerId);
      console.log('Loading:', apiLoading);
      console.log('Error:', apiError);
      console.log('Raw API Data:', apiData);
      console.log('Final Applicants being used:', finalApplicants);
      
      const statusCounts = finalApplicants.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      console.log('Status Distribution:', statusCounts);
      
      const projectCounts = finalApplicants.reduce((acc, item) => {
        acc[item.project] = (acc[item.project] || 0) + 1;
        return acc;
      }, {});
      console.log('Project Distribution:', projectCounts);
      console.log('=== End API Debug ===');
    }
  }, [finalApplicants, apiLoading, apiError, managerId, apiData]);

  const calculateMatchPercentage = (applicant, showCompatibility = true) => {
    if (!applicant || !showCompatibility) return 0;
    
    if (matchPercentagesRef.current[applicant.id] !== undefined) {
      return matchPercentagesRef.current[applicant.id];
    }
    
    const percentage = Math.floor(Math.random() * 101);
    matchPercentagesRef.current[applicant.id] = percentage;
    return percentage;
  };

  const refreshMatchPercentages = () => {
    matchPercentagesRef.current = {};
    finalApplicants.forEach(applicant => {
      if (applicant && applicant.id) {
        matchPercentagesRef.current[applicant.id] = Math.floor(Math.random() * 101);
      }
    });
  };

  const setApplicants = (updater) => {
    console.log('setApplicants called (API data is read-only):', updater);
  };

  const patchApplicationStatus = async (userId, applicationId, newStatus) => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; //format: YYYY-MM-DD
      const url = `https://pathexplorer-backend.onrender.com/api/apps/usuario/${userId}/app/${applicationId}`;
      const response = await axios.patch(url, 
        { 
          estatus: newStatus,
          fechaaplicacion: currentDate
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Status updated successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false, error: error };
    }
  };

  const tabNames = ['Pending', 'In Review', 'Accepted', 'Denied'];

  const listPage = useListPage({
    data: finalApplicants,
    defaultSortOption: 'date_desc',
    defaultViewMode: 'grid',
    tabConfig: { 
      defaultTab: 'Pending', 
      tabNameField: 'status' 
    },
    filterConfig: { 
      skillsField: 'skills', 
      projectField: 'project' 
    },
    sortFunction: sortApplicants,
    baseUrl: '/manager/dashboard'
  });

  //create custom listPage with tab counts
  const customListPage = {
    ...listPage,
    tabCounts, //use our calculated tab counts
  };
  
  useEffect(() => {
    setSearchTerm(customListPage.searchTerm);
  }, [customListPage.searchTerm]);

  useEffect(() => {
    if (customListPage.showCompatibility && !customListPage.compatibilityLoading) {
      refreshMatchPercentages();
    }
  }, [customListPage.showCompatibility, customListPage.compatibilityLoading]);

  const handleAcceptDeniedApplicant = (applicant) => {
    console.log('handleAcceptDeniedApplicant called for:', applicant);
    customListPage.closeModal('denialReason');
  };
  
  const handleAppealDeniedApplicant = (applicant, appealReason) => {
    console.log(`Appeal submitted for ${applicant.name}: ${appealReason}`);
    customListPage.closeModal('denialReason');
  };

  const getActiveFilters = () => {
    const filters = {};
    
    const { selectedProject, selectedSkills } = customListPage.filterStates;
    
    if (selectedProject && selectedProject !== 'All Projects') {
      filters.projects = {
        label: 'Project',
        values: [selectedProject],
        color: 'rgba(74, 158, 204, 0.2)',
        borderColor: 'rgba(74, 158, 204, 0.5)'
      };
    }
    
    if (selectedSkills && selectedSkills.length > 0) {
      filters.skills = {
        label: 'Skill',
        values: selectedSkills,
        color: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 0.5)'
      };
    }
    
    return filters;
  };

  const handleViewApplicant = (applicantId) => {
    console.log('handleViewApplicant called with id:', applicantId);
    const applicant = finalApplicants.find(app => app.id === applicantId);
    console.log('found applicant:', applicant);
    console.log('applicant status:', applicant?.status);
    console.log('modals object:', customListPage.modals);
    
    if (applicant && applicant.status === 'Denied') {
      console.log('opening denialReason modal');
      customListPage.setSelectedItem(applicant);
      customListPage.openModal('denialReason');
    }
    else if (applicant && applicant.status === 'Accepted') {
      console.log('opening assignEmployee modal');
      customListPage.setSelectedItem(applicant);
      customListPage.openModal('assignEmployee');
    } else {
      console.log('opening viewRequest modal');
      customListPage.setSelectedItem(applicant);
      customListPage.openModal('viewRequest');
    }
  };

  const handleViewRequest = (applicantId) => {
    console.log('handleViewRequest called with:', applicantId);
    const applicant = finalApplicants.find(app => app.id === applicantId);
    console.log('found applicant:', applicant);
    customListPage.setSelectedItem(applicant);
    customListPage.openModal('viewRequest');
  };

  //override handleViewItem to prevent unwanted navigation
  const handleViewItem = (itemId) => {
    console.log('handleViewItem blocked for applicants page:', itemId);
    //do nothing - we handle navigation through specific handlers
  };

  const handleAcceptApplicant = async (applicant) => {
    console.log('accept applicant:', applicant);
    
    try {
      const result = await patchApplicationStatus(applicant.userId, applicant.id, 'Revision');
      if (result.success) {
        console.log('Application accepted successfully');
        window.location.reload();
      } else {
        console.error('Failed to accept application');
      }
    } catch (error) {
      console.error('Error accepting application:', error);
    }
    
    customListPage.closeModal('viewRequest');
  };

  const handleDenyApplicant = async (applicant) => {
    console.log('deny applicant:', applicant);
    
    try {
      const result = await patchApplicationStatus(applicant.userId, applicant.id, 'Rechazado');
      if (result.success) {
        console.log('Application denied successfully');
        window.location.reload();
      } else {
        console.error('Failed to deny application');
      }
    } catch (error) {
      console.error('Error denying application:', error);
    }
    
    customListPage.closeModal('viewRequest');
  };

  const handleViewProfile = (applicant) => {
    console.log('view profile:', applicant);
  };

  const handleAssignEmployee = async (applicant) => {
    console.log('assign employee:', applicant);
    
    try {
      const result = await patchApplicationStatus(applicant.userId, applicant.id, 'RolAsignado');
      if (result.success) {
        console.log('Application assigned successfully');
        window.location.reload();
      } else {
        console.error('Failed to assign application');
      }
    } catch (error) {
      console.error('Error assigning application:', error);
    }
    
    customListPage.closeModal('assignEmployee');
  };

  const handleAssignSuccess = () => {
    console.log('=== HANDLE ASSIGN SUCCESS START ===');
    console.log('assignment completed successfully');
    
    //now update the application status to RolAsignado
    const applicant = customListPage.selectedItem;
    if (applicant) {
      console.log('updating application status for:', applicant);
      patchApplicationStatus(applicant.userId, applicant.id, 'RolAsignado')
        .then(result => {
          console.log('patch result:', result);
          if (result.success) {
            console.log('application status updated successfully');
          } else {
            console.error('failed to update application status');
          }
        })
        .catch(error => {
          console.error('error updating application status:', error);
        });
    }
    
    customListPage.closeModal('assignEmployee');
    console.log('=== HANDLE ASSIGN SUCCESS END ===');
  };

  const calculateApplicantMatchPercentage = (applicant) => {
    return calculateMatchPercentage(applicant, customListPage.showCompatibility);
  };

  return {
    ...customListPage,
    projectOptions,
    skillOptions,
    calculateMatchPercentage: calculateApplicantMatchPercentage,
    handleAcceptDeniedApplicant,
    handleAppealDeniedApplicant,
    getActiveFilters,
    handleViewApplicant,
    handleViewRequest,
    handleViewItem,
    handleAcceptApplicant,
    handleDenyApplicant,
    handleViewProfile,
    handleAssignEmployee,
    handleAssignSuccess,
    tabNames,
    apiLoading,
    apiError,
    apiData
  };
};

export default useApplicantsPage;
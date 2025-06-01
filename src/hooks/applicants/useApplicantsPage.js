import { useState, useEffect, useRef, useMemo } from 'react';
import useListPage from '../useListPage';
import useFetch from '../useFetch';
import axios from 'axios';
import { sortApplicants } from '../../utils/sortApplicants';

export const useApplicantsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const matchPercentagesRef = useRef({});
  
  //get actual manager id from storage instead of hardcoded value
  const managerId = localStorage.getItem("id") || sessionStorage.getItem("id") || 4;
  console.log("Using manager ID:", managerId); //debug log
  
  const { data: apiData, loading: apiLoading, error: apiError } = useFetch(`creador/${managerId}/aplicaciones`);
  
  const mapStatusToTab = (estatus) => {
    const statusMap = {
      'Pendiente': 'Pending',
      'Revision': 'In Review', 
      'Asignado': 'Accepted',
      'Rechazado': 'Denied'
    };
    return statusMap[estatus] || 'Pending';
  };
  
  const transformApiData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    return rawData.map(item => ({
      id: item.idaplicacion,
      name: item.usuario?.nombre || 'Unknown User',
      email: item.usuario?.correoelectronico || '',
      avatar: item.usuario?.fotodeperfil_url || null,
      profileImage: item.usuario?.fotodeperfil_url || null,
      status: mapStatusToTab(item.estatus),
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
    }));
  };
  
  useEffect(() => {
    console.log('debug Information for manager:', managerId);
    console.log('Loading:', apiLoading);
    console.log('Error:', apiError);
    console.log('Raw API Data:', apiData);
    console.log('API Data Type:', typeof apiData);
    console.log('Is Array:', Array.isArray(apiData));
    if (apiData) {
      console.log('Data Length:', apiData.length);
      console.log('First Item:', apiData[0]);
      console.log('Data Structure:', Object.keys(apiData[0] || {}));
      
      const transformedData = transformApiData(apiData);
      console.log('=== Transformed Data ===');
      console.log('Transformed Data:', transformedData);
      console.log('First Transformed Item:', transformedData[0]);
      
      if (transformedData[0]) {
        console.log('=== Field Mapping Check ===');
        console.log('Profile Image URL:', transformedData[0].profileImage);
        console.log('Applied Date:', transformedData[0].appliedDate);
        console.log('Project Name:', transformedData[0].project);
        console.log('Role Name:', transformedData[0].role);
        console.log('User Name:', transformedData[0].name);
      }
      
      const statusCounts = transformedData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      console.log('Status Distribution:', statusCounts);
      
      const projectCounts = transformedData.reduce((acc, item) => {
        acc[item.project] = (acc[item.project] || 0) + 1;
        return acc;
      }, {});
      console.log('Project Distribution:', projectCounts);
      console.log('Final Applicants being used:', transformedData);
    }
    console.log('=== End API Debug ===');
  }, [apiData, apiLoading, apiError, managerId]);
  
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

  const projectOptions = useMemo(() => {
    const projects = finalApplicants.map(app => app.project).filter(Boolean);
    const uniqueProjects = [...new Set(projects)];
    return ['All Projects', ...uniqueProjects];
  }, [finalApplicants]);
  
  const skillOptions = useMemo(() => {
    const allSkills = finalApplicants.flatMap(app => app.skills || []);
    return [...new Set(allSkills)];
  }, [finalApplicants]);

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
      const url = `https://pathexplorer-backend.onrender.com/api/apps/usuario/${userId}/app/${applicationId}`;
      const response = await axios.patch(url, 
        { estatus: newStatus },
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
  
  useEffect(() => {
    setSearchTerm(listPage.searchTerm);
  }, [listPage.searchTerm]);

  useEffect(() => {
    if (listPage.showCompatibility && !listPage.compatibilityLoading) {
      refreshMatchPercentages();
    }
  }, [listPage.showCompatibility, listPage.compatibilityLoading]);

  const handleAcceptDeniedApplicant = (applicant) => {
    console.log('handleAcceptDeniedApplicant called for:', applicant);
    listPage.closeModal('denialReason');
  };
  
  const handleAppealDeniedApplicant = (applicant, appealReason) => {
    console.log(`Appeal submitted for ${applicant.name}: ${appealReason}`);
    listPage.closeModal('denialReason');
  };

  const getActiveFilters = () => {
    const filters = {};
    
    const { selectedProject, selectedSkills } = listPage.filterStates;
    
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
    const applicant = finalApplicants.find(app => app.id === applicantId);
    if (applicant && applicant.status === 'Denied') {
      listPage.setSelectedItem(applicant);
      listPage.openModal('denialReason');
    }
    else if (applicant && applicant.status === 'Accepted') {
      listPage.setSelectedItem(applicant);
      listPage.openModal('assign');
    } else {
      listPage.setSelectedItem(applicant);
      listPage.openModal('viewRequest');
    }
  };

  const handleViewRequest = (applicantId) => {
    const applicant = finalApplicants.find(app => app.id === applicantId);
    listPage.setSelectedItem(applicant);
    listPage.openModal('viewRequest');
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
    
    listPage.closeModal('viewRequest');
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
    
    listPage.closeModal('viewRequest');
  };

  const handleViewProfile = (applicant) => {
    console.log('view profile:', applicant);
  };

  const calculateApplicantMatchPercentage = (applicant) => {
    return calculateMatchPercentage(applicant, listPage.showCompatibility);
  };

  return {
    ...listPage,
    projectOptions,
    skillOptions,
    calculateMatchPercentage: calculateApplicantMatchPercentage,
    handleAcceptDeniedApplicant,
    handleAppealDeniedApplicant,
    getActiveFilters,
    handleViewApplicant,
    handleViewRequest,
    handleAcceptApplicant,
    handleDenyApplicant,
    handleViewProfile,
    tabNames,
    apiLoading,
    apiError,
    apiData
  };
};

export default useApplicantsPage;

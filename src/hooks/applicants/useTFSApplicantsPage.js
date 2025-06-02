import { useState, useEffect, useRef, useMemo } from 'react';
import useListPage from '../useListPage';
import useFetch from '../useFetch';
import axios from 'axios';
import { sortApplicants } from '../../utils/sortApplicants';

export const useTFSApplicantsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');
  const matchPercentagesRef = useRef({});
  
  //fetch both endpoints to get accurate tab counts
  const { data: pendingData, loading: pendingLoading, error: pendingError } = useFetch('apps/estatus/Revision');
  const { data: assignmentData, loading: assignmentLoading, error: assignmentError } = useFetch('apps/estatus/Asignado');
  
  //calculate tab counts from both datasets
  const tabCounts = useMemo(() => {
    const counts = { 'Pending': 0, 'Pending Assignment': 0 };
    
    if (pendingData && pendingData.aplicaciones) {
      counts['Pending'] = pendingData.aplicaciones.length;
    }
    
    if (assignmentData && assignmentData.aplicaciones) {
      counts['Pending Assignment'] = assignmentData.aplicaciones.length;
    }
    
    console.log('TFS Tab counts:', counts);
    return counts;
  }, [pendingData, assignmentData]);

  const apiData = activeTab === 'Pending' ? pendingData : assignmentData;
  const apiLoading = activeTab === 'Pending' ? pendingLoading : assignmentLoading;
  const apiError = activeTab === 'Pending' ? pendingError : assignmentError;
  
  const mapStatusToTab = (estatus) => {
    console.log('TFS mapping status:', estatus);
    if (activeTab === 'Pending' && estatus === 'Revision') {
      return 'Pending';
    }
    if (activeTab === 'Pending Assignment' && estatus === 'Asignado') {
      return 'Pending Assignment';
    }
    return null; //shouldnt happen with specific endpoints
  };
  
  const transformApiData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    console.log('=== TFS RAW BACKEND DATA ===');
    rawData.forEach((item, index) => {
      console.log(`TFS Item ${index}:`, {
        id: item.idaplicacion,
        status: item.estatus,
        user: item.usuario?.nombre,
        project: item.nombreproyecto,
        fullItem: item
      });
    });
    console.log('=== END TFS RAW DATA ===');
    
    return rawData
      .map(item => {
        const mappedStatus = mapStatusToTab(item.estatus);
        
        //filter out items that shouldnt be shown
        if (mappedStatus === null) {
          console.log('TFS filtering out item with status:', item.estatus);
          return null;
        }
        
        console.log('TFS keeping item:', item.idaplicacion, 'status:', item.estatus, 'mapped to:', mappedStatus);
        
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
          project: item.proyecto?.nombre || item.nombreproyecto || 'Unknown Project',
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
      .filter(item => item !== null); //remove filtered out items
  };
  
  useEffect(() => {
    console.log('TFS debug Information:');
    console.log('Loading:', apiLoading);
    console.log('Error:', apiError);
    console.log('Raw API Data:', apiData);
    console.log('API Data Type:', typeof apiData);
    console.log('Is Array:', Array.isArray(apiData));
    if (apiData) {
      console.log('Data Length:', apiData.length);
      console.log('First Item:', apiData[0]);
      
      const transformedData = transformApiData(apiData);
      console.log('=== TFS Transformed Data ===');
      console.log('Transformed Data:', transformedData);
      console.log('First Transformed Item:', transformedData[0]);
      
      const statusCounts = transformedData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      console.log('TFS Status Distribution:', statusCounts);
    }
    console.log('=== End TFS API Debug ===');
  }, [apiData, apiLoading, apiError]);
  
  const finalApplicants = useMemo(() => {
    if (apiLoading) {
      console.log('TFS API still loading...');
      return [];
    }
    if (apiError) {
      console.log('TFS API Error:', apiError);
      return [];
    }
    if (apiData) {
      //handle the nested structure {aplicaciones: Array}
      const applicationsArray = apiData.aplicaciones || apiData;
      console.log('TFS Applications array:', applicationsArray);
      
      if (Array.isArray(applicationsArray)) {
        const transformed = transformApiData(applicationsArray);
        console.log('TFS Using transformed API data:', transformed);
        return transformed;
      }
    }
    console.log('TFS No API data available, using empty array');
    return [];
  }, [apiData, apiLoading, apiError, activeTab]);

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

  const patchApplicationStatus = async (userId, applicationId, newStatus) => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; 
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
      
      console.log('TFS Status updated successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('TFS Error updating status:', error);
      return { success: false, error: error };
    }
  };

  //only two tabs for TFS
  const tabNames = ['Pending', 'Pending Assignment'];

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
    baseUrl: '/tfs/dashboard'
  });

  useEffect(() => {
    if (listPage.activeTab !== activeTab) {
      setActiveTab(listPage.activeTab);
    }
  }, [listPage.activeTab]);

  const customListPage = {
    ...listPage,
    activeTab,
    tabCounts, //use our calculated tab counts
    setActiveTab: (tab) => {
      setActiveTab(tab);
      listPage.setActiveTab(tab);
    }
  };
  
  useEffect(() => {
    setSearchTerm(customListPage.searchTerm);
  }, [customListPage.searchTerm]);

  useEffect(() => {
    if (customListPage.showCompatibility && !customListPage.compatibilityLoading) {
      refreshMatchPercentages();
    }
  }, [customListPage.showCompatibility, customListPage.compatibilityLoading]);

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
    console.log('TFS handleViewApplicant called with id:', applicantId);
    const applicant = finalApplicants.find(app => app.id === applicantId);
    console.log('TFS found applicant:', applicant);

    customListPage.setSelectedItem(applicant);
    customListPage.openModal('viewRequest');
  };

  const handleViewRequest = (applicantId) => {
    console.log('TFS handleViewRequest called with:', applicantId);
    const applicant = finalApplicants.find(app => app.id === applicantId);
    console.log('TFS found applicant:', applicant);
    customListPage.setSelectedItem(applicant);
    customListPage.openModal('viewRequest');
  };

  const handleViewItem = (itemId) => {
    console.log('TFS handleViewItem blocked for applicants page:', itemId);
  };

  //TFS can approve applications in "Pending" tab (change Revision -> Asignado)
  const handleAcceptApplicant = async (applicant) => {
    console.log('TFS accept applicant:', applicant);
    
    try {
      const result = await patchApplicationStatus(applicant.userId, applicant.id, 'Asignado');
      if (result.success) {
        console.log('TFS Application accepted successfully');
        window.location.reload();
      } else {
        console.error('TFS Failed to accept application');
      }
    } catch (error) {
      console.error('TFS Error accepting application:', error);
    }
    
    customListPage.closeModal('viewRequest');
  };

  //TFS can deny applications in "Pending" tab (change Revision -> Rechazado)
  const handleDenyApplicant = async (applicant) => {
    console.log('TFS deny applicant:', applicant);
    
    try {
      const result = await patchApplicationStatus(applicant.userId, applicant.id, 'Rechazado');
      if (result.success) {
        console.log('TFS Application denied successfully');
        window.location.reload();
      } else {
        console.error('TFS Failed to deny application');
      }
    } catch (error) {
      console.error('TFS Error denying application:', error);
    }
    
    customListPage.closeModal('viewRequest');
  };

  const handleViewProfile = (applicant) => {
    console.log('TFS view profile:', applicant);
  };

  const calculateApplicantMatchPercentage = (applicant) => {
    return calculateMatchPercentage(applicant, listPage.showCompatibility);
  };

  return {
    ...customListPage,
    projectOptions,
    skillOptions,
    calculateMatchPercentage: calculateApplicantMatchPercentage,
    getActiveFilters,
    handleViewApplicant,
    handleViewRequest,
    handleViewItem,
    handleAcceptApplicant,
    handleDenyApplicant,
    handleViewProfile,
    tabNames,
    apiLoading,
    apiError,
    apiData
  };
};

export default useTFSApplicantsPage;
import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * 
 * @param {string} projectId - The ID of the project
 * @param {string} userId - The ID of the user applying
 * @param {object} projectData - The project data containing available roles
 */
const useProjectApplication = (projectId, userId, projectData = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApplied, setIsApplied] = useState(false);

  const submitApplication = useCallback(async (applicationData) => {
    setIsLoading(true);
    setError(null);

    try {
      
      let roleId = 1; //default fallback
      
      console.log('=== DEBUG: Role Mapping ===');
      console.log('Project data available roles:', projectData?.availableRoles);
      console.log('Selected role from form:', applicationData.role);
      
      if (projectData?.availableRoles && applicationData.role) {
        console.log('Looking for role match...');
        
        const selectedRole = projectData.availableRoles.find(role => {
          const roleName = role.name || role;
          console.log(`Comparing "${roleName}" with "${applicationData.role}"`);
          return roleName === applicationData.role;
        });
        
        console.log('Found role:', selectedRole);
        
        if (selectedRole && selectedRole.id) {
          roleId = selectedRole.id;
          console.log('Using role ID:', roleId);
        } else {
          console.log('No role ID found, using default:', roleId);
        }
      } else {
        console.log('No project data or role selection available');
      }
      console.log('========================');

      const applicationPayload = {
        idusuario: parseInt(userId),
        idproyecto: parseInt(projectId),
        idrol: roleId,
        message: applicationData.reason,
      };

      console.log('=== DEBUG: Application Submission ===');
      console.log('Raw applicationData:', applicationData);
      console.log('userId:', userId, 'typeof:', typeof userId);
      console.log('projectId:', projectId, 'typeof:', typeof projectId);
      console.log('Final payload:', applicationPayload);
      console.log('Token exists:', !!localStorage.getItem("token"));
      console.log('=====================================');

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        'https://pathexplorer-backend.onrender.com/api/apps', 
        applicationPayload,
        config
      );

      //if successful, mark as applied
      setIsApplied(true);
      
      return {
        success: true,
        data: response.data
      };

    } catch (err) {
      console.log('=== DEBUG: Error Details ===');
      console.log('Error response:', err.response);
      console.log('Error response data:', err.response?.data);
      console.log('Error response status:', err.response?.status);
      console.log('Error response headers:', err.response?.headers);
      console.log('Error message:', err.message);
      console.log('============================');

      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit application';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [projectId, userId]);

  const resetApplication = useCallback(() => {
    setIsApplied(false);
    setError(null);
  }, []);

  return {
    submitApplication,
    resetApplication,
    isLoading,
    error,
    isApplied
  };
};

export default useProjectApplication;
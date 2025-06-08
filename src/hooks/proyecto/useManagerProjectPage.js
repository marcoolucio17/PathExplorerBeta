import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../useFetch';
import usePost from '../usePost';
import useModalControl from '../useModalControl';
import axios from 'axios';

/**
 * calculate progress based on start and end dates
 */
function calculateProgress(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end.getTime() - start.getTime();
  if (total <= 0) return 100; 
  const elapsed = now.getTime() - start.getTime();

  return Math.round((elapsed / total) * 100);
}

/**
 * format date for display
 */
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; 
  return date.toLocaleDateString();
}

/**
 * transform backend project data for manager view
 */
function transformManagerProject(projectData) {
  if (!projectData) {
    console.log('projectData is not available');
    return null;
  }

  let project;
  if (Array.isArray(projectData)) {
    if (projectData.length === 0) {
      return null;
    }
    project = projectData[0];
  } else {
    project = projectData;
  }

  return {
    idproyecto: project.idproyecto,
    pnombre: project.pnombre,
    descripcion: project.descripcion,
    fechainicio: formatDate(project.fechainicio),
    fechafin: formatDate(project.fechafin),
    fechacreacion: formatDate(project.fechacreacion),
    progreso: calculateProgress(project.fechainicio, project.fechafin),
    //deliverables from the /completo endpoint
    deliverables: project.projectdeliverables
      ? project.projectdeliverables.split(',').map((d) => d.trim())
      : [],
    //client info
    cliente: {
      nombre: project.cliente?.clnombre || "Unknown Client",
      logo: project.cliente?.fotodecliente_url || null,
    },
    //roles info for display
    roles: project.proyecto_roles || [],
    //rfp file info
    rfpfile: project.rfpfile,
    rfpfile_url: project.rfpfile_url,
  };
}

/**
 * custom hook for manager project page functionality
 * handles fetching project users and assigning feedback
 */
export const useManagerProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  console.log("useManagerProjectPage loaded with projectId:", projectId);
  
  //state
  const [selectedUser, setSelectedUser] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  //fetch complete project data using /completo endpoint
  const { data: projectCompleteData, loading: projectLoading, error: projectError } = useFetch(
    projectId ? `${projectId}/completo` : null
  );

  //transform the complete project data for manager view
  const projectData = projectCompleteData ? transformManagerProject(projectCompleteData) : null;

  //fetch users assigned to this project (keep existing functionality)
  const { data: projectUsers, loading: usersLoading, error: usersError } = useFetch(
    projectId ? `usuarios/proyecto/${projectId}` : null
  );

  console.log("Hook state:", { 
    projectId, 
    projectCompleteData,
    projectData, 
    projectUsers, 
    projectLoading, 
    usersLoading, 
    projectError, 
    usersError 
  });

  //post hook for feedback assignment
  const { triggerPost } = usePost();

  //debugging
  useEffect(() => {
    if (projectUsers) {
      console.log("project users data:", projectUsers);
    }
    if (projectData) {
      console.log("transformed project data:", projectData);
    }
    if (projectCompleteData) {
      console.log("raw project complete data:", projectCompleteData);
    }
  }, [projectUsers, projectData, projectCompleteData]);

  //modal controls
  const { 
    modals, 
    openModal, 
    closeModal 
  } = useModalControl({
    feedback: false,
    editProject: false
  });

  //handle assign feedback to user
  const handleAssignFeedback = useCallback((user) => {
    console.log("assigning feedback to user:", user);
    setSelectedUser(user);
    openModal('feedback');
  }, [openModal]);

  //handle feedback submission
  const handleSubmitFeedback = useCallback(async (feedbackData) => {
    if (!selectedUser || !projectId) {
      console.error("missing user or project data for feedback submission");
      return;
    }

    setFeedbackLoading(true);
    
    try {
      const payload = {
        idusuario: selectedUser.idusuario,
        idproyecto: parseInt(projectId),
        feedback: feedbackData.feedback,
        rating: feedbackData.rating
      };

      console.log("submitting feedback payload:", payload);

      const response = await triggerPost('feedback/asignar', payload);

      console.log("feedback assignment response:", response);

      //close modal and reset state
      closeModal('feedback');
      setSelectedUser(null);
      
      //optionally show success message
      alert('Feedback assigned successfully!');

    } catch (error) {
      console.error("error assigning feedback:", error);
      alert('Error assigning feedback. Please try again.');
    } finally {
      setFeedbackLoading(false);
    }
  }, [selectedUser, projectId, triggerPost, closeModal]);

  //handle back to dashboard
  const handleBackToDashboard = useCallback(() => {
    navigate('/manager/dashboard');
  }, [navigate]);

  //handle refresh data
  const handleRefreshData = useCallback(() => {
    //trigger re-fetch by navigating to same route
    window.location.reload();
  }, []);

  //handle delete role
  const handleDeleteRole = useCallback(async (roleId) => {
    if (!projectId || !roleId) {
      console.error("missing project id or role id for deletion");
      return;
    }

    const confirmDelete = window.confirm("are you sure you want to delete this role? this action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://pathexplorer-backend.onrender.com/api/delete-proyecto-rol/${projectId}/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      console.log("role deletion response:", response.data);
      alert("role deleted successfully!");
      
      //refresh the page to show updated data
      handleRefreshData();

    } catch (error) {
      console.error("error deleting role:", error);
      console.log("error response:", error.response?.data);
      alert("error deleting role. please try again.");
    }
  }, [projectId, handleRefreshData]);

  //handle update project (callback for when project is updated)
  const handleUpdateProject = useCallback(() => {
    //refresh the page to show updated data
    handleRefreshData();
  }, [handleRefreshData]);

  //combined loading state
  const isLoading = projectLoading || usersLoading;
  const error = projectError || usersError;

  return {
    projectData,
    projectUsers,
    selectedUser,
    isLoading,
    error,
    feedbackLoading,
    modals,
    openModal,
    closeModal,
    handleAssignFeedback,
    handleSubmitFeedback,
    handleBackToDashboard,
    handleRefreshData,
    handleDeleteRole,
    handleUpdateProject
  };
};

export default useManagerProjectPage;

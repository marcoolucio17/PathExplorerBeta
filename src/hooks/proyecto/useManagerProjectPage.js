import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../useFetch';
import usePost from '../usePost';
import useModalControl from '../useModalControl';

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

  //fetch project data - comment out for now since endpoint might not exist
  // const { data: projectData, loading: projectLoading, error: projectError } = useFetch(
  //   projectId ? `projects/${projectId}` : null
  // );
  
  //temporary mock project data until we have the right endpoint
  const projectData = projectId ? { 
    pnombre: `Project ${projectId}`,
    descripcion: 'Project description will be loaded from the correct endpoint.',
    progreso: 75,
    fechacreacion: '2023-01-01'
  } : null;
  const projectLoading = false;
  const projectError = null;

  //fetch users assigned to this project
  const { data: projectUsers, loading: usersLoading, error: usersError } = useFetch(
    projectId ? `usuarios/proyecto/${projectId}` : null
  );

  console.log("Hook state:", { 
    projectId, 
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
      console.log("project data:", projectData);
    }
  }, [projectUsers, projectData]);

  //modal controls
  const { 
    modals, 
    openModal, 
    closeModal 
  } = useModalControl({
    feedback: false
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
    handleRefreshData
  };
};

export default useManagerProjectPage;

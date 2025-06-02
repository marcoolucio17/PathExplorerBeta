import React, { useState, useEffect } from 'react';
import modalStyles from 'src/styles/Modals/Modal.module.css';
import styles from './ApplicationModal.module.css';
import CustomScrollbar from '../../CustomScrollbar';
import usePost from '../../../hooks/usePost';

export const ApplicationModal = ({ 
  isOpen, 
  onClose, 
  projectData,
  onSubmitApplication,
  isLoading = false
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { triggerPost, loading: postLoading, error: postError } = usePost();
  
  //form state
  const [selectedRole, setSelectedRole] = useState('');
  const [applicationReason, setApplicationReason] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      //reset form
      setSelectedRole('');
      setApplicationReason('');
      setFormErrors({});
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!selectedRole.trim()) {
      errors.role = 'Please select a role';
    }
    
    if (!applicationReason.trim()) {
      errors.reason = 'Please provide a reason for applying';
    } else if (applicationReason.trim().length < 20) {
      errors.reason = 'Please provide at least 20 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    //get user id from localStorage
    const userId = localStorage.getItem('id') || localStorage.getItem('idusuario') || localStorage.getItem('user_id');
    
    //find the selected role id
    const selectedRoleObj = projectData?.availableRoles?.find(role => 
      (typeof role === 'object' ? role.name : role) === selectedRole
    );
    const roleId = selectedRoleObj?.id;

    const today = new Date();
    const fechaaplicacion = today.toISOString().split('T')[0];

    const applicationData = {
      idusuario: parseInt(userId),
      idrol: parseInt(roleId),
      estatus: "Pendiente",
      fechaaplicacion: fechaaplicacion,
      message: applicationReason.trim()
    };

    console.log('Sending application data:', applicationData);

    try {
      const result = await triggerPost('apps', applicationData);
      console.log('Application response:', result);
      
      if (result) {
        //call the parent callback if provided
        if (onSubmitApplication) {
          onSubmitApplication(applicationData);
        }
        handleClose();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const availableRoles = projectData?.availableRoles || [
    'Frontend Developer',
    'Backend Developer', 
    'UI/UX Designer',
    'Project Manager',
    'QA Engineer',
    'DevOps Engineer'
  ];

  const isSubmitting = postLoading || isLoading;

  return (
    <div
      className={`${modalStyles.modalBackdrop} ${isClosing ? modalStyles.closing : ''}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`${modalStyles.modalContent} ${isClosing ? modalStyles.closing : ''}`}
        style={{ maxWidth: '600px' }}
      >
        <button className={modalStyles.closeButton} onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.title}>Apply to {projectData?.title}</h2>
          <p className={modalStyles.subtitle}>Tell us about your interest in this project</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={modalStyles.modalBody} style={{ height: 'calc(100% - 200px)' }}>
            <CustomScrollbar fadeBackground="transparent" fadeHeight={40} showHorizontalScroll={false}>
              <div className={styles.applicationContent}>
                {/*role selection*/}
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>
                    <i className="bi bi-person-badge"></i>
                    Role you're applying for *
                  </label>
                  <select 
                    className={`${styles.formSelect} ${formErrors.role ? styles.error : ''}`}
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">Select a role...</option>
                    {availableRoles.map((role, index) => (
                      <option key={index} value={typeof role === 'object' ? role.name : role}>
                        {typeof role === 'object' ? (
                          role.available !== false ? role.name : `${role.name} (Not Available)`
                        ) : role}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <span className={styles.errorText}>{formErrors.role}</span>
                  )}
                </div>

                {/*application reason*/}
                <div className={styles.formSection}>
                  <label className={styles.formLabel}>
                    <i className="bi bi-chat-text"></i>
                    Why do you want to join this project? *
                  </label>
                  <textarea 
                    className={`${styles.formTextarea} ${formErrors.reason ? styles.error : ''}`}
                    placeholder="Explain why you're interested in this project, what you can contribute, and what you hope to learn..."
                    rows={6}
                    value={applicationReason}
                    onChange={(e) => setApplicationReason(e.target.value)}
                    maxLength={500}
                  />
                  <div className={styles.characterCount}>
                    {applicationReason.length} / 500 characters
                    {formErrors.reason && (
                      <span className={styles.errorText}>{formErrors.reason}</span>
                    )}
                  </div>
                </div>

                {/*error display*/}
                {postError && (
                  <div className={styles.errorSection}>
                    <i className="bi bi-exclamation-triangle"></i>
                    <span>Failed to submit application. Please try again.</span>
                  </div>
                )}
              </div>
            </CustomScrollbar>
          </div>

          <div className={modalStyles.buttonGroup} style={{ borderTop: '1px solid var(--border-light)', padding: '1.5rem' }}>
            <button 
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className={modalStyles.secondaryButton}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={modalStyles.primaryButton}
            >
              {isSubmitting && <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}></i>}
              {isSubmitting ? 'Submitting...' : 'Apply to Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
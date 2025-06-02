import React, { useState } from 'react';
import usePost from '../../../hooks/usePost';
import modalStyles from 'src/styles/Modals/Modal.module.css';

const AssignEmployeeModal = ({ isOpen, onClose, applicant, onDeny, onAssignSuccess }) => {
  const { triggerPost, loading, error } = usePost();
  const [isAssigning, setIsAssigning] = useState(false);

  if (!isOpen || !applicant) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAssign = async () => {
    setIsAssigning(true);
    console.log('=== ASSIGN EMPLOYEE START ===');
    console.log('assigning employee:', applicant);

    try {
      //make the assignment post request
      const assignmentData = {
        message: "Aplicación asignada exitosamente.",
        idproyecto: applicant.projectId,
        idusuario: applicant.userId,
        idrol: applicant.roleId
      };

      console.log('sending assignment data:', assignmentData);
      console.log('making POST to: aplicacion/' + applicant.id + '/aceptar');
      
      const result = await triggerPost(`aplicacion/${applicant.id}/aceptar`, assignmentData);
      
      console.log('POST response:', result);
      console.log('POST error:', error);
      console.log('POST loading:', loading);
      
      if (result && !error) {
        console.log('assignment successful, calling onAssignSuccess');
        onAssignSuccess();
        onClose();
        //dont reload page immediately, let the patch happen first
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('assignment failed:', error);
      }
    } catch (err) {
      console.error('error in handleAssign:', err);
    } finally {
      setIsAssigning(false);
      console.log('=== ASSIGN EMPLOYEE END ===');
    }
  };

  const handleDeny = () => {
    console.log('denying assignment for:', applicant);
    onDeny(applicant);
    onClose();
  };

  return (
    <div className={modalStyles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={modalStyles.modalContent}>
        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.title}>Assign Employee</h2>
          <button className={modalStyles.closeButton} onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className={modalStyles.modalBody}>
          {/*assignment confirmation section*/}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              padding: '2rem',
              background: 'var(--modal-input-bg)', 
              borderRadius: '12px',
              border: '1px solid var(--modal-input-border)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <i className="bi bi-person-check" style={{ 
                fontSize: '3rem',
                color: 'var(--success-color, #22c55e)',
                marginBottom: '1.5rem'
              }}></i>
              
              <h3 style={{ 
                margin: '0 0 1rem 0', 
                color: 'var(--text-light)',
                fontFamily: 'var(--btn-font-family)',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                Assign Employee Confirmation
              </h3>
              
              <p style={{ 
                margin: '0 0 1.5rem 0', 
                color: 'var(--text-light)',
                fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                maxWidth: '400px'
              }}>
                Are you sure you want to assign <strong>{applicant.name}</strong> to the <strong>{applicant.role}</strong> role in the <strong>{applicant.project}</strong> project?
              </p>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem',
                width: '100%',
                maxWidth: '300px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border-light)'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Employee:</span>
                  <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>{applicant.name}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border-light)'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Project:</span>
                  <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>{applicant.project}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '0.5rem 0'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Role:</span>
                  <span style={{ color: 'var(--text-light)', fontWeight: '500' }}>{applicant.role}</span>
                </div>
              </div>

              {error && (
                <div style={{ 
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'var(--error-bg, rgba(239, 68, 68, 0.1))',
                  borderRadius: '8px',
                  border: '1px solid var(--error-color, #ef4444)',
                  width: '100%'
                }}>
                  <span style={{ 
                    color: 'var(--error-color, #ef4444)',
                    fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '0.9rem'
                  }}>
                    <i className="bi bi-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
                    Error assigning employee. Please try again.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={modalStyles.buttonGroup} style={{ borderTop: '1px solid var(--border-light)', padding: '1.5rem' }}>
          <button 
            className={modalStyles.cancelButton}
            onClick={handleDeny}
            disabled={isAssigning || loading}
          >
            <i className="bi bi-x-circle"></i>
            Deny
          </button>
          <button 
            className={modalStyles.primaryButton}
            onClick={handleAssign}
            disabled={isAssigning || loading}
          >
            {isAssigning || loading ? (
              <>
                <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}></i>
                Assigning...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle"></i>
                Assign
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignEmployeeModal;
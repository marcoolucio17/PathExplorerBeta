import React, { useEffect } from 'react';
import useFetch from '../../../hooks/useFetch';
import modalStyles from 'src/styles/Modals/Modal.module.css';

const ViewApplicationModal = ({ isOpen, onClose, applicant, onAccept, onDeny, onViewProfile, readOnly = false }) => {
  //fetch feedback data using user id - only when userId is properly defined
  const { data: feedbackData, loading: feedbackLoading, error: feedbackError } = useFetch(
    (applicant && applicant.userId) ? `feedback/${applicant.userId}` : null
  );

  //debug feedback fetching
  useEffect(() => {
    console.log('=== Fdebug ===');
    console.log('Modal isOpen:', isOpen);
    console.log('Applicant exists:', !!applicant);
    console.log('Applicant:', applicant);
    
    if (applicant) {
      console.log('Application ID (applicant.id):', applicant.id);
      console.log('User ID (applicant.userId):', applicant.userId);
      console.log('User ID type:', typeof applicant.userId);
      console.log('User ID isbeing returned:', !!applicant.userId);
      
      if (applicant.userId) {
        const fullUrl = `https://pathexplorer-backend.onrender.com/api/feedback/${applicant.userId}`;
        console.log('Feedback endpoint path:', `feedback/${applicant.userId}`);
        console.log('Full URL being called:', fullUrl);
      } else {
        console.log('user id is missing');
      }
    }
    
    console.log('Feedback loading:', feedbackLoading);
    console.log('Feedback error:', feedbackError);
    console.log('Feedback data:', feedbackData);
    
    if (feedbackError) {
      console.log('Error details:', feedbackError.response?.data);
      console.log('Error status:', feedbackError.response?.status);
      console.log('Error URL from config:', feedbackError.config?.url);
    }
    console.log('====================');
  }, [isOpen, applicant, feedbackLoading, feedbackError, feedbackData]);

  if (!isOpen || !applicant) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  //check if this is a read-only view (In Review or Denied status)
  const isReadOnly = applicant.status === 'In Review' || applicant.status === 'Denied';

  return (
    <div className={modalStyles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={modalStyles.modalContent}>
        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.title}>
            {applicant.status === 'In Review' ? 'Application Review' : 
             applicant.status === 'Denied' ? 'Denied Application' : 
             'Application Request'}
          </h2>
          <button className={modalStyles.closeButton} onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className={modalStyles.modalBody}>
          {/*applicant info section*/}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-light)', 
              marginBottom: '1rem',
              fontFamily: 'var(--btn-font-family)',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Applicant Information
            </h3>
            <div style={{ 
              padding: '1.5rem',
              background: 'var(--modal-input-bg)', 
              borderRadius: '12px',
              border: '1px solid var(--modal-input-border)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <img 
                src={applicant.avatar || "/img/default-avatar.png"} 
                alt={applicant.name}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  marginBottom: '1rem'
                }}
              />
              <div style={{ width: '100%' }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: 'var(--text-light)',
                  fontFamily: 'var(--btn-font-family)',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  {applicant.name}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-muted)',
                    fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '0.95rem'
                  }}>
                    <i className="bi bi-envelope" style={{ marginRight: '0.5rem' }}></i>
                    {applicant.email}
                  </p>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-light)',
                    fontFamily: 'Graphik Medium, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '1rem'
                  }}>
                    <i className="bi bi-person-badge" style={{ marginRight: '0.5rem' }}></i>
                    Applied for: {applicant.role}
                  </p>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-light)',
                    fontFamily: 'Graphik Medium, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '1rem'
                  }}>
                    <i className="bi bi-folder" style={{ marginRight: '0.5rem' }}></i>
                    Project: {applicant.project}
                  </p>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-muted)',
                    fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '0.9rem'
                  }}>
                    <i className="bi bi-calendar" style={{ marginRight: '0.5rem' }}></i>
                    Applied on: {applicant.appliedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/*application message*/}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              color: 'var(--text-light)', 
              marginBottom: '1rem',
              fontFamily: 'var(--btn-font-family)',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Application Message
            </h3>
            <div style={{ 
              padding: '1.5rem', 
              background: 'var(--modal-input-bg)', 
              borderRadius: '12px',
              border: '1px solid var(--modal-input-border)',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ 
                margin: 0, 
                color: 'var(--text-light)',
                fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                {applicant.message || 'No message provided'}
              </p>
            </div>
          </div>

          {/*feedback section*/}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ 
              color: 'var(--text-light)', 
              marginBottom: '1rem',
              fontFamily: 'var(--btn-font-family)',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Previous Feedback
            </h3>
            {feedbackLoading && (
              <div style={{ 
                justifyContent: 'center', 
                padding: '2rem',
                background: 'var(--modal-input-bg)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid var(--modal-input-border)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="bi bi-arrow-clockwise" style={{ 
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.5rem',
                  color: 'var(--text-muted)'
                }}></i>
                <span style={{ 
                  color: 'var(--text-muted)',
                  fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Loading feedback...
                </span>
              </div>
            )}
            {feedbackError && (
              <div style={{ 
                padding: '1.5rem',
                background: 'var(--modal-input-bg)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid var(--modal-input-border)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="bi bi-exclamation-triangle" style={{ 
                  marginRight: '0.5rem',
                  color: 'var(--error-color, #ff6b6b)'
                }}></i>
                <span style={{ 
                  color: 'var(--error-color, #ff6b6b)',
                  fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif'
                }}>
                  Error loading feedback
                </span>
              </div>
            )}
            {feedbackData && !feedbackLoading && !feedbackError && (
              <div>
                {feedbackData.feedbacks && Array.isArray(feedbackData.feedbacks) && feedbackData.feedbacks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {feedbackData.feedbacks.map((feedback, index) => (
                      <div key={index} style={{ 
                        padding: '1.5rem',
                        background: 'var(--modal-input-bg)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: '1px solid var(--modal-input-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="bi bi-chat-square-text" style={{ color: 'var(--modal-accent, #8b92ff)' }}></i>
                            <span style={{ 
                              color: 'var(--text-light)',
                              fontFamily: 'var(--btn-font-family)',
                              fontSize: '0.9rem',
                              fontWeight: '600'
                            }}>
                              Feedback
                            </span>
                          </div>
                          {feedback.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <i className="bi bi-star-fill" style={{ color: '#ffd700', fontSize: '0.9rem' }}></i>
                              <span style={{ 
                                color: 'var(--text-light)',
                                fontFamily: 'var(--btn-font-family)',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                              }}>
                                {feedback.rating}/10
                              </span>
                            </div>
                          )}
                        </div>
                        <p style={{ 
                          margin: '0 0 0.75rem 0', 
                          color: 'var(--text-light)',
                          fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif',
                          fontSize: '1rem',
                          lineHeight: '1.6'
                        }}>
                          {feedback.feedback}
                        </p>
                        <small style={{ 
                          color: 'var(--text-muted)',
                          fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif',
                          fontSize: '0.85rem'
                        }}>
                          <i className="bi bi-calendar3" style={{ marginRight: '0.5rem' }}></i>
                          {feedback.fecha}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    padding: '2rem',
                    background: 'var(--modal-input-bg)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid var(--modal-input-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <i className="bi bi-chat-square" style={{ 
                      fontSize: '2rem',
                      color: 'var(--text-muted)',
                      marginBottom: '0.75rem'
                    }}></i>
                    <span style={{ 
                      color: 'var(--text-muted)',
                      fontFamily: 'Graphik Regular, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontSize: '1rem'
                    }}>
                      No feedback available
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={modalStyles.buttonGroup} style={{ borderTop: '1px solid var(--border-light)', padding: '1.5rem' }}>
          {isReadOnly ? (
            //read-only mode for In Review applications
            <button 
              className={modalStyles.primaryButton}
              onClick={onClose}
              style={{ width: '100%' }}
            >
              <i className="bi bi-x"></i>
              Close
            </button>
          ) : (
            //normal mode with action buttons
            <>
              <button 
                className={modalStyles.secondaryButton}
                onClick={() => onViewProfile(applicant)}
              >
                <i className="bi bi-person"></i>
                View Profile
              </button>
              <button 
                className={modalStyles.primaryButton}
                onClick={() => onAccept(applicant)}
              >
                <i className="bi bi-check-circle"></i>
                Accept
              </button>
              <button 
                className={modalStyles.cancelButton}
                onClick={() => onDeny(applicant)}
              >
                <i className="bi bi-x-circle"></i>
                Deny
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicationModal;
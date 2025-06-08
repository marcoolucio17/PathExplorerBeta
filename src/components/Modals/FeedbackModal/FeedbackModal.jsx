import React, { useState, useEffect } from 'react';
import modalStyles from '../../../styles/Modals/Modal.module.css';
import styles from './FeedbackModal.module.css';

/**
 * modal for assigning feedback to team members
 * matches the api structure and styling of applicationmodal
 */
export const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  selectedUser, 
  projectData, 
  onSubmitFeedback, 
  isLoading 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      //reset form
      setFeedback('');
      setRating(5);
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
    
    if (!feedback.trim()) {
      errors.feedback = 'Please enter feedback text';
    } else if (feedback.trim().length < 10) {
      errors.feedback = 'Please provide at least 10 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted');
    
    if (!validateForm()) {
      return;
    }

    const feedbackData = {
      feedback: feedback.trim(),
      rating: rating
    };

    console.log('Submitting feedback:', feedbackData);
    
    try {
      await onSubmitFeedback(feedbackData);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <div
      className={`${modalStyles.modalBackdrop} ${isClosing ? modalStyles.closing : ''}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`${modalStyles.modalContent} ${isClosing ? modalStyles.closing : ''}`}
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={modalStyles.closeButton} onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.title}>Assign Feedback</h2>
          <p className={modalStyles.subtitle}>Provide feedback for {selectedUser?.nombre}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={modalStyles.modalBody}>
            <div className={styles.feedbackContent}>
              {/* User Info */}
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {selectedUser?.fotodeperfil_url ? (
                    <img 
                      src={selectedUser.fotodeperfil_url} 
                      alt={selectedUser.nombre}
                      className={styles.avatarImg}
                    />
                  ) : (
                    <i className="bi bi-person-circle" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  )}
                </div>
                <div className={styles.userDetails}>
                  <h3>{selectedUser?.nombre}</h3>
                  <p>{selectedUser?.correoelectronico}</p>
                  <span className={styles.userType}>{selectedUser?.tipo}</span>
                </div>
              </div>

              {/* Project Info */}
              <div className={styles.projectInfo}>
                <h4>Project: {projectData?.pnombre || 'Unknown Project'}</h4>
              </div>

              {/* Rating */}
              <div className={styles.formSection}>
                <label className={styles.formLabel}>
                  <i className="bi bi-star-fill"></i>
                  Rating (1-10)
                </label>
                <div className={styles.ratingContainer}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className={styles.ratingSlider}
                  />
                  <span className={styles.ratingValue}>{rating}</span>
                </div>
              </div>

              {/* Feedback Text */}
              <div className={styles.formSection}>
                <label className={styles.formLabel}>
                  <i className="bi bi-chat-dots"></i>
                  Feedback *
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Excelente trabajo, cumplió todos los entregables..."
                  className={`${styles.formTextarea} ${formErrors.feedback ? styles.error : ''}`}
                  rows="4"
                  maxLength={500}
                />
                <div className={styles.characterCount}>
                  {feedback.length} / 500 characters
                  {formErrors.feedback && (
                    <span className={styles.errorText}>{formErrors.feedback}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={modalStyles.buttonGroup} style={{ borderTop: '1px solid var(--border-light)', padding: '1.5rem' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className={modalStyles.secondaryButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={modalStyles.primaryButton}
            >
              {isLoading && <i className="bi bi-arrow-clockwise" style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}></i>}
              {isLoading ? 'Assigning...' : 'Assign Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;

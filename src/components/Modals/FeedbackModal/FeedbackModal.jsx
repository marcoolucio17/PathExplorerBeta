import React, { useState } from 'react';
import { GlassCard } from '../../shared/GlassCard';
import Button from '../../shared/Button';
import styles from '../../../styles/Modals/FeedbackModal.module.css';

/**
 * modal for assigning feedback to team members
 * matches the api structure from the endpoint
 */
export const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  selectedUser, 
  projectData, 
  onSubmitFeedback, 
  isLoading 
}) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      alert('Please enter feedback text');
      return;
    }

    onSubmitFeedback({
      feedback: feedback.trim(),
      rating: rating
    });

    //reset form
    setFeedback('');
    setRating(5);
  };

  const handleClose = () => {
    setFeedback('');
    setRating(5);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <GlassCard className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Assign Feedback</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className={styles.modalBody}>
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

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className={styles.feedbackForm}>
            {/* Rating */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <i className="bi bi-star-fill"></i>
                Rating (1-9)
              </label>
              <div className={styles.ratingContainer}>
                <input
                  type="range"
                  min="1"
                  max="9"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className={styles.ratingSlider}
                />
                <span className={styles.ratingValue}>{rating}</span>
              </div>
            </div>

            {/* Feedback Text */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <i className="bi bi-chat-dots"></i>
                Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Excelente trabajo, cumplió todos los entregables..."
                className={styles.feedbackTextarea}
                rows="4"
                required
              />
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <Button
                type="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isLoading}
                isLoading={isLoading}
                icon={isLoading ? "bi-arrow-clockwise" : "bi-send"}
              >
                {isLoading ? "Assigning..." : "Assign Feedback"}
              </Button>
            </div>
          </form>
        </div>
      </GlassCard>
    </div>
  );
};

export default FeedbackModal;

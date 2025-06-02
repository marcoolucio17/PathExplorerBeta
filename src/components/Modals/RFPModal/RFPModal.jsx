import React, { useState, useEffect } from 'react';
import styles from 'src/styles/Modals/Modal.module.css';

export const RFPModal = ({ isOpen, onClose, projectData }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsVisible(false);
      setIsClosing(false);
    }, 300); // match animation duration
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleDownload = () => {
    if (projectData?.rfpfile_url) {
      const link = document.createElement('a');
      link.href = projectData.rfpfile_url;
      link.download = projectData.rfpfile || 'project-rfp.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNewTab = () => {
    if (projectData?.rfpfile_url) {
      window.open(projectData.rfpfile_url, '_blank');
    }
  };

  return (
    <div 
      className={`${styles.modalBackdrop} ${isClosing ? styles.closing : ''}`} 
      onClick={handleBackdropClick}
    >
      <div className={`${styles.modalContent} ${isClosing ? styles.closing : ''}`} style={{ maxWidth: '900px' }}>
        <button className={styles.closeButton} onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Request for Proposal (RFP)</h2>
          <p className={styles.subtitle}>{projectData?.title || 'Project Requirements'}</p>
        </div>

        <div className={styles.modalBody} style={{ 
          flex: '1',
          minHeight: '0',
          height: 'calc(100% - 200px)',
          padding: '0',
          overflow: 'auto'
        }}>
          {projectData?.rfpfile_url ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: 'min-content',
              padding: '1rem'
            }}>
              <iframe 
                src={projectData.rfpfile_url}
                style={{
                  width: '100%',
                  height: '1000px',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  background: 'var(--modal-input-bg)',
                  boxShadow: 'var(--shadow-card)'
                }}
                title="RFP Document"
              />
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>No RFP Available</h3>
              <p style={{ color: 'var(--text-muted)' }}>This project doesn't have an RFP document attached.</p>
            </div>
          )}
        </div>

        <div className={styles.buttonGroup} style={{ borderTop: '1px solid var(--border-light)', padding: '1.5rem' }}>
          {projectData?.rfpfile_url ? (
            <>
              <button 
                onClick={handleDownload} 
                className={styles.primaryButton}
              >
                <i className="bi bi-download"></i>
                Download RFP
              </button>
              
              <button 
                onClick={handleOpenInNewTab} 
                className={styles.secondaryButton}
              >
                <i className="bi bi-box-arrow-up-right"></i>
                Open in New Tab
              </button>
            </>
          ) : (
            <button 
              onClick={handleClose} 
              className={styles.secondaryButton}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
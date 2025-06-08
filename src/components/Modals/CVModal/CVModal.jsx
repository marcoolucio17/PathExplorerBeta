import React, { useState, useEffect } from 'react';
import styles from 'src/styles/Modals/Modal.module.css';
import ModalScrollbar from 'src/components/Modals/ModalScrollbar';
import axios from 'axios';
import usePost from 'src/hooks/usePost';
import useFetch from 'src/hooks/useFetch';
import useGetFetch from 'src/hooks/useGetFetch';
import { Spinner } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';

export const CVModal = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { triggerPost, loading, error } = usePost();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [uploadAlert, setUploadAlert] = useState("");

  const { data, errorcv, loadingcv, refetch } = useFetch(
    "cv-url/" + localStorage.getItem("id")
  );

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
    }, 300); // Match animation duration
  };

  //const [cvFile, setCvFile] = useState(null);
  //const [fotoFile, setFotoFile] = useState(null);

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Solo base64
      reader.onerror = reject;
    });


  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

const handleDownload = async () => {
  try {
    const response = await fetch(data.url); // or your actual fetch URL
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "Curriculum_Vitae.pdf"; // file name to save as
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl); // Clean up
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

  const handleCVUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";


    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file); // adjust the key to match backend expectations
      formData.append("idusuario", localStorage.getItem('id'))
      try {
        triggerPost(`upload-cv/${localStorage.getItem('id')}`, formData)
        setTimeout(() => {
          refetch();
          setIsLoading(false);
        }, 2000);
        }
      catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed.");
        
      }
    };
    input.click();
  };

  const handleCVUploadWithAI = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";


    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsLoading2(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("idusuario", localStorage.getItem('id'));

      try {
        const result = await triggerPost("analizar-cv", formData);
        console.log("Resultado del análisis:", result);
        refetch();
        setIsLoading2(false);
        setUploadAlert("Changes were made automatically to your profile. Make sure to verify them.");
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed.");
      }
    };

    input.click();
  };

  console.log(data);


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
          <h2 className={styles.title}>Curriculum Vitae</h2>
          <p className={styles.subtitle}>Professional Resume</p>
        </div>

        <div className={styles.modalBody} style={{
          flex: '1',
          minHeight: '0',
          height: 'calc(100% - 200px)',
          padding: '0',
          overflow: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            minHeight: 'min-content',
            padding: '1rem'
          }}>
            {loadingcv ? (
              <p>Loading CV...</p>
            ) : errorcv ? (
              <p>Error loading CV.</p>
            ) : (
              <iframe
                src={data?.url}
                style={{
                  width: '100%',
                  height: '1000px',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  background: 'var(--modal-input-bg)',
                  boxShadow: 'var(--shadow-card)'
                }}
                title="Curriculum Vitae"
              />
            )}
          </div>
        </div>

        <div className={styles.buttonGroup} style={{ borderTop: '1px solid var(--border-light)', padding: '1.5rem' }}>
          <button
            onClick={handleDownload}
            className={styles.primaryButton}
          >
            <i className="bi bi-download"></i>
            Download CV
          </button>

          <button
            onClick={handleCVUpload}
            className={styles.secondaryButton}
            disabled={isLoading}
          >
            <i className="bi bi-upload"></i>
            Upload New
            {isLoading && (
            <Spinner
              animation="border"
              role="status"
              size="sm"
              className="ms-2"
            >
              <span className="visually-hidden">Uploading CV...</span>
            </Spinner>
            )}
          </button>

          <button
            onClick={handleCVUploadWithAI}
            className={styles.generateButton}
            disabled={isLoading2}
          >
            <i className="bi bi-upload"></i>
            Upload New With AI ✨
            {isLoading2 && (
            <Spinner
              animation="border"
              role="status"
              size="sm"
              className="ms-2"
            >
              <span className="visually-hidden">Uploading CV...</span>
            </Spinner>
            )}
          </button>
        </div>
      </div>
      {uploadAlert && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1050,
            width: 'auto',
            maxWidth: '90%',
          }}
        >
          <Alert
            variant="success"
            dismissible
            onClose={() => setUploadAlert("")}
            style={{ padding: '0.75rem 1.25rem', borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            {uploadAlert}
          </Alert>
        </div>
      )}
    </div>
  );
};
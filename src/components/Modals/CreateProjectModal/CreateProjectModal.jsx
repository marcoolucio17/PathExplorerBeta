import React, { useState, useEffect } from 'react';
import styles from 'src/styles/Modals/Modal.module.css';
import ModalScrollbar from 'src/components/Modals/ModalScrollbar';
import { usePost } from 'src/hooks/usePost';
import axios from 'axios';

export const CreateProjectModal = ({ isOpen, onClose }) => {
  const { triggerPost, loading, error } = usePost();
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    skills: '',
    description: '',
    startDate: '',
    endDate: '',
    roles: '',
    clientImage: null,
    RfpPreview: null,
    imagePreview: null,
    projectRFP: null
  });

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
      // Reset form
      setFormData({
        title: '',
        clientName: '',
        skills: '',
        description: '',
        startDate: '',
        endDate: '',
        roles: '',
        clientImage: null,
        RfpPreview: null,
        imagePreview: null,
        projectRFP: null
      });
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleRFPChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("RFP seleccionado:", file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          projectRFP: file,
          RfpPreview: reader.result 
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClientImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          clientImage: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatDate = (dateString) => {
      if (!dateString) return '';

      // Detecta si viene en formato DD/MM/YYYY
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      // Si no es DD/MM/YYYY, intenta convertir con Date
      const date = new Date(dateString);
      if (isNaN(date)) return ''; // Fecha inválida

      return date.toISOString().split('T')[0];
    };

    const informacion = {

      proyect: {
        pnombre: formData.title,
        descripcion: formData.description,
        fechainicio: formatDate(formData.startDate),
        fechafin: formatDate(formData.endDate),
        idcliente: 1, // Harcodeado
        idusuario: localStorage.getItem("id")
      },
      roles: [  //  Harcodeado
        {
          nombrerol: "Rol automático",
          nivelrol: 1,
          descripcionrol: "Generado automáticamente",
          disponible: true,
          requerimientos: [
            {
              tiempoexperiencia: "1 año",
              idhabilidad: 1
            }
          ]
        }
      ]

    };

    try {
      // Paso 1: Crear el proyecto
      const result = await triggerPost('api/projects', { informacion });
      const idproyecto = result?.idproyecto;
      console.log(idproyecto);
      if (!idproyecto) {
        alert("El proyecto fue creado pero no se recibió un ID.");
        return;
      }

      const token = localStorage.getItem("token");
      console.log("Archivo RFP:", formData.projectRFP?.name);
      // Paso 2: Subir el archivo RFP
      if (formData.projectRFP) {
        const rfpForm = new FormData();
        console.log("Archivo RFP:", formData.projectRFP);
        rfpForm.append('file', formData.projectRFP);
        rfpForm.append('projectId', idproyecto);

        await axios.post('http://localhost:8080/api/upload-rfp', rfpForm, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Finalizar
      alert("Proyecto creado con éxito.");
      handleClose();

    } catch (err) {
      console.error("Error al crear proyecto o subir archivos:", err);
      alert("Ocurrió un error al guardar el proyecto.");
    }
  };


  const isFormValid = () => {
    const hasRequiredFields =
      formData.title &&
      formData.clientName &&
      formData.startDate;

    const hasFiles =
      formData.projectRFP !== null &&
      formData.clientImage !== null;

    return hasRequiredFields && hasFiles;
  };

  return (
    <div
      className={`${styles.modalBackdrop} ${isClosing ? styles.closing : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`${styles.modalContent} ${isClosing ? styles.closing : ''}`} style={{ maxWidth: '1200px' }}>
        <button className={styles.closeButton} onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Create Project</h2>
          <p className={styles.subtitle}>Upload and add details for your project</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className={styles.modalBody} style={{ height: 'calc(100% - 190px)' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div className={styles.uploadSection}>
                  <div className={styles.uploadSection}>
                    <label className={styles.uploadLabel} htmlFor="projectoPlan">
                      {formData.RfpPreview ? (
                        <>
                          {formData.projectRFP?.type === 'application/pdf' ? (
                            <iframe
                              src={formData.RfpPreview}
                              style={{ width: '500px', height: '300px' }}
                              title="RFP Preview"
                            />
                          ) : (
                            <p>Archivo seleccionado: {formData.projectRFP.name}</p>
                          )}

                          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <button
                              type="button"
                              className={styles.cancelButton}
                              onClick={() =>
                                setFormData(prev => ({
                                  ...prev,
                                  projectRFP: null,
                                  RfpPreview: null
                                }))
                              }
                            >
                              Quitar archivo
                            </button>
                            <label className={styles.secondaryButton}>
                              Cambiar archivo
                              <input
                                type="file"
                                id="projectoPlan"
                                accept=".pdf,.doc,.docx"
                                onChange={handleRFPChange}
                                className={styles.fileInput}
                                style={{ display: 'none' }}
                              />
                            </label>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles.uploadPlaceholder} style={{ width: '500px', height: '500px' }}>
                            <i className="bi bi-cloud-upload"></i>
                            <span>Click to upload project RFP</span>
                          </div>
                          <input
                            type="file"
                            id="projectoPlan"
                            accept=".pdf,.doc,.docx"
                            onChange={handleRFPChange}
                            className={styles.fileInput}
                          />
                        </>
                      )}
                    </label>
                  </div>

                  <input
                    type="file"
                    id="projectoPlan"
                    accept=".pdf,.doc,.docx"
                    onChange={handleRFPChange}
                    className={styles.fileInput}
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles.uploadSection} style={{ marginBottom: '2rem' }}>
                  <label className={styles.uploadLabel} htmlFor="clientImage">
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        alt="Client preview"
                        className={styles.uploadPreview}
                        style={{ width: '150px', height: '150px' }}
                      />
                    ) : (
                      <div className={styles.uploadPlaceholder} style={{ width: '150px', height: '150px' }}>
                        <i className="bi bi-cloud-upload"></i>
                        <span>Click to upload client logo</span>
                      </div>
                    )}
                  </label>
                  <input
                    type="file"
                    id="clientImage"
                    accept="image/*"
                    onChange={handleClientImageChange}
                    className={styles.fileInput}
                  />
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="title">Project Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Whirlpool Quality Assurance"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="clientName">Client Name *</label>
                    <input
                      type="text"
                      id="clientName"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      placeholder="e.g. Whirlpool"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="skills">Skills</label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="e.g. JavaScript, Project Management"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description">Description *</label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="What is your project about?"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="startDate">Start Date *</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="endDate">Estimated End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={styles.saveButton}
            >
              <i className="bi bi-plus-lg"></i>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
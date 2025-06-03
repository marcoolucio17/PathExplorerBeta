import React, { useState, useEffect } from 'react';
import styles from './ManagerCreateProjectPage.module.css';
import { usePost } from 'src/hooks/usePost';
import axios from 'axios';
import useFetch from 'src/hooks/useFetch';
import { useNavigate } from "react-router";
import { GlassCard } from 'src/components/shared/GlassCard';
import Button from 'src/components/shared/Button';

export const ManagerCreateProjectPage = () => {
  const { triggerPost, loading, error } = usePost();
  const { data: clientes, loading: loadingClientes } = useFetch("clientes");
  const [clientImageUrl, setClientImageUrl] = useState(null);
  const { data: habilidades } = useFetch("habilidades");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    skills: '',
    description: '',
    startDate: '',
    endDate: '',
    roles: [],
    clientImage: null,
    RfpPreview: null,
    imagePreview: null,
    projectRFP: null
  });

  const handleClientSelect = async (e) => {
    const selectedId = parseInt(e.target.value);

    if (!selectedId) {
      setFormData(prev => ({
        ...prev,
        clientName: '',
        idcliente: null
      }));
      setClientImageUrl(null);
      return;
    }

    const selectedCliente = clientes.find(c => c.idcliente === selectedId);
    if (!selectedCliente) return; //por si acaso

    setFormData(prev => ({
      ...prev,
      clientName: selectedCliente.clnombre,
      idcliente: selectedId
    }));

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/clientes/${selectedId}/foto`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.fotodecliente_url) {
        setClientImageUrl(res.data.fotodecliente_url);
      } else {
        setClientImageUrl(null);
      }
    } catch (err) {
      console.error("Error cargando imagen del cliente:", err);
      setClientImageUrl(null);
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

  const handleAddRequerimiento = (roleIndex) => {
    const updatedRoles = [...formData.roles];
    updatedRoles[roleIndex].requerimientos.push({
      tiempoexperiencia: '',
      idhabilidad: ''
    });
    setFormData(prev => ({ ...prev, roles: updatedRoles }));
  };

  const handleRemoveRequerimiento = (roleIndex, reqIndex) => {
    const updatedRoles = [...formData.roles];
    updatedRoles[roleIndex].requerimientos.splice(reqIndex, 1);
    setFormData(prev => ({ ...prev, roles: updatedRoles }));
  };

  const handleRequerimientoChange = (roleIndex, reqIndex, field, value) => {
    const updatedRoles = [...formData.roles];
    updatedRoles[roleIndex].requerimientos[reqIndex][field] = value;
    setFormData(prev => ({ ...prev, roles: updatedRoles }));
  };

  const handleAddRole = () => {
    setFormData(prev => ({
      ...prev,
      roles: [
        ...prev.roles,
        {
          nombrerol: '',
          nivelrol: '',
          descripcionrol: '',
          disponible: true,
          requerimientos: [
            {
              tiempoexperiencia: '',
              idhabilidad: 1 //puedes luego hacer esto dinámico
            }
          ]
        }
      ]
    }));
  };

  const handleRemoveRole = (index) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index)
    }));
  };

  const handleRoleChange = (index, field, value) => {
    const updatedRoles = [...formData.roles];
    updatedRoles[index][field] = value;
    setFormData(prev => ({
      ...prev,
      roles: updatedRoles
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formatDate = (dateString) => {
      if (!dateString) return '';

      //detecta si viene en formato DD/MM/YYYY
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      //si no es DD/MM/YYYY, intenta convertir con Date
      const date = new Date(dateString);
      if (isNaN(date)) return ''; //fecha inválida

      return date.toISOString().split('T')[0];
    };

    const informacion = {
      proyect: {
        pnombre: formData.title,
        descripcion: formData.description,
        fechainicio: formatDate(formData.startDate),
        fechafin: formatDate(formData.endDate),
        idcliente: formData.idcliente,
        idusuario: localStorage.getItem("id")
      },
      roles: formData.roles.map((rol) => ({
        nombrerol: rol.nombrerol,
        nivelrol: parseInt(rol.nivelrol),
        descripcionrol: rol.descripcionrol,
        disponible: true, //o puedes hacer esto editable si quieres
        requerimientos: rol.requerimientos || []
      }))
    };

    try {
      //paso 1: crear el proyecto
      const result = await triggerPost('api/projects', { informacion });
      const idproyecto = result?.idproyecto;
      console.log(idproyecto);
      if (!idproyecto) {
        alert("El proyecto fue creado pero no se recibió un ID.");
        return;
      }

      const token = localStorage.getItem("token");
      console.log("Archivo RFP:", formData.projectRFP?.name);
      //paso 2: subir el archivo RFP
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

      //finalizar
      alert("Proyecto creado con éxito.");
      navigate('/manager/dashboard');

    } catch (err) {
      console.error("Error al crear proyecto o subir archivos:", err);
      alert("Ocurrió un error al guardar el proyecto.");
    }
  };

  const isFormValid = () => {
    const hasRequiredFields =
      formData.title &&
      formData.clientName &&
      formData.projectRFP !== null &&
      formData.startDate;

    return hasRequiredFields;
  };

  return (
    <div className={styles.createProjectContainer}>
      <div className={styles.createProjectContent}>
        {/* Left Column - Main Form */}
        <div className={styles.formDetails}>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Create Project</h1>
              <p className={styles.pageSubtitle}>Upload and add details for your project</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className={styles.formContent}>
              {/* Basic Information */}
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Basic Information</h2>
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
                    <label htmlFor="clientSelect">Client *</label>
                    <select
                      id="clientSelect"
                      name="idcliente"
                      onChange={handleClientSelect}
                      required
                      value={formData.idcliente || ''}
                    >
                      <option value="">Select a client</option>
                      {clientes?.map(cliente => (
                        <option key={cliente.idcliente} value={cliente.idcliente}>
                          {cliente.clnombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="What is your project about?"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
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

              {/* Project Roles */}
              <div className={styles.formSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className={styles.sectionTitle}>Project Roles</h2>
                  <button 
                    type="button" 
                    onClick={handleAddRole} 
                    className={styles.addButton}
                  >
                    <i className="bi bi-plus-lg"></i>
                    Add Role
                  </button>
                </div>

                {formData.roles.map((rol, index) => (
                  <div key={index} className={styles.roleCard}>
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(index)}
                      className={styles.removeRoleButton}
                    >
                      ×
                    </button>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Role Name</label>
                        <input
                          type="text"
                          value={rol.nombrerol}
                          onChange={(e) => handleRoleChange(index, 'nombrerol', e.target.value)}
                          placeholder="e.g. Frontend Developer"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Role Level</label>
                        <input
                          type="number"
                          value={rol.nivelrol}
                          onChange={(e) => handleRoleChange(index, 'nivelrol', e.target.value)}
                          placeholder="1-5"
                          min="1"
                          max="5"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea
                        value={rol.descripcionrol}
                        onChange={(e) => handleRoleChange(index, 'descripcionrol', e.target.value)}
                        placeholder="Describe the role responsibilities..."
                        rows="2"
                      />
                    </div>

                    {/* Skills Requirements */}
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ color: 'var(--text-light)', margin: 0 }}>Required Skills</h4>
                        <button
                          type="button"
                          onClick={() => handleAddRequerimiento(index)}
                          className={styles.addButton}
                          style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                        >
                          <i className="bi bi-plus"></i>
                          Add Skill
                        </button>
                      </div>

                      {rol.requerimientos?.map((req, reqIndex) => (
                        <div key={reqIndex} className={styles.requirementCard}>
                          <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                              <label>Skill</label>
                              <select
                                value={req.idhabilidad}
                                onChange={(e) =>
                                  handleRequerimientoChange(index, reqIndex, 'idhabilidad', e.target.value)
                                }
                              >
                                <option value="">Select a skill</option>
                                {[...habilidades || []]
                                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                                  .map((hab) => (
                                    <option key={hab.idhabilidad} value={hab.idhabilidad}>
                                      {hab.nombre}
                                    </option>
                                  ))}
                              </select>
                            </div>

                            <div className={styles.formGroup}>
                              <label>Experience Time</label>
                              <select
                                value={req.tiempoexperiencia}
                                onChange={(e) =>
                                  handleRequerimientoChange(index, reqIndex, 'tiempoexperiencia', e.target.value)
                                }
                              >
                                <option value="">Select experience</option>
                                <option>3 months</option>
                                <option>6 months</option>
                                <option>1 year</option>
                                <option>2 years</option>
                                <option>3 years</option>
                                <option>4 years</option>
                                <option>5 years</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveRequerimiento(index, reqIndex)}
                            className={styles.removeButton}
                            style={{ marginTop: '0.5rem' }}
                          >
                            Remove Skill
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button 
                type="button"
                className={styles.cancelButton} 
                onClick={() => navigate('/manager/dashboard')}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isFormValid()}
                className={styles.submitButton}
              >
                <i className="bi bi-plus-lg"></i>
                Create Project
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Upload Sidebar */}
        <div className={styles.uploadSidebar}>
          {/* RFP Upload Card */}
          <GlassCard className={`${styles.uploadCard} ${styles.rfpUploadCard}`}>
            <div className={styles.uploadSection}>
              <h3 className={styles.uploadCardTitle}>Project RFP</h3>
              <label className={styles.uploadLabel} htmlFor="projectoPlan">
                {formData.RfpPreview ? (
                  <>
                    {formData.projectRFP?.type === 'application/pdf' ? (
                      <iframe
                        src={formData.RfpPreview}
                        style={{ width: '100%', height: '200px', borderRadius: '8px' }}
                        title="RFP Preview"
                      />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                        <p style={{ color: 'var(--text-light)', margin: 0 }}>
                          {formData.projectRFP.name}
                        </p>
                      </div>
                    )}

                    <div className={styles.fileActions}>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            projectRFP: null,
                            RfpPreview: null
                          }))
                        }
                      >
                        Remove
                      </button>
                      <label className={styles.addButton} style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}>
                        Change File
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleRFPChange}
                          className={styles.fileInput}
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <div className={styles.uploadPlaceholder} style={{ height: '100%', minHeight: '200px' }}>
                    <i className="bi bi-cloud-upload"></i>
                    <span>Click to upload project RFP</span>
                    <small style={{ fontSize: '0.8rem', opacity: 0.7 }}>PDF, DOC, DOCX files</small>
                  </div>
                )}
              </label>
              <input
                type="file"
                id="projectoPlan"
                accept=".pdf,.doc,.docx"
                onChange={handleRFPChange}
                className={styles.fileInput}
              />
            </div>
          </GlassCard>

          {/* Client Logo Card */}
          <GlassCard className={`${styles.uploadCard} ${styles.clientUploadCard}`}>
            <div className={styles.uploadSection}>
              <h3 className={styles.uploadCardTitle}>Client Logo</h3>
              <div style={{ textAlign: 'center' }}>
                {clientImageUrl ? (
                  <img
                    src={clientImageUrl}
                    alt="Client logo"
                    className={styles.uploadPreview}
                    style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                  />
                ) : (
                  <div className={styles.uploadPlaceholder} style={{ width: '120px', height: '120px', margin: '0 auto' }}>
                    <i className="bi bi-building"></i>
                    <span style={{ fontSize: '0.8rem' }}>No logo available</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ManagerCreateProjectPage;
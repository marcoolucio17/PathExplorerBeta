import React, { useState, useEffect } from "react";
import styles from "src/styles/Modals/Modal.module.css";
import modalStyles from "./EditContactModal.module.css";

import axios from "axios";

const DB_URL = "https://pathexplorer-backend.onrender.com/";
// const DB_URL = "http://localhost:8080/";

export const EditContactModal = ({ isOpen, onClose, contactInfo, onSave, setLoad }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      // Populate form with current data
      setFormData({
        email: contactInfo?.email || "",
        phone: contactInfo?.phone || "",
        linkedin: contactInfo?.linkedin || "",
        github: contactInfo?.github || "",
      });
    }
  }, [isOpen, contactInfo]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      // For now, use the callback to update local state
      const updateData = {
        linkedin: formData.linkedin,
        github: formData.github,
        telefono: formData.phone
      };

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const locRes = await axios.patch(
        DB_URL + "api/usuario/" + localStorage.getItem("id"),
        updateData,
        config
      );

      window.location.reload();

      handleClose();
    } catch (error) {
      console.error("Error updating contact info:", error);
      // TODO: Add error handling UI
    }
    setLoad(false);
  };

  const isFormValid = () => {
    return formData.email && formData.phone;
  };

  return (
    <div
      className={`${styles.modalBackdrop} ${isClosing ? styles.closing : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.closing : ""}`}
      >
        <button className={styles.closeButton} onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Edit Contact Information</h2>
          <p className={styles.subtitle}>Update your contact details</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.modalBody}>
            {/* <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@company.com"
                required
              />
            </div> */}

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+52 81 1234 5678"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="linkedin">LinkedIn Profile</label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="your-profile"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="github">GitHub Profile</label>
              <input
                type="text"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="your-username"
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
            >
              <i className="bi bi-x-lg"></i>
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={styles.saveButton}
              // todo: add on click or sm
            >
              <i className="bi bi-check-lg"></i>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

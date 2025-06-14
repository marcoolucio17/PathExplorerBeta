import React, { useState, useEffect } from "react";
import styles from "src/styles/Modals/Modal.module.css";
import modalStyles from "./EditProfileDetailsModal.module.css";
import useFetch from "src/hooks/useFetch";

import axios from "axios";

const DB_URL = "https://pathexplorer-backend.onrender.com/";
// const DB_URL = "http://localhost:8080/";

export const EditProfileDetailsModal = ({
  isOpen,
  onClose,
  profileData,
  onSave,
  setLoad
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    profilePicture: null,
    imagePreview: null,
  });
  const [image, setImage] = useState();

  const { data, loading, error } = useFetch(
    "profile-url/" + localStorage.getItem("id")
  );

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      // Populate form with current data
      setFormData({
        location: profileData?.location || "",
        profilePicture: null,
        imagePreview:
          profileData?.avatarUrl || profileData?.profilePicture || null,
      });
      setPreviewImage(data.url || profileData?.profilePicture || "");
    }
  }, [isOpen, profileData]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: file,
          imagePreview: reader.result,
        }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const updateData = {
        ubicacion: formData.location,
      };

      if (image) {
        const formData1 = new FormData();
        formData1.append("file", image);
        const res = await axios.post(
          DB_URL + "api/upload-profile/" + localStorage.getItem("id"),
          formData1,
          config
        );
      }

      const locRes = await axios.patch(
        DB_URL + "api/usuario/" + localStorage.getItem("id"),
        updateData,
        config
      );

      handleClose();
      setLoad(false);
    } catch (error) {
      console.error("Error updating profile details:", error);
      setLoad(false);
      // TODO: Add error handling UI
    }
  };

  const isFormValid = () => {
    return formData.location; // Only require location
  };

  const handleImageError = () => {
    setPreviewImage("/imagesUser/default-avatar.png");
  };

  return (
    <div
      className={`${styles.modalBackdrop} ${isClosing ? styles.closing : ""}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.closing : ""}`}
        style={{ maxWidth: "600px" }}
      >
        <button className={styles.closeButton} onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Edit Profile Details</h2>
          <p className={styles.subtitle}>
            Update your location and profile picture
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.modalBody}>
            {/* Profile Picture Section */}
            <div className={styles.uploadSection}>
              <label
                className={styles.uploadLabel}
                htmlFor="profilePictureFile"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className={styles.uploadPreview}
                    onError={handleImageError}
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className={styles.uploadPlaceholder}
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                    }}
                  >
                    <i className="bi bi-person-circle"></i>
                    <span>Upload Photo</span>
                  </div>
                )}
              </label>
              <input
                type="file"
                id="profilePictureFile"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
            </div>

            {/* Location Field */}
            <div className={styles.formGroup}>
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                // placeholder="Monterrey, Nuevo León, MX"
                required
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

import React, { useState, useEffect } from 'react';
import modalStyles from 'src/styles/Modals/Modal.module.css';
import styles from './RoleFilterModal.module.css';
import { ChipModalSelect } from '../ChipModalSelect';

const AVAILABLE_ROLES = [
  { id: 'TFS', name: 'TFS', label: 'TFS' },
  { id: 'Manager', name: 'Manager', label: 'Manager' },
  { id: 'User', name: 'User', label: 'User' }
];

export const RoleFilterModal = ({ isOpen, onClose, selectedRoles = [], onUpdateRoles }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleSet, setSelectedRoleSet] = useState(new Set(selectedRoles));

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      setSelectedRoleSet(new Set(selectedRoles));
    }
  }, [isOpen, selectedRoles]);

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

  const toggleRole = (roleId) => {
    const newSelectedRoles = new Set(selectedRoleSet);
    if (newSelectedRoles.has(roleId)) {
      newSelectedRoles.delete(roleId);
    } else {
      newSelectedRoles.add(roleId);
    }
    setSelectedRoleSet(newSelectedRoles);
  };

  const handleSave = () => {
    onUpdateRoles(Array.from(selectedRoleSet));
    handleClose();
  };

  const filteredRoles = searchTerm !== "" 
    ? AVAILABLE_ROLES.filter(role =>
        role.label.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : AVAILABLE_ROLES;

  return (
    <div
      className={`${modalStyles.modalBackdrop} ${isClosing ? modalStyles.closing : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`${modalStyles.modalContent} ${isClosing ? modalStyles.closing : ''}`}
      >
        <button className={modalStyles.closeButton} onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>

        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.title}>Filter by Role</h2>
          <p className={modalStyles.subtitle}>Select roles to filter employees by their role type.</p>

          <div className={styles.searchBox}>
            <i className={`bi bi-search ${styles.searchIcon}`}></i>
            <input
              type="text"
              placeholder="Search role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={modalStyles.modalBody} style={{ height: 'calc(100% - 200px)' }}>
          <div className={styles.rolesList}>
            {filteredRoles.map((role) => (
              <ChipModalSelect
                key={role.id}
                text={role.label}
                iconClass={selectedRoleSet.has(role.id) ? "bi bi-check-circle-fill" : null}
                isSelectText={selectedRoleSet.has(role.id)}
                onClick={() => toggleRole(role.id)}
              />
            ))}
          </div>
        </div>

        <div className={modalStyles.buttonGroup}>
          <button onClick={handleClose} className={modalStyles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSave} className={modalStyles.saveButton}>
            <i className="bi bi-check-lg"></i>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import modalStyles from 'src/styles/Modals/Modal.module.css';
import styles from './RolesModal.module.css';
import { ChipModalSelect } from '../ChipModalSelect';
import ModalScrollbar from 'src/components/Modals/ModalScrollbar';
import useGetFetch from 'src/hooks/useGetFetch';

export const RolesModal = ({ isOpen, onClose, roleNameStatus, roleIdStatus, roles = [], onRoleSelected }) => {


    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectRole, setselectRole] = useState('');
    const [selectRoleId, setSelectRoleId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsClosing(false);
            if (roleNameStatus === 'Roles') {
                setselectRole('')
            }
            if (roleIdStatus === null) {
                setSelectRoleId(null);
            }
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

    const toggleRole = (role, roleId) => {
        setselectRole(role);
        setSelectRoleId(roleId);
    };

    const handleSave = () => {

        onRoleSelected(selectRole, selectRoleId);
        handleClose();
    }

    const filteredRoles = searchTerm !== "" ? roles.filter(role =>
        role.tnombre.toLowerCase().includes(searchTerm.toLowerCase())) : roles;

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
                    <h2 className={modalStyles.title}>Roles available</h2>
                    <p className={modalStyles.subtitle}>Select a role to see the projects who have it.</p>

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
                    <div className={styles.rolesList} >


                        {filteredRoles && filteredRoles.map((role) => (
                            <ChipModalSelect
                                key={role.idtitulo}
                                text={role.tnombre}
                                iconClass={selectRole === role.tnombre ? "bi bi-check-circle-fill" : null}
                                isSelectText={selectRole === role.tnombre}
                                onClick={() => toggleRole(role.tnombre, role.idtitulo)} />

                        ))
                        }
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
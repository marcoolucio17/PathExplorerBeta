import React, { useState, useEffect } from 'react';
import modalStyles from 'src/styles/Modals/Modal.module.css';
import styles from './ClientsModal.module.css';
import ModalScrollbar from 'src/components/Modals/ModalScrollbar';
import useGetFetch from 'src/hooks/useGetFetch';
import { ChipModalSelect } from '../ChipModalSelect';



export const ClientsModal = ({ isOpen, onClose, clientNameStatus, clientIdStatus, clients = [], updateClients }) => {

    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setselectedClient] = useState('');
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedClient, setselectedClient] = useState('');
    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setIsClosing(false);
            if (clientNameStatus === 'Clients') {
                setselectedClient('')
            }
            if (clientIdStatus === null) {
                setSelectedClientId(null);
            }

        }
    }, [isOpen]);


    if (!isVisible) return null;


    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();

            onClose();

            setIsVisible(false);
            setIsClosing(false);

            setIsClosing(false);

        }, 300);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const toggleClient = (client, clientId) => {
        setselectedClient(client);
        setSelectedClientId(clientId);
    };

    const handleSave = () => {
        updateClients(selectedClient, selectedClientId);
        handleClose();
    }

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
                    <h2 className={modalStyles.title}>Clients register</h2>
                    <p className={modalStyles.subtitle}>Select a client to see the projects they belong to them.</p>

                    <div className={styles.searchBox}>
                        <i className={`bi bi-search ${styles.searchIcon}`}></i>
                        <input
                            type="text"
                            placeholder="Search client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>


                </div>

                <div className={modalStyles.modalBody} style={{ height: 'calc(100% - 200px)' }}>
                    <div className={styles.clientsList}>


                        {clients && clients.map((client) => (
                            <ChipModalSelect
                                key={client.idcliente}
                                text={client.clnombre}
                                iconClass={selectedClient === client.clnombre ? "bi bi-check-circle-fill" : null}
                                isSelectText={selectedClient === client.clnombre}
                                onClick={() => toggleClient(client.clnombre, client.idcliente)}
                            />

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
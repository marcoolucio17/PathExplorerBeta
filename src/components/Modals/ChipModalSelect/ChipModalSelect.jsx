import React, { useState, useEffect } from 'react';
import modalStyles from 'src/styles/Modals/Modal.module.css';
import styles from './ChipModalSelect.module.css';

export const ChipModalSelect = ({ text, iconClass, isSelectText, isExpandTag, onClick }) => {

    const chipClasses = [
        styles.modalChip,
        isSelectText && styles.selectText,
        isExpandTag && styles.expandTag
    ].filter(Boolean).join(' ');

    return (
        <button className={chipClasses} onClick={onClick}>
            {iconClass && <i className={iconClass} />}
            {text}
        </button>
    );

};
export default ChipModalSelect;
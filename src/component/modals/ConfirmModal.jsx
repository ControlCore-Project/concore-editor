import React from 'react';
import ParentModal from './ParentModal';
import './confirmModal.css';

const ConfirmModal = ({
    isOpen, title, message, onConfirm, onCancel,
}) => (
    <ParentModal ModelOpen={isOpen} closeModal={onCancel} title={title}>
        <div className="confirm-modal-content">
            <div className="confirm-modal-message">{message}</div>
            <div className="confirm-modal-actions">
                <button type="button" className="confirm-btn" onClick={onConfirm}>Yes</button>
                <button type="button" className="cancel-btn" onClick={onCancel}>No</button>
            </div>
        </div>
    </ParentModal>
);

export default ConfirmModal;

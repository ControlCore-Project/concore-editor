import React, { useState, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import './parent-modal.css';

ReactModal.setAppElement('#root');

const Modal = ({
    closeModal, ModelOpen, title, children,
}) => {
    const [curClass, setCurClass] = useState('');
    const [isOpen, setIsOpen] = useState(ModelOpen);
    const stid = useRef(null);
    useEffect(() => {
        if (ModelOpen === true) {
            setIsOpen(true);
            setCurClass('closing');
            clearTimeout(stid.current);
            document.body.style.overflow = 'hidden';
            stid.current = setTimeout(() => {
                setIsOpen(true);
                setCurClass('');
            }, 20);
        } else {
            setCurClass('closing');
            clearTimeout(stid.current);
            document.body.style.overflow = '';
            stid.current = setTimeout(() => {
                setIsOpen(false);
            }, 400);
        }
        return () => clearTimeout(stid.current);
    }, [ModelOpen]);

    if (!isOpen) return '';
    return (
        <ReactModal
            isOpen={isOpen}
            contentLabel="onRequestClose Example"
            onRequestClose={closeModal}
            className="Modal"
            overlayClassName={`Overlay ${curClass}`}
        >
            <div className={`modal-content ${curClass}`}>
                <div className="modal-header">
                    <div className="modal-title h4">{title}</div>
                    <button type="button" className="close" onClick={closeModal}>
                        {closeModal ? <span aria-hidden="true">×</span> : ''}
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </ReactModal>
    );
};
export default Modal;

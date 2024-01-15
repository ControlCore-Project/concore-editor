import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './parent-modal.css';

ReactModal.setAppElement('#root');

const Modal = ({
    closeModal, ModelOpen, title, children,
}) => {
    const [curClass, setCurClass] = useState('');
    const [isOpen, setIsOpen] = useState(ModelOpen);
    const [stid, setStid] = useState(null);
    useEffect(() => {
        if (ModelOpen === true) {
            setIsOpen(true);
            setCurClass('closing');
            clearTimeout(stid);
            setStid(setTimeout(() => {
                setIsOpen(true);
                setCurClass('');
            }, 20));
        } else {
            setCurClass('closing');
            clearTimeout(stid);
            setStid(setTimeout(() => {
                setIsOpen(false);
            }, 400));
        }
    }, [ModelOpen]);

    if (!isOpen) return '';
    return (
        <ReactModal
            isOpen={isOpen}
            contentLabel="onRequestClose Example"
            // onRequestClose={closeModal} // prevent modal from closing when clicked outside
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

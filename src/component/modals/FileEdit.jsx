import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { saveAs } from 'file-saver';
import ReactModal from 'react-modal';
import Modal from './ParentModal';
import { toast } from 'react-toastify';
import './file-edit.css';
import { actionType as T } from '../../reducer';

const FileEditModal = ({ superState, dispatcher }) => {
    const [codeStuff, setCodeStuff] = useState('');
    const [fileName, setFileName] = useState('');
    const [dirButton, setDirButton] = useState(false);
    const [language, setLanguage] = useState('plaintext');
    const [newFileName, setNewFileName] = useState('');
    const [showFilenameModal, setShowFilenameModal] = useState(false);

    useEffect(() => {
        if (navigator.userAgent.indexOf('Edg') !== -1 || navigator.userAgent.indexOf('Chrome') !== -1) {
            setDirButton(true);
        }
    }, []);

    const close = () => {
        dispatcher({ type: T.EDIT_TEXTFILE, payload: { show: false } });
        setCodeStuff('');
        setFileName('');
    };

    async function submit() {
        if (superState.fileHandle) {
            const stream = await superState.fileHandle.createWritable();
            await stream.write(codeStuff);
            await stream.close();
        } else {
            toast.warn('Switch to Edge/Chrome!');
        }
        dispatcher({ type: T.EDIT_TEXTFILE, payload: { show: false } });
    }

    async function saveAsSubmit() {
        const handle = await window.showSaveFilePicker();
        const stream = await handle.createWritable();
        await stream.write(codeStuff);
        await stream.close();
        const fileData = await handle.getFile();
        let fS = superState.fileState;
        fS = fS.concat([{
            key: `${superState.uploadedDirName}/${handle.name}`,
            modified: fileData.lastModified,
            size: fileData.size,
            fileObj: fileData,
            fileHandle: handle,
        }]);
        dispatcher({ type: T.SET_FILE_STATE, payload: fS });
    }

    function handleSaveAsClick() {
        setShowFilenameModal(true);
    }

    function confirmSaveAs() {
        if (newFileName.trim() === '') {
            toast.error('Filename cannot be empty!');
            return;
        }
        const bytes = new TextEncoder().encode(codeStuff);
        const blob = new Blob([bytes], { type: 'application/json;charset=utf-8' });
        saveAs(blob, newFileName);
        setShowFilenameModal(false);
    }

    useEffect(() => {
        async function loadFile() {
            if (superState.fileObj) {
                setFileName(superState.fileObj.name);
                const fr = new FileReader();
                fr.onload = (x) => {
                    setCodeStuff(x.target.result);
                };
                if (superState.fileHandle) fr.readAsText(await superState.fileHandle.getFile());
                else fr.readAsText(superState.fileObj);
            }
        }
        loadFile();
    }, [superState.fileObj]);

    useEffect(() => {
        if (!fileName) return;
        const fileEx = fileName.split('.').pop();
        const langMap = {
            v: 'verilog',
            c: 'c',
            h: 'c',
            hpp: 'cpp',
            cpp: 'cpp',
            py: 'python',
            m: 'matlab',
            sh: 'bash',
        };
        setLanguage(langMap[fileEx] || 'plaintext');
    }, [fileName]);

    return (
        <Modal
            ModelOpen={superState.textFileModal}
            closeModal={close}
            title={fileName}
        >
            <div>
                <div className="setting-container">
                    <Editor
                        height="60vh"
                        language={language}
                        theme="vs-light"
                        value={codeStuff}
                        onChange={(value) => setCodeStuff(value)}
                        options={{
                            inlineSuggest: true,
                            fontSize: 16,
                            formatOnType: true,
                            autoClosingBrackets: true,
                            minimap: { enabled: true },
                        }}
                    />
                </div>
                <div className="save-bar">
                    {fileName && (
                        <button type="submit" className="btn btn-primary" onClick={submit}>Save</button>
                    )}
                    {dirButton && (
                        <button type="submit" className="btn btn-primary" onClick={saveAsSubmit}>Save As</button>
                    )}
                    {!dirButton && (
                        <button type="submit" className="btn btn-primary" onClick={handleSaveAsClick}>Save As</button>
                    )}
                </div>
            </div>
            {/* Filename Input Modal */}
            <ReactModal
                isOpen={showFilenameModal}
                onRequestClose={() => setShowFilenameModal(false)}
                className="modal-content"
                overlayClassName="modal-overlay"
                ariaHideApp={false}
            >
                <h2>Enter Filename</h2>
                <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="modal-input"
                    placeholder="Filename"
                />
                <div className="modal-actions">
                    <button type="button" onClick={confirmSaveAs} className="btn btn-primary">Save</button>
                    <button
                        type="button"
                        onClick={() => setShowFilenameModal(false)}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </ReactModal>
        </Modal>
    );
};

export default FileEditModal;

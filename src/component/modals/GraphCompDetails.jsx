import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import './graph-comp-details.css';
import ParentModal from './ParentModal';
import { readTextFile, createFile } from '../../toolbarActions/toolbarFunctions';
import { actionType as T } from '../../reducer';

const ModalComp = ({ closeModal, superState, dispatcher }) => {
    const [data, setData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [element, setElement] = useState(null);
    const [editSourceClicked, setEditSourceClicked] = useState(false);
    const [createSourceClicked, setCreateSourceClicked] = useState(false);
    const [createHelpClicked, setCreateHelpClicked] = useState(false);
    const { modalPayload, ModelOpen } = superState;
    const {
        cb, title, submitText, Children, defaultStyle, defaultLabel, labelAllowed, type,
    } = modalPayload;

    useEffect(() => {
        setErrorMessage('');
    }, [ModelOpen]);

    useEffect(() => {
        setData({ label: defaultLabel || '', style: defaultStyle });
        setErrorMessage('');
    }, [defaultLabel, defaultStyle]);

    const submit = (e) => {
        e.preventDefault();
        const message = cb(data.label, data.style);
        if (message.ok) {
            setErrorMessage('');
            setData({ label: defaultLabel || '', style: defaultStyle });
            closeModal();
        } else setErrorMessage(message.err);
    };

    useEffect(() => {
        if (createSourceClicked) {
            createFile(superState, dispatcher);
        }
        if (editSourceClicked && element === null) {
            toast.error('Respective file is not present in same directory');
        } else if (element !== null) {
            readTextFile(superState, dispatcher, element.fileObj, element.fileHandle);
        }
        setEditSourceClicked(false);
        setCreateSourceClicked(false);
    }, [createSourceClicked, editSourceClicked]);

    useEffect(() => {
        if (createHelpClicked) {
            createFile(superState, dispatcher);
        }
        setCreateHelpClicked(false);
    }, [createHelpClicked]);

    const openFile = () => {
        setElement(null);
        if (superState.fileState !== undefined && data.label !== '') {
            const fname = data.label.split(':')[1];
            superState.fileState.forEach((ele) => {
                if (ele.key.split('/')[1] === fname || ele.key.split('/')[2] === fname) {
                    setElement(ele);
                }
            });
        }
        if (submitText === 'Edit Node') {
            setEditSourceClicked(true);
        } else if (submitText === 'Create Node') {
            setCreateSourceClicked(true);
        }
    };

    const openDoc = () => {
        setElement(null);
        if (superState.fileState !== undefined && data.label !== '') {
            const docname1 = data.label.split(':')[1].split('.')[0].concat('.md');
            const docname2 = data.label.split(':')[1].split('.')[0].concat('.txt');
            superState.fileState.forEach((ele) => {
                if (ele.key.split('/')[1] === docname1 || ele.key.split('/')[1] === docname2) {
                    setElement(ele);
                }
            });
        }
        setCreateHelpClicked(true);
    };

    const openMarkDownDoc = async () => {
        dispatcher({ type: T.SET_MARKDOWN_MODAL, payload: true });
        setElement(null);
        if (superState.fileState !== undefined && data.label !== '') {
            const docname1 = data.label.split(':')[1].split('.')[0].concat('.md');
            const matchingElement = superState.fileState.find((ele) => ele.key.split('/')[1] === docname1);
            if (matchingElement) {
                const fr = new FileReader();
                fr.onload = (x) => {
                    // eslint-disable-next-line max-len
                    dispatcher({ type: T.SET_INPUT_FILE, payload: { content: x.target.result, fname: matchingElement.key.split('/')[1] } });
                };
                if (matchingElement.fileHandle) {
                    fr.readAsText(await matchingElement.fileHandle.getFile());
                } else if (matchingElement.fileObj) {
                    fr.readAsText(matchingElement.fileObj);
                }
                setElement(matchingElement);
            }
        }
    };

    const createLibrary = (e) => {
        const fileName = data.label.split(':')[1];
        if (fileName === undefined || fileName === '') {
            toast.error('Enter File Name');
            return;
        }
        superState.curGraphInstance.library(fileName);
        submit(e);
    };

    return (
        <ParentModal closeModal={closeModal} ModelOpen={ModelOpen} title={title}>
            <form onSubmit={submit}>
                <div className="modal-content-body">
                    <Children data={data} setData={setData} labelAllowed={labelAllowed} state={superState} />
                    {errorMessage ? <div className="err">{errorMessage}</div> : <></>}
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">{submitText}</button>
                    { type === 'Node' ? (
                        <>
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={openFile}
                            >
                                { submitText === 'Edit Node' ? 'Edit Source' : 'Create Source' }
                            </button>
                            { title === 'Edit Node'
                                ? (
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={openMarkDownDoc}
                                    >
                                        Help
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={openDoc}
                                    >
                                        Create Help
                                    </button>
                                )}
                            { title === 'Edit Node'
                                ? ''
                                : (
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={createLibrary}
                                    >
                                        Create Library
                                    </button>
                                )}
                        </>
                    ) : '' }
                </div>
            </form>
        </ParentModal>
    );
};
export default ModalComp;

import React, { useEffect, useState, useCallback } from 'react';
import Modal from './ParentModal';
import './project-details.css';
import { actionType as T } from '../../reducer';
import localStorageManager from '../../graph-builder/local-storage-manager';

const ProjectDetails = ({ superState, dispatcher }) => {
    const curGraph = superState.graphs[superState.curGraphIndex];
    const [projectName, setProjectName] = useState('Untitled');
    const [authorName, setAuthorName] = useState('Default');
    // const [serverID, setServerID] = useState('');
    const inputRef = useCallback((node) => node && node.focus(), []);
    const { newGraphModal } = superState;
    const editDetailsModal = superState.editDetailsModal || (curGraph && !curGraph.projectName);

    useEffect(() => {
        if (superState.editDetailsModal && curGraph) {
            setProjectName(curGraph.projectName);
            setAuthorName(curGraph.authorName);
        } else {
            setProjectName('');
        }
    }, [curGraph?.authorName, superState.editDetailsModal, curGraph]);

    useEffect(() => {
        if (curGraph?.authorName) {
            setAuthorName(curGraph.authorName);
        } else {
            const authorNameE = localStorageManager.getAuthorName();
            setAuthorName(authorNameE);
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();
        if (newGraphModal) dispatcher({ type: T.ADD_GRAPH, payload: { projectName, authorName } });
        else if (editDetailsModal) {
            superState.curGraphInstance.setProjectName(projectName);
            superState.curGraphInstance.setProjectAuthor(authorName);
            dispatcher({ type: T.SET_EDIT_DETAILS_MODAL, payload: false });
        }
        localStorageManager.saveAllgs();
        localStorageManager.setAuthorName(authorName);
    };

    const openExisting = () => {
        superState.fileRef.current.click();
    };

    const closeModal = () => {
        if (superState.newGraphModal) dispatcher({ type: T.SET_NEW_GRAPH_MODAL, payload: false });
        else if (superState.editDetailsModal) dispatcher({ type: T.SET_EDIT_DETAILS_MODAL, payload: false });
    };
    // const loadFromServer = () => {
    //     dispatcher({ type: T.ADD_GRAPH, payload: { serverID } });
    // };
    const NewWorkflow = () => (
        <>
            {/* <div className="divider" />
            <input
                placeholder="Enter the Server ID of Workflow"
                value={serverID}
                onChange={(e) => setServerID(e.target.value)}
                className="serverIDText"
            />
            <button
                type="button"
                className="btn btn-secondary"
                onClick={loadFromServer}
            >
                Load From Server

            </button> */}
            <div className="divider" />
            <button
                type="button"
                className="btn btn-secondary"
                onClick={openExisting}
            >
                Open Existing From GraphML File

            </button>
        </>
    );

    return (
        <Modal
            ModelOpen={newGraphModal || editDetailsModal}
            closeModal={superState.editDetailsModal || superState.newGraphModal ? closeModal : null}
            title="Project Details"
        >
            <form className="proj-details" onSubmit={submit}>
                <span>Workflow Name</span>
                <input
                    ref={inputRef}
                    placeholder="Title of workflow"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <span>Author</span>
                <input
                    placeholder="Author of workflow"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                />
                <div className="expand">
                    <button type="submit" className="btn btn-primary">Save</button>
                </div>
                <div className="expand">
                    {newGraphModal && <NewWorkflow />}
                </div>
            </form>
        </Modal>
    );
};

export default ProjectDetails;

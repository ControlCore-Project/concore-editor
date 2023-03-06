import React, { useEffect, useReducer } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ReactTooltip from 'react-tooltip';
import GraphWorkspace from './GraphWorkspace';
import GraphCompDetails from './component/modals/GraphCompDetails';
import { Header } from './component/Header';
import { reducer, initialState, actionType as T } from './reducer';
import ProjectDetails from './component/modals/ProjectDetails';
import ShareModal from './component/modals/ShareModal';
import SettingsModal from './component/modals/Settings';
import FileDragDrop from './component/File-drag-drop';
import HistoryModal from './component/modals/History';
import LocalFileBrowser from './component/fileBrowser';
import FileEditModal from './component/modals/FileEdit';

const app = () => {
    const [superState, dispatcher] = useReducer(reducer, initialState);
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.returnValue = 'Are you sure you want to leave this page?';
            return 'Are you sure you want to leave this page?';
        };
        window.onbeforeunload = handleBeforeUnload;
        return () => {
            window.onbeforeunload = null;
        };
    }, []);
    return (
        <div className="container">
            <ProjectDetails superState={superState} dispatcher={dispatcher} />
            <ShareModal superState={superState} dispatcher={dispatcher} />
            <SettingsModal superState={superState} dispatcher={dispatcher} />
            <HistoryModal superState={superState} dispatcher={dispatcher} />
            <FileEditModal superState={superState} dispatcher={dispatcher} />
            <GraphCompDetails
                closeModal={() => dispatcher({ type: T.Model_Close })}
                superState={superState}
            />
            <FileDragDrop dispatcher={dispatcher} />
            <Header superState={superState} dispatcher={dispatcher} />
            <section className="body" style={{ display: 'flex', overflow: 'hidden' }}>
                <div style={{ display: 'flex', overflow: 'auto' }}>
                    <LocalFileBrowser superState={superState} dispatcher={dispatcher} />
                </div>
                <div className="graph" style={{ display: 'flex', overflow: 'hidden' }}>
                    <GraphWorkspace dispatcher={dispatcher} superState={superState} />
                </div>
            </section>
            <ReactTooltip place="bottom" type="dark" effect="solid" />
            <ToastContainer position="top-right" autoClose={5000} pauseOnHover={false} />
        </div>
    );
};

export default app;

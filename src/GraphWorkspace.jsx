import React from 'react';
import ZoomComp from './component/ZoomSetter';
import ConfirmModal from './component/modals/ConfirmModal';
import SearchPanel from './component/SearchPanel';
import { actionType as T } from './reducer';
import './graphWorkspace.css';
import localStorageManager from './graph-builder/local-storage-manager';
import TabBar from './component/TabBar';
import Graph from './GraphArea';

const GraphComp = (props) => {
    const graphContainerRef = React.useRef();
    const { dispatcher, superState } = props;

    React.useEffect(() => {
        const allIDs = localStorageManager.getAllGraphs();
        const validIDs = allIDs.filter((id) => typeof id === 'string' && id && localStorageManager.get(id) !== null);
        if (validIDs.length !== allIDs.length) {
            allIDs.filter((id) => !validIDs.includes(id)).forEach((id) => localStorageManager.remove(id));
        }
        if (validIDs.length === 0) return;
        dispatcher({ type: T.ADD_GRAPH_BULK, payload: validIDs.map((graphID) => ({ graphID })) });
    }, []);

    // Remote server implementation - Not being used.
    // useEffect(() => {
    //     if (!loadedFromStorage) return;
    //     const graphFromParams = Object.fromEntries(new URLSearchParams(window.location.search).entries()).g;
    //     if (graphFromParams) {
    //         const graphContent = JSON.parse(window.atob(graphFromParams));
    //         const gid = new Date().getTime().toString();
    //         localStorageManager.addToFront(gid);
    //         localStorageManager.save(gid, graphContent);
    //         window.history.replaceState({}, document.title, window.location.pathname);
    //         dispatcher({ type: T.ADD_GRAPH, payload: { graphID: gid } });
    //     }
    //     const urlParms = window.location.pathname.split('/');
    //     const serverIDIndex = urlParms.indexOf('s');
    //     const localIDIndex = urlParms.indexOf('l');
    //     if (serverIDIndex !== -1 && serverIDIndex + 1 < urlParms.length) {
    //         const serverID = urlParms[serverIDIndex + 1];
    //         dispatcher({ type: T.ADD_GRAPH, payload: { serverID } });
    //     }
    //     if (localIDIndex !== -1 && localIDIndex + 1 < urlParms.length) {
    //         const graphID = urlParms[localIDIndex + 1];
    //         dispatcher({ type: T.ADD_GRAPH, payload: { graphID } });
    //     }
    // }, [loadedFromStorage]);

    return (
        <div
            style={{
                flex: 1,
                flexDirection: 'column',
                display: 'flex',
                width: '100%',
            }}
        >
            <TabBar superState={superState} dispatcher={dispatcher} />
            <div style={{ flex: 1, position: 'relative' }} className="graph-container" ref={graphContainerRef}>
                {superState.graphs.map((el, i) => (
                    <Graph
                        el={el}
                        i={i}
                        superState={superState}
                        graphContainerRef={graphContainerRef}
                        dispatcher={dispatcher}
                        key={el.graphID}
                        active={i === superState.curGraphIndex}
                        graphID={el.graphID}
                        serverID={el.serverID}
                        graphML={el.graphML}
                        importedJson={el.importedJson || null}
                        projectName={el.projectName}
                        fileHandle={el.fileHandle}
                        fileName={el.fileName}
                        authorName={el.authorName}
                    />
                ))}
                <SearchPanel superState={superState} dispatcher={dispatcher} />
                <ZoomComp dispatcher={dispatcher} superState={superState} />
            </div>
            <ConfirmModal
                isOpen={superState.confirmModal.open}
                title="Confirm"
                message={superState.confirmModal.message}
                onConfirm={() => {
                    if (superState.confirmModal.onConfirm) superState.confirmModal.onConfirm();
                    dispatcher({ type: T.SET_CONFIRM_MODAL, payload: { open: false, message: '', onConfirm: null } });
                }}
                onCancel={() => dispatcher({
                    type: T.SET_CONFIRM_MODAL,
                    payload: { open: false, message: '', onConfirm: null },
                })}
            />
        </div>
    );
};

export default GraphComp;

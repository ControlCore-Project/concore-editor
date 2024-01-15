import React, { useEffect } from 'react';
import ZoomComp from './component/ZoomSetter';

import { actionType as T } from './reducer';
import './graphWorkspace.css';
import localStorageManager from './graph-builder/local-storage-manager';
import TabBar from './component/TabBar';
import Graph from './GraphArea';

const GraphComp = (props) => {
    const graphContainerRef = React.useRef();
    const { dispatcher, superState } = props;
    // const [loadedFromStorage, setLoadedFromStorage] = React.useState(false);

    useEffect(() => {
        const allSavedGs = localStorageManager.getAllGraphs().map((graphID) => ({
            graphID,
        }));
        dispatcher({
            type: T.ADD_GRAPH_BULK,
            payload: allSavedGs,
        });
        // setLoadedFromStorage(true);
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
            <div style={{ flex: 1, background: 'white' }} className="graph-container" ref={graphContainerRef}>
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
                        projectName={el.projectName}
                        fileHandle={el.fileHandle}
                        fileName={el.fileName}
                        authorName={el.authorName}
                    />
                ))}
                <ZoomComp dispatcher={dispatcher} superState={superState} />
            </div>
        </div>
    );
};

export default GraphComp;

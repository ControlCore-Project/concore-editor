import React, { useEffect, useRef, useState } from 'react';
import { edgeValidator, nodeValidator } from './config/defaultValidators';
import MyGraph from './graph-builder';
import { actionType as T } from './reducer';

function Graph({
    el, superState, dispatcher, graphID, serverID, graphML, projectName, graphContainerRef, active, authorName,
}) {
    const [instance, setInstance] = useState(null);
    const ref = useRef();
    const setContainerDim = (element) => {
        if (element) {
            const elToAss = element;
            elToAss.style.width = `${graphContainerRef.current.offsetWidth - 2}px`;
            elToAss.style.height = `${graphContainerRef.current.offsetHeight - 2}px`;
        }
    };

    const initialiseNewGraph = () => {
        const myGraph = new MyGraph(
            graphID, ref.current, dispatcher, superState, projectName, nodeValidator, edgeValidator, authorName,
        );
        if (graphID) myGraph.loadGraphFromLocalStorage();
        if (serverID) {
            myGraph.set({ serverID });
            myGraph.forcePullFromServer();
        }
        if (graphML) myGraph.setGraphML(graphML);
        myGraph.setCurStatus();
        return myGraph;
    };
    // Remote server implementation - Not being used.
    // useEffect(() => {
    //     if (active && loaded && serverID) {
    //         window.history.pushState(null, null, path.join(process.env.PUBLIC_URL, 's', serverID));
    //     } else if (active && loaded && graphID) {
    //         window.history.pushState(null, null, path.join(process.env.PUBLIC_URL, 'l', graphID));
    //     }
    // }, [active, serverID, loaded, graphID]);
    useEffect(() => instance && instance.set({ superState }), [instance, superState]);
    useEffect(() => active && instance && instance.setCurStatus(), [active && instance]);
    useEffect(() => {
        if (active && instance) dispatcher({ type: T.SET_CUR_INSTANCE, payload: instance });
    }, [active && instance]);

    useEffect(() => {
        if (ref.current) {
            setContainerDim(ref.current);
            window.addEventListener('resize', () => setContainerDim(ref.current));
            setInstance(initialiseNewGraph());
        }
    }, [ref]);

    const { id } = el;

    return (
        <div
            style={{ zIndex: 1, display: active ? 'block' : 'none' }}
            key={id}
            className="graph-element"
            ref={ref}
        />
    );
}
export default Graph;

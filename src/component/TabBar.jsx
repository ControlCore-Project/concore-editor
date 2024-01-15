import React from 'react';
import {
    MdEdit, MdClose, MdAdd,
} from 'react-icons/md';
import hotkeys from 'hotkeys-js';
import ReactTooltip from 'react-tooltip';
import localStorageManager from '../graph-builder/local-storage-manager';
import { actionType as T } from '../reducer';
import { newProject, editDetails } from '../toolbarActions/toolbarFunctions';
import './tabBar.css';

const TabBar = ({ superState, dispatcher }) => {
    const closeTab = (i, e) => {
        e.stopPropagation();
        // eslint-disable-next-line no-alert
        if (!window.confirm('Do you confirm to close the tab? This action is irreversable.')) return;
        localStorageManager.remove(superState.graphs[i] ? superState.graphs[i].graphID : null);
        dispatcher({ type: T.REMOVE_GRAPH, payload: i });
        if (!superState.curGraphIndex && superState.graphs.length === 1) {
            dispatcher({ type: T.SET_CUR_INSTANCE, payload: null });
            dispatcher({ type: T.SET_CUR_INDEX, payload: -1 });
        }
    };
    const editCur = (e) => {
        e.stopPropagation();
        editDetails(superState, dispatcher);
    };
    React.useEffect(() => {
        hotkeys('ctrl+shift+m,command+shift+m', (event) => {
            event.preventDefault();
            document.getElementById('new_graph').click();
        });
        hotkeys('ctrl+shift+e,command+shift+e', (event) => {
            event.preventDefault();
            const el = document.querySelector('.tab.tab-graph.selected > .tab-act.edit');
            if (el) el.click();
        });
        hotkeys('ctrl+shift+l,command+shift+l', (event) => {
            event.preventDefault();
            const el = document.querySelector('.tab.tab-graph.selected > .tab-act.close');
            if (el) el.click();
        });
    }, []);

    return (
        <div className="tab-par">
            <button
                className="tab"
                onClick={newProject.bind(this, superState, dispatcher)}
                type="button"
                id="new_graph"
                data-tip="New Workflow Tab (Ctrl + Shift + M)"
            >
                <MdAdd size={25} />
            </button>
            {superState.graphs.map((el, i) => (
                <div
                    key={el.graphID}
                    className={`tab tab-graph ${superState.curGraphIndex === i ? 'selected' : 'none'}`}
                    onClick={() => dispatcher({ type: T.CHANGE_TAB, payload: i })}
                    onKeyDown={(ev) => ev.key === ' ' && dispatcher({ type: T.CHANGE_TAB, payload: i })}
                    role="button"
                    tabIndex={0}
                    id={`tab_${i}`}
                >
                    <span className="tab-text">
                        {el.fileName || el.projectName}
                    </span>

                    {superState.curGraphIndex === i ? (
                        <button
                            className="tab-act edit"
                            onClick={editCur}
                            type="button"
                            data-tip="Edit Workflow Details (Ctrl + Shift + E)"
                            data-for="header-tab"
                        >
                            <MdEdit size={16} />
                        </button>
                    ) : <></>}
                    <button
                        className="tab-act close"
                        onClick={closeTab.bind(this, i)}
                        type="button"
                        data-tip="Close current Workflow (Ctrl + Shift + L)"
                        data-for="header-tab"
                    >
                        <MdClose size={20} />
                    </button>
                    <ReactTooltip place="bottom" type="dark" effect="solid" id="header-tab" />
                </div>
            ))}
        </div>
    );
};

export default TabBar;

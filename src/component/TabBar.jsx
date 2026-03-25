import React, { useState } from 'react';
import {
    MdEdit, MdClose, MdAdd,
} from 'react-icons/md';
import hotkeys from 'hotkeys-js';
import ReactTooltip from 'react-tooltip';
import localStorageManager from '../graph-builder/local-storage-manager';
import { actionType as T } from '../reducer';
import { newProject, editDetails } from '../toolbarActions/toolbarFunctions';
import './tabBar.css';
import ConfirmModal from './modals/ConfirmModal';

const TabBar = ({ superState, dispatcher }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [tabToClose, setTabToClose] = useState(null);

    const closeTab = (i) => {
        const graph = superState.graphs[i];
        if (graph && graph.instance) graph.instance.dispose();
        localStorageManager.remove(graph ? graph.graphID : null);
        dispatcher({ type: T.REMOVE_GRAPH, payload: i });
        if (!superState.curGraphIndex && superState.graphs.length === 1) {
            dispatcher({ type: T.SET_CUR_INSTANCE, payload: null });
            dispatcher({ type: T.SET_CUR_INDEX, payload: -1 });
        }
    };

    const handleRequestCloseTab = (i, e) => {
        e.stopPropagation();
        const graph = superState.graphs[i];
        if (graph && graph.instance && !graph.instance.isSaved) {
            setTabToClose(i);
            setConfirmOpen(true);
        } else {
            closeTab(i);
        }
    };

    const handleConfirmClose = () => {
        closeTab(tabToClose);
        setConfirmOpen(false);
        setTabToClose(null);
    };

    const handleCancelClose = () => {
        setConfirmOpen(false);
        setTabToClose(null);
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
        return () => {
            hotkeys.unbind('ctrl+shift+m,command+shift+m');
            hotkeys.unbind('ctrl+shift+e,command+shift+e');
            hotkeys.unbind('ctrl+shift+l,command+shift+l');
        };
    }, []);

    return (
        <div className="tab-par">
            <button
                className="tab"
                onClick={newProject.bind(this, superState, dispatcher)}
                type="button"
                id="new_graph"
                aria-label="New workflow tab"
                data-tip="New Workflow Tab (Ctrl + Shift + M)"
            >
                <MdAdd size={25} />
            </button>
            {superState.graphs.map((el, i) => (
                <div
                    key={el.graphID}
                    className={`tab tab-graph ${superState.curGraphIndex === i ? 'selected' : 'none'}`}
                    onClick={() => dispatcher({ type: T.CHANGE_TAB, payload: i })}
                    onKeyDown={(ev) => (ev.key === ' ' || ev.key === 'Enter')
                        && dispatcher({ type: T.CHANGE_TAB, payload: i })}
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
                            aria-label="Edit workflow details"
                            data-tip="Edit Workflow Details (Ctrl + Shift + E)"
                            data-for="header-tab"
                        >
                            <MdEdit size={16} />
                        </button>
                    ) : <></>}
                    <button
                        className="tab-act close"
                        onClick={handleRequestCloseTab.bind(this, i)}
                        type="button"
                        aria-label="Close workflow tab"
                        data-tip="Close current Workflow (Ctrl + Shift + L)"
                        data-for="header-tab"
                    >
                        <MdClose size={20} />
                    </button>
                    <ReactTooltip place="bottom" type="dark" effect="solid" id="header-tab" />
                </div>
            ))}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Close Tab"
                message="Do you confirm to close the tab? This action is irreversible."
                onConfirm={handleConfirmClose}
                onCancel={handleCancelClose}
            />
        </div>
    );
};

export default TabBar;

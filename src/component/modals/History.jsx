import React, { useEffect, useState } from 'react';
import Modal from './ParentModal';
import ConfirmModal from './ConfirmModal';
import './settings.css';
import { actionType as T } from '../../reducer';
import GA from '../../graph-builder/graph-actions';
import './history.css';

const HistoryModal = ({ superState, dispatcher }) => {
    const [curState, setcurState] = useState(0);
    const [historyList, setHistoryList] = useState([]);
    const [historyView, setHistoryView] = useState([]);
    const actions = [
        GA.ADD_NODE, GA.ADD_EDGE,
        GA.UPDATE_NODE, GA.UPDATE_EDGE,
        GA.DEL_NODE, GA.DEL_EDGE,
        GA.SET_DIM, GA.SET_BENDW, GA.SET_POS,
    ];
    const mapActionToTrue = () => {
        const res = {};
        actions.forEach((action) => { res[action] = true; });
        return res;
    };
    const [filterAction, setFilterAction] = useState(mapActionToTrue());
    const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
    const [pendingRestoreIndex, setPendingRestoreIndex] = useState(null);

    const getLabelFromID = (x) => {
        if (superState.curGraphInstance) {
            return superState.curGraphInstance.getLabelFromID(x);
        }
        return '';
    };
    useEffect(() => {
        if (superState.curGraphInstance) {
            setHistoryList([
                ...superState.curGraphInstance.actionArr
                    .slice().reverse().map((action, i) => ({ ...action, i })),
            ]);
            setcurState(
                superState.curGraphInstance.actionArr.length
                - superState.curGraphInstance.curActionIndex,
            );
        }
    }, [superState.viewHistory, superState.graphs, superState.curGraphInstance, curState]);

    const stringifyAction = (equivalent) => {
        const par = equivalent.parameters;
        switch (equivalent.actionName) {
        case GA.ADD_NODE: return `Created new Node: ${par[0]}`;
        case GA.ADD_EDGE: return `Created new Edge ${
            getLabelFromID(par[0].id)
        } between ${getLabelFromID(par[0].sourceID)} and ${getLabelFromID(par[0].targetID)}`;
        case GA.UPDATE_NODE: return `Updated Label/Style for ${getLabelFromID(par[0])} node`;
        case GA.UPDATE_EDGE: return `Updated Edge ${getLabelFromID(par[0])}`;
        case GA.DEL_NODE: return `Deleted Node: ${getLabelFromID(par[0])}`;
        case GA.DEL_EDGE: return `Deleted Edge: ${getLabelFromID(par[0])}`;
        case GA.SET_POS: return `Moved node ${getLabelFromID(par[0])} on canvas`;
        case GA.SET_DIM: return `Changed dimension of node ${getLabelFromID(par[0])}`;
        case GA.SET_BENDW: return `Modified Bend Point of node ${getLabelFromID(par[0])}`;
        default: return '';
        }
    };

    const stringifyActionType = {
        [GA.ADD_NODE]: 'NodeAddition:',
        [GA.ADD_EDGE]: 'EdgeAddition',
        [GA.UPDATE_NODE]: 'NodeUpdates',
        [GA.UPDATE_EDGE]: 'EdgeUpdates',
        [GA.DEL_NODE]: 'NodeDeletion',
        [GA.DEL_EDGE]: 'EdgeDeletion',
        [GA.SET_POS]: 'NodePosChange',
        [GA.SET_DIM]: 'NodeDimensionChange',
        [GA.SET_BENDW]: 'EdgeBend',
    };

    const doRestore = (index) => {
        let tempCurState = curState;
        while (index > tempCurState) {
            superState.curGraphInstance.undoSingleAction();
            tempCurState += 1;
        }
        while (index < tempCurState) {
            superState.curGraphInstance.redoSingleAction();
            tempCurState -= 1;
        }
        setcurState(tempCurState);
    };

    const restoreState = (index) => {
        setPendingRestoreIndex(index);
        setRestoreConfirmOpen(true);
    };

    const handleRestoreConfirm = () => {
        doRestore(pendingRestoreIndex);
        setRestoreConfirmOpen(false);
        setPendingRestoreIndex(null);
    };

    const handleRestoreCancel = () => {
        setRestoreConfirmOpen(false);
        setPendingRestoreIndex(null);
    };
    const prefixTid = (tid, str, authorName, index, hash) => {
        const DT = new Date(parseInt(tid, 10));
        const date = DT.toLocaleDateString();
        const time = DT.toLocaleTimeString();
        const c = (
            <>
                <td>
                    {
                        index === curState ? '[Current]' : (
                            <button className="a-link" type="button" onClick={() => restoreState(index)}>
                                [Restore]
                            </button>
                        )
                    }
                </td>
                <td>{`${date}-${time}`}</td>
                <td>
                    [
                    <b>{`${authorName}`}</b>
                    ]
                </td>
                <td style={{ fontWeight: 100 }}>{str}</td>
                <td style={{ fontWeight: 100 }}>{hash}</td>
            </>
        );
        // if (index === curState) return <u>{c}</u>;
        return c;
    };

    const parseAction = ({
        equivalent, tid, i, authorName, hash,
    }) => prefixTid(
        tid, stringifyAction(equivalent), authorName, i, hash,
    );

    useEffect(() => {
        setHistoryView(historyList.filter((action) => filterAction[action.equivalent.actionName]).map(parseAction));
    }, [filterAction, historyList]);

    const close = () => dispatcher({ type: T.SET_HISTORY_MODAL, payload: false });
    return (
        <>
            <ConfirmModal
                isOpen={restoreConfirmOpen}
                title="Restore State"
                message="Are you sure you want to restore the selected state?"
                onConfirm={handleRestoreConfirm}
                onCancel={handleRestoreCancel}
            />
            <Modal
                ModelOpen={superState.viewHistory}
                closeModal={close}
                title="History"
            >
            <div className="hist-container">
                <fieldset>
                    <legend>Filters</legend>
                    {
                        actions.map((action) => (
                            <label htmlFor={action} className="filter_checkbox" key={action}>
                                <input
                                    type="checkbox"
                                    name="filter"
                                    checked={filterAction[action]}
                                    onChange={() => setFilterAction({
                                        ...filterAction,
                                        [action]: !filterAction[action],
                                    })}
                                />
                                {stringifyActionType[action]}
                            </label>
                        ))
                    }
                </fieldset>
                <div className="hist-list">
                    <table style={{ listStyleType: 'circle' }}>
                        <tbody>
                            {historyView.map((h, i) => (
                                <tr
                                    className={`hist-element ${i === curState ? 'active' : ''}`}
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={i}
                                >
                                    {h}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </Modal>
        </>
    );
};

export default HistoryModal;

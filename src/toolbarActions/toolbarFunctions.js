import { toast } from 'react-toastify';
import parser from '../graph-builder/graphml/parser';
import { actionType as T } from '../reducer';

const getGraphFun = (superState) => superState.curGraphInstance;

const createNode = (state, setState) => {
    setState({
        type: T.Model_Open_Create_Node,
        cb: (label, style) => {
            const message = getGraphFun(state).validiateNode(label, style, null, 'New');
            if (message.ok) getGraphFun(state).addNode(label, style);
            return message;
        },
    });
};

const editElement = (state, setState) => {
    const shouldUpdateLabel = state.eleSelectedPayload.ids.length === 1;
    const tid = new Date().getTime();
    if (state.eleSelectedPayload.type === 'NODE') {
        setState({
            type: T.Model_Open_Update_Node,
            cb: (label, style) => {
                const retMessage = { ok: true, err: null };
                state.eleSelectedPayload.ids.forEach((id) => {
                    const message = getGraphFun(state).validiateNode(
                        shouldUpdateLabel ? label : null, style, id, 'Update',
                    );
                    retMessage.ok = retMessage.ok && message.ok;
                    retMessage.err = retMessage.err || message.err;
                });
                if (retMessage.ok) {
                    state.eleSelectedPayload.ids.forEach(
                        (id) => getGraphFun(state).updateNode(id, style, label, shouldUpdateLabel, tid),
                    );
                }
                return retMessage;
            },
            labelAllowed: shouldUpdateLabel,
            label: getGraphFun(state).getLabel(state.eleSelectedPayload.ids[0]),
            style: getGraphFun(state).getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
    if (state.eleSelectedPayload.type === 'EDGE') {
        setState({
            type: T.Model_Open_Update_Edge,
            cb: (label, style) => {
                const retMessage = { ok: true, err: null };
                state.eleSelectedPayload.ids.forEach((id) => {
                    const message = getGraphFun(state).validiateEdge(
                        shouldUpdateLabel ? label : null, style, null, null, id, 'Update',
                    );
                    retMessage.ok = retMessage.ok && message.ok;
                    retMessage.err = retMessage.err || message.err;
                });
                if (retMessage.ok) {
                    state.eleSelectedPayload.ids.forEach(
                        (id) => getGraphFun(state).updateEdge(id, style, label, shouldUpdateLabel, tid),
                    );
                }
                return retMessage;
            },
            labelAllowed: shouldUpdateLabel,
            label: getGraphFun(state).getLabel(state.eleSelectedPayload.ids[0]),
            style: getGraphFun(state).getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
};

const deleteElem = (state, dispatcher) => {
    const tid = new Date().getTime();
    state.eleSelectedPayload.ids.forEach((id) => getGraphFun(state).deleteElem(id, tid));
    dispatcher({ type: T.ELE_UNSELECTED, payload: null });
};

const downloadImg = (state, setState, format) => {
    getGraphFun(state).downloadImg(format);
};

const saveAction = (state) => {
    getGraphFun(state).saveToDisk();
};

async function saveGraphMLFile(state) {
    if (state.curGraphInstance) {
        const graph = state.graphs[state.curGraphIndex];
        if (graph.fileHandle) {
            const stream = await graph.fileHandle.createWritable();
            await stream.write(getGraphFun(state).saveToFolder());
            await stream.close();
            toast.success('File saved Successfully');
        } else if (!graph.fileHandle) {
            getGraphFun(state).saveWithoutFileHandle();
        } else {
            toast.info('Switch to Edge/Chrome!');
        }
    } else {
        toast.info('Switch to Edge/Chrome!');
    }
}

const readFile = async (state, setState, file, fileHandle) => {
    if (file) {
        const fr = new FileReader();
        const projectName = file.name;
        if (file.name.split('.').pop() === 'graphml') {
            fr.onload = (x) => {
                parser(x.target.result).then(({ authorName }) => {
                    setState({
                        type: T.ADD_GRAPH,
                        payload: {
                            projectName, graphML: x.target.result, fileHandle, fileName: file.name, authorName,
                        },
                    });
                });
            };
            if (fileHandle) fr.readAsText(await fileHandle.getFile());
            else fr.readAsText(file);
        }
    }
};

const readTextFile = (state, setState, file, fileHandle) => {
    if (file) {
        setState({
            type: T.EDIT_TEXTFILE,
            payload: { show: true, fileObj: file, fileHandle },
        });
    }
};

const optionModalToggle = (state, setState) => {
    setState({
        type: T.SET_OPTIONS_MODAL,
        payload: true,
    });
};

const createFile = (state, setState) => {
    setState({
        type: T.EDIT_TEXTFILE,
        payload: { show: true },
    });
};

const newProject = (state, setState) => {
    setState({ type: T.NEW_GRAPH });
};

const clearAll = (state) => {
    getGraphFun(state).clearAll();
};

const contribute = (state, setState) => {
    setState({ type: T.SET_CONTRIBUTE_MODAL, payload: true });
};

const resetAfterClear = (state) => {
    getGraphFun(state).resetAfterClear();
};

const toggleLogs = (state, dispatcher) => {
    dispatcher({ type: T.SET_LOGS, payload: !state.logs });
};

const editDetails = (state, setState) => {
    setState({
        type: T.SET_EDIT_DETAILS_MODAL,
        payload: true,
    });
};

const undo = (state) => {
    if (getGraphFun(state)) getGraphFun(state).undo();
};
const redo = (state) => {
    getGraphFun(state).redo();
};

const openShareModal = (state, setState) => {
    setState({ type: T.SET_SHARE_MODAL, payload: true });
};

const openSettingModal = (state, setState) => {
    setState({ type: T.SET_SETTING_MODAL, payload: true });
};

const viewHistory = (state, setState) => {
    setState({ type: T.SET_HISTORY_MODAL, payload: true });
};

const toggleServer = (state, dispatcher) => {
    if (state.isWorkflowOnServer) {
        dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: false });
    } else {
        dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: true });
    }
};

export {
    createNode, editElement, deleteElem, downloadImg, saveAction, saveGraphMLFile,
    createFile, readFile, readTextFile, newProject, clearAll, editDetails, undo, redo,
    openShareModal, openSettingModal, viewHistory, resetAfterClear, toggleLogs,
    toggleServer, optionModalToggle, contribute,
};

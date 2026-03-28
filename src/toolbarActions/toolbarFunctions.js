import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import extractChunks from 'png-chunks-extract';
import textChunk from 'png-chunk-text';
import parser from '../graph-builder/graphml/parser';
import { actionType as T } from '../reducer';

const getGraphFun = (superState) => superState.curGraphInstance;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

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

const saveAsJson = (state) => {
    if (!getGraphFun(state)) {
        toast.error('No graph open to export.');
        return;
    }
    try {
        const graphJson = getGraphFun(state).jsonifyGraph();
        const cleanExport = {
            projectName: graphJson.projectName || 'Untitled',
            authorName: graphJson.authorName || '',
            nodes: graphJson.nodes.map((n) => ({
                id: n.id,
                label: n.label,
                position: n.position,
                style: n.style,
            })),
            edges: graphJson.edges.map((e) => ({
                id: e.id,
                label: e.label,
                source: e.source,
                target: e.target,
                style: e.style,
            })),
        };
        const str = JSON.stringify(cleanExport, null, 2);
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], { type: 'application/json;charset=utf-8' });
        const fileName = `${cleanExport.projectName}.json`;
        saveAs(blob, fileName);
        toast.success('Exported as JSON successfully!');
    } catch (error) {
        toast.error('Failed to export JSON.');
    }
};

async function saveGraphMLFile(state) {
    if (state.curGraphInstance) {
        const graph = state.graphs[state.curGraphIndex];
        if (graph.fileHandle && graph.fileHandle.createWritable) {
            try {
                const stream = await graph.fileHandle.createWritable();
                await stream.write(getGraphFun(state).saveToFolder());
                await stream.close();
                toast.success('File saved Successfully');
            } catch (error) {
                getGraphFun(state).saveWithoutFileHandle();
            }
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
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB`);
            return;
        }
        const fr = new FileReader();
        const projectName = file.name;
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext === 'graphml') {
            fr.onload = (x) => {
                parser(x.target.result).then(({ authorName }) => {
                    setState({
                        type: T.ADD_GRAPH,
                        payload: {
                            projectName, graphML: x.target.result, fileHandle, fileName: file.name, authorName,
                        },
                    });
                }).catch(() => {
                    toast.error('Invalid GraphML file.');
                });
            };
            if (fileHandle) fr.readAsText(await fileHandle.getFile());
            else fr.readAsText(file);
        } else if (ext === 'json') {
            fr.onload = (x) => {
                try {
                    const parsed = JSON.parse(x.target.result);
                    setState({
                        type: T.ADD_GRAPH,
                        payload: {
                            projectName: parsed.projectName || file.name,
                            graphML: null,
                            fileHandle: null,
                            fileName: file.name,
                            authorName: parsed.authorName || '',
                            importedJson: parsed,
                        },
                    });
                } catch {
                    toast.error('Invalid JSON file.');
                }
            };
            fr.readAsText(file);
        } else if (ext === 'png') {
            fr.onload = (x) => {
                try {
                    const buffer = new Uint8Array(x.target.result);
                    const chunks = extractChunks(buffer);
                    const textChunks = chunks.filter((c) => c.name === 'tEXt').map((c) => textChunk.decode(c));
                    const graphMLMeta = textChunks.find((c) => c.keyword === 'graphml');
                    if (graphMLMeta && graphMLMeta.text) {
                        parser(graphMLMeta.text).then(({ authorName }) => {
                            setState({
                                type: T.ADD_GRAPH,
                                payload: {
                                    projectName,
                                    graphML: graphMLMeta.text,
                                    fileHandle: null,
                                    fileName: file.name,
                                    authorName,
                                },
                            });
                            toast.success('Imported embedded GraphML from Image!');
                        }).catch(() => toast.error('Embedded GraphML inside PNG is invalid.'));
                    } else {
                        toast.error('This PNG does not contain an embedded GraphML Workflow.');
                    }
                } catch (err) {
                    toast.error('Could not parse the PNG file.');
                }
            };
            if (fileHandle) fr.readAsArrayBuffer(await fileHandle.getFile());
            else fr.readAsArrayBuffer(file);
        } else if (ext === 'svg') {
            fr.onload = (x) => {
                try {
                    const parserDOM = new DOMParser();
                    const svgDoc = parserDOM.parseFromString(x.target.result, 'image/svg+xml');
                    const metadata = svgDoc.getElementsByTagName('metadata')[0];
                    const graphML = metadata ? metadata.getAttribute('data-graphml') : null;
                    if (graphML) {
                        parser(graphML).then(({ authorName }) => {
                            setState({
                                type: T.ADD_GRAPH,
                                payload: {
                                    projectName,
                                    graphML,
                                    fileHandle: null,
                                    fileName: file.name,
                                    authorName,
                                },
                            });
                            toast.success('Imported embedded GraphML from SVG!');
                        }).catch(() => toast.error('Embedded GraphML inside SVG is invalid.'));
                    } else {
                        toast.error('This SVG does not contain an embedded GraphML Workflow.');
                    }
                } catch (err) {
                    toast.error('Could not parse the SVG file.');
                }
            };
            if (fileHandle) fr.readAsText(await fileHandle.getFile());
            else fr.readAsText(file);
        } else if (ext === 'jpg' || ext === 'jpeg') {
            fr.onload = (x) => {
                try {
                    const buffer = new Uint8Array(x.target.result);
                    let pos = 2; // skip SOI
                    let graphMLData = '';
                    while (pos < buffer.length) {
                        if (buffer[pos] !== 0xFF) break;
                        const marker = buffer[pos + 1];
                        if (marker === 0xDA) break; // SOS - Start of Scan
                        const len = (buffer[pos + 2] * 256) + buffer[pos + 3];
                        if (marker === 0xFE) { // COM Comment segment
                            graphMLData += new TextDecoder().decode(buffer.slice(pos + 4, pos + 2 + len));
                        }
                        pos += 2 + len;
                    }

                    if (graphMLData) {
                        parser(graphMLData).then(({ authorName }) => {
                            setState({
                                type: T.ADD_GRAPH,
                                payload: {
                                    projectName,
                                    graphML: graphMLData,
                                    fileHandle: null,
                                    fileName: file.name,
                                    authorName,
                                },
                            });
                            toast.success('Imported embedded GraphML from JPEG!');
                        }).catch(() => toast.error('Embedded GraphML inside JPEG is invalid.'));
                    } else {
                        toast.error('This JPEG does not contain an embedded GraphML Workflow.');
                    }
                } catch (err) {
                    toast.error('Could not parse the JPEG file.');
                }
            };
            if (fileHandle) fr.readAsArrayBuffer(await fileHandle.getFile());
            else fr.readAsArrayBuffer(file);
        }
    }
};

const readTextFile = (state, setState, file, fileHandle) => {
    if (file) {
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB`);
            return;
        }
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
    if (getGraphFun(state)) getGraphFun(state).redo();
};

const copySelected = (state, dispatcher) => {
    if (!getGraphFun(state)) return;
    const nodes = getGraphFun(state).copySelected();
    if (nodes.length) dispatcher({ type: T.SET_CLIPBOARD, payload: nodes });
};

const pasteClipboard = (state) => {
    if (!getGraphFun(state) || !state.clipboard.length) return;
    getGraphFun(state).pasteClipboard(state.clipboard);
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

const openSearchPanel = (state, setState) => {
    setState({ type: T.SET_SEARCH_PANEL, payload: true });
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
    copySelected, pasteClipboard,
    toggleServer, optionModalToggle, contribute, openSearchPanel, saveAsJson,
};

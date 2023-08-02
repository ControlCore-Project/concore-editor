import T from './actionType';
import NodeDetails from '../component/modals/NodeDetails';
import EdgeDetails from '../component/modals/EdgeDetails';
import { NodeStyle, EdgeStyle } from '../config/defaultStyles';
import { initialGraphState } from './initialState';

const reducer = (state, action) => {
    switch (action.type) {
    case T.Model_Open_Create_Node:
        return {
            ...state,
            ModelOpen: true,
            modalPayload: {
                title: 'Create Node',
                submitText: 'Create Node',
                type: 'Node',
                Children: NodeDetails,
                defaultStyle: NodeStyle,
                defaultLabel: '',
                labelAllowed: true,
                cb: action.cb,
            },
        };
    case T.Model_Open_Create_Edge:
        return {
            ...state,
            ModelOpen: true,
            modalPayload: {
                title: 'Create Edge',
                submitText: 'Create Edge',
                Children: EdgeDetails,
                defaultStyle: EdgeStyle,
                defaultLabel: '',
                labelAllowed: true,
                cb: action.cb,
            },
        };
    case T.Model_Open_Update_Node: {
        return {
            ...state,
            ModelOpen: true,
            modalPayload: {
                title: 'Edit Node',
                submitText: 'Edit Node',
                type: 'Node',
                Children: NodeDetails,
                defaultStyle: action.style,
                defaultLabel: action.label,
                labelAllowed: action.labelAllowed,
                cb: action.cb,
            },
        };
    }
    case T.Model_Open_Update_Edge: {
        return {
            ...state,
            ModelOpen: true,
            modalPayload: {
                title: 'Edit Edge',
                submitText: 'Edit Edge',
                Children: EdgeDetails,
                defaultStyle: action.style,
                defaultLabel: action.label,
                labelAllowed: action.labelAllowed,
                cb: action.cb,
            },
        };
    }
    case T.SET_CONTRIBUTE_MODAL: {
        return { ...state, contributeModal: action.payload };
    }
    case T.Model_Close: return { ...state, ModelOpen: false };
    case T.ELE_SELECTED: return { ...state, eleSelected: true, eleSelectedPayload: action.payload };
    case T.ELE_UNSELECTED: return { ...state, eleSelected: false };
    case T.TURN_DRAW: return { ...state, drawModeOn: action.payload };

    case T.SET_UNDO: return { ...state, undoEnabled: action.payload };
    case T.SET_REDO: return { ...state, redoEnabled: action.payload };

    case T.ADD_GRAPH: {
        let foundi = -1;
        const graphID = action.payload.graphID || new Date().getTime().toString();
        state.graphs.forEach((g, i) => {
            if ((g.graphID && g.graphID === graphID) || (g.serverID && g.serverID === action.payload.serverID)) {
                foundi = i;
            }
        });
        if (foundi !== -1) {
            return { ...state, newGraphModal: false, curGraphIndex: foundi };
        }
        return {
            ...state,
            newGraphModal: false,
            curGraphIndex: state.graphs.length,
            graphs: [
                ...state.graphs,
                {
                    ...initialGraphState,
                    projectName: action.payload.projectName,
                    graphID,
                    serverID: action.payload.serverID,
                    graphML: action.payload.graphML,
                    fileHandle: action.payload.fileHandle || null,
                    fileName: action.payload.fileName,
                    authorName: action.payload.authorName || '',
                },
            ],
        };
    }
    case T.ADD_GRAPH_BULK: {
        return { ...state, graphs: [...state.graphs, ...action.payload] };
    }
    case T.SET_CUR_INSTANCE: {
        return { ...state, curGraphInstance: action.payload };
    }
    case T.SET_CUR_INDEX: {
        return { ...state, curGraphIndex: action.payload };
    }
    case T.CHANGE_TAB: return { ...state, curGraphIndex: action.payload };

    case T.NEW_GRAPH: return { ...state, newGraphModal: true };
    case T.REMOVE_GRAPH: return {
        ...state,
        graphs: state.graphs.filter((e, i) => i !== action.payload),
        curGraphIndex: state.curGraphIndex < action.payload
            ? state.curGraphIndex
            : Math.max(0, state.curGraphIndex - 1),
    };

    case T.SET_PROJECT_DETAILS: {
        const newState = { ...state };
        newState.graphs = newState.graphs.map((g) => (
            g.graphID === action.payload.graphID ? { ...g, [action.payload.type]: action.payload.value }
                : g
        ));
        return { ...newState };
    }

    case T.SET_SHARE_MODAL: {
        return { ...state, shareModal: action.payload };
    }

    case T.SET_OPTIONS_MODAL: {
        return { ...state, optionsModal: action.payload };
    }

    case T.SET_FILE_STATE: {
        return { ...state, fileState: action.payload };
    }

    case T.SET_SETTING_MODAL: {
        return { ...state, settingsModal: action.payload };
    }

    case T.SET_MARKDOWN_MODAL: {
        return { ...state, markDownModal: action.payload };
    }

    case T.SET_INPUT_FILE: {
        return { ...state, inputFile: action.payload.content, inputFileName: action.payload.fname };
    }

    case T.SET_FILE_REF: {
        return { ...state, fileRef: action.payload };
    }

    case T.SET_OPTIONS: {
        return {
            ...state,
            dockerCheck: action.payload.docker,
            unlockCheck: action.payload.unlock,
            params: action.payload.param,
            maxTime: action.payload.maxT,
            octave: action.payload.octave,
            library: action.payload.library,
        };
    }

    case T.SET_FILE_HANDLE: {
        const newState = { ...state };
        newState.graphs = newState.graphs.map((g, index) => (
            index === action.payload.curGraphIndex ? { ...g, fileHandle: action.payload.fileHandle }
                : g
        ));
        return { ...newState };
    }

    case T.SET_HISTORY_MODAL: {
        return { ...state, viewHistory: action.payload };
    }

    case T.SET_AUTHOR: {
        const newState = { ...state };
        newState.graphs = newState.graphs.map((g) => (
            g.graphID === action.payload.graphID ? { ...g, [action.payload.type]: action.payload.value } : g
        ));
        return { ...newState };
    }

    case T.IS_WORKFLOW_ON_SERVER: {
        return { ...state, isWorkflowOnServer: action.payload };
    }
    case T.SET_ZOOM_LEVEL: {
        return { ...state, zoomLevel: action.payload };
    }
    case T.SET_EDIT_DETAILS_MODAL: {
        return { ...state, editDetailsModal: action.payload };
    }
    case T.SET_NEW_GRAPH_MODAL: {
        return { ...state, newGraphModal: action.payload };
    }
    case T.CHANGE_RESET: {
        return { ...state, resetEnabled: action.payload };
    }
    case T.SET_LOGS_MESSAGE: {
        return { ...state, logsmessage: action.payload };
    }
    case T.SET_LOGS: {
        return { ...state, logs: action.payload };
    }

    case T.EDIT_TEXTFILE: {
        return {
            ...state,
            textFileModal: action.payload.show,
            fileObj: action.payload.fileObj,
            fileHandle: action.payload.fileHandle,
        };
    }

    case T.SET_DIR_NAME: {
        return { ...state, uploadedDirName: action.payload };
    }

    case T.SET_FUNCTIONS: {
        const newState = { ...state };
        newState.graphs[state.curGraphIndex].built = action.payload.built;
        newState.graphs[state.curGraphIndex].debugged = action.payload.debugged;
        newState.graphs[state.curGraphIndex].ran = action.payload.ran;
        newState.graphs[state.curGraphIndex].cleared = action.payload.cleared;
        newState.graphs[state.curGraphIndex].destroyed = action.payload.destroyed;
        newState.graphs[state.curGraphIndex].stopped = action.payload.stopped;
        return { ...newState };
    }

    default:
        return state;
    }
};
export default reducer;

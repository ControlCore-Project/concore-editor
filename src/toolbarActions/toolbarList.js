/* eslint-disable no-alert */
import {
    FaSave, FaUndo, FaRedo, FaTrash, FaFileImport, FaPlus, FaDownload, FaEdit, FaRegTimesCircle, FaHistory,
    FaHammer, FaBug, FaBomb, FaToggleOn, FaThermometerEmpty, FaTrashRestore,
} from 'react-icons/fa';

import {
    // FiChevronDown, FiChevronsDown, FiChevronsUp, FiChevronUp,
    FiPlay, FiStopCircle, FiToggleLeft, FiTriangle,
} from 'react-icons/fi';

import {
    createNode, editElement, deleteElem, downloadImg, saveAction, saveGraphMLFile,
    createFile, readFile, clearAll, undo, redo, viewHistory, resetAfterClear,
    toggleServer,
    // openSettingModal,
} from './toolbarFunctions';

const toolbarList = (state, dispatcher) => [
    {
        type: 'action',
        text: 'Node',
        icon: FaPlus,
        action: createNode,
        active: state.curGraphInstance,
        visibility: true,
        hotkey: 'Ctrl+G',
    },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'Create',
        icon: FaFileImport,
        action: createFile,
        active: true,
        visibility: true,
    },
    {
        type: 'file-upload',
        text: 'Open',
        icon: FaFileImport,
        action: readFile,
        active: true,
        visibility: true,
        hotkey: 'Ctrl+O',
    },
    {
        type: 'action',
        text: 'Save',
        icon: FaSave,
        action: saveGraphMLFile,
        active: state.curGraphInstance,
        visibility: true,
    },
    {
        type: 'action',
        text: 'Save As',
        icon: FaSave,
        action: (s, d) => saveAction(s, d),
        active: state.curGraphInstance,
        visibility: true,
    },
    {
        type: 'action',
        text: 'Empty',
        icon: FaThermometerEmpty,
        action: clearAll,
        active: state.curGraphInstance && !state.resetEnabled,
        visibility: true,
        hotkey: 'Ctrl+Backspace',
    },
    {
        type: 'action',
        text: 'Restore',
        icon: FaTrashRestore,
        action: resetAfterClear,
        active: state.curGraphInstance && state.resetEnabled,
        visibility: true,
        hotkey: 'Ctrl+I',
    },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'Undo',
        icon: FaUndo,
        action: undo,
        active: state.undoEnabled && state.curGraphInstance && !state.resetEnabled,
        visibility: true,
        hotkey: 'Ctrl+Z',
    },
    {
        type: 'action',
        text: 'Redo',
        icon: FaRedo,
        action: redo,
        active: state.redoEnabled && state.curGraphInstance && !state.resetEnabled,
        visibility: true,
        hotkey: 'Ctrl+Shift+Z,Ctrl+Y',
    },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'Edit',
        icon: FaEdit,
        action: editElement,
        active: state.curGraphInstance && state.eleSelected,
        visibility: true,
        hotkey: 'Ctrl+E',
    },
    {
        type: 'action',
        text: 'Delete',
        icon: FaTrash,
        action: () => deleteElem(state, dispatcher),
        active: state.eleSelected,
        visibility: true,
        hotkey: 'Delete,Backspace,Del,Clear',
    },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'History',
        icon: FaHistory,
        action: viewHistory,
        active: state.curGraphInstance,
        visibility: true,
    },
    { type: 'vsep' },
    // server buttons
    {
        type: 'action',
        text: 'Server',
        icon: state.isWorkflowOnServer ? FaToggleOn : FiToggleLeft,
        action: () => toggleServer(state, dispatcher),
        active: true,
        visibility: true,
    },
    {
        type: 'action',
        text: 'Build',
        icon: FaHammer,
        action: () => state.curGraphInstance && state.curGraphInstance.build(),
        active: state.isWorkflowOnServer,
        visibility: state.isWorkflowOnServer,
    },
    {
        type: 'action',
        text: 'Debug',
        icon: FaBug,
        action: () => state.curGraphInstance && state.curGraphInstance.debug(),
        active: state.isWorkflowOnServer,
        visibility: state.isWorkflowOnServer,
    },
    {
        type: 'action',
        text: 'Run',
        icon: FiPlay,
        action: () => state.curGraphInstance && state.curGraphInstance.run(),
        active: state.isWorkflowOnServer,
        visibility: state.isWorkflowOnServer,
    },
    {
        type: 'action',
        text: 'Clear',
        icon: FaRegTimesCircle,
        action: () => state.curGraphInstance && state.curGraphInstance.clear(),
        active: state.isWorkflowOnServer,
        visibility: state.isWorkflowOnServer,
    },
    {
        type: 'action',
        text: 'Stop',
        icon: FiStopCircle,
        action: () => state.curGraphInstance && state.curGraphInstance.stop(),
        active: state.isWorkflowOnServer,
        visibility: state.isWorkflowOnServer,
    },
    {
        type: 'action',
        text: 'Destroy',
        icon: FaBomb,
        action: () => state.curGraphInstance && state.curGraphInstance.destroy(),
        active: state.isWorkflowOnServer,
        visibility: state.isWorkflowOnServer,
    },

    // Not being implemented in version 1
    // {
    //     type: 'action',
    //     text: 'Push',
    //     icon: FiChevronUp,
    //     action: () => state.curGraphInstance && state.curGraphInstance.pushToServer(),
    //     active: state.curGraphInstance && state.isWorkflowOnServer,
    // },
    // {
    //     type: 'action',
    //     text: 'Pull',
    //     icon: FiChevronDown,
    //     action: () => state.curGraphInstance && state.curGraphInstance.pullFromServer(),
    //     active: state.curGraphInstance && state.isWorkflowOnServer,
    // },
    // {
    //     type: 'action',
    //     text: 'Force Push',
    //     icon: FiChevronsUp,
    //     action: () => state.curGraphInstance && state.curGraphInstance.forcePushToServer(),
    //     active: state.curGraphInstance && state.isWorkflowOnServer,
    // },
    // {
    //     type: 'action',
    //     text: 'Force Pull',
    //     icon: FiChevronsDown,
    //     action: () => state.curGraphInstance && state.curGraphInstance.forcePullFromServer(),
    //     active: state.curGraphInstance && state.isWorkflowOnServer,
    // },
    // { type: 'vsep' },
    { type: 'space' },
    // Not being implemented in version 1
    // {
    //     type: 'action',
    //     text: 'Settings',
    //     icon: FaRegSun,
    //     action: openSettingModal,
    //     active: true,
    // },
    {
        type: 'action',
        text: 'Contribute',
        icon: FiTriangle,
        action: () => { window.open('https://github.com/ControlCore-Project/concore', '_blank'); },
        active: state.curGraphInstance || state.uploadedDirName,
        visibility: true,
    },
    // {
    //     type: 'action',
    //     text: 'Share',
    //     icon: FaShare,
    //     action: openShareModal,
    //     active: true,
    //     visibility: true,
    // },
    {
        type: state.curGraphInstance ? 'menu' : 'action',
        text: 'Export',
        icon: FaDownload,
        action: (s, d) => [
            { fn: () => downloadImg(s, d, 'JPG'), name: 'JPG' },
            { fn: () => downloadImg(s, d, 'PNG'), name: 'PNG' },
        ],
        visibility: true,
        active: state.curGraphInstance,
    },
    { type: 'vsep' },
];

export default toolbarList;

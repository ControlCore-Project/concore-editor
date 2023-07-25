const initialState = {
    ModelOpen: false,
    modalPayload: {
        cb: () => {},
        title: '',
        submitText: '',
        Children: '',
        defaultStyle: {},
        defaultLabel: '',
        labelAllowed: null,
    },
    shareModal: false,
    settingsModal: false,
    editDetailsModal: false,
    newGraphModal: false,
    optionsModal: false,
    markDownModal: false,
    eleSelected: false,
    drawModeOn: true,
    undoEnabled: false,
    redoEnabled: false,
    graphs: [],
    curGraphIndex: -1,
    viewHistory: false,
    isWorkflowOnServer: false,
    curGraphInstance: null,
    zoomLevel: 100,
    uploadedDirName: null,
    resetEnabled: false,
    fileState: [],
    inputFile: '',
    params: '',
    maxTime: '',
    dockerCheck: false,
    unlockCheck: false,
    octave: false,
    logs: false,
    logsmessage: '',
};

const initialGraphState = {
    projectName: '',
    graphID: null,
    serverID: null,
    graphML: null,
    authorName: '',
    component: null,
    instance: null,
    id: null,
    fileHandle: null,
    fileName: null,
    built: true,
    debugged: false,
    ran: false,
    destroyed: false,
    cleared: false,
    stopped: false,
};

export { initialState, initialGraphState };

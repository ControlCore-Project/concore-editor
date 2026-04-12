import { toast } from 'react-toastify';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
    },
}));

const loadManager = async () => {
    jest.resetModules();
    // eslint-disable-next-line global-require
    const manager = require('./local-storage-manager').default;
    await manager.initialize();
    return manager;
};

describe('localStorageManager fallback/session behavior', () => {
    let originalIndexedDB;

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        originalIndexedDB = window.indexedDB;
        Object.defineProperty(window, 'indexedDB', {
            configurable: true,
            writable: true,
            value: undefined,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'indexedDB', {
            configurable: true,
            writable: true,
            value: originalIndexedDB,
        });
    });

    test('restores legacy graphs from localStorage when indexedDB is unavailable', async () => {
        const allGraphsKey = window.btoa('ALL_GRAPHS');
        const graphID = 'graph-1';
        const graphPayload = {
            id: graphID,
            projectName: 'Workflow 1',
            nodes: [],
            edges: [],
            actionHistory: [{ actionName: 'ADD_NODE', parameters: '{}' }],
        };

        localStorage.setItem(allGraphsKey, window.btoa(JSON.stringify([graphID])));
        localStorage.setItem(graphID, window.btoa(JSON.stringify(graphPayload)));

        const manager = await loadManager();

        expect(manager.getAllGraphs()).toEqual([graphID]);
        expect(manager.get(graphID)).toEqual(graphPayload);
    });

    test('persists and restores session metadata in fallback mode', async () => {
        const manager = await loadManager();
        const session = {
            openGraphIDs: ['g1', 'g2'],
            activeGraphID: 'g2',
            fileState: [{ key: 'demo/main.py', modified: 1, size: 12, fileName: 'main.py' }],
            uploadedDirName: 'demo',
        };

        manager.saveSession(session);

        expect(manager.getSession()).toEqual(session);
    });

    test('keeps full actionHistory when saving graph content', async () => {
        const manager = await loadManager();
        const graphID = 'graph-history';
        const graphPayload = {
            id: graphID,
            projectName: 'Workflow history',
            nodes: [],
            edges: [],
            actionHistory: [
                { actionName: 'ADD_NODE', parameters: '{}' },
                { actionName: 'ADD_EDGE', parameters: '{}' },
            ],
        };

        manager.save(graphID, graphPayload);

        const stored = JSON.parse(window.atob(localStorage.getItem(graphID)));
        expect(stored.actionHistory).toHaveLength(2);
        expect(toast.error).not.toHaveBeenCalled();
    });

    test('skips corrupted graph records and keeps valid records accessible', async () => {
        const allGraphsKey = window.btoa('ALL_GRAPHS');
        const validGraphID = 'graph-valid';
        const corruptedGraphID = 'graph-corrupted';
        const validPayload = {
            id: validGraphID,
            projectName: 'Healthy workflow',
            nodes: [],
            edges: [],
            actionHistory: [],
        };

        localStorage.setItem(allGraphsKey, window.btoa(JSON.stringify([validGraphID, corruptedGraphID])));
        localStorage.setItem(validGraphID, window.btoa(JSON.stringify(validPayload)));
        localStorage.setItem(corruptedGraphID, window.btoa(JSON.stringify({ broken: true })));

        const manager = await loadManager();

        expect(manager.get(validGraphID)).toEqual(validPayload);
        expect(manager.get(corruptedGraphID)).toBeNull();
    });
});

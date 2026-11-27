import { toast } from 'react-toastify';
import Axios from 'axios';
import { actionType as T } from '../../reducer';
import serverConConfig, { EXECUTION_ENGINE_URL } from '../../serverCon/config';
import GraphLoadSave from './5-load-save';
// import {
//     postGraph, updateGraph, forceUpdateGraph, getGraph, getGraphWithHashCheck,
// } from '../../serverCon/crud_http';
import {
    postGraph, updateGraph, forceUpdateGraph, getGraph, getGraphWithHashCheck,
} from '../../serverCon/crud_http';

class GraphServer extends GraphLoadSave {
    static getLatestHashFromGraphML(graphXML) {
        if (!graphXML) return '';
        try {
            const doc = new DOMParser().parseFromString(graphXML, 'application/xml');
            const hashes = doc.getElementsByTagName('hash');
            if (!hashes.length) return '';
            return hashes[hashes.length - 1].textContent || '';
        } catch {
            return '';
        }
    }

    static getErrorMessage(err) {
        return err?.data?.message || err?.response?.data?.message || err?.message || 'Sync failed';
    }

    static isSyncConflictError(err) {
        return err?.code === 'SYNC_CONFLICT'
            || err?.data?.code === 'SYNC_CONFLICT'
            || (err?.status === 400 && err?.body === 'Different History');
    }

    getLocalHash() {
        return this.actionArr.length ? this.actionArr.at(-1).hash : '';
    }

    setSyncStatus(syncStatus) {
        this.dispatcher({
            type: T.SET_GRAPH_SYNC_STATE,
            payload: {
                graphID: this.id,
                syncStatus,
            },
        });
    }

    setSyncStateFromSavedFlag() {
        const state = this.serverID && this.isSaved ? 'synced' : 'dirty';
        let lastResult = 'Local workflow.';
        if (this.serverID) {
            lastResult = this.isSaved ? 'Synced.' : 'Local changes pending sync.';
        }
        this.setSyncStatus({
            state,
            localHash: this.getLocalHash(),
            lastResult,
        });
    }

    setSyncError(err) {
        const message = GraphServer.getErrorMessage(err);
        this.setSyncStatus({
            state: 'error',
            localHash: this.getLocalHash(),
            lastResult: message,
            reason: message,
        });
        toast.error(message);
    }

    syncSuccessFromGraphML(resultText, graphXML) {
        const remoteHash = GraphServer.getLatestHashFromGraphML(graphXML);
        this.setSyncStatus({
            state: 'synced',
            localHash: remoteHash || this.getLocalHash(),
            remoteHash: remoteHash || this.getLocalHash(),
            lastResult: resultText,
            reason: '',
        });
    }

    openRemoteInNewTab() {
        if (!this.serverID) return;
        const remotePath = serverConConfig.getGraph(this.serverID);
        const remoteURL = `${serverConConfig.baseURL}${remotePath}`;
        window.open(remoteURL, '_blank', 'noopener,noreferrer');
    }

    cancelSyncConflict() {
        const state = this.serverID && this.isSaved ? 'synced' : 'dirty';
        this.setSyncStatus({
            state,
            localHash: this.getLocalHash(),
            lastResult: 'Conflict dismissed.',
            reason: '',
        });
    }

    showSyncConflictModal(reason) {
        const localHash = this.getLocalHash() || 'None';
        const setModal = (remoteHash) => {
            this.setSyncStatus({
                state: 'conflict',
                localHash: this.getLocalHash(),
                remoteHash: remoteHash || '',
                lastResult: reason || 'Sync conflict detected.',
                reason: reason || 'Sync conflict detected.',
            });
            const message = [
                reason || 'Sync conflict detected.',
                `Local hash: ${localHash}`,
                `Remote hash: ${remoteHash || 'Remote history is newer/different'}`,
                'Choose how to resolve this conflict.',
            ].join('\n');
            this.dispatcher({
                type: T.SET_CONFIRM_MODAL,
                payload: {
                    open: true,
                    message,
                    actions: [
                        {
                            label: 'Pull remote',
                            className: 'confirm-btn',
                            onClick: () => this.forcePullFromServer(),
                        },
                        {
                            label: 'Force push local',
                            className: 'confirm-btn',
                            onClick: () => {
                                this.setSyncStatus({
                                    state: 'syncing',
                                    localHash: this.getLocalHash(),
                                    lastResult: 'Force pushing local changes...',
                                });
                                if (this.serverID) {
                                    forceUpdateGraph(this.serverID, this.getGraphML()).then(() => {
                                        this.syncSuccessFromGraphML('Force push successful.', this.getGraphML());
                                    }).catch((err) => {
                                        this.setSyncError(err);
                                    });
                                } else {
                                    postGraph(this.getGraphML()).then((serverID) => {
                                        this.set({ serverID });
                                        this.syncSuccessFromGraphML('Force push successful.', this.getGraphML());
                                    }).catch((err) => {
                                        this.setSyncError(err);
                                    });
                                }
                            },
                        },
                        {
                            label: 'Open remote in new tab',
                            className: 'cancel-btn',
                            onClick: () => this.openRemoteInNewTab(),
                        },
                        {
                            label: 'Cancel',
                            className: 'cancel-btn',
                            onClick: () => this.cancelSyncConflict(),
                        },
                    ],
                },
            });
        };
        if (!this.serverID) {
            setModal('Unknown');
            return;
        }
        getGraph(this.serverID).then((graphXML) => {
            try {
                const doc = new DOMParser().parseFromString(graphXML, 'application/xml');
                const hashes = doc.getElementsByTagName('hash');
                setModal(hashes.length ? (hashes[hashes.length - 1].textContent || '') : '');
            } catch {
                setModal('Unavailable');
            }
        }).catch(() => {
            setModal('Unavailable');
        });
    }

    set(config) {
        const { serverID } = config;
        super.set(config);
        if (serverID) {
            this.setServerID(serverID);
            this.dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: Boolean(this.serverID) });
            this.setSyncStatus({
                state: 'dirty',
                localHash: this.getLocalHash(),
                lastResult: 'Connected to server.',
            });
        }
    }
    // Not being immplemented in version 1
    // pushToServer() {
    //     if (this.serverID) {
    //         updateGraph(this.serverID, this.getGraphML()).then(() => {

    //         });
    //     } else {
    //         postGraph(this.getGraphML()).then((serverID) => {
    //             this.set({ serverID });
    //             this.cy.emit('graph-modified');
    //         });
    //     }
    // }

    // forcePushToServer() {
    //     if (this.serverID) {
    //         forceUpdateGraph(this.serverID, this.getGraphML()).then(() => {

    //         });
    //     } else {
    //         postGraph(this.getGraphML()).then((serverID) => {
    //             this.set({ serverID });
    //         });
    //     }
    // }

    // forcePullFromServer() {
    //     if (this.serverID) {
    //         getGraph(this.serverID).then((graphXML) => {
    //             this.setGraphML(graphXML);
    //         });
    //     } else {
    //         toast.success('Not on server');
    //     }
    // }

    // pullFromServer() {
    //     if (this.actionArr.length === 0) { this.forcePullFromServer(); return; }
    //     if (this.serverID) {
    //         getGraphWithHashCheck(this.serverID, this.actionArr.at(-1).hash).then((graphXML) => {
    //             this.setGraphML(graphXML);
    //         }).catch(() => {

    //         });
    //     } else {
    //         toast.success('Not on server');
    //     }
    // }

    pushToServer() {
        this.setSyncStatus({
            state: 'syncing',
            localHash: this.getLocalHash(),
            lastResult: 'Pushing local changes...',
        });
        if (this.serverID) {
            updateGraph(this.serverID, this.getGraphML()).then(() => {
                this.syncSuccessFromGraphML('Push successful.', this.getGraphML());
            }).catch((err) => {
                if (GraphServer.isSyncConflictError(err)) {
                    this.showSyncConflictModal('Cannot push: local and remote histories diverged.');
                    return;
                }
                this.setSyncError(err);
            });
        } else {
            postGraph(this.getGraphML()).then((serverID) => {
                this.set({ serverID });
                this.cy.emit('graph-modified');
                this.syncSuccessFromGraphML('Push successful.', this.getGraphML());
            }).catch((err) => {
                this.setSyncError(err);
            });
        }
    }

    forcePushToServer() {
        this.dispatcher({
            type: T.SET_CONFIRM_MODAL,
            payload: {
                open: true,
                message: 'Forced push may result in workflow overwite and loss of changes pushed by others. Confirm?',
                onConfirm: () => {
                    this.setSyncStatus({
                        state: 'syncing',
                        localHash: this.getLocalHash(),
                        lastResult: 'Force pushing local changes...',
                    });
                    if (this.serverID) {
                        forceUpdateGraph(this.serverID, this.getGraphML()).then(() => {
                            this.syncSuccessFromGraphML('Force push successful.', this.getGraphML());
                        }).catch((err) => {
                            this.setSyncError(err);
                        });
                    } else {
                        postGraph(this.getGraphML()).then((serverID) => {
                            this.set({ serverID });
                            this.syncSuccessFromGraphML('Force push successful.', this.getGraphML());
                        }).catch((err) => {
                            this.setSyncError(err);
                        });
                    }
                },
            },
        });
    }

    forcePullFromServer() {
        if (this.serverID) {
            this.setSyncStatus({
                state: 'syncing',
                localHash: this.getLocalHash(),
                lastResult: 'Pulling remote workflow...',
            });
            getGraph(this.serverID).then((graphXML) => {
                this.setGraphML(graphXML);
                this.syncSuccessFromGraphML('Pull successful.', graphXML);
            }).catch((err) => {
                this.setSyncError(err);
            });
        } else {
            toast.success('Not on server');
        }
    }

    pullFromServer() {
        if (this.actionArr.length === 0) { this.forcePullFromServer(); return; }
        if (this.serverID) {
            this.setSyncStatus({
                state: 'syncing',
                localHash: this.getLocalHash(),
                lastResult: 'Checking remote changes...',
            });
            getGraphWithHashCheck(this.serverID, this.actionArr.at(-1).hash).then((graphXML) => {
                this.setGraphML(graphXML);
                this.syncSuccessFromGraphML('Pull successful.', graphXML);
            }).catch((err) => {
                if (GraphServer.isSyncConflictError(err)) {
                    this.showSyncConflictModal('Cannot pull: local and remote histories diverged.');
                    return;
                }
                this.setSyncError(err);
            });
        } else {
            toast.success('Not on server');
        }
    }

    serverAction(method, url, successPayload, onSuccess) {
        const toastId = toast.info('LOADING.......', {
            position: 'bottom-left',
            autoClose: false,
        });
        this.dispatcher({ type: T.SET_LOGS, payload: false });
        Axios[method](url)
            .then((res) => { // eslint-disable-next-line
                toast.success(res.data['message']);
                if (successPayload) {
                    this.dispatcher({ type: T.SET_FUNCTIONS, payload: successPayload });
                }
                if (onSuccess) onSuccess(res);
                toast.dismiss(toastId);
            }).catch((err) => { // eslint-disable-next-line
                toast.error(err.response?.data?.message || err.message);
                toast.dismiss(toastId);
            });
    }

    getCurrentGraphName() {
        const currentGraph = this.superState.graphs[this.superState.curGraphIndex];
        if (!currentGraph || typeof currentGraph.fileName !== 'string' || !currentGraph.fileName.trim()) {
            toast.error('Open a GraphML file before using server actions.');
            return null;
        }
        return currentGraph.fileName.trim().split('.')[0];
    }

    build() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const query = new URLSearchParams({
            fetch: graphName,
            unlock: this.superState.unlockCheck,
            docker: this.superState.dockerCheck,
            maxtime: this.superState.maxTime,
            params: this.superState.params,
            octave: this.superState.octave,
        });
        const url = `${EXECUTION_ENGINE_URL}/build/${encodeURIComponent(this.superState.uploadedDirName)}`
            + `?${query.toString()}`;
        this.serverAction('post', url, {
            built: false, ran: true, debugged: true, cleared: false, stopped: false, destroyed: true,
        }, (res) => {
            this.dispatcher({ type: T.SET_LOGS_MESSAGE, payload: this.superState.logsmessage + res.data.output });
        });
    }

    debug() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const url = `${EXECUTION_ENGINE_URL}/debug/${encodeURIComponent(graphName)}`;
        this.serverAction('post', url, {
            built: false, ran: false, debugged: false, cleared: true, stopped: true, destroyed: true,
        });
    }

    run() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const url = `${EXECUTION_ENGINE_URL}/run/${encodeURIComponent(graphName)}`;
        this.serverAction('post', url, {
            built: false, ran: false, debugged: false, cleared: true, stopped: true, destroyed: true,
        });
    }

    clear() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const query = new URLSearchParams({
            unlock: this.superState.unlockCheck,
            maxtime: this.superState.maxTime,
            params: this.superState.params,
        });
        const url = `${EXECUTION_ENGINE_URL}/clear/${encodeURIComponent(graphName)}`
            + `?${query.toString()}`;
        this.serverAction('post', url, {
            built: false, ran: true, debugged: true, cleared: false, stopped: true, destroyed: true,
        });
    }

    stop() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const url = `${EXECUTION_ENGINE_URL}/stop/${encodeURIComponent(graphName)}`;
        this.serverAction('post', url, {
            built: false, ran: false, debugged: false, cleared: true, stopped: false, destroyed: true,
        });
    }

    destroy() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const url = `${EXECUTION_ENGINE_URL}/destroy/${encodeURIComponent(graphName)}`;
        this.serverAction('delete', url, {
            built: true, ran: false, debugged: false, cleared: false, stopped: false, destroyed: false,
        });
    }

    library(fileName) {
        const query = new URLSearchParams({
            filename: fileName,
            path: this.superState.library,
        });
        const url = `${EXECUTION_ENGINE_URL}/library/${encodeURIComponent(this.superState.uploadedDirName)}`
            + `?${query.toString()}`;
        this.serverAction('post', url, null);
    }

    setCurStatus() {
        super.setCurStatus();
        this.dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: Boolean(this.serverID) });
        const currentGraph = this.superState.graphs.find((g) => g.graphID === this.id);
        if (!currentGraph || !currentGraph.syncStatus || currentGraph.syncStatus.state !== 'conflict') {
            this.setSyncStateFromSavedFlag();
        } else {
            this.setSyncStatus({ localHash: this.getLocalHash() });
        }
    }
}

export default GraphServer;

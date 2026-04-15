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
    static isSyncConflictError(err) {
        const msg = (err && err.message ? err.message : '').toLowerCase();
        return msg.includes('different history')
            || msg.includes('latest changes')
            || msg.includes('can not update');
    }

    showSyncConflictModal(reason) {
        const localHash = this.actionArr.length ? this.actionArr.at(-1).hash : 'None';
        const setModal = (remoteHash) => {
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
                                if (this.serverID) {
                                    forceUpdateGraph(this.serverID, this.getGraphML()).catch((err) => {
                                        toast.error(err.response?.data?.message || err.message);
                                    });
                                } else {
                                    postGraph(this.getGraphML()).then((serverID) => {
                                        this.set({ serverID });
                                    }).catch((err) => {
                                        toast.error(err.response?.data?.message || err.message);
                                    });
                                }
                            },
                        },
                        {
                            label: 'Open remote in new tab',
                            className: 'cancel-btn',
                            onClick: () => {
                                if (!this.serverID) return;
                                const remotePath = serverConConfig.getGraph(this.serverID);
                                const remoteURL = `${serverConConfig.baseURL}${remotePath}`;
                                window.open(remoteURL, '_blank', 'noopener,noreferrer');
                            },
                        },
                        {
                            label: 'Cancel',
                            className: 'cancel-btn',
                            onClick: null,
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
        if (this.serverID) {
            updateGraph(this.serverID, this.getGraphML()).then(() => {

            }).catch((err) => {
                if (GraphServer.isSyncConflictError(err)) {
                    this.showSyncConflictModal('Cannot push: local and remote histories diverged.');
                    return;
                }
                toast.error(err.response?.data?.message || err.message);
            });
        } else {
            postGraph(this.getGraphML()).then((serverID) => {
                this.set({ serverID });
                this.cy.emit('graph-modified');
            }).catch((err) => {
                toast.error(err.response?.data?.message || err.message);
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
                    if (this.serverID) {
                        forceUpdateGraph(this.serverID, this.getGraphML()).then(() => {

                        }).catch((err) => {
                            toast.error(err.response?.data?.message || err.message);
                        });
                    } else {
                        postGraph(this.getGraphML()).then((serverID) => {
                            this.set({ serverID });
                        }).catch((err) => {
                            toast.error(err.response?.data?.message || err.message);
                        });
                    }
                },
            },
        });
    }

    forcePullFromServer() {
        if (this.serverID) {
            getGraph(this.serverID).then((graphXML) => {
                this.setGraphML(graphXML);
            }).catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
        } else {
            toast.success('Not on server');
        }
    }

    pullFromServer() {
        if (this.actionArr.length === 0) { this.forcePullFromServer(); return; }
        if (this.serverID) {
            getGraphWithHashCheck(this.serverID, this.actionArr.at(-1).hash).then((graphXML) => {
                this.setGraphML(graphXML);
            }).catch((err) => {
                if (GraphServer.isSyncConflictError(err)) {
                    this.showSyncConflictModal('Cannot pull: local and remote histories diverged.');
                    return;
                }
                toast.error(err.response?.data?.message || err.message);
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
    }
}

export default GraphServer;

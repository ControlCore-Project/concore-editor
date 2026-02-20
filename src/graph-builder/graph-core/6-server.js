import { toast } from 'react-toastify';
import Axios from 'axios';
import { actionType as T } from '../../reducer';
import { EXECUTION_ENGINE_URL } from '../../serverCon/config';
import GraphLoadSave from './5-load-save';
// import {
//     postGraph, updateGraph, forceUpdateGraph, getGraph, getGraphWithHashCheck,
// } from '../../serverCon/crud_http';
import {
    postGraph, updateGraph, forceUpdateGraph, getGraph, getGraphWithHashCheck,
} from '../../serverCon/crud_http';

class GraphServer extends GraphLoadSave {
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
    //         // eslint-disable-next-line no-toast.success
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
    //         // eslint-disable-next-line no-toast.success
    //         toast.success('Not on server');
    //     }
    // }

    pushToServer() {
        if (this.serverID) {
            updateGraph(this.serverID, this.getGraphML()).then(() => {

            }).catch((err) => {
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
        // eslint-disable-next-line
        if (!window.confirm(
            'Forced push may result in workflow overwite and loss of changes pushed by others. Confirm?',
        )) return;
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
    }

    forcePullFromServer() {
        // eslint-disable-next-line
        if (!window.confirm(
            'Forced pull may result in workflow overwite and loss of unsaved changes. Confirm?',
        )) return;
        if (this.serverID) {
            getGraph(this.serverID).then((graphXML) => {
                this.setGraphML(graphXML);
            }).catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
        } else {
            // eslint-disable-next-line no-toast.success
            toast.success('Not on server');
        }
    }

    pullFromServer() {
        if (this.actionArr.length === 0) { this.forcePullFromServer(); return; }
        if (this.serverID) {
            getGraphWithHashCheck(this.serverID, this.actionArr.at(-1).hash).then((graphXML) => {
                this.setGraphML(graphXML);
            }).catch(() => {

            });
        } else {
            // eslint-disable-next-line no-toast.success
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
        const url = `${EXECUTION_ENGINE_URL}/build/${this.superState.uploadedDirName}`
            + `?fetch=${graphName}&unlock=${this.superState.unlockCheck}`
            + `&docker=${this.superState.dockerCheck}`
            + `&maxtime=${this.superState.maxTime}`
            + `&params=${this.superState.params}`
            + `&octave=${this.superState.octave}`;
        this.serverAction('post', url, {
            built: false, ran: true, debugged: true, cleared: false, stopped: false, destroyed: true,
        }, (res) => {
            this.dispatcher({ type: T.SET_LOGS_MESSAGE, payload: this.superState.logsmessage + res.data.output });
        });
    }

    debug() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const url = `${EXECUTION_ENGINE_URL}/debug/${graphName}`;
        this.serverAction('post', url, {
            built: false, ran: false, debugged: false, cleared: true, stopped: true, destroyed: true,
        });
    }

    run() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const url = `${EXECUTION_ENGINE_URL}/run/${graphName}`;
        this.serverAction('post', url, {
            built: false, ran: false, debugged: false, cleared: true, stopped: true, destroyed: true,
        });
    }

    clear() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const url = `${EXECUTION_ENGINE_URL}/clear/${graphName}`
            + `?unlock=${this.superState.unlockCheck}`
            + `&maxtime=${this.superState.maxTime}`
            + `&params=${this.superState.params}`;
        this.serverAction('post', url, {
            built: false, ran: true, debugged: true, cleared: false, stopped: true, destroyed: true,
        });
    }

    stop() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const url = `${EXECUTION_ENGINE_URL}/stop/${graphName}`;
        this.serverAction('post', url, {
            built: false, ran: false, debugged: false, cleared: true, stopped: false, destroyed: true,
        });
    }

    destroy() {
        const graphName = this.getCurrentGraphName();
        if (!graphName) return;
        const url = `${EXECUTION_ENGINE_URL}/destroy/${graphName}`;
        this.serverAction('delete', url, {
            built: true, ran: false, debugged: false, cleared: false, stopped: false, destroyed: false,
        });
    }

    library(fileName) {
        const toastId = toast.info('LOADING.......', {
            position: 'bottom-left',
            autoClose: false,
        });
        // this.dispatcher({ type: T.SET_LOGS, payload: false });
        const url = `${EXECUTION_ENGINE_URL}/library/${this.superState.uploadedDirName}`
            + `?filename=${fileName}&path=${this.superState.library}`;
        Axios.post(url)
            .then((res) => { // eslint-disable-next-line
                toast.info(res.data['message'])
                toast.dismiss(toastId);
            }).catch((err) => { // eslint-disable-next-line
                toast.error(err.response?.data?.message || err.message);
                toast.dismiss(toastId);
            });
    }

    setCurStatus() {
        super.setCurStatus();
        this.dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: Boolean(this.serverID) });
    }
}

export default GraphServer;

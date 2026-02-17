import { toast } from 'react-toastify';
import Axios from 'axios';
import { actionType as T } from '../../reducer';
import { EXECUTION_ENGINE_URL } from '../../serverCon/config';
import GraphLoadSave from './5-load-save';
// import {
//     postGraph, updateGraph, forceUpdateGraph, getGraph, getGraphWithHashCheck,
// } from '../../serverCon/crud_http';

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

    build() {
        const url = `${EXECUTION_ENGINE_URL}/build/${this.superState.uploadedDirName}?fetch=${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}&unlock=${this.superState.unlockCheck}&docker=${this.superState.dockerCheck}&maxtime=${this.superState.maxTime}&params=${this.superState.params}&octave=${this.superState.octave}`;
        this.serverAction('post', url, {
            built: false, ran: true, debugged: true, cleared: false, stopped: false, destroyed: true,
        }, (res) => {
            this.dispatcher({ type: T.SET_LOGS_MESSAGE, payload: this.superState.logsmessage + res.data.output });
        });
    }

    debug() {
        const url = `${EXECUTION_ENGINE_URL}/debug/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}`;
        this.serverAction('post', url, {
            built: false, ran: false, debugged: false, cleared: true, stopped: true, destroyed: true,
        });
    }

    run() {
        const url = `${EXECUTION_ENGINE_URL}/run/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}`;
        this.serverAction('post', url, {
            built: false, ran: false, debugged: false, cleared: true, stopped: true, destroyed: true,
        });
    }

    clear() {
        const url = `${EXECUTION_ENGINE_URL}/clear/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}?unlock=${this.superState.unlockCheck}&maxtime=${this.superState.maxTime}&params=${this.superState.params}`;
        this.serverAction('post', url, {
            built: false, ran: true, debugged: true, cleared: false, stopped: true, destroyed: true,
        });
    }

    stop() {
        const url = `${EXECUTION_ENGINE_URL}/stop/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}`;
        this.serverAction('post', url, {
            built: false, ran: false, debugged: false, cleared: true, stopped: false, destroyed: true,
        });
    }

    destroy() {
        const url = `${EXECUTION_ENGINE_URL}/destroy/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}`;
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
        Axios.post(`${EXECUTION_ENGINE_URL}/library/${this.superState.uploadedDirName}?filename=${fileName}&path=${this.superState.library}`)
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

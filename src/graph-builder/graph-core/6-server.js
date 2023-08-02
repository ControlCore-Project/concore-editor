import { toast } from 'react-toastify';
import Axios from 'axios';
import { actionType as T } from '../../reducer';
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

    build() {
        // TODO
        const toastId = toast.info('LOADING.......', {
            position: 'bottom-left',
            autoClose: false,
        });
        this.dispatcher({ type: T.SET_LOGS, payload: false });
        Axios.post(`http://127.0.0.1:5000/build/${this.superState.uploadedDirName}?fetch=${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}&unlock=${this.superState.unlockCheck}&docker=${this.superState.dockerCheck}&maxtime=${this.superState.maxTime}&params=${this.superState.params}&octave=${this.superState.octave}`)
            .then((res) => { // eslint-disable-next-line
                toast.success(res.data['message']);
                this.dispatcher({
                    type: T.SET_FUNCTIONS,
                    payload: {
                        built: false, ran: false, debugged: true, cleared: false, stopped: false, destroyed: true,
                    },
                });
                this.dispatcher({ type: T.SET_LOGS_MESSAGE, payload: this.superState.logsmessage + res.data.output });
                toast.dismiss(toastId);
            }).catch((err) => { // eslint-disable-next-line
                toast.error(err.message);
                toast.dismiss(toastId);
            });
        if (this.serverID);
    }

    debug() {
        // TODO
        const toastId = toast.info('LOADING.......', {
            position: 'bottom-left',
            autoClose: false,
        });
        this.dispatcher({ type: T.SET_LOGS, payload: false });
        Axios.post(`http://127.0.0.1:5000/debug/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}`)
            .then((res) => { // eslint-disable-next-line
                toast.success(res.data['message'])
                this.dispatcher({
                    type: T.SET_FUNCTIONS,
                    payload: {
                        built: false, ran: false, debugged: false, cleared: true, stopped: true, destroyed: true,
                    },
                });
                toast.dismiss(toastId);
            }).catch((err) => { // eslint-disable-next-line
                toast.error(err.message);
                toast.dismiss(toastId);
            });
        if (this.serverID);
    }

    run() {
        // TODO
        const toastId = toast.info('LOADING.......', {
            position: 'bottom-left',
            autoClose: false,
        });
        this.dispatcher({ type: T.SET_LOGS, payload: false });
        Axios.post(`http://127.0.0.1:5000/run/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}`)
            .then((res) => { // eslint-disable-next-line
                toast.success(res.data['message'])
                this.dispatcher({
                    type: T.SET_FUNCTIONS,
                    payload: {
                        built: false, ran: false, debugged: false, cleared: true, stopped: true, destroyed: true,
                    },
                });
                toast.dismiss(toastId);
            }).catch((err) => { // eslint-disable-next-line
                toast.error(err.message);
                toast.dismiss(toastId);
            });
        if (this.serverID);
    }

    clear() {
        // TODO
        const toastId = toast.info('LOADING.......', {
            position: 'bottom-left',
            autoClose: false,
        });
        this.dispatcher({ type: T.SET_LOGS, payload: false });
        Axios.post(`http://127.0.0.1:5000/clear/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}
        ?unlock=${this.superState.unlockCheck}&maxtime=${this.superState.maxTime}&params=${this.superState.params}`)
            .then((res) => { // eslint-disable-next-line
                toast.success(res.data['message']);
                this.dispatcher({
                    type: T.SET_FUNCTIONS,
                    payload: {
                        built: false, ran: true, debugged: true, cleared: false, stopped: true, destroyed: true,
                    },
                });
                toast.dismiss(toastId);
            }).catch((err) => { // eslint-disable-next-line
                toast.error(err.message);
                toast.dismiss(toastId);
            });
        if (this.serverID);
    }

    stop() {
        // TODO
        const toastId = toast.info('LOADING.......', {
            position: 'bottom-left',
            autoClose: false,
        });
        this.dispatcher({ type: T.SET_LOGS, payload: false });
        Axios.post(`http://127.0.0.1:5000/stop/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}`)
            .then((res) => { // eslint-disable-next-line
                toast.success(res.data['message'])
                this.dispatcher({
                    type: T.SET_FUNCTIONS,
                    payload: {
                        built: false, ran: false, debugged: false, cleared: true, stopped: false, destroyed: true,
                    },
                });
                toast.dismiss(toastId);
            }).catch((err) => { // eslint-disable-next-line
                toast.error(err.message);
                toast.dismiss(toastId);
            });
        if (this.serverID);
    }

    destroy() {
        // TODO
        const toastId = toast.info('LOADING.......', {
            position: 'bottom-left',
            autoClose: false,
        });
        this.dispatcher({ type: T.SET_LOGS, payload: false });
        Axios.delete(`http://127.0.0.1:5000/destroy/${this.superState.graphs[this.superState.curGraphIndex].fileName.split('.')[0]}`)
            .then((res) => { // eslint-disable-next-line
                toast.success(res.data['message'])
                this.dispatcher({
                    type: T.SET_FUNCTIONS,
                    payload: {
                        built: true, ran: false, debugged: false, cleared: false, stopped: false, destroyed: false,
                    },
                });
                toast.dismiss(toastId);
            }).catch((err) => { // eslint-disable-next-line
                toast.error(err.message);
                toast.dismiss(toastId);
            });
        if (this.serverID);
    }

    library(fileName) {
        // TODO
        const toastId = toast.info('LOADING.......', {
            position: 'bottom-left',
            autoClose: false,
        });
        // this.dispatcher({ type: T.SET_LOGS, payload: false });
        Axios.post(`http://127.0.0.1:5000/library/${this.superState.uploadedDirName}?filename=${fileName}&path=${this.superState.library}`)
            .then((res) => { // eslint-disable-next-line
                toast.info(res.data['message'])
                toast.dismiss(toastId);
            }).catch((err) => { // eslint-disable-next-line
                toast.error(err.message);
                toast.dismiss(toastId);
            });
        if (this.serverID);
    }

    setCurStatus() {
        super.setCurStatus();
        this.dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: Boolean(this.serverID) });
    }
}

export default GraphServer;

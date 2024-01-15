import md5 from 'md5';
import GraphComponent from './3-component';
import GA from '../graph-actions';
import { actionType as T } from '../../reducer';

class GraphUndoRedo extends GraphComponent {
    static methodsMapped

    actionArr

    curActionIndex

    constructor(...props) {
        super(...props);

        this.methodsMapped = {
            [GA.ADD_NODE]: (...args) => this.addNode(...args, 0),
            [GA.ADD_EDGE]: (...args) => this.addEdge(...args, 0),
            [GA.UPDATE_NODE]: (...args) => this.updateNode(...args, 0),
            [GA.UPDATE_EDGE]: (...args) => this.updateEdge(...args, 0),
            [GA.UPDATE_DATA]: (...args) => this.updateData(...args, 0),
            [GA.DEL_NODE]: (...args) => this.deleteNode(...args, 0),
            [GA.DEL_EDGE]: (...args) => this.deleteElem(...args, 0),
            [GA.SET_POS]: (...args) => this.setPos(...args, 0),
            [GA.SET_DIM]: (...args) => this.setDim(...args, 0),
            [GA.SET_BENDW]: (...args) => this.setBendWightDist(...args),
        };

        this.actionArr = [];
        this.curActionIndex = 0;
    }

    resetAllAction() {
        this.actionArr = [];
        this.curActionIndex = 0;
    }

    informUI() {
        this.dispatcher({ type: T.SET_UNDO, payload: this.curActionIndex !== 0 });
        this.dispatcher({ type: T.SET_REDO, payload: this.curActionIndex !== this.actionArr.length });
    }

    performAction({ actionName, parameters }) {
        const action = this.methodsMapped[actionName];
        action(...parameters);
    }

    addPositionChange(id, prevPos, curPos) {
        const tid = new Date().getTime();
        this.addAction(
            { actionName: GA.SET_POS, parameters: [id, prevPos, curPos] },
            { actionName: GA.SET_POS, parameters: [id, curPos, prevPos] }, tid,
        );
    }

    addDimensionChange(id, prevDim, prevPos, curDim, curPos) {
        const tid = new Date().getTime();
        this.addAction(
            { actionName: GA.SET_DIM, parameters: [id, prevDim, prevPos] },
            { actionName: GA.SET_DIM, parameters: [id, curDim, curPos] }, tid,
        );
    }

    addBendChange(id, prevDW, curDW) {
        const tid = new Date().getTime();
        this.addAction(
            { actionName: GA.SET_BENDW, parameters: [id, prevDW] },
            { actionName: GA.SET_BENDW, parameters: [id, curDW] }, tid,
        );
    }

    static sequencify(obj) {
        if (!(obj instanceof Object)) return obj;
        let r = [];
        if (obj instanceof Array) {
            r = obj.map(GraphUndoRedo.sequencify);
        } else {
            Object.keys(obj).sort().forEach((k) => {
                r.push(`:${k}:`);
                r.push(GraphUndoRedo.sequencify(obj[k]));
            });
        }
        return r;
    }

    addAction(inverse, equivalent, tid) {
        if (tid === 0) return;
        this.actionArr.splice(this.curActionIndex);

        const actionIdentity = GraphUndoRedo.sequencify(equivalent).toString()
            + GraphUndoRedo.sequencify(equivalent).toString()
            + tid;
        this.actionArr.push({
            tid,
            inverse,
            equivalent,
            hash: md5(
                `${actionIdentity}|${this.actionArr.length ? this.actionArr.at(-1).hash : ''}`,
            ),
        });
        this.curActionIndex += 1;
        this.informUI();
    }

    undoSingleAction() {
        if (this.curActionIndex !== 0) {
            this.curActionIndex -= 1;
            this.performAction(this.actionArr[this.curActionIndex].inverse);
            this.informUI();
        }
    }

    redoSingleAction() {
        if (this.curActionIndex !== this.actionArr.length) {
            this.performAction(this.actionArr[this.curActionIndex].equivalent);
            this.curActionIndex += 1;
            this.informUI();
        }
    }

    undo() {
        let curTid = null;
        if (this.curActionIndex !== 0) curTid = this.actionArr[this.curActionIndex - 1].tid;
        while (this.curActionIndex !== 0 && this.actionArr[this.curActionIndex - 1].tid === curTid) {
            this.curActionIndex -= 1;
            this.performAction(this.actionArr[this.curActionIndex].inverse);
        }
        this.informUI();
    }

    redo() {
        let curTid = null;
        if (this.curActionIndex !== this.actionArr.length) curTid = this.actionArr[this.curActionIndex].tid;
        while (this.curActionIndex !== this.actionArr.length && this.actionArr[this.curActionIndex].tid === curTid) {
            this.performAction(this.actionArr[this.curActionIndex].equivalent);
            this.curActionIndex += 1;
        }
        this.informUI();
    }

    resetAfterClear() {
        const limit = this.curActionIndex;
        this.curActionIndex = 0;
        while (this.curActionIndex !== this.actionArr.length && this.curActionIndex !== limit) {
            this.performAction(this.actionArr[this.curActionIndex].equivalent);
            this.curActionIndex += 1;
        }
        this.informUI();
        this.dispatcher({ type: T.CHANGE_RESET, payload: false });
        return true;
    }

    setCurStatus() {
        super.setCurStatus();
        this.informUI();
    }

    registerEvents() {
        super.registerEvents();
        this.cy.on('dragfree', 'node[type = "ordin"]', (e) => {
            e.target.forEach((node) => {
                this.addPositionChange(node.id(), node.scratch('position'), { ...node.position() });
            });
        });
        this.cy.on('nodeediting.resizeend', (e, type, node) => {
            this.addDimensionChange(
                node.id(),
                { height: node.scratch('height'), width: node.scratch('width') },
                node.scratch('position'),
                { height: node.data('style').height, width: node.data('style').width },
                { ...node.position() },
            );
        });
    }
}

export default GraphUndoRedo;

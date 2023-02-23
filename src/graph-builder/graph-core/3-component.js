import BendingDistanceWeight from '../calculations/bending-dist-weight';
import GA from '../graph-actions';
import { actionType as T } from '../../reducer';
import GraphCanvas from './2-canvas';

class GraphComponent extends GraphCanvas {
    getTid;

    nodeValidator;

    edgeValidator;

    addAction;

    getRealSourceId;

    constructor(...args) {
        super(...args);
        const [,,,,, nodeValidator, edgeValidator] = args;
        this.setEdgeNodeValidator({ nodeValidator, edgeValidator });
        this.getTid = () => new Date().getTime();
    }

    getPos() {
        const allNodes = this.cy.$('node');
        const start = { x: 100, y: 100 };
        let found = true;
        while (found) {
            found = false;
            for (let i = 0; i < allNodes.length; i += 1) {
                const nodePos = allNodes[i].position();
                found = found || (nodePos.x === start.x && nodePos.y === start.y);
            }
            if (found) {
                start.x += 10;
                start.y += 10;
            }
        }
        return start;
    }

    addNode(label, style, type = 'ordin', position = this.getPos(),
        data = {}, id, tid = this.getTid()) {
        const node = this.cy.add({
            group: 'nodes',
            data: {
                ...data, id, label, type, style,
            },
            position,
        });
        this.addAction(
            { actionName: GA.DEL_NODE, parameters: [node.id()] },
            {
                actionName: GA.ADD_NODE,
                parameters: [label, style, type, position, data, node.id()],
            },
            tid,
        );
        return node;
    }

    getEdgesBetweenNodes(sourceID, targetID) {
        return this.getById(sourceID).edgesWith(this.getById(targetID));
    }

    getBendingD(sourceID, targetID) {
        const edges = this.getEdgesBetweenNodes(sourceID, targetID);
        const dists = new Set();
        edges.forEach((edge) => {
            if (targetID === edge.target().id()) dists.add(edge.data('bendData').bendDistance);
            else dists.add(-edge.data('bendData').bendDistance);
        });
        for (let d = 0; ;d += 20) {
            if (!dists.has(d)) return d;
            if (!dists.has(-d)) return -d;
        }
    }

    parseBendinDW({
        sourceID, targetID, type, bendWeight, bendDistance, bendPoint,
    }) {
        if (type !== 'ordin') return { bendDistance: 0, bendWeight: 0 };
        if (bendDistance && bendWeight) return { bendDistance, bendWeight };
        if (bendPoint) {
            const { x, y } = bendPoint;
            const { d, w } = BendingDistanceWeight.getWeightDistance(
                { x, y }, this.getById(sourceID).position(), this.getById(targetID).position(),
            );
            return { bendDistance: d, bendWeight: w };
        }
        return { bendDistance: this.getBendingD(sourceID, targetID), bendWeight: 0.5 };
    }

    addEdgeWithLabel(edgeData, tid = this.getTid()) {
        const { type = 'ordin' } = edgeData;
        const bendData = this.parseBendinDW({ ...edgeData, ...edgeData.bendData });
        const edge = this.cy.add({
            group: 'edges',
            data: {
                ...edgeData, source: edgeData.sourceID, target: edgeData.targetID, type, bendData,
            },
        });
        this.addAction(
            { actionName: GA.DEL_EDGE, parameters: [edge.id()] },
            { actionName: GA.ADD_EDGE, parameters: [{ ...edgeData, id: edge.id() }] },
            tid,
        );

        return edge;
    }

    addEdge(edgeData, tid = this.getTid()) {
        if ((edgeData.type && edgeData.type !== 'ordin') || edgeData.label) {
            return this.addEdgeWithLabel({ ...edgeData, type: edgeData.type || 'ordin' }, tid);
        }
        this.dispatcher({
            type: T.Model_Open_Create_Edge,
            cb: (edgeLabel, edgeStyle) => {
                const message = this.validiateEdge(edgeLabel, edgeStyle,
                    edgeData.sourceID, edgeData.targetID, null, 'New');
                if (message.ok) this.addEdgeWithLabel({ ...edgeData, type: edgeData.type || 'ordin' }, tid);
                return message;
            },
        });
        return undefined;
    }

    getStyle(id) {
        return this.getById(id).data('style');
    }

    getLabel(id) {
        return this.getById(id).data('label') || this.getById(id).data('label');
    }

    updateNode(id, style, label, shouldUpdateLabel, tid = this.getTid()) {
        this.addAction(
            {
                actionName: GA.UPDATE_NODE,
                parameters: [id, this.getStyle(id), this.getById(id).data('label'), shouldUpdateLabel],
            },
            { actionName: GA.UPDATE_NODE, parameters: [id, style, label, shouldUpdateLabel] },
            tid,
        );
        if (shouldUpdateLabel) this.getById(id).data('label', label);
        this.getById(id).data('style', style);
    }

    updateEdge(id, style, label, shouldUpdateLabel, tid = this.getTid()) {
        this.addAction(
            {
                actionName: GA.UPDATE_EDGE,
                parameters: [id, this.getStyle(id), this.getById(id).data('label'), shouldUpdateLabel],
            },
            { actionName: GA.UPDATE_EDGE, parameters: [id, style, label, shouldUpdateLabel] },
            tid,
        );
        if (shouldUpdateLabel) this.getById(id).data('label', label);
        this.getById(id).data('style', style);
    }

    updateData(id, key, val, tid = this.getTid()) {
        this.addAction(
            { actionName: GA.UPDATE_DATA, parameters: [id, key, this.getById(id).data(key)] },
            { actionName: GA.UPDATE_DATA, parameters: [id, key, val] }, tid,
        );
        this.getById(id).data(key, val);
        return this;
    }

    deleteNode(id, tid = this.getTid()) {
        const node = this.getById(id);
        node.connectedEdges('[type="ordin"]').forEach((edge) => this.deleteEdge(edge.id(), tid));
        node.connectedEdges().forEach((edge) => this.deleteEdge(edge.id(), tid));
        this.addAction(
            {
                actionName: GA.ADD_NODE,
                parameters: [
                    node.data('label'), this.getStyle(node.id()), node.data('type'),
                    node.position(), node.json().data, id,
                ],
            },
            { actionName: GA.DEL_NODE, parameters: [id] }, tid,
        );
        node.remove();
    }

    deleteEdge(id, tid = this.getTid()) {
        if (this.getById(id).length === 0 || this.getById(id).removed()) return;
        const jsonEd = this.getById(id).json();
        this.addAction(
            {
                actionName: GA.ADD_EDGE,
                parameters: [{
                    ...jsonEd.data, sourceID: jsonEd.data.source, targetID: jsonEd.data.target,
                }],
            },
            { actionName: GA.DEL_EDGE, parameters: [id] }, tid,
        );
        this.getById(id).remove();
    }

    deleteElem(id, tid = this.getTid()) {
        if (this.getById(id).isNode()) return this.deleteNode(id, tid);
        return this.deleteEdge(id, tid);
    }

    setPos(id, pos) {
        this.getById(id).position(pos);
        this.getById(id).emit('moved');
    }

    setDim(id, dim, pos) {
        const style = this.getById(id).data('style');
        this.getById(id).data('style', { ...style, height: dim.height, width: dim.width });
        this.setPos(id, pos);
    }

    getNodeValidator() {
        const [a, b] = [this.nodeValidator.toString().indexOf('{'), this.nodeValidator.toString().lastIndexOf('}')];
        return this.nodeValidator.toString().slice(a + 1, b).trim();
    }

    getEdgeValidator() {
        const [a, b] = [this.edgeValidator.toString().indexOf('{'), this.edgeValidator.toString().lastIndexOf('}')];
        return this.edgeValidator.toString().slice(a + 1, b).trim();
    }

    setEdgeNodeValidator({ nodeValidator, edgeValidator }) {
        // eslint-disable-next-line no-eval
        this.nodeValidator = eval(nodeValidator);
        // eslint-disable-next-line no-eval
        this.edgeValidator = eval(edgeValidator);
    }

    getNodesEdges() {
        const nodes = this.cy.$('node[type="ordin"]').map((node) => ({
            label: node.data('label'),
            style: node.data('style'),
            id: node.data('id'),
        }));
        const edges = this.cy.$('edge[type="ordin"]').map((edge) => ({
            label: edge.data('label'),
            sourceLabel: this.getById(this.getRealSourceId(edge.source().id())).data('label'),
            targetLabel: edge.target().data('label'),
            style: edge.data('style'),
            id: edge.data('id'),
        }));
        return [nodes, edges];
    }

    validiateComp(comp, validator, type) {
        const [nodes, edges] = this.getNodesEdges();
        try {
            const message = validator(comp, nodes, edges, type);
            if (message && message.ok !== undefined && message.err !== undefined) return message;
            return { ok: false, err: 'Invalid return format from the defined validator.' };
        } catch (e) {
            return { ok: false, err: `Error raised at validator: ${e.message}` };
        }
    }

    validiateNode(label, style, id, type) {
        if (id) {
            const node = this.getById(id);
            return this.validiateComp({
                label: label || node.data('label'),
                style: style || node.data('style'),
                id,
            }, this.nodeValidator, type);
        }
        return this.validiateComp({ label, style, id }, this.nodeValidator, type);
    }

    validiateEdge(label, style, sourceID, targetID, id, type) {
        if (id) {
            const edge = this.getById(id);
            return this.validiateComp({
                label: label || edge.data('label'),
                style: style || edge.data('style'),
                sourceLabel: this.getById(this.getRealSourceId(edge.source().id())).data('label'),
                targetLabel: edge.target().data('label'),
                id,
            }, this.edgeValidator, type);
        }
        return this.validiateComp({
            label,
            style,
            sourceLabel: this.getById(this.getRealSourceId(sourceID)).data('label'),
            targetLabel: this.getById(targetID).data('label'),
            id,
        }, this.edgeValidator, type);
    }
}

export default GraphComponent;

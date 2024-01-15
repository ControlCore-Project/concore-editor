import CoreGraph from './graph-core';
import { actionType as T } from '../reducer';
import getBoundaryPoint from './calculations/boundary-point';
import GA from './graph-actions';

class TailoredGraph extends CoreGraph {
    registerEvents() {
        super.registerEvents();
        this.cy.on('drag data moved', 'node[type="ordin"]', (evt) => {
            evt.target.connectedEdges().connectedNodes('node[type="special"]').forEach((juncNode) => {
                juncNode.position(TailoredGraph.calJuncNodePos(juncNode));
            });
        });
        this.cy.on('bending', (evt) => {
            const juncNode = evt.target.source();
            juncNode.position(TailoredGraph.calJuncNodePos(juncNode));
        });
    }

    static calJuncNodePos(juncNode) {
        const parNode = juncNode.incomers('node')[0];
        const meanNbrPosition = { x: 0, y: 0 };
        const setOfPos = new Set();
        juncNode.outgoers('edge[type="ordin"]')
            .forEach((edge) => setOfPos.add(JSON.stringify(TailoredGraph.getBendEdgePoint(edge))));
        setOfPos.forEach((posStr) => {
            const pos = JSON.parse(posStr);
            meanNbrPosition.x += pos.x;
            meanNbrPosition.y += pos.y;
        });
        if (setOfPos.size === 0) return juncNode.position();
        meanNbrPosition.x /= setOfPos.size;
        meanNbrPosition.y /= setOfPos.size;
        return getBoundaryPoint(
            parNode.position(), meanNbrPosition,
            parNode.data('style').width / 2,
            parNode.data('style').height / 2,
            parNode.data('style').shape,
        );
    }

    getRealNode(juncNodeId) {
        return this.getById(juncNodeId).incomers().filter('node')[0];
    }

    addAutoMove(juncNode) {
        juncNode.unselectify();
        return this;
    }

    addEdgeWithJuncNode(edgeData, tid) {
        const juncNode = this.getById(edgeData.sourceID);
        const ed = super.addEdge({
            ...edgeData,
            label: juncNode.data('edgeLabel'),
            style: juncNode.data('edgeStyle'),
        }, tid);
        juncNode.position(TailoredGraph.calJuncNodePos(juncNode));
        return ed;
    }

    addEdgeWithoutJuncNode(edgeData, tid) {
        const { sourceID, targetID, style } = edgeData;
        const [sourceNode, targetNode] = [sourceID, targetID].map(this.getById.bind(this));
        const sourceNodeStyle = sourceNode.data('style');
        const juncNodePos = getBoundaryPoint(
            sourceNode.position(),
            targetNode.position(),
            sourceNodeStyle.width / 2,
            sourceNodeStyle.height / 2,
            sourceNodeStyle.shape,
        );
        const juncNode = super.addNode('', { backgroundColor: style.backgroundColor },
            'special', juncNodePos, { edgeLabel: edgeData.label, edgeStyle: style }, undefined, tid);
        juncNode.ungrabify();
        super.addEdge({
            sourceID,
            targetID: juncNode.id(),
            style: {
                ...style,
                'target-arrow-shape': 'none',
            },
            type: 'special',
        }, tid);
        this.addAutoMove(juncNode, sourceNode);
        return this.addEdgeWithJuncNode({ ...edgeData, sourceID: juncNode.id() }, tid);
    }

    addEdgeAction(id, edgeData, tid) {
        this.addAction(
            { actionName: GA.DEL_EDGE, parameters: [id] },
            {
                actionName: GA.ADD_EDGE,
                parameters: [{ ...edgeData, sourceID: this.getRealSourceId(edgeData.sourceID), id }],
            },
            tid,
        );
    }

    addEdge(edgeData, tidd = this.getTid()) {
        const tid = 0;
        const { sourceID, targetID, label } = edgeData;
        const [sourceNode, targetNode] = [sourceID, targetID].map(this.getById.bind(this));
        const juncNodes = sourceNode.outgoers('node').filter((node) => label && node.data('edgeLabel') === label);

        let edge;
        if (targetNode.data('type') !== 'ordin') return edge; // Don't Add Node
        if (sourceNode.data('type') === 'special') edge = this.addEdgeWithJuncNode(edgeData, tid);
        else if (juncNodes.length) edge = this.addEdgeWithJuncNode({ ...edgeData, sourceID: juncNodes[0].id() }, tid);
        else if (label && label.length) edge = this.addEdgeWithoutJuncNode(edgeData, tid);
        else {
            this.dispatcher({
                type: T.Model_Open_Create_Edge,
                cb: (edgeLabel, edgeStyle) => {
                    const message = this.validiateEdge(edgeLabel, edgeStyle, sourceID, targetID, null, 'New');
                    if (message.ok) edge = this.addEdge({ ...edgeData, label: edgeLabel, style: edgeStyle }, tid);
                    if (edge) this.addEdgeAction(edge.id(), { ...edgeData, label: edgeLabel, style: edgeStyle }, tidd);
                    return message;
                },
            });
        }
        if (edge) this.addEdgeAction(edge.id(), edgeData, tidd);
        return edge;
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
        const junctionNode = this.getById(id).source();
        if (shouldUpdateLabel) this.updateData(junctionNode.data('id'), 'edgeLabel', label, 0);
        this.updateData(junctionNode.data('id'), 'edgeStyle', style, 0);
        this.updateNode(junctionNode.data('id'), { backgroundColor: style.backgroundColor }, '', false, 0);

        junctionNode
            .outgoers('edge')
            .forEach((edge) => super.updateEdge(edge.data('id'), style, label, shouldUpdateLabel, 0));
    }

    deleteElem(id, tid = this.getTid()) {
        const el = this.getById(id);
        if (el.isNode()) {
            if (el.removed()) return;
            el.outgoers('node[type="special"]')
                .connectedEdges('edge[type="ordin"]')
                .forEach((edge) => this.deleteElem(edge.id(), tid));
            el.connectedEdges('edge[type="ordin"]')
                .forEach((edge) => this.deleteElem(edge.id(), tid));

            const node = this.getById(id);
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
            super.deleteNode(id, 0);
        } else {
            if (!this.getById(id).length || el.removed()) return;
            const jsonEd = this.getById(id).json().data;
            this.addAction(
                {
                    actionName: GA.ADD_EDGE,
                    parameters: [{
                        ...jsonEd, sourceID: this.getRealSourceId(jsonEd.source), targetID: jsonEd.target,
                    }],
                },
                { actionName: GA.DEL_EDGE, parameters: [id] }, tid,
            );
            const junctionNode = el.source();
            super.deleteEdge(id, 0);
            if (junctionNode) if (junctionNode.outgoers().length === 0) this.deleteNode(junctionNode.id(), 0);
        }
    }

    getRealSourceId(nodeID) {
        if (this.getById(nodeID).data('type') === 'ordin') return nodeID;
        if (this.getById(nodeID).incomers('node').length === 0) return nodeID;
        return this.getById(nodeID).incomers('node')[0].id();
    }

    getEdgesBetweenNodes(n1, n2) {
        const [c1, c2] = [n1, n2]
            .map((n) => this.getById(this.getRealSourceId(n)))
            .map((r) => r.outgoers('node[type="special"]').union(r));
        return c1.edgesWith(c2);
    }

    getNodesEdges() {
        const nodes = this.cy.$('node[type="ordin"]').map((node) => ({
            label: node.data('label'),
            style: node.data('style'),
            id: node.data('id'),
        }));
        const edges = {};
        this.cy.$('edge[type="ordin"]').forEach((edge) => {
            const label = edge.data('label');
            const sourceLabel = this.getById(this.getRealSourceId(edge.source().id())).data('label');
            const targetLabel = edge.target().data('label');
            const style = edge.data('style');
            const id = edge.data('id');
            if (!edges[label]) {
                edges[label] = {
                    targetLabel: [targetLabel], sourceLabel, id, label, style,
                };
            } else edges[label].targetLabel.push(targetLabel);
        });
        return [nodes, Object.values(edges)];
    }
}

export default TailoredGraph;

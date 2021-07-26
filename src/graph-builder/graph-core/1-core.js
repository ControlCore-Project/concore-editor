import { actionType as T } from '../../reducer';
// import GraphLoadSave from './graph-load-save';
import BendingDistanceWeight from '../calculations/bending-dist-weight';

class CoreGraph {
    dispatcher;

    superState;

    id;

    projectDetails;

    cy;

    bendNode;

    constructor(id, cy, dispatcher, superState, projectDetails) {
        if (dispatcher) this.dispatcher = dispatcher;
        if (superState) this.superState = superState;
        if (cy) this.cy = cy;
        this.id = id;
        this.projectDetails = projectDetails;
        this.cy.emit('graph-modified');
        this.bendNode = this.cy.add(
            { group: 'nodes', data: { type: 'bend' }, classes: ['hidden'] },
        );
        this.regesterEvents();
        this.cy.emit('graph-modified');
    }

    setProjectDetail(projectDetails) {
        this.projectDetails = projectDetails;
        this.cy.emit('graph-modified');
    }

    getById(x) {
        return this.cy.getElementById(x);
    }

    getLabelFromID(x) {
        return this.getById(x).data('label');
    }

    set({ cy, dispatcher, superState }) {
        if (dispatcher) this.dispatcher = dispatcher;
        if (superState) this.superState = superState;
        if (cy) this.cy = cy;
    }

    selectDeselectEventHandler() {
        const els = this.cy.$(':selected');
        if (els.length === 0) { return this.dispatcher({ type: T.ELE_UNSELECTED }); }
        let type;
        if (els.every((e) => e.isNode())) type = 'NODE';
        else if (els.every((e) => e.isEdge())) type = 'EDGE';
        else type = 'MIX';
        const ids = els.map((e) => e.data('id'));
        return this.dispatcher({
            type: T.ELE_SELECTED,
            payload: {
                ids, type,
            },
        });
    }

    regesterEvents() {
        this.cy.on('select unselect', () => this.selectDeselectEventHandler());
        this.cy.on('grab', 'node[type = "ordin"]', (e) => {
            e.target.forEach((node) => {
                node.scratch('position', { ...node.position() });
            });
        });

        this.cy.on('nodeediting.resizestart', (e, type, node) => {
            node.scratch('height', node.data('style').height);
            node.scratch('width', node.data('style').width);
            node.scratch('position', { ...node.position() });
        });

        this.cy.on('hide-bend remove', () => {
            this.bendNode.removeListener('drag grab dragfree'); this.bendNode.addClass('hidden');
        });

        this.cy.on('grabon', (evt) => (evt.target[0].data('type') !== 'bend' ? this.cy.emit('hide-bend') : 0));
        this.cy.on('freeon', (evt) => (evt.target[0].data('type') !== 'bend' ? this.cy.emit('show-bend') : 0));

        this.cy.on('click tap', (ev) => {
            if (ev.target === this.cy) {
                this.cy.emit('hide-bend');
                this.cy.$('.eh-handle').remove();
            }
        });
        this.cy.on('select unselect show-bend', () => {
            const el = this.cy.$(':selected');
            if (el.length !== 1 || !el[0].isEdge()) this.cy.emit('hide-bend');
            return el.emit('bend-edge');
        });
        this.cy.on('mouseover', 'edge', (ev) => {
            ev.target.emit('bend-edge');
        });

        this.cy.on('bend-edge', 'edge', (ev) => {
            if (!this.bendNode.hasClass('hidden')) this.cy.emit('hide-bend');
            const el = ev.target;
            this.bendNode.position(CoreGraph.getBendEdgePoint(el));
            this.bendNode.on('drag', () => {
                const DW = BendingDistanceWeight.getWeightDistance(
                    this.bendNode.position(), el.source().position(), el.target().position(),
                );
                el.data('bendData', { bendDistance: DW.d, bendWeight: DW.w });
                ev.target.emit('bending');
            });
            this.bendNode.on('grab', () => {
                const node = el;
                node.scratch('bendDistWeight', el.data('bendData'));
            });
            this.bendNode.on('dragfree', () => {
                const node = el;
                this.addBendChange(node.id(), node.scratch('bendDistWeight'), el.data('bendData'));
            });
            this.bendNode.removeClass('hidden');
        });
    }

    setBendWightDist(id, DW) {
        this.getById(id).data('bendData', DW);
    }

    static getBendEdgePoint(el) {
        const { bendWeight, bendDistance } = el.data('bendData');
        const w = parseFloat(bendWeight);
        const d = parseFloat(bendDistance);
        return BendingDistanceWeight.getCoordinate(w, d, el.source().position(), el.target().position());
    }

    setCurStatus() {
        this.selectDeselectEventHandler();
    }
}

export default CoreGraph;

import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import gridGuide from 'cytoscape-grid-guide';
import Konva from 'konva';
import nodeEditing from 'cytoscape-node-editing';
import $ from 'jquery';
import cyOptions from '../../config/cytoscape-options';
import BendingDistanceWeight from '../calculations/bending-dist-weight';
import { actionType as T } from '../../reducer';

class CoreGraph {
    dispatcher;

    superState;

    id;

    projectName;

    authorName;

    cy;

    bendNode;

    gridSize = 20; // Configurable grid size in pixels

    constructor(id, element, dispatcher, superState, projectName, nodeValidator, edgeValidator, authorName) {
        if (dispatcher) this.dispatcher = dispatcher;
        if (superState) this.superState = superState;
        if (typeof cytoscape('core', 'edgehandles') !== 'function') {
            cytoscape.use(edgehandles);
        }
        if (typeof cytoscape('core', 'nodeEditing') !== 'function') {
            nodeEditing(cytoscape, $, Konva);
        }
        if (typeof cytoscape('core', 'gridGuide') !== 'function') {
            gridGuide(cytoscape);
        }
        // if (cy) this.cy = cy;
        this.cy = cytoscape({ ...cyOptions, container: element });
        this.cy.on('position', 'node', () => {
            this.cy.edges().updateStyle();
        });
        this.id = id;
        this.projectName = projectName;
        this.authorName = authorName;
        this.cy.emit('graph-modified');
        this.bendNode = this.cy.add(
            { group: 'nodes', data: { type: 'bend' }, classes: ['hidden'] },
        );
        this.registerEvents();
        this.cy.emit('graph-modified');
        this.initizialize();
    }

    // Helper function to snap a value to the nearest grid point
    snapToGrid(value) {
        return Math.round(value / this.gridSize) * this.gridSize;
    }

    // Helper function to snap position to grid
    snapPositionToGrid(position) {
        return {
            x: this.snapToGrid(position.x),
            y: this.snapToGrid(position.y),
        };
    }

    // Helper function to snap dimension to EVEN grid multiples
    // This ensures all borders lie on grid lines when center is on a grid point
    snapDimensionToGrid(dimension) {
        let gridCells = Math.round(dimension / this.gridSize);
        // Ensure at least 2 grid cells
        if (gridCells < 2) {
            gridCells = 2;
        }
        // Ensure always an even number
        const evenCells = gridCells % 2 === 0 ? gridCells : gridCells + 1;
        return evenCells * this.gridSize;
    }

    initizialize() {
        this.cy.nodeEditing({
            resizeToContentCueEnabled: () => false,
            setWidth: (node, width) => {
                // Allow free resizing during drag - snapping will happen on resizeend
                node.data('style', { ...node.data('style'), width });

                // Adjust position to maintain edge alignment based on resize handle
                const resizeType = node.scratch('resizeType');
                if (resizeType && (resizeType.includes('left') || resizeType.includes('right'))) {
                    const currentPos = node.position();
                    const initialPos = node.scratch('resizeInitialPos');
                    const initialWidth = node.scratch('width');
                    const widthDelta = width - initialWidth;

                    let newX = currentPos.x;
                    if (resizeType.includes('left')) {
                        newX = initialPos.x - widthDelta / 2;
                    } else if (resizeType.includes('right')) {
                        newX = initialPos.x + widthDelta / 2;
                    }
                    node.position({ x: newX, y: currentPos.y });
                }
                return width;
            },
            setHeight: (node, height) => {
                // Allow free resizing during drag - snapping will happen on resizeend
                node.data('style', { ...node.data('style'), height });

                // Adjust position to maintain edge alignment based on resize handle
                const resizeType = node.scratch('resizeType');
                if (resizeType && (resizeType.includes('top') || resizeType.includes('bottom'))) {
                    const currentPos = node.position();
                    const initialPos = node.scratch('resizeInitialPos');
                    const initialHeight = node.scratch('height');
                    const heightDelta = height - initialHeight;

                    let newY = currentPos.y;
                    if (resizeType.includes('top')) {
                        newY = initialPos.y - heightDelta / 2;
                    } else if (resizeType.includes('bottom')) {
                        newY = initialPos.y + heightDelta / 2;
                    }
                    node.position({ x: currentPos.x, y: newY });
                }
                return height;
            },
            isNoResizeMode(node) { return node.data('type') !== 'ordin'; },
            isNoControlsMode(node) { return node.data('type') !== 'ordin'; },
        });

        this.cy.gridGuide({
            snapToGridOnRelease: true,
            snapToGridDuringDrag: false,
            zoomDash: true,
            panGrid: true,
            gridSpacing: this.gridSize,
            snapToAlignmentLocationOnRelease: true,
        });
        this.cy.edgehandles({
            preview: false,
            handlePosition() {
                return 'none';
            },
            handleNodes: 'node[type = "ordin"],node[type = "special"]',
            complete: (a, b, c) => { c.remove(); this.addEdge({ sourceID: a.id(), targetID: b.id() }); },
        });
    }

    getById(x) {
        return this.cy.getElementById(x);
    }

    getLabelFromID(x) {
        return this.getById(x).data('label') || '**Deleted El**';
    }

    set({
        cy, dispatcher, superState, projectName, authorName,
    }) {
        if (dispatcher) this.dispatcher = dispatcher;
        if (superState) this.superState = superState;
        if (cy) this.cy = cy;
        if (projectName) this.projectName = projectName;
        if (authorName) this.authorName = authorName;
    }

    setProjectName(projectName, shouldEmit = true) {
        this.projectName = projectName;
        if (shouldEmit) {
            this.dispatcher({
                type: T.SET_PROJECT_DETAILS,
                payload: {
                    value: projectName,
                    graphID: this.id,
                    type: 'projectName',
                },
            });
        }
        this.cy.emit('graph-modified');
    }

    setProjectAuthor(authorName, shouldEmit = true) {
        this.authorName = authorName;
        if (shouldEmit) {
            this.dispatcher({
                type: T.SET_AUTHOR,
                payload: {
                    value: authorName,
                    graphID: this.id,
                    type: 'authorName',
                },
            });
        }
        this.cy.emit('graph-modified');
    }

    setServerID(serverID, shouldEmit = true) {
        this.serverID = serverID;
        if (shouldEmit) {
            this.dispatcher({
                type: T.SET_PROJECT_DETAILS,
                payload: {
                    value: serverID,
                    graphID: this.id,
                    type: 'serverID',
                },
            });
        }
        this.cy.emit('graph-modified');
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

    registerEvents() {
        this.cy.on('select unselect', () => this.selectDeselectEventHandler());
        this.cy.on('grab', 'node[type = "ordin"]', (e) => {
            e.target.forEach((node) => {
                node.scratch('position', { ...node.position() });
            });
        });

        this.cy.on('free', 'node[type = "ordin"]', (e) => {
            e.target.forEach((node) => {
                const initialPos = node.scratch('position');
                const currentPos = node.position();
                // Only snap if the node actually moved
                const moved = !initialPos || initialPos.x !== currentPos.x || initialPos.y !== currentPos.y;
                if (moved) {
                    const snappedPos = this.snapPositionToGrid(currentPos);
                    node.position(snappedPos);
                }
            });
        });

        this.cy.on('nodeediting.resizestart', (e, type, node) => {
            // Store initial state for resize operation
            node.scratch('height', node.data('style').height);
            node.scratch('width', node.data('style').width);
            node.scratch('resizeInitialPos', { ...node.position() });
            node.scratch('resizeType', type);
        });

        this.cy.on('nodeediting.resizeend', (e, type, node) => {
            // Clean up scratch data
            node.removeScratch('resizeType');
            node.removeScratch('resizeInitialPos');

            // Final enforcement: ensure position and dimensions are grid-aligned
            const style = node.data('style') || {};
            const snappedWidth = this.snapDimensionToGrid(style.width || 100);
            const snappedHeight = this.snapDimensionToGrid(style.height || 50);
            node.data('style', { ...style, width: snappedWidth, height: snappedHeight });

            const snappedPos = this.snapPositionToGrid(node.position());
            node.position(snappedPos);
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

    reset() {
        this.resetAllComp();
        this.resetAllAction();
    }
}

export default CoreGraph;

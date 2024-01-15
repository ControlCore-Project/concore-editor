// import GraphUndoRedo from './graph-undo-redo';
import Core from './1-core';
import { actionType as T } from '../../reducer';

class GraphCanvas extends Core {
    setZoomUI;

    resetZoom() {
        this.cy.reset();
        this.cy.center();
        this.dispatcher({ type: T.SET_ZOOM_LEVEL, payload: this.getZoom() });
    }

    setOnZoom(cb) {
        this.cy.removeListener('zoom');
        this.setZoomUI = cb;
        this.cy.on('zoom', (e) => cb(Math.round(100 * e.target.zoom())));
    }

    fitZoom() {
        this.cy.fit();
        this.dispatcher({ type: T.SET_ZOOM_LEVEL, payload: this.getZoom() });
    }

    setZoom(v) {
        this.cy.zoom(v / 100);
    }

    getZoom() {
        return Math.round(this.cy.zoom() * 100);
    }

    clearAll() {
        if (this.cy.elements().length === 0) return true;
        // eslint-disable-next-line no-alert
        if (!window.confirm('Do want to clear all elements?')) return false;
        this.cy.elements().forEach((el) => this.deleteElem(el.id(), 0));
        // this.actionArr = [];
        this.dispatcher({ type: T.CHANGE_RESET, payload: true });
        this.cy.emit('graph-modified');
        return true;
    }

    resetAllComp() {
        this.cy.elements().remove();
    }

    setCurStatus() {
        super.setCurStatus();
        this.dispatcher({ type: T.SET_ZOOM_LEVEL, payload: Math.round(this.cy.zoom() * 100) });
    }
}

export default GraphCanvas;

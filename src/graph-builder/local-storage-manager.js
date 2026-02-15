import { toast } from 'react-toastify';

const lsGet = (key) => {
    try {
        return window.localStorage.getItem(key);
    } catch (e) {
        toast.error(e.message);
        return null;
    }
};

const lsSet = (key, value) => {
    try {
        window.localStorage.setItem(key, value);
    } catch (e) {
        toast.error(e.message);
    }
};

const lsRemove = (key) => {
    try {
        window.localStorage.removeItem(key);
    } catch (e) {
        toast.error(e.message);
    }
};

const getSet = (ALL_GRAPHS) => {
    if (!lsGet(ALL_GRAPHS)) {
        lsSet(ALL_GRAPHS, window.btoa(JSON.stringify([])));
    }
    const raw = lsGet(ALL_GRAPHS);
    if (!raw) return new Set();
    return new Set(JSON.parse(window.atob(raw)));
};

const localStorageManager = {
    ALL_GRAPHS: window.btoa('ALL_GRAPHS'),
    AUTHOR_NAME: window.btoa('AUTHOR_NAME'),

    allgs: getSet(window.btoa('ALL_GRAPHS')),

    saveAllgs() {
        lsSet(this.ALL_GRAPHS, window.btoa(JSON.stringify(Array.from(this.allgs))));
    },

    addEmptyIfNot() {
        if (!lsGet(this.ALL_GRAPHS)) {
            lsSet(this.ALL_GRAPHS, window.btoa(JSON.stringify([])));
        }
    },

    get(id) {
        const raw = lsGet(id);
        if (raw === null) return null;
        return JSON.parse(window.atob(raw));
    },
    save(id, graphContent) {
        this.addGraph(id);
        const serializedJson = JSON.stringify(graphContent);
        lsSet(id, window.btoa(serializedJson));
    },
    remove(id) {
        if (this.allgs.delete(id)) this.saveAllgs();
        lsRemove(id);
    },
    addGraph(id) {
        if (this.allgs.has(id)) return;
        this.allgs.add(id);
        this.saveAllgs();
    },
    getAllGraphs() {
        const raw = lsGet(this.ALL_GRAPHS);
        if (!raw) return [];
        return JSON.parse(window.atob(raw));
    },
    addToFront(id) {
        if (this.allgs.has(id)) return;
        this.allgs.add(id);
        const raw = lsGet(this.ALL_GRAPHS);
        if (!raw) return;
        const Garr = JSON.parse(window.atob(raw));
        Garr.unshift(id);
        lsSet(this.ALL_GRAPHS, window.btoa(JSON.stringify(Garr)));
    },
    getAuthorName() {
        return lsGet(this.AUTHOR_NAME) || '';
    },
    setAuthorName(authorName) {
        lsSet(this.AUTHOR_NAME, authorName);
    },
    clearGraph(id) {
        lsRemove(id);
    },
    getFileList() {
        return lsGet('fileList') || '';
    },
};
export default localStorageManager;

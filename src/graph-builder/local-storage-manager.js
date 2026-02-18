import { toast } from 'react-toastify';

const localStorageGet = (key) => {
    try {
        return window.localStorage.getItem(key);
    } catch (e) {
        toast.error(e.message);
        return null;
    }
};

const localStorageSet = (key, value) => {
    try {
        window.localStorage.setItem(key, value);
    } catch (e) {
        toast.error(e.message);
    }
};

const localStorageRemove = (key) => {
    try {
        window.localStorage.removeItem(key);
    } catch (e) {
        toast.error(e.message);
    }
};

const getSet = (ALL_GRAPHS) => {
    if (!localStorageGet(ALL_GRAPHS)) {
        localStorageSet(ALL_GRAPHS, window.btoa(JSON.stringify([])));
    }
    const raw = localStorageGet(ALL_GRAPHS);
    if (!raw) return new Set();
    return new Set(JSON.parse(window.atob(raw)));
};

const localStorageManager = {
    ALL_GRAPHS: window.btoa('ALL_GRAPHS'),
    AUTHOR_NAME: window.btoa('AUTHOR_NAME'),

    allgs: getSet(window.btoa('ALL_GRAPHS')),

    saveAllgs() {
        localStorageSet(this.ALL_GRAPHS, window.btoa(JSON.stringify(Array.from(this.allgs))));
    },

    addEmptyIfNot() {
        if (!localStorageGet(this.ALL_GRAPHS)) {
            localStorageSet(this.ALL_GRAPHS, window.btoa(JSON.stringify([])));
        }
    },

    get(id) {
        const raw = localStorageGet(id);
        if (raw === null) return null;
        return JSON.parse(window.atob(raw));
    },
    save(id, graphContent) {
        this.addGraph(id);
        const serializedJson = JSON.stringify(graphContent);
        localStorageSet(id, window.btoa(serializedJson));
    },
    remove(id) {
        if (this.allgs.delete(id)) this.saveAllgs();
        localStorageRemove(id);
    },
    addGraph(id) {
        if (this.allgs.has(id)) return;
        this.allgs.add(id);
        this.saveAllgs();
    },
    getAllGraphs() {
        const raw = localStorageGet(this.ALL_GRAPHS);
        if (!raw) return [];
        return JSON.parse(window.atob(raw));
    },
    addToFront(id) {
        if (this.allgs.has(id)) return;
        this.allgs.add(id);
        const raw = localStorageGet(this.ALL_GRAPHS);
        if (!raw) return;
        const Garr = JSON.parse(window.atob(raw));
        Garr.unshift(id);
        localStorageSet(this.ALL_GRAPHS, window.btoa(JSON.stringify(Garr)));
    },
    getAuthorName() {
        return localStorageGet(this.AUTHOR_NAME) || '';
    },
    setAuthorName(authorName) {
        localStorageSet(this.AUTHOR_NAME, authorName);
    },
    clearGraph(id) {
        localStorageRemove(id);
    },
    getFileList() {
        return localStorageGet('fileList') || '';
    },
};
export default localStorageManager;

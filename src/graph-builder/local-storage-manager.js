import { toast } from 'react-toastify';

const encodeBase64 = (value) => {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
};

const decodeBase64 = (value) => {
    const binary = window.atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
};

const parseStoredJson = (raw) => {
    try {
        return JSON.parse(decodeBase64(raw));
    } catch (e) {
        return null;
    }
};

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
        localStorageSet(ALL_GRAPHS, encodeBase64(JSON.stringify([])));
    }
    const raw = localStorageGet(ALL_GRAPHS);
    if (!raw) return new Set();
    const parsed = parseStoredJson(raw);
    if (!Array.isArray(parsed)) {
        localStorageSet(ALL_GRAPHS, encodeBase64(JSON.stringify([])));
        return new Set();
    }
    return new Set(parsed);
};

const localStorageManager = {
    ALL_GRAPHS: window.btoa('ALL_GRAPHS'),
    AUTHOR_NAME: window.btoa('AUTHOR_NAME'),

    allgs: getSet(window.btoa('ALL_GRAPHS')),

    saveAllgs() {
        localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(Array.from(this.allgs))));
    },

    addEmptyIfNot() {
        if (!localStorageGet(this.ALL_GRAPHS)) {
            localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify([])));
        }
    },

    get(id) {
        const raw = localStorageGet(id);
        if (raw === null) return null;
        const parsed = parseStoredJson(raw);
        if (parsed === null) {
            localStorageRemove(id);
            return null;
        }
        return parsed;
    },
    save(id, graphContent) {
        this.addGraph(id);
        const serializedJson = JSON.stringify(graphContent);
        localStorageSet(id, encodeBase64(serializedJson));
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
        const parsed = parseStoredJson(raw);
        if (!Array.isArray(parsed)) {
            localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify([])));
            return [];
        }
        return parsed;
    },
    addToFront(id) {
        if (this.allgs.has(id)) return;
        this.allgs.add(id);
        const raw = localStorageGet(this.ALL_GRAPHS);
        if (!raw) return;
        const Garr = parseStoredJson(raw);
        if (!Array.isArray(Garr)) {
            this.saveAllgs();
            return;
        }
        Garr.unshift(id);
        localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(Garr)));
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

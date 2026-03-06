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
        return true;
    } catch (e) {
        toast.error(e.message);
        return false;
    }
};

const localStorageRemove = (key) => {
    try {
        window.localStorage.removeItem(key);
    } catch (e) {
        toast.error(e.message);
    }
};

const localStorageManager = {
    ALL_GRAPHS: window.btoa('ALL_GRAPHS'),
    AUTHOR_NAME: window.btoa('AUTHOR_NAME'),

    get(id) {
        const raw = localStorageGet(id);
        if (raw === null) return null;
        const parsed = parseStoredJson(raw);
        if (parsed !== null) return parsed;
        // fallback for legacy plain JSON data saved before base64 encoding was introduced
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },
    save(id, graphContent) {
        this.addGraph(id);
        if (!localStorageSet(id, encodeBase64(JSON.stringify(graphContent)))) {
            const stripped = { ...graphContent, actionHistory: [] };
            localStorageSet(id, encodeBase64(JSON.stringify(stripped)));
        }
    },
    remove(id) {
        const list = this.getAllGraphs().filter((g) => g !== id);
        localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(list)));
        localStorageRemove(id);
    },
    addGraph(id) {
        const list = this.getAllGraphs();
        if (list.includes(id)) return;
        list.push(id);
        localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(list)));
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
        const list = this.getAllGraphs();
        if (list.includes(id)) return;
        list.unshift(id);
        localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(list)));
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

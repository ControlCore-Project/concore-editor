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

const isValidGraphSnapshot = (graph) => !!(
    graph
    && typeof graph === 'object'
    && Array.isArray(graph.nodes)
    && Array.isArray(graph.edges)
);

const requestAsPromise = (request) => new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
});

const sanitizeSession = (session) => {
    if (!session || typeof session !== 'object') return null;
    const openGraphIDs = Array.isArray(session.openGraphIDs)
        ? session.openGraphIDs.filter((id) => typeof id === 'string' && id)
        : [];
    const activeGraphID = typeof session.activeGraphID === 'string' ? session.activeGraphID : null;
    const fileState = Array.isArray(session.fileState)
        ? session.fileState
            .filter((file) => file && typeof file === 'object' && typeof file.key === 'string')
            .map((file) => {
                let fileName = null;
                if (typeof file.fileName === 'string') fileName = file.fileName;
                else if (file.fileObj && file.fileObj.name) fileName = file.fileObj.name;
                return {
                    key: file.key,
                    modified: Number.isFinite(file.modified) ? file.modified : 0,
                    size: Number.isFinite(file.size) ? file.size : 0,
                    fileName,
                };
            })
        : [];
    return {
        openGraphIDs,
        activeGraphID,
        fileState,
        uploadedDirName: typeof session.uploadedDirName === 'string' ? session.uploadedDirName : null,
    };
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
    SESSION_STATE: window.btoa('SESSION_STATE'),

    DB_NAME: 'concore-editor-storage',
    DB_VERSION: 1,
    GRAPH_STORE: 'graphs',
    META_STORE: 'meta',
    META_GRAPH_ORDER: 'graph_order',
    META_SESSION: 'session',
    META_AUTHOR: 'author_name',
    META_MIGRATION_V1: 'migrated_local_storage_v1',

    db: null,
    initialized: false,
    initPromise: null,
    useFallback: false,
    graphCache: new Map(),
    graphOrder: [],
    sessionCache: null,
    authorNameCache: '',

    isIndexedDBAvailable() {
        return typeof window !== 'undefined' && !!window.indexedDB;
    },

    openDB() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.GRAPH_STORE)) {
                    db.createObjectStore(this.GRAPH_STORE, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(this.META_STORE)) {
                    db.createObjectStore(this.META_STORE, { keyPath: 'key' });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    getLegacyGraph(id) {
        const raw = localStorageGet(id);
        if (raw === null) return null;
        const parsed = parseStoredJson(raw);
        if (isValidGraphSnapshot(parsed)) return parsed;
        try {
            const plainJson = JSON.parse(raw);
            return isValidGraphSnapshot(plainJson) ? plainJson : null;
        } catch {
            return null;
        }
    },

    getLegacyGraphOrder() {
        const raw = localStorageGet(this.ALL_GRAPHS);
        if (!raw) return [];
        const parsed = parseStoredJson(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((id) => typeof id === 'string' && id);
    },

    getLegacySession() {
        const raw = localStorageGet(this.SESSION_STATE);
        if (!raw) return null;
        const parsed = parseStoredJson(raw);
        return sanitizeSession(parsed);
    },

    setFallbackMode() {
        this.useFallback = true;
        this.db = null;
        this.graphOrder = this.getLegacyGraphOrder();
        this.graphCache = new Map();
        this.graphOrder.forEach((id) => {
            const content = this.getLegacyGraph(id);
            if (content !== null) this.graphCache.set(id, content);
        });
        this.sessionCache = this.getLegacySession();
        this.authorNameCache = localStorageGet(this.AUTHOR_NAME) || '';
    },

    async getMetaValue(key) {
        if (!this.db) return null;
        const tx = this.db.transaction(this.META_STORE, 'readonly');
        const store = tx.objectStore(this.META_STORE);
        const record = await requestAsPromise(store.get(key));
        return record ? record.value : null;
    },

    async putMetaValue(key, value) {
        if (!this.db) return;
        const tx = this.db.transaction(this.META_STORE, 'readwrite');
        const store = tx.objectStore(this.META_STORE);
        await requestAsPromise(store.put({ key, value }));
    },

    async deleteGraphRecord(id) {
        if (!this.db) return;
        const tx = this.db.transaction(this.GRAPH_STORE, 'readwrite');
        const store = tx.objectStore(this.GRAPH_STORE);
        await requestAsPromise(store.delete(id));
    },

    async putGraphRecord(id, data) {
        if (!this.db) return;
        const tx = this.db.transaction(this.GRAPH_STORE, 'readwrite');
        const store = tx.objectStore(this.GRAPH_STORE);
        await requestAsPromise(store.put({ id, data, updatedAt: Date.now() }));
    },

    async persistGraphOrder() {
        if (this.useFallback) {
            localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(this.graphOrder)));
            return;
        }
        await this.putMetaValue(this.META_GRAPH_ORDER, this.graphOrder);
    },

    async migrateLegacyLocalStorage() {
        const migrated = await this.getMetaValue(this.META_MIGRATION_V1);
        if (migrated) return;

        const legacyOrder = this.getLegacyGraphOrder();
        legacyOrder.forEach((id) => {
            if (this.graphCache.has(id)) return;
            const graph = this.getLegacyGraph(id);
            if (!graph) return;
            this.graphCache.set(id, graph);
        });

        if (!this.graphOrder.length && legacyOrder.length) {
            this.graphOrder = legacyOrder;
        }

        const legacySession = this.getLegacySession();
        if (!this.sessionCache && legacySession) {
            this.sessionCache = legacySession;
        }

        if (!this.authorNameCache) {
            this.authorNameCache = localStorageGet(this.AUTHOR_NAME) || '';
        }

        await Promise.all(
            Array.from(this.graphCache.entries()).map(([id, data]) => this.putGraphRecord(id, data)),
        );
        await this.persistGraphOrder();
        if (this.sessionCache) await this.putMetaValue(this.META_SESSION, this.sessionCache);
        if (this.authorNameCache) await this.putMetaValue(this.META_AUTHOR, this.authorNameCache);
        await this.putMetaValue(this.META_MIGRATION_V1, true);
    },

    async initialize() {
        if (this.initPromise) return this.initPromise;
        this.initPromise = (async () => {
            if (!this.isIndexedDBAvailable()) {
                this.setFallbackMode();
                this.initialized = true;
                return;
            }
            try {
                this.db = await this.openDB();

                const tx = this.db.transaction(this.GRAPH_STORE, 'readonly');
                const graphStore = tx.objectStore(this.GRAPH_STORE);
                const graphRecords = await requestAsPromise(graphStore.getAll());
                this.graphCache = new Map();
                graphRecords.forEach((record) => {
                    if (!record || typeof record.id !== 'string') return;
                    if (!isValidGraphSnapshot(record.data)) return;
                    this.graphCache.set(record.id, record.data);
                });

                const orderFromMeta = await this.getMetaValue(this.META_GRAPH_ORDER);
                if (Array.isArray(orderFromMeta)) {
                    this.graphOrder = orderFromMeta.filter((id) => typeof id === 'string' && this.graphCache.has(id));
                    this.graphCache.forEach((value, id) => {
                        if (!this.graphOrder.includes(id)) this.graphOrder.push(id);
                    });
                } else {
                    this.graphOrder = Array.from(this.graphCache.keys());
                }

                this.sessionCache = sanitizeSession(await this.getMetaValue(this.META_SESSION));
                this.authorNameCache = await this.getMetaValue(this.META_AUTHOR) || '';

                await this.migrateLegacyLocalStorage();
                this.initialized = true;
            } catch (e) {
                this.setFallbackMode();
                this.initialized = true;
            }
        })();
        return this.initPromise;
    },

    ensureInitialized() {
        if (!this.initPromise && !this.initialized) this.initialize();
    },

    get(id) {
        this.ensureInitialized();
        if (typeof id !== 'string' || !id) return null;
        if (this.graphCache.has(id)) {
            const graph = this.graphCache.get(id);
            return isValidGraphSnapshot(graph) ? graph : null;
        }
        if (this.useFallback) return this.getLegacyGraph(id);
        return null;
    },
    save(id, graphContent) {
        this.ensureInitialized();
        if (typeof id !== 'string' || !id || !graphContent) return;
        this.addGraph(id);
        this.graphCache.set(id, graphContent);

        if (this.useFallback) {
            localStorageSet(id, encodeBase64(JSON.stringify(graphContent)));
            return;
        }

        this.initialize().then(async () => {
            if (this.useFallback) {
                localStorageSet(id, encodeBase64(JSON.stringify(graphContent)));
                return;
            }
            await this.putGraphRecord(id, graphContent);
        }).catch(() => {
            localStorageSet(id, encodeBase64(JSON.stringify(graphContent)));
        });
    },
    remove(id) {
        this.ensureInitialized();
        if (typeof id !== 'string' || !id) return;
        this.graphOrder = this.getAllGraphs().filter((g) => g !== id);
        this.graphCache.delete(id);
        if (this.useFallback) {
            localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(this.graphOrder)));
            localStorageRemove(id);
            return;
        }
        this.initialize().then(async () => {
            await this.persistGraphOrder();
            await this.deleteGraphRecord(id);
        }).catch(() => {
            localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(this.graphOrder)));
            localStorageRemove(id);
        });
    },
    addGraph(id) {
        this.ensureInitialized();
        if (typeof id !== 'string' || !id) return;
        const list = this.getAllGraphs();
        if (list.includes(id)) return;
        this.graphOrder = [...list, id];
        if (this.useFallback) {
            localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(this.graphOrder)));
            return;
        }
        this.initialize().then(() => this.persistGraphOrder()).catch(() => {
            localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(this.graphOrder)));
        });
    },
    getAllGraphs() {
        this.ensureInitialized();
        if (Array.isArray(this.graphOrder) && this.graphOrder.length) return this.graphOrder;
        if (this.useFallback) {
            const parsed = this.getLegacyGraphOrder();
            this.graphOrder = parsed;
            return parsed;
        }
        return this.graphOrder;
    },
    addToFront(id) {
        this.ensureInitialized();
        if (typeof id !== 'string' || !id) return;
        const list = this.getAllGraphs();
        if (list.includes(id)) return;
        this.graphOrder = [id, ...list];
        if (this.useFallback) {
            localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(this.graphOrder)));
            return;
        }
        this.initialize().then(() => this.persistGraphOrder()).catch(() => {
            localStorageSet(this.ALL_GRAPHS, encodeBase64(JSON.stringify(this.graphOrder)));
        });
    },
    getAuthorName() {
        this.ensureInitialized();
        if (this.authorNameCache) return this.authorNameCache;
        if (this.useFallback) {
            this.authorNameCache = localStorageGet(this.AUTHOR_NAME) || '';
        }
        return this.authorNameCache || '';
    },
    setAuthorName(authorName) {
        this.ensureInitialized();
        this.authorNameCache = authorName;
        if (this.useFallback) {
            localStorageSet(this.AUTHOR_NAME, authorName);
            return;
        }
        this.initialize().then(() => this.putMetaValue(this.META_AUTHOR, authorName)).catch(() => {
            localStorageSet(this.AUTHOR_NAME, authorName);
        });
    },
    clearGraph(id) {
        this.ensureInitialized();
        if (typeof id !== 'string' || !id) return;
        this.graphCache.delete(id);
        if (this.useFallback) {
            localStorageRemove(id);
            return;
        }
        this.initialize().then(() => this.deleteGraphRecord(id)).catch(() => {
            localStorageRemove(id);
        });
    },
    getFileList() {
        return localStorageGet('fileList') || '';
    },
    saveSession(sessionState) {
        this.ensureInitialized();
        const safeSession = sanitizeSession(sessionState);
        if (!safeSession) return;
        this.sessionCache = safeSession;
        if (this.useFallback) {
            localStorageSet(this.SESSION_STATE, encodeBase64(JSON.stringify(safeSession)));
            return;
        }
        this.initialize().then(() => this.putMetaValue(this.META_SESSION, safeSession)).catch(() => {
            localStorageSet(this.SESSION_STATE, encodeBase64(JSON.stringify(safeSession)));
        });
    },
    getSession() {
        this.ensureInitialized();
        if (this.sessionCache) return this.sessionCache;
        if (this.useFallback) {
            this.sessionCache = this.getLegacySession();
        }
        return this.sessionCache;
    },
};
export default localStorageManager;

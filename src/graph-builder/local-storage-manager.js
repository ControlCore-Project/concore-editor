const getSet = (ALL_GRAPHS) => {
    if (!window.localStorage.getItem(ALL_GRAPHS)) {
        window.localStorage.setItem(ALL_GRAPHS, window.btoa(JSON.stringify([])));
    }
    return new Set(JSON.parse(window.atob(window.localStorage.getItem(ALL_GRAPHS))));
};

const localStorageManager = {
    ALL_GRAPHS: window.btoa('ALL_GRAPHS'),
    AUTHOR_NAME: window.btoa('AUTHOR_NAME'),

    allgs: getSet(window.btoa('ALL_GRAPHS')),

    saveAllgs() {
        window.localStorage.setItem(this.ALL_GRAPHS, window.btoa(JSON.stringify(Array.from(this.allgs))));
    },

    addEmptyIfNot() {
        if (!window.localStorage.getItem(this.ALL_GRAPHS)) {
            window.localStorage.setItem(this.ALL_GRAPHS, window.btoa(JSON.stringify([])));
        }
    },

    get(id) {
        if (window.localStorage.getItem(id) === null) return null;
        return JSON.parse(window.atob(window.localStorage.getItem(id)));
    },
    save(id, graphContent) {
        this.addGraph(id);
        const serializedJson = JSON.stringify(graphContent);
        window.localStorage.setItem(id, window.btoa(serializedJson));
    },
    remove(id) {
        if (this.allgs.delete(id)) this.saveAllgs();
        localStorage.removeItem(id);
    },
    addGraph(id) {
        if (this.allgs.has(id)) return;
        this.allgs.add(id);
        this.saveAllgs();
    },
    getAllGraphs() {
        return JSON.parse(window.atob(window.localStorage.getItem(this.ALL_GRAPHS)));
    },
    addToFront(id) {
        if (this.allgs.has(id)) return;
        this.allgs.add(id);
        const Garr = JSON.parse(window.atob(window.localStorage.getItem(this.ALL_GRAPHS)));
        Garr.unshift(id);
        window.localStorage.setItem(this.ALL_GRAPHS, window.btoa(JSON.stringify(Garr)));
    },
    getAuthorName() {
        return localStorage.getItem(this.AUTHOR_NAME) || '';
    },
    setAuthorName(authorName) {
        localStorage.setItem(this.AUTHOR_NAME, authorName);
    },
    clearGraph(id) {
        window.localStorage.removeItem(id);
    },
    getFileList() {
        return localStorage.getItem('fileList') || '';
    },
};
export default localStorageManager;

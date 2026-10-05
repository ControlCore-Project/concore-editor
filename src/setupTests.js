window.matchMedia = window.matchMedia || (() => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
}));

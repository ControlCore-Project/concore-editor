import getCytoscapeStyle from './cytoscape-style';

const getCytoscapeOptions = (darkMode = false) => ({
    style: [...getCytoscapeStyle(darkMode)],
    zoomingEnabled: true,
    userZoomingEnabled: true,
    minZoom: 0.25,
    maxZoom: 5,
});

export default getCytoscapeOptions;

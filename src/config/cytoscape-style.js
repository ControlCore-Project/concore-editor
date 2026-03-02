const getCytoscapeStyle = (darkMode = false) => {
    // Theme-aware colors
    const edgeLabelTextColor = darkMode ? '#ffffff' : '#333';
    const edgeLabelBgColor = darkMode ? '#2d2d2d' : '#fff';
    const bendNodeColor = darkMode ? '#7e57c2' : '#9575cd';
    const handleColor = darkMode ? '#ff1744' : '#f50057';
    const overlayColor = darkMode ? '#fff' : '#000';
    const nodeTextColor = darkMode ? '#FFFFFF' : '#000'; // Text color for nodes

    return [
        {
            selector: '*',
            style: {
                overlayOpacity: '0',
            },
        },
        {
            selector: 'node[type = "ordin"]',
            style: {
                content: 'data(label)',
                zIndex: 100,
                width: 'data(style.width)',
                height: 'data(style.height)',
                shape: 'data(style.shape)',
                opacity: 'data(style.opacity)',
                backgroundColor: 'data(style.backgroundColor)',
                borderColor: 'data(style.borderColor)',
                borderWidth: 'data(style.borderWidth)',
                color: nodeTextColor, // Theme-aware text color
                textValign: 'center',
                textHalign: 'center',
                fontSize: (ele) => {
                    const w = ele.data('style').width;
                    const h = ele.data('style').height;
                    const val = Math.min(w, h);
                    if (val < 20) return 5;
                    if (val > 500) return 60;
                    return 10 + ((val - 20) * 50) / 480;
                },
                textWrap: 'wrap',
                textMaxWidth: 'data(style.width)',
            },
        },
        {
            selector: 'node[type="special"]',
            style: {
                width: 8,
                height: 8,
                backgroundColor: 'data(style.backgroundColor)',
                zIndex: 1000,
            },
        },

        {
            selector: 'edge',
            style: {
                curveStyle: 'bezier',
                targetArrowShape: 'triangle',
                arrowScale: 1.2,
            },
        },
        {
            selector: 'edge[type = "ordin"]',
            style: {
                width: 'data(style.thickness)',
                lineColor: darkMode ? '#E0E0E0' : 'data(style.backgroundColor)',
                targetArrowColor: darkMode ? '#E0E0E0' : 'data(style.backgroundColor)',
                curveStyle: (ele) => {
                    const source = ele.source();
                    const target = ele.target();

                    // Check if there are parallel edges
                    const parallelEdges = source.edgesWith(target);
                    const hasParallelEdges = parallelEdges.length > 1;

                    // Get positions
                    const p1 = source.position();
                    const p2 = target.position();

                    // Calculate distance between nodes
                    const distance = Math.sqrt(
                        (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2,
                    );

                    // Calculate difference
                    const dx = Math.abs(p1.x - p2.x);
                    const dy = Math.abs(p1.y - p2.y);

                    // Define a threshold for what counts as "aligned"
                    const threshold = 10;

                    // Check if edge has custom bend data
                    const bendDistance = ele.data('bendData')?.bendDistance || 0;
                    const hasBend = Math.abs(bendDistance) > 0;

                    // When nodes are very close, always use straight style to prevent edge disappearance
                    if (distance < 50) {
                        return 'straight';
                    }

                    // For parallel edges or edges with bend, use bezier curves
                    if (hasParallelEdges || hasBend) {
                        return 'unbundled-bezier';
                    }

                    // If aligned horizontally OR vertically, be straight
                    if (dx < threshold || dy < threshold) {
                        return 'straight';
                    }

                    // use unbundled-bezier to respect bend points
                    return 'unbundled-bezier';
                },
                segmentDistances: (ele) => {
                    // When nodes are very close, don't apply bend to prevent edge disappearance
                    const source = ele.source();
                    const target = ele.target();
                    const p1 = source.position();
                    const p2 = target.position();
                    const distance = Math.sqrt(
                        (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2,
                    );

                    if (distance < 50) {
                        return 0;
                    }

                    return ele.data('bendData.bendDistance');
                },
                segmentWeights: 'data(bendData.bendWeight)',
                edgeDistances: 'node-position',
                lineStyle: 'data(style.shape)',
                controlPointDistances: (ele) => {
                    // For parallel edges, ensure adequate control point spacing
                    const bendDistance = ele.data('bendData')?.bendDistance || 0;
                    return Math.abs(bendDistance) > 0 ? bendDistance : undefined;
                },
                controlPointWeights: (ele) => {
                    const bendWeight = ele.data('bendData')?.bendWeight;
                    return bendWeight !== undefined ? bendWeight : 0.5;
                },
            },
        },
        {
            selector: 'edge[label]',
            style: {
                label: (ele) => {
                    // Get source and target nodes
                    const source = ele.source();
                    const target = ele.target();

                    // Calculate distance between nodes
                    const p1 = source.position();
                    const p2 = target.position();
                    const distance = Math.sqrt(
                        (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2,
                    );

                    // Define minimum distance threshold (in pixels)
                    // Below this distance, hide the label to prevent visual clutter
                    const minDistanceForLabel = 80;

                    // Return label only if nodes are far enough apart
                    return distance >= minDistanceForLabel ? ele.data('label') : '';
                },
                edgeTextRotation: 'autorotate',
                zIndex: 999,
                fontSize: 12,
                textBackgroundOpacity: 1,
                textBackgroundPadding: '3px',
                textBorderWidth: 0,
                color: edgeLabelTextColor,
                textBackgroundColor: edgeLabelBgColor,
                textBackgroundShape: 'roundrectangle',
            },
        },
        {
            selector: '.hidden',
            style: {
                display: 'none',
            },
        },
        {
            selector: '.eh-handle,node[type="bend"]',
            style: {
                height: 25,
                width: 25,
                opacity: 0.4,
                borderWidth: 5,
                borderOpacity: 0.1,
            },
        },
        {
            selector: 'node[type="bend"]',
            style: {
                backgroundColor: bendNodeColor,
            },
        },
        {
            selector: '.eh-handle',
            style: {
                backgroundColor: handleColor,
            },
        },
        {
            selector: ':selected',
            style: {
                overlayColor: darkMode ? '#2B8CF7' : overlayColor, // Accent blue for selected in dark mode
                overlayOpacity: darkMode ? 0.3 : 0.1,
                overlayPadding: darkMode ? 3 : 5,
            },
        },
        // Selected nodes - enhanced border
        {
            selector: 'node:selected',
            style: {
                'border-color': darkMode ? '#2B8CF7' : 'data(style.borderColor)',
                'border-width': darkMode ? 3 : 'data(style.borderWidth)',
            },
        },
        {
            selector: '.search-match',
            style: {
                overlayColor: '#f5a623',
                overlayOpacity: 0.45,
                overlayPadding: 4,
            },
        },
        {
            selector: '.search-dim',
            style: {
                opacity: 0.2,
            },
        },

    ];
};

export default getCytoscapeStyle;

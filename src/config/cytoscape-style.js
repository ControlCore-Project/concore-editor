const style = [
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
            lineColor: 'data(style.backgroundColor)',
            targetArrowColor: 'data(style.backgroundColor)',
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
            color: '#333',
            textBackgroundColor: '#fff',
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
            backgroundColor: '#9575cd',
        },
    },
    {
        selector: '.eh-handle',
        style: {
            backgroundColor: '#f50057',
        },
    },
    {
        selector: ':selected',
        style: {
            overlayColor: '#000',
            overlayOpacity: 0.1,
            overlayPadding: 5,
        },
    },

];

export default style;

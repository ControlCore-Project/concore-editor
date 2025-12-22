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
                if (val < 20) return 10;
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
        },
    },
    {
        selector: 'edge[type = "ordin"]',
        style: {
            width: 'data(style.thickness)',
            lineColor: 'data(style.backgroundColor)',
            targetArrowColor: 'data(style.backgroundColor)',
            curveStyle: 'segments',
            segmentDistances: 'data(bendData.bendDistance)',
            segmentWeights: 'data(bendData.bendWeight)',
            edgeDistances: 'node-position',
            lineStyle: 'data(style.shape)',
        },
    },
    {
        selector: 'edge[label]',
        style: {
            label: 'data(label)',
            edgeTextRotation: 'autorotate',
            zIndex: 999,
            textBackgroundOpacity: 1,
            color: '#000',
            textBackgroundColor: '#fff',
            textBackgroundShape: 'roundrectangle',
            textBorderColor: '#fff',
            textBorderWidth: 2,
            textBorderOpacity: 1,
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

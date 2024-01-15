import PropFromArr from './PropFromArr';

const mapByDefault = (x, arr, def) => {
    if (arr.includes(x)) return x;
    return def;
};

const parseNode = (node) => {
    const p = new PropFromArr(node).parseProps('data.y:ShapeNode', 2);
    return {
        label: p.parseProps('y:NodeLabel._') || p.parseProps('y:NodeLabel'),
        id: new PropFromArr(node).parseProps('$.id'),
        position: {
            x: parseFloat(p.parseProps('y:Geometry.$.x')),
            y: parseFloat(p.parseProps('y:Geometry.$.y')),
        },
        style: {
            width: parseFloat(p.parseProps('y:Geometry.$.width')),
            height: parseFloat(p.parseProps('y:Geometry.$.height')),
            opacity: parseInt(p.parseProps('y:Fill.$.opacity'), 10) || 1,
            shape: mapByDefault(p.parseProps('y:Shape.$.type'), ['rectangle', 'ellipse'], 'rectangle'),
            backgroundColor: p.parseProps('y:Fill.$.color'),
            borderColor: p.parseProps('y:BorderStyle.$.color'),
            borderWidth: parseInt(p.parseProps('y:BorderStyle.$.width'), 10),
        },
    };
};

const parseEdge = (edge) => ({
    label: new PropFromArr(edge).parseProps('data.*.y:EdgeLabel._')
             || new PropFromArr(edge).parseProps('data.*.y:EdgeLabel'),
    source: new PropFromArr(edge).parseProps('$.source'),
    target: new PropFromArr(edge).parseProps('$.target'),
    style: {
        backgroundColor: new PropFromArr(edge).parseProps('data.*.y:LineStyle.$.color'),
        thickness: parseFloat(new PropFromArr(edge).parseProps('data.*.y:LineStyle.$.width')),
        shape: mapByDefault(new PropFromArr(edge).parseProps('data.*.y:LineStyle.$.type'),
            ['dashed', 'dotted'], 'solid'),
    },
    bendData: {
        bendPoint: new PropFromArr(edge).parseProps('data.*.y:Path.y:Point.$'),
    },
});

const parseActionML = (({ actionName, parameters }) => ({ actionName: actionName[0], parameters: parameters[0] }));

const parseActionHistory = (grahML) => grahML.parseProps('graphml.graph.actionHistory', 1)
    .map(({
        equivalent, inverse, tid,
    }) => ({

        equivalent: parseActionML(equivalent[0]),
        inverse: parseActionML(inverse[0]),
        tid: tid[0],
    }));

const parseDetails = (grahML) => grahML.parseProps('graphml.graph.$');

export {
    parseNode, parseEdge, parseDetails, parseActionHistory,
};

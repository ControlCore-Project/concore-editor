import xml2js from 'xml2js';
import nodeML from './nodeML';
import graphML from './graphML';
import edgeML from './edgeML';

const builder = (G) => {
    const nodes = G.nodes.map((node) => (nodeML({
        label: node.label,
        id: node.id,
        posX: node.position.x,
        posY: node.position.y,
        ...node.style,
    })));
    const edges = G.edges.map((edg, i) => edgeML({
        id: i,
        label: edg.label,
        source: edg.source,
        target: edg.target,
        lineColor: edg.style.backgroundColor,
        lineWidth: edg.style.thickness,
        bendPoint: edg.bendData.bendPoint,
        type: edg.style.shape,
    }));
    const X = graphML({
        nodes,
        edges,
        projectName: G.projectName,
        id: G.id,
        actionHistory: G.actionHistory,
        serverID: G.serverID,
        fileHandle: G.fileHandle,
        fileName: G.fileName,
        authorName: G.authorName,
    });
    const xml = new xml2js.Builder().buildObject(X);
    return xml;
};
export default builder;

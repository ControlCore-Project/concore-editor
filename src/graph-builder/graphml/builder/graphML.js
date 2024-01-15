const graphML = ({
  nodes, edges, id, projectName, authorName, actionHistory, serverID, fileHandle, fileName,
}) => ({
  graphml: {
    $: {
      xmlns: 'http://graphml.graphdrawing.org/xmlns',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd',
      'xmlns:y': 'http://www.yworks.com/xml/graphml',
    },
    key: [
      {
        $: {
          for: 'node',
          id: 'd6',
          'yfiles.type': 'nodegraphics',
        },
      },
      {
        $: {
          for: 'edge',
          id: 'd10',
          'yfiles.type': 'edgegraphics',
        },
      },
    ],
    graph: [
      {
        $: {
          edgedefault: 'directed',
          id,
          projectName,
          serverID,
          fileHandle,
          fileName,
          authorName,
        },
        node: nodes,
        edge: edges,
        actionHistory,
      },
    ],
  },
});

export default graphML;

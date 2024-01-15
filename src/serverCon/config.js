export default {
    baseURL: 'http://localhost:8000/',
    getGraph: (id) => `workflow/${id}`,
    postGraph: 'workflow',
    updateGraph: (id) => `workflow/${id}`,
    forceUpdateGraph: (id) => `workflow/${id}?force=true`,
};

/*
getGraph Route Specs:
    Method: GET
    Response:
        Body: json {writeTime: '23435444.54545', id: 'graphid'}
        BodyType: application/json
        Header: X-Write-Time: 'writeTime'

postGraph Route Specs:
    Method: POST
    Request:
        Body: graphML data
        BodyType: application/xml
    Response:
        Body: json {writeTime: '23435444.54545', id: 'graphid'}
        BodyType: application/json

updateGraph:
    Method: POST
    Request:
        Header: X-Write-Time: 'writeTime'
        Body: graphML data
        BodyType: application/xml
    Response:
        Body: newWriteTime

forceUpdateGraph:
    Force update the graph without validating the write time.
    Method: POST
    Request:
        Body: graphML data
        BodyType: application/xml
    Response:
        Body: newWriteTime
*/

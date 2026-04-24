import ec from './config';

function readTextOrThrow(x) {
    return x.text().then((text) => {
        if (x.ok) return text;
        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = null;
        }
        const err = new Error(
            (data && data.message)
            || text
            || `Request failed with status ${x.status}`,
        );
        err.status = x.status;
        err.body = text;
        err.data = data;
        err.code = data && data.code ? data.code : null;
        throw err;
    });
}

function getGraph(serverID) {
    return fetch(`${ec.baseURL + ec.getGraph(serverID)}`).then((x) => readTextOrThrow(x));
}

function getGraphWithHashCheck(serverID, latestHash) {
    return fetch(`${ec.baseURL + ec.getGraph(serverID)}`, {
        headers: {
            'X-Latest-Hash': latestHash,
        },
    }).then((x) => readTextOrThrow(x));
}

function postGraph(graphml) {
    return fetch(`${ec.baseURL + ec.postGraph}/`, {
        headers: {
            'Content-Type': 'application/xml',
        },
        method: 'POST',
        body: graphml,
    }).then((x) => readTextOrThrow(x));
}

function updateGraph(serverID, graphml) {
    return fetch(ec.baseURL + ec.updateGraph(serverID), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: graphml,
    }).then((x) => readTextOrThrow(x));
}

function forceUpdateGraph(serverID, graphml) {
    return fetch(ec.baseURL + ec.forceUpdateGraph(serverID), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: graphml,
    }).then((x) => readTextOrThrow(x));
}

export {
    getGraph, postGraph, updateGraph, forceUpdateGraph, getGraphWithHashCheck,
};

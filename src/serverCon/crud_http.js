import ec from './config';

function getGraph(serverID) {
    return fetch(`${ec.baseURL + ec.getGraph(serverID)}`).then((x) => x.text());
}

function getGraphWithHashCheck(serverID, latestHash) {
    return fetch(`${ec.baseURL + ec.getGraph(serverID)}`, {
        headers: {
            'X-Latest-Hash': latestHash,
        },
    }).then((x) => {
        if (x.status === 200) return x.text();
        return Promise.reject(x.text());
    });
}

function postGraph(graphml) {
    return fetch(`${ec.baseURL + ec.postGraph}/`, {
        headers: {
            'Content-Type': 'application/xml',
        },
        method: 'POST',
        body: graphml,
    }).then((x) => {
        if (!x.ok) return Promise.reject(x.text());
        return x.text();
    });
}

function updateGraph(serverID, graphml) {
    return fetch(ec.baseURL + ec.updateGraph(serverID), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: graphml,
    }).then((x) => {
        if (!x.ok) return Promise.reject(x.text());
        return x.text();
    });
}

function forceUpdateGraph(serverID, graphml) {
    return fetch(ec.baseURL + ec.forceUpdateGraph(serverID), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        body: graphml,
    }).then((x) => {
        if (!x.ok) return Promise.reject(x.text());
        return x.text();
    });
}

export {
    getGraph, postGraph, updateGraph, forceUpdateGraph, getGraphWithHashCheck,
};

import ec from './config';

function getGraph(serverID) {
    return new Promise((resolve, reject) => {
        fetch(`${ec.baseURL + ec.getGraph(serverID)}`).then((x) => {
            resolve(x.text());
        }).catch((e) => reject(e));
    });
}

function getGraphWithHashCheck(serverID, latestHash) {
    return new Promise((resolve, reject) => {
        fetch(`${ec.baseURL + ec.getGraph(serverID)}`, {
            headers: {
                'X-Latest-Hash': latestHash,
            },
        }).then((x) => {
            if (x.status === 200) resolve(x.text());
            else reject(x.text());
        }).catch((e) => reject(e));
    });
}

function postGraph(graphml) {
    return new Promise((resolve, reject) => {
        fetch(`${ec.baseURL + ec.postGraph}/`, {
            headers: {
                'Content-Type': 'application/xml',
            },
            method: 'POST',
            body: graphml,

        }).then((x) => {
            resolve(x.text());
        }).catch((e) => reject(e));
    });
}

function updateGraph(serverID, graphml) {
    return new Promise((resolve, reject) => {
        fetch(ec.baseURL + ec.updateGraph(serverID), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
            },
            body: graphml,
        }).then((x) => {
            resolve(x.text());
        }).catch((e) => reject(e));
    });
}

function forceUpdateGraph(serverID, graphml) {
    return new Promise((resolve, reject) => {
        fetch(ec.baseURL + ec.forceUpdateGraph(serverID), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
            },
            body: graphml,
        }).then((x) => {
            resolve(x.text());
        }).catch((e) => reject(e));
    });
}

export {
    getGraph, postGraph, updateGraph, forceUpdateGraph, getGraphWithHashCheck,
};

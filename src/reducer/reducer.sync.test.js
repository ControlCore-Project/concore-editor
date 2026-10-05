import T from './actionType';
import reducer from './reducer';
import { initialState } from './initialState';

describe('reducer sync state', () => {
    it('updates sync state only for target graph', () => {
        const state = {
            ...initialState,
            graphs: [
                {
                    graphID: 'g1',
                    syncStatus: {
                        state: 'dirty',
                        localHash: 'l1',
                        remoteHash: '',
                        lastResult: '',
                        reason: '',
                    },
                },
                {
                    graphID: 'g2',
                    syncStatus: {
                        state: 'synced',
                        localHash: 'l2',
                        remoteHash: 'r2',
                        lastResult: 'ok',
                        reason: '',
                    },
                },
            ],
        };

        const next = reducer(state, {
            type: T.SET_GRAPH_SYNC_STATE,
            payload: {
                graphID: 'g1',
                syncStatus: {
                    state: 'conflict',
                    remoteHash: 'remote-x',
                },
            },
        });

        expect(next.graphs[0].syncStatus.state).toBe('conflict');
        expect(next.graphs[0].syncStatus.localHash).toBe('l1');
        expect(next.graphs[0].syncStatus.remoteHash).toBe('remote-x');
        expect(next.graphs[1].syncStatus).toEqual(state.graphs[1].syncStatus);
    });
});

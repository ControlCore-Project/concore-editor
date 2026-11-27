import React from 'react';
import './syncStatusPanel.css';

const stateLabel = {
    synced: 'Synced',
    dirty: 'Dirty',
    conflict: 'Conflict',
    syncing: 'Syncing',
    error: 'Error',
};

const SyncStatusPanel = ({ superState }) => {
    if (superState.curGraphIndex === -1) return null;

    const graph = superState.graphs[superState.curGraphIndex];
    if (!graph) return null;

    const syncStatus = graph.syncStatus || {};
    const {
        state = 'dirty',
        localHash = '',
        remoteHash = '',
        lastResult = 'Not synced yet',
    } = syncStatus;

    const instance = superState.curGraphInstance;
    const isConflict = state === 'conflict';

    return (
        <div className="sync-status-panel">
            <div className="sync-status-header">
                <strong>Sync</strong>
                <span className={`sync-status-badge ${state}`}>{stateLabel[state] || state}</span>
            </div>
            <div className="sync-status-meta">
                <div>
                    <span className="sync-key">Local:</span>
                    <span className="sync-value">{localHash || '-'}</span>
                </div>
                <div>
                    <span className="sync-key">Remote:</span>
                    <span className="sync-value">{remoteHash || '-'}</span>
                </div>
            </div>
            <div className="sync-status-result">{lastResult}</div>
            {isConflict && (
                <div className="sync-status-actions">
                    <button
                        type="button"
                        className="confirm-btn"
                        onClick={() => instance && instance.forcePullFromServer()}
                    >
                        Pull remote
                    </button>
                    <button
                        type="button"
                        className="confirm-btn"
                        onClick={() => instance && instance.forcePushToServer()}
                    >
                        Force push local
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => instance && instance.openRemoteInNewTab()}
                    >
                        Open remote
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => instance && instance.cancelSyncConflict()}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default SyncStatusPanel;

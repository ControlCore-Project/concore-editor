import React, { useEffect, useRef } from 'react';
import { actionType as T } from '../reducer';
import './searchPanel.css';

const SearchPanel = ({ superState, dispatcher }) => {
    const inputRef = useRef();
    const {
        searchPanel, searchQuery, searchResults, searchIndex, curGraphInstance,
    } = superState;

    useEffect(() => {
        if (searchPanel && inputRef.current) inputRef.current.focus();
    }, [searchPanel]);

    useEffect(() => {
        if (searchPanel && curGraphInstance && searchQuery) {
            const results = curGraphInstance.searchElements(searchQuery);
            dispatcher({ type: T.SET_SEARCH_RESULTS, payload: results });
            dispatcher({ type: T.SET_SEARCH_INDEX, payload: 0 });
            if (results.length > 0) curGraphInstance.flyToElement(results[0]);
        }
    }, [curGraphInstance]);

    const runSearch = (query) => {
        if (!curGraphInstance) return;
        const results = curGraphInstance.searchElements(query);
        dispatcher({ type: T.SET_SEARCH_RESULTS, payload: results });
        dispatcher({ type: T.SET_SEARCH_INDEX, payload: 0 });
        if (results.length > 0) curGraphInstance.flyToElement(results[0]);
    };

    const handleChange = (e) => {
        const q = e.target.value;
        dispatcher({ type: T.SET_SEARCH_QUERY, payload: q });
        runSearch(q);
    };

    const step = (dir) => {
        if (!searchResults.length) return;
        const next = (searchIndex + dir + searchResults.length) % searchResults.length;
        dispatcher({ type: T.SET_SEARCH_INDEX, payload: next });
        curGraphInstance.flyToElement(searchResults[next]);
    };

    const close = () => {
        if (curGraphInstance) curGraphInstance.clearSearch();
        dispatcher({ type: T.SET_SEARCH_PANEL, payload: false });
        dispatcher({ type: T.SET_SEARCH_QUERY, payload: '' });
        dispatcher({ type: T.SET_SEARCH_RESULTS, payload: [] });
        dispatcher({ type: T.SET_SEARCH_INDEX, payload: 0 });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'Enter') {
            e.preventDefault();
            step(e.shiftKey ? -1 : 1);
        }
    };

    if (!searchPanel) return null;

    const total = searchResults.length;
    const current = total > 0 ? searchIndex + 1 : 0;
    const hasQuery = searchQuery.trim().length > 0;

    let searchCounterMessage = '';
    if (hasQuery) {
        searchCounterMessage = total > 0 ? `${current} of ${total}` : 'No results';
    }

    return (
        <div className="search-panel">
            <input
                ref={inputRef}
                type="text"
                placeholder="Find node / edge…"
                value={searchQuery}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <span className="search-counter">{searchCounterMessage}</span>
            <button
                type="button"
                onClick={() => step(-1)}
                disabled={total < 2}
                title="Previous (Shift+Enter)"
            >
                ▲
            </button>
            <button
                type="button"
                onClick={() => step(1)}
                disabled={total < 2}
                title="Next (Enter)"
            >
                ▼
            </button>
            <button type="button" onClick={close} title="Close (Esc)">✕</button>
        </div>
    );
};

export default SearchPanel;

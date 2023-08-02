import React, { useState, useEffect } from 'react';
import './logs.css';
import { actionType as T } from '../reducer';

const Logs = ({ superState, dispatcher }) => {
    const [output, setOutput] = useState('');

    const clearTerminal = () => {
        setOutput('');
        dispatcher({ type: T.SET_LOGS_MESSAGE, payload: '' });
    };

    const closeTerminal = () => {
        dispatcher({ type: T.SET_LOGS, payload: false });
    };

    useEffect(() => {
        if (superState.logs) {
            document.getElementById('terminal').style.display = 'block';
            setOutput(superState.logsmessage);
        } else {
            document.getElementById('terminal').style.display = 'none';
            setOutput(superState.logsmessage);
        }
    }, [superState.logs]);

    return (
        <>
            <div className="terminal" id="terminal">
                <div className="terminal-header">
                    Logs
                    <button type="button" className="clear" onClick={clearTerminal}>Clear</button>
                    <button type="button" className="closelogs" onClick={closeTerminal}>X</button>
                </div>
                <div className="terminal-body">
                    {output.split('\n').map((line) => (
                        <div className="terminal-line">
                            {line}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Logs;

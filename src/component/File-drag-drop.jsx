import React, { useEffect } from 'react';
import { FaFileImport } from 'react-icons/fa';
import './file-drag-drop.css';
import { actionType as T } from '../reducer';
import { readFile } from '../toolbarActions/toolbarFunctions';

const app = ({ superState, dispatcher }) => {
    const fileRef = React.useRef();

    useEffect(() => {
        dispatcher({ type: T.SET_FILE_REF, payload: fileRef });
        const p = document.getElementsByTagName('body')[0];
        const c = document.getElementsByClassName('drag-drop-area')[0];
        let cc = 0;
        p.addEventListener('dragenter', (e) => {
            e.preventDefault();
            cc += 1;
            if (cc === 1) c.classList.remove('hidden');
        });
        p.addEventListener('dragleave', (e) => {
            e.preventDefault();
            cc -= 1;
            if (cc === 0) c.classList.add('hidden');
        });

        p.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        ['dragend', 'dragexit', 'drop'].forEach((dragEvent) => {
            p.addEventListener(dragEvent, (e) => {
                e.preventDefault();
                cc = 0;
                c.classList.add('hidden');
            });
        });

        p.addEventListener('drop', (e) => {
            e.preventDefault();
            fileRef.current.value = null;
            if (e.dataTransfer.files.length === 1
                && e.dataTransfer.files[0].name.split('.').slice(-1)[0] === 'graphml') {
                readFile(superState, dispatcher, e.dataTransfer.files[0]);
            }
        });
    }, []);
    return (
        <div className="drag-drop-area hidden">
            <div className="inner">
                <FaFileImport size={100} style={{ color: '#1e88e5' }} />
                <div>
                    <input
                        type="file"
                        ref={fileRef}
                        onClick={(e) => { e.target.value = null; }}
                        style={{ display: 'none' }}
                        accept=".graphml"
                        onChange={(e) => readFile(superState, dispatcher, e)}
                    />
                    <span className="arrow">&#10230;</span>
                    <h1 className="text">Drop the File anywhere to open</h1>
                </div>
            </div>
        </div>
    );
};

export default app;

import React, { useEffect } from 'react';
import { FaFileImport } from 'react-icons/fa';
import './file-drag-drop.css';
import { actionType as T } from '../reducer';
import { readFile } from '../toolbarActions/toolbarFunctions';

const app = ({ superState, dispatcher }) => {
    const fileRef = React.useRef();
    const superStateRef = React.useRef(superState);
    const dispatcherRef = React.useRef(dispatcher);

    useEffect(() => {
        superStateRef.current = superState;
        dispatcherRef.current = dispatcher;
    });

    useEffect(() => {
        dispatcher({ type: T.SET_FILE_REF, payload: fileRef });
        const p = document.getElementsByTagName('body')[0];
        const c = document.getElementsByClassName('drag-drop-area')[0];
        let cc = 0;

        const onDragEnter = (e) => {
            e.preventDefault();
            cc += 1;
            if (cc === 1) c.classList.remove('hidden');
        };
        const onDragLeave = (e) => {
            e.preventDefault();
            cc -= 1;
            if (cc === 0) c.classList.add('hidden');
        };
        const onDragOver = (e) => { e.preventDefault(); };
        const onDragReset = (e) => {
            e.preventDefault();
            cc = 0;
            c.classList.add('hidden');
        };
        const onDrop = (e) => {
            e.preventDefault();
            fileRef.current.value = null;
            const droppedFile = e.dataTransfer.files[0];
            const ext = droppedFile && droppedFile.name.split('.').slice(-1)[0]?.toLowerCase();
            const allowed = ['graphml', 'json', 'png', 'svg', 'jpg', 'jpeg'];
            if (e.dataTransfer.files.length === 1 && allowed.includes(ext)) {
                readFile(superStateRef.current, dispatcherRef.current, droppedFile);
            }
        };

        p.addEventListener('dragenter', onDragEnter);
        p.addEventListener('dragleave', onDragLeave);
        p.addEventListener('dragover', onDragOver);
        ['dragend', 'dragexit', 'drop'].forEach((dragEvent) => p.addEventListener(dragEvent, onDragReset));
        p.addEventListener('drop', onDrop);

        return () => {
            p.removeEventListener('dragenter', onDragEnter);
            p.removeEventListener('dragleave', onDragLeave);
            p.removeEventListener('dragover', onDragOver);
            ['dragend', 'dragexit', 'drop'].forEach((dragEvent) => p.removeEventListener(dragEvent, onDragReset));
            p.removeEventListener('drop', onDrop);
        };
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
                        accept=".graphml,.json,.png,.svg,.jpg,.jpeg"
                        onChange={(e) => readFile(superState, dispatcher, e.target.files[0])}
                    />
                    <span className="arrow">&#10230;</span>
                    <h1 className="text">Drop the File anywhere to open</h1>
                </div>
            </div>
        </div>
    );
};

export default app;

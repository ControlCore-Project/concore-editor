import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import { saveAs } from 'file-saver';
import Modal from './ParentModal';
import './file-edit.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-verilog';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { actionType as T } from '../../reducer';

const FileEditModal = ({ superState, dispatcher }) => {
    const [codeStuff, setCodeStuff] = useState('');
    const [fileName, setFileName] = useState('');
    const [dirButton, setDirButton] = useState(false);

    useEffect(() => {
        if (navigator.userAgent.indexOf('Edg') !== -1 || navigator.userAgent.indexOf('Chrome') !== -1) {
            setDirButton(true);
        }
    }, []);

    const close = () => {
        dispatcher({ type: T.EDIT_TEXTFILE, payload: { show: false } });
        setCodeStuff('');
        setFileName('');
    };

    async function submit() {
        if (superState.fileHandle) {
            const stream = await superState.fileHandle.createWritable();
            await stream.write(codeStuff);
            await stream.close();
        } else {
            // eslint-disable-next-line no-alert
            alert('Switch to Edge/Chrome!');
        }
        dispatcher({ type: T.EDIT_TEXTFILE, payload: { show: false } });
    }

    async function saveAsSubmit() {
        const handle = await window.showSaveFilePicker();
        const stream = await handle.createWritable();
        await stream.write(codeStuff);
        await stream.close();
        const fileData = await handle.getFile();
        let fS = superState.fileState;
        fS = fS.concat([{
            key: `${superState.uploadedDirName}/${handle.name}`,
            modified: fileData.lastModified,
            size: fileData.size,
            fileObj: fileData,
            fileHandle: handle,
        }]);
        dispatcher({ type: T.SET_FILE_STATE, payload: fS });
        // dispatcher({ type: T.EDIT_TEXTFILE, payload: { show: false } });
    }

    async function saveSubmit() {
        // eslint-disable-next-line no-alert
        const newFileName = prompt('Filename:');
        const bytes = new TextEncoder().encode(codeStuff);
        const blob = new Blob([bytes], { type: 'application/json;charset=utf-8' });
        saveAs(blob, newFileName);
        // dispatcher({ type: T.EDIT_TEXTFILE, payload: { show: false } });
    }

    useEffect(async () => {
        if (superState.fileObj) {
            setFileName(superState.fileObj.name);
            const fr = new FileReader();
            fr.onload = (x) => {
                setCodeStuff(x.target.result);
            };
            if (superState.fileHandle) fr.readAsText(await superState.fileHandle.getFile());
            else fr.readAsText(superState.fileObj);
        }
    }, [superState.fileObj]);

    function highlightSyntax(code) {
        const extensions = ['v', 'c', 'h', 'hpp', 'cpp', 'py', 'm', 'sh'];
        const fileEx = fileName.split('.').pop();
        if (extensions.includes(fileEx)) {
            switch (fileEx) {
            case 'v': return highlight(code, languages.verilog, 'verilog');
            case 'c': return highlight(code, languages.c, 'c');
            case 'h': return highlight(code, languages.c, 'c');
            case 'hpp': return highlight(code, languages.c, 'c');
            case 'cpp': return highlight(code, languages.cpp, 'cpp');
            case 'py': return highlight(code, languages.python, 'python');
            case 'm': return highlight(code, languages.matlab, 'matlab');
            case 'sh': return highlight(code, languages.bash, 'bash');
            default: return highlight(code, languages.plaintext);
            }
        }
        return highlight(code, languages.plaintext);
    }

    return (
        <Modal
            ModelOpen={superState.textFileModal}
            closeModal={close}
            title={fileName}
        >
            <div>
                <div className="save-bar">
                    {fileName
                        && (
                            <button type="submit" className="btn btn-primary" onClick={submit}>Save</button>
                        )}
                    {dirButton && (
                        <button type="submit" className="btn btn-primary" onClick={saveAsSubmit}>
                            Save
                            {fileName ? ' As' : ''}
                        </button>
                    )}
                    {!dirButton && (
                        <button type="submit" className="btn btn-primary" onClick={saveSubmit}>Save As</button>
                    )}
                </div>
                <div className="setting-container">
                    <Editor
                        value={codeStuff}
                        onValueChange={(e) => setCodeStuff(e)}
                        highlight={(code) => highlightSyntax(code)}
                        padding={10}
                        style={{
                            fontFamily: '"Arial", "Helvetica", sans-serif',
                            fontSize: 16,
                            minHeight: '100vh',
                            minWidth: '90vw',
                            border: '1px solid black',
                        }}
                    />
                </div>
                <div className="save-bar">
                    {fileName
                        && (
                            <button type="submit" className="btn btn-primary" onClick={submit}>Save</button>
                        )}
                    {dirButton && (
                        <button type="submit" className="btn btn-primary" onClick={saveAsSubmit}>Save As</button>
                    )}
                    {!dirButton && (
                        <button type="submit" className="btn btn-primary" onClick={saveSubmit}>Save As</button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default FileEditModal;

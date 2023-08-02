/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable react/state-in-constructor */
import React, { useEffect, useState } from 'react';
import FileBrowser, { FileRenderers, FolderRenderers } from 'react-keyed-file-browser';
import { readFile, readTextFile } from '../toolbarActions/toolbarFunctions';
import { actionType as T } from '../reducer';
import './fileBrowser.css';

const LocalFileBrowser = ({ superState, dispatcher }) => {
    const fileRef = React.useRef();
    const [dirButton, setDirButton] = useState(false);
    const [fileState, setFileState] = useState([]);

    useEffect(() => {
        if (navigator.userAgent.indexOf('Edg') !== -1 || navigator.userAgent.indexOf('Chrome') !== -1) {
            setDirButton(true);
        }
        dispatcher({ type: T.SET_FILE_REF, payload: fileRef });
    }, []);

    useEffect(() => {
        // TODO - Loading file list from localStorage. Not supported by browsers.
        // if(window.localStorage.getItem('fileList')) {
        //     const allFiles = window.localStorage.getItem('fileList');
        //     setFileState({ files: allFiles });
        // }
        window.localStorage.setItem('fileList', JSON.stringify(fileState));
    }, [fileState]);

    useEffect(() => {
        setFileState(superState.fileState);
    }, [superState.fileState]);

    const handleSelectFile = (data) => {
        const fileExtensions = ['jpeg', 'jpg', 'png', 'exe'];
        if (fileExtensions.includes(data.fileObj.name.split('.').pop())) {
            // eslint-disable-next-line no-alert
            alert('Wrong file extension');
            return;
        }

        if (data.fileObj.name.split('.').pop() === 'graphml') {
            let foundi = -1;
            superState.graphs.forEach((g, i) => {
                if ((g.fileName === data.fileObj.name)) {
                    foundi = i;
                }
            });
            if (foundi !== -1) {
                dispatcher({ type: T.CHANGE_TAB, payload: foundi });
            } else {
                readFile(superState, dispatcher, data.fileObj, data.fileHandle);
            }
        } else {
            readTextFile(superState, dispatcher, data.fileObj, data.fileHandle);
        }
    };

    const handleFileInDirs = async (topKey, value) => {
        let topLevel = topKey;
        let state = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const [key, valueSubDir] of value.entries()) {
            if (valueSubDir.kind === 'file') {
                const fileData = await valueSubDir.getFile();
                state = state.concat([{
                    key: `${topKey}/${value.name}/${key}`,
                    modified: fileData.lastModified,
                    size: fileData.size,
                    fileObj: fileData,
                    fileHandle: valueSubDir,
                }]);
            } else if (valueSubDir.kind === 'directory') {
                topLevel = `${topKey}/${value.name}`;
                const res = await handleFileInDirs(topLevel, valueSubDir);
                state = state.concat(res);
            }
        }
        return state;
    };

    const newFeature = async () => {
        const dirHandle = await window.showDirectoryPicker();
        let state = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const [key, value] of dirHandle.entries()) {
            if (value.kind === 'file') {
                const fileData = await value.getFile();
                state = state.concat([{
                    key: `${dirHandle.name}/${key}`,
                    modified: fileData.lastModified,
                    size: fileData.size,
                    fileObj: fileData,
                    fileHandle: value,
                }]);
            } else if (value.kind === 'directory') {
                const res = await handleFileInDirs(dirHandle.name, value);
                state = state.concat(res);
            }
        }
        setFileState([]);
        setFileState(state);
        dispatcher({ type: T.SET_DIR_NAME, payload: state[0].key.split('/')[0] });
        dispatcher({ type: T.SET_FILE_STATE, payload: state });
    };

    const newFeatureFile = async () => {
        const pickerOpts = {
            types: [
                {
                    description: 'Graphml',
                    accept: {
                        'text/graphml': ['.graphml'],
                    },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
        };

        const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
        const fileObj = await fileHandle.getFile();
        readFile(superState, dispatcher, fileObj, fileHandle);
    };

    return (
        <div>
            {!dirButton && (
                <label
                    className="inputButton"
                    htmlFor="fileButton"
                >
                    Upload Directory
                    <input
                        type="file"
                        accept=".py, .m, .c, .cpp, .v, .sh"
                        id="fileButton"
                        style={{ display: 'none' }}
                        onClick={(e) => { e.target.value = null; }}
                        onChange={(e) => {
                            setFileState([]);
                            setFileState((state) => {
                                for (let i = 0; i < e.target.files.length; i += 1) {
                                    state = state.concat([{
                                        key: e.target.files[i].webkitRelativePath,
                                        modified: e.target.files[i].lastModified,
                                        size: e.target.files[i].size,
                                        fileObj: e.target.files[i],
                                    }]);
                                }
                                return state;
                            });
                            window.localStorage.setItem('fileList', JSON.stringify(fileState));
                        }}
                        directory
                        webkitdirectory="true"
                    />
                </label>
            ) }
            {dirButton && (
                <button
                    type="button"
                    className="inputButton"
                    disabled={!dirButton}
                    onClick={newFeature}
                >
                    Upload Directory
                </button>
            )}
            {!dirButton
                && (
                    <input
                        type="file"
                        ref={fileRef}
                        onClick={(e) => { e.target.value = null; }}
                        style={{ display: 'none' }}
                        accept=".graphml"
                        onChange={(e) => readFile(superState, dispatcher, e.target.files[0])}
                    />
                )}
            {dirButton
                && (
                    <button
                        type="button"
                        ref={fileRef}
                        className="inputButton"
                        disabled={!dirButton}
                        style={{ display: 'none' }}
                        onClick={newFeatureFile}
                        label="File Upload"
                    />
                    // <input
                    //     type="file"
                    //     ref={fileRef}
                    //     onClick={(e) => { e.target.value = null; }}
                    //     style={{ display: 'none' }}
                    //     accept=".graphml"
                    //     onChange={(e) => readFile(superState, dispatcher, e.target.files[0])}
                    // />
                )}
            <h4>
                Folder Name :
                {' '}
                {fileState[0] ? fileState[0].key.split('/')[0] : '' }
            </h4>
            <FileBrowser
                files={fileState}
                onSelectFile={handleSelectFile}
                detailRenderer={() => null}
                fileRenderer={FileRenderers.TableFile}
                folderRenderer={FolderRenderers.TableFolder}
            />
        </div>
    );
};
export default LocalFileBrowser;

import React from 'react';
import ReactMarkdown from 'react-markdown';
import ParentModal from './ParentModal';
import { actionType as T } from '../../reducer';

const MarkDown = ({ superState, dispatcher }) => {
    const close = () => {
        dispatcher({ type: T.SET_MARKDOWN_MODAL, payload: false });
        dispatcher({ type: T.SET_INPUT_FILE, payload: { inputFile: '', fname: '' } });
    };
    return (
        <ParentModal closeModal={close} ModelOpen={superState.markDownModal} title={superState.inputFileName}>
            <ReactMarkdown>{superState.inputFile}</ReactMarkdown>
        </ParentModal>
    );
};

export default MarkDown;

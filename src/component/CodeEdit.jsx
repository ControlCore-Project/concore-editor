import React from 'react';
import './codeEdit.css';

const CodeEdit = ({
    pre, post, value, onChange, height, docString,
}) => {
    const inputRef = React.createRef();
    const parseMD = (s) => s.split('**').map((e, i) => {
        if (i % 2) return <span key={e}><b>{e}</b></span>;
        return <span key={e}>{e}</span>;
    });
    return (
        <div
            className="textField"
            onClick={() => inputRef.current.focus()}
            onKeyDown={() => inputRef.current.focus()}
            role="textbox"
            tabIndex={0}
        >
            {docString
                ? (
                    <div className="docStr">
                        {parseMD(docString)}
                    </div>
                ) : <div />}
            <br />
            {pre
                ? (
                    <textarea
                        className="preTextField"
                        value={pre}
                        readOnly
                        spellCheck="false"
                    />
                ) : <div />}
            <textarea
                className="mainTextField"
                spellCheck="false"
                {...{ value, onChange }}
                data-gramm_editor="false"
                style={{ height, width: '90vw' }}
                ref={inputRef}
            />
            {post
                ? (
                    <textarea
                        className="postTextField"
                        readOnly
                        value={post}
                        spellCheck="false"
                    />
                ) : <div />}
        </div>
    );
};

export default CodeEdit;

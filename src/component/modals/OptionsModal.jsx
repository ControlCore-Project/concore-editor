import React, { useState } from 'react';
import ParentModal from './ParentModal';
import { actionType as T } from '../../reducer';
import './optionsModal.css';

const OptionsModal = ({ superState, dispatcher }) => {
    const [unlock, setUnlock] = useState(false);
    const [docker, setDocker] = useState(false);
    const [octave, setOctave] = useState(false);
    const [param, setParam] = useState('');
    const [maxT, setmaxT] = useState('');
    const [library, setLibrary] = useState('');
    const close = () => {
        dispatcher({ type: T.SET_OPTIONS_MODAL, payload: false });
        dispatcher(
            {
                type: T.SET_OPTIONS,
                payload: {
                    unlock,
                    docker,
                    maxT,
                    param,
                    octave,
                    library,
                },
            },
        );
    };

    const handleDockerChange = () => {
        setDocker(!docker);
    };
    const handleOctaveChange = () => {
        setOctave(!octave);
    };
    const handleUnlockChange = () => {
        setUnlock(!unlock);
    };
    const handleParamsChange = (e) => {
        setParam(e.target.value);
    };
    const handleMaxtimeChange = (e) => {
        setmaxT(e.target.value);
    };
    const handleLibraryChange = (e) => {
        setLibrary(e.target.value);
    };

    const Options = 'Options';
    return (
        <ParentModal closeModal={close} ModelOpen={superState.optionsModal} title={Options}>
            <div className="main-div">
                <label htmlFor="Docker">
                    Docker
                    <input type="checkbox" checked={docker} onChange={handleDockerChange} />
                </label>
                <label htmlFor="Octave" className="main-div-comp">
                    Octave
                    <input type="checkbox" checked={octave} onChange={handleOctaveChange} />
                </label>
                <label htmlFor="Unlock" className="main-div-comp">
                    Unlock
                    <input type="checkbox" checked={unlock} onChange={handleUnlockChange} />
                </label>
                <label htmlFor="Maxtime" className="main-div-comp">
                    Max Time:&nbsp;
                    <input
                        type="text"
                        value={maxT}
                        placeholder="Enter Maximum Time"
                        onChange={(e) => {
                            handleMaxtimeChange(e);
                        }}
                    />
                </label>
                <br />
                <br />
                <span>Library Path:&nbsp;&nbsp;</span>
                <label htmlFor="librarypath">
                    <input
                        size="59"
                        type="text"
                        value={library}
                        placeholder="Enter library path"
                        onChange={(e) => {
                            handleLibraryChange(e);
                        }}
                    />
                </label>

                <br />
                <br />
                <span>Params:</span>
                <br />
                <textarea
                    cols="80"
                    rows="10"
                    value={param}
                    onChange={(e) => {
                        handleParamsChange(e);
                    }}
                />
            </div>
        </ParentModal>
    );
};

export default OptionsModal;

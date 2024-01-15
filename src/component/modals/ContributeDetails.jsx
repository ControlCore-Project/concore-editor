import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from './ParentModal';
import { actionType as T } from '../../reducer';
import './contributeDetails.css';

const ContributeDetails = ({ superState, dispatcher }) => {
    const closeModal = () => {
        dispatcher({ type: T.SET_CONTRIBUTE_MODAL, payload: false });
    };
    const [study, setStudy] = useState('');
    const [path, setPath] = useState('');
    const [auth, setAuth] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [branch, setBranch] = useState('');
    const [showAdvanceOptions, setShowAdvanceOptions] = useState(false);
    const submit = async (e) => {
        if (study === '' || path === '' || auth === '') {
            toast.info('Please Provide necessary inputs');
            return;
        }
        const id = toast.loading('Processing your Request.Please wait...');
        try {
            e.preventDefault();
            const result = await axios.post('http://127.0.0.1:5000/contribute', {
                study,
                auth,
                desc,
                title,
                path,
                branch,
            });
            toast.success(result.data?.message);
        } catch (error) {
            if (error?.response?.status === 400) {
                toast.info(error?.response?.data?.message);
            } else {
                toast.error(error?.response.data.message);
            }
        }
        toast.dismiss(id);
        closeModal();
    };
    const toggleOptions = () => {
        setShowAdvanceOptions(!showAdvanceOptions);
    };
    return (
        <Modal
            ModelOpen={superState.contributeModal}
            title="Contribute"
            closeModal={closeModal}
        >
            <form className="contribute-details">
                <span>Study Name</span>
                <input
                    required
                    value={study}
                    onChange={(e) => setStudy(e.target.value)}
                />
                <span>Study Path</span>
                <input
                    placeholder="Enter Full Directory Path of Study"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    required
                />
                <span>Author Name</span>
                <input
                    value={auth}
                    onChange={(e) => setAuth(e.target.value)}
                    required
                />
                {showAdvanceOptions && (
                    <>
                        <span>Branch Name</span>
                        <input
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                        />
                        <span>Title of Study</span>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <span>Description of Study</span>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </>
                )}
                <button type="button" className="btn btn-secondary" onClick={toggleOptions}>
                    {showAdvanceOptions ? 'Hide ' : 'Show '}
                    Advance Options
                </button>
                <div className="expand">
                    <button type="submit" className="btn btn-primary" onClick={submit}>Generate PR</button>
                </div>
            </form>
        </Modal>
    );
};
export default ContributeDetails;

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import hotkeys from 'hotkeys-js';
import { FaMoon } from 'react-icons/fa';
import toolbarList from '../toolbarActions/toolbarList';
import { actionType as T } from '../reducer';
import '@szhsin/react-menu/dist/index.css';
import './header.css';
import {
    ActionButton, Vsep, Hsep, Space, TextBox, Switcher, DropDown, FileUploader,
} from './HeaderComps';
import 'rc-switch/assets/index.css';
import FullScreenButton from './FullScreenButton';
// import ServerActions from './serverActions/ServerActions';

const setHotKeys = (actions) => {
    let keys = '';
    const map = {};
    actions.forEach((action, i) => {
        if (action.hotkey) {
            action.hotkey.split(',').forEach((key) => {
                [key, key.replace('Ctrl', 'Command')].forEach((k) => {
                    keys += `${k},`;
                    map[k] = document.getElementById(`action_${i + 1}`);
                });
            });
        }
    });
    keys = keys.substring(0, keys.length - 1);
    hotkeys(keys, (event, handler) => {
        event.preventDefault();
        map[handler.shortcut].click();
    });
    return keys;
};

const Header = ({ superState, dispatcher }) => {
    const actions = toolbarList(superState, dispatcher);
    React.useEffect(() => {
        const keys = setHotKeys(actions);
        return () => { if (keys) hotkeys.unbind(keys); };
    }, []);

    return (
        <header className="header">
            <div style={{ display: 'flex' }}>
                <section className="middle titlebar">
                    {
                        superState.curGraphInstance ? `${superState.curGraphInstance.projectName
                        } - concore Editor` : 'untitled'
                    }
                </section>
                <div
                    onClick={() => dispatcher({ type: T.TOGGLE_DARK_MODE })}
                    style={{
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        padding: '0 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'opacity 0.2s',
                        backgroundColor: '#eee',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && dispatcher({ type: T.TOGGLE_DARK_MODE })}
                    aria-label="Toggle dark mode"
                >
                    <FaMoon size={20} className="theme-icon" />
                </div>
                <FullScreenButton />
            </div>
            <section className="toolbar">
                {
                    actions.map(({
                        text, active, visibility, action, icon, type, hotkey,
                    }, i) => {
                        const props = {
                            text,
                            active,
                            visibility,
                            tabIndex: i + 1,
                            key: text,
                            action: (e) => action(superState, dispatcher, e),
                            Icon: icon,
                            hotkey,
                        };
                        switch (type) {
                        case 'vsep': return <Vsep key={`${`v${i}`}`} />;
                        case 'space': return <Space key={`${`s${i}`}`} />;
                        case 'switch': return <Switcher {...props} />;
                        case 'menu': return <DropDown {...props} />;
                        case 'file-upload': return <FileUploader {...props} superState={superState} />;
                        case 'action': return <ActionButton {...props} />;
                            // case 'serverActions': return <ServerActions superState={superState} />;
                        default: return <></>;
                        }
                    })
                }
            </section>
            <Hsep />
        </header>

    );
};

export {
    Header, ActionButton, Vsep, Hsep, Space, TextBox,
};

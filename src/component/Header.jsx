/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import hotkeys from 'hotkeys-js';
import toolbarList from '../toolbarActions/toolbarList';
import '@szhsin/react-menu/dist/index.css';
import './header.css';
import {
    ActionButton, Vsep, Hsep, Space, TextBox, Switcher, DropDown, FileUploader,
} from './HeaderComps';
import 'rc-switch/assets/index.css';
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
};

const Header = ({ superState, dispatcher }) => {
    const actions = toolbarList(superState, dispatcher);
    React.useEffect(() => {
        setHotKeys(actions, superState, dispatcher);
    }, []);

    return (
        <header className="header">
            <section className="middle titlebar">
                {
                    superState.curGraphInstance ? `${
                        superState.curGraphInstance.projectName
                    } - concore Editor` : 'untitled'
                }
            </section>
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

import React from 'react';
import Switch from 'rc-switch';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';

function DropDown({
    Icon, text, action, active, visibility, tabIndex, hotkey,
}) {
    return (
        <Menu menuButton={(
            <MenuButton>
                <ActionButton {...{
                    Icon, text, action, active, visibility, tabIndex, hotkey,
                }}
                />
            </MenuButton>
        )}
        >
            {action().map(({ fn, name }) => <MenuItem onClick={fn} key={name}>{name}</MenuItem>)}
        </Menu>
    );
}

const FileUploader = ({
    Icon, text, active, visibility, tabIndex, hotkey, superState,
}) => (
    <ActionButton {...{
        Icon, text, active, visibility, tabIndex, action: () => superState.fileRef.current.click(), hotkey,
    }}
    />
);

const Switcher = ({
    text, action, active, tabIndex,
}) => (
    <div
        role="button"
        tabIndex={tabIndex}
        className={`tool ${active ? 'active' : ''}`}
        onClick={action}
        onKeyDown={(ev) => ev.key === ' ' && action()}
    >
        <Switch
            onChange={action}
            checked={active}
            className="react-switch"
        />
        <div>
            {text}
        </div>
    </div>
);

const ActionButton = ({
    Icon, text, action, active, visibility, tabIndex, hotkey,
}) => (
    <div
        role="button"
        id={`action_${tabIndex}`}
        tabIndex={tabIndex}
        className={`tool ${active ? 'active' : ''}`}
        onClick={() => (active && action())}
        onKeyDown={(ev) => active && ev.key === ' ' && action()}
        data-tip={hotkey ? hotkey.split(',')[0] : ''}
        style={{ display: `${visibility ? '' : 'none'}` }}
    >
        <div className="icon"><Icon size="20" /></div>
        <div style={{ fontSize: 14 }}>{text}</div>
    </div>
);

const TextBox = ({ children }) => (
    <div className="tool" style={{ width: 'auto' }}>
        <div className="middle tool-text-only" style={{ fontSize: 16, color: '#888', height: '100%' }}>
            {children}
        </div>
    </div>
);

const Vsep = () => <div className="Vsep sep" />;
const Hsep = () => <div className="hsep sep" />;
const Space = () => <div className="space" />;

export {
    ActionButton, Vsep, Hsep, Space, TextBox, Switcher, DropDown, FileUploader,
};

import Slider from 'rc-slider';
import React from 'react';
import { BiReset, BiRectangle } from 'react-icons/bi';
import 'rc-slider/assets/index.css';
import './zoomSetter.css';
import GraphOption from '../config/cytoscape-options';
import { actionType as T } from '../reducer';

const { minZoom, maxZoom } = GraphOption;
const marks = {};

const ZoomComp = ({ superState, dispatcher }) => {
    const myGraph = superState.curGraphInstance;
    if (!myGraph) return <></>;
    const zoomValue = superState.zoomLevel;
    return (
        <div>
            <div className="zoom-comp">
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Reset zoom"
                    className="zoom-box zoom-btn"
                    onClick={() => myGraph.resetZoom()}
                    onKeyDown={(ev) => (ev.key === ' ' || ev.key === 'Enter') && myGraph.resetZoom()}
                >
                    <BiReset />

                </div>
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Fit to screen"
                    className="zoom-box zoom-btn"
                    onClick={() => myGraph.fitZoom()}
                    onKeyDown={(ev) => (ev.key === ' ' || ev.key === 'Enter') && myGraph.fitZoom()}
                >
                    <BiRectangle />

                </div>
                <div className="zoom-box zoom-value">
                    {zoomValue}
                    %
                </div>
                <div className="slider">
                    <Slider
                        min={100 * minZoom}
                        max={100 * maxZoom}
                        marks={marks}
                        onChange={
                            (value) => {
                                myGraph.setZoom(value);
                                dispatcher({ type: T.SET_ZOOM_LEVEL, payload: value });
                            }
                        }
                        included={false}
                        value={zoomValue}
                    />
                </div>
            </div>
        </div>
    );
};

export default ZoomComp;

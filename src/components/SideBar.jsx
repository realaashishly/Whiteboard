import React, { useState } from "react";
import LineIcon from "./LineIcon";
import { WIDTH } from "../constants";

const SideBar = ({
    classname,
    children,
    setFillColor,
    BackgroundColorTones,
    strokeColorTones,
    setStrokeColor,
    setStrokeValue,
    handleStrokeColorChange,
    handleStrokeWidthChange,
    handleFillColorChange,
}) => {
    const [selectedBGColor, setSelectedBGColor] = useState(null);
    const [selectedStrokeColor, setSelectedStrokeColor] = useState(null);
    const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(1);

    const handleStrokeWidthEvent = (width) => {
        setSelectedStrokeWidth(width);
        setStrokeValue(width);
        handleStrokeWidthChange(width);
    };

    const handleStrokeColorEvent = (color) => {
        setSelectedStrokeColor(color);
        setStrokeColor(color);
        handleStrokeColorChange(color);
    };

    const handleBackgroundColorTonesEvent = (color) => {
        setSelectedBGColor(color);
        setFillColor(color);
        handleFillColorChange(color);
    };

    return (
        <div className={classname}>
            <div className='pb-3'>
                <h4 className='pb-1'>Stroke</h4>
                <div className='flex gap-3'>
                    {strokeColorTones.map((color, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-sm outline-none`}
                            style={{
                                backgroundColor: color,
                                outline:
                                    selectedStrokeColor === color
                                        ? "1px solid white"
                                        : "none",
                            }}
                            onClick={() => handleStrokeColorEvent(color)}
                        ></div>
                    ))}
                </div>
            </div>

            <div className='pb-3'>
                <h4 className='pb-1'>Background</h4>
                <div className='flex gap-3'>
                    {BackgroundColorTones.map((color, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-sm outline-none`}
                            style={{
                                backgroundColor: color,
                                outline:
                                    selectedBGColor === color
                                        ? "1px solid white"
                                        : "none",
                            }}
                            onClick={() =>
                                handleBackgroundColorTonesEvent(color)
                            }
                        ></div>
                    ))}
                </div>
            </div>

            <div className='pb-3'>
                <h4 className='pb-1'>Strokewidth</h4>
                <div className='flex gap-3'>
                    <div
                        className={`${
                            selectedStrokeWidth === WIDTH.WIDTH_1
                                ? "bg-zinc-700 p-[3px] rounded-md"
                                : "bg-transparent"
                        }`}
                        onClick={() => handleStrokeWidthEvent(WIDTH.WIDTH_1)}
                    >
                        <LineIcon strokeWid={1} />
                    </div>
                    <div
                        className={`${
                            selectedStrokeWidth === WIDTH.WIDTH_2
                                ? "bg-zinc-700 p-[3px] rounded-md"
                                : "bg-transparent"
                        }`}
                        onClick={() => handleStrokeWidthEvent(WIDTH.WIDTH_2)}
                    >
                        <LineIcon strokeWid={2} />
                    </div>
                    <div
                        className={`${
                            selectedStrokeWidth === WIDTH.WIDTH_3
                                ? "bg-zinc-700 p-[3px] rounded-md"
                                : "bg-transparent"
                        }`}
                        onClick={() => handleStrokeWidthEvent(WIDTH.WIDTH_3)}
                    >
                        <LineIcon strokeWid={3} />
                    </div>
                    <div
                        className={`${
                            selectedStrokeWidth === WIDTH.WIDTH_5
                                ? "bg-zinc-700 p-[3px] rounded-md"
                                : "bg-transparent"
                        }`}
                        onClick={() => handleStrokeWidthEvent(WIDTH.WIDTH_5)}
                    >
                        <LineIcon strokeWid={5} />
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
};

export default SideBar;

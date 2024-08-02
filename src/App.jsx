import React, { useRef, useState, useEffect } from "react";
import {
    RiArrowRightLine,
    RiCursorFill,
    RiRectangleLine,
    RiCircleLine,
    RiPencilLine,
    RiDownload2Line,
    RiText,
    RiEraserLine,
} from "@remixicon/react";
import {
    Stage,
    Layer,
    Rect,
    Circle,
    Arrow,
    Line,
    Text,
    Transformer,
} from "react-konva";
import { ACTIONS } from "./constants";
import LineIcon from "./components/LineIcon";
import { v4 as uuid } from "uuid";
import SideBar from "./components/SideBar";

const App = () => {
    const stageRef = useRef(null);
    const inputRef = useRef(null);
    const textMeasureRef = useRef(null);
    const transformerRef = useRef(null);
    const [action, setAction] = useState(ACTIONS.SELECT);
    const [fillColor, setFillColor] = useState("#000000");
    const [strokeValue, setStrokeValue] = useState(1);
    const [selectedShape, setSelectedShape] = useState(null);

    const isDraggable = action === ACTIONS.SELECT;

    const [rectangles, setRectangles] = useState([]);
    const [circles, setCircles] = useState([]);
    const [arrows, setArrows] = useState([]);
    const [lines, setLines] = useState([]);
    const [scribbles, setScribbles] = useState([]);
    const [textValue, setTextValue] = useState("");
    const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [inputWidth, setInputWidth] = useState(100);
    const [texts, setTexts] = useState([]);
    const [erasers, setErasers] = useState([]);

    // const [bgColors, setBGColors] = useState("#000000d9");
    const [strokeColor, setStrokeColor] = useState("#000000");

    const BackgroundColorTones = ["#ffffff", "#6600ff", "#ff0000", "#a6ff00", "#ff00bf"];
    const strokeColorTones = ["#ffffff", "#6600ff", "#ff0000", "#a6ff00", "#ff00bf"];

 
    const isPainting = useRef(false);
    const currentShapeId = useRef(null);

    const onPointerDown = () => {
        if (action === ACTIONS.SELECT) return;

        const stage = stageRef.current;
        const { x, y } = stage.getPointerPosition();
        const id = uuid();

        currentShapeId.current = id;
        isPainting.current = true;

        if (action === ACTIONS.RECTANGLE) {
            setRectangles((rectangles) => [
                ...rectangles,
                {
                    id,
                    x,
                    y,
                    width: 1,
                    height: 1,
                    fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeValue,
                },
            ]);
        } else if (action === ACTIONS.CIRCLE) {
            setCircles((circles) => [
                ...circles,
                {
                    id,
                    x,
                    y,
                    radius: 1,
                    fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeValue,
                },
            ]);
        } else if (action === ACTIONS.ARROW) {
            setArrows((arrows) => [
                ...arrows,
                {
                    id,
                    x,
                    y,
                    points: [0, 0, 1, 1],
                    pointerLength: 10,
                    pointerWidth: 10,
                    fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeValue,
                },
            ]);
        } else if (action === ACTIONS.LINE) {
            setLines((lines) => [
                ...lines,
                {
                    id,
                    points: [x, y, x, y],
                    lineCap: "round",
                    lineJoin: "round",
                    fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeValue,
                },
            ]);
        } else if (action === ACTIONS.SCRIBBLE) {
            setScribbles((scribbles) => [
                ...scribbles,
                {
                    id,
                    points: [x, y],
                    lineCap: "round",
                    lineJoin: "round",
                    fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeValue,
                },
            ]);
        } else if (action === ACTIONS.TEXT) {
            setInputPosition({ x, y });
            setIsInputVisible(true);
            setTimeout(() => {
                inputRef.current.focus();
            }, 0);
        } else if (action === ACTIONS.ERASER) {
            setErasers((prevErasers) => [
                ...prevErasers,
                {
                    id,
                    points: [x, y],
                    lineCap: "round",
                    lineJoin: "round",
                    strokeWidth: strokeValue,
                    globalCompositeOperation: "destination-out",
                },
            ]);
        }
    };

    const onPointerMove = () => {
        if (action === ACTIONS.SELECT || !isPainting.current) return;

        const stage = stageRef.current;
        const { x, y } = stage.getPointerPosition();

        if (action === ACTIONS.RECTANGLE) {
            setRectangles((rectangles) =>
                rectangles.map((rect) => {
                    if (rect.id === currentShapeId.current) {
                        return {
                            ...rect,
                            width: x - rect.x,
                            height: y - rect.y,
                        };
                    }
                    return rect;
                })
            );
        } else if (action === ACTIONS.CIRCLE) {
            setCircles((circles) =>
                circles.map((circle) => {
                    if (circle.id === currentShapeId.current) {
                        return {
                            ...circle,
                            radius: Math.sqrt(
                                Math.pow(x - circle.x, 2) +
                                    Math.pow(y - circle.y, 2)
                            ),
                        };
                    }
                    return circle;
                })
            );
        } else if (action === ACTIONS.ARROW) {
            setArrows((arrows) =>
                arrows.map((arrow) => {
                    if (arrow.id === currentShapeId.current) {
                        return {
                            ...arrow,
                            points: [0, 0, x - arrow.x, y - arrow.y],
                        };
                    }
                    return arrow;
                })
            );
        } else if (action === ACTIONS.LINE) {
            setLines((lines) =>
                lines.map((line) => {
                    if (line.id === currentShapeId.current) {
                        return {
                            ...line,
                            points: [line.points[0], line.points[1], x, y],
                        };
                    }
                    return line;
                })
            );
        } else if (action === ACTIONS.SCRIBBLE) {
            setScribbles((scribbles) =>
                scribbles.map((scribble) => {
                    if (scribble.id === currentShapeId.current) {
                        return {
                            ...scribble,
                            points: [...scribble.points, x, y],
                        };
                    }
                    return scribble;
                })
            );
        } else if (action === ACTIONS.ERASER) {
            setErasers((erasers) =>
                erasers.map((eraser) => {
                    if (eraser.id === currentShapeId.current) {
                        return {
                            ...eraser,
                            points: [...eraser.points, x, y],
                        };
                    }
                    return eraser;
                })
            );
        }
    };

    const onPointerUp = () => {
        isPainting.current = false;
    };

    function eraseShapes(shape) {
        setRectangles((prevRectangles) =>
            prevRectangles.filter((rect) => rect.id !== shape.attrs.id)
          );
    }

    function onClick(e) {
        if (action !== ACTIONS.SELECT) return;
        const target = e.currentTarget;
        transformerRef.current.nodes([target]);
        setSelectedShape(target);
        if(action === ACTIONS.REMOVE){
            eraseShapes(target);
        }
    }

    const handleStrokeColorChange = (color) => {
        setStrokeColor(color);
        if (selectedShape) {
          selectedShape.stroke(color);
        }
      };
    
      const handleStrokeWidthChange = (width) => {
        setStrokeValue(width);
        if (selectedShape) {
          selectedShape.strokeWidth(width);
        }
      };
    
      const handleFillColorChange = (color) => {
        setFillColor(color);
        if (selectedShape) {
          selectedShape.fill(color);
        }
      };

    const handleTextChange = (e) => {
        setTextValue(e.target.value);
    };

    const handleTextSubmit = (e) => {
        if (e.key === "Enter") {
            setTexts((texts) => [
                ...texts,
                {
                    id: currentShapeId.current,
                    x: inputPosition.x,
                    y: inputPosition.y,
                    text: textValue,
                    fontSize: 20,
                    fontFamily: "Calibri",
                    fill: strokeColor,
                },
            ]);
            setTextValue("");
            setIsInputVisible(false);
        }
    };

    const exportToImage = () => {
        const uri = stageRef.current.toDataURL();
        const link = document.createElement("a");
        link.download = `${new Date().getTime()}.png`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShapeClick = (e, shapeType) => {
        if (action === ACTIONS.ERASER) {
            const id = e.target.id();
            switch (shapeType) {
                case 'rectangle':
                    setRectangles((rectangles) => rectangles.filter((rect) => rect.id !== id));
                    break;
                case 'circle':
                    setCircles((circles) => circles.filter((circle) => circle.id !== id));
                    break;
                case 'arrow':
                    setArrows((arrows) => arrows.filter((arrow) => arrow.id !== id));
                    break;
                case 'line':
                    setLines((lines) => lines.filter((line) => line.id !== id));
                    break;
                case 'scribble':
                    setScribbles((scribbles) => scribbles.filter((scribble) => scribble.id !== id));
                    break;
                case 'text':
                    setTexts((texts) => texts.filter((text) => text.id !== id));
                    break;
                default:
                    break;
            }
        }
    };


    

    useEffect(() => {
        if (textMeasureRef.current) {
            setInputWidth(textMeasureRef.current.offsetWidth + 30);
        }

    }, [textValue]);

    return (
        <div
            className={`relative w-full h-screen text-white bg-zinc-900 overflow-hidden`}
        >
            {/* CONTROLLERS */}
            <div className='absolute top-0 z-50 w-full py-2'>
                <div className='flex justify-center items-center gap-2 p-2 w-fit mx-auto bg-zinc-800 shadow-lg rounded-xl'>
                    <button
                        className={`${
                            action === ACTIONS.SELECT
                                ? "bg-violet-800"
                                : "bg-transparent"
                        } p-2 rounded-lg`}
                        onClick={() => setAction(ACTIONS.SELECT)}
                    >
                        <RiCursorFill size={16} className='controller' />
                    </button>

                    <button
                        className={`${
                            action === ACTIONS.RECTANGLE
                                ? "bg-violet-800"
                                : "bg-transparent"
                        } p-2 rounded-lg`}
                        onClick={() => setAction(ACTIONS.RECTANGLE)}
                    >
                        <RiRectangleLine size={16} className='controller' />
                    </button>

                    <button
                        className={`${
                            action === ACTIONS.CIRCLE
                                ? "bg-violet-800"
                                : "bg-transparent"
                        } p-2 rounded-lg`}
                        onClick={() => setAction(ACTIONS.CIRCLE)}
                    >
                        <RiCircleLine size={16} className='controller' />
                    </button>

                    <button
                        className={`${
                            action === ACTIONS.ARROW
                                ? "bg-violet-800"
                                : "bg-transparent"
                        } p-2 rounded-lg`}
                        onClick={() => setAction(ACTIONS.ARROW)}
                    >
                        <RiArrowRightLine size={16} className='controller' />
                    </button>

                    <button
                        className={`${
                            action === ACTIONS.LINE
                                ? "bg-violet-800"
                                : "bg-transparent"
                        } p-2 rounded-lg`}
                        onClick={() => setAction(ACTIONS.LINE)}
                    >
                        <LineIcon strokeWid={1.5}/>
                    </button>

                    <button
                        className={`${
                            action === ACTIONS.SCRIBBLE
                                ? "bg-violet-800"
                                : "bg-transparent"
                        } p-2 rounded-lg`}
                        onClick={() => setAction(ACTIONS.SCRIBBLE)}
                    >
                        <RiPencilLine size={16} className='controller' />
                    </button>

                    <button
                        className={`${
                            action === ACTIONS.TEXT
                                ? "bg-violet-800"
                                : "bg-transparent"
                        } p-2 rounded-lg`}
                        onClick={() => setAction(ACTIONS.TEXT)}
                    >
                        <RiText size={16} className='controller' />
                    </button>

                    <button
                        className={`${
                            action === ACTIONS.ERASER
                                ? "bg-violet-800"
                                : "bg-transparent"
                        } p-2 rounded-lg`}
                        onClick={() => setAction(ACTIONS.ERASER)}
                    >
                        <RiEraserLine size={16} className='controller' />
                    </button>

                    {/* <button>
                        <input
                            className='w-6 h-6 bg-transparent border-none outline-none appearance-none'
                            type='color'
                            value={fillColor}
                            onChange={(e) => setFillColor(e.target.value)}
                        />
                    </button> */}

                    <button className='p-2 rounded-lg' onClick={exportToImage}>
                        <RiDownload2Line size={16} className='controller' />
                    </button>
                </div>
            </div>

            {/* CANVAS */}
            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        height={window.innerHeight}
                        width={window.innerWidth}
                        id='bg'
                    />
                    {rectangles.map((rectangle) => (
                        <Rect
                            key={rectangle.id}
                            id={rectangle.id}
                            x={rectangle.x}
                            y={rectangle.y}
                            fill={rectangle.fillColor}
                            stroke={rectangle.stroke}
                            strokeWidth={rectangle.strokeWidth}
                            height={rectangle.height}
                            width={rectangle.width}
                            draggable={isDraggable}
                            onClick={onClick}
                        />
                    ))}
                    {circles.map((circle) => (
                        <Circle
                            key={circle.id}
                            id={circle.id}
                            radius={circle.radius}
                            x={circle.x}
                            y={circle.y}
                            fill={circle.fillColor}
                            stroke={circle.stroke}
                            strokeWidth={circle.strokeWidth}
                            draggable={isDraggable}
                            onClick={onClick}
                        />
                    ))}
                    {arrows.map((arrow) => (
                        <Arrow
                            key={arrow.id}
                            id={arrow.id}
                            x={arrow.x}
                            y={arrow.y}
                            points={arrow.points}
                            pointerLength={arrow.pointerLength}
                            pointerWidth={arrow.pointerWidth}
                            fill={arrow.fillColor}
                            stroke={arrow.stroke}
                            strokeWidth={arrow.strokeWidth}
                            draggable={isDraggable}
                            onClick={onClick}
                        />
                    ))}
                    {lines.map((line) => (
                        <Line
                            key={line.id}
                            id={line.id}
                            points={line.points}
                            lineCap={line.lineCap}
                            lineJoin={line.lineJoin}
                            stroke={line.stroke}
                            strokeWidth={line.strokeWidth}
                            draggable={isDraggable}
                            onClick={onClick}
                        />
                    ))}
                    {scribbles.map((scribble) => (
                        <Line
                            key={scribble.id}
                            id={scribble.id}
                            points={scribble.points}
                            lineCap={scribble.lineCap}
                            lineJoin={scribble.lineJoin}
                            stroke={scribble.stroke}
                            strokeWidth={scribble.strokeWidth}
                            draggable={isDraggable}
                            onClick={onClick}
                        />
                    ))}
                    {texts.map((text) => (
                        <Text
                            key={text.id}
                            id={text.id}
                            x={text.x}
                            y={text.y}
                            text={text.text}
                            fontSize={text.fontSize}
                            fontFamily={text.fontFamily}
                            fill={text.fill}
                            draggable={isDraggable}
                            onClick={onClick}
                        />
                    ))}

                    {erasers.map((eraser) => (
                        <Line
                            key={eraser.id}
                            id={eraser.id}
                            stroke='#ffffff'
                            fill='#ffffff'
                            lineCap={eraser.lineCap}
                            lineJoin={eraser.lineJoin}
                            points={eraser.points}
                            strokeWidth={eraser.strokeWidth}
                            globalCompositeOperation={
                                eraser.globalCompositeOperation
                            }
                        />
                    ))}

                    <Transformer ref={transformerRef} />
                </Layer>
            </Stage>

            <div
                ref={textMeasureRef}
                className='absolute invisible whitespace-pre'
                style={{
                    fontSize: "20px",
                    fontFamily: "Calibri",
                }}
            >
                {textValue}
            </div>

            {isInputVisible && (
                <input
                    ref={inputRef}
                    type='text'
                    value={textValue}
                    onChange={handleTextChange}
                    onKeyDown={handleTextSubmit}
                    className={`absolute text-xl rounded-lg border-none outline-none bg-transparent  p-2 overflow-hidden whitespace-nowrap `}
                    style={{
                        top: inputPosition.y,
                        left: inputPosition.x,
                        width: `${inputWidth}px`,
                        color: fillColor,
                    }}
                />
            )}

            <SideBar
                classname='w-44 p-6 bg-zinc-800 absolute top-1/2 left-3'
                setFillColor={setFillColor}
                setStrokeValue={setStrokeValue}
                BackgroundColorTones={BackgroundColorTones}
                strokeColorTones={strokeColorTones}
                setStrokeColor={setStrokeColor}
                handleStrokeColorChange={handleStrokeColorChange}
                handleStrokeWidthChange={handleStrokeWidthChange}
                handleFillColorChange={handleFillColorChange}
            >
            </SideBar>
        </div>
    );
};

export default App;

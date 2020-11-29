import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import './DrawingBoard.css';
import {SketchField, Tools} from 'react-sketch';
import {FaPaintBrush, FaEraser, FaSplotch, FaPalette} from 'react-icons/fa'
import {Button} from "antd";
import {ChromePicker} from "react-color";

const DrawingBoard = forwardRef((props, ref) => {

    const [selectedWidth, setSelectedWidth] = useState(3);
    const [selectedColor, setSelectedColor] = useState('black');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isEraser, setIsEraser] = useState(false);
    const [sketchField, setSketchField] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            getFinalImage() {
                if (isMouseDown) {
                    const evt = new MouseEvent("mouseup", {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    sketchField._canvas.dispatchEvent(evt);
                }
                return sketchField.toDataURL()
            },
            undo () {
                return sketchField.canUndo() && sketchField.undo()
            }
        }
    });

    useEffect(() => {
        if (sketchField) {
            const canvas = sketchField._fc
            if (canvas) {
                canvas.on('mouse:down', () => setIsMouseDown(true));
                canvas.on('mouse:up', () => setIsMouseDown(false));
            }
        }
    }, [sketchField])

    const brushWidths = [2,3,5,10,20,30];
    const renderBrushes = brushWidths.map(width => {
        const renderWidth = 2 * width;
        return (
            <div key={width} style={{width: renderWidth + 16, backgroundColor: width === selectedWidth ? '#40a9ff' : 'transparent'}} className={'DrawingBoard-brushButton'} onClick={() => setSelectedWidth(width)}>
                <div style={{width: renderWidth, height: renderWidth, backgroundColor: 'black', borderRadius: renderWidth}}/>
            </div>
        )
    });

    const colors = ['black', '#fad920', 'orange', 'red', '#f7dad8', 'lightblue', 'blue', 'lightgreen', 'green', '#6d411c', 'grey', 'white'];
    const onColorClicked = (color) => {
        setSelectedColor(color);
        setIsEraser(false);
    }
    const renderColors = colors.map(color => {
       return (
           <div key={color} style={{backgroundColor: color === selectedColor ? '#40a9ff' : 'transparent'}} className={'DrawingBoard-color'} onClick={() => onColorClicked(color)}>
               <FaSplotch color={color} size={'2rem'}/>
           </div>
       )
    });
    const onColorPickerClicked = () => {
        setShowColorPicker(!showColorPicker);
    }
    const renderColorPicker = (
        <div className={'DrawingBoard-color'} onClick={onColorPickerClicked}>
            <FaPalette color={'black'} size={'2rem'}/>
        </div>
    )

    return (
        <div className={'DrawingBoard'}>
            <div className={'DrawingBoard-canvas'}>
                <SketchField
                    ref={(sketchField) => setSketchField(sketchField)}
                    backgroundColor={'white'}
                    width={'100%'}
                    height={'100%'}
                    tool={Tools.Pencil}
                    lineColor={isEraser ? 'white' : selectedColor}
                    lineWidth={selectedWidth}
                />
            </div>
             <div className={'DrawingBoard-brushArea'}>
                 <div style={{display: 'flex', flexDirection: 'row'}}>
                     <Button type={'ghost'} style={{border: 'none', backgroundColor: isEraser ? '#40a9ff' : 'transparent'}} onClick={() => setIsEraser(true)} icon={<FaEraser />} />
                     <Button type={'ghost'} style={{border: 'none', backgroundColor: !isEraser ? '#40a9ff' : 'transparent'}} onClick={() => setIsEraser(false)} icon={<FaPaintBrush />} />
                 </div>
                 {renderBrushes}
             </div>
             <div className={'DrawingBoard-colorArea'}>
                 {renderColors}
                 {renderColorPicker}
             </div>
            {showColorPicker && (<div className={'DrawingBoard-colorPicker'}>
                <div className={'DrawingBoard-cover'} onClick={ () => setShowColorPicker(false) }/>
                <ChromePicker color={selectedColor} onChange={(color) => setSelectedColor(color.hex)}/>
            </div>)}
        </div>
    );
});

export default DrawingBoard;

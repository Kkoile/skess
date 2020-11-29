import React, {forwardRef, useImperativeHandle, useState} from 'react';
import './DrawingBoard.css';
import {SketchField, Tools} from 'react-sketch';
import {FaPaintBrush, FaEraser, FaSplotch} from 'react-icons/fa'
import {Button} from "antd";

const DrawingBoard = forwardRef((props, ref) => {

    const [selectedWidth, setSelectedWidth] = useState(3);
    const [selectedColor, setSelectedColor] = useState('black');
    const [isEraser, setIsEraser] = useState(false);
    const [sketchField, setSketchField] = useState(null);

    useImperativeHandle(ref, () => {
        return {
            getFinalImage() {
                return sketchField.toDataURL()
            },
            undo () {
                return sketchField.canUndo() && sketchField.undo()
            }
        }
    });

    const brushWidths = [2,3,5,10,20,30];
    const renderBrushes = brushWidths.map(width => {
        const renderWidth = 2 * width;
        return (
            <div key={width} style={{width: renderWidth + 16, backgroundColor: width === selectedWidth ? '#40a9ff' : 'transparent'}} className={'DrawingBoard-brushButton'} onClick={() => setSelectedWidth(width)}>
                <div style={{width: renderWidth, height: renderWidth, backgroundColor: 'black', borderRadius: renderWidth}}/>
            </div>
        )
    });

    const colors = ['black', '#fad920', 'orange', 'red', '#f7dad8', 'lightblue', 'blue', 'lightgreen', 'green', 'brown', 'grey', 'white'];
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
             </div>
        </div>
    );
});

export default DrawingBoard;

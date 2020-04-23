import React, {useState} from 'react';
import './DrawingBoard.css';
import {SketchField, Tools} from 'react-sketch';
import {FaPaintBrush, FaEraser, FaSplotch} from 'react-icons/fa'
import {Button} from "antd";

export default function DrawingBoard({onDrawBoardChanged}) {

    const [width, setWidth] = useState(3);
    const [color, setColor] = useState('black');
    const [isEraser, setIsEraser] = useState(false);
    const [sketchField, setSketchField] = useState(null);

    const brushWidths = [2,3,5,10,20,30];
    const renderBrushes = brushWidths.map(width => {
        const renderWidth = 2 * width;
        return (
            <div key={width} style={{width: renderWidth + 16}} className={'DrawingBoard-brushButton'} onClick={() => setWidth(width)}>
                <div style={{width: renderWidth, height: renderWidth, backgroundColor: 'black', borderRadius: renderWidth}}/>
            </div>
        )
    });

    const colors = ['black', 'yellow', 'orange', 'red', 'lightblue', 'blue', 'lightgreen', 'green', 'brown', 'grey', 'white'];
    const renderColors = colors.map(color => {
       return (
           <div key={color} className={'DrawingBoard-color'} onClick={() => setColor(color)}>
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
                    onChange={() => onDrawBoardChanged && onDrawBoardChanged(sketchField.toDataURL())}
                    lineColor={isEraser ? 'white' : color}
                    lineWidth={width}
                />
            </div>
             <div className={'DrawingBoard-brushArea'}>
                 <Button type={'ghost'} style={{border: 'none'}} onClick={() => setIsEraser(true)} icon={<FaEraser />} />
                 <Button type={'ghost'} style={{border: 'none'}} onClick={() => setIsEraser(false)} icon={<FaPaintBrush />} />
                 {renderBrushes}
             </div>
             <div className={'DrawingBoard-colorArea'}>
                 {renderColors}
             </div>
        </div>
    );
}

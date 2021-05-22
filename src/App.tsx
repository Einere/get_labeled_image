import React, {KeyboardEventHandler, useEffect, useRef, useState} from 'react';
import './App.css';

const image = new Image(300, 300);
image.src = '/IMG_1655.JPG';

function isHtmlCanvasElement(target: any): target is HTMLCanvasElement {
    return target instanceof HTMLCanvasElement;
}

function isCanvasRenderingContext2D(target: any): target is CanvasRenderingContext2D {
    return target instanceof CanvasRenderingContext2D;
}

function initCanvas(context: CanvasRenderingContext2D, image: HTMLImageElement) {
    context.drawImage(image, 0, 0, 500, 500);
}

function renderText(context: CanvasRenderingContext2D, text: string) {
    const textMatrix =  context.measureText(text);
    console.log(textMatrix);

    const left = (500 / 2) - Math.floor(textMatrix.width / 2);

    context.fillText(text, left, 250);
}


function App() {
    const htmlImageElement = useState<HTMLImageElement>(image);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [text, setText] = useState<string>('');

    useEffect(() => {
        image.addEventListener('load', function loaded() {
            const target = canvasRef.current;
            if (isHtmlCanvasElement(target)) {
                const ctx = target.getContext('2d');
                if (isCanvasRenderingContext2D(ctx)) {
                    ctx.font = '48px san-serif';
                    setContext(ctx);
                    initCanvas(ctx, image);
                }
            }
        })
    }, []);

    /*useEffect(() => {
        if (isCanvasRenderingContext2D(context)) {
            renderText(context, text);
        }

    }, [text]);*/

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (isCanvasRenderingContext2D(context) && e.key === "Backspace") {
            initCanvas(context, image);
            const target = e.target as HTMLInputElement;
            renderText(context, target.value);
        }
    }

    return (
        <div className="App">
            <canvas width={500} height={500} ref={canvasRef}/>

            <div>
                <input type="text" value={text} onChange={e => setText(e.target.value)}/>
                <button type="button" onClick={() => {
                    if (isCanvasRenderingContext2D(context)) {
                        renderText(context, text);
                    }
                }}>add name
                </button>
                <button type="button" onClick={() => {
                    if (isCanvasRenderingContext2D(context)) {
                        initCanvas(context, image);
                    }
                    setText('');
                }}>clear
                </button>
                <button type="button" onClick={() => {
                    const canvas= canvasRef.current;
                    if (isHtmlCanvasElement(canvas)) {
                        const imageUrl = canvas.toDataURL("image/png");
                        const a = document.createElement('a');
                        a.download = 'from_canvas.png';
                        a.href = imageUrl;
                        a.click();
                    }
                }}>save</button>
            </div>
        </div>
    );
}

export default App;

# Canvas whiteboard
Initialize a whiteboard with a canvas element's id.  
*You should define the same inner canvas width/height for connected whiteboards. Use the options or the canvas element attributes.*

## Usage
```html
<canvas id="canvas-1" width="1920" height="1080"></canvas>
```

```javascript
// Handle drawings
function bufferHandler(buffer, options) {
    console.log(buffer.length, options);
}

const whiteboard = new Whiteboard('canvas-1', bufferHandler, options);
```

To create a whiteboard without drawing enabled, define `bufferHandler` as `null`.

### Default options
```javascript
{
    strokeStyle: '#f00',
    fillStyle: 'solid',
    globalAlpha: 1,
    lineWidth: '10',
    lineCap: 'round',
    lineJoin: 'round',
    globalCompositeOperation: 'source-over',
    timeout: 20000,
    width: null,
    height: null,
    offsetX: 0,
    offsetY: 0
}
```

## API
### new Whiteboard(canvasId, bufferHandler, options)
Returns a new whiteboard object. Invokes `.init()` and optionally `.bindMouseHandlers()`.
  * canvasId (string) id of canvas element in the DOM
  * bufferHandler (function) define a buffer handler to enable mouse drawings
  * options (object) define default option values for the whiteboard instance

#### .bufferHandler(buffer, options)
  * buffer (array) filled with arrays of x,y coordinates relative to the inner canvas `[[0,0],[20,10],[40,20]...]`
  * options (object) some options of the source whiteboard
    ```javascript
    {
        strokeStyle (string)
        fillStyle (string)
        globalAlpha (float)
        lineWidth (string)
        lineCap (string)
        lineJoin (string)
        globalCompositeOperation (string)
        timeout (int)
        width (int)
        height (int)
    }
    ```

#### .draw(buffer, options)
Draw the buffer to the whiteboard.
  * buffer (array) arrays of x,y coordinates relative to the inner canvas `[[0,0],[20,10],[40,20]...]`
  * options (object) options to override when drawing the buffer to the whiteboard
    ```javascript
    {
        strokeStyle (string)
        fillStyle (string)
        globalAlpha (float)
        lineWidth (string)
        lineCap (string)
        lineJoin (string)
        globalCompositeOperation (string)
        timeout (int)
        offsetX (int)
        offsetY (int)
    }
    ```

#### .clean()
Clean the whiteboard.

#### .bindMouseHandlers()
Set mouse event handlers to the canvas. *(onmousedown, onmousemove, onmouseup, onmouseout)*

#### .unbindMouseHandlers()
Remove mouse event handlers from the canvas.

## Network transport test
You need crossbar installed. (crossbar.io)

Initialize crossbar service with the default template from the root folder and start the router.
```bash
cd canvas-whiteboard
crossbar init
crossbar start
```
Open instances of crossbar.html in multiple browsers.

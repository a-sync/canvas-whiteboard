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
  * `strokeStyle: '#f00'` // [canvas context property](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle)
  * `globalAlpha: 1` // [canvas context property](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha)
  * `lineWidth: 10` // [canvas context property](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth)
  * `lineCap: 'round'` // [canvas context property](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap)
  * `lineJoin: 'round'` // [canvas context property](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin)
  * `globalCompositeOperation: 'source-over'` // [canvas context property](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)
  * `timeout: 20000` // time delay in ms for clearing the whiteboard
  * `width: null` // [canvas property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/width)
  * `height: null` // [canvas property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/height)
  * `offsetX: 0` // horizontal drawing offset in pixels
  * `offsetY: 0` // vertical drawing offset in pixels

## API
### new Whiteboard(canvasId, bufferHandler, options)
Returns a new whiteboard object. Invokes `.init()` and optionally `.bindMouseHandlers()`.
  * `canvasId` (string) id of canvas element in the DOM
  * `bufferHandler` (function) optional handler function to enable and capture drawings
  * `options` (object) available options for the new whiteboard instance
    ```javascript
    {
        strokeStyle
        globalAlpha
        lineWidth
        lineCap
        lineJoin
        globalCompositeOperation
        timeout
        width
        height
        offsetX
        offsetY
    }
    ```

#### .bufferHandler(buffer, options)
  * `buffer` (array) filled with arrays of x,y coordinates relative to the inner canvas `[[0,0],[20,10],[40,20]...]`
  * `options` (object) some options of the source whiteboard
    ```javascript
    {
        strokeStyle
        globalAlpha
        lineWidth
        lineCap
        lineJoin
        globalCompositeOperation
        timeout
        width
        height
    }
    ```

#### .draw(buffer, options)
Draw the buffer to the whiteboard.
  * `buffer` (array) arrays of x,y coordinates relative to the inner canvas `[[0,0],[20,10],[40,20]...]`
  * `options` (object) available options to override when drawing the buffer to the whiteboard
    ```javascript
    {
        strokeStyle
        globalAlpha
        lineWidth
        lineCap
        lineJoin
        globalCompositeOperation
        timeout
        offsetX
        offsetY
    }
    ```

#### .clean()
Clean the whiteboard.

#### .bindMouseHandlers()
Set mouse event handlers to the canvas. *(onmousedown, onmousemove, onmouseup, onmouseout)*

#### .unbindMouseHandlers()
Remove mouse event handlers from the canvas.

#### .bindTouchHandlers()
Set touch event handlers to the canvas. *(touchstart, touchmove, touchend, touchcancel)*

#### .unbindTouchHandlers()
Remove touch event handlers from the canvas.

## Network transport test
You need [crossbar](https://crossbar.io/docs/Installation/) installed.

Initialize crossbar service with the default template from the root folder and start the router.
```bash
cd canvas-whiteboard
crossbar init
crossbar start
```
Open instances of crossbar.html in multiple browsers.

## TODO
 * filter out middle points from buffer before sending it to handler
 * v2: only send starting coordinate + deltas of next positions
 * v2: buffer all drawings separately with unique timeouts

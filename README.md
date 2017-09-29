# Canvas whiteboard

## Usage
Initialize a whiteboard object with a canvas element's id.  
You must set a buffer handler to enable drawing.  
You can define the default option values for the object.
```html
<canvas id="mywb" width="1920" height="1080"></canvas>
```
```javascript
// Handle drawings
const bufferHandler = function(buffer, options) {
    console.log(buffer.length, options);
}

const whiteboard = new Whiteboard('mywb', bufferHandler, options);
```

To create a whiteboard without drawing enabled, define `bufferHandler` as `null`.

**You should define the same canvas width/height for connected whiteboards.**  
Use the options or the canvas element attributes.

### Default options
```javascript
{
    strokeStyle: '#f00',
    lineWidth: '10',
    fillStyle: 'solid',
    lineCap: 'round',
    lineJoin: 'round',
    timeout: 20000,
    drawOffsetX: 0,
    drawOffsetY: 0,
    width: null,
    height: null
}
```

## API
### Whiteboard(canvasId, bufferHandler, options)
  * canvasId (string) id of canvas element
  * bufferHandler (function) optional function to enable and capture drawings
  * options (object)

#### .draw(buffer, options)
Draw the buffer to the canvas. Available options will overwrite the default values.
  * buffer (array)
  * options (object)

#### .clean()
Cleans the current canvas.

#### .bindMouseHandlers()
Set mouse event handlers to the canvas. (onmousedown, onmousemove, onmouseup, onmouseout)

#### .unbindMouseHandlers()
Remove mouse event handlers from the canvas.

## Crossbar test
You need crossbar installed. (crossbar.io)

Initialize crossbar service with the default template from the root folder and start the router.
```bash
cd canvas-whiteboard
crossbar init
crossbar start
```
Open instances of crossbar.html in multiple browsers.

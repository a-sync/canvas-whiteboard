# Canvas whiteboard

# Usage
You must set a buffer handler to enable mouse input.
```javascript
// Handle mouse drawings
const bufferHandler = function(buffer, options) {
    console.log(buffer.length, options);
}

const whiteboard = new Whiteboard('canvasId', bufferHandler, options);
```

To create a whiteboard without drawing function, define bufferHandler as **null**.

When creating a new whiteboard, the canvas size is set to the rendered element's size.
If they differ when a new drawing is started the whiteboard is reset.

If the canvas size is different from the size options when using the .draw() method, 
the canvas is reset to the dimensions defined in the options.

# Default Options
```javascript
{
    strokeStyle: '#f00',
    lineWidth: '10',
    fillStyle: 'solid',
    lineCap: 'round',
    lineJoin: 'round',
    timeout: 10000,
    drawOffsetX: 0,
    drawOffsetY: 0
}
```

# API
### .draw(buffer, options)
Draw the buffer to the canvas with the given options.

### .clean()
Cleans the current canvas.

### .reset()
Reset the object's options and the size of the canvas to the element's size.

### .bindMouseHandlers()
Set mouse event handlers to the canvas. (onmousedown, onmousemove, onmouseup, onmouseout)

### .unbindMouseHandlers()
Remove mouse event handlers from the canvas.

# Crossbar test
You need crossbar installed. (crossbar.io)

Init crossbar default config and start the router.
```bash
# /canvas-whiteboard
crossbar init
crossbar start
```
Open instances of crossbar.html in multiple browsers.

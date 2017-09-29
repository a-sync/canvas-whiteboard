'use strict';

/** Canvas whiteboard object constructor
  * 
  * canvasId (string) id of canvas element
  * bufferHandler (function) optional function to enable and capture drawings
  * options (object)
  * 
*/
function Whiteboard(canvasId, bufferHandler, options) {
    this.canvas = document.getElementById(canvasId);
    this.bufferHandler = bufferHandler || null;
    this.options = Object.assign({
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
        },
        options
    );

    this.canvasCtx = null;
    this.cleanTimer = null;
    this.drawBuffer = [];

    this.init();
};

Whiteboard.prototype.init = function() {
    if (this.canvas || this.canvas.nodeName === 'CANVAS') {
        this.canvasCtx = this.canvas.getContext('2d');

        if (this.options.width && this.options.width != this.canvas.width) {
            this.canvas.width = this.options.width;
        }

        if (this.options.height && this.options.height != this.canvas.height) {
            this.canvas.height = this.options.height;
        }

        this.setCanvasOptions(this.options);

        if (console.log) {
            console.log('New canvas whiteboard.', this.canvas.id, this.options);
        }

        if (typeof this.bufferHandler === 'function') {
            this.bindMouseHandlers();
        } else {
            this.bufferHandler = null;
        }
    } else {
       throw new Error('Invalid canvas element id.');
    }
};

Whiteboard.prototype.draw = function(buffer, drawOptions) {
    const options = Object.assign({}, this.options, drawOptions);

    this.setCanvasOptions(options);

    const offX = options.drawOffsetX ? parseInt(options.drawOffsetX, 10) : 0;
    const offY = options.drawOffsetY ? parseInt(options.drawOffsetY, 10) : 0;

    let started = false;
    this.canvasCtx.beginPath();
    for (const pos of buffer) {
        if (started) {
            this.canvasCtx.lineTo(pos[0]+offX, pos[1]+offY);
            this.canvasCtx.stroke();
        } else {
            started = true;
            this.canvasCtx.moveTo(pos[0]+offX, pos[1]+offY);
        }
    }
    this.canvasCtx.closePath();

    if(this.cleanTimer) clearTimeout(this.cleanTimer);
    if (options.timeout) {
        const that = this;
        this.cleanTimer = setTimeout(function(){that.clean()}, options.timeout);
    }
};

Whiteboard.prototype.clean = function() {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.cleanTimer) clearTimeout(this.cleanTimer);
    this.cleanTimer = null;
};

Whiteboard.prototype.bindMouseHandlers = function() {
    const that = this;
    this.canvas.onmousedown = function(e) {
        e.preventDefault();
        this.isPointerDown = true;
        that.drawBuffer.length = 0;

        const pos = that.getCursorPosition(e);

        that.setCanvasOptions(that.options);

        that.canvasCtx.beginPath();
        that.canvasCtx.moveTo(pos[0], pos[1]);
        that.drawBuffer.push(pos);
    };

    this.canvas.onmousemove = function(e) {
        e.preventDefault();
        if(this.isPointerDown === true) {
            const pos = that.getCursorPosition(e);

            that.setCanvasOptions(that.options);

            that.canvasCtx.lineTo(pos[0], pos[1]);
            that.canvasCtx.stroke();
            that.drawBuffer.push(pos);
        }
    };

    this.canvas.onmouseup = function(e){
        e.preventDefault();
        if (this.isPointerDown === true) {
            this.isPointerDown = false;

            if (that.drawBuffer.length <= 1) return;

            that.canvasCtx.closePath();

            if (that.bufferHandler) {
                that.bufferHandler(that.drawBuffer, {
                    width: this.width,
                    height: this.height,
                    strokeStyle: that.options.strokeStyle,
                    lineWidth: that.options.lineWidth,
                    timeout: that.options.timeout
                });
            }

            that.drawBuffer.length = 0;

            if (that.cleanTimer) clearTimeout(that.cleanTimer);
            if (that.options.timeout) that.cleanTimer = setTimeout(function() {that.clean()}, that.options.timeout);
        }
    };

    this.canvas.onmouseout = this.canvas.onmouseup;
};

Whiteboard.prototype.unbindMouseHandlers = function() {
    this.drawBuffer.length = 0;
    this.canvas.isPointerDown = false;

    this.canvas.onmousedown = null;
    this.canvas.onmousemove = null;
    this.canvas.onmouseup = null;
    this.canvas.onmouseout = null;
};

Whiteboard.prototype.getCursorPosition = function(mouseEvent) {
    const styling = getComputedStyle(this.canvas, null);

    const topBorder = parseInt(styling.getPropertyValue('border-top-width'), 10);
    const rightBorder = parseInt(styling.getPropertyValue('border-right-width'), 10);
    const bottomBorder = parseInt(styling.getPropertyValue('border-bottom-width'), 10);
    const leftBorder = parseInt(styling.getPropertyValue('border-left-width'), 10);

    const rect = this.canvas.getBoundingClientRect();

    //const topOff = window.pageYOffset || document.documentElement.scrollTop;
    //const leftOff = window.pageXOffset || document.documentElement.scrollLeft;
    //console.log('x:'+mouseEvent.pageX+' y:'+mouseEvent.pageY, 'leftOff:'+leftOff+' topOff:'+topOff+' offsetLeft:'+this.offsetLeft+' offsetTop:'+this.offsetTop, rect);
    //const canvasX = (mouseEvent.pageX - rect.left - leftOff) * (this.canvas.width / rect.width);
    //const canvasY = (mouseEvent.pageY - rect.top - topOff) * (this.canvas.height / rect.height);

    const canvasX = (mouseEvent.clientX - rect.left - leftBorder) * (this.canvas.width / (rect.width - rightBorder - leftBorder));
    const canvasY = (mouseEvent.clientY - rect.top - topBorder) * (this.canvas.height / (rect.height - topBorder - bottomBorder));

    return [canvasX, canvasY];
};

Whiteboard.prototype.setCanvasOptions = function(options) {
    this.canvasCtx.strokeStyle = options.strokeStyle;
    this.canvasCtx.lineWidth = options.lineWidth;
    this.canvasCtx.fillStyle = options.fillStyle;
    this.canvasCtx.lineCap = options.lineCap;
    this.canvasCtx.lineJoin = options.lineJoin;
};

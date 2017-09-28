/** Canvas whiteboard object constructor
  * 
  * canvasId (string) id canvas element
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
            timeout: 10000,
            drawOffsetX: 0,
            drawOffsetY: 0
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
        console.log('New canvas whiteboard.', this.reset());

        if (typeof this.bufferHandler === 'function') {
            console.info('Binding draw event handlers.');

            this.bindDrawHandlers();
        } else {
            console.info('No buffer handler. Draw input disabled.');
            this.bufferHandler = null;
        }
    } else {
       throw new Error('Invalid canvas element id.');
    }
};

Whiteboard.prototype.clean = function() {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.cleanTimer) clearTimeout(this.cleanTimer);
    this.cleanTimer = null;
}

Whiteboard.prototype.reset = function(width, height) {
    this.clean();

    var rect = getBorderlessBoundingClientRect(this.canvas);
    this.canvas.width = width || Math.floor(rect.width);
    this.canvas.height = height || Math.floor(rect.height);

    this.canvasCtx.strokeStyle = this.options.strokeStyle;
    this.canvasCtx.lineWidth = this.options.lineWidth;
    this.canvasCtx.fillStyle = this.options.fillStyle;
    this.canvasCtx.lineCap = this.options.lineCap;
    this.canvasCtx.lineJoin = this.options.lineJoin;

    return rect;
}

Whiteboard.prototype.bindDrawHandlers = function() {
    var that = this;
    this.canvas.onmousedown = function(e) {
            this.isPointerDown = true;
            that.drawBuffer.length = 0;

            var canvasRect = getBorderlessBoundingClientRect(this);

            if(Math.floor(canvasRect.width) !== Math.floor(this.width) || Math.floor(canvasRect.height) !== Math.floor(this.height)) {
                canvasRect = that.reset();
            }

            //var topOff  = window.pageYOffset || document.documentElement.scrollTop,
            //    leftOff = window.pageXOffset || document.documentElement.scrollLeft;
            //console.log('x:'+e.pageX+' y:'+e.pageY, 'leftOff:'+leftOff+' topOff:'+topOff+' offsetLeft:'+this.offsetLeft+' offsetTop:'+this.offsetTop, canvasRect);
            //var canvasX = (e.pageX - canvasRect.left - leftOff);
            //var canvasY = (e.pageY - canvasRect.top - topOff);
            var canvasX = (e.clientX - canvasRect.left);
            var canvasY = (e.clientY - canvasRect.top);

            that.canvasCtx.strokeStyle = that.options.strokeStyle;
            that.canvasCtx.lineWidth = that.options.lineWidth;
            that.canvasCtx.fillStyle = that.options.fillStyle;
            that.canvasCtx.lineCap = that.options.lineCap;
            that.canvasCtx.lineJoin = that.options.lineJoin;

            that.canvasCtx.beginPath();
            that.canvasCtx.moveTo(canvasX, canvasY);
            that.drawBuffer.push([canvasX, canvasY]);
    };

    this.canvas.onmousemove = function(e) {
        if(this.isPointerDown === true) {
            // TODO: only add line, if length from prev. pixel bigger then line width/2
            // TODO: filter out duplicate buffer entries

            var canvasRect = getBorderlessBoundingClientRect(this);

            //var topOff  = window.pageYOffset || document.documentElement.scrollTop,
            //    leftOff = window.pageXOffset || document.documentElement.scrollLeft;
            //console.log('x:'+e.pageX+' y:'+e.pageY, 'leftOff:'+leftOff+' topOff:'+topOff+' offsetLeft:'+this.offsetLeft+' offsetTop:'+this.offsetTop, canvasRect);
            //var canvasX = (e.pageX - canvasRect.left - leftOff);
            //var canvasY = (e.pageY - canvasRect.top - topOff);
            var canvasX = (e.clientX - canvasRect.left);
            var canvasY = (e.clientY - canvasRect.top);

            that.canvasCtx.lineTo(canvasX, canvasY);
            that.canvasCtx.stroke();
            that.drawBuffer.push([canvasX, canvasY]);
        }
    };

    this.canvas.onmouseup = function(e){
        if (this.isPointerDown === true) {
            this.isPointerDown = false;

            if (that.drawBuffer.length <= 2) return;

            that.canvasCtx.closePath();

            if (that.bufferHandler) {
                that.bufferHandler(that.drawBuffer, {
                    width: this.width,
                    height: this.height,
                    strokeStyle: that.options.strokeStyle,
                    lineWidth: that.options.lineWidth,
                    //fillStyle: that.options.fillStyle,
                    //lineCap: that.options.lineCap,
                    //lineJoin: that.options.lineJoin,
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

Whiteboard.prototype.draw = function(buffer, drawOptions) {
    var options = Object.assign({}, this.options, drawOptions);

    if (options.width !== this.canvas.width || options.height !== this.canvas.height) {
        this.reset(options.width, options.height);
    }

    this.canvasCtx.strokeStyle = options.strokeStyle;
    this.canvasCtx.lineWidth = options.lineWidth;
    this.canvasCtx.fillStyle = options.fillStyle;
    this.canvasCtx.lineCap = options.lineCap;
    this.canvasCtx.lineJoin = options.lineJoin;

    this.canvasCtx.beginPath();
    for (var i in buffer) {
        if (i === 0) this.canvasCtx.moveTo(buffer[i][0]+parseInt(options.drawOffsetX), buffer[i][1]+parseInt(options.drawOffsetY));
        else {
            this.canvasCtx.lineTo(buffer[i][0]+parseInt(options.drawOffsetX), buffer[i][1]+parseInt(options.drawOffsetY));
            this.canvasCtx.stroke();
        }
    }
    this.canvasCtx.closePath();

    if(this.cleanTimer) clearTimeout(this.cleanTimer);
    if (options.timeout) {
        var that = this;
        this.cleanTimer = setTimeout(function(){that.clean()}, options.timeout);
    }
}

function getBorderlessBoundingClientRect(elem) {
    var styling = getComputedStyle(elem, null);

    var topBorder = parseInt(styling.getPropertyValue('border-top-width'), 10);
    var rightBorder = parseInt(styling.getPropertyValue('border-right-width'), 10);
    var bottomBorder = parseInt(styling.getPropertyValue('border-bottom-width'), 10);
    var leftBorder = parseInt(styling.getPropertyValue('border-left-width'), 10);

    this.borderX = rightBorder + leftBorder;
    this.borderY = topBorder + bottomBorder;

    var rect = elem.getBoundingClientRect();

    rect.width -= rightBorder + leftBorder;
    rect.height -= topBorder + bottomBorder;

    rect.top += topBorder;
    rect.right -= rightBorder;
    rect.bottom -= bottomBorder;
    rect.left -= leftBorder;

    rect.x += leftBorder;
    rect.y += topBorder;

    return rect;
}

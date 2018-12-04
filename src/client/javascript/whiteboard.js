let isActive = false;
let plots = [];

const WhiteBoard = {
  /* Draw on canvas */
  drawOnCanvas: (color, lineStyle, plots) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineStyle;
    ctx.beginPath();
    ctx.moveTo(plots[0].x, plots[0].y);

    for(var i=1; i<plots.length; i++) {
      ctx.lineTo(plots[i].x, plots[i].y);
    }
    ctx.stroke();
  },

  drawFromStream: (message) => {
    if(!message || message.plots.length < 1) return;
    WhiteBoard.drawOnCanvas(message.color, message.plots);
  },

	draw: (e) => {
		e.preventDefault(); // prevent continuous touch event process e.g. scrolling!
	  	if(!isActive) return;

    	var x = isTouchSupported ? (e.targetTouches[0].pageX - canvas.offsetLeft) : (e.offsetX || e.layerX - canvas.offsetLeft);
    	var y = isTouchSupported ? (e.targetTouches[0].pageY - canvas.offsetTop) : (e.offsetY || e.layerY - canvas.offsetTop);

    	plots.push({x: (x << 0), y: (y << 0)}); // round numbers for touch screens

    	WhiteBoard.drawOnCanvas(color, lineStyle, plots);
	},
	
	startDraw: (e) => {
	  	e.preventDefault();
	  	isActive = true;
	},
	
	endDraw: (e) => {
	  	e.preventDefault();
	  	isActive = false;

      Client.socket.emit('app', JSON.stringify( {newEvent: {type: "draw", data: {color: color, lineStyle: lineStyle, plots: plots}}} ));
      
	  	plots = [];
	},
};

Object.freeze(WhiteBoard);

// *********************Events and Setup below *******************************
const Client = {};

Client.socket = io.connect({
  autoConnect: false, 
  transports: ['websocket'],
});

Client.socket.on('app', (data) => {
  const objData = JSON.parse(data);
  if (objData.newEvent.type === 'draw') {
    const {color, lineStyle, plots} = objData.newEvent.data;
    console.log(`Whiteboard Color: ${color}`)
    WhiteBoard.drawOnCanvas(color, lineStyle, plots);
  }
});

// Need to determine how best to implement this function
// that is automatically executed.

	/* set up Canvas */
	const canvas = document.getElementById('drawCanvas');
	const ctx = canvas.getContext('2d');
	let color = document.querySelector('#colorSwatch :checked').getAttribute('data-color');
	let lineStyle = document.querySelector('#lineStyle :checked').getAttribute('data-type');
	canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
	canvas.height = Math.min(document.documentElement.clientHeight, window.innerHeight || 300);
	 
	ctx.strokeStyle = color;
	ctx.lineWidth = lineStyle;
	ctx.lineCap = ctx.lineJoin = 'round';

	/* Mouse and touch events */
	document.getElementById('colorSwatch').addEventListener('click', function() {
    color = document.querySelector('#colorSwatch :checked').getAttribute('data-color');
	}, false);

	document.getElementById('lineStyle').addEventListener('click', function() {
    lineStyle = document.querySelector('#lineStyle :checked').getAttribute('data-type');
	}, false);
	
	const isTouchSupported = 'ontouchstart' in window;
	const isPointerSupported = navigator.pointerEnabled;
	const isMSPointerSupported =  navigator.msPointerEnabled;
	
	const downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
	const moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
	const upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));
	 	  
	canvas.addEventListener(downEvent, WhiteBoard.startDraw, false);
	canvas.addEventListener(moveEvent, WhiteBoard.draw, false);
	canvas.addEventListener(upEvent, WhiteBoard.endDraw, false);

// **************Events and setup above **********************************


var mouse_down = false;
var mouse_left = false;
var last_cursor_x = 0;
var last_cursor_y = 0;

function onMouseWheel(evt)
{
	evt.preventDefault();
	var delta = 0;
	if(evt.detail){ //support for Firefox
		delta = -evt.detail/3;
	} else if(evt.wheelDelta){ //support for chrome,safari and opera
		delta = evt.wheelDelta/120;
	}
}

function getMousePos(evt)
{
	// returns mouse position relative to the Canvas
	rect = canvas.getBoundingClientRect();
	var x = evt.clientX - rect.left;
	var y = evt.clientY - rect.top;
	y = canvas.height - y; //invert the value of y
	
	return {x:x,y:y};
}

function onMouseClick(evt)
{
	var cursor_pos = getMousePos(evt);
	
	last_cursor_x = cursor_pos.x;
	last_cursor_y = cursor_pos.y;
	mouse_down = true;
	
	if(evt.button == 0){
		mouse_left = true;
	}
}

function onMouseRelease(evt)
{
     mouse_down = false;
}

function onMouseMove(evt)
{
	//if(!in_game)
	//else
	if(!mouse_down)
		return;
	
	if(mouse_left)
	{
		var cursor_pos = getMousePos(evt);
		
		var dx = (last_cursor_x - cursor_pos.x);
		var dy = (last_cursor_y - cursor_pos.y);
		
		//TODO move camera
		var rot_angle;
		
		rot_angle = dx*(180.0/canvas.width);
		renderHub.camera.rotate((rot_angle*3.14)/180.0,[0.0,1.0,0.0]);
		
		rot_angle = -dy*(90.0/canvas.height);
		renderHub.camera.rotate((rot_angle*3.14)/180.0,renderHub.camera.getRightVector());
		
		last_cursor_x = cursor_pos.x;
		last_cursor_y = cursor_pos.y;
	}
}

function registerEvents(){
	
	canvas.addEventListener('mousedown',onMouseClick,false);
	canvas.addEventListener('mouseup',onMouseRelease,false);
	canvas.addEventListener('mousemove',onMouseMove,false);
	canvas.addEventListener('DOMMouseScroll',onMouseWheel,false);
	canvas.addEventListener('mousewheel',onMouseWheel,false);

}
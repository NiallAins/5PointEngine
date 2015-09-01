var Input = {
		rmb    : false,
		mouseX : 0,
		mouseY : 0,
		left   : false,
		right  : false,
		up     : false,
		down   : false,
		space  : false
	}

	document.addEventListener('mousedown', function(e) {
		Input.rmb = true;
	});
	document.addEventListener('mouseup', function(e) {
		Input.rmb = false;
	});
	document.addEventListener('mousemove', function(e) {
		Input.mouseX = e.clientX;
		Input.mouseY = e.clientY;
	});

	window.onkeydown = function(e) {
   		var key = e.keyCode ? e.keyCode : e.which;

   		if      (key == 37) { Input.left  = true; }
   		else if (key == 39) { Input.right = true; }
	    else if (key == 38) { Input.up    = true; }
	    else if (key == 40) { Input.down  = true; }
	}

	window.onkeyup = function(e) {
   		var key = e.keyCode ? e.keyCode : e.which;

   		if      (key == 37) { Input.left  = false; }
   		else if (key == 39) { Input.right = false; }
	    else if (key == 38) { Input.up    = false; }
	    else if (key == 40) { Input.down  = false; }
	}
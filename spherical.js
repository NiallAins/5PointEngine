function World() {
	var objs[];

	var getCart = function(pt) {
		var ptX = pt.el * Math.sin(pt.lt) * Math.cos(pt.lg);
		var ptY = pt.el * Math.sin(pt.lt) * Math.sin(pt.lg);
		return {x: ptX, y: ptY};
	}

	var getZ = function(pt) {
		return pt.el * Math.cos(pt.lt);
	}

	var toSphe = function(pt) {
		var el = Math.sqrt((pt.x * pt.x) + (pt.y * pt.y) + (pt.z * pt.z));
		var lt = Math.acos(pt.z / el);
		var lg = Math.atan2(pt.y / pt.x);
	}

	var depthSort = function(pts) {
		var sortPts = pts.sort(function(a, b) {
			return getZ(a) - getZ(b);
		});
		return sortPts;
	}

	this.draw = function() {
		var drawObjs = depthSort(objs);
		for(var i = 0; i < drawObjs.length; i++) {
			drawObjs[i].draw();
		}
	}

	this.rot = function(rotLt, rotLg) {
		for(var i = 0; i < objs.length; i++) {
			objs[i].lt += rotLt;
			objs[i].lg += rotLg;
		}
	}

	this.zoom = function(zm) {

	}
}

function Input() {
	var rmb   = false;
	var mouseX = 0;
	var mouseY = 0;
	var left  = false;
	var right = false;
	var up    = false;
	var down  = false;
	var space = false;

	document.addEventListener('mousedown' function(e) {
		rmb = true;
	});
	document.addEventListener('mouseup' function(e) {
		rmb = false;
	});
	document.addEventListener('mousemove' function(e) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	window.onkeydown = function(e) {
   		var key = e.keyCode ? e.keyCode : e.which;

   		if      (key == 38) { left  = true; }
   		else if (key == 40) { right = true; }
	    else if (key == 37) { up    = true; }
	    else if (key == 39) { down  = true; }
	}

	window.onkeyup = function(e) {
   		var key = e.keyCode ? e.keyCode : e.which;

   		if      (key == 38) { left  = false; }
   		else if (key == 40) { right = false; }
	    else if (key == 37) { up    = false; }
	    else if (key == 39) { down  = false; }
	}
}

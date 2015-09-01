"use strict";

window.onload = function() {
	//Initiate drawing canvas and context
	var can = document.getElementById('canvas'),
        ctx = can.getContext('2d');
    can.width = window.innerWidth;
    can.height = window.innerHeight;
	var canR = can.height / 2;
    ctx.translate(can.width / 2, can.height / 2);
	ctx.fillStyle = '#F22';
    ctx.strokeStyle = '#D00';

    //Array holding all game objects
    var objs = [];

    //Set Ground level & Draw Sphere
    var grdEl = 150;
    objs.push(new Sphere(grdEl))

    //Add movable cube
    var myCube = new Cube(0, Math.PI / 2, 0.1);
    objs.push(myCube);

    //Initiate Game Loop
    update();

	function update() {
		//Clear Canvas
		ctx.clearRect(can.width / -2 , can.height / -2, can.width, can.height);

		//Move Cube
		if (Input.down)     myCube.trans(-Math.PI / 32,    0, 0);
		if (Input.up)   myCube.trans( Math.PI / 32,    0, 0);
		if (Input.left)   ctx.rotate( Math.PI / 32);
		if (Input.right)  ctx.rotate(-Math.PI / 32);

		//Update Objects
		for (var i = 0; i < objs.length; i++) {
			objs[i].update();
		}

		//Sort Objects by Depth...
		var drawObjs = objs.sort(function(a, b) {
			return getZ(a.p) - getZ(b.p);
		});

		//..and Draw
		for(var i = 0; i < drawObjs.length; i++) {
			drawObjs[i].draw();
		}

		ctx.fillStyle = '#22F';
		ctx.fillRect(-2, -2, 4, 4);
		ctx.fillStyle = '#F22';	

		//Update again at next available frame
		requestAnimationFrame(update);
	}

	function pushGrid(num, w, r) {
		for(var vert = (3 * Math.PI) - num / 2; vert < (3 * Math.PI) + num / 2; vert++) {
			for(var horz = -num / 2;  horz < num / 2; horz++) {
				objs.push(new Square(w * horz, w * vert, w / 2, grdEl));
		    }
		}
    }

    function toCart(pt) {
		var ptY = pt.el * Math.sin(pt.lg) * Math.sin(pt.lt);
		var ptX = pt.el * Math.cos(pt.lg);
		return {x: ptX, y: ptY};
	}

	function getZ(pt) {
		return pt.el * Math.sin(pt.lg) * Math.cos(pt.lt);
	}

	function proj(pt) {
		var projPt = toCart(pt);
		var depth = canR / (canR - getZ(pt));
		return {x: projPt.x * depth, y: projPt.y * depth};
	}

	function lngAdjust(pt) {
		var dist = Math.abs(pt.lg % Math.PI);
		dist = (dist > Math.PI / 2) ? Math.PI - dist : dist;
		return dist + (Math.PI / 2);
	}

	/**************************************************\
	 **************** Shape Objects *******************
	\**************************************************/

	function Sphere(rad) {
		this.p = {lt: 0, lg: 0, el: grdEl};
		
		this.update = function() {};

		this.draw = function() {
			ctx.arc(0, 0, 165, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	function Square(lat, lng, w, elv) {
		if (typeof(elv) === 'undefined') elv = grdEl;

		this.p = {lt: lat, lg: lng, el: elv};
		this.c = [];
		this.lgAj = lngAdjust(this.p);

		this.trans = function(transLat, transLng, transElv) {
			this.p.lt += transLat;
			this.p.lg += transLng;
			this.p.el += transElv;

			this.p.lt %= Math.PI * 2;
			this.p.lg %= Math.PI * 2;

			this.lgAj = lngAdjust(this.p);
		}

	    this.update = function() {
			for(var i = 0; i < 4; i++) {
	            this.c[i] = {lt: this.p.lt, lg: this.p.lg, el: this.p.el};
	            if (i === 1 || i === 2) { this.c[i].lt += w / this.lgAj; }
	                else                { this.c[i].lt -= w / this.lgAj; }
	            if (i === 2 || i === 3) { this.c[i].lg += w / this.lgAj; }
	                else                { this.c[i].lg -= w / this.lgAj; }
	    	}
		}

	    this.draw = function() {
	    	var pts = [];
	    	for(var i = 0; i < 4; i++) {
	    		pts.push(proj(this.c[i]));
	    	}
	    	ctx.beginPath();
	 			ctx.moveTo(pts[3].x, pts[3].y);
	 			for(var i = 0; i < 4; i++) {
	 				ctx.lineTo(pts[i].x, pts[i].y);
	 			}
	 			ctx.fill();	
	 		ctx.stroke();
	    }
	}

	function Cube(lat, lng, w, elv) {
		if (typeof(elv) === 'undefined') elv = grdEl + 50;

		this.p = {lt: lat, lg: lng, el: elv};
		this.c = [];
		this.lng = 0;

		this.trans = function(transLat, transLng, transElv) {
			this.p.lt += transLat;
			this.p.lg += transLng;
			this.p.el += transElv;
		}

	    this.update = function() {
			for(var i = 0; i < 8; i++) {
	            this.c[i] = {lt: this.p.lt, lg: this.p.lg, el: this.p.el};
	            if (i === 1 || i === 2 || i === 5 || i === 6 ) { this.c[i].lt += w; }
	                else                					   { this.c[i].lt -= w; }
	            if (i === 2 || i === 3 || i === 6 || i === 7 ) { this.c[i].lg += w; }
	                else                					   { this.c[i].lg -= w; }
	            if (i < 4)									   { this.c[i].el -= 50; }
	    	}
		}

	    this.draw = function() {
	    	var pt = [];
	    	for(var i = 0; i < 8; i++) {
	    		pt.push(proj(this.c[i]));
	    	}
	    	
	    	ctx.beginPath();

	        //Draw Upper or Lower face
	        if (pt[0].y < 0) {
	            ctx.moveTo(pt[0].x, pt[0].y);
	            ctx.lineTo(pt[1].x, pt[1].y);
	            ctx.lineTo(pt[5].x, pt[5].y);
	            ctx.lineTo(pt[4].x, pt[4].y);
	            ctx.lineTo(pt[0].x, pt[0].y);
	        }
	        else if (pt[2].y > 0) {
	            ctx.moveTo(pt[2].x, pt[2].y);
	            ctx.lineTo(pt[3].x, pt[3].y);
	            ctx.lineTo(pt[7].x, pt[7].y);
	            ctx.lineTo(pt[6].x, pt[6].y);
	            ctx.lineTo(pt[2].x, pt[2].y);
	        }
	        ctx.fill();

	        //Draw Left or Right face
	        if (pt[0].x > 0) {
	            ctx.moveTo(pt[0].x, pt[0].y);
	            ctx.lineTo(pt[3].x, pt[3].y);
	            ctx.lineTo(pt[7].x, pt[7].y);
	            ctx.lineTo(pt[4].x, pt[4].y);
	            ctx.lineTo(pt[0].x, pt[0].y);
	        }
	        else if (pt[1].x < 0) {
	            ctx.moveTo(pt[1].x, pt[1].y);
	            ctx.lineTo(pt[2].x, pt[2].y);
	            ctx.lineTo(pt[6].x, pt[6].y);
	            ctx.lineTo(pt[5].x, pt[5].y);
	            ctx.lineTo(pt[1].x, pt[1].y);
	        }
	        ctx.fill();

	 		//Draw Top or Bottom face
	 		if (getZ(this.c[4]) > 0) {
		 		ctx.moveTo(pt[7].x, pt[7].y);
		 		for(var i = 4; i < 8; i++) {
		 			ctx.lineTo(pt[i].x, pt[i].y);
		 		}
		 		ctx.fill();
		 	}
		 	else {
		 		ctx.moveTo(pt[3].x, pt[3].y);
		 		for(var i = 0; i < 4; i++) {
		 			ctx.lineTo(pt[i].x, pt[i].y);
		 		}
		 		ctx.fill();
		 	}

	 		ctx.stroke();
	    }
	}
}
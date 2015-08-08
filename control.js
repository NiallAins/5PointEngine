function control() {
	//Global game variables
	objs = [];
	FRIC = 0;
	dt = 0;

	ctx0.strokeStyle = '#FF3';
	ctx5.strokeStyle = '#3F3';

	//For calculating time between redraws
	var t = +new Date();
	var fps = 60;
	var drawFps = 0;

	//Starting conditions
	for(var i = 0; i < 50; i++) {
		objs.push(new Part(can0.width * (Math.random() - 0.5), can0.height * (Math.random() - 0.5), Math.random() * 30));
		objs[i].v = new Vec();
		objs[i].v.setMagAng(Math.random() * 10, Math.random() * Math.PI * 2);
	}
	ctrlPeep = objs[0];

	document.addEventListener('mousedown', function (e) {
		for(var i = 0; i < objs.length; i++) {
			objs[i].v = new Vec();
			objs[i].v.setMagAng(Math.random() * 30, Math.random() * Math.PI * 2);
		}
	});

	function loop() {
		//Check time since last refresh in ms;
		var new_t = +new Date();
		dt = (new_t - t) / 1000;
		t = new_t;

		//Update game objects
		for(var i = 0; i < objs.length; i++) {
			objs[i].update();
		}

		//Redraw
		ctx0.clearRect(-can0.width / 2, -can0.width / 2, can0.width, can0.height);
		ctx5.clearRect(-can5.width / 2, -can5.width / 2, can5.width, can5.height);
		
		//Draw game objects
    	for(var i = 0; i < objs.length; i++) {
    		ctx0.beginPath();
				objs[i].draw(ctx0);
			ctx0.stroke();

			ctx5.beginPath();
				objs[i].draw(fpCtx);
			ctx5.stroke();
		}

		// ...at next screen-draw
		requestAnimationFrame(loop);
	};

	loop();
};
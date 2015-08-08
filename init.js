//GLOBAL
window.onload = function() {
	can0 = document.getElementById('canvas0');
	can0.width = window.innerHeight * 0.9;
	can0.height = window.innerHeight * 0.9;
	ctx0 = can0.getContext('2d');
	ctx0.translate(can0.width / 2, can0.height / 2);

	can5 = document.getElementById('canvas5');
	can5.width = window.innerHeight * 0.9;
	can5.height = window.innerHeight * 0.9;
	ctx5 = can5.getContext('2d');
	ctx5.translate(can5.width / 2, can5.height / 2);
	fpCtx = new FPCtx(can5, ctx5);

	control();
};
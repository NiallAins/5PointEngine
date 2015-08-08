function Vec(x, y) {
	//Default horizontal unit vector
	if (typeof(x) === 'undefined')
		this.x = 1;
	else
		this.x = x;

	if (typeof(y) === 'undefined')
		this.y = 0;
	else
		this.y = y;
	};
		Vec.prototype.setMagAng = function(mag, ang) {
			this.x = Math.cos(ang) * mag;
			this.y = Math.sin(ang) * mag;
		};

		Vec.prototype.add = function(v) {
			return new Vec(this.x + v.x, this.y +  v.y);
		};

		Vec.prototype.sub = function(v) {
			return new Vec(this.x - v.x, this.y -v.y);
		};

		Vec.prototype.scale = function(s) {
			return new Vec(this.x * s, this.y * s);
		};

		Vec.prototype.dot = function(v) {
			return (this.x * v.x) + (this.y * v.y)
		};

		Vec.prototype.dis = function(v) {
			var a = (v.x - this.x) * (v.x - this.x);
			var b = (v.y - this.y) * (v.y - this.y);
			return Math.sqrt(a + b);
		};

		Vec.prototype.getMag = function() {
			return Math.sqrt((this.x * this.x) + (this.y * this.y));
		};

		Vec.prototype.getNorm = function() {
			var ang = this.getAng();
			return new Vec(Math.cos(ang), Math.sin(ang));
		};

		Vec.prototype.setAng = function(rad) {
			var mag = this.getMag();
			this.x = Math.cos(rad) * mag;
			this.y = Math.sin(rad) * mag;
		};

		Vec.prototype.getAng = function() {
			return Math.atan2(this.y, this.x);
		};

		Vec.prototype.angWith = function(v) {
			return Math.atan2(v.y - this.y, v.x - this.x);
		};

		Vec.prototype.getVecStr = function() {
			var pos = '<' +  Math.round(this.x) + ', ' + Math.round(this.y) + '>';
			var mag = Math.round(this.getMag() * 100) /  100;
			var angR = Math.round(this.getAng() * 100) /  1000;
			var angD = Math.round(angR * (180 / Math.PI));

			return ('Pos: ' + pos + '\nMag: ' + mag + '\nAng: ' + angR + ' rads / ' + angD + '°');
		};

		Vec.prototype.clone = function() {
			return new Vec(this.x, this.y);
		};
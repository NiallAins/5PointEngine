function FPCtx(canvas, context) {
	var can = canvas,
		ctx = context,
		r = canvas.width / 2,
	    prevP = {x : 0, y : 0};

	var sq = function(num) {
        return num * num;
    }


    //Avoids values approaching canvas edge or center
    var norm = function(point) {
        var cx = point.x / r;
        var cy = point.y / r;

        if (cx === 0) cx = 0.001;
        if (cy === 0) cy = 0.001;

        return {x : cx, y : cy};
    }

    //Params:  Array - three points as [x0, y0, x1, y1, x2, y2]
    //Returns: Array - circle center as [0,1] and radius as [2] 
    var to5p = function(p) {
        //Scale point between 1 and -1
        var depth = r / (1 - Math.min(p.z / r, -0.001));
        scaleP = norm(p);

        var newX = scaleP.x * Math.sqrt(1 - (scaleP.y * scaleP.y / 2) );
        var newY = scaleP.y * Math.sqrt(1 - (scaleP.x * scaleP.x / 2) );

        return {x : newX * depth, y : newY * depth};
    }

    //Params:  Array - three points as [x0, y0, x1, y1, x2, y2]
    //Returns: Array - circle center as [0,1] and radius as [2]
    var arcUsing = function(p) {
        var k = 0.5 * (((sq(p[0])+sq(p[1])) * (p[4]-p[2])) + ((sq(p[2])+sq(p[3])) * (p[0]-p[4])) + ((sq(p[4])+sq(p[5])) * (p[2]-p[0]))) / (p[1] * (p[4]-p[2])+(p[3] * (p[0]-p[4])+(p[5] * (p[2]-p[0]))));  
        var h = 0.5 * (((sq(p[0])+sq(p[1])) * (p[5]-p[3])) + ((sq(p[2])+sq(p[3])) * (p[1]-p[5])) + ((sq(p[4])+sq(p[5])) * (p[3]-p[1]))) / (p[0] * (p[5]-p[3])+(p[2] * (p[1]-p[5])+(p[4] * (p[3]-p[1]))));
        var rad = Math.sqrt(sq(p[0] - h) + sq(p[1] - k));
        
        return [h, k, rad];
    }

    //Params:  Array - three points as [x0, y0, x1, y1, x2, y2]
    //Returns: Array - circle center as [0,1] and radius as [2] 
    this.line = function(p00, p10) {
        /*p00 = norm(p00);
        p10 = norm(p10);

        var yi = p00.y - ((p10.y - p00.y) / (p10.x - p00.x) * p00.x);
        if (Math.abs(yi) === Infinity) yi = 1;

        var p05 = to5p(p00);
        var p15 = to5p(p10);

        var c = arcUsing([p05.x, p05.y, 0, yi, p15.x, p15.y]);

        var sAng = Math.atan2(p05.y - c[1], p05.x - c[0]) + (Math.PI * 2);
        var eAng = Math.atan2(p15.y - c[1], p15.x - c[0]) + (Math.PI * 2);

        var arcAng = eAng - sAng;
        if (arcAng >  Math.PI) arcAng -= 2 * Math.PI;
        if (arcAng < -Math.PI) arcAng += 2 * Math.PI;

        ctx.save();
            ctx.scale(rZ, rZ);
            ctx.arc(c[0], c[1], c[2], sAng, eAng, arcAng < 0);	
        ctx.restore();*/
        var p05 = to5p(p00);
        var p15 = to5p(p10);
        ctx.lineTo(p05.x, p05.y);
        ctx.lineTo(p15.x, p15.y);
    }

    this.moveTo = function(xin, yin, zin) {
    	prevP = { x: xin, y : yin, z : zin };
    }

    this.lineTo = function(xin, yin, zin) {
    	var nextP = { x: xin, y : yin, z: zin };
        this.line(prevP, nextP);
    	prevP = nextP;
    }

    this.rect = function(px, py, w, h) {
    	var p0 = {x : px    , y : py    },
    	    p1 = {x : px + w, y : py    },
    	    p2 = {x : px + w, y : py + h},
    	    p3 = {x : px    , y : py + h};
    	    
    	this.line(p0, p1);
	    this.line(p1, p2);
	    this.line(p2, p3);
	    this.line(p3, p0);
	}
}
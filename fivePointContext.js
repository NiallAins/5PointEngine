function FPCtx(canvas, context) {
	var can = canvas,
		ctx = context,
		r = canvas.width / 2,
	    prevP = {x : 0, y : 0};

	var sq = function(num) {
        return num * num;
    }


    //Avoids values approaching canvas edge or center
    var clean = function(p) {
        var cx = p.x / r;
        var cy = p.y / r;

        cx = Math.min(cx,  0.999);
        cy = Math.min(cy,  0.999);
        cx = Math.max(cx, -0.999);
        cy = Math.max(cy, -0.999);

        if (cx === 0) cx = 0.001;
        if (cy === 0) cy = 0.001;

        cx *= r;
        cy *= r;

        return {x : cx, y : cy};
    }

    //Params:  Array - three points as [x0, y0, x1, y1, x2, y2]
    //Returns: Array - circle center as [0,1] and radius as [2] 
    var to5p = function(p) {
        //Scale point between 1 and -1
        p = clean(p);
        var scaleX = p.x / r;
        var scaleY = p.y / r;

        //Get each new axis by taking arc through point and vanishing points
        var xAx = arcUsing([1, 0, -1, 0, 0, scaleY]);
        var yAx = arcUsing([0, 1, 0, -1, scaleX, 0]);

        //Get new point at new axis intersection
        var newPt = arcIntersec(xAx, yAx);

        //Rescale
        newPt.x *= r;
        newPt.y *= r;

        return newPt;
    }

	//Params:  Array - three points as [x0, y0, x1, y1, x2, y2]
    //Returns: Array - circle center as [0,1] and radius as [2]
    var arcUsing = function(p) {
        var k = 0.5 * (((sq(p[0])+sq(p[1])) * (p[4]-p[2])) + ((sq(p[2])+sq(p[3])) * (p[0]-p[4])) + ((sq(p[4])+sq(p[5])) * (p[2]-p[0]))) / (p[1] * (p[4]-p[2])+(p[3] * (p[0]-p[4])+(p[5] * (p[2]-p[0]))));  
        var h = 0.5 * (((sq(p[0])+sq(p[1])) * (p[5]-p[3])) + ((sq(p[2])+sq(p[3])) * (p[1]-p[5])) + ((sq(p[4])+sq(p[5])) * (p[3]-p[1]))) / (p[0] * (p[5]-p[3])+(p[2] * (p[1]-p[5])+(p[4] * (p[3]-p[1]))));
        var rad = Math.sqrt(sq(p[0] - h) + sq(p[1] - k));
        
        return [h, k, rad];
    }

    //Params:  Two Arrays - circle centers as [0,1] and radius' as [2]
    //Returns: Object - intersection point of two circles
    var arcIntersec = function(c0, c1) {
        var p0 = [c0[0], c0[1], c0[2]];
        var p1 = [c1[0], c1[1], c1[2]];

        var d = Math.sqrt(sq(p0[1] - p1[1]) + sq(p0[0] - p1[0])); 
        var a = (sq(p0[2]) - sq(p1[2]) + d*d)/(2*d);
        var h = Math.sqrt(sq(p0[2]) - a*a);
        var p2 = [((p1[0] - p0[0]) * (a/d)) + p0[0], ((p1[1] - p0[1]) * (a/d)) + p0[1]];
        var x3 = p2[0] + h*(p1[1] - p0[1])/d;
        var y3 = p2[1] - h*(p1[0] - p0[0])/d;
        var x4 = p2[0] - h*(p1[1] - p0[1])/d;
        var y4 = p2[1] + h*(p1[0] - p0[0])/d;

        //Return relavent intersection point
        if (x3 * y3 > 0)
            return { x : x3, y : y3 };
        else
            return { x : x4, y : y4 };
    }

    //Params:  Array - three points as [x0, y0, x1, y1, x2, y2]
    //Returns: Array - circle center as [0,1] and radius as [2] 
    this.line = function(p00, p10) {
    	p00 = clean(p00);
        p10 = clean(p10);

        var yi = p00.y - ((p10.y - p00.y) / (p10.x - p00.x) * p00.x);
        if (Math.abs(yi) === Infinity) yi = r;

        var p05 = to5p(p00);
        var p15 = to5p(p10);

        var c = arcUsing([p05.x, p05.y, 0, yi, p15.x, p15.y]);

        var sAng = Math.atan2(p05.y - c[1], p05.x - c[0]) + (Math.PI * 2);
        var eAng = Math.atan2(p15.y - c[1], p15.x - c[0]) + (Math.PI * 2);

        var arcAng = eAng - sAng;
        if (arcAng >  Math.PI) arcAng -= 2 * Math.PI;
        if (arcAng < -Math.PI) arcAng += 2 * Math.PI;

        ctx.arc(c[0], c[1], c[2], sAng, eAng, arcAng < 0);	
    }

    this.moveTo = function(xin, yin) {
    	prevP = { x: xin, y : yin };
    }

    this.lineTo = function(xin, yin) {
    	var p = { x: xin, y : yin };
    	this.line(prevP, p);
    	prevP = p;
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
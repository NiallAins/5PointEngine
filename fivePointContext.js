function FPCtx(canvas, context) {
	var can = canvas,
		ctx = context,
		r = canvas.width / 2,
	    prevP;

    /* Five point perspective equivient of context.moveTo()
     * {x, y, z} */
    this.moveTo = function(pIn) {
        prevP = pIn;
    }

    /* Five point perspective equivient of context.lineTo()
     * {x, y, z} -> draw to ctx */
    this.lineTo = function(pIn) {
        line(prevP, pIn);
        prevP = pIn;
    }

    /* Takes a point, a width, height and depth and
     * renders a cube in five point perspective with the point as center
     * {x, y, z}, width, height, depth -> draw to ctx*/
    this.cube = function(pIn, w) {
        var px = pIn.x;
        var py = pIn.y;
        var pz = pIn.z;
        var p0 = {x : px    , y : py    , z : pz},
            p1 = {x : px + w, y : py    , z : pz},
            p2 = {x : px + w, y : py + w, z : pz},
            p3 = {x : px    , y : py + w, z : pz};
            p4 = {x : px    , y : py    , z : pz + 0.5},
            p5 = {x : px + w, y : py    , z : pz + 0.5},
            p6 = {x : px + w, y : py + w, z : pz + 0.5},
            p7 = {x : px    , y : py + w, z : pz + 0.5};

        line(p0, p1);
        line(p1, p2);
        line(p2, p3);
        line(p3, p0);
        line(p4, p5);
        line(p5, p6);
        line(p6, p7);
        line(p7, p4);
        line(p0, p4);
        line(p1, p5);
        line(p2, p6);
        line(p3, p7);
    }

    /** Takes the 3D co-ordinates of a point and returns the 2D
      * co-ordinates of the point's projcetion from five point perspective
      * {x, y, z} -> {x, y} */
    var to5p = function(p) {
        //To 2D normalised
        var nX = p.x / r,
            nY = p.y / r;

        //Get 5 point normalised
        var x5 = nX * Math.sqrt(1 - (nY * nY / 2) );
        var y5 = nY * Math.sqrt(1 - (nX * nX / 2) );

        //Rescale relative to depth and return
        return {x : x5 * r * p.z, y : y5 * r * p.z};
    }

    /** Takes the 3D co-ordinates of two points and draws the line between them
      * as a curve projected from five point perspective
      * {x, y, z}, {x, y, z} -> draw to ctx */
    var line = function(p1, p2) {
        //Axis intersection of line between points
        var xi = yi = p1.z;
        if (p1.x === p2.x) xi *= p1.x - (p1.y / ((p2.y - p1.y) / (p2.x - p1.x)));
        else               yi *= p1.y - (((p2.y - p1.y) / (p2.x - p1.x))  * p1.x);

        //Get points in 5pp
        var p15 = to5p(p1);
        var p25 = to5p(p2);
        
        //Circle between points and axis intersection
        var c = circleUsing([p15.x, p15.y, xi, yi, p25.x, p25.y]);

        //Arc segment
        var sAng = Math.atan2(p15.y - c[1], p15.x - c[0]) + (Math.PI * 2);
        var eAng = Math.atan2(p25.y - c[1], p25.x - c[0]) + (Math.PI * 2);

        //Normalise arc angle
        var arcAng = eAng - sAng;
        if (arcAng >  Math.PI) arcAng -= 2 * Math.PI;
        if (arcAng < -Math.PI) arcAng += 2 * Math.PI;

        //Draw arc
        ctx.arc(c[0], c[1], c[2], sAng, eAng, arcAng < 0);
    }

    /** Takes an array of co-ordinates and returns the center
      * and radius of a circle through them
      * [x0, y0, x1, y1, x2, y2] -> [circle X, circleY, radius] */
    var circleUsing = function(p) {
        var k = 0.5 * (((sq(p[0])+sq(p[1])) * (p[4]-p[2])) + ((sq(p[2])+sq(p[3])) * (p[0]-p[4])) + ((sq(p[4])+sq(p[5])) * (p[2]-p[0]))) / (p[1] * (p[4]-p[2])+(p[3] * (p[0]-p[4])+(p[5] * (p[2]-p[0]))));  
        var h = 0.5 * (((sq(p[0])+sq(p[1])) * (p[5]-p[3])) + ((sq(p[2])+sq(p[3])) * (p[1]-p[5])) + ((sq(p[4])+sq(p[5])) * (p[3]-p[1]))) / (p[0] * (p[5]-p[3])+(p[2] * (p[1]-p[5])+(p[4] * (p[3]-p[1]))));
        var rad = Math.sqrt(sq(p[0] - h) + sq(p[1] - k));
        
        return [h, k, rad];
    }

    /** Shorthand for Math.pow(num, 2); */
    var sq = function(num) {
        return num * num;
    }
}

function FPCtx(canvas, context, r) {
	var can = canvas,
		ctx = context,
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

    /* Takes a point with a width, height and depth and
     * renders a cube in five point perspective with the point as lower top left 
     * {x, y, z}, width -> draw to ctx*/
    this.cube = function(cube) {
        var w = cube.width, 
            b = cube.breadth,
            h = cube.height;
            if (typeof(breadth) === 'undefined') b = w;

        //Define 8 cube corners in 5pp
        var cc = [];
        for(var i = 0; i < 8; i++) {
            cc.push({x : cube.x, y : cube.y, z: cube.z});
            if (i === 1 || i === 2 || i === 5 || i === 6 ) { cc[i].x += w; }
                else                                       { cc[i].x -= w; }
            if (i === 2 || i === 3 || i === 6 || i === 7 ) { cc[i].y += b; }
                else                                       { cc[i].y -= b; }
            if (i > 3)                                     { cc[i].z += h; }
        }

        ctx.beginPath();

        var sl;
        //Draw either upper or lower face
        if ((r - Math.abs(cc[0].y) > 0 && cc[0].y > 0) || (r - Math.abs(cc[0].y) < 0 && cc[0].y > 0)) {
            sl = to5p(cc[0]);
            ctx.moveTo(sl.x, sl.y);
            line(cc[0], cc[1]);
            sl = to5p(cc[5]);
            ctx.lineTo(sl.x, sl.y);
            line(cc[5], cc[4]);
            sl = to5p(cc[0]);
            ctx.lineTo(sl.x, sl.y);
        }
        else if ((r - Math.abs(cc[2].y) > 0 && cc[2].y < 0) || (r - Math.abs(cc[0].y) < 0 && cc[0].y < 0)) {
            sl = to5p(cc[2]);
            ctx.moveTo(sl.x, sl.y);
            line(cc[2], cc[3]);
            sl = to5p(cc[7]);
            ctx.lineTo(sl.x, sl.y);
            line(cc[7], cc[6]);
            sl = to5p(cc[2]);
            ctx.lineTo(sl.x, sl.y);
        }
        ctx.fill();

        //Draw either left or right faces
        if ((r - Math.abs(cc[0].x) > 0 && cc[0].x > 0) ){// || (r - Math.abs(cc[0].x) < 0 && cc[0].x < 0)) {
            sl = to5p(cc[0]);
            ctx.moveTo(sl.x, sl.y);
            line(cc[0], cc[3]);
            sl = to5p(cc[7]);
            ctx.lineTo(sl.x, sl.y);
            line(cc[7], cc[4]);
            sl = to5p(cc[0]);
            ctx.lineTo(sl.x, sl.y);
        }
        else if ((r - Math.abs(cc[1].x) > 0 && cc[1].x < 0) ){//|| (r - Math.abs(cc[0].x) < 0 && cc[0].x > 0)) {
            sl = to5p(cc[1]);
            ctx.moveTo(sl.x, sl.y);
            line(cc[1], cc[2]);
            sl = to5p(cc[6]);
            ctx.lineTo(sl.x, sl.y);
            line(cc[6], cc[5]);
            sl = to5p(cc[1]);
            ctx.lineTo(sl.x, sl.y);
        }
        ctx.fill();

        //Draw top face
        if (r - Math.abs(cube.y) > 0) {
            sl = to5p(cc[4]);
            ctx.moveTo(sl.x, sl.y);
            line(cc[4], cc[5]);
            line(cc[5], cc[6]);
            line(cc[6], cc[7]);
            line(cc[7], cc[4]);
            ctx.fill();
        }
        ctx.stroke();
    }

    this.rect = function(pIn, w, h) {
    if (typeof(h) === 'undefined') h = w;

        //Define 4 square corners in 5pp
        var sc = [];
        for(var i = 0; i < 4; i++) {
            sc.push({x : pIn.x, y : pIn.y, z: pIn.z});
            if (i === 1 || i === 2) sc[i].x += w;
            if (i === 2 || i === 3) sc[i].y += h;
        }

        //Draw
        ctx.beginPath();
            ctx.moveTo(to5p(sc[0]).x, to5p(sc[0]).y);
            line(sc[0], sc[1]);
            line(sc[1], sc[2]);
            line(sc[2], sc[3]);
            line(sc[3], sc[0]);
        ctx.fill();
    }

    /** Takes the 3D co-ordinates of a point and returns the 2D
      * co-ordinates of the point's projection from five point perspective
      * {x, y, z} -> {x, y} */
    var to5p = function(p) {
        var cp = convergAtR(p);
        var nX = cp.x / r,
            nY = cp.y / r;

        //Get 5 point normalised
        var x5 = nX * Math.sqrt(1 - (nY * nY / 2));
        var y5 = nY * Math.sqrt(1 - (nX * nX / 2));

        //Rescale relative to depth and return
        return {x : x5 * p.z * r, y : y5 * p.z * r};
    }

    /** Takes the 3D co-ordinates of two points and draws the line between them
      * as a curve projected from five point perspective
      * {x, y, z}, {x, y, z} -> draw to ctx */
    var line = function(p1, p2) {
        var cp1 = convergAtR(p1),
            cp2 = convergAtR(p2);

        //Axis intersection of line between points
        var xi = yi = cp1.z;
        if (p1.x === p2.x) xi *= cp1.x;
        else               yi *= cp1.y - (((cp2.y - cp1.y) / (cp2.x - cp1.x))  * cp1.x);

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
        //ctx.lineTo(p25.x, p25.y);
    }

    var convergAtR = function(p) {
        var conX = p.x * (2 - (Math.abs(p.x) / r)),
            conY = p.y * (2 - (Math.abs(p.y) / r));
        return {x : conX, y : conY, z : p.z};
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

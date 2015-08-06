"use strict";

window.onload = function() {
    var can0 = document.getElementById('can0'),
        ctx0 = can0.getContext('2d');
    can0.width = can0.height = window.innerWidth * 0.4;
    ctx0.translate(can0.width / 2, can0.height / 2);

    var can5 = document.getElementById('can5'),
        ctx5 = can5.getContext('2d');
    can5.width = can5.height = window.innerWidth * 0.4;
    ctx5.translate(can5.width / 2, can5.height / 2);

    ctx0.lineWidth = 1;
    ctx5.lineWidth = 1;

    var scale = 5;
    var box = Box(scale);
    var boxTrans = [];

    for(var i = 0; i < box.length; i++) {
        boxTrans.push({ x : box[i].x - (can0.width  / 2) ,
                        y : box[i].y - (can0.height / 2)});
    }
    drawTo0(boxTrans);
    drawTo5(boxTrans);

    function Box(scale) {
        var arr = []; 
        for(var i = 0; i < 10 * scale; i++) {
            if (i % 2 == 0) {
                for(var j = 0; j < 10 * scale; j++) {
                    arr.push({x : i * 10, y : j * 10});
                }
            }
            else {
                for(var j = (10 * scale) - 1; j >= 0; j--) {
                    arr.push({x : i * 10, y : j * 10});
                }
            }
        }
        for(var i = 0; i < 10 * scale; i++) {
            if (i % 2 == 0) {
                for(var j = (10 * scale) - 1; j >= 0; j--) {
                    arr.push({x : j * 10, y : i * 10});
                }
            }
            else {
                for(var j = 0; j < 10 * scale; j++) {
                    arr.push({x : j * 10, y : i * 10});
                }
            }
        }
        return arr;
    }

    document.addEventListener('mousemove', function(e) {
        var boxTrans = [];
        var rect = can0.getBoundingClientRect();
        for(var i = 0; i < box.length; i++) {
            boxTrans.push({ x : box[i].x + e.clientX - (can0.width  / 2) - rect.left - (scale * 50),
                            y : box[i].y + e.clientY - (can0.height / 2) - rect.top -  (scale * 50)});
        }
        drawTo0(boxTrans);
        drawTo5(boxTrans);
    });

    can0.addEventListener('mousedown', function(e) {
        scale %= 6;
        scale++;
        box = Box(scale);
        drawTo0(box);
        drawTo5(box);
    });
            
    function to5pp(p) {
        var r = can5.width / 2,
            scaleX = p.x / r,
            scaleY = p.y / r;

        var ptsX = [1, 0, -1, 0, 0, scaleY];
        var ptsY = [0, 1, 0, -1, scaleX, 0];
        var newPt = getIntersec(getEq(ptsX), getEq(ptsY));
        newPt.x *= r;
        newPt.y *= r;
        return newPt;
    };

    function drawTo0(pts) {
        ctx0.clearRect(-can0.width / 2, -can0.height / 2, can0.width, can0.height);
                
        ctx0.strokeStyle = '#22F';
        ctx0.beginPath();
            ctx0.moveTo(pts[0].x, pts[0].y);
            for(var i = 0; i < pts.length; i ++) {
                ctx0.lineTo(pts[i].x, pts[i].y);
            }
        ctx0.stroke();
    };

    function drawTo5(pts) {
        ctx5.clearRect(-can5.width / 2, -can5.height / 2, can5.width, can5.height);
        
        var pt = to5pp(pts[0]);
        ctx5.strokeStyle = '#F22';
        ctx5.beginPath();
            ctx5.moveTo(pt.x, pt.y);
            for(var i = 0; i < pts.length; i ++) {
                pt = to5pp(pts[i]);
                ctx5.lineTo(pt.x, pt.y);
            }
        ctx5.stroke();
    };

    function sq(num) {
        return num * num;
    }

    function getEq(p) {
        var k = 0.5 * (((sq(p[0])+sq(p[1])) * (p[4]-p[2])) + ((sq(p[2])+sq(p[3])) * (p[0]-p[4])) + ((sq(p[4])+sq(p[5])) * (p[2]-p[0]))) / (p[1] * (p[4]-p[2])+(p[3] * (p[0]-p[4])+(p[5] * (p[2]-p[0]))));
        
        var h = 0.5 * (((sq(p[0])+sq(p[1])) * (p[5]-p[3])) + ((sq(p[2])+sq(p[3])) * (p[1]-p[5])) + ((sq(p[4])+sq(p[5])) * (p[3]-p[1]))) / (p[0] * (p[5]-p[3])+(p[2] * (p[1]-p[5])+(p[4] * (p[3]-p[1]))));
        
        var r = sq(p[0] - h) + sq(p[1] - k);
        h = Math.round(h* 10000) / 10000;
        k = Math.round(k* 10000) / 10000;
        r = Math.round(r* 10000) / 10000;
        
        return [h, k, r];
    }

    function getIntersec(c0, c1) {
        var p0 = [c0[0], c0[1], Math.sqrt(c0[2])];
        var p1 = [c1[0], c1[1], Math.sqrt(c1[2])];

        var d = Math.sqrt(sq(p0[1] - p1[1]) + sq(p0[0] - p1[0])); 
        var a = (sq(p0[2]) - sq(p1[2]) + d*d)/(2*d);
        var h = Math.sqrt(sq(p0[2]) - a*a);
        var p2 = [((p1[0] - p0[0]) * (a/d)) + p0[0], ((p1[1] - p0[1]) * (a/d)) + p0[1]];
        var x3 = p2[0] + h*(p1[1] - p0[1])/d;
        var y3 = p2[1] - h*(p1[0] - p0[0])/d;
        var x4 = p2[0] - h*(p1[1] - p0[1])/d;
        var y4 = p2[1] + h*(p1[0] - p0[0])/d;

        if (x3 * y3 > 0)
            return { x : x3, y : y3 };
        else
            return { x : x4, y : y4 };
    }
};

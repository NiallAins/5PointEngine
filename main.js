"use strict";

window.onload = function() {
    var can = document.getElementById('canvas'),
        ctx = can.getContext('2d');
    can.width  = window.innerWidth;
    can.height = window.innerHeight;
    var canR = can.height / 2;
    ctx.translate(can.width / 2, can.height / 2);
    var fpCtx = new FPCtx(can, ctx, canR);

    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    
    var boxs = [{x : -50 , y : -100, z : 1},
                {x :  300, y :  200, z : 1},
                {x : -200, y :  100, z : 1},
                {x :  50 , y :  100, z : 1},
                {x : -300, y : -200, z : 1},
                {x :  200, y :  100, z : 1},
                {x :  300, y : -300, z : 1}];

    var grid = new Grid(can.height);
    for(var i = 0; i < grid.length; i++) {
        var newX = grid[i].x - canR;
        var newY = grid[i].y - canR;
        grid[i] = {x : newX, y : newY, z : 0.5};
    }

    draw(boxs);

    function Grid(w) {
        var arr = []; 
        w /= 10;
        for (var i = 0; i <= 10; i++) {
            if (i % 2 === 0) {
                for (var j = 0; j <= 10; j++) {
                    arr.push({x:i * w, y: j * w});
                }
            }
            else {
                for (var j = 10; j >= 0; j--) {
                    arr.push({x:i * w, y: j * w});
                }
            }
        }
        for (var i = 0; i <= 10; i++) {
            if (i % 2 !== 0) {
                for (var j = 0; j <= 10; j++) {
                    arr.push({x:j * w, y: i * w});
                }
            }
            else {
                for (var j = 10; j >= 0; j--) {
                    arr.push({x:j * w, y: i * w});
                }
            }
        }
        return arr;
    }

    document.addEventListener('mousemove', function(e) {
        translate(e.clientX - (can.width / 2), e.clientY, boxs);
    })

    function translate(transX, transY, pts) {
        var ptsTrans = [];
        for(var i = 0; i < pts.length; i++) {
            var pTrans = { x : pts[i].x - canR + transX,
                           y : pts[i].y - canR + transY,
                           z : pts[i].z};
            ptsTrans.push(pTrans);
        }
        draw(ptsTrans);
    }

    function draw(pts) {
        //Clear canvas
        ctx.clearRect(-can.width / 2, -can.height / 2, can.width, can.height);

        //Redraw Grid
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#555';
        ctx.beginPath();
            fpCtx.moveTo(grid[0]);
            for(var i = 1; i < grid.length; i++) {
                fpCtx.lineTo(grid[i]);
            }
        ctx.stroke();

        //Draw points closer to center ontop of points closer circumference
        pts = pts.sort(function(a, b) { return (dist(b) - dist(a)) });

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#A00';
        ctx.fillStyle = '#F22';
        for(var i = 0; i < pts.length; i++) {
            fpCtx.cube(pts[i], 0.5, 100);
        }
    }
    
    function dist(pt) {
        return Math.sqrt((pt.x * pt.x) + (pt.y * pt.y));
    }
};

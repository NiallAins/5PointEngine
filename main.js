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
    
    var objs = [//{type: 'cube', x : -50 , y : -100, z : normZ(0), height : 0.5, width : 50},
                //{type: 'cube', x :  300, y :  200, z : normZ(0), height : 0.5, width : 50},
                //{type: 'cube', x : -200, y :  100, z : normZ(0), height : 0.5, width : 50},
                //{type: 'cube', x :  50 , y :  100, z : normZ(0), height : 0.5, width : 50},
                //{type: 'cube', x : -300, y : -200, z : normZ(0), height : 0.5, width : 50},
                //{type: 'cube', x :  200, y :  100, z : normZ(0), height : 0.5, width : 50},
                {type: 'cube', x :    0, y :    0, z : normZ(0), height : 0.1, width : 5}];





    var grid = new Grid(can.height);
    for(var i = 0; i < grid.length; i++) {
        var newX = grid[i].x - canR;
        var newY = grid[i].y - canR;
        grid[i] = {x : newX, y : newY, z : normZ(0)};
    }
    objs.push({type: 'path', pts : grid, x : 0, y : 0, z : 0.5});

    draw(objs);

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
        translate(e.clientX - canR, e.clientY, objs);
    });

    function translate(transX, transY, pts) {
        var ptsTrans = [];
        for(var i = 0; i < pts.length; i++) {
            var pTrans = { type: pts[i].type, x: pts[i].x, y : pts[i].y, z : pts[i].z, height: pts[i].height, width : pts[i].width };
            if (pTrans.type === 'cube') {
                pTrans.x = pts[i].x - canR + transX;
                pTrans.y = pts[i].y - canR + transY;
            }
            ptsTrans.push(pTrans);
        }
        draw(ptsTrans);
    }

    function draw(objs) {
        //Clear canvas
        ctx.clearRect(-can.width / 2, -can.height / 2, can.width, can.height);

        //Draw points closer to center ontop of points closer circumference
        objs = objs.sort(function(a, b) { return depthDist(a) - depthDist(b) });

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#A00';
        ctx.fillStyle = '#F22';
        for(var i = 0; i < objs.length; i++) {
            if (objs[i].type === 'cube') {
                fpCtx.cube(objs[i]);
            }
            else if (objs[i].type === 'path') {
                drawGrid();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#A00';
                ctx.fillStyle = '#F22';
            }
        }
    }

    function drawGrid() {
        ctx.fillStyle = '#555';
        fpCtx.rect({x : -canR, y : -canR, z : normZ(0)}, canR * 2);

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#222';
        ctx.beginPath();
            fpCtx.moveTo(grid[0]);
            for(var i = 1; i < grid.length; i++) {
                fpCtx.lineTo(grid[i]);
            }
        ctx.stroke();
    }

    function normZ(pz) {
        return (pz / canR) + 0.5;
    }

    function depthDist(obj) {
        var nx  = obj.x / canR;
        var ny  = obj.y / canR;
        var nDist = Math.sqrt((nx * nx) + (ny * ny));
        var ang = nDist * Math.PI;
        var nz = obj.z + (obj.height || 0);
        var depth = 1 - (nz * (Math.cos(ang)));
        return depth;
    }
};



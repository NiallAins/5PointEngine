"use strict";

window.onload = function() {
    var can0 = document.getElementById('canvas0'),
        ctx0 = can0.getContext('2d');
    can0.width = can0.height = window.innerWidth * 0.4;
    ctx0.translate(can0.width / 2, can0.height / 2);

    var can5 = document.getElementById('canvas5'),
        ctx5 = can5.getContext('2d');
    can5.width = can5.height = window.innerWidth * 0.4;
    ctx5.translate(can5.width / 2, can5.height / 2);
    var fpCtx = new FPCtx(can5, ctx5);

    ctx0.lineWidth = 3;
    ctx0.lineJoin = 'round';
    ctx5.lineWidth = 3;
    ctx5.lineJoin = 'round';

    var scale = -200;
    var box0 = new Cube(-50, 100, 100);
    var box1 = new Cube(300, 200, 20);
    var box2 = new Cube(100, -200, 200);
    var box3 = new Cube(-150, -200, 50);

    var grid = new Grid(can0.width);
    for(var i = 0; i < grid.length; i++) {
        grid[i].x -= can0.width / 2;
        grid[i].y -= can0.width / 2;
    }
    canClear();


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

    function Cube(xin, yin, w) {
        return [{x: xin    , y: yin    , z: 0},
                {x: xin    , y: yin + w, z: 0},
                {x: xin + w, y: yin + w, z: 0}, 
                {x: xin + w, y: yin    , z: 0},
                {x: xin    , y: yin    , z: 0},
                {x: xin    , y: yin    , z: w},
                {x: xin    , y: yin + w, z: w},
                {x: xin    , y: yin + w, z: 0},
                {x: xin    , y: yin + w, z: w},
                {x: xin + w, y: yin + w, z: w},
                {x: xin + w, y: yin + w, z: 0},
                {x: xin + w, y: yin + w, z: w},
                {x: xin + w, y: yin    , z: w},
                {x: xin + w, y: yin    , z: 0},
                {x: xin + w, y: yin    , z: w},
                {x: xin    , y: yin    , z: w} ];
    }

    function addDepth(p) {
        var r = can0.width  / 2;

        var scaleX = p.x / r,
            scaleY = p.y / r,
            scaleZ = Math.min(p.z / r, 0.999);

        scaleX *= 1 / (1 - scaleZ);
        scaleY *= 1 / (1 - scaleZ);

        p.x = scaleX * r;
        p.y = scaleY * r;
        p.z = scaleZ * r;

        return p;
    }

    document.addEventListener('mousemove', function(e) {
        var rect = can0.getBoundingClientRect();
        canClear();
        transBox(-rect.left + e.clientX, -rect.top + e.clientY, box0);
        transBox(-rect.left + e.clientX, -rect.top + e.clientY, box1);
        transBox(-rect.left + e.clientX, -rect.top + e.clientY, box2);
        transBox(-rect.left + e.clientX, -rect.top + e.clientY, box3);
    })

    can0.addEventListener('mousedown', function(e) {
        scale -= 100;
        scale %= -800
    })

    function transBox(transX, transY, box) {
        var boxTrans = [];
        for(var i = 0; i < box.length; i++) {
            var pTrans = addDepth({ x : box[i].x - (can0.width / 2) + transX,
                                    y : box[i].y - (can0.height / 2) + transY,
                                    z : box[i].z + scale                      });
            boxTrans.push(pTrans)
        }
        drawTo0(boxTrans);
        drawTo5(boxTrans);
    }

    function canClear() {
        ctx5.clearRect(-can5.width / 2, -can5.height / 2, can5.width, can5.height);
        ctx0.clearRect(-can0.width / 2, -can0.height / 2, can0.width, can0.height);

        ctx0.lineWidth = 1;
        ctx0.strokeStyle = '#555';
        ctx0.beginPath();
            ctx0.moveTo(grid[0].x, grid[0].y);
            for(var i = 1; i < grid.length; i++) {
                ctx0.lineTo(grid[i].x, grid[i].y);
            }
        ctx0.stroke();

        ctx5.lineWidth = 1;
        ctx5.strokeStyle = '#555';
        ctx5.beginPath();
            fpCtx.moveTo(grid[0].x, grid[0].y);
            for(var i = 1; i < grid.length; i++) {
                fpCtx.lineTo(grid[i].x, grid[i].y);
            }
        ctx5.stroke();
    }
            
    function drawTo0(pts) {
        ctx0.lineWidth = 2;
        ctx0.strokeStyle = '#22F';
        ctx0.beginPath();
            ctx0.moveTo(pts[0].x, pts[0].y);
            for(var i = 1; i < pts.length; i++) {
                ctx0.lineTo(pts[i].x, pts[i].y);
            }
        ctx0.stroke();
    }

    function drawTo5(pts) {
        ctx5.lineWidth = 2;
        ctx5.strokeStyle = '#F22';
        ctx5.beginPath();
            fpCtx.moveTo(pts[0].x, pts[0].y);
            for(var i = 1; i < pts.length; i++) {
                fpCtx.lineTo(pts[i].x, pts[i].y);
            }
        ctx5.stroke();
    }
};

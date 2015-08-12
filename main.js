"use strict";

window.onload = function() {
    var can = document.getElementById('canvas'),
        ctx = can.getContext('2d');
    can.width = can.height = window.innerWidth * 0.4;
    var canR = can.width / 2;
    ctx.translate(canR, canR);
    var fpCtx = new FPCtx(can, ctx);

    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';

    var scale = 1;
    var box0 = [{x : -50 , y: 100, z : 1}];
    var box1 = [{x :  300, y: 200, z : 1}];
    var box2 = [{x : -200, y: 100, z : 1}];
    var box3 = [{x :  50 , y : 50, z : 1}];

    var grid = new Grid(can.width);
    for(var i = 0; i < grid.length; i++) {
        var newX = grid[i].x - canR;
        var newY = grid[i].y - canR;
        grid[i] = {x : newX, y : newY, z : 0.5};
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

    document.addEventListener('mousemove', function(e) {
        var rect = can.getBoundingClientRect();
        canClear();
        transBox(-rect.left + e.clientX, -rect.top + e.clientY, box0);
        transBox(-rect.left + e.clientX, -rect.top + e.clientY, box1);
        transBox(-rect.left + e.clientX, -rect.top + e.clientY, box2);
        transBox(-rect.left + e.clientX, -rect.top + e.clientY, box3);
    })

    can.addEventListener('mousedown', function(e) {
        scale -=  100;
        scale %= -800
    })

    function transBox(transX, transY, box) {
        var boxTrans = [];
        for(var i = 0; i < box.length; i++) {
            var pTrans = { x : box[i].x - canR + transX,
                           y : box[i].y - canR + transY,
                           z : box[i].z};
            boxTrans.push(pTrans)
        }
        draw(boxTrans);
    }

    function canClear() {
        ctx.clearRect(-canR, -canR, can.width, can.height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#555';
        ctx.beginPath();
            fpCtx.moveTo(grid[0]);
            for(var i = 1; i < grid.length; i++) {
                fpCtx.lineTo(grid[i]);
            }
        ctx.stroke();
    }

    function draw(pts) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#2F2';
        ctx.fillStyle = '#F22';
        ctx.beginPath();
            fpCtx.cube(pts[0], 0.5, 100);
        ctx.stroke();
    }
};

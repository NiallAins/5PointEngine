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
    var fpCtx = new FPCtx(can5, ctx5);

    ctx0.lineWidth = 1;
    ctx5.lineWidth = 1;

    var mouseP = {x:0, y:0};

    var scale = 1;
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
            boxTrans.push({ x : box[i].x + e.clientX - (can0.width  / 2) - rect.left - (scale *50),
                            y : box[i].y + e.clientY - (can0.height / 2) - rect.top  - (scale * 50)});
        }
        drawTo0(boxTrans);
        drawTo5(boxTrans);
    })

    can0.addEventListener('mousedown', function(e) {
        scale %= 6;
        scale++;
        box = Box(scale);
        drawTo0(box);
        drawTo5(box);
    })
            
    function drawTo0(pts) {
        ctx0.clearRect(-can0.width / 2, -can0.height / 2, can0.width, can0.height);
                
        ctx0.strokeStyle = '#22F';
        ctx0.moveTo(pts[0].x, pts[0].y);
        ctx0.beginPath();
        for(var i = 0; i < pts.length; i++) {
            ctx0.lineTo(pts[i].x, pts[i].y);
        }
        ctx0.stroke();
    }

    function drawTo5(pts) {
        ctx5.clearRect(-can5.width / 2, -can5.height / 2, can5.width, can5.height);
        
        ctx5.strokeStyle = '#F22';
        fpCtx.moveTo(pts[0].x, pts[0].y);
        ctx5.beginPath();
        for(var i = 0; i < pts.length; i++) {
            fpCtx.lineTo(pts[i].x, pts[i].y);
        }
        ctx5.stroke();
    }
};

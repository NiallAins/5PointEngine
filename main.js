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

    ctx0.strokeStyle = '#A22';
    ctx5.strokeStyle = '#22A';
    ctx0.lineWidth = 2;
    ctx5.lineWidth = 2;

    var scale = 1;
    var box = Box(scale);

    drawTo0(box);
    drawTo5(box);

    function Box(scale) {
        var arr = []; 
        for(var i = 0; i < 10*scale; i++) {
            if (i % 2 == 0) {
                for(var j = 0; j < 10*scale; j++) {
                    arr.push({x : i * 10, y : j * 10});
                }
            }
            else {
                for(var j = (10*scale) - 1; j >= 0; j--) {
                    arr.push({x : i * 10, y : j * 10});
                }
            }
        }
        for(var i = 0; i < 10*scale; i++) {
            if (i % 2 == 0) {
                for(var j = (10*scale) - 1; j >= 0; j--) {
                    arr.push({x : j * 10, y : i * 10});
                }
            }
            else {
                for(var j = 0; j < 10*scale; j++) {
                    arr.push({x : j * 10, y : i * 10});
                }
            }
        }
        return arr;
    }

    can0.addEventListener('mousemove', function(e) {
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
        var r = can5.width / 2;

        var scaleX = p.x / r;
        var scaleY = p.y / r;

        var newX = p.x * Math.sqrt(1 - (scaleY * scaleY));
        var newY = p.y * Math.sqrt(1 - (scaleX * scaleX));

        return {x : newX, y: newY};
    };

    function drawTo0(pts) {
        ctx0.clearRect(-can0.width / 2, -can0.height / 2, can0.width, can0.height);
                
        ctx0.beginPath();
            ctx0.moveTo(pts[0].x, pts[0].y);
            for(var i = 0; i < pts.length; i++) {
                ctx0.lineTo(pts[i].x, pts[i].y);
            }
        ctx0.stroke();
    };

    function drawTo5(pts) {
        ctx5.clearRect(-can5.width / 2, -can5.height / 2, can5.width, can5.height);
                
        ctx5.beginPath();
            var pt = to5pp(pts[0]);
            ctx5.moveTo(pt.x, pt.y);
            for(var i = 0; i < pts.length; i++) {
                pt = to5pp(pts[i]);
                ctx5.lineTo(pt.x, pt.y);
            }
            var pt = to5pp(pts[0]);
        ctx5.stroke();   
    };
};
importScripts("../Basics.js");
importScripts("../visual/Matrix2x2_Mod.js");
importScripts("../visual/Vector2.js");
importScripts("../visual/Polygon.js");
// importScripts("../visual/Sprites.js");
importScripts("../visual/canvasTGT.js");

var canvas,ctx;

onmessage=function(e){
    if(e.data.canvas){
        canvas=e.data.canvas;
        ctx=canvas.getContext("2d");
    }
    console.log(ctx);
    ctx.fillStyle="#f00"
    ctx.fillRect(0,0,100,100);
    var tp=new Polygon();
    tp.pushNodes([
        {x:1,y:2},
        {x:1,y:2},
        {x:1,y:2},
        {x:1,y:2},
        {x:1,y:2},
        {x:1,y:2}
    ])
    postMessage({p:tp});
}
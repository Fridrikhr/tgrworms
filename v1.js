var gl;


var maxNumCircles = 100; //taka?
var numCirclePoints = 20; //betri hringur
var numCirclePoints2 = numCirclePoints + 2; //fyrir render
var radius = 0.05; 
var index = 0;
var points = []; 

//Friðrik var declerations



window.onload = function init() { 

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumCircles*numCirclePoints2, gl.DYNAMIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

     render();

    function spawner() {

        index = 0; // taka út til að hafa fleiri hringi
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);

        // Calculate coordinates of new point
        var randx = (Math.random()*2)-1;
        var randy = (Math.random()*2)-1;
        var t = vec2(randx, randy);    

        // worm size increase
        var wormRad = 0.05;

        // Fill points array with vertices for a new worms
         // needed as a function for setInterval
        function inner() {

            wormRad *= 2;
            points =[];
            createCirclePoints(t, wormRad, numCirclePoints);
        
            // Add new circle behind the others, memory management
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index*numCirclePoints2, flatten(points));
            index++;
            
        }

        for(let i=0; i<3; i++) {
            setTimeout(function () {
            inner();
            }, 1000);
        }
        
    };

    setInterval(function () {
        spawner();
    }, 3000);

};

// Create the points of the circle
function createCirclePoints( cent, rad, k )
{
    points.push( cent );

    var dAngle = 2*Math.PI/k;
    for( i=k; i>=0; i-- ) {
    	a = i*dAngle;
    	var p = vec2( rad*Math.sin(a) + cent[0], rad*Math.cos(a) + cent[1] );
    	points.push(p);
    }
}




function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Teiknum alla hringina (þurfum mörg köll á drawArrays ef við notum TRIANGLE_FAN)
    for (i=0; i<index; i++) {
        gl.drawArrays( gl.TRIANGLE_FAN, i*numCirclePoints2, numCirclePoints2 );
    }
    window.requestAnimFrame(render);
}

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Fridrikhr/tgrworms.git
git push -u origin main
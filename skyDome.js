function SkyDome()
{
	this.sky_prgm = null;
	this.fullscreenQuad = new Mesh();
	this.skyGradient_tx2D = null;
}

SkyDome.prototype.createResources = function()
{
	// Load shader program for debugging
    var	vShader = loadShader(gl.VERTEX_SHADER,"./shaders/sky_v.glsl");
	var fShader = loadShader(gl.FRAGMENT_SHADER,"./shaders/sky_f.glsl");
	
	this.sky_prgm = gl.createProgram();
	    
	gl.attachShader(this.sky_prgm, vShader);
	gl.attachShader(this.sky_prgm, fShader);
		
	gl.bindAttribLocation(this.sky_prgm, 0, "v_position");
	gl.bindAttribLocation(this.sky_prgm, 1, "v_uv");
				
	gl.linkProgram(this.sky_prgm);
		
	if (!gl.getProgramParameter(this.sky_prgm, gl.LINK_STATUS))
	{
    	alert("Could not initialise shaders");
    }
	
	// Create fullscreen quad
	var vertices = [-1.0,-1.0,0.0,-1.0,-1.0,
					-1.0,1.0,0.0,-1.0,1.0,
					1.0,-1.0,0.0,1.0,-1.0,
					1.0,1.0,0.0,1.0,1.0];
	var indices = [0,1,2,1,3,2];
	
	this.fullscreenQuad.bufferDataFromArray(vertices,indices,gl.TRIANGLES);
}

SkyDome.prototype.render=function(camera)
{
	gl.useProgram(this.sky_prgm);
	
	// get camera vectors, pack into matrix and upload to shader
	var front_vector = camera.getFrontVector();
	var right_vector = camera.getRightVector();
	var up_vector = camera.getUpVector();
	
	//TODO scale up and right vector to match virtual image plane size
	
	var camera_vectors = mat3.create();
	camera_vectors = [front_vector[0], front_vector[1], front_vector[2],
						up_vector[0], up_vector[1], up_vector[2],
						right_vector[0], right_vector[1], right_vector[2]];
	
	gl.uniformMatrix3fv(gl.getUniformLocation(this.sky_prgm, "camera_vectors"),false,camera_vectors);
	
	this.fullscreenQuad.setVertexAttribPointer(0,3,gl.FLOAT,false,5*4,0);
	this.fullscreenQuad.setVertexAttribPointer(1,2,gl.FLOAT,false,5*4,3*4);
	this.fullscreenQuad.draw();
}
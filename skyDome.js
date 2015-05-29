function SkyDome()
{
	this.sky_prgm = null;
	this.fullscreenQuad = new Mesh();
	this.skyGradient_tx2D = new Texture2D("sky",gl.RGBA,10,3,gl.RGBA,gl.UNSIGNED_BYTE,null);
	
	//TODO remove from here
	this.tod = 0.0;
}

SkyDome.prototype.createResources = function()
{
	// Load sky base texture
	loadTextureFromImageFile(this.skyGradient_tx2D,"resources/sky.png");
	
	// Load shader program for sky
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
	
	// scale up- and right-vector to match virtual image plane size
	var aspect_ratio = camera.aspect_ratio;
	
	var up_scaling = Math.tan( camera.fov / 2.0);
	var right_scaling = up_scaling * aspect_ratio;
	
	up_vector[0] = up_vector[0]*up_scaling;
	up_vector[1] = up_vector[1]*up_scaling;
	up_vector[2] = up_vector[2]*up_scaling;
	right_vector[0] = right_vector[0]*right_scaling;
	right_vector[1] = right_vector[1]*right_scaling;
	right_vector[2] = right_vector[2]*right_scaling;
	
	var camera_vectors = mat3.create();
	camera_vectors = [front_vector[0], front_vector[1], front_vector[2],
						up_vector[0], up_vector[1], up_vector[2],
						right_vector[0], right_vector[1], right_vector[2]];
	
	gl.uniformMatrix3fv(gl.getUniformLocation(this.sky_prgm, "camera_vectors"),false,camera_vectors);
	
	gl.uniform1f(gl.getUniformLocation(this.sky_prgm, "time_of_day"),this.tod);
	this.tod += 0.005;
	if(this.tod > 24.0)
		this.tod = 0.0;
		
		
	gl.activeTexture(gl.TEXTURE0);
	this.skyGradient_tx2D.bindTexture();
	gl.uniform1i(gl.getUniformLocation(this.sky_prgm, "sky_tx2D"),0);
	
	this.fullscreenQuad.setVertexAttribPointer(0,3,gl.FLOAT,false,5*4,0);
	this.fullscreenQuad.setVertexAttribPointer(1,2,gl.FLOAT,false,5*4,3*4);
	this.fullscreenQuad.draw();
}
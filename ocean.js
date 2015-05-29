function Ocean()
{
	this.oceanSurface_prgm = null;
	this.oceanSurface_mesh = new Mesh();
	//TODO find working single channel texture format
	//this.ocean_heighmap = new Texture2D("ocean_heightmap",gl.LUMINANCE,1,1,gl.LUMINANCE,gl.FLOAT,null);
}

Ocean.prototype.createResources = function()
{
	// Load shader for ocean surface
	var vShader = loadShader(gl.VERTEX_SHADER,"./shaders/ocean_v.glsl");
	var fShader = loadShader(gl.FRAGMENT_SHADER,"./shaders/ocean_f.glsl");
	
	this.oceanSurface_prgm = gl.createProgram();
	
	gl.attachShader(this.oceanSurface_prgm, vShader);
	gl.attachShader(this.oceanSurface_prgm, fShader);
	
	gl.bindAttribLocation(this.oceanSurface_prgm, 0, "v_position");
	gl.bindAttribLocation(this.oceanSurface_prgm, 1, "v_uv");
	
	gl.linkProgram(this.oceanSurface_prgm);
	
	if (!gl.getProgramParameter(this.oceanSurface_prgm, gl.LINK_STATUS))
	{
    	alert("Could not initialise shaders");
    }
	
	// Create base quad
	var vertices = [-100.0,-1.0,-100.0,-1.0,-1.0,
					-100.0,-1.0,100.0,-1.0,1.0,
					100.0,-1.0,-100.0,1.0,-1.0,
					100.0,-1.0,100.0,1.0,1.0];
	var indices = [0,1,2,1,3,2];
	
	this.oceanSurface_mesh.bufferDataFromArray(vertices,indices,gl.TRIANGLES);
}

Ocean.prototype.render = function(camera)
{

	var view_matrix = mat4.create();
	var projection_matrix = mat4.create();	
	
	camera.computeViewMatrix(view_matrix);
	camera.computeProjectionMatrix(projection_matrix);
	
	gl.useProgram(this.oceanSurface_prgm);
	
	gl.uniformMatrix4fv(gl.getUniformLocation(this.oceanSurface_prgm, "view_matrix"),false,view_matrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(this.oceanSurface_prgm, "projection_matrix"),false,projection_matrix);
	
	this.oceanSurface_mesh.setVertexAttribPointer(0,3,gl.FLOAT,false,5*4,0);
	this.oceanSurface_mesh.setVertexAttribPointer(1,2,gl.FLOAT,false,5*4,3*4);
	this.oceanSurface_mesh.draw();
}
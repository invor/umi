// Javascript prototype for simple heightmapping terrain

function Terrain(sizeX, sizeY, subdivX, subdivY)
{
	this.size = { x:sizeX, y:sizeY};
	this.subdivs = { x:subdivX, y:subdivY};
	
	this.terrain_prgm = null;
	this.terrain_baseMesh = new Mesh();
	this.terrain_heightmap = new Texture2D("heightmap",gl.RGB,512,512,gl.RGB,gl.UNSIGNED_BYTE,null);
	this.terrain_albedo_tx2D = new Texture2D("heightmap_albedo",gl.RGB,512,512,gl.RGB,gl.UNSIGNED_BYTE,null);
}

Terrain.prototype.createResources=function()
{
	// Load heightmap texture
	loadTextureFromImageFile(this.terrain_heightmap,"resources/terrain_heightmap.png");
	loadTextureFromImageFile(this.terrain_albedo_tx2D,"resources/terrain_diffuse_albedo.png");
	
	// Load shader program
	//TODO load correct program
	var vShader = loadShader(gl.VERTEX_SHADER,"./shaders/terrain_v.glsl");
	var fShader = loadShader(gl.FRAGMENT_SHADER,"./shaders/terrain_f.glsl");
	
	this.terrain_prgm = gl.createProgram();
	
	gl.attachShader(this.terrain_prgm, vShader);
	gl.attachShader(this.terrain_prgm, fShader);
	
	gl.bindAttribLocation(this.terrain_prgm, 0, "v_position");
	gl.bindAttribLocation(this.terrain_prgm, 1, "v_uv");
	
	gl.linkProgram(this.terrain_prgm);
	
	if (!gl.getProgramParameter(this.terrain_prgm, gl.LINK_STATUS))
	{
    	alert("Could not initialise shaders");
    }
	
	// Create base mesh
	
	var vertices = [];
	var indices = [];
	
	// compute vertices
	
	var offsetX = - (this.size.x/2.0);
	var offsetY = - (this.size.y/2.0);
	var patchSizeX = this.size.x/this.subdivs.x;
	var patchSizeY = this.size.y/this.subdivs.y;
	
	for (var i = 0.0; i <= this.subdivs.y; i++)
	{
		for(var j = 0.0; j <= this.subdivs.x; j++)
		{
			vertices.push(offsetX + j*patchSizeX); //x
			vertices.push(0.0); //y
			vertices.push(offsetY + i*patchSizeY); //z
			vertices.push(j/this.subdivs.x); //u
			vertices.push(i/this.subdivs.y); //v
		}
	}
	
	// compute index array
	
	/*
	patch layout:
	
	n---ne
	|   |
	c---e
	
	*/
	
	var n = this.subdivs.x + 1;
	var ne = this.subdivs.x + 2;
	var e = 1;
	
	for (var i = 0; i < this.subdivs.y; i++)
	{
		for(var j = 0; j < this.subdivs.x; j++)
		{
			var c = j + i*(this.subdivs.x+1);
			
			// add indices for one patch
			indices.push(c);
			indices.push(c+n);
			indices.push(c+e);
			indices.push(c+n);
			indices.push(c+ne);
			indices.push(c+e);
		}
	}
	
	this.terrain_baseMesh.bufferDataFromArray(vertices,indices,gl.TRIANGLES);
}

Terrain.prototype.render=function(camera)
{
	var view_matrix = mat4.create();
	var projection_matrix = mat4.create();	
	
	camera.computeViewMatrix(view_matrix);
	camera.computeProjectionMatrix(projection_matrix);
	
	gl.useProgram(this.terrain_prgm);
	
	gl.uniformMatrix4fv(gl.getUniformLocation(this.terrain_prgm, "view_matrix"),false,view_matrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(this.terrain_prgm, "projection_matrix"),false,projection_matrix);
	
	gl.activeTexture(gl.TEXTURE0);
	this.terrain_heightmap.bindTexture();
	gl.uniform1i(gl.getUniformLocation(this.terrain_prgm, "heightmap_tx2D"),0);
	gl.activeTexture(gl.TEXTURE1);
	this.terrain_albedo_tx2D.bindTexture();
	gl.uniform1i(gl.getUniformLocation(this.terrain_prgm, "diffuse_albedo_tx2D"),1);
	
	this.terrain_baseMesh.setVertexAttribPointer(0,3,gl.FLOAT,false,5*4,0);
	this.terrain_baseMesh.setVertexAttribPointer(1,2,gl.FLOAT,false,5*4,3*4);
	this.terrain_baseMesh.draw();
}
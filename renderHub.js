// 'Hub' object for rendering

function getGLContext( canvas){
   var  gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
     throw ("The time is out of joint!");
	 return null;
    }
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
	return gl;
}

function RenderHub(window_width,window_height)
{
	this.window_width = window_width;
	this.window_height = window_height;
	
	var neutralRotation = quat.create();
	var startPosition = vec3.create();
	startPosition = [0.0,0.0,2.0];
	this.camera = new Camera(startPosition,neutralRotation,16.0/9.0,60.0*(9.0/16.0));
	
	this.sky = new SkyDome();
	this.ocean = new Ocean();
	
	// terrain debugging
	this.terrain = new Terrain(50.0,50.0,512,512);
	
	// for debugging
	this.debug_prgm = null;
	this.debug_mesh = new Mesh();
	this.debug_sphere = new Mesh();
}

RenderHub.prototype.loadScene=function()
{
	this.sky.createResources();
	this.ocean.createResources();
	this.terrain.createResources();
}

RenderHub.prototype.createDebugResources=function()
{
	// Load shader program for debugging
    var	vShader = loadShader(gl.VERTEX_SHADER,"./shaders/debug_v.glsl");
	var fShader = loadShader(gl.FRAGMENT_SHADER,"./shaders/debug_f.glsl");
	
	this.debug_prgm = gl.createProgram();
	    
	gl.attachShader(this.debug_prgm, vShader);
	gl.attachShader(this.debug_prgm, fShader);
		
	gl.bindAttribLocation(this.debug_prgm, 0, "v_position");
				
	gl.linkProgram(this.debug_prgm);
		
	if (!gl.getProgramParameter(this.debug_prgm, gl.LINK_STATUS))
	{
    	alert("Could not initialise shaders");
    }
	
	// Create debug mesh
	var debug_vertices = [];
	var debug_indices = [];
	
	debug_vertices.push(-1.0);debug_vertices.push(-1.0);debug_vertices.push(0.0);
	debug_vertices.push(0.0);debug_vertices.push(1.0);debug_vertices.push(0.0);
	debug_vertices.push(1.0);debug_vertices.push(-1.0);debug_vertices.push(0.0);
	
	debug_indices.push(0);debug_indices.push(1);
	debug_indices.push(1);debug_indices.push(2);
	debug_indices.push(0);debug_indices.push(2);
	
	this.debug_mesh.bufferDataFromArray(debug_vertices,debug_indices,gl.LINES);
}

RenderHub.prototype.renderDebug=function()
{
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.viewport(0,0,canvas.width,canvas.height);
	
	var view_matrix = mat4.create();
	var projection_matrix = mat4.create();
	
	this.camera.computeViewMatrix(view_matrix);
	this.camera.computeProjectionMatrix(projection_matrix);
	
	gl.useProgram(this.debug_prgm);
	
	gl.uniformMatrix4fv(gl.getUniformLocation(this.debug_prgm, "view_matrix"),false,view_matrix);
	gl.uniformMatrix4fv(gl.getUniformLocation(this.debug_prgm, "projection_matrix"),false,projection_matrix);
	
	this.debug_mesh.setVertexAttribPointer(0,3,gl.FLOAT,false,3*4,0);
	this.debug_mesh.draw();
}

RenderHub.prototype.renderSky=function()
{
	//TODO render to special sky framebuffer and merge in postprocessing?
	
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	gl.viewport(0,0,canvas.width,canvas.height);
	
	this.sky.render(this.camera);
}

RenderHub.prototype.renderOcean=function()
{
	//TODO render to special ocean framebuffer and merge in postprocessing?
	this.ocean.render(this.camera);
}

RenderHub.prototype.renderTerrain=function()
{
	gl.clear(gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	
	this.terrain.render(this.camera);
}

RenderHub.prototype.render = function()
{
	this.renderSky();
	//this.renderOcean();
	this.renderTerrain();
	
	//this.renderDebug();
}

/*
RenderHub.prototype.run=function()
{
	var self = this;
	(function updateFrame(){
		requestAnimFrame(updateFrame);
		//TODO call render methods
		//self.renderDebug();
		self.renderSky();
	})();
}
*/
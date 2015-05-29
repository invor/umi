// OpenGL GLSLProgram prototype

function GLSLProgram()
{
	this.handle = gl.createProgram();
}

GLSLProgram.prototype.use()
{
	gl.useProgram(this.handle);
}
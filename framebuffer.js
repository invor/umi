// OpenGL framebuffer prototype
// Authored by Michael Becher
// Last edit 22.03.2015

function Framebuffer(width, height)
{
	this.handle = gl.createFramebuffer();
	
	this.width = width;
	this.height = height;
	
	this.color_attachments = [];
	this.depth_buffer = null;
}

// Apperently, gl.RGB or gl.FLOAT are currently not allowed for (internal-)format
// internalFormat e.g. gl.RGBA
// format e.g. gl.RGBA
// type e.g. gl.FLOAT
Framebuffer.prototype.addColorAttachment = function(internalFormat,format,type)
{
	var handle = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, handle);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, this.width, this.height, 0, format, type, null);
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.handle);
	var attach_point = this.color_attachments.length;
	gl.framebufferTexture2D(gl.FRAMEBUFFER, drawbuffersExt.COLOR_ATTACHMENT0_WEBGL + attach_point, gl.TEXTURE_2D, handle, 0);
	
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
	{
		console.log("Framebuffer incomplete after adding color attachment "+attach_point+".");
		return;
	}
	
	this.color_attachments.push(handle);
}

Framebuffer.prototype.addDepthBuffer = function()
{
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.handle);
	
	this.depth_buffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.depth_buffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
	
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depth_buffer);
	
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
	{
		console.log("Framebuffer incomplete after adding depth attachment.");
		return;
	}
}

Framebuffer.prototype.bind = function()
{
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.handle);
}

Framebuffer.prototype.getColorAttachment = function(index)
{
	if(index >= this.color_attachments.length)
		return;
	
	return this.color_attachments[index];
}
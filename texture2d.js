// OpenGL texture prototype

function Texture2D(name, internal_format, width, height, format, type, data)
{
	this.handle = gl.createTexture();
	this.internal_format = internal_format;
	this.width = width;
	this.height = height;
	this.format = format;
	this.type = type;
	
	gl.bindTexture(gl.TEXTURE_2D, this.handle);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D,
						0,
						this.internal_format,
						this.width,
						this.height,
						0,
						this.format,
						this.type,
						data);
	
	//gl.bindTexture(gl.TEXTURE_2D,0);
}

Texture2D.prototype.bindTexture = function()
{
	gl.bindTexture(gl.TEXTURE_2D, this.handle);
}

Texture2D.prototype.texParameteri = function(pname, param)
{
	gl.bindTexture(gl.TEXTURE_2D, this.handle);
	gl.texParameteri(gl.TEXTURE_2D, pname, param);
	//gl.bindTexture(gl.TEXTURE_2D, 0);
}

Texture2D.prototype.reload = function(width, height, data)
{
	gl.bindTexture(gl.TEXTURE_2D, this.handle);
	gl.texImage2D(gl.TEXTURE_2D, 0, this.internal_format, this.width, this.height, 0, this.format, this.type, data);
	//gl.bindTexture(gl.TEXTURE_2D, 0);
}

Texture2D.prototype.loadImage = function(image)
{
	console.log("Loaded image "+image.src+" to texture.");
	gl.bindTexture(gl.TEXTURE_2D, this.handle);
	// Flip the image's Y axis to match the WebGL texture coordinate space.
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, this.internal_format, this.format, this.type, image);
}




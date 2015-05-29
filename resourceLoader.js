getShaderSource = function(path)
{
	var request = new XMLHttpRequest();
	
	request.overrideMimeType('text/plain');
	
	request.open("GET", path, false);
	request.send(null);
	
	return request.response;
}

loadShader = function(type, path)
{
	var shader = gl.createShader(type);
	var str = this.getShaderSource(path);
	
	if(str == null)
	{
		alert("Error");
		return null;
	}

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

loadTextureFromImageFile = function(texture, path)
{
	var img = new Image();
	img.onload = function () { texture.loadImage(img); }
	img.src = path;
}
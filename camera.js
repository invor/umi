// Basic camera

function Camera(position,orientation,aspect_ratio,fov)
{
	this.position = position;
	this.orientation = orientation;
	
	translation = mat4.create();
	rotation = mat4.create();
	this.transformation = mat4.create();
	
	mat4.translate(translation,translation,position);
	mat4.fromQuat(rotation,orientation);
	mat4.multiply(this.transformation,translation,rotation);
	
	this.aspect_ratio = aspect_ratio;
	this.fov = fov;
}

Camera.prototype.translate = function(tVec)
{
	this.position = this.position + tVec;
	mat4.translate(this.transformation,this.transformation,tVec);
}

Camera.prototype.rotate = function (angle, axis)
{
	var tmp = quat.create();
	quat.setAxisAngle(tmp, axis, angle) 
	quat.multiply(this.orientation,this.orientation,tmp);
	
	mat4.rotate(this.transformation,this.transformation,angle,axis);
}

Camera.prototype.computeViewMatrix = function(view_matrix)
{
	mat4.identity(view_matrix);
	mat4.invert(view_matrix,this.transformation);
}

Camera.prototype.computeProjectionMatrix = function(projection_matrix)
{
	mat4.perspective(projection_matrix,this.fov,this.aspect_ratio,0.00001,10.0);
}

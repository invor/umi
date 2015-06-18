// Basic camera

function Camera(position,orientation,aspect_ratio,fov)
{
	this.position = position;
	this.orientation = orientation;
	
	var translation = mat4.create();
	var rotation = mat4.create();
	
	this.aspect_ratio = aspect_ratio;
	//convert to radians for internal calculations
	this.fov = (fov * Math.PI)/180.0;
	this.near = 0.001;
	this.far = 1000.0;
}

Camera.prototype.translate = function(tVec)
{
	vec3.add(this.position,this.position,tVec);
}

/**
 * Rotate camera
 * @param {float} angle Rotation angle given in radian
 * @param {vec3} axis Rotation axis given in world coordinates
 */
Camera.prototype.rotate = function (angle, axis)
{	
	var tmp = quat.create();
	quat.setAxisAngle(tmp, axis, angle) 
	quat.multiply(this.orientation,tmp,this.orientation);
}

Camera.prototype.getFrontVector = function()
{
	var front_vector = vec3.create();
	front_vector = [0.0,0.0,-1.0];
	
	vec3.transformQuat(front_vector,front_vector,this.orientation);
	
	return front_vector;
}

Camera.prototype.getUpVector = function()
{
	var up_vector = vec3.create();
	up_vector = [0.0,1.0,0.0];
	
	vec3.transformQuat(up_vector,up_vector,this.orientation);
	
	return up_vector;
}

Camera.prototype.getRightVector = function()
{
	var right_vector = vec3.create();
	right_vector = [1.0,0.0,0.0];
	
	vec3.transformQuat(right_vector,right_vector,this.orientation);
	
	return right_vector;
}

Camera.prototype.computeViewMatrix = function(view_matrix)
{
	mat4.identity(view_matrix);
	mat4.fromRotationTranslation(view_matrix, this.orientation, this.position);
	mat4.invert(view_matrix,view_matrix);
}

Camera.prototype.computeProjectionMatrix = function(projection_matrix)
{
	mat4.perspective(projection_matrix,this.fov,this.aspect_ratio,this.near,this.far);
}

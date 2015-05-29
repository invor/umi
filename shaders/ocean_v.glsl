precision highp float;

uniform mat4 view_matrix;
uniform mat4 projection_matrix;

attribute vec3 v_position;
attribute vec2 v_uv;

varying vec2 uv;

void main()
{
	uv = v_uv;
	gl_Position = projection_matrix * view_matrix * vec4(v_position,1.0);
}
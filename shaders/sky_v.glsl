precision highp float;

attribute vec3 v_position;
attribute vec2 v_uv;

varying vec2 uv;

void main()
{
	uv = v_uv;
	gl_Position = vec4(v_position,1.0);
}
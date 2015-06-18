precision highp float;

uniform mat4 view_matrix;
uniform mat4 projection_matrix;

uniform sampler2D heightmap_tx2D;

attribute vec3 v_position;
attribute vec2 v_uv;

varying vec2 uv;

void main()
{
	uv = v_uv;
	
	vec3 elevated_position = v_position + vec3(0.0,texture2D(heightmap_tx2D,uv).x*10.0,0.0);
	
	gl_Position = projection_matrix * view_matrix * vec4(elevated_position,1.0);
}
precision highp float;

uniform sampler2D diffuse_albedo_tx2D;

varying vec2 uv;

void main()
{
	vec3 diffuse_albedo = texture2D(diffuse_albedo_tx2D,uv).xyz;
	
	gl_FragColor = vec4(0.2,0.2,0.2,1.0);
	
	gl_FragColor = vec4(diffuse_albedo,1.0);
}
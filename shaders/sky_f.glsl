precision highp float;

uniform mat3 camera_vectors;
uniform float time_of_day;

uniform sampler2D sky_tx2D;

varying vec2 uv;

float square(in float base)
{
	return base*base;
}

// Intersect sky dome which is always centered on the camera, i.e. camera position
// relative to sky dome is always (0,0,0)
vec2 getSkyDomeAngles(in vec3 direction)
{
	// cover special case of direction = 0
	vec3 ground_vector = normalize(vec3(direction.x,0.0,direction.z));
	
	float phi = dot(direction,ground_vector);
	float sigma = dot(ground_vector,vec3(0.0,0.0,1.0));
	
	return vec2(sigma, phi);
}

vec4 computeSkyColor(in float view_phi, in float time_of_day)
{
	return vec4(0.0);
}

vec4 computeSunHalo(in float view_sigma, in float view_phi, in float sun_sigma, in float sun_phi)
{
	return vec4(0.0);
}

void main()
{
	// Compute view ray for each fragment
	// front + uv.y*up + uv.x*right
	vec3 direction = normalize(camera_vectors[0] + camera_vectors[1]*uv.y + camera_vectors[2]*uv.x);
	
	if(direction.y < 0.0)
	{
		gl_FragColor = vec4(0.0,0.0,0.0,1.0);
		return;
	}
	
	// Compute angles of sky dome sphere parameterisation
	vec2 angles = getSkyDomeAngles(direction);
	
	vec3 outColor = mix(vec3(0.6,0.6,0.8),vec3(0.2,0.2,0.6),1.0-pow(angles.y,2.0));
	
	// Compute sun postion from time of day
	
	// Compute sky color
	

	gl_FragColor = vec4(outColor,1.0);
	
	//gl_FragColor = vec4(angles.y,0.0,0.0,1.0);
}
precision highp float;

uniform mat3 camera_vectors;
uniform float time_of_day;

uniform sampler2D sky_tx2D;

varying vec2 uv;

#define PI 3.1425926535

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
	
	float phi = acos(dot(direction,ground_vector));
	
	float sigma = dot(ground_vector,vec3(0.0,0.0,1.0));
	if( dot(ground_vector,vec3(1.0,0.0,0.0)) < 0.0 )
	{
		sigma = acos(-1.0 * sigma) + acos(-1.0);
	}
	else
	{
		sigma = acos(sigma);
	}
	
	return vec2(sigma, phi);
}

vec4 computeSkyColor(in float view_phi, in float time_of_day)
{
	float scaled_phi = (1.0-exp(-abs(2.5*view_phi)));
	
	vec4 sky_color = texture2D(sky_tx2D, vec2(time_of_day/24.0,scaled_phi) );
	
	return sky_color;
	
	//vec3 sky_horizonColor = mix(vec3(0.8,0.4,0.1),vec3(0.6,0.6,1.0),min(1.0,time_of_day/12.0));
    //vec3 sky_Color = mix(vec3(0.1,0.1,0.3),vec3(0.2,0.2,0.7),min(1.0,time_of_day/12.0));
	//return vec4(mix(sky_horizonColor,sky_Color,pow(view_phi/acos(0.0),0.3)),1.0);
}

float computeSunHaloIntensity(in vec3 fragment_direction, in vec3 sun_direction)
{
	vec2 sun_angles = getSkyDomeAngles(sun_direction);
	vec2 fragment_angles = getSkyDomeAngles(fragment_direction);
	
	float sunHaloFactor = pow(1.0 - ( (dot(sun_direction,fragment_direction)*0.5) + 0.5),0.7);
    float sunHaloPoly = (1.0 - pow(sunHaloFactor,0.15+(sun_angles.y)*0.2)) * (1.0 - fragment_angles.y/acos(0.0));
    float sunHaloExp = exp(-pow(sunHaloFactor,2.0)/(2.0*pow(0.02,3.0)));
	
	return mix(sunHaloPoly,sunHaloExp,pow((sun_angles.y/acos(0.0)),0.6));
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
	
	// Compute sun postion from time of day
	vec3 sun_direction = normalize(vec3(0.0,
										sin( (time_of_day/24.0)*2.0*PI - (PI/2.0)),
										cos( (time_of_day/24.0)*2.0*PI - (3.0*PI/2.0))));
	vec3 sun_color = vec3(1.0,1.0,0.3);
	vec3 sun_disc = sun_color * ( dot(sun_direction,direction) < 0.9995 ? 0.0 : 1.0);
	float sun_halo_intensity = computeSunHaloIntensity(direction,sun_direction);
	vec3 sun_halo = sun_color * sun_halo_intensity;
	
	// Compute sky color
	vec3 sky_color = computeSkyColor(angles.y,time_of_day).xyz;
	
	vec3 outColor = sky_color + sun_disc + sun_halo;

	gl_FragColor = vec4(outColor,1.0);
	
	gl_FragColor = vec4(sun_halo+sky_color,1.0);
	
	//gl_FragColor = texture2D(sky_tx2D,uv);
}
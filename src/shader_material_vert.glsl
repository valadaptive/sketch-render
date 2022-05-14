in vec4 POSITION;
in vec4 NORMAL;
in vec2 TEXCOORD_0;

uniform mat4 u_projMatrix;
uniform mat4 u_objMatrix;
uniform mat3 u_normalMatrix;
uniform float u_fcoef;
uniform float u_time;
uniform vec4 u_color;

out vec3 v_normal;
out vec3 v_position;
out vec2 v_texcoord;

const float NOISE_SCALE = 2.0;
const float NOISE_AMOUNT = 0.01;
const float TIME_ROUND = 0.25;

float roundTo(float n, float increment) {
    return floor(n / increment) * increment;
}

void main () {
    v_normal = normalize(u_normalMatrix * NORMAL.xyz);
    vec3 world_pos = (u_objMatrix * POSITION).xyz;
    vec3 noise = vec3(
        snoise(vec4(world_pos.xyz * NOISE_SCALE, 10.0 * roundTo(u_time, TIME_ROUND))) * NOISE_AMOUNT,
        snoise(vec4(world_pos.xyz * NOISE_SCALE, 10.0 * roundTo(u_time + 10.0, TIME_ROUND))) * NOISE_AMOUNT,
        snoise(vec4(world_pos.xyz * NOISE_SCALE, 10.0 * roundTo(u_time + 20.0, TIME_ROUND))) * NOISE_AMOUNT
    );
    vec3 noisy_pos = world_pos + noise;
    gl_Position = u_projMatrix * vec4(noisy_pos, 1.0);
    vec4 non_noisy_position = u_projMatrix * vec4(world_pos, 1.0);

    //gl_Position.z = log2(max(1e-6, 1.0 + gl_Position.w)) * u_fcoef - 1.0;
    // gl_Position.zw = non_noisy_position.zw;
    v_position = world_pos;
    v_texcoord = TEXCOORD_0;
}
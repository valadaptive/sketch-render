uniform vec4 u_color;
uniform bool u_flip;
uniform bool u_useTexture;
uniform sampler2D u_texture;

in vec3 v_normal;
in vec3 v_position;
in vec2 v_texcoord;

layout(location=0) out vec4 fragColor;
layout(location=1) out uvec4 mat_index;
layout(location=2) out vec4 out_normal;

const float GAMMA = 2.2;
const float GAMMA_INV = 1.0 / GAMMA;

void main () {
    vec3 normal = (gl_FrontFacing ^^ u_flip) ? v_normal : v_normal * vec3(-1.0);
    float lambert = dot(normal, normalize(vec3(1.0, 1.0, 1.0)));
    float mul = lambert > 0.0 ? 1.0 : 0.75;

    if (u_useTexture) {
        fragColor = texture(u_texture, v_texcoord) * vec4(vec3(mul), 1.0);
    } else {
        vec4 gammaCorrected = vec4(
            pow(u_color.x, GAMMA_INV),
            pow(u_color.y, GAMMA_INV),
            pow(u_color.z, GAMMA_INV),
            u_color.w
        );

        fragColor = gammaCorrected * vec4(vec3(mul), 1.0);
    }
    mat_index.r = (uint(floor(u_color.x * 255.0)) << 16) + (uint(floor(u_color.y * 255.0)) << 8) + uint(floor(u_color.z * 255.0));
    out_normal = vec4((normal * 0.5) + 0.5, 0.0);
}
uniform sampler2D u_texture;
uniform highp usampler2D u_matIndex;
uniform sampler2D u_normal;

in vec2 v_position;

out vec4 fragColor;

const int RADIUS = 4;
const int RADIUS_OFFSET = -RADIUS / 2;

bool mat_diff(ivec2 coord) {
    uint tl = texelFetch(u_matIndex, coord, 0).r;
    uint tr = texelFetch(u_matIndex, coord + ivec2(1, 0), 0).r;
    uint bl = texelFetch(u_matIndex, coord + ivec2(0, 1), 0).r;
    uint br = texelFetch(u_matIndex, coord + ivec2(1, 1), 0).r;

    return (tl != br) || (bl != tr);
}

bool z_diff(ivec2 coord) {
    float tl = texelFetch(u_normal, coord, 0).r;
    float tr = texelFetch(u_normal, coord + ivec2(1, 0), 0).r;
    float bl = texelFetch(u_normal, coord + ivec2(0, 1), 0).r;
    float br = texelFetch(u_normal, coord + ivec2(1, 1), 0).r;

    return abs(tl - br) + abs(bl - tr) > 0.05;
}

bool norm_diff(ivec2 coord) {
    vec3 tl = texelFetch(u_normal, coord, 0).xyz;
    vec3 tr = texelFetch(u_normal, coord + ivec2(1, 0), 0).xyz;
    vec3 bl = texelFetch(u_normal, coord + ivec2(0, 1), 0).xyz;
    vec3 br = texelFetch(u_normal, coord + ivec2(1, 1), 0).xyz;

    return max(
        acos(dot(tl, br) / (length(tl) * length(br))),
        acos(dot(tr, bl) / (length(tr) * length(bl)))
    ) > 0.35;
}

void main() {
    ivec2 tex_size = textureSize(u_texture, 0);
    ivec2 coord = ivec2(v_position * vec2(tex_size));
    fragColor = texelFetch(u_texture, coord, 0);
    bool anyEdge;
    for (int i = 0; i < RADIUS; i++) {
        for (int j = 0; j < RADIUS; j++) {
            anyEdge = anyEdge ||
                mat_diff(coord + ivec2(i + RADIUS_OFFSET, j + RADIUS_OFFSET)) ||
                norm_diff(coord + ivec2(i + RADIUS_OFFSET, j + RADIUS_OFFSET));
        }
    }
    if (anyEdge) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
    //fragColor = vec4(texelFetch(u_normal, coord, 0).xyz, 1.0);
    // fragColor = vec4(vec3(norm_diff(coord)), 1.0);

    // fragColor = vec4(vec3(texelFetch(u_normal, coord, 0).r * 0.1), 1.0);
}
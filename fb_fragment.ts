const fb_fragment = /* glsl */ `
uniform vec2 u_resolution;
uniform sampler2D u_in_buffer;
uniform sampler2D u_init_buffer;
uniform float u_time;

void main() {
  // vec2 uv = gl_FragCoord.xy / u_resolution;

    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 uv = st;
    uv *= vec2(1. + 0.02 * sin(u_time / 10.), 1. - 0.02 * cos(u_time/2.));

    vec4 sum = texture2D(u_in_buffer, uv);
    vec4 src = texture2D(u_init_buffer, st);
    sum.rgb = mix(sum.rbg, src.rgb, 0.2);
    gl_FragColor = sum;
}
`;

export default fb_fragment;
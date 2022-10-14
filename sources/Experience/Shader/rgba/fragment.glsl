uniform sampler2D tDiffuse;
uniform float uProgress;

varying vec2 vUv;

void main() {
  vec2 p = vUv;

  vec4 cr = texture2D( tDiffuse, p + uProgress * vec2(0.1, 0.0));
  vec4 cg = texture2D( tDiffuse, p);
  vec4 cb = texture2D( tDiffuse, p - uProgress * vec2(0.1, 0.0));

  gl_FragColor = vec4(cr.r, cg.g, cb.b, 1.0);
}
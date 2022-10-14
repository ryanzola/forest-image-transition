uniform vec2 center;
uniform float angle;
uniform float scale;
uniform vec2 tSize;
uniform float uProgress;
uniform float uProgress1;

uniform sampler2D tDiffuse;

varying vec2 vUv;

float pattern() {

  float s = sin( angle ), c = cos( angle );

  vec2 tex = vUv * tSize - center;
  vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

  return ( sin( point.x ) * sin( point.y ) ) * 4.0;

}

void main() {
  vec2 p = vUv;
  // p += 0.1*sin(10.0*vUv.x);

  if(p.x < 0.25) {
    
  }
  else if(p.x < 0.5) {
    p.x = p.x - 0.25 * uProgress;
  }
  else if(p.x < 0.75) {
    p.x = p.x - 0.35 * uProgress;
  }
  else {
    p.x = p.x - 0.65 * uProgress;
  }

  vec4 color = texture2D( tDiffuse, p );

  gl_FragColor = color;
}
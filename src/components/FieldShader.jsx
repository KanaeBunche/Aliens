import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";

const vertex = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;

  float hash(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i),                 b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for(int i = 0; i < 6; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    uv.x *= uRes.x / uRes.y;
    float t = uTime * 0.06;
    vec2 p = uv * 2.2 + (uMouse - 0.5) * 0.6;

    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7, 9.2)), fbm(p + 3.0*q + vec2(8.3, 2.8)));
    float f = smoothstep(0.1, 1.0, fbm(p + 3.0 * r));

    vec3 voidC = vec3(0.047, 0.047, 0.051);
    vec3 cream = vec3(0.925, 0.905, 0.863);
    vec3 col   = mix(voidC, cream, f * 0.55);

    float d = distance(vUv, vec2(0.5, 0.45));
    col += cream * 0.06 * smoothstep(0.6, 0.0, d);
    col += (hash(vUv * uRes + uTime) - 0.5) * 0.06;
    col *= smoothstep(1.15, 0.25, d);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function FieldShader() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const renderer = new Renderer({ canvas, dpr: Math.min(2, window.devicePixelRatio || 1) });
    const gl = renderer.gl;
    const program = new Program(gl, {
      vertex, fragment,
      uniforms: { uTime: { value: 0 }, uRes: { value: [1, 1] }, uMouse: { value: [0.5, 0.5] } },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      renderer.setSize(w, h);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMove = (e) => {
      program.uniforms.uMouse.value = [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight];
    };
    window.addEventListener("pointermove", onMove);

    let raf, t0 = performance.now(), running = true;
    const loop = (t) => {
      if (!running) return;
      program.uniforms.uTime.value = (t - t0) * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    if (reduce) { program.uniforms.uTime.value = 2.0; renderer.render({ scene: mesh }); }
    else raf = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!reduce) { running = true; t0 = performance.now() - program.uniforms.uTime.value * 1000; raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false; cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full block" />;
}

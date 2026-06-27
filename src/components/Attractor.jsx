import { useEffect, useRef } from "react";

// OTHER LIFE — a receiver. The signal morphs through chaotic forms as you
// scroll, then resolves into a planet (Mars). Built on the working 3-shape
// morph: scroll is polled each frame; every point lerps from one form to the
// next. Added: a Mars sphere, a cold->rust palette shift, and Mars settling
// into a slow spin at the end.
export default function Attractor() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    let W, H, DPR, raf;

    const resize = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = cv.width = Math.floor(window.innerWidth * DPR);
      H = cv.height = Math.floor(window.innerHeight * DPR);
      cv.style.width = window.innerWidth + "px";
      cv.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 16000;

    const lorenz = () => {
      const p = new Float32Array(N * 3);
      let x = 0.1, y = 0, z = 0; const s = 10, r = 28, b = 8 / 3, dt = 0.006;
      for (let i = 0; i < 1500; i++) { const dx=s*(y-x),dy=x*(r-z)-y,dz=x*y-b*z; x+=dx*dt;y+=dy*dt;z+=dz*dt; }
      for (let i = 0; i < N; i++) { const dx=s*(y-x),dy=x*(r-z)-y,dz=x*y-b*z; x+=dx*dt;y+=dy*dt;z+=dz*dt; p[i*3]=x; p[i*3+1]=z-25; p[i*3+2]=y; }
      return p;
    };
    const rossler = () => {
      const p = new Float32Array(N * 3);
      let x = 0.1, y = 0, z = 0; const a = 0.2, b = 0.2, c = 5.7, dt = 0.03;
      for (let i = 0; i < 3000; i++) { const dx=-(y+z),dy=x+a*y,dz=b+z*(x-c); x+=dx*dt;y+=dy*dt;z+=dz*dt; }
      for (let i = 0; i < N; i++) { const dx=-(y+z),dy=x+a*y,dz=b+z*(x-c); x+=dx*dt;y+=dy*dt;z+=dz*dt; p[i*3]=x; p[i*3+1]=y; p[i*3+2]=z; }
      return p;
    };
    const thomas = () => {
      const p = new Float32Array(N * 3);
      let x = 1.1, y = 1.1, z = -0.5; const b = 0.208, dt = 0.05;
      for (let i = 0; i < 2000; i++) { const dx=Math.sin(y)-b*x,dy=Math.sin(z)-b*y,dz=Math.sin(x)-b*z; x+=dx*dt;y+=dy*dt;z+=dz*dt; }
      for (let i = 0; i < N; i++) { const dx=Math.sin(y)-b*x,dy=Math.sin(z)-b*y,dz=Math.sin(x)-b*z; x+=dx*dt;y+=dy*dt;z+=dz*dt; p[i*3]=x; p[i*3+1]=y; p[i*3+2]=z; }
      return p;
    };
    // MARS — points spread evenly on a sphere (Fibonacci) with slight noise terrain
    const mars = () => {
      const p = new Float32Array(N * 3);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const yy = 1 - (i / (N - 1)) * 2;          // -1..1
        const rad = Math.sqrt(1 - yy * yy);
        const th = golden * i;
        let vx = Math.cos(th) * rad, vy = yy, vz = Math.sin(th) * rad;
        // bumpy surface so it reads as a planet, not a perfect ball
        const bump = 1 + 0.05 * Math.sin(vx * 9) * Math.cos(vz * 11) + 0.03 * Math.sin(vy * 14);
        p[i*3] = vx * bump; p[i*3+1] = vy * bump; p[i*3+2] = vz * bump;
      }
      return p;
    };

    const normalize = (p) => {
      let cx=0,cy=0,cz=0;
      for (let i=0;i<N;i++){ cx+=p[i*3]; cy+=p[i*3+1]; cz+=p[i*3+2]; }
      cx/=N; cy/=N; cz/=N;
      let m=0;
      for (let i=0;i<N;i++){ const dx=p[i*3]-cx,dy=p[i*3+1]-cy,dz=p[i*3+2]-cz; const r=Math.hypot(dx,dy,dz); if(r>m)m=r; }
      for (let i=0;i<N;i++){ p[i*3]=(p[i*3]-cx)/m; p[i*3+1]=(p[i*3+1]-cy)/m; p[i*3+2]=(p[i*3+2]-cz)/m; }
      return p;
    };

    // signal shapes -> then Mars. index 4 is the planet.
    const SHAPES = [normalize(lorenz()), normalize(rossler()), normalize(thomas()), normalize(mars())];
    const buf = new Float32Array(N * 3);
    const smooth = (t) => t * t * (3 - 2 * t);
    const lerp = (a, b, t) => a + (b - a) * t;

    let mx = 0, my = 0;
    const onMove = (e) => { mx = e.clientX/window.innerWidth - 0.5; my = e.clientY/window.innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove);

    let scroll = 0;
    let spin = 0;                                   // Mars's own steady rotation
    const t0 = performance.now();
    const frame = (t) => {
      const el = (t - t0) / 1000;
      const reveal = Math.min(1, el / 2.5);

      const target = window.scrollY || document.documentElement.scrollTop || 0;
      scroll += (target - scroll) * 0.1;
      const sNorm = scroll / window.innerHeight;

      const maxP = SHAPES.length - 1;
      const pos = Math.max(0, Math.min(maxP, sNorm - 0.8));   // 0..3 across the page
      const k = Math.min(Math.floor(pos), maxP - 1);
      const f = smooth(pos - k);
      const A = SHAPES[k], B = SHAPES[k + 1];
      for (let i = 0; i < N * 3; i++) buf[i] = A[i] + (B[i] - A[i]) * f;

      const marsAmt = Math.max(0, Math.min(1, pos - (maxP - 1))); // 0 until last morph, ->1 at Mars

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#070708";
      ctx.fillRect(0, 0, W, H);

      // rotation: scroll-driven tumble, easing into a steady planetary spin as Mars forms
      spin += 0.0016 * marsAmt;
      const ay = (el * 0.05 + sNorm * 0.45 + mx * 0.5) * (1 - marsAmt) + spin + mx * 0.5 * marsAmt;
      const ax = (-0.02 + my * 0.3) * (1 - 0.6 * marsAmt) + 0.18 * marsAmt;
      const cY = Math.cos(ay), sY = Math.sin(ay), cX = Math.cos(ax), sX = Math.sin(ax);
      const scale = Math.min(W, H) * lerp(0.52, 0.40, marsAmt);
      const cx = W * 0.5 - Math.min(W * 0.16, Math.max(0, sNorm - 0.8) * W * 0.08) * (1 - marsAmt);
      const cy = H * 0.5;

      // PALETTE: cold cyan/acid-green signals -> rust red as Mars arrives
      const mix = (c1, c2, tt) => [Math.round(lerp(c1[0],c2[0],tt)), Math.round(lerp(c1[1],c2[1],tt)), Math.round(lerp(c1[2],c2[2],tt))];
      const coldA = [120, 255, 214], coldB = [80, 200, 255], coldC = [180, 255, 160]; // cyan/acid-green
      const rustA = [255, 120, 60],  rustB = [200, 70, 40],   rustC = [255, 170, 110]; // mars rust
      const cA = mix(coldA, rustA, marsAmt), cB = mix(coldB, rustB, marsAmt), cC = mix(coldC, rustC, marsAmt);
      const rgba = (c, a) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";

      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1;
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, rgba(cA, 0.26 * reveal));
      g.addColorStop(0.45, rgba(cB, 0.32 * reveal));
      g.addColorStop(1, rgba(cC, 0.22 * reveal));
      ctx.strokeStyle = g;

      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const px = buf[i*3], py = buf[i*3+1], pz = buf[i*3+2];
        const rx = px * cY + pz * sY;
        const rz = -px * sY + pz * cY;
        const ty = py * cX - rz * sX;
        const X = cx + rx * scale;
        const Y = cy - ty * scale;
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 z-0 block h-full w-full" />;
}
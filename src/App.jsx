"use client";

import { useEffect, useRef } from "react";

const skills = ["Branding", "Logo", "UI / UX", "Poster", "Packaging", "Illustration", "3D & Motion"];
const letters = ["P", "O", "R", "T", "F", "O", "L", "I", "O"];

function Arrow({ small = false }) {
  return <span className={small ? "arrow small" : "arrow"}>↘</span>;
}

function PhysicsLetters() {
  const stageRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const stageWidth = stage.clientWidth;
    const objects = letters.map((_, i) => ({
      x: Math.min(stageWidth - 140, stageWidth * 0.55 + (i % 3) * 112),
      y: -45 - Math.floor(i / 3) * 72 - i * 7,
      vx: (i % 2 ? -1 : 1) * (0.3 + i * 0.04),
      vy: 0,
      r: -18 + i * 7,
      vr: (i % 2 ? 1 : -1) * 0.12,
    }));
    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let last = performance.now();

    const move = (event) => {
      const rect = stage.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const leave = () => (pointer.active = false);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", leave);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2);
      last = now;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const size = Math.max(76, Math.min(132, w * 0.13));

      objects.forEach((o, i) => {
        o.vy += 0.86 * dt;
        if (pointer.active) {
          const cx = o.x + size / 2;
          const cy = o.y + size / 2;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < size * 1.25 && dist > 0) {
            const force = (size * 1.25 - dist) / (size * 1.25);
            o.vx += (dx / dist) * force * 2.4;
            o.vy += (dy / dist) * force * 2.4;
            o.vr += (dx > 0 ? 1 : -1) * force * 0.22;
          }
        }
        o.x += o.vx * dt;
        o.y += o.vy * dt;
        o.r += o.vr * dt;
        o.vx *= 0.997;
        o.vr *= 0.995;

        if (o.x < 0) { o.x = 0; o.vx = Math.abs(o.vx) * 0.72; o.vr *= -0.7; }
        if (o.x + size > w) { o.x = w - size; o.vx = -Math.abs(o.vx) * 0.72; o.vr *= -0.7; }
        if (o.y + size > h) {
          o.y = h - size;
          o.vy = -Math.abs(o.vy) * 0.52;
          if (Math.abs(o.vy) < 0.8) o.vy = 0;
          o.vx *= 0.91;
        }

        for (let j = 0; j < i; j++) {
          const p = objects[j];
          const dx = (o.x + size / 2) - (p.x + size / 2);
          const dy = (o.y + size / 2) - (p.y + size / 2);
          const dist = Math.hypot(dx, dy) || 1;
          const min = size * 0.72;
          if (dist < min) {
            const push = (min - dist) * 0.025;
            o.vx += (dx / dist) * push;
            o.vy += (dy / dist) * push;
            p.vx -= (dx / dist) * push;
            p.vy -= (dy / dist) * push;
          }
        }

        const el = itemRefs.current[i];
        if (el) {
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.transform = `translate3d(${o.x}px, ${o.y}px, 0) rotate(${o.r}deg)`;
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="physics-stage" ref={stageRef} aria-label="可与鼠标互动的作品集字母动画">
      <p className="drag-hint">MOVE YOUR CURSOR<br />TO PUSH THE TYPE</p>
      {letters.map((letter, i) => (
        <div className="physics-letter" key={`${letter}-${i}`} ref={(el) => { itemRefs.current[i] = el; }}>
          {letter}
        </div>
      ))}
      <div className="hero-stamp">2026</div>
      <div className="hero-line" />
    </div>
  );
}

const projects = [
  { no: "01", title: "新消费品牌视觉", type: "BRAND IDENTITY", className: "project-blue" },
  { no: "02", title: "流动城市艺术节", type: "CAMPAIGN DESIGN", className: "project-orange" },
  { no: "03", title: "无界数字体验", type: "DIGITAL EXPERIENCE", className: "project-dark" },
];

export default function App() {
  return (
    <main>
      <nav className="topbar wrap">
        <a className="brand" href="#top" aria-label="返回顶部">LT®</a>
        <div className="nav-links">
          <a href="#about">ABOUT</a><a href="#work">WORK</a><a href="#contact">CONTACT</a>
        </div>
        <span>AVAILABLE FOR WORK · 2026</span>
      </nav>

      <section className="hero wrap" id="top">
        <div className="hero-info">
          <div className="hero-kicker">VISUAL DESIGNER<br />BASED IN TOKYO / SHANGHAI</div>
          <Arrow />
          <div className="skill-list">
            {skills.map((skill) => <span key={skill}>#{skill}</span>)}
          </div>
          <div className="year">20<br />26</div>
        </div>
        <PhysicsLetters />
      </section>

      <section className="about section wrap" id="about">
        <div className="section-label"><span>01</span> PROFILE / 经历</div>
        <div className="about-grid">
          <div className="portrait" aria-label="人物图占位区域">
            <div className="portrait-head" />
            <div className="portrait-body" />
            <span>YOUR<br />PORTRAIT</span>
          </div>
          <div className="intro">
            <p className="eyebrow">HELLO, I&apos;M LIU TIAN.</p>
            <h1>我用清晰的视觉秩序，<br />让品牌被看见、被记住。</h1>
            <p className="intro-copy">一名关注品牌、数字体验与动态视觉的设计师。擅长从策略和内容出发，将复杂信息转化为直接、有张力、可持续的视觉系统。</p>
            <div className="contact-line"><span>E</span><a href="mailto:hello@liutian.design">hello@liutian.design</a></div>
            <div className="contact-line"><span>W</span><a href="#work">liutian.design</a></div>
          </div>
          <div className="stats">
            <div><strong>06+</strong><span>YEARS EXPERIENCE<br />设计经验</span></div>
            <div><strong>42</strong><span>PROJECTS DONE<br />完成项目</span></div>
            <div><strong>18</strong><span>BRANDS SERVED<br />服务品牌</span></div>
          </div>
        </div>
      </section>

      <section className="work section wrap" id="work">
        <div className="section-label"><span>02</span> SELECTED WORK / 精选项目</div>
        <div className="work-heading"><h2>SELECTED<br />PROJECTS</h2><Arrow small /></div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-card" key={project.no}>
              <div className={`project-visual ${project.className}`}>
                <span className="project-no">{project.no}</span>
                {project.no === "01" && <><div className="pack pack-a">LU</div><div className="pack pack-b">LU</div><div className="orbit">NEW<br />FORM</div></>}
                {project.no === "02" && <><div className="poster-word">FLOW</div><div className="poster-circle" /><div className="poster-meta">ART / MUSIC / CITY<br />2026.09.18—21</div></>}
                {project.no === "03" && <><div className="screen"><div className="screen-glow" /><span>∞</span></div><div className="grid-lines" /></>}
              </div>
              <div className="project-caption"><h3>{project.title}</h3><span>{project.type} ↗</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="strengths section wrap">
        <div className="section-label"><span>03</span> CAPABILITIES / 个人优势</div>
        <div className="strength-grid">
          <article className="strength-main"><span>STRATEGY → SYSTEM</span><h2>从问题出发，<br />不止做一张<br />好看的图。</h2><p>把商业目标、受众洞察与内容结构，转译成统一而有辨识度的设计语言。</p></article>
          <article><span className="card-no">A</span><h3>品牌视觉系统</h3><p>品牌定位、标志、视觉规范、包装与传播物料的完整构建。</p><b>BRAND / VIS</b></article>
          <article className="blue-card"><span className="card-no">B</span><h3>数字产品体验</h3><p>用系统化思维处理信息层级，让视觉表现与使用体验保持一致。</p><b>UI / UX</b></article>
          <article><span className="card-no">C</span><h3>动态与叙事</h3><p>通过动态节奏、版式与叙事，让品牌在不同媒介中持续生长。</p><b>MOTION / 3D</b></article>
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="contact-inner wrap">
          <div className="section-label light"><span>04</span> LET&apos;S TALK / 联系方式</div>
          <p>HAVE A PROJECT IN MIND?</p>
          <a className="big-mail" href="mailto:hello@liutian.design">LET&apos;S<br />CREATE<span>↗</span></a>
          <div className="footer-row"><span>TOKYO · SHANGHAI</span><a href="mailto:hello@liutian.design">HELLO@LIUTIAN.DESIGN</a><span>© 2026 LIU TIAN</span></div>
        </div>
      </footer>
    </main>
  );
}

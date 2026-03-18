import { useEffect, useRef } from 'react';
import './styles.css';

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

   

  useEffect(() => {
    // Set default dark theme
    document.documentElement.setAttribute('data-theme', 'dark');

    // Background canvas animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W: number, H: number;
    let pts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    let animId: number;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      initPts();
    }

    function initPts() {
      pts = [];
      for (let i = 0; i < 90; i++)
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.8 + 0.4,
        });
    }

    function drawPts() {
      ctx!.clearRect(0, 0, W, H);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const col = isDark ? 'rgba(79,141,255,' : 'rgba(37,99,235,';
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = col + '.6)';
        ctx!.fill();
      });
      pts.forEach((a, i) => {
        pts.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x,
            dy = a.y - b.y,
            d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = col + (1 - d / 130) * 0.12 + ')';
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        });
      });
      animId = requestAnimationFrame(drawPts);
    }

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(drawPts);

    // Intersection observer for reveal animations
    const obs = new IntersectionObserver(  (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));

    // Counter animation
    function counter(
      el: HTMLElement,
      target: number,
      suffix: string,
      dur = 2000
    ) {
      let start: number | null = null;
      function step(ts: number) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const cObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const sn1 = document.getElementById('sn1');
            const sn2 = document.getElementById('sn2');
            const sn3 = document.getElementById('sn3');
            const sn4 = document.getElementById('sn4');
            if (sn1) counter(sn1, 10, '+');
            if (sn2) counter(sn2, 2, '+');
            if (sn3) counter(sn3, 15, '+');
            if (sn4) counter(sn4, 8, '+');
            cObs.disconnect();
          }
        });
      },  { threshold: 0.5 } );
    const heroCard = document.querySelector('.hero-card');
    if (heroCard) cObs.observe(heroCard);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
      obs.disconnect();
      cObs.disconnect();
    };
  }, []);

  function toggleTheme() {
    const t = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute(
      'data-theme',
      t === 'dark' ? 'light' : 'dark'
    );
  }

  return (
    <>
      <canvas id="bg-canvas" ref={canvasRef}></canvas>

      <nav>
        <a className="nav-logo" href="#">
          <span className="logo-dot"></span>SG.dev
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-right">
          <button className="theme-toggle" id="themeToggle" title="Toggle light/dark" onClick={toggleTheme}>
            <span className="toggle-icon-light">☀️</span>
            <span className="toggle-icon-dark">🌙</span>
            <div className="toggle-thumb"></div>
          </button>
          <button className="hire-btn">
            <span>
              <a style={{ textDecoration: 'none', color: 'white' }} href="#contact">
                Hire Me
              </a>
            </span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg-shape"></div>
        <div className="hero-grid-line"></div>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="badge-av">SG</div>
              <span className="badge-text">Available for freelance work</span>
              <span className="badge-ping"></span>
            </div>
            <h1 className="hero-title">
              <span className="line"><span>Full-Stack</span></span>
              <span className="line"><span><span className="hl-accent">Web</span></span></span>
              <span className="line"><span>&amp; Mobile Developer</span></span>
            </h1>
            <p className="hero-desc">
              Hi, I'm <strong style={{ color: 'var(--text)' }}>Samuel Gaston</strong> — a passionate full-stack developer with 2+ years of experience crafting high-performance web and mobile applications that users love.
            </p>
            <div className="hero-actions">
              <button className="btn-main" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>View My Work →</span>
              </button>
              <button className="btn-outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Get In Touch
              </button>
            </div>
          </div>
          <div className="hero-card">
            <div className="avatar-wrap">
              <div className="avatar">SG</div>
              <div className="avatar-ring"></div>
              <div className="avatar-dot"></div>
            </div>
            <div className="card-name">Samuel Gaston</div>
            <div className="card-role">Full-Stack · Mobile Dev</div>
            <div className="card-stats">
              <div className="cs"><div className="cs-n" id="sn1">0</div><div className="cs-l">Projects</div></div>
              <div className="cs"><div className="cs-n" id="sn2">0</div><div className="cs-l">Years Exp</div></div>
              <div className="cs"><div className="cs-n" id="sn3">0</div><div className="cs-l">Technologies</div></div>
              <div className="cs"><div className="cs-n" id="sn4">0</div><div className="cs-l">Clients</div></div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hs-line"></div>
          <span className="hs-text">Scroll</span>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="sec-inner">
          <div className="about-grid">
            <div className="about-visual reveal">
              <div className="about-img-wrap">
                <div className="about-monogram">SG</div>
              </div>
              <div className="about-badge-exp">
                <div className="abe-n">2+</div>
                <div className="abe-l">Years of<br />Experience</div>
              </div>
            </div>
            <div className="about-text">
              <div className="sec-head">
                <div className="sec-tag reveal">About Me</div>
                <h2 className="sec-title reveal rd1">Crafting <span className="gr">digital experiences</span> with purpose</h2>
              </div>
              <p className="reveal rd2">I'm <strong>Samuel Gaston</strong>, a full-stack developer and mobile application engineer with over <strong>2 years of professional experience</strong>. I specialize in building scalable, user-centric applications from pixel-perfect frontends to robust backend architectures.</p>
              <p className="reveal rd3">My expertise spans the complete development lifecycle — from ideating features and designing databases, to deploying production-ready applications. I work across <strong>web and mobile platforms</strong>, combining modern frontend frameworks with powerful backend solutions.</p>
              <p className="reveal rd3">I'm driven by clean code, thoughtful UI/UX, and delivering products that genuinely solve problems. Whether it's a mobile commerce app or a complex real estate platform — I bring the same <strong>attention to detail and passion</strong> to every project.</p>
              <div className="about-pills reveal rd4">
                <span className="pill">Fast Learner</span>
                <span className="pill">Problem Solver</span>
                <span className="pill">UI/UX Focused</span>
                <span className="pill">Team Player</span>
                <span className="pill">Mobile-First</span>
                <span className="pill">Performance Obsessed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="section-inner">
          <div className="sec-head" style={{ textAlign: 'center' }}>
            <div className="sec-tag reveal" style={{ justifyContent: 'center' }}>Tech Stack</div>
            <h2 className="sec-title reveal rd1">Tools I <span className="gr">work with</span></h2>
            <p className="sec-sub reveal rd2" style={{ margin: '0 auto' }}>A curated set of technologies I use to build fast, scalable, and beautiful products.</p>
          </div>
          <div className="skills-grid">
            {[
              { icon: 'devicon-html5-plain colored', name: 'HTML5' },
              { icon: 'devicon-css3-plain colored', name: 'CSS3' },
              { icon: 'devicon-tailwindcss-plain colored', name: 'Tailwind' },
              { icon: 'devicon-bootstrap-plain colored', name: 'Bootstrap' },
              { icon: 'devicon-javascript-plain colored', name: 'JavaScript' },
              { icon: 'devicon-typescript-plain colored', name: 'TypeScript' },
              { icon: 'devicon-react-original colored', name: 'React JS' },
              { icon: 'devicon-nextjs-original', name: 'Next JS', style: { color: 'var(--text)' } },
              { icon: 'devicon-react-original colored', name: 'React Native' },
              { icon: 'devicon-nodejs-plain colored', name: 'Node JS' },
              { icon: 'devicon-express-original', name: 'Express JS', style: { color: 'var(--text)' } },
              { icon: 'devicon-nestjs-plain colored', name: 'Nest JS' },
              { icon: 'devicon-php-plain colored', name: 'PHP' },
              { icon: 'devicon-laravel-plain', name: 'Laravel', style: { color: '#ef4444' } },
              { icon: 'devicon-spring-plain colored', name: 'Spring Boot' },
              { icon: 'devicon-kotlin-plain colored', name: 'Kotlin' },
              { icon: 'devicon-mongodb-plain colored', name: 'MongoDB' },
              { icon: 'devicon-mysql-plain colored', name: 'MySQL' },
            ].map((skill, i) => (
              <div className="skill-card reveal" key={i}>
                <div className="skill-icon">
                  <i className={skill.icon} style={(skill as any).style}></i>
                </div>
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects-outer" id="projects">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-tag reveal">Portfolio</div>
            <h2 className="sec-title reveal rd1">Featured <span className="gr">Projects</span></h2>
            <p className="sec-sub reveal rd2">A selection of my most impactful work — from mobile apps to full-stack web platforms.</p>
          </div>
          <div className="projects-grid">
            {[
              { thumb: 'pt-elearn', type: 'Mobile App', name: 'TechEdify — E-Commerce App', desc: 'Feature-rich mobile shopping app with product catalog, cart management, order management, services management, application management.', tags: ['React Native', 'Node JS', 'MongoDB', 'Express JS'] },
              { thumb: 'pt-elearn', type: 'Mobile App', name: 'Foodie — Delivery App', desc: 'Real food delivery app with food listings, order management, and delivery cared.', tags: ['React Native', 'Nest JS', 'MySQL', 'TypeScript'] },
              { thumb: 'pt-elearn', type: 'Web App', name: 'HomeScope — Real Estate Platform', desc: 'Featured property listing platform with email support messaging.', tags: ['Next JS', 'Laravel', 'MySQL', 'Tailwind'] },
              { thumb: 'pt-elearn', type: 'Web App', name: 'TalentBridge — Job Portal', desc: 'End-to-end recruitment platform connecting employers and job seekers with Email features, resume uploading via application form.', tags: ['React JS', 'SpringBoot', 'Kotlin', 'MongoDB'] },
              { thumb: 'pt-elearn', type: 'Web App', name: 'Smart-progress — E-Learning Platform', desc: 'Interactive online learning platform with PDF courses, quizzes, progress tracking, and instructor dashboards.', tags: ['Next JS', 'Node JS', 'MongoDB', 'TypeScript'] },
              { thumb: 'pt-elearn', type: 'Web App', name: 'Elec — Online Election System', desc: 'Interactive online voting platform.', tags: ['Next JS', 'Node JS', 'MongoDB', 'TypeScript'] },
            ].map((p, i) => (
              <div className={`proj-card reveal ${i % 2 === 1 ? 'rd1' : 'rd2'}`} key={i}>
                <div className="proj-thumb">
                  <div className={`proj-thumb-inner ${p.thumb}`}>
                    <span className="proj-emoji"></span>
                  </div>
                  <span className="proj-type-tag">{p.type}</span>
                </div>
                <div className="proj-body">
                  <div className="proj-name">{p.name}</div>
                  <p className="proj-desc">{p.desc}</p>
                  <div className="proj-tags">
                    {p.tags.map((t, j) => <span className="ptag" key={j}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="exp-outer" id="experience">
        <div className="sec-inner">
          <div className="exp-grid">
            <div>
              <div className="sec-tag reveal">Journey</div>
              <h2 className="sec-title reveal rd1" style={{ marginBottom: '3rem' }}>Work <span className="gr">Experience</span></h2>
              <div className="exp-timeline">
                <div className="exp-item reveal rd1">
                  <div className="exp-dot"></div>
                  <div className="exp-date">2025 — Present</div>
                  <div className="exp-role">Full-Stack Developer</div>
                  <div className="exp-co">Freelance / Remote</div>
                  <p className="exp-desc">Delivering end-to-end web and mobile solutions for clients across multiple industries. Specializing in React, Next.js, Node.js, and React Native with focus on performance and UX.</p>
                </div>
                <div className="exp-item reveal rd2">
                  <div className="exp-dot"></div>
                  <div className="exp-date">2023 — 2024</div>
                  <div className="exp-role">Junior Software Developer</div>
                  <div className="exp-co">Tech Startup — Douala, Cameroon</div>
                  <p className="exp-desc">Built and maintained web applications using React and Laravel. Collaborated in agile teams, contributed to UI design systems, and integrated REST APIs across multiple products.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="sec-tag reveal">Education</div>
              <h2 className="sec-title reveal rd1" style={{ marginBottom: '3rem' }}>Academic <span className="gr">Background</span></h2>
              <div className="exp-timeline">
                <div className="exp-item reveal rd1">
                  <div className="exp-dot"></div>
                  <div className="exp-date">2025 — 2026</div>
                  <div className="exp-role">Bachelor's in Software Engineering</div>
                  <div className="exp-co">University of Bamenda</div>
                  <p className="exp-desc">Studied core computer science principles, software architecture, algorithms and data structures, databases, and web development fundamentals.</p>
                </div>
                <div className="exp-item reveal rd2">
                  <div className="exp-dot"></div>
                  <div className="exp-date">Ongoing</div>
                  <div className="exp-role">Self-Directed Learning</div>
                  <div className="exp-co">Youtube · Official Docs</div>
                  <p className="exp-desc">Continuously expanding skills in machine learning engineering, system design, and emerging technologies through structured online programs and hands-on projects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-outer" id="contact">
        <div className="contact-glow"></div>
        <div className="sec-inner" style={{ position: 'relative', zIndex: 1 }}>
          <div className="sec-head" style={{ textAlign: 'center' }}>
            <div className="sec-tag reveal" style={{ justifyContent: 'center' }}>Contact</div>
            <h2 className="sec-title reveal rd1">Let's <span className="gr">build something</span> great</h2>
            <p className="sec-sub reveal rd2" style={{ margin: '0 auto' }}>Have a project in mind? I'd love to hear about it. Let's talk and bring your vision to life.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-info reveal">
              <p>Whether you need a stunning mobile app, a powerful web platform, or a full-stack solution from scratch — I'm here to help. Let's collaborate and build something remarkable together.</p>
              <div className="c-links">
                <a href="mailto:samuelgaston@email.com" className="c-link">
                  <div className="c-link-icon"></div>
                  <div><div className="c-link-text">Email</div><div className="c-link-sub">samuelgaston@email.com</div></div>
                </a>
                <a href="#" className="c-link">
                  <div className="c-link-icon"></div>
                  <div><div className="c-link-text">Phone</div><div className="c-link-sub">+237 678421846</div></div>
                </a>
                <a href="https://www.linkedin.com/in/etoke-gaston-b037a938b/" className="c-link">
                  <div className="c-link-icon"></div>
                  <div><div className="c-link-text">LinkedIn</div><div className="c-link-sub">https://www.linkedin.com/in/etoke-gaston-b037a938b/</div></div>
                </a>
              </div>
            </div>
            <div className="contact-form reveal rd2">
              <div className="form-row">
                <div className="f-field"><input type="text" placeholder="Your Name" /></div>
                <div className="f-field"><input type="email" placeholder="Your Email" /></div>
              </div>
              <div className="f-field"><input type="text" placeholder="Subject — e.g. Mobile App Project" /></div>
              <div className="f-field"><textarea placeholder="Tell me about your project…"></textarea></div>
              <button className="form-submit"><span>Send Message →</span></button>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="foot-left">Samuel <span>Gaston</span> · Full-Stack Developer</div>
        <div className="foot-right">© 2026 · Built with Love · All rights reserved</div>
      </footer>
    </>
  );
}

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger)

// --- MOUSE & MAGIC GLOW INTERACTIONS (21st.dev style) ---
// Update magic card glows on mouse move
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.magic-card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const glow = card.querySelector('.magic-glow');
    if (glow) {
      glow.style.transform = `translate(${x}px, ${y}px)`;
    }
  });
});

// Magnetic Buttons (Motion.dev style)
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach(elem => {
  elem.addEventListener('mousemove', (e) => {
    const rect = elem.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(elem, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.6,
      ease: "power3.out"
    });
    
    const span = elem.querySelector('span');
    if (span) {
      gsap.to(span, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.6,
        ease: "power3.out"
      });
    }
  });
  
  elem.addEventListener('mouseleave', () => {
    gsap.to(elem, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)"
    });
    
    const span = elem.querySelector('span');
    if (span) {
      gsap.to(span, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    }
  });
});

// --- THEME TOGGLE ---
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
  htmlEl.classList.add('light-mode');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    htmlEl.classList.toggle('light-mode');
    const isLight = htmlEl.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// --- GSAP ANIMATIONS ---

// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Hero Animation Timeline
const heroTl = gsap.timeline();

// Title lines
heroTl.to(".hero-title .line", {
  y: 0,
  opacity: 1,
  duration: 1.2,
  stagger: 0.2,
  ease: "power4.out",
  delay: 0.2
});

// Other hero elements
heroTl.to(".hero-content .fade-in-up", {
  y: 0,
  opacity: 1,
  duration: 1,
  stagger: 0.15,
  ease: "power3.out"
}, "-=0.8");

// Hero visual
heroTl.to(".hero-visual.fade-in-up", {
  y: 0,
  opacity: 1,
  duration: 1.5,
  ease: "power3.out"
}, "-=0.8");

// Annotations pop in
heroTl.fromTo(".annotation", 
  { scale: 0.8, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" },
"-=0.5");


// Scroll Reveals for sections
const revealElements = document.querySelectorAll('.scroll-reveal');

revealElements.forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    },
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out"
  });
});

// Parallax for phone in hero
gsap.to(".glass-phone", {
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1
  },
  y: 100,
  rotationX: 10,
  rotationY: -5,
  ease: "none"
});

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

// Default to light mode unless dark mode is explicitly saved
if (savedTheme !== 'dark') {
  htmlEl.classList.add('light-mode');
} else {
  htmlEl.classList.remove('light-mode');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    htmlEl.classList.toggle('light-mode');
    const isLight = htmlEl.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// --- FAQ ACCORDION ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const trigger = item.querySelector('.faq-trigger');
  trigger.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close other items
    faqItems.forEach(i => i.classList.remove('active'));
    
    if (!isActive) {
      item.classList.add('active');
    }
    
    // Refresh ScrollTrigger as height changed
    setTimeout(() => { ScrollTrigger.refresh(); }, 400);
  });
});

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
      start: "top 95%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    },
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  });
});

// Refresh ScrollTrigger on load to recalculate exact positions
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

// Parallax for illustration in hero (connection lines and side bubbles)
if (document.querySelector('.connection-lines')) {
  gsap.to([".connection-lines", ".decision-bubble"], {
    scrollTrigger: {
      trigger: ".hero-split",
      start: "top top",
      end: "bottom top",
      scrub: 1
    },
    y: 80,
    ease: "none"
  });
}

// Refresh ScrollTrigger when internal phone content is scrolled
const phoneContents = document.querySelectorAll('.phone-content');
phoneContents.forEach(content => {
  content.addEventListener('scroll', () => {
    ScrollTrigger.refresh();
  });
});

// --- WAITLIST FORM SUBMISSION ---
const waitlistForm = document.getElementById('waitlist-form');
if (waitlistForm) {
  const input = waitlistForm.querySelector('.cta-input');
  const submitBtn = waitlistForm.querySelector('.cta-submit-btn');
  const statusEl = waitlistForm.querySelector('.cta-form-status');
  
  waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = input.value.trim();
    if (!email) return;
    
    // Reset status
    statusEl.className = 'cta-form-status loading';
    statusEl.textContent = 'Adding you to the waitlist...';
    
    // Disable inputs
    input.disabled = true;
    submitBtn.disabled = true;
    
    // Animate button scale down slightly while loading
    gsap.to(submitBtn, { scale: 0.95, opacity: 0.7, duration: 0.2 });
    
    // Simulate API call
    setTimeout(() => {
      // Re-enable input and button
      input.disabled = false;
      submitBtn.disabled = false;
      
      // Animate button back to normal
      gsap.to(submitBtn, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
      
      // Update status to success
      statusEl.className = 'cta-form-status success';
      statusEl.textContent = "✓ You're on the list! We'll notify you as soon as Hush is ready.";
      
      // Clear input
      input.value = '';
      
      // Animate success text fade-in
      gsap.fromTo(statusEl, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      
    }, 1200);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  typingEffect();//typing

  initSkills(); //sidebarEffect
  initAOS(); //AOS
  initNetworkEffectHeader(); //Netwok Effect Header
  initMenuToggle(); //Init menu togle in media max

  await loadSection("home", "sections/about.html");
  await loadSection("experience", "sections/experience.html");
  await loadSection("education", "sections/education.html");
  await loadSection("services", "sections/services.html");

  initCountersAbout();

  innerExperienceCTP();

  const first = document.querySelector(".timeline-experience-card");
  if (first) first.click();


});

/**
 * call sections
 * @returns 
 */
async function loadSection(containerId, filePath) {
  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Error cargando ${filePath}`);
    }

    const html = await response.text();

    document.getElementById(containerId).innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Tipyng effect
 * @returns 
 */
function typingEffect() {

  const target = document.getElementById("typing-text");
  if (!target) return resolve();

  const text = "Desarrolladora Full-Stack (Java • Python • PHP • CLOUD • WordPress)";
  let index = 0;

  function type() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index++;
      setTimeout(type, 40);
    } else {
      resolve();
    }
  }

  type();
}



/**
 * Sidebar Effect
 * @returns 
 */
function initSkills() {

  const tabs = document.querySelectorAll(".tab");
  const tracks = document.querySelectorAll(".skills-track");

  tabs.forEach(tab => {
    tab.addEventListener("click", function () {

      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      const id = this.dataset.tab;

      tracks.forEach(t => t.classList.remove("active"));
      document.getElementById(id).classList.add("active");

    });
  });

  // dots dinámicos
  document.querySelectorAll(".dots").forEach(el => {
    const level = +el.dataset.level;

    for (let i = 0; i < 5; i++) {
      const dot = document.createElement("span");
      if (i < level) dot.classList.add("active");
      el.appendChild(dot);
    }
  });

}
/**
* AOS init
*/
function initAOS() {

  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out'
  });
}

/**
* Network effect header
*/
function initNetworkEffectHeader() {

  const canvas = document.getElementById("network-bg");

  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let particles = [];
  const numParticles = 80;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // make particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
    });
  }

  let mouse = {
    x: null,
    y: null,
    active: false,
  };

  //effect follow-up mouse
  window.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  /**
   * Draw network
   */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // move particles
    particles.forEach((p) => {
      if (mouse.active) {
        p.x += p.vx;
        p.y += p.vy;
      }


      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // draw point
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#b67514";
      ctx.strokeStyle = "rgba(182,117,20,0.2)";
      ctx.fill();
    });

    // draw lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(255,255,255,0.05)";
          ctx.stroke();
        }
      }
    }

    // particles connect
    if (mouse.x !== null && mouse.y !== null) {
      particles.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.stroke();
        }
      });
      // nodo del mouse
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#b67514";
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/**
* toggle menu media max
*/
function initMenuToggle() {

  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".header-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("active");
    });
  }
}
/**
* About
*/
//counter stats
function initCountersAbout() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.set(".stat", {
    opacity: 0,
    y: 80
  });
  ScrollTrigger.create({
    trigger: ".stats-section",
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.to(".stat", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      });
    }
  });
  gsap.utils.toArray(".counter").forEach(counter => {
    let target = +counter.dataset.target;
    const suffix = counter.dataset.suffix || "";
    gsap.fromTo(counter,
      { innerText: 0 },
      {
        innerText: target,
        duration: 2,
        ease: "power1.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: counter,
          start: "top 85%",
          once: true
        },
        onUpdate: function () {
          counter.innerText =
            Math.floor(counter.innerText) + suffix;
        }
      }
    );
  });
}

//experience details
function innerExperienceCTP() {

  const cards = document.querySelectorAll(".timeline-experience-card");

  cards.forEach(card => {
    card.addEventListener("click", function () {

      const id = this.dataset.id;


      const next = document.getElementById(id);
      //desktop
      document.querySelectorAll(".details-experience")
        .forEach(d => d.classList.remove("active"));

      const desktopEl = document.getElementById(id);

      if (desktopEl) {
        desktopEl.classList.add("active");
      }
      // mobile panel
      document.querySelectorAll(".details-mobile")
        .forEach(d => d.classList.remove("active"));
      const mobileEl = document.getElementById("mobile-" + id);
      if (mobileEl) {
        mobileEl.classList.add("active");
      }

      document.querySelectorAll(".timeline-experience-card")
        .forEach(c => c.classList.remove("active-card"));
      this.classList.add("active-card");
      if (next) next.classList.add("active");

    });
  });

  if (cards.length > 0) {
    cards[0].click();
  }
}
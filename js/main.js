(() => {
  const portfolio = document.getElementById("portfolio");
  if (!portfolio) return;

  const intro = portfolio.querySelector(".intro");
  const nameButton = portfolio.querySelector(".name-button");
  const aboutDetails = portfolio.querySelector("#about-details");
  const motionButton = portfolio.querySelector(".motion");
  const canvas = portfolio.querySelector("#feather-canvas");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let userPaused = portfolio.classList.contains("paused");
  let isPaused = userPaused || reducedMotion.matches;

  // 이름은 움직이지 않고 소개만 펼치기
  if (intro && nameButton && aboutDetails) {
    nameButton.addEventListener("click", () => {
      const isOpen = intro.classList.toggle("is-open");

      nameButton.setAttribute("aria-expanded", String(isOpen));
      aboutDetails.inert = !isOpen;
    });
  }

  // 별·화살표·깃털의 정지 상태를 함께 관리
  function syncMotion() {
    isPaused = userPaused || reducedMotion.matches;
    portfolio.classList.toggle("paused", isPaused);

    if (!motionButton) return;

    motionButton.hidden = reducedMotion.matches;
    motionButton.setAttribute("aria-pressed", String(isPaused));
    motionButton.setAttribute(
      "aria-label",
      isPaused ? "Play animation" : "Pause animation"
    );

    motionButton.textContent = isPaused
      ? "Play motion"
      : "Pause motion";
  }

  motionButton?.addEventListener("click", () => {
    userPaused = !userPaused;
    syncMotion();
  });

  reducedMotion.addEventListener("change", syncMotion);
  syncMotion();

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 깃털을 한 번 그린 뒤 애니메이션에서 재사용
  const feather = document.createElement("canvas");
  feather.width = 240;
  feather.height = 460;

  const pen = feather.getContext("2d");
  if (!pen) return;

  function shaft(v) {
    return [
      116 + 22 * Math.sin(v * 2.8) - v * 13,
      34 + v * 359
    ];
  }

  // 반투명한 깃털 몸체
  pen.beginPath();
  pen.moveTo(116, 31);
  pen.bezierCurveTo(51, 74, 49, 181, 91, 305);
  pen.quadraticCurveTo(99, 333, 116, 360);
  pen.bezierCurveTo(180, 282, 213, 93, 116, 31);

  const vane = pen.createLinearGradient(60, 0, 192, 0);
  vane.addColorStop(0, "rgba(188,198,204,.20)");
  vane.addColorStop(0.45, "rgba(243,247,248,.70)");
  vane.addColorStop(0.65, "rgba(212,223,227,.45)");
  vane.addColorStop(1, "rgba(188,201,209,.12)");

  pen.fillStyle = vane;
  pen.fill();

  let seed = 72;

  function random() {
    seed = seed * 16807 % 2147483647;
    return (seed - 1) / 2147483646;
  }

  // 깃털의 가는 결
  for (let i = 0; i < 124; i++) {
    const v = 0.025 + i / 124 * 0.87;
    const p = shaft(v);
    const shape = Math.pow(
      Math.sin(Math.PI * v / 0.96),
      0.8
    );

    for (const side of [-1, 1]) {
      const barbWidth =
        shape *
        (side < 0 ? 58 : 72) *
        (1 - v * 0.22) *
        (0.94 + random() * 0.09);

      const endX = p[0] + side * barbWidth;
      const endY = p[1] - 25 - 38 * shape;

      pen.beginPath();
      pen.moveTo(...p);
      pen.bezierCurveTo(
        p[0] + side * barbWidth * 0.32,
        p[1] - 9,
        endX - side * barbWidth * 0.16,
        endY + 18,
        endX,
        endY
      );

      pen.strokeStyle =
        `rgba(153,170,181,${0.17 + random() * 0.13})`;
      pen.lineWidth = 0.65;
      pen.stroke();

      pen.beginPath();
      pen.moveTo(p[0] + 0.65, p[1] + 0.75);
      pen.bezierCurveTo(
        p[0] + side * barbWidth * 0.32,
        p[1] - 8,
        endX - side * barbWidth * 0.16,
        endY + 19,
        endX,
        endY + 1
      );

      pen.strokeStyle = "rgba(255,255,255,.8)";
      pen.lineWidth = 0.8;
      pen.stroke();
    }
  }

  // 아래쪽의 부드러운 솜털
  for (let i = 0; i < 48; i++) {
    const v = 0.76 + random() * 0.2;
    const p = shaft(v);
    const side = i % 2 ? 1 : -1;
    const reach = 12 + random() * 32;

    pen.beginPath();
    pen.moveTo(...p);
    pen.bezierCurveTo(
      p[0] + side * reach * 0.4,
      p[1] - 17,
      p[0] + side * reach,
      p[1] - 15,
      p[0] + side * reach * 0.8,
      p[1] - 35 - random() * 30
    );

    pen.strokeStyle = "rgba(175,188,197,.27)";
    pen.lineWidth = 0.65;
    pen.stroke();
  }

  // 깃대
  pen.beginPath();
  pen.moveTo(116, 33);
  pen.bezierCurveTo(141, 150, 135, 271, 111, 409);
  pen.strokeStyle = "rgba(158,176,186,.35)";
  pen.lineWidth = 2.1;
  pen.stroke();

  pen.beginPath();
  pen.moveTo(117, 33);
  pen.bezierCurveTo(142, 150, 136, 271, 112, 409);
  pen.strokeStyle = "rgba(255,255,255,.97)";
  pen.lineWidth = 1.1;
  pen.stroke();

  function smooth(value) {
    const x = Math.max(0, Math.min(1, value));
    return x * x * (3 - 2 * x);
  }

  // 시작 위치·흐르는 방향·기울기가 다른 경로
  const flights = [
    { start: .76, end: .55, sway: .09, tilt: -.27, phase: .5 },
    { start: .21, end: .40, sway: .075, tilt: .25, phase: 2.1 },
    { start: .59, end: .79, sway: .065, tilt: .18, phase: 4.2 },
    { start: .36, end: .15, sway: .08, tilt: -.22, phase: 1.3 },
    { start: .86, end: .66, sway: .05, tilt: -.15, phase: 3.5 },
    { start: .12, end: .30, sway: .07, tilt: .3, phase: 5.1 }
  ];

  let width = 0;
  let height = 0;
  let time = 0;
  let lastTime = null;
  let visible = true;

  function draw(t) {
    ctx.clearRect(0, 0, width, height);

    if (width <= 0 || height <= 0) return;

    const interval = 10.8;
    const duration = 12.5;
    const latest = Math.floor(t / interval);

    for (let n = Math.max(0, latest - 1); n <= latest; n++) {
      const elapsed = t - n * interval;
      if (elapsed < 0 || elapsed > duration) continue;

      const u = elapsed / duration;
      const flight = flights[n % flights.length];

      const opacity =
        smooth(u / .09) * smooth((1 - u) / .16);

      const angle =
        u * Math.PI * (3.4 + (n % 3) * .35) + flight.phase;

      const x = width * (
        flight.start +
        (flight.end - flight.start) * u +
        flight.sway * Math.sin(angle) * Math.sin(Math.PI * u)
      );

      const y = height * (-.1 + u * 1.20);

      const featherWidth =
        Math.min(88, width * .19) * (1 - (n % 3) * .045);

      const featherHeight = featherWidth * 460 / 240;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.rotate(flight.tilt + Math.sin(angle + .6) * .47);
      ctx.scale(.9 + .1 * Math.cos(angle), 1);

      ctx.drawImage(
        feather,
        -featherWidth / 2,
        -featherHeight / 2,
        featherWidth,
        featherHeight
      );

      ctx.restore();
    }
  }

  // CSS에서 지정한 캔버스 크기에 맞춤
  function resize() {
    const bounds = canvas.getBoundingClientRect();

    width = bounds.width;
    height = bounds.height;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(time);
  }

  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(canvas);

  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    lastTime = null;
  });

  visibilityObserver.observe(canvas);

  function handleVisibility() {
    lastTime = null;
  }

  document.addEventListener("visibilitychange", handleVisibility);

  function frame(now) {
    if (!portfolio.isConnected) {
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
      return;
    }

    if (lastTime === null) lastTime = now;

    const elapsed = now - lastTime;

    if (elapsed >= 1000 / 30) {
      if (!isPaused && visible && !document.hidden) {
        time += Math.min(elapsed / 1000, 0.1);
        draw(time);
      }

      lastTime = now;
    }

    requestAnimationFrame(frame);
  }

  resize();
  requestAnimationFrame(frame);
})();

(() => {
  const links = document.querySelectorAll(
    "#selected-work .project-links a, #selected-work a.project"
  );

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      // 키보드로 누른 경우에는 초점 유지
      if (event.detail > 0) {
        link.blur();
      }
    });
  });
})();


const contactToggle = document.querySelector(".contact-toggle");
const contactPanel = document.getElementById("contact-panel");
const contactClose = document.querySelector(".contact-close");

function openContactPanel() {
  if (!contactPanel) return;

  contactPanel.classList.add("is-open");
  contactPanel.setAttribute("aria-hidden", "false");

  if (contactToggle) {
    contactToggle.setAttribute("aria-expanded", "true");
  }
}

function closeContactPanel() {
  if (!contactPanel) return;

  contactPanel.classList.remove("is-open");
  contactPanel.setAttribute("aria-hidden", "true");

  if (contactToggle) {
    contactToggle.setAttribute("aria-expanded", "false");
  }
}

contactToggle?.addEventListener("click", (event) => {
  event.preventDefault();
  openContactPanel();
});

contactClose?.addEventListener("click", closeContactPanel);

contactPanel?.addEventListener("click", (event) => {
  if (event.target === contactPanel) {
    closeContactPanel();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeContactPanel();
  }
});

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const type = document.getElementById("contact-type").value;
  const message = document.getElementById("contact-message").value.trim();

  contactStatus.classList.remove("is-success", "is-error");
  contactStatus.textContent = "Sending...";

  try {
    const response = await fetch(
      "https://hhe6bd4kgd.execute-api.ap-northeast-2.amazonaws.com/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          type,
          message
        })
      }
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    contactStatus.classList.remove("is-error");
    contactStatus.classList.add("is-success");
    contactStatus.textContent = "Thanks — I’ll get back to you soon.";

    contactForm.reset();

  } catch (error) {
    console.error(error);

    contactStatus.classList.remove("is-success");
    contactStatus.classList.add("is-error");
    contactStatus.textContent =
      "Something went wrong. Please try again.";
  }
});
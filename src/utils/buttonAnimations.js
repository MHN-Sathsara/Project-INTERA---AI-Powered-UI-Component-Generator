import { gsap } from "gsap";

/**
 * Button click animation utilities using GSAP
 * Creates spectacular click effects for buttons
 */

export const createClickRipple = (buttonElement, event) => {
  if (!buttonElement || !event) return;

  const rect = buttonElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Create ripple element
  const ripple = document.createElement("div");
  ripple.className = "absolute rounded-full bg-white/30 pointer-events-none";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.transform = "translate(-50%, -50%)";
  ripple.style.width = "4px";
  ripple.style.height = "4px";

  buttonElement.appendChild(ripple);

  // Animate ripple
  const tl = gsap.timeline({
    onComplete: () => {
      ripple.remove();
    },
  });

  tl.to(ripple, {
    scale: 50,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  });
};

export const createButtonPulse = (buttonElement) => {
  if (!buttonElement) return;

  const tl = gsap.timeline();

  tl.to(buttonElement, {
    scale: 0.95,
    duration: 0.1,
    ease: "power2.inOut",
  })
    .to(buttonElement, {
      scale: 1.02,
      duration: 0.2,
      ease: "elastic.out(1, 0.3)",
    })
    .to(buttonElement, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.3)",
    });
};

export const createSparkBurst = (buttonElement, isDarkMode = true) => {
  if (!buttonElement) return;

  const sparkCount = 12;
  const sparks = [];

  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement("div");
    spark.className = `absolute w-1 h-1 rounded-full pointer-events-none ${
      i % 3 === 0
        ? isDarkMode
          ? "bg-blue-400"
          : "bg-blue-500"
        : i % 3 === 1
        ? isDarkMode
          ? "bg-purple-400"
          : "bg-purple-500"
        : isDarkMode
        ? "bg-cyan-400"
        : "bg-cyan-500"
    }`;
    spark.style.left = "50%";
    spark.style.top = "50%";
    spark.style.transform = "translate(-50%, -50%)";
    spark.style.boxShadow = "0 0 6px currentColor";

    buttonElement.appendChild(spark);
    sparks.push(spark);
  }

  const tl = gsap.timeline({
    onComplete: () => {
      sparks.forEach((spark) => spark.remove());
    },
  });

  sparks.forEach((spark, index) => {
    const angle = (index / sparkCount) * Math.PI * 2;
    const distance = 60 + Math.random() * 40;

    tl.to(
      spark,
      {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0,
        opacity: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
      },
      0
    );
  });
};

export const createEnergyWave = (buttonElement) => {
  if (!buttonElement) return;

  const wave = document.createElement("div");
  wave.className =
    "absolute inset-0 rounded-2xl border-2 border-white/50 pointer-events-none";
  wave.style.transform = "scale(0)";

  buttonElement.appendChild(wave);

  const tl = gsap.timeline({
    onComplete: () => {
      wave.remove();
    },
  });

  tl.to(wave, {
    scale: 2,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });
};

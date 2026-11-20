"use client";

import React, { useEffect, useRef } from "react";

interface BackgroundProps {
  className?: string;
  particleCount?: number;
}

export const Background: React.FC<BackgroundProps> = ({
  className = "",
  particleCount = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let lastTime = performance.now();

    // Cache dimensions to avoid layout thrashing during scroll
    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || window.innerHeight);

    // Limit DPR to 2 for optimal 120Hz performance on mobile & retina screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    let cachedRect = canvas.getBoundingClientRect();
    const updateDimensions = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
      cachedRect = canvas.getBoundingClientRect();
    };

    window.addEventListener("resize", updateDimensions, { passive: true });

    // Update rect on scroll using a throttled/passive handler
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          if (canvas) cachedRect = canvas.getBoundingClientRect();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // IntersectionObserver to pause rendering when scrolled past hero
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            lastTime = performance.now();
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Smooth mouse position tracking
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 150,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX - cachedRect.left;
      mouse.targetY = e.clientY - cachedRect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    const colors = [
      "rgba(88, 68, 237,",   // Kraken Purple
      "rgba(123, 97, 255,",  // Vibrant Violet
      "rgba(14, 165, 233,",  // Cyan
      "rgba(99, 102, 241,",  // Indigo
    ] as const;

    class Particle {
      x: number;
      y: number;
      size: number;
      density: number;
      vy: number;
      vx: number;
      alpha: number;
      color: string;
      pulseAngle: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 1.2;
        this.density = Math.random() * 22 + 4;
        // Tuned for natural floating antigravity motion
        this.vy = -(Math.random() * 0.45 + 0.18);
        this.vx = (Math.random() - 0.5) * 0.25;
        this.alpha = Math.random() * 0.45 + 0.3;
        this.pulseAngle = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.025 + 0.015;
        this.color = colors[Math.floor(Math.random() * colors.length)] ?? colors[0];
      }

      update(dt: number) {
        // Delta-time normalization: constant speed at 60Hz, 120Hz, or 240Hz
        this.y += this.vy * dt;
        this.x += this.vx * dt;

        this.pulseAngle += this.pulseSpeed * dt;
        this.x += Math.sin(this.pulseAngle) * 0.2 * dt;

        // Wrap boundaries
        if (this.y < -12) {
          this.y = height + 12;
          this.x = Math.random() * width;
        }
        if (this.x < -12) this.x = width + 12;
        if (this.x > width + 12) this.x = -12;

        // Mouse interaction (smooth repulsion)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        const maxDistSq = mouse.radius * mouse.radius;

        if (distSq < maxDistSq && distSq > 0) {
          const distance = Math.sqrt(distSq);
          const force = (mouse.radius - distance) / mouse.radius;
          const forceX = (dx / distance) * force * this.density * 0.75 * dt;
          const forceY = (dy / distance) * force * this.density * 0.75 * dt;

          this.x -= forceX;
          this.y -= forceY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${this.alpha})`;
        ctx.fill();
      }
    }

    const calculatedCount = Math.min(
      Math.floor((width * height) / 16000),
      particleCount
    );
    const particles: Particle[] = [];
    for (let i = 0; i < calculatedCount; i++) {
      particles.push(new Particle());
    }

    // Batched single-call line drawing for 120Hz GPU efficiency
    const connectLines = () => {
      const maxDistance = 115;
      const maxDistSq = maxDistance * maxDistance;

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(88, 68, 237, 0.14)";
      ctx.beginPath();

      const pLen = particles.length;
      for (let a = 0; a < pLen; a++) {
        const pA = particles[a];
        if (!pA) continue;
        for (let b = a + 1; b < pLen; b++) {
          const pB = particles[b];
          if (!pB) continue;
          const dx = pA.x - pB.x;
          const dy = pA.y - pB.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
          }
        }
      }
      ctx.stroke();
    };

    // Main 120Hz animation loop
    const render = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Delta time in 60fps unit intervals
      const elapsed = currentTime - lastTime;
      lastTime = currentTime;
      const dt = Math.min(elapsed / 16.667, 2.0);

      // Smooth mouse interpolation
      if (mouse.targetX > -500) {
        mouse.x += (mouse.targetX - mouse.x) * 0.15 * dt;
        mouse.y += (mouse.targetY - mouse.y) * 0.15 * dt;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw web connection lines
      connectLines();

      // 2. Update and draw particles
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        if (p) {
          p.update(dt);
          p.draw();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={{
        transform: "translate3d(0,0,0)",
        willChange: "transform",
        contain: "layout style paint",
      }}
      aria-hidden="true"
    >
      {/* 1. Hardware-accelerated fluid ambient glow layers */}
      <div
        className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#5844ED]/15 via-[#8B5CF6]/10 to-transparent blur-3xl animate-[pulse_8s_ease-in-out_infinite]"
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform, opacity",
        }}
      />
      <div
        className="absolute top-[25%] right-[10%] w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#06B6D4]/12 via-[#3B82F6]/10 to-transparent blur-3xl animate-[pulse_10s_ease-in-out_infinite_2s]"
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform, opacity",
        }}
      />
      <div
        className="absolute bottom-[-5%] left-[30%] w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#EDE8FF]/30 via-[#F2EFFF]/20 to-transparent blur-3xl"
        style={{
          transform: "translate3d(0,0,0)",
        }}
      />

      {/* 2. Precision FinTech Engineering Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.40]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(88, 68, 237, 0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 85% 65% at 50% 35%, black 45%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 65% at 50% 35%, black 45%, transparent 85%)",
          transform: "translate3d(0,0,0)",
        }}
      />

      {/* 3. Subtle Concentric Gravitational Rings */}
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#5844ED]/[0.04]"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      />
      <div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-[#5844ED]/[0.03]"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      />

      {/* 4. Canvas with isolated hardware composite layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform",
        }}
      />
    </div>
  );
};

export default Background;

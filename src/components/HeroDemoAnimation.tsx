'use client';

import React, { useEffect, useRef } from 'react';

// Logical drawing size; the canvas backing store is scaled to the element's real size.
const SCENE_WIDTH = 1920;
const SCENE_HEIGHT = 1080;
const LOOP_SECONDS = 10;

const FORM_FIELDS = [
  { label: 'Full Name', value: 'Alex Morgan', type: 'text', stepTime: 3.8 },
  { label: 'Email Address', value: 'alex.morgan@dev.io', type: 'text', stepTime: 4.4 },
  { label: 'Phone Number', value: '+1 (555) 234-5678', type: 'text', stepTime: 5.0 },
  { label: 'Notice Period (Days)', value: '0', type: 'badge', stepTime: 5.6 },
  { label: 'Expected CTC (LPA)', value: '16', type: 'badge', stepTime: 6.2 },
  { label: 'Primary Tech Stack', value: 'Java 21 & Spring Boot 3 Microservices', type: 'radio', stepTime: 6.8 },
  { label: 'Graduation & GPA', value: '2023 | 3.9 GPA', type: 'text', stepTime: 7.4 },
  { label: 'RAG Debug Summary', value: 'Diagnosed Ollama token memory leak, dropping P99 latency by 64%.', type: 'rag', stepTime: 8.0 }
];

// Draws one frame of the scripted autofill demo at `elapsedSec` into a SCENE_WIDTH x SCENE_HEIGHT space.
function drawScene(elapsedSec: number, ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Clear Canvas
  ctx.clearRect(0, 0, width, height);

  // 1. Full Canvas Background: Authentic Light Lavender Google Forms background (#ede7f6)
  ctx.fillStyle = '#ede7f6';
  ctx.fillRect(0, 0, width, height);

  // 2. Top Laptop Browser Bar with 3 Window Control Dots
  const topBarHeight = 48;
  ctx.fillStyle = '#0f172a'; // Slate dark top browser bar
  ctx.fillRect(0, 0, width, topBarHeight);

  // Three Laptop Window Dots (Red, Yellow, Green)
  const dotY = topBarHeight / 2;
  const dotColors = ['#f43f5e', '#fbbf24', '#10b981'];
  dotColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(28 + i * 20, dotY, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Simulated URL in Browser Bar
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px monospace';
  ctx.fillText('docs.google.com/forms/d/e/1FAIpQLSc.../viewform', 96, dotY + 4);

  // Top Right Status Badge ("• Google Form Ready")
  const badgeW = 160;
  const badgeH = 28;
  const badgeX = width - badgeW - 24;
  const badgeY = (topBarHeight - badgeH) / 2;

  ctx.fillStyle = 'rgba(6, 78, 59, 0.8)';
  ctx.strokeStyle = '#047857';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14);
  ctx.fill();
  ctx.stroke();

  // Green dot
  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(badgeX + 18, dotY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Google Form Ready', badgeX + 28, dotY + 4);

  // Centered Google Form Column Width
  const paperW = Math.min(920, width - 360);
  const paperX = (width - paperW) / 2 - 120;

  // --- 1. TOP FORM HEADER CARD ---
  const headerY = topBarHeight + 20;
  const headerH = 175;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(paperX, headerY, paperW, headerH, 14);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Top Deep Purple Bar
  ctx.fillStyle = '#673ab7';
  ctx.beginPath();
  ctx.roundRect(paperX, headerY, paperW, 10, [14, 14, 0, 0]);
  ctx.fill();

  // Title & Description
  ctx.fillStyle = '#202124';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('AI & Full Stack SDE Application', paperX + 28, headerY + 44);

  ctx.fillStyle = '#3c4043';
  ctx.font = '13px sans-serif';
  ctx.fillText(
    "Join our engineering team to work on real-world AI products, automation, and production systems. If you love",
    paperX + 28,
    headerY + 70
  );
  ctx.fillText(
    "building, solving problems, and taking ownership from Day 1, we'd love to hear from you!",
    paperX + 28,
    headerY + 88
  );

  // Divider
  ctx.strokeStyle = '#dadce0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(paperX + 28, headerY + 104);
  ctx.lineTo(paperX + paperW - 28, headerY + 104);
  ctx.stroke();

  // Account Row
  ctx.fillStyle = '#202124';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('alex.morgan.dev@example.com', paperX + 28, headerY + 124);

  ctx.fillStyle = '#1a73e8';
  ctx.font = '12px sans-serif';
  ctx.fillText('Switch account', paperX + 215, headerY + 124);
  ctx.beginPath();
  ctx.moveTo(paperX + 215, headerY + 126);
  ctx.lineTo(paperX + 298, headerY + 126);
  ctx.stroke();

  ctx.fillStyle = '#70757a';
  ctx.font = '11px sans-serif';
  ctx.fillText(
    'The name, email, and photo associated with your Google account will be recorded when you upload files and submit this form',
    paperX + 28,
    headerY + 144
  );

  ctx.fillStyle = '#d93025';
  ctx.font = '12px sans-serif';
  ctx.fillText('* Indicates required question', paperX + 28, headerY + 162);
  ctx.restore();

  // --- 2. INDIVIDUAL QUESTION CARDS ---
  const cardStartY = headerY + headerH + 14;
  const availableH = height - cardStartY - 20;
  const cardH = Math.min(84, (availableH - 7 * 10) / 8);

  FORM_FIELDS.forEach((field, index) => {
    const qy = cardStartY + index * (cardH + 10);
    const isFieldFilled = elapsedSec >= field.stepTime;
    const isFieldCurrentlyFilling = elapsedSec >= field.stepTime - 0.4 && elapsedSec < field.stepTime;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.04)';
    ctx.shadowBlur = 6;
    
    // Active / Filled Card Border
    if (isFieldCurrentlyFilling) {
      ctx.strokeStyle = '#673ab7';
      ctx.lineWidth = 2;
    } else if (isFieldFilled) {
      ctx.strokeStyle = '#c8b7e8';
      ctx.lineWidth = 1;
    } else {
      ctx.strokeStyle = '#dadce0';
      ctx.lineWidth = 1;
    }

    ctx.beginPath();
    ctx.roundRect(paperX, qy, paperW, cardH, 12);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Active Left Purple Indicator Line
    if (isFieldCurrentlyFilling) {
      ctx.fillStyle = '#673ab7';
      ctx.beginPath();
      ctx.roundRect(paperX, qy, 6, cardH, [12, 0, 0, 12]);
      ctx.fill();
    }

    // Question Title Label
    ctx.fillStyle = '#202124';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`${field.label}`, paperX + 24, qy + 24);

    ctx.fillStyle = '#d93025';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('*', paperX + 24 + ctx.measureText(field.label).width + 4, qy + 24);

    // AI Answer Pill Button on top-right of card
    const aiBtnW = 92;
    const aiBtnH = 24;
    const aiBtnX = paperX + paperW - aiBtnW - 20;
    const aiBtnY = qy + 14;

    ctx.fillStyle = isFieldFilled ? '#f3e8fd' : '#fef0ff';
    ctx.strokeStyle = isFieldFilled ? '#e1bee7' : '#f06292';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(aiBtnX, aiBtnY, aiBtnW, aiBtnH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#673ab7';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(isFieldFilled ? '✓ AI Answer' : '✦ AI Answer', aiBtnX + 14, aiBtnY + 16);

    // Input Line & Value
    const inputY = qy + cardH - 22;
    if (isFieldFilled) {
      ctx.fillStyle = '#202124';
      ctx.font = '500 13px sans-serif';
      ctx.fillText(field.value, paperX + 24, inputY - 4);
    } else if (isFieldCurrentlyFilling) {
      ctx.fillStyle = '#673ab7';
      ctx.font = 'italic 12px sans-serif';
      ctx.fillText('AI Reading column & synthesizing answer...', paperX + 24, inputY - 4);
    } else {
      ctx.fillStyle = '#70757a';
      ctx.font = '13px sans-serif';
      ctx.fillText('Your answer', paperX + 24, inputY - 4);
    }

    // Underline Input Line
    ctx.strokeStyle = isFieldCurrentlyFilling ? '#673ab7' : '#dadce0';
    ctx.lineWidth = isFieldCurrentlyFilling ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(paperX + 24, inputY);
    ctx.lineTo(paperX + paperW - 24, inputY);
    ctx.stroke();
    ctx.restore();
  });

  // --- ACTUAL FLOATING DOCK IN RIGHT BOTTOM CORNER ---
  const dockW = 280;
  const dockH = 190;
  const dockX = width - dockW - 40;
  const dockY = height - dockH - 40;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#1e2538';
  ctx.beginPath();
  ctx.roundRect(dockX, dockY, dockW, dockH, 20);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(dockX, dockY, dockW, dockH, 20);
  ctx.stroke();

  // 1. Top Drawer Pill: Target JD
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(dockX + 12, dockY + 12, dockW - 24, 28, 14);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('📄 Target JD', dockX + 24, dockY + 30);
  ctx.fillText('∨', dockX + dockW - 32, dockY + 30);

  // 2. Profile Selector Row
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(dockX + 12, dockY + 46, dockW - 24, 30, 15);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('Java profile', dockX + 24, dockY + 65);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('∨', dockX + dockW - 32, dockY + 65);

  // 3. Engine Row + Power Toggle Button
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(dockX + 12, dockY + 82, dockW - 60, 30, 15);
  ctx.fill();
  
  // Green dot
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(dockX + 24, dockY + 97, 4, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('gemini-3.5-flas...', dockX + 34, dockY + 101);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('∨', dockX + dockW - 68, dockY + 101);

  // Power icon button
  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.arc(dockX + dockW - 27, dockY + 97, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⏻', dockX + dockW - 27, dockY + 101);
  ctx.textAlign = 'left';

  // 4. Target Auto-Fill Pill Button (Bottom Row)
  const btnX = dockX + 12;
  const btnY = dockY + 120;
  const btnW = dockW - 58;
  const btnH = 42;
  const btnRadius = 21;

  const isFillingProcess = elapsedSec >= 3.2 && elapsedSec < 8.5;
  const isCompleted = elapsedSec >= 8.5;

  if (isCompleted) {
    ctx.fillStyle = '#059669';
  } else if (isFillingProcess) {
    ctx.fillStyle = '#4f46e5';
  } else {
    ctx.fillStyle = '#6366f1';
  }

  ctx.save();
  if (elapsedSec >= 2.8 && elapsedSec < 3.4) {
    ctx.shadowColor = 'rgba(99, 102, 241, 0.9)';
    ctx.shadowBlur = 20;
  }
  ctx.beginPath();
  ctx.roundRect(btnX, btnY, btnW, btnH, btnRadius);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  if (isCompleted) {
    ctx.fillText('✓ 100% Filled', btnX + btnW / 2, btnY + 26);
  } else if (isFillingProcess) {
    ctx.fillText('Auto-Filling...', btnX + btnW / 2, btnY + 26);
  } else {
    ctx.fillText('✦ Auto-Fill', btnX + btnW / 2, btnY + 26);
  }
  ctx.textAlign = 'left';

  // Settings gear button
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.arc(dockX + dockW - 27, btnY + btnH / 2, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚙', dockX + dockW - 27, btnY + btnH / 2 + 5);
  ctx.textAlign = 'left';

  // Click Ripple Animation on Auto-Fill Button
  if (elapsedSec >= 3.2 && elapsedSec < 4.0) {
    const rippleProgress = (elapsedSec - 3.2) / 0.8;
    const rippleRadius = rippleProgress * 80;
    const alpha = 1 - rippleProgress;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(btnX + btnW / 2, btnY + btnH / 2, rippleRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. ANIMATED CURSOR TRAJECTORY (smooth eased glide)
  // Motion timeline:
  // 0s - 1.2s: Cursor stays at top right area (x: width * 0.85, y: height * 0.25)
  // 1.2s - 3.2s: Bezier curve glide toward the Auto-Fill Form button (btnX + btnW/2, btnY + btnH/2)
  // 3.2s - 3.6s: Click action at button location
  // 3.6s - 10s: Cursor retreats gracefully to bottom right holding position

  let cursorX = width * 0.85;
  let cursorY = height * 0.25;
  const targetX = btnX + btnW / 2;
  const targetY = btnY + btnH / 2;

  if (elapsedSec < 1.2) {
    cursorX = width * 0.82;
    cursorY = height * 0.22;
  } else if (elapsedSec >= 1.2 && elapsedSec < 3.2) {
    // Cubic Bezier interpolation
    const t = (elapsedSec - 1.2) / 2.0;
    // Smooth step easing function
    const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const p0 = { x: width * 0.82, y: height * 0.22 };
    const p1 = { x: width * 0.5, y: height * 0.15 };
    const p2 = { x: targetX + 100, y: targetY - 100 };
    const p3 = { x: targetX, y: targetY };

    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    cursorX = ax * Math.pow(easeT, 3) + bx * Math.pow(easeT, 2) + cx * easeT + p0.x;
    cursorY = ay * Math.pow(easeT, 3) + by * Math.pow(easeT, 2) + cy * easeT + p0.y;
  } else if (elapsedSec >= 3.2 && elapsedSec < 3.8) {
    cursorX = targetX;
    cursorY = targetY;
  } else {
    // Rest position
    const retreatT = Math.min(1, (elapsedSec - 3.8) / 1.5);
    const easeRetreat = 1 - Math.pow(1 - retreatT, 3);
    cursorX = targetX + easeRetreat * (width * 0.78 - targetX);
    cursorY = targetY + easeRetreat * (height * 0.75 - targetY);
  }

  // Motion Trail / Glow behind cursor
  if (elapsedSec >= 1.2 && elapsedSec < 4.0) {
    const trailGlow = ctx.createRadialGradient(cursorX, cursorY, 2, cursorX, cursorY, 24);
    trailGlow.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
    trailGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = trailGlow;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Realistic OS Cursor Pointer (SVG style path on Canvas)
  ctx.save();
  ctx.translate(cursorX, cursorY);
  
  // Scale slightly on click
  if (elapsedSec >= 3.2 && elapsedSec < 3.5) {
    ctx.scale(0.85, 0.85);
  }

  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  // Outer Cursor Border (White)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 22);
  ctx.lineTo(5.5, 16.5);
  ctx.lineTo(11, 25);
  ctx.lineTo(14.5, 23.5);
  ctx.lineTo(9, 15);
  ctx.lineTo(17, 15);
  ctx.closePath();
  ctx.fill();

  // Inner Cursor Body (Black/Slate)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(2, 3);
  ctx.lineTo(2, 18);
  ctx.lineTo(6.5, 14);
  ctx.lineTo(11.5, 22);
  ctx.lineTo(13, 21);
  ctx.lineTo(8, 13);
  ctx.lineTo(14, 13);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Looping canvas animation of Fillvyn filling a Google Form. It only runs while
 * on screen and the tab is visible, and shows the finished frame when the visitor
 * prefers reduced motion.
 */
export default function HeroDemoAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId: number | null = null;
    let isVisible = false;
    let startedAt: number | null = null;
    let elapsedAtPause = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.min(SCENE_WIDTH, Math.round(canvas.clientWidth * dpr)) || SCENE_WIDTH;
      canvas.width = targetWidth;
      canvas.height = Math.round((targetWidth * SCENE_HEIGHT) / SCENE_WIDTH);
      ctx.setTransform(canvas.width / SCENE_WIDTH, 0, 0, canvas.height / SCENE_HEIGHT, 0, 0);
    };

    const drawAt = (seconds: number) => drawScene(seconds, ctx, SCENE_WIDTH, SCENE_HEIGHT);

    const tick = (now: number) => {
      if (startedAt === null) startedAt = now - elapsedAtPause * 1000;
      const elapsed = ((now - startedAt) / 1000) % LOOP_SECONDS;
      elapsedAtPause = elapsed;
      drawAt(elapsed);
      frameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      startedAt = null;
    };

    const update = () => {
      const shouldRun = isVisible && !document.hidden && !reducedMotion.matches;
      if (shouldRun && frameId === null) {
        frameId = requestAnimationFrame(tick);
      } else if (!shouldRun) {
        stop();
        // Static fallback: the completed form tells the story without motion.
        drawAt(reducedMotion.matches ? LOOP_SECONDS - 0.5 : elapsedAtPause);
      }
    };

    resize();
    drawAt(0);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      update();
    });
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (frameId === null) drawAt(reducedMotion.matches ? LOOP_SECONDS - 0.5 : elapsedAtPause);
    });
    resizeObserver.observe(canvas);

    document.addEventListener('visibilitychange', update);
    reducedMotion.addEventListener('change', update);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, []);

  return (
    <div className="w-full aspect-video rounded-3xl bg-[#ede7f6] overflow-hidden border border-purple-200/80 shadow-2xl relative">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Animated demo: the cursor clicks Fillvyn's Auto-Fill button and a Google Form job application fills in with name, contact details, notice period, expected salary, tech stack and a resume-based answer."
        className="w-full h-full object-contain block"
      />
    </div>
  );
}

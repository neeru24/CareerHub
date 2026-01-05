"use client"

import { Suspense, useEffect } from "react"
import DashboardContent from "./dashboard-content"
import { Loader } from "lucide-react"

export default function DashboardPage() {
  // Cursor trail effect
  useEffect(() => {
    const container = document.getElementById("cursor-trail");
    if (!container) return;

    type TrailCircle = HTMLDivElement & { x: number; y: number };
    const NUM_CIRCLES = 15;
    const circles: TrailCircle[] = [];

    for (let i = 0; i < NUM_CIRCLES; i++) {
      const circle = document.createElement("div") as TrailCircle;
      circle.className = "circle";
      if (i === NUM_CIRCLES - 1) circle.classList.add("glow");
      circle.style.opacity = String(1 - i / NUM_CIRCLES);

      circle.x = 0;
      circle.y = 0;

      container.appendChild(circle);
      circles.push(circle);
    }

    const coords = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      coords.x = e.clientX;
      coords.y = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      let x = coords.x;
      let y = coords.y;

      circles.forEach((circle, index) => {
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        circle.style.transform = `translate(-50%, -50%) scale(${1 - index * 0.05})`;

        const next = circles[index + 1] || circles[0];
        circle.x = x;
        circle.y = y;

        x += (next.x - x) * 0.3;
        y += (next.y - y) * 0.3;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      container.innerHTML = "";
    };
  }, []);

  return (
    <>
      {/* Cursor Trail Container */}
      <div id="cursor-trail" className="circle-container" />
      
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center fade-in">
            {/* Cursor Trail Container in fallback */}
            <div id="cursor-trail" className="circle-container" />
            <div className="glassmorphic p-8 rounded-2xl border-foreground/10 scale-in">
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 text-foreground animate-spin" />
                <span className="text-foreground font-medium">Loading dashboard...</span>
              </div>
            </div>
            
            {/* Cursor Trail Styles for fallback */}
            <style jsx global>{`
              .circle-container {
                position: fixed;
                inset: 0;
                pointer-events: none;
                z-index: 9999;
              }

              .circle {
                position: absolute;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: radial-gradient(
                  circle,
                  rgba(255, 220, 100, 0.8) 0%,
                  rgba(255, 160, 40, 0.4) 70%,
                  rgba(255, 100, 0, 0) 100%
                );
                box-shadow: 0 0 8px rgba(255, 200, 50, 0.5);
                transform: translate(-50%, -50%);
                will-change: transform, left, top;
              }

              .circle.glow {
                width: 28px;
                height: 28px;
                background: radial-gradient(
                  circle,
                  rgba(255, 200, 50, 0.4) 0%,
                  rgba(255, 150, 30, 0.1) 70%,
                  rgba(255, 100, 0, 0) 100%
                );
                box-shadow: 0 0 18px rgba(255, 180, 50, 0.3);
                opacity: 0.5;
              }
            `}</style>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
      
      {/* Cursor Trail Styles for main content */}
      <style jsx global>{`
        .circle-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
        }

        .circle {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 220, 100, 0.8) 0%,
            rgba(255, 160, 40, 0.4) 70%,
            rgba(255, 100, 0, 0) 100%
          );
          box-shadow: 0 0 8px rgba(255, 200, 50, 0.5);
          transform: translate(-50%, -50%);
          will-change: transform, left, top;
        }

        .circle.glow {
          width: 28px;
          height: 28px;
          background: radial-gradient(
            circle,
            rgba(255, 200, 50, 0.4) 0%,
            rgba(255, 150, 30, 0.1) 70%,
            rgba(255, 100, 0, 0) 100%
          );
          box-shadow: 0 0 18px rgba(255, 180, 50, 0.3);
          opacity: 0.5;
        }
      `}</style>
    </>
  )
}
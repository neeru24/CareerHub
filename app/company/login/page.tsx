"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function CompanyLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate company authentication
      if (formData.email && formData.password.length >= 6) {
        // Store company data in localStorage
        const companyData = {
          email: formData.email,
          companyLoggedIn: true,
          isCompany: true,
        };
        localStorage.setItem("companyUser", JSON.stringify(companyData));
        router.push("/company/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 fade-in">
      {/* Cursor Trail Container */}
      <div id="cursor-trail" className="circle-container" />
      
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Form Container */}
        <div className="glassmorphic p-8 rounded-2xl border-foreground/10 scale-in">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-lg bg-foreground/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-foreground" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground text-center mb-2">Company Login</h1>
          <p className="text-muted-foreground text-center mb-8">Access your company dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <Label className="text-foreground mb-2">Company Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="company@name.com"
                  className="pl-10 w-full glass-input"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <Label className="text-foreground mb-2">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 w-full glass-input"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full glassmorphic-button-primary font-semibold"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-foreground/10" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/company/signup" className="text-foreground font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      
      {/* Cursor Trail Styles */}
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
    </main>
  );
}
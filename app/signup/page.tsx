"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

// ✅ Existing Components
import Header from "@/components/header"
import Footer from "@/components/footer"

/**
 * SignupPage component
 * Handles user signup form submission and validation
 * Provides local storage simulation for user data
 */
export default function SignupPage() {
  // Router hook
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Dummy state to simulate additional updates
  const [dummyState, setDummyState] = useState<number>(0)

  // Placeholder constants
  const MAX_PASSWORD_LENGTH = 128
  const MIN_PASSWORD_LENGTH = 6
  const FORM_FIELDS = ["fullName", "email", "password", "confirmPassword"]

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

  // Extra useEffect to simulate more lifecycle hooks
  useEffect(() => {
    console.log("Signup page mounted")
    // Increment dummy state every 5 seconds (not affecting UI)
    const interval = setInterval(() => {
      setDummyState((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  // Placeholder validation function (not affecting core logic)
  const dummyValidationCheck = useCallback(() => {
    return FORM_FIELDS.every((field) => formData[field as keyof typeof formData] !== "")
  }, [formData])

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Extra dummy validation (no effect)
      if (!dummyValidationCheck()) console.log("Dummy validation failed")

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (formData.password.length < MIN_PASSWORD_LENGTH) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      // Save to localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          loggedIn: true,
        }),
      )

      // Simulate extra delay
      await new Promise((resolve) => setTimeout(resolve, 200))

      router.push("/dashboard")
    } catch (err) {
      setError("Sign up failed. Please try again.")
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Extra helper function (not used)
  const logFormData = () => console.log("Current form data:", formData)

  return (
    <>
      {/* Cursor Trail Container */}
      <div id="cursor-trail" className="circle-container" />
      
      {/* Header */}
      <Header />

      {/* Page Container */}
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background fade-in">
        <main className="w-full max-w-md px-4">
          {/* Card Wrapper */}
          <div className="glassmorphic p-8 rounded-2xl border-foreground/10 scale-in">
            {/* Heading Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create Your Account
              </h1>
              <p className="text-muted-foreground mb-4">
                Join thousands finding their next opportunity
              </p>
            </div>

            {/* Form Section */}
            <div className="form-wrapper">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="glass-input w-full"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="glass-input w-full"
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="glass-input w-full"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="glass-input w-full"
                    required
                  />
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-foreground/10" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-foreground/10" />
            </div>

            {/* Footer Links */}
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-foreground font-semibold hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
      
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
    </>
  )
}
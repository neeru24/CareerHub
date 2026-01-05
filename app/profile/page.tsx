"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Mail, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface UserProfile {
  fullName: string;
  email: string;
  profileImage: string | null;
  skills: string[];
  interests: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Original useEffect for loading user profile
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      const profileData = localStorage.getItem("userProfile");
      const profile = profileData ? JSON.parse(profileData) : null;

      const userProfile: UserProfile = {
        fullName: userData.fullName || userData.email.split("@")[0],
        email: userData.email,
        profileImage: profile?.profileImage || null,
        skills: profile?.skills ? profile.skills.split(',').map((s: string) => s.trim()) : [],
        interests: profile?.interests || "",
      };

      setUser(userProfile);
    } catch {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {/* Cursor Trail Container */}
        <div id="cursor-trail" className="circle-container" />
        <div className="text-foreground">Loading...</div>
        
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
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {/* Cursor Trail Container */}
        <div id="cursor-trail" className="circle-container" />
        <div className="text-foreground">User not found</div>
        
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
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Cursor Trail Container */}
      <div id="cursor-trail" className="circle-container" />
      
      <Header />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="glassmorphic mb-8">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-foreground/10"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-foreground/10">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-foreground">{user.fullName}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    User
                  </Badge>
                </div>
              </div>
              
              <div>
                <Link href="/profile/edit">
                  <Button className="flex items-center gap-2 glassmorphic-button-primary">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Section */}
            <Card className="glassmorphic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No skills added yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Interests Section */}
            <Card className="glassmorphic">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Career Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.interests ? (
                  <p className="text-foreground">{user.interests}</p>
                ) : (
                  <p className="text-muted-foreground">No career interests specified.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
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
    </main>
  );
}
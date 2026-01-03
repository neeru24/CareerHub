"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

/** ---------------------------
 * Navigation Links Configuration
 * --------------------------- */
const DESKTOP_LINKS = [
  { name: "Browse", href: "/browse" }, // always go to BrowsePage
  { name: "Assessments", href: "/assessments" },
  { name: "Success Stories", hash: "testimonials" },
  { name: "Plans", hash: "pricing" },
];

// Mobile nav links are identical but kept separate for future flexibility
const MOBILE_LINKS = [...DESKTOP_LINKS];

/** ---------------------------
 * Helper Functions
 * --------------------------- */

/** Smooth scroll to a section by ID */
const scrollToSection = (hash: string) => {
  const element = document.getElementById(hash);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

/** Generate link classes for desktop links */
const getDesktopLinkClass = (): string =>
  "relative text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1 rounded-md hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 font-medium tracking-wide";

/** Generate link classes for mobile links */
const getMobileLinkClass = (): string =>
  "text-foreground hover:text-muted-foreground transition-colors duration-300 transform hover:translate-x-1 hover:shadow-sm px-2 py-1 rounded-md";

/** ---------------------------
 * Header Component
 * --------------------------- */
export default function Header() {
  /** Mobile menu open state */
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /** Current page pathname */
  const pathname = usePathname();

  /** ---------------------------
   * Section navigation handler
   * --------------------------- */
  const handleSectionClick = (hash: string) => {
    if (pathname === "/") {
      // Scroll smoothly if on homepage
      scrollToSection(hash);
    } else {
      // Navigate to homepage with hash if on other pages
      window.location.href = `/#${hash}`;
    }
  };

  /** ---------------------------
   * Smooth scroll if page loads with hash
   * --------------------------- */
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      scrollToSection(id);
    }
  }, [pathname]);

  /** ---------------------------
   * Sub-components
   * --------------------------- */

  /** Desktop Navigation Links */
  const DesktopNav = () => {
    const renderLink = (link: typeof DESKTOP_LINKS[number]) => {
      if (link.href) {
        // Use Next.js Link for actual page navigation
        return (
          <Link key={link.name} href={link.href} className={getDesktopLinkClass()}>
            {link.name}
          </Link>
        );
      } else {
        // Smooth scroll for sections
        return (
          <button
            key={link.name}
            className={getDesktopLinkClass()}
            onClick={() => handleSectionClick(link.hash!)}
          >
            {link.name}
          </button>
        );
      }
    };

    return (
      <div className="hidden md:flex items-center gap-10 desktop-nav-wrapper">
        {DESKTOP_LINKS.map((link) => (
          <div key={link.name} className="desktop-nav-item">
            {renderLink(link)}
          </div>
        ))}
      </div>
    );
  };

  /** Mobile Navigation Links */
  const MobileNav = () => {
    const renderMobileLink = (link: typeof MOBILE_LINKS[number]) => {
      if (link.href) {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={getMobileLinkClass()}
            onClick={() => setIsOpen(false)}
          >
            {link.name}
          </Link>
        );
      } else {
        return (
          <button
            key={link.name}
            className={getMobileLinkClass()}
            onClick={() => {
              handleSectionClick(link.hash!);
              setIsOpen(false);
            }}
          >
            {link.name}
          </button>
        );
      }
    };

    return (
      <div className="absolute top-20 left-0 right-0 glassmorphic border-b p-4 md:hidden rounded-b-xl shadow-lg backdrop-blur-md slide-down-animation mobile-nav-wrapper">
        <div className="flex flex-col gap-4 mobile-links-wrapper">
          {MOBILE_LINKS.map((link) => (
            <div key={link.name} className="mobile-link-item">
              {renderMobileLink(link)}
            </div>
          ))}

          {/* Mobile CTA Buttons */}
          <div className="flex gap-2 pt-4 mobile-cta-wrapper">
            <ThemeToggle />

            <Link href="/login" className="flex-1">
              <Button
                variant="outline"
                className="w-full bg-transparent hover:opacity-80 transition duration-300"
              >
                Sign In
              </Button>
            </Link>

            <Link href="/signup" className="flex-1">
              <Button className="w-full glassmorphic-button-primary text-black shadow-lg hover:scale-105 hover:shadow-xl hover:ring-1 hover:ring-primary/50 transition-all duration-300">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  /** ---------------------------
   * Render Main Header
   * --------------------------- */
  return (
    <header className="sticky top-0 z-50 glassmorphic border-b shadow-md backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo Section */}
        <div className="flex items-center gap-2 logo-wrapper">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-foreground/20 flex items-center justify-center font-bold text-lg shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300">
              C
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline tracking-wider group-hover:opacity-90 transition-opacity duration-300">
              CareerHub
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <DesktopNav />

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 desktop-cta-wrapper">
          <ThemeToggle />
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-foreground hover:bg-foreground/10 transition duration-300"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="glassmorphic-button-primary text-black shadow-lg hover:scale-105 hover:shadow-xl hover:ring-1 hover:ring-primary/50 transition-all duration-300">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-button md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} className="transition-transform duration-300 group-hover:-rotate-12" />
            ) : (
              <Menu size={24} className="transition-transform duration-300 group-hover:rotate-12" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <MobileNav />}
      </nav>
    </header>
  );
}

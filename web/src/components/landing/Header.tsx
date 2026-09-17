"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#022C22]/90 backdrop-blur-md px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">

        {/* Left Side: Logo & Desktop Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 text-3xl font-black text-white font-sans tracking-tight hover:opacity-80 transition-opacity">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#84CC16] shadow-md shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L4 7L12 12L20 7L12 2Z" />
                <path d="M4 12L12 17L20 12" className="opacity-70" />
                <path d="M4 17L12 22L20 17" className="opacity-40" />
              </svg>
            </div>
            Kabisado
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-white dark:text-foreground/80 hover:text-white dark:hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-white dark:text-foreground/80 hover:text-white dark:hover:text-foreground transition-colors">How it works</Link>
            <Link href="/chat" className="text-white dark:text-foreground/80 hover:text-white dark:hover:text-foreground transition-colors">Try AI Chat</Link>
            <Link href="/buttons" className="text-emerald-300 hover:text-white transition-colors flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Motion Lab
            </Link>
          </nav>
        </div>

        {/* Right Side: Desktop Buttons & Mobile Toggle */}
        <div className="flex flex-row items-center gap-4">
          <div className="hidden md:flex items-center gap-4 relative">
            <ThemeToggle />
            <button className="px-6 py-3 rounded-lg bg-transparent hover:bg-white/10 transition-colors font-mono ml-2">
              <span className="text-base font-semibold text-white">Login</span>
            </button>
            <button className="rounded-lg bg-[#22C55E] px-6 py-3 hover:bg-[#16a34a] transition-colors font-mono">
              <span className="text-base font-semibold text-white">Register</span>
            </button>
          </div>

          {/* Hamburger Menu Toggle (Mobile Only) */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-4 shadow-lg">
          <nav className="flex flex-col gap-2">
            <Link
              href="/chat"
              className="px-4 py-3 text-base font-semibold text-foreground hover:bg-muted rounded-lg font-mono"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chat
            </Link>
            <Link
              href="/flashcards"
              className="px-4 py-3 text-base font-semibold text-foreground hover:bg-muted rounded-lg font-mono"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Flashcards
            </Link>
            <Link
              href="/quizzes"
              className="px-4 py-3 text-base font-semibold text-foreground hover:bg-muted rounded-lg font-mono"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Quizzes
            </Link>
            <Link
              href="/buttons"
              className="px-4 py-3 text-base font-semibold text-emerald-500 hover:bg-muted rounded-lg font-mono flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Motion Lab
            </Link>
          </nav>
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <button className="w-full px-5 py-3 rounded-lg hover:bg-muted transition-colors font-mono text-center">
              <span className="text-base font-semibold text-foreground">Login</span>
            </button>
            <button className="w-full rounded-lg bg-foreground px-5 py-3 hover:bg-gray-800 transition-colors font-mono text-center">
              <span className="text-base font-semibold text-background">Register</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

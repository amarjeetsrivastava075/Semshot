"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Menu,
  Sparkles,
  Target,
  Trophy,
  Zap,
  X,
  Layers3,
  Play,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description:
      "Generate smart questions and understand difficult concepts with AI-powered assistance.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: FileText,
    title: "Smart Notes",
    description:
      "Keep your study material organized and access your important notes anytime.",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: Target,
    title: "MCQ Practice",
    description:
      "Improve your preparation with topic-wise MCQs and instant performance feedback.",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: ClipboardList,
    title: "Mock Exams",
    description:
      "Experience timed tests and evaluate your preparation before the real examination.",
    color: "from-orange-500 to-amber-400",
  },
  {
    icon: BookOpen,
    title: "PYQ Preparation",
    description:
      "Practice previous year questions and understand important examination patterns.",
    color: "from-pink-500 to-rose-400",
  },
  {
    icon: Layers3,
    title: "Syllabus Management",
    description:
      "Organize your university, course, branch, semester and subjects in one place.",
    color: "from-indigo-500 to-blue-400",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose Your Academic Profile",
    description:
      "Select your university, course, branch and semester to personalize your learning.",
  },
  {
    number: "02",
    title: "Explore Your Study Material",
    description:
      "Access subjects, notes, MCQs, previous year questions and AI-powered tools.",
  },
  {
    number: "03",
    title: "Practice. Improve. Succeed.",
    description:
      "Attempt mock exams, track your performance and prepare with confidence.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#06070b] text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.07] bg-[#06070b]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">
              Sem<span className="text-blue-400">Shot</span>
            </span>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            <a href="#features" className="text-sm text-zinc-400 transition hover:text-white">Features</a>
            <a href="#how-it-works" className="text-sm text-zinc-400 transition hover:text-white">How it works</a>
            <a href="#about" className="text-sm text-zinc-400 transition hover:text-white">About</a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white">
              Login
            </Link>
            <Link href="/signup" className="group flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500">
              Get Started
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg border border-white/10 p-2 md:hidden" aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#090a10] p-5 md:hidden">
            <div className="flex flex-col gap-5">
              <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
              <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
              <Link href="/login">Login</Link>
              <Link href="/signup" className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative px-5 pb-24 pt-40 sm:px-8 sm:pt-48">
        <div className="pointer-events-none absolute left-1/2 top-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="pointer-events-none absolute right-0 top-64 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex animate-[fadeIn_0.8s_ease-out] items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-5 py-2.5 text-sm text-blue-300">
              <Sparkles className="h-4 w-4" />
              Your smarter way to prepare for exams
              <ChevronRight className="h-4 w-4" />
            </div>

            <h1 className="mt-9 text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-8xl">
              Your Exams.
              <br />
              Your Preparation.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Your Success.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              Everything you need for university exam preparation — notes,
              previous year questions, MCQs, mock tests and AI-powered learning.
              All in one place.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="group flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-bold shadow-xl shadow-blue-600/25 transition duration-300 hover:-translate-y-1 hover:bg-blue-500">
                Start Learning Free
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <a href="#features" className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-8 py-4 font-semibold text-zinc-200 transition hover:bg-white/[0.08]">
                <Play className="h-4 w-4 text-blue-400" />
                Explore Features
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-zinc-500">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Personalized learning</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Exam-focused preparation</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> One learning platform</span>
            </div>
          </div>

          <div className="relative mx-auto mt-24 max-w-5xl">
            <div className="absolute -inset-5 rounded-[35px] bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-violet-600/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10121a] shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-medium text-zinc-500">SEMSHOT / STUDENT DASHBOARD</span>
                <Sparkles className="h-4 w-4 text-blue-400" />
              </div>

              <div className="grid md:grid-cols-[210px_1fr]">
                <aside className="hidden border-r border-white/[0.07] p-5 md:block">
                  <div className="mb-9 flex items-center gap-2 text-lg font-bold">
                    <GraduationCap className="text-blue-400" /> SemShot
                  </div>
                  {["Dashboard", "My Subjects", "Study Notes", "Practice MCQs", "Mock Exams"].map((item, index) => (
                    <div key={item} className={`mb-2 flex items-center gap-3 rounded-lg px-3 py-3 text-xs ${index === 0 ? "bg-blue-500/15 text-blue-300" : "text-zinc-500"}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {item}
                    </div>
                  ))}
                </aside>

                <div className="p-5 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-zinc-500">WELCOME TO YOUR LEARNING SPACE</p>
                      <h3 className="mt-2 text-xl font-bold sm:text-2xl">Your preparation starts here.</h3>
                    </div>
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs text-blue-300">
                      <Sparkles className="mr-2 inline h-4 w-4" /> AI Powered
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      ["Subjects", "Explore", BookOpen],
                      ["Study Notes", "Organized", FileText],
                      ["Practice", "Improve", Target],
                      ["Mock Exams", "Evaluate", Trophy],
                    ].map(([title, subtitle, Icon]) => {
                      const FeatureIcon = Icon as typeof BookOpen;
                      return (
                        <div key={title as string} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                          <FeatureIcon className="h-5 w-5 text-blue-400" />
                          <p className="mt-5 text-sm font-semibold">{title as string}</p>
                          <p className="mt-1 text-xs text-zinc-500">{subtitle as string}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Study smarter</span>
                        <Brain className="h-5 w-5 text-violet-400" />
                      </div>
                      <div className="mt-5 h-2 rounded-full bg-white/10">
                        <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                      </div>
                      <p className="mt-3 text-xs text-zinc-500">Build a consistent study routine.</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-blue-600/15 to-violet-600/10 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">AI Exam Engine</span>
                        <Zap className="h-5 w-5 text-yellow-400" />
                      </div>
                      <p className="mt-3 text-xs leading-6 text-zinc-400">Practice with questions based on your syllabus.</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-300">Explore SemShot <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative border-t border-white/[0.06] px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">Everything in one place</span>
            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              One platform. <span className="text-blue-400">Every advantage.</span>
            </h2>
            <p className="mt-5 leading-7 text-zinc-400">A complete toolkit designed to make university exam preparation more organized and effective.</p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 transition duration-500 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-white/[0.045]">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg transition duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="mt-7 block text-xs font-bold tracking-widest text-zinc-600">0{index + 1}</span>
                  <h3 className="mt-2 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{feature.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-400">Explore feature <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-white/[0.06] bg-[#090b12] px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">Simple process</span>
            <h2 className="mt-5 text-4xl font-black sm:text-5xl">Get started in <span className="text-blue-400">3 steps.</span></h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8">
                <div className="text-5xl font-black text-blue-500/30">{step.number}</div>
                <h3 className="mt-7 text-xl font-bold">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">{step.description}</p>
                {index !== 2 && <ArrowRight className="absolute right-7 top-10 hidden h-5 w-5 text-blue-400/50 md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-5 py-28 sm:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-950/60 via-[#111321] to-violet-950/50 px-7 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
              <GraduationCap className="h-9 w-9 text-blue-300" />
            </div>
            <h2 className="mx-auto mt-8 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Make every study session <span className="text-blue-300">count.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl leading-8 text-zinc-400">
              Your next semester deserves a smarter preparation strategy. Start organizing your learning with SemShot.
            </p>
            <Link href="/signup" className="mt-9 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-bold shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500">
              Get Started Now <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 text-xl font-black">
            <GraduationCap className="h-6 w-6 text-blue-400" />
            Sem<span className="text-blue-400">Shot</span>
          </Link>
          <p className="text-center text-sm text-zinc-500">Learn smarter. Prepare better. Achieve more.</p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/login" className="transition hover:text-white">Login</Link>
            <Link href="/signup" className="transition hover:text-white">Sign Up</Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-700">© {new Date().getFullYear()} SemShot. All rights reserved.</p>
      </footer>
    </main>
  );
}

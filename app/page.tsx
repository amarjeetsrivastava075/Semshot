"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers3,
  Menu,
  Play,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
  ShieldCheck,
  Clock3,
  ChartNoAxesCombined,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Smart Study Notes",
    description:
      "Access organized notes for your subjects and prepare every topic with clarity.",
    tag: "STUDY MATERIAL",
  },
  {
    icon: FileText,
    title: "Previous Year Questions",
    description:
      "Practice previous year questions and understand your university exam pattern.",
    tag: "PYQ LIBRARY",
  },
  {
    icon: BrainCircuit,
    title: "AI Question Generator",
    description:
      "Generate subject-wise and unit-wise questions with the power of AI.",
    tag: "AI POWERED",
  },
  {
    icon: Target,
    title: "Smart MCQ Practice",
    description:
      "Improve your accuracy with topic-wise MCQs and instant feedback.",
    tag: "PRACTICE",
  },
  {
    icon: GraduationCap,
    title: "Mock Examinations",
    description:
      "Experience timed examinations and evaluate your preparation.",
    tag: "EXAM READY",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Performance Tracking",
    description:
      "Track your progress, identify weak topics and improve consistently.",
    tag: "ANALYTICS",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your academic profile",
    description:
      "Select your university, course, branch and semester to get relevant study resources.",
    icon: GraduationCap,
  },
  {
    number: "02",
    title: "Explore learning resources",
    description:
      "Find notes, subjects, PYQs, MCQs and AI-generated exam questions.",
    icon: Layers3,
  },
  {
    number: "03",
    title: "Practice and improve",
    description:
      "Attempt mock exams, evaluate your performance and prepare smarter.",
    icon: Trophy,
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-[900px] -left-40 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-[1700px] right-0 h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[150px]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#05060a]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Sem<span className="text-blue-500">Shot</span>
            </span>
          </Link>

          <div className="hidden items-center gap-9 text-sm text-zinc-400 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how-it-works" className="transition hover:text-white">How it works</a>
            <a href="#about" className="transition hover:text-white">About</a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Get Started
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-white/10 p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#090b12] p-6 md:hidden">
            <div className="flex flex-col gap-5 text-sm text-zinc-300">
              <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
              <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
              <Link href="/login">Login</Link>
              <Link href="/signup" className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-10 lg:pb-32 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <Sparkles className="h-4 w-4" />
              AI-Powered Academic Preparation
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold">
                NEW
              </span>
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-[76px]">
              Your Exams.
              <br />
              Your Preparation.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Your Success.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">
              Everything you need to prepare smarter. Access notes, PYQs,
              MCQs, mock exams and AI-powered learning resources — all in
              one platform.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-bold shadow-xl shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-500"
              >
                Start Learning
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] px-7 py-4 font-semibold text-zinc-200 transition hover:border-blue-500/50 hover:bg-white/[0.06]"
              >
                <Play className="h-4 w-4 fill-current" />
                Explore Features
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Student focused
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                AI powered
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                All-in-one platform
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="absolute -inset-8 rounded-full bg-blue-600/15 blur-[90px]" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#10131d] p-5 shadow-2xl shadow-blue-950/30 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm font-bold">Student Dashboard</p>
                  <p className="mt-1 text-xs text-zinc-500">Your learning space</p>
                </div>
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 to-violet-600/10 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-300">YOUR STUDY JOURNEY</span>
                  <Sparkles className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="mt-4 text-2xl font-bold">Prepare Smarter.</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Your academic resources, organized in one place.
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-300">
                  Explore your dashboard <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: BookOpen, label: "Study Notes", value: "Learn" },
                  { icon: FileText, label: "Previous Papers", value: "Practice" },
                  { icon: BrainCircuit, label: "AI Questions", value: "Generate" },
                  { icon: Target, label: "Mock Exams", value: "Evaluate" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-blue-500/40 hover:bg-blue-500/[0.06]"
                  >
                    <item.icon className="h-5 w-5 text-blue-400" />
                    <p className="mt-4 text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">One platform. Everything organized.</p>
                  <p className="mt-1 text-xs text-zinc-500">Built for university students.</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-16 hidden rounded-2xl border border-white/10 bg-[#151925] p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-500/15 p-2 text-violet-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">AI Powered</p>
                  <p className="text-[10px] text-zinc-500">Smarter preparation</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/10 bg-[#151925] p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold">Study Efficiently</p>
                  <p className="text-[10px] text-zinc-500">Make every session count</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.07] bg-white/[0.015] py-9">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 text-center sm:grid-cols-4 lg:px-10">
          {[
            ["01", "Academic Profile"],
            ["02", "Study Resources"],
            ["03", "AI Learning"],
            ["04", "Exam Practice"],
          ].map(([number, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-blue-400">{number}</p>
              <p className="mt-2 text-sm text-zinc-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Everything in one place
          </span>
          <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            One Platform.
            <br />
            <span className="text-zinc-500">Multiple Possibilities.</span>
          </h2>
          <p className="mt-6 leading-7 text-zinc-400">
            Stop switching between different resources. Get the tools you
            need for your university exam preparation.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0c0e15] p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-[#101522]"
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/[0.04] blur-3xl transition group-hover:bg-blue-500/15" />

              <div className="relative flex items-center justify-between">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-zinc-600">
                  0{index + 1}
                </span>
              </div>

              <p className="mt-7 text-[10px] font-bold tracking-[0.18em] text-blue-400">
                {feature.tag}
              </p>
              <h3 className="mt-3 text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 min-h-[72px] text-sm leading-6 text-zinc-500">
                {feature.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-zinc-400 transition group-hover:text-blue-400">
                Explore feature
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 border-y border-white/[0.07] bg-[#090b12] py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Simple process
            </span>
            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              How SemShot Works
            </h2>
            <p className="mt-5 leading-7 text-zinc-400">
              Start your academic preparation in three simple steps.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/10 bg-white/[0.025] p-8 transition hover:border-blue-500/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-white/10">
                    {step.number}
                  </span>
                  <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                    <step.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mt-8 text-xl font-bold">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="relative overflow-hidden rounded-[32px] border border-blue-500/20 bg-gradient-to-br from-[#111b35] via-[#101323] to-[#17102c] p-8 sm:p-14 lg:p-20">
          <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full border border-blue-400/10" />
          <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border border-blue-400/10" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
              <BrainCircuit className="h-4 w-4" />
              The smarter way to prepare
            </div>

            <h2 className="mt-8 text-4xl font-black leading-tight sm:text-6xl">
              Don't just study hard.
              <br />
              <span className="text-blue-400">Study smart.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">
              Your academic journey deserves better tools. Bring your study
              materials, practice sessions and exam preparation together with
              SemShot.
            </p>

            <Link
              href="/signup"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-bold shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.08] bg-[#07080d]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-6 py-12 md:flex-row md:items-center lg:px-10">
          <div>
            <Link href="/" className="text-2xl font-black">
              Sem<span className="text-blue-500">Shot</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
              Your all-in-one academic preparation platform. Learn better,
              practice smarter and prepare with confidence.
            </p>
          </div>

          <div className="flex flex-wrap gap-7 text-sm text-zinc-400">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how-it-works" className="transition hover:text-white">How it works</a>
            <Link href="/login" className="transition hover:text-white">Login</Link>
            <Link href="/signup" className="transition hover:text-white">Sign Up</Link>
          </div>
        </div>

        <div className="border-t border-white/[0.07] px-6 py-6 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} SemShot. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
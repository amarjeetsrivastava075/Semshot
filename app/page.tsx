import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  BookOpen,
  Target,
  FileText,
  GraduationCap,
  Zap,
  ShieldCheck,
  Play,
  CheckCircle2,
  ChevronRight,
  Layers3,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Smart Notes",
    description: "Organized subject-wise notes to make learning easier and faster.",
    color: "blue",
  },
  {
    icon: FileText,
    title: "Previous Year Questions",
    description: "Practice important questions and understand exam patterns.",
    color: "purple",
  },
  {
    icon: BrainCircuit,
    title: "AI Summaries",
    description: "Convert lengthy study material into easy-to-understand summaries.",
    color: "cyan",
  },
  {
    icon: Target,
    title: "Exam Preparation",
    description: "Prepare smarter with MCQs, descriptive questions and revision.",
    color: "pink",
  },
];

export default function Home() {
  return (
    <main className="landing-page">
      <div className="background-effects">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="grid-overlay" />
      </div>

      <nav className="navbar">
        <Link href="/" className="brand">
          <div className="brand-icon">
            <GraduationCap size={23} />
          </div>
          <span>Sem<span className="brand-highlight">Shot</span></span>
        </Link>

        <div className="nav-center">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <Link href="/login" className="nav-login">
            Login
          </Link>
          <Link href="/signup" className="nav-signup">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="announcement">
            <span className="announcement-dot" />
            <Sparkles size={15} />
            AI POWERED EXAM PREPARATION
            <ChevronRight size={15} />
          </div>

          <h1 className="hero-title">
            Your Exams.
            <br />
            Your <span className="gradient-text">Preparation.</span>
            <br />
            Your Success.
          </h1>

          <p className="hero-description">
            Everything you need to ace your university exams.
            Notes, PYQs, MCQs and AI-powered learning — all in one place.
          </p>

          <div className="hero-buttons">
            <Link href="/signup" className="primary-button">
              Start Learning <ArrowRight size={19} />
            </Link>

            <Link href="/login" className="secondary-button">
              <Play size={16} /> Explore SemShot
            </Link>
          </div>

          <div className="hero-trust">
            <div className="trust-icon">
              <ShieldCheck size={17} />
            </div>
            <span>Built for smarter university exam preparation</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-tag tag-one">
            <BrainCircuit size={19} />
            <span>AI Powered</span>
          </div>

          <div className="floating-tag tag-two">
            <Zap size={18} />
            <span>Smart Learning</span>
          </div>

          <div className="dashboard-preview">
            <div className="preview-topbar">
              <div className="preview-logo">
                <GraduationCap size={19} />
                <span>SemShot</span>
              </div>
              <div className="preview-dots">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="preview-body">
              <div className="preview-greeting">
                <div>
                  <span className="preview-small">YOUR LEARNING SPACE</span>
                  <h3>Welcome back! 👋</h3>
                </div>
                <div className="preview-avatar">S</div>
              </div>

              <div className="preview-progress">
                <div className="progress-heading">
                  <span>Exam Preparation</span>
                  <span>75%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-value" />
                </div>
              </div>

              <div className="preview-grid">
                <div className="preview-card blue-card">
                  <BookOpen size={22} />
                  <strong>Notes</strong>
                  <span>Study material</span>
                </div>
                <div className="preview-card purple-card">
                  <FileText size={22} />
                  <strong>PYQs</strong>
                  <span>Past papers</span>
                </div>
                <div className="preview-card cyan-card">
                  <BrainCircuit size={22} />
                  <strong>AI Tools</strong>
                  <span>Smart summaries</span>
                </div>
                <div className="preview-card pink-card">
                  <Target size={22} />
                  <strong>MCQs</strong>
                  <span>Practice tests</span>
                </div>
              </div>

              <div className="preview-bottom">
                <div className="preview-bottom-icon">
                  <Sparkles size={19} />
                </div>
                <div>
                  <strong>Study smarter with SemShot</strong>
                  <p>Your preparation, organized.</p>
                </div>
                <ArrowRight size={17} />
              </div>
            </div>
          </div>

          <div className="visual-glow" />
        </div>

        <div className="hero-bottom">
          <span>LEARN SMARTER</span>
          <span className="bottom-line" />
          <span>PREPARE BETTER</span>
          <span className="bottom-line" />
          <span>ACHIEVE MORE</span>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="section-label">
            <Sparkles size={15} /> EVERYTHING IN ONE PLACE
          </span>
          <h2>
            One platform.
            <br />
            <span className="gradient-text">Endless possibilities.</span>
          </h2>
          <p>
            Stop switching between multiple resources. Get everything
            you need for exam preparation in SemShot.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div className="feature-card" key={feature.title}>
                <div className={`feature-icon ${feature.color}`}>
                  <Icon size={25} />
                </div>
                <span className="feature-number">
                  0{index + 1}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-arrow">
                  <ArrowRight size={19} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-content">
          <span className="section-label">
            <Layers3 size={15} /> SIMPLE. SMART. EFFECTIVE.
          </span>

          <h2>
            Your academic journey,
            <br />
            <span className="gradient-text">simplified.</span>
          </h2>

          <p>
            Select your university, course, branch and semester.
            SemShot helps organize your academic preparation around your curriculum.
          </p>

          <div className="steps-list">
            {[
              "Choose your university",
              "Select your course and branch",
              "Pick your current semester",
              "Start preparing smarter",
            ].map((step, index) => (
              <div className="step-item" key={step}>
                <div className="step-number">{index + 1}</div>
                <span>{step}</span>
                <CheckCircle2 size={19} />
              </div>
            ))}
          </div>

          <Link href="/signup" className="primary-button how-button">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>

        <div className="how-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="central-icon">
            <GraduationCap size={65} />
          </div>

          <div className="orbit-item orbit-item-one">
            <BookOpen size={24} />
          </div>
          <div className="orbit-item orbit-item-two">
            <BrainCircuit size={24} />
          </div>
          <div className="orbit-item orbit-item-three">
            <Target size={24} />
          </div>
          <div className="orbit-item orbit-item-four">
            <FileText size={24} />
          </div>

          <div className="orbit-caption">
            <Sparkles size={15} />
            <span>Your learning ecosystem</span>
          </div>
        </div>
      </section>

      <section className="cta-section" id="about">
        <div className="cta-glow" />
        <span className="section-label">
          <Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE
        </span>
        <h2>
          Make every study session
          <br />
          <span className="gradient-text">count.</span>
        </h2>
        <p>
          Take control of your preparation and make your next exam your best one.
        </p>
        <Link href="/signup" className="primary-button cta-button">
          Start Your Journey <ArrowRight size={19} />
        </Link>
      </section>

      <footer className="footer">
        <Link href="/" className="brand">
          <div className="brand-icon">
            <GraduationCap size={21} />
          </div>
          <span>Sem<span className="brand-highlight">Shot</span></span>
        </Link>

        <p>Study smarter. Score better. Build your future.</p>

        <span className="copyright">
          © {new Date().getFullYear()} SemShot. All rights reserved.
        </span>
      </footer>
    </main>
  );
}
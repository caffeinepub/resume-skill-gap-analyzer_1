import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Cpu,
  GraduationCap,
  Loader2,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { SkillGapResult } from "./backend.d";
import { useAnalyzeSkillGap } from "./hooks/useQueries";

const SAMPLE_RESUME = `Jane Doe
Software Engineering Graduate

EDUCATION
BSc Computer Science, University of Lagos, 2024
GPA: 4.2/5.0

SKILLS
Programming: Python, JavaScript, HTML/CSS, Java
Tools: Git, VS Code, Linux terminal
Database: MySQL, basic MongoDB
Concepts: Data Structures, OOP, REST APIs

PROJECTS
• Student Portal: Built a web portal using HTML, CSS, JavaScript
• Inventory System: Python-based desktop app with MySQL database

EXPERIENCE
3-month internship at StartHub Lagos — assisted with frontend tasks`;

const SAMPLE_JD = `Software Engineer — FinTech Startup

We are looking for a talented Software Engineer to join our growing team.

REQUIREMENTS:
• Proficient in React, TypeScript, and modern JavaScript (ES6+)
• Experience with Node.js and Express for backend development
• Familiarity with cloud platforms: AWS or GCP
• Experience with PostgreSQL and Redis
• Understanding of Docker and CI/CD pipelines
• Knowledge of microservices architecture
• Experience with Agile/Scrum methodology
• Bonus: GraphQL, Kubernetes, or Terraform experience
• Strong problem-solving skills and ability to work in a fast-paced environment`;

const SDG_DATA = [
  {
    number: 4,
    color: "#C5192D",
    bgVar: "oklch(0.44 0.21 22)",
    title: "Quality Education",
    subtitle: "SDG 4",
    icon: GraduationCap,
    description:
      "Empowering graduates with personalized learning paths to achieve inclusive, quality education for all.",
    stat: "Access to education",
  },
  {
    number: 8,
    color: "#A21942",
    bgVar: "oklch(0.36 0.16 10)",
    title: "Decent Work & Economic Growth",
    subtitle: "SDG 8",
    icon: TrendingUp,
    description:
      "Bridging the skills gap for better employment outcomes and sustained economic growth.",
    stat: "Employment pathways",
  },
  {
    number: 9,
    color: "#FD6925",
    bgVar: "oklch(0.70 0.19 45)",
    title: "Industry, Innovation & Infrastructure",
    subtitle: "SDG 9",
    icon: Cpu,
    description:
      "Driving innovation in human capital development to build resilient and inclusive industries.",
    stat: "Innovation in skills",
  },
];

function ReadinessGauge({ score }: { score: number }) {
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  const color =
    score >= 70
      ? "oklch(0.73 0.17 168)"
      : score >= 40
        ? "oklch(0.82 0.18 75)"
        : "oklch(0.59 0.19 22)";

  const label =
    score >= 70 ? "Strong Match" : score >= 40 ? "Developing" : "Needs Work";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="-rotate-90"
          aria-label="Readiness score gauge"
          role="img"
        >
          <circle
            stroke="oklch(0.22 0.04 240)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-display font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{ background: `${color}22`, color }}
      >
        {label}
      </span>
    </div>
  );
}

function SkillTag({
  skill,
  type,
  index,
}: {
  skill: string;
  type: "matched" | "missing" | "recommended";
  index: number;
}) {
  const styles = {
    matched: {
      bg: "oklch(0.73 0.17 168 / 0.15)",
      border: "oklch(0.73 0.17 168 / 0.4)",
      text: "oklch(0.73 0.17 168)",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    missing: {
      bg: "oklch(0.59 0.19 22 / 0.15)",
      border: "oklch(0.59 0.19 22 / 0.4)",
      text: "oklch(0.72 0.19 22)",
      icon: <XCircle className="w-3 h-3" />,
    },
    recommended: {
      bg: "oklch(0.82 0.18 75 / 0.15)",
      border: "oklch(0.82 0.18 75 / 0.4)",
      text: "oklch(0.82 0.18 75)",
      icon: <Star className="w-3 h-3" />,
    },
  };

  const s = styles[type];

  return (
    <motion.span
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
      }}
    >
      {s.icon}
      {skill}
    </motion.span>
  );
}

function ResultsDashboard({ result }: { result: SkillGapResult }) {
  const score = Number(result.readinessScore);
  const total = result.matchedSkills.length + result.missingSkills.length;
  const matchPct = total > 0 ? (result.matchedSkills.length / total) * 100 : 0;

  return (
    <motion.div
      data-ocid="results.section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Score + Summary */}
      <div className="card-glass rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            <ReadinessGauge score={score} />
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div>
              <h3 className="text-2xl font-display font-bold gradient-text mb-1">
                Readiness Score
              </h3>
              <p className="text-muted-foreground text-sm">
                Based on skill overlap between your resume and the job
                description
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">
                  Skills Matched
                </span>
                <span className="text-muted-foreground">
                  {result.matchedSkills.length} / {total}
                </span>
              </div>
              <Progress value={matchPct} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div
                className="rounded-xl p-3 text-center"
                style={{
                  background: "oklch(0.73 0.17 168 / 0.1)",
                  border: "1px solid oklch(0.73 0.17 168 / 0.3)",
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "oklch(0.73 0.17 168)" }}
                >
                  {result.matchedSkills.length}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Matched
                </div>
              </div>
              <div
                className="rounded-xl p-3 text-center"
                style={{
                  background: "oklch(0.59 0.19 22 / 0.1)",
                  border: "1px solid oklch(0.59 0.19 22 / 0.3)",
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "oklch(0.72 0.19 22)" }}
                >
                  {result.missingSkills.length}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Missing
                </div>
              </div>
              <div
                className="rounded-xl p-3 text-center"
                style={{
                  background: "oklch(0.82 0.18 75 / 0.1)",
                  border: "1px solid oklch(0.82 0.18 75 / 0.3)",
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "oklch(0.82 0.18 75)" }}
                >
                  {result.recommendedSkills.length}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Recommended
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Matched */}
        <div className="card-glass rounded-2xl p-5 space-y-3">
          <h4
            className="font-display font-bold flex items-center gap-2"
            style={{ color: "oklch(0.73 0.17 168)" }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Matched Skills
          </h4>
          {result.matchedSkills.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No matched skills found
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.map((s, i) => (
                <SkillTag key={s} skill={s} type="matched" index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Missing */}
        <div className="card-glass rounded-2xl p-5 space-y-3">
          <h4
            className="font-display font-bold flex items-center gap-2"
            style={{ color: "oklch(0.72 0.19 22)" }}
          >
            <XCircle className="w-4 h-4" />
            Missing Skills
          </h4>
          {result.missingSkills.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No missing skills — great match!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((s, i) => (
                <SkillTag key={s} skill={s} type="missing" index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Recommended */}
        <div className="card-glass rounded-2xl p-5 space-y-3">
          <h4
            className="font-display font-bold flex items-center gap-2"
            style={{ color: "oklch(0.82 0.18 75)" }}
          >
            <Star className="w-4 h-4" />
            Recommended
          </h4>
          {result.recommendedSkills.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No additional recommendations
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {result.recommendedSkills.map((s, i) => (
                <SkillTag key={s} skill={s} type="recommended" index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RecommendationsSection({
  recommendations,
}: { recommendations: Array<[string, string]> }) {
  if (recommendations.length === 0) return null;

  return (
    <motion.section
      data-ocid="recommendations.section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text">
          Your Learning Roadmap
        </h2>
        <p className="text-muted-foreground mt-2">
          Targeted actions to close your skill gaps fast
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map(([skill, course], i) => (
          <motion.div
            key={skill}
            data-ocid={`recommendations.item.${i + 1}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-glass rounded-2xl p-5 space-y-3 card-hover cursor-default"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "oklch(0.58 0.22 245 / 0.2)" }}
              >
                <BookOpen
                  className="w-4 h-4"
                  style={{ color: "oklch(0.58 0.22 245)" }}
                />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground text-sm leading-tight">
                  {skill}
                </h4>
                <Badge
                  className="mt-1.5 text-xs"
                  variant="outline"
                  style={{
                    borderColor: "oklch(0.72 0.19 22 / 0.5)",
                    color: "oklch(0.72 0.19 22)",
                  }}
                >
                  Missing Skill
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course}
            </p>
            <div
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: "oklch(0.58 0.22 245)" }}
            >
              <ArrowRight className="w-3 h-3" />
              Start Learning
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default function App() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const analyzeSection = useRef<HTMLElement>(null);
  const resultsSection = useRef<HTMLDivElement>(null);

  const { mutate: analyze, isPending, isError } = useAnalyzeSkillGap();

  const handleAnalyze = () => {
    if (!resume.trim() || !jobDescription.trim()) {
      toast.error("Please fill in both your resume and job description.");
      return;
    }
    analyze(
      { resume, jobDescription },
      {
        onSuccess: (data) => {
          setResult(data);
          toast.success("Analysis complete! Scroll down to see your results.");
          setTimeout(() => {
            resultsSection.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        },
        onError: () => {
          toast.error("Analysis failed. Please try again.");
        },
      },
    );
  };

  const scrollToAnalyze = () => {
    analyzeSection.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster theme="dark" />

      {/* ── Hero Section ── */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-bg.dim_1600x900.jpg')",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles
              className="w-6 h-6"
              style={{ color: "oklch(0.73 0.17 168)" }}
            />
            <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
              AI-Powered Career Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-extrabold leading-none tracking-tight"
          >
            <span className="gradient-text">SkillBridge</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Close the Gap Between Your Resume and Your{" "}
            <span className="font-bold text-foreground">Dream Job</span>
          </motion.p>

          {/* SDG Chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {SDG_DATA.map((sdg) => (
              <span
                key={sdg.number}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white"
                style={{
                  background: `${sdg.color}22`,
                  border: `1px solid ${sdg.color}66`,
                  color: sdg.color,
                }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: sdg.color }}
                >
                  {sdg.number}
                </span>
                {sdg.title}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              onClick={scrollToAnalyze}
              size="lg"
              className="text-lg px-10 py-6 rounded-full font-bold font-display transition-all duration-300 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 245), oklch(0.73 0.17 168))",
                color: "white",
                boxShadow: "0 0 30px oklch(0.58 0.22 245 / 0.4)",
              }}
            >
              Analyze Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-6 h-6 text-muted-foreground animate-bounce" />
          </motion.div>
        </div>
      </header>

      {/* ── SDG Alignment Section ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-3">
              Aligned with Global Goals
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              SkillBridge is built on the foundation of the UN Sustainable
              Development Goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {SDG_DATA.map((sdg, i) => {
              const Icon = sdg.icon;
              return (
                <motion.div
                  key={sdg.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="card-glass rounded-2xl p-6 card-hover space-y-4"
                  style={{
                    borderColor: `${sdg.color}33`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white font-display"
                      style={{ background: sdg.color }}
                    >
                      {sdg.number}
                    </div>
                    <div>
                      <p
                        className="text-xs font-bold tracking-widest uppercase"
                        style={{ color: sdg.color }}
                      >
                        {sdg.subtitle}
                      </p>
                      <h3 className="font-display font-bold text-foreground leading-tight">
                        {sdg.title}
                      </h3>
                    </div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${sdg.color}22` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: sdg.color }} />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {sdg.description}
                  </p>
                  <div
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: `${sdg.color}15`, color: sdg.color }}
                  >
                    <Target className="w-3 h-3" />
                    {sdg.stat}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Analysis Input Section ── */}
      <section
        id="analyze"
        ref={analyzeSection}
        className="py-20 px-4"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.15 0.04 240 / 0.5), transparent)",
        }}
      >
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-3">
              Analyze Your Skills
            </h2>
            <p className="text-muted-foreground text-lg">
              Paste your resume and target job description below
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Resume */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <label
                className="block font-display font-bold text-lg"
                htmlFor="resume-input"
              >
                <span className="gradient-text">Your Resume</span>
              </label>
              <Textarea
                id="resume-input"
                data-ocid="resume.textarea"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder={SAMPLE_RESUME}
                rows={16}
                className="resize-none text-sm leading-relaxed font-body"
                style={{
                  background: "oklch(0.17 0.035 240 / 0.8)",
                  borderColor: "oklch(0.30 0.06 245 / 0.3)",
                }}
              />
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <label
                className="block font-display font-bold text-lg"
                htmlFor="jd-input"
              >
                <span className="gradient-text">Job Description</span>
              </label>
              <Textarea
                id="jd-input"
                data-ocid="job_description.textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={SAMPLE_JD}
                rows={16}
                className="resize-none text-sm leading-relaxed font-body"
                style={{
                  background: "oklch(0.17 0.035 240 / 0.8)",
                  borderColor: "oklch(0.30 0.06 245 / 0.3)",
                }}
              />
            </motion.div>
          </div>

          <div className="flex justify-center">
            <Button
              data-ocid="analyze.primary_button"
              onClick={handleAnalyze}
              disabled={isPending}
              size="lg"
              className="text-lg px-12 py-6 rounded-full font-bold font-display transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
              style={{
                background: isPending
                  ? "oklch(0.30 0.06 245)"
                  : "linear-gradient(135deg, oklch(0.58 0.22 245), oklch(0.73 0.17 168))",
                color: "white",
                boxShadow: isPending
                  ? "none"
                  : "0 0 30px oklch(0.58 0.22 245 / 0.4)",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  <span data-ocid="analyze.loading_state">Analyzing...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 w-5 h-5" />
                  Analyze Skill Gap
                </>
              )}
            </Button>
          </div>

          {isError && (
            <motion.div
              data-ocid="results.error_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-4 rounded-xl"
              style={{
                background: "oklch(0.44 0.21 22 / 0.1)",
                border: "1px solid oklch(0.44 0.21 22 / 0.3)",
              }}
            >
              <p className="text-sm" style={{ color: "oklch(0.72 0.19 22)" }}>
                Analysis failed. Please check your inputs and try again.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Results + Recommendations ── */}
      <AnimatePresence>
        {result && (
          <div ref={resultsSection} className="py-10 px-4 space-y-16">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-10"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
                  Your Analysis Results
                </h2>
                <p className="text-muted-foreground">
                  Here's how your profile stacks up against the role
                </p>
              </motion.div>
              <ResultsDashboard result={result} />
            </div>

            <div className="max-w-6xl mx-auto">
              <RecommendationsSection
                recommendations={result.recommendations}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SDG Impact Footer Cards ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-3">
              Every Analysis Matters
            </h2>
            <p className="text-muted-foreground text-lg">
              Every analysis supports three global goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {SDG_DATA.map((sdg, i) => (
              <motion.div
                key={`impact-${sdg.number}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-2xl p-6 text-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${sdg.color}15, ${sdg.color}05)`,
                  border: `1px solid ${sdg.color}33`,
                }}
              >
                <div
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10"
                  style={{ background: sdg.color }}
                />
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white font-display mx-auto mb-4"
                  style={{
                    background: sdg.color,
                    boxShadow: `0 8px 24px ${sdg.color}44`,
                  }}
                >
                  {sdg.number}
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {sdg.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {sdg.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles
              className="w-5 h-5"
              style={{ color: "oklch(0.73 0.17 168)" }}
            />
            <span className="font-display font-bold gradient-text text-lg">
              SkillBridge
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}. Built with{" "}
            <span style={{ color: "oklch(0.72 0.19 22)" }}>♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: "oklch(0.58 0.22 245)" }}
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-2">
            {SDG_DATA.map((sdg) => (
              <span
                key={sdg.number}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{ background: sdg.color }}
                title={`SDG ${sdg.number}: ${sdg.title}`}
              >
                {sdg.number}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

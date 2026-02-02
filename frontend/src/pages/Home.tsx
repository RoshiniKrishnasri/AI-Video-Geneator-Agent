import { useState, useRef } from "react";
import { generateVideo } from "../services/api";

interface VideoResult {
  video_url: string;
  script: string;
}

// Prompt templates for quick start
const PROMPT_TEMPLATES = [
  { label: "YouTube Short", icon: "📱", topic: "Quick Tips Video", description: "Create a punchy 30-second video with 3 surprising facts. Hook viewers in the first 2 seconds, use energetic pacing, and end with a question to boost comments." },
  { label: "Product Demo", icon: "🛍️", topic: "Product Showcase", description: "Highlight the top 3 benefits of the product. Start with the problem it solves, show it in action, and end with a clear call-to-action. Keep it simple and visual." },
  { label: "Explainer", icon: "💡", topic: "How It Works", description: "Break down a complex concept into 3 simple steps. Use analogies that anyone can understand. Start with why it matters, then explain the process clearly." },
  { label: "Story", icon: "📖", topic: "Personal Story", description: "Share a relatable story with a clear beginning, middle, and end. Include one moment of tension or challenge, and finish with the lesson learned or transformation." },
  { label: "Tutorial", icon: "🎓", topic: "Step-by-Step Guide", description: "Teach one specific skill in clear, numbered steps. Start by showing the end result, then walk through each step. Mention common mistakes to avoid." },
];

// Progress steps
const PROGRESS_STEPS = [
  { icon: "✍️", label: "Writing script" },
  { icon: "🎬", label: "Planning scenes" },
  { icon: "🎨", label: "Creating visuals" },
  { icon: "🎙️", label: "Recording narration" },
  { icon: "🎥", label: "Assembling video" },
];

interface ProgressState {
  step: number;
  total: number;
  message: string;
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [tone, setTone] = useState("Informative");
  const [voice, setVoice] = useState<"male" | "female" | "neutral">("female");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleTemplateClick = (index: number) => {
    const template = PROMPT_TEMPLATES[index];
    setTopic(template.topic);
    setDescription(template.description);
    setActiveTemplate(index);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Add a topic so I know what to create.");
      return;
    }
    if (!description.trim() || description.trim().split(" ").length < 5) {
      setError("Add at least one sentence describing what you want in the video.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    setProgress({ step: 0, total: 5, message: "Starting..." });

    try {
      const payload = { topic, description, duration, tone, voice, language };
      const res = await generateVideo(payload, (progressData: ProgressState) => {
        setProgress(progressData);
      });
      if (res?.video_url) {
        setResult(res as VideoResult);
      } else {
        setError(res?.error || "Something went wrong. Let's try again!");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Connection issue — is the server running?");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f13",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Floating gradient orbs for life */}
      <div style={{
        position: "absolute", top: "-15%", left: "-5%", width: "550px", height: "550px",
        background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%", width: "450px", height: "450px",
        background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(60px)", animation: "float 10s ease-in-out infinite reverse"
      }} />
      <div style={{
        position: "absolute", top: "50%", right: "25%", width: "250px", height: "250px",
        background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(50px)", animation: "float 6s ease-in-out infinite"
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto", padding: "36px 36px 50px" }}>

        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "50px", height: "50px", borderRadius: "14px",
              background: "linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px", boxShadow: "0 10px 40px rgba(139,92,246,0.35)"
            }}>
              🎬
            </div>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
                Clipify
              </h1>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                video magic ✨
              </p>
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 18px", borderRadius: "100px",
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)"
          }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%",
              backgroundColor: "#22c55e", boxShadow: "0 0 12px rgba(34,197,94,0.7)",
              animation: "pulse 2s ease-in-out infinite"
            }} />
            <span style={{ fontSize: "13px", color: "#22c55e", fontWeight: 500 }}>Ready</span>
          </div>
        </header>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 18px", borderRadius: "100px", marginBottom: "20px",
            background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.12))",
            border: "1px solid rgba(139,92,246,0.18)"
          }}>
            <span>⚡</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
              No editing skills needed
            </span>
          </div>

          <h2 style={{
            fontSize: "clamp(38px, 5.5vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.08,
            margin: "0 0 18px 0",
            letterSpacing: "-1.5px"
          }}>
            <span style={{ color: "#fff" }}>From prompt to </span>
            <span style={{
              background: "linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>ready-to-share video</span>
            <br />
            <span style={{ color: "#fff" }}>in under a minute</span>
          </h2>

          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.55)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.65 }}>
            Write a prompt. We generate scenes, narration, and timing — automatically.
            <br />
            <span style={{ color: "rgba(255,255,255,0.4)" }}>No recording. No editing. No templates.</span>
          </p>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "44px", alignItems: "start" }}>

          {/* Left - Benefits */}
          <div style={{ paddingTop: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { emoji: "✍️", title: "No script writing", desc: "Just describe your idea — we handle the rest." },
                { emoji: "🎬", title: "Auto-generated visuals", desc: "Matching scenes created for every moment of your message." },
                { emoji: "🎙️", title: "No recording yourself", desc: "Natural-sounding narration generated from your text." },
                { emoji: "⚡", title: "Ready in under a minute", desc: "Download and share anywhere — YouTube, TikTok, Instagram." }
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "16px",
                  padding: "22px 24px", borderRadius: "18px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.3s ease",
                  cursor: "default"
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(139,92,246,0.07)";
                    e.currentTarget.style.borderColor = "rgba(139,92,246,0.18)";
                    e.currentTarget.style.transform = "translateX(6px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(6,182,212,0.18))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", flexShrink: 0
                  }}>
                    {item.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", margin: "0 0 5px 0" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: "28px", padding: "18px 22px", borderRadius: "14px",
              background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)"
            }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", margin: 0 }}>
                � <span style={{ color: "#22c55e", fontWeight: 600 }}>Runs locally</span> — your content never leaves your machine. 100% private.
              </p>
            </div>

            {/* Social proof placeholder */}
            <div style={{
              marginTop: "16px", padding: "14px 18px", borderRadius: "12px",
              background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.08)",
              display: "flex", alignItems: "center", gap: "12px"
            }}>
              <div style={{ display: "flex" }}>
                {["🧑‍💻", "👩‍🎨", "👨‍🏫"].map((emoji, i) => (
                  <span key={i} style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "rgba(139,92,246,0.2)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "14px",
                    marginLeft: i > 0 ? "-8px" : 0, border: "2px solid #0f0f13"
                  }}>{emoji}</span>
                ))}
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                Used by creators, educators & marketers
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div ref={formRef} style={{
            padding: "32px",
            borderRadius: "26px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 36px 70px rgba(0,0,0,0.35)"
          }}>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 6px 0" }}>
                Make your first video
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                Pick a template or describe your own idea
              </p>
            </div>

            {/* Quick Start Templates */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Quick start
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {PROMPT_TEMPLATES.map((template, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleTemplateClick(i)}
                    style={{
                      padding: "8px 14px", borderRadius: "20px",
                      border: activeTemplate === i ? "2px solid #8b5cf6" : "1px solid rgba(255,255,255,0.1)",
                      background: activeTemplate === i ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                      color: activeTemplate === i ? "#fff" : "rgba(255,255,255,0.6)",
                      fontSize: "12px", fontWeight: 500, cursor: "pointer",
                      transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    <span>{template.icon}</span>
                    {template.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                  What's this video about?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => { setTopic(e.target.value); setActiveTemplate(null); }}
                  placeholder="e.g., Morning routine tips, How to make coffee, My startup story..."
                  style={{
                    width: "100%", padding: "15px 18px", borderRadius: "12px",
                    border: "2px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)",
                    color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.45)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
                  Describe what should happen in the video
                </label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setActiveTemplate(null); }}
                  rows={4}
                  placeholder="Mention key points, the tone you want, and who this video is for..."
                  style={{
                    width: "100%", padding: "15px 18px", borderRadius: "12px",
                    border: "2px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)",
                    color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box",
                    resize: "vertical", minHeight: "100px", transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.45)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
                />
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "6px 0 0 0" }}>
                  💡 Tip: Include who it's for and what you want viewers to feel or do
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: "6px" }}>
                    Length
                  </label>
                  <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))} style={{
                    width: "100%", padding: "12px 14px", borderRadius: "10px",
                    border: "2px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)",
                    color: "#fff", fontSize: "13px", outline: "none", cursor: "pointer"
                  }}>
                    <option value={15}>15 sec</option>
                    <option value={30}>30 sec</option>
                    <option value={60}>60 sec</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: "6px" }}>
                    Vibe
                  </label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} style={{
                    width: "100%", padding: "12px 14px", borderRadius: "10px",
                    border: "2px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)",
                    color: "#fff", fontSize: "13px", outline: "none", cursor: "pointer"
                  }}>
                    <option value="Informative">Informative 📚</option>
                    <option value="Motivational">Motivational 💪</option>
                    <option value="Storytelling">Storytelling 📖</option>
                    <option value="Educational">Educational 🎓</option>
                    <option value="Entertaining">Casual 🎉</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: "6px" }}>
                    Language
                  </label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{
                    width: "100%", padding: "12px 14px", borderRadius: "10px",
                    border: "2px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)",
                    color: "#fff", fontSize: "13px", outline: "none", cursor: "pointer"
                  }}>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: "8px" }}>
                  Narration style
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {([
                    { value: "female", label: "Warm", desc: "Friendly & approachable" },
                    { value: "male", label: "Confident", desc: "Clear & authoritative" },
                    { value: "neutral", label: "Neutral", desc: "Clean & professional" }
                  ] as const).map((v) => (
                    <button key={v.value} type="button" onClick={() => setVoice(v.value)} style={{
                      flex: 1, padding: "12px 10px", borderRadius: "10px",
                      border: voice === v.value ? "2px solid #8b5cf6" : "2px solid rgba(255,255,255,0.07)",
                      background: voice === v.value ? "rgba(139,92,246,0.15)" : "rgba(0,0,0,0.25)",
                      color: voice === v.value ? "#fff" : "rgba(255,255,255,0.55)",
                      fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                      textAlign: "center"
                    }}>
                      <div>{v.label}</div>
                      <div style={{ fontSize: "10px", fontWeight: 400, opacity: 0.6, marginTop: "2px" }}>{v.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{
                  padding: "14px 18px", borderRadius: "12px",
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
                  color: "#fca5a5", fontSize: "13px"
                }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Trust signals above CTA */}
              {!loading && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "16px",
                  padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.05)"
                }}>
                  {[
                    { icon: "✓", text: "No signup" },
                    { icon: "✓", text: "100% free" },
                    { icon: "✓", text: "~45 seconds" }
                  ].map((item, i) => (
                    <span key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#22c55e" }}>{item.icon}</span> {item.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Progress indicator */}
              {loading && progress && (
                <div style={{
                  padding: "20px", borderRadius: "16px",
                  background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)"
                }}>
                  {/* Progress bar */}
                  <div style={{
                    height: "6px", borderRadius: "3px",
                    background: "rgba(255,255,255,0.1)", marginBottom: "16px", overflow: "hidden"
                  }}>
                    <div style={{
                      height: "100%", borderRadius: "3px",
                      background: "linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4)",
                      width: `${(progress.step / progress.total) * 100}%`,
                      transition: "width 0.5s ease"
                    }} />
                  </div>

                  {/* Steps */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    {PROGRESS_STEPS.map((step, i) => (
                      <div key={i} style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                        opacity: progress.step > i ? 1 : progress.step === i ? 1 : 0.3,
                        transition: "opacity 0.3s"
                      }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "10px",
                          background: progress.step > i
                            ? "linear-gradient(135deg, #22c55e, #10b981)"
                            : progress.step === i
                              ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
                              : "rgba(255,255,255,0.05)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "16px", transition: "all 0.3s",
                          boxShadow: progress.step === i ? "0 0 20px rgba(139,92,246,0.4)" : "none"
                        }}>
                          {progress.step > i ? "✓" : step.icon}
                        </div>
                        <span style={{
                          fontSize: "9px", fontWeight: 500,
                          color: progress.step >= i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                          textAlign: "center", maxWidth: "60px"
                        }}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Current step message */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.2)"
                  }}>
                    <span style={{
                      width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.2)",
                      borderTopColor: "#8b5cf6", borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }} />
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                      {progress.message}
                    </span>
                  </div>
                </div>
              )}

              <button onClick={handleGenerate} disabled={loading} style={{
                width: "100%", padding: "17px 24px", borderRadius: "14px",
                border: "none",
                background: loading ? "rgba(139,92,246,0.25)" : "linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4)",
                color: "#fff", fontSize: "15px", fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 18px 45px rgba(139,92,246,0.35)",
                transition: "all 0.3s",
                display: loading ? "none" : "flex", alignItems: "center", justifyContent: "center", gap: "10px"
              }}>
                Turn this into a video →
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div style={{
            marginTop: "56px", padding: "36px", borderRadius: "26px",
            background: "linear-gradient(180deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%)",
            border: "1px solid rgba(34,197,94,0.12)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: "linear-gradient(135deg, #22c55e, #10b981)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px"
              }}>
                🎉
              </div>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: 0 }}>
                  Your video is ready!
                </h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", margin: 0 }}>
                  Download it or make another one
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "28px" }}>
              <div>
                <div style={{
                  borderRadius: "18px", overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)", background: "#000",
                  boxShadow: "0 28px 55px rgba(0,0,0,0.45)"
                }}>
                  <video controls autoPlay style={{ display: "block", width: "100%" }} src={result.video_url} />
                </div>
                <a href={result.video_url} download="my_video.mp4" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  marginTop: "18px", padding: "14px 24px", borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                  color: "#fff", fontSize: "14px", fontWeight: 700,
                  textDecoration: "none", boxShadow: "0 10px 28px rgba(139,92,246,0.35)"
                }}>
                  ⬇️ Download Video
                </a>
              </div>

              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 12px 0" }}>
                  📝 Script
                </h4>
                <div style={{
                  padding: "20px", borderRadius: "14px",
                  background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)",
                  maxHeight: "300px", overflow: "auto"
                }}>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>
                    {result.script}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes float { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-25px) scale(1.03); } }
        ::placeholder { color: rgba(255,255,255,0.28); }
        select option { background: #1a1a22; color: #fff; }
      `}</style>
    </div>
  );
}
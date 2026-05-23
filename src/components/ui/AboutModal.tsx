"use client";

import { motion, AnimatePresence } from "framer-motion";
import { StickerImg } from "./StickerImg";

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AboutModal({ visible, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              zIndex: 9998,
              background: "rgba(61,47,37,0.3)",
              backdropFilter: "blur(4px)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 9999,
              background: "#fffbf7",
              borderRadius: "24px 24px 0 0",
              border: "1.5px solid #e8c5a8",
              padding: "28px 28px 52px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 -8px 48px rgba(61,47,37,0.14)",
            }}
          >
            {/* Handle */}
            <div style={{
              width: "36px", height: "4px",
              background: "#e8c5a8", borderRadius: "999px",
              margin: "0 auto 24px",
            }} />

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: "20px", right: "24px",
                background: "none", border: "none",
                cursor: "pointer", fontSize: "22px",
                color: "#bba89c", lineHeight: 1,
              }}
            >×</button>

            {/* Logo Header */}
            <div style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "42px", fontWeight: 600,
              color: "#c17a5b", lineHeight: 1,
              marginBottom: "4px",
            }}>
              Cozync ✦
            </div>
            <div style={{
              fontFamily: "var(--font-patrick), cursive",
              fontSize: "14px", color: "#bba89c",
              marginBottom: "28px",
            }}>
              visible proof of becoming someone
            </div>

            {/* What is it */}
            <Section emoji="1F4D6" title="what is Cozync?">
              Cozync is a cozy visual life-logging webapp. It transforms your
              daily progress, memories, moods, habits, and tiny wins into a
              comforting visual scrapbook — instead of a cold productivity
              dashboard.
            </Section>

            {/* Origin story with Added Sign-In Context */}
            <Section emoji="1F331" title="how it started">
              It started as a thought at the end of a long day — I wanted
              somewhere to log everything I did, everything I felt, every small
              thing I was proud of. Not a spreadsheet. Not a habit tracker that
              judges you for missing a day. Something that felt like a
              journal, but looked like a scrapbook.
              <br /><br />
              When I looked for an app like this, I couldn't find a single one that 
              felt right — cozy, personal, visually expressive, and most importantly, 
              none that would just let me log my days freely without forcing me to sign in first. 
              Everything required an account before I could even write down a single thought. So I decided to build one myself.
            </Section>

            {/* Philosophy */}
            <Section emoji="1F338" title="the philosophy">
              Cozync is not about optimization. It's not about building
              perfect habits or hitting streaks or being productive. It's about
              having a small, warm corner of the internet that holds your days —
              the good ones, the hard ones, the ones that felt like nothing but
              were actually something.
              <br /><br />
              The streak doesn't punish you. The moods don't judge you.
              The stickers are just for you.
            </Section>

            {/* Who it's for */}
            <Section emoji="2728" title="who it's for">
              Students, artists, writers, gym people, gamers, journalers,
              people recovering from burnout, people romanticizing their life,
              parents, grandparents — anyone who wants a visual archive of
              their days. Normal people. Everybody.
            </Section>

            {/* Author Attribution Frame & Custom Mantra Statement */}
            <div style={{
              marginTop: "28px",
              padding: "24px 20px",
              background: "#fdf0e8",
              borderRadius: "16px",
              border: "1.5px solid #f0e0d0",
              textAlign: "center",
            }}>
              <div style={{ marginBottom: "10px" }}>
                <StickerImg openmoji="1F338" size={32} alt="blossom" />
              </div>
              <div style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "18px", fontWeight: 600,
                color: "#c17a5b", marginBottom: "6px",
              }}>
                made with soft chaos
              </div>
              <div style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: "13px", color: "#9a7b6b", lineHeight: 1.6,
                marginBottom: "12px",
              }}>
                by Somya — a developer who just wanted a cozy place
                to remember her days, and ended up building one.
              </div>
              <div style={{
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "14px",
                color: "#c17a5b",
                fontStyle: "italic",
                borderTop: "1px dashed #e8c5a8",
                paddingTop: "10px",
                marginTop: "10px",
              }}>
                "If you can't find it, make it" ✦
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                marginTop: "24px",
                width: "100%",
                background: "#c17a5b", color: "#fffbf7",
                border: "none", borderRadius: "999px",
                padding: "13px",
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "15px", cursor: "pointer",
                boxShadow: "0 2px 10px rgba(193,122,91,0.25)",
              }}
            >
              back to my story ✦
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({
  emoji, title, children,
}: {
  emoji: string; title: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        marginBottom: "8px",
      }}>
        <StickerImg openmoji={emoji} size={20} alt={title} />
        <span style={{
          fontFamily: "var(--font-patrick), cursive",
          fontSize: "15px", color: "#3d2f25",
        }}>
          {title}
        </span>
      </div>
      <p style={{
        fontFamily: "var(--font-nunito), sans-serif",
        fontSize: "13px", color: "#6b5044",
        lineHeight: 1.7, margin: 0,
      }}>
        {children}
      </p>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { MonthNav } from "@/components/calendar/MonthNav";
import { DayPanel } from "@/components/entry/DayPanel";
import { useEntryStore } from "@/store/useEntryStore";
import { useUserStore } from "@/store/useUserStore";
import { StickerImg } from "@/components/ui/StickerImg";
import { OnboardingToast } from "@/components/ui/OnboardingToast";
import { UnlockCelebration } from "@/components/ui/UnlockCelebration";
import { useUnlockDetector } from "@/hooks/useUnlockDetector";
import { MonthStats } from "@/components/calendar/MonthStats";
import { StickersPage } from "@/components/StickersPage";
import { TutorialHint } from "@/components/ui/TutorialHint";
import { AboutModal } from "@/components/ui/AboutModal";
import { Footer } from "@/components/ui/Footer";
import { getTodayLocal } from "@/lib/dateUtils";
import { DeluluQuote } from "@/components/ui/DeluluQuote";

export default function CalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeNav, setActiveNav] = useState("Calendar");
  const [showAbout, setShowAbout] = useState(false);
  
  // Track forced interactive overlay triggers
  const [showTutorial, setShowTutorial] = useState(false);

  const NAV_ITEMS = [
    { openmoji: "1F4C5", label: "Calendar" },
    { openmoji: "2728",  label: "Stickers" },
    { openmoji: "1F4CA", label: "Stats"    },
    { openmoji: "2699",  label: "Settings" },
  ];

  const { entries, loadMonth, loadAllEntries, allEntries } = useEntryStore();
  const { load: loadUser, meta } = useUserStore();
  const { newlyUnlocked, clearUnlock } = useUnlockDetector(allEntries);

  useEffect(() => { loadMonth(year, month); }, [year, month, loadMonth]);
  useEffect(() => { loadAllEntries(); }, [loadAllEntries]);
  
  useEffect(() => {
    const seen = localStorage.getItem("cz_onboarding") === "true";
    if (!seen && allEntries.length > 0) {
      setTimeout(() => setShowOnboarding(true), 1000);
    }
  }, [allEntries.length]);

  useEffect(() => {
    const seenTutorial = localStorage.getItem("cz_tutorial_v2") === "true";
    if (!seenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function handlePrev() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  
  function handleNext() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  // Streak calculation
  let streak = 0;
  {
    const todayStr = getTodayLocal();
    const yesterday = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-CA");
    const dateSet = new Set(allEntries.map(e => e.date));

    let cursor = dateSet.has(todayStr) ? todayStr : yesterdayStr;
    while (dateSet.has(cursor)) {
      streak++;
      const d = new Date(cursor);
      d.setDate(d.getDate() - 1);
      // Fixed: Walk the cursor back day-by-day instead of assigning a static today fallback string
      cursor = d.toLocaleDateString("en-CA");
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
      height: "100vh",        
      overflow: "hidden",     
      background: "#fdf8f3",
      fontFamily: "var(--font-nunito), sans-serif",
    }}>

      {/* ── Sidebar (desktop only) ── */}
      {!isMobile && (
        <aside style={{
          width: "200px",
          minWidth: "200px",
          background: "#fffbf7",
          borderRight: "1.5px solid #f0e0d0",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "visible", 
          flexShrink: 0,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
        }}>
          {/* Clickable Sidebar Logo */}
          <div 
            onClick={() => setShowAbout(true)}
            style={{
              padding: "28px 16px 20px",
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "34px",
              fontWeight: 600,
              color: "#c17a5b",
              letterSpacing: "0.3px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexShrink: 0,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            Cozync
            <span style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "28px",
              color: "#c17a5b",
              lineHeight: 1,
              verticalAlign: "middle",
            }}>✦</span>
          </div>

          {/* Desktop Links Container */}
          <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {NAV_ITEMS.map(item => (
              <NavItem
                key={item.label}
                item={item}
                isActive={activeNav === item.label}
                onClick={() => setActiveNav(item.label)}
              />
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Streak — pinned to bottom */}
          <div style={{
            padding: "16px 16px 28px",
            textAlign: "center",
            borderTop: "1px solid #f5ece4",
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginBottom: "6px",
            }}>
              <span style={{
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "12px",
                color: "#bba89c",
              }}>
                current streak
              </span>
              <StreakInfoButton isMobile={false} />
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}>
              <span style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "40px",
                fontWeight: 600,
                color: "#c17a5b",
                lineHeight: 1,
              }}>{streak}</span>
              <StickerImg openmoji="1F525" size={30} alt="fire" />
            </div>
          </div>
        </aside>
      )}

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100vh",
        overflow: "hidden",
        marginLeft: isMobile ? "0px" : "200px",
      }}>

        {/* Mobile header */}
        {isMobile && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
            background: "#fffbf7",
            borderBottom: "1.5px solid #f0e0d0",
            flexShrink: 0,
          }}>
            {/* Clickable Mobile Header Logo */}
            <div 
              onClick={() => setShowAbout(true)}
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "28px",
                fontWeight: 600,
                color: "#c17a5b",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Cozync
              <span style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "22px",
                color: "#c17a5b",
                lineHeight: 1,
                verticalAlign: "middle",
              }}>✦</span>
            </div>
            
            {/* Clamped Mobile Header Streak Chip */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#fde8d8",
              borderRadius: "999px",
              padding: "6px 14px",
              border: "1.5px solid #f0e0d0",
            }}>
              <span style={{
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "12px",
                color: "#a0563a",
              }}>current streak</span>
              <span style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#c17a5b",
                lineHeight: 1,
              }}>{streak}</span>
              <StickerImg openmoji="1F525" size={20} alt="streak" />
              <StreakInfoButton isMobile={true} />
            </div>
          </div>
        )}

        {/* Inner Panel Row */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}>

          {/* Core Stage Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              flex: 1,
              minWidth: 0,
              width: "100%",
              padding: isMobile ? "16px 12px" : "24px 20px 24px 24px",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            {activeNav === "Calendar" && (
              <>
                <MonthNav year={year} month={month} onPrev={handlePrev} onNext={handleNext} />
                <DeluluQuote />
                <CalendarGrid
                  year={year}
                  month={month}
                  entries={entries}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                <MonthStats entries={allEntries} year={year} month={month} />
              </>
            )}
            
            {activeNav === "Stickers" && (
              <StickersPage />
            )}
            
            {activeNav === "Stats" && (
              <div style={{ padding: "20px 0" }}>
                <p style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "28px",
                  color: "#c17a5b",
                  marginBottom: "8px",
                }}>Stats coming soon ✦</p>
                <p style={{
                  fontFamily: "var(--font-patrick), cursive",
                  fontSize: "14px",
                  color: "#9a7b6b",
                }}>detailed insights about your journey</p>
              </div>
            )}
            
            {activeNav === "Settings" && (
              <div style={{ padding: "20px 0" }}>
                <p style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "28px",
                  color: "#c17a5b",
                  marginBottom: "8px",
                }}>Settings coming soon ✦</p>
                <p style={{
                  fontFamily: "var(--font-patrick), cursive",
                  fontSize: "14px",
                  color: "#9a7b6b",
                }}>customization options on the way</p>
              </div>
            )}
          </motion.div>

          {/* Day panel — desktop side panel */}
          <AnimatePresence mode="wait">
            {selectedDate && !isMobile && (
              <motion.aside
                key={selectedDate}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  width: "320px",
                  minWidth: "320px",   
                  maxWidth: "320px",   
                  background: "#fffbf7",
                  borderLeft: "1.5px solid #f0e0d0",
                  padding: "24px 20px 0",
                  overflowY: "auto",
                  height: "100%",
                  flexShrink: 0,      
                }}
              >
                <DayPanel
                  date={selectedDate}
                  onClose={() => setSelectedDate(null)}
                />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile: Day panel as bottom sheet */}
        <AnimatePresence>
          {selectedDate && isMobile && (
            <motion.div
              key="bottom-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                background: "#fffbf7",
                borderTop: "1.5px solid #f0e0d0",
                borderRadius: "20px 20px 0 0",
                padding: "20px 20px 32px",
                maxHeight: "80vh",
                overflowY: "auto",
                zIndex: 100,
                boxShadow: "0 -4px 32 rgba(61,47,37,0.12)",
              }}
            >
              <div style={{
                width: "36px",
                height: "4px",
                background: "#e8c5a8",
                borderRadius: "999px",
                margin: "0 auto 16px",
              }} />
              <DayPanel
                date={selectedDate}
                onClose={() => setSelectedDate(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Layout Footer */}
        {!isMobile && <Footer />}

        {/* Mobile Layout Footer Container */}
        {isMobile && <Footer />}

        {/* Mobile bottom nav setup */}
        {isMobile && (
          <nav style={{
            display: "flex",
            flexDirection: "row",
            borderTop: "1.5px solid #f0e0d0",
            background: "#fffbf7",
            paddingBottom: "env(safe-area-inset-bottom)",
            flexShrink: 0,
          }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  padding: "10px 4px 8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <StickerImg openmoji={item.openmoji} size={22} alt={item.label} />
                <span style={{
                  fontFamily: "var(--font-patrick), cursive",
                  fontSize: "11px",
                  color: activeNav === item.label ? "#c17a5b" : "#9a7b6b",
                }}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Floating help reset button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          localStorage.removeItem("cz_tutorial_v2");
          setShowTutorial(true);
        }}
        style={{
          position: "fixed",
          bottom: isMobile ? "80px" : "28px",
          right: "20px",
          zIndex: 150,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "#fffbf7",
          border: "1.5px solid #e8c5a8",
          boxShadow: "0 2px 12px rgba(61,47,37,0.12)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-patrick), cursive",
          fontSize: "16px",
          color: "#9a7b6b",
        }}
      >
        ?
      </motion.button>

      {/* Wired Tutorial Dialog using unified dynamic visibility handlers */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialHint 
            forceOpen={showTutorial} 
            onClose={() => setShowTutorial(false)} 
          />
        )}
      </AnimatePresence>

      {/* Wired Interactive About Overlay Context */}
      <AboutModal
        visible={showAbout}
        onClose={() => setShowAbout(false)}
      />

      <OnboardingToast  
        visible={showOnboarding}  
        onDismiss={() => {    
          setShowOnboarding(false);    
          localStorage.setItem("cz_onboarding", "true");  
        }}
      />
      <UnlockCelebration
        pack={newlyUnlocked}
        onDone={clearUnlock}
        onUseStickers={() => setActiveNav("Stickers")}
      />
    </div>
  );
}

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: { openmoji: string; label: string };
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 12px",
        borderRadius: "12px",
        background: isActive
          ? "#fde8d8"
          : hovered
          ? "#fdf0e8"
          : "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s",
        width: "100%",
      }}
    >
      <StickerImg openmoji={item.openmoji} size={20} alt={item.label} />
      <span style={{
        fontFamily: "var(--font-patrick), cursive",
        fontSize: "15px",
        color: isActive ? "#a0563a" : "#9a7b6b",
      }}>
        {item.label}
      </span>
    </button>
  );
}

function StreakInfoButton({ isMobile = false }: { isMobile?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: "1.5px solid #e8c5a8",
          background: "#fffbf7",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-patrick), cursive",
          fontSize: "10px",
          color: "#bba89c",
          lineHeight: 1,
          padding: 0,
          flexShrink: 0,
        }}
      >
        ?
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: isMobile ? "rgba(61,47,37,0.15)" : "transparent",
                zIndex: 9998,
              }}
            />
            
            <motion.div
              initial={isMobile ? { y: "100%", x: "-50%" } : { opacity: 0, y: 10, scale: 0.95 }}
              animate={isMobile ? { y: 0, x: "-50%" } : { opacity: 1, y: 0, scale: 1 }}
              exit={isMobile ? { y: "100%", x: "-50%" } : { opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={
                isMobile
                  ? {
                      position: "fixed",
                      bottom: "20px",
                      left: "50%",
                      width: "300px",
                      maxWidth: "calc(100vw - 32px)",
                      background: "#fffbf7",
                      border: "1.5px solid #e8c5a8",
                      borderRadius: "20px",
                      padding: "20px",
                      boxShadow: "0 12px 40px rgba(61,47,37,0.2)",
                      zIndex: 9999,
                      textAlign: "left",
                    }
                  : {
                      position: "absolute",
                      bottom: "28px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "240px",
                      background: "#fffbf7",
                      border: "1.5px solid #e8c5a8",
                      borderRadius: "16px",
                      padding: "16px",
                      boxShadow: "0 8px 32px rgba(61,47,37,0.14)",
                      zIndex: 100,
                      textAlign: "left",
                    }
              }
            >
              <p style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "#c17a5b",
                marginBottom: "8px",
              }}>
                how streaks work 🔥
              </p>
              <p style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: "12px",
                color: "#6b5044",
                lineHeight: 1.6,
                marginBottom: "10px",
              }}>
                Your streak counts consecutive days with any entry — mood, note, win, or sticker.
              </p>
              <p style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: "12px",
                color: "#6b5044",
                lineHeight: 1.6,
                marginBottom: "10px",
              }}>
                You can backfill past days freely. Cozync isn't watching — this streak exists for <em>you</em>, not for us. 😼
              </p>
              <p style={{
                fontFamily: "var(--font-patrick), cursive",
                fontSize: "12px",
                color: "#c17a5b",
                lineHeight: 1.5,
                marginBottom: "12px",
              }}>
                stay honest to yourself, not to an app ✦
              </p>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "100%",
                  background: "#fde8d8",
                  border: "none",
                  borderRadius: "999px",
                  padding: "8px",
                  fontFamily: "var(--font-patrick), cursive",
                  fontSize: "13px",
                  color: "#a0563a",
                  cursor: "pointer",
                }}
              >
                got it ✦
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
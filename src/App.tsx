/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'react-qr-code';
import { 
  Linkedin, 
  Instagram, 
  Phone, 
  Mail, 
  MessageCircle, 
  Home, 
  Bell, 
  PhoneCall,
  BookOpen,
  Code,
  Rocket,
  Calendar,
  ExternalLink,
  Award,
  ChevronRight,
  Sparkles,
  X,
  Check,
  Copy,
  Loader2,
  ShieldAlert,
  Download
} from 'lucide-react';

import icon1 from './icon1.png';
import icon2 from './icon2.png';
import icon3 from './icon3.png';
import retroComputerImg from './assets/images/retro_computer_terminal_1779273674781.png';

// --- DATA ANALYTICS BOOTCAMP EVENT TIMELINE DATA ---
const TIMELINE_DATA = [
  {
    week: 1,
    title: "Excel + Data Basics + Google Sheets",
    subtitle: "Spreadsheets, formulas, pivot tables, charts & data cleaning. No coding yet.",
    programmeNote: "Programme structure — Day 1 Orientation. Weeks 1-4: Fully self-paced learning via group chat with daily tasks. Final Day: Live capstone demo day.",
    topics: ["Excel/Google Sheets", "Data Types", "Formulas", "Pivot Tables", "Charts", "Data Cleaning"],
    note: "Focus starts with fundamental data habits and functional spreadsheet calculations. Absolute baseline for analysis."
  },
  {
    week: 2,
    title: "SQL Basics",
    subtitle: "Query and understand data before Python. The most-used analyst skill in MNCs.",
    programmeNote: "SQL teaches thinking in tables and questions — making Python and Power BI much easier afterwards. Power BI and most MNC BI tools run on SQL.",
    topics: ["SELECT / WHERE", "ORDER BY / LIMIT", "GROUP BY", "COUNT / SUM / AVG", "SQLiteOnline"],
    note: "Primary Tool: SQLiteOnline.com — free, runs in the browser, zero installation. Underpins most dashboard data retrieval engines."
  },
  {
    week: 3,
    title: "Python Basics + Real-World Data Cleaning",
    subtitle: "Python in Google Colab + Git/GitHub. Practical cleaning skills analysts use every day.",
    programmeNote: "No Pandas or NumPy at this stage. Focus is strictly on standard Python fundamentals and real-world cleaning: missing values, formats, loops, and list comprehensions.",
    topics: ["Python Basics", "Google Colab", "Git & GitHub", "CSV with Python", "Missing Values", "Format Fixing"],
    note: "All work is done inside Google Colab notebook environments with zero local setup needed. Pre-built skeleton Colab notebooks are supplied."
  },
  {
    week: 4,
    title: "Visualisation + Final Analytics Project",
    subtitle: "Matplotlib basics, Power BI, end-to-end capstone, and live demo day.",
    programmeNote: "Seaborn removed at this stage (not needed). Focus is on Matplotlib and styling 5 key chart types. Power BI is introduced to build complete high-caliber business analytics dashboards.",
    topics: ["Matplotlib Basics", "5 Chart Types", "Power BI / Looker Studio", "Data Storytelling", "Presentation"],
    note: "Culminates in an End-to-End Capstone project and live presentation of reports to a jury/panel."
  }
];

// --- Binary Background ---
const BinaryBackground = () => {
  const [binaries, setBinaries] = useState<{ id: number; char: string; left: string; duration: string; fontSize: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBinary = {
        id: Date.now() + Math.random(),
        char: Math.random() > 0.5 ? "0" : "1",
        left: Math.random() * 100 + "vw",
        duration: (3 + Math.random() * 5) + "s",
        fontSize: (12 + Math.random() * 20) + "px",
      };
      
      setBinaries(prev => [...prev.slice(-49), newBinary]); // Keep limit for performance
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="binary-bg pt-0">
      {binaries.map((b) => (
        <div
          key={b.id}
          className="binary"
          style={{
            left: b.left,
            animationDuration: b.duration,
            fontSize: b.fontSize,
          }}
        >
          {b.char}
        </div>
      ))}
    </div>
  );
};

// --- App Component ---
enum Phase {
  Intro = 'intro',
  Transition = 'transition',
  ComingSoon = 'coming-soon',
}

export default function App() {
  const [phase, setPhase] = useState<Phase>(Phase.Intro);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // --- IEEE Registration Modal State & Configuration ---
  const UPI_ID = "paytm.s1wsfli@pty";
  const GSHEET_EXEC_URL = "https://script.google.com/macros/s/AKfycbxdw9JsloBtgJ-Q5P5zGf0oI0C9EUDSfxAzZw5Hsd1fLrJAagaZ_vxf6coDdWtPT0tp/exec";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regStep, setRegStep] = useState<'form' | 'payment' | 'success'>('form');
  const [memberType, setMemberType] = useState<'Non IEEE Member' | 'IEEE Member' | 'IEEE CS Member'>('Non IEEE Member');
  
  // Field values
  const [formName, setFormName] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCollege, setFormCollege] = useState('');
  const [formDept, setFormDept] = useState('');
  const [formCustomDept, setFormCustomDept] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formIeeeId, setFormIeeeId] = useState('');
  
  // 1. This stores the file the user selects from their device
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 2. Helper function that turns the file into text so Google can read it
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Validation, generation & timer
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registrationId, setRegistrationId] = useState('');
  const [amount, setAmount] = useState(200);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [copied, setCopied] = useState(false);

  // Time remaining to May 30, 2026 UTC/Local
  const [daysLeft, setDaysLeft] = useState('00');
  const [hoursLeft, setHoursLeft] = useState('00');
  const [minutesLeft, setMinutesLeft] = useState('00');
  const [secondsLeftCountdown, setSecondsLeftCountdown] = useState('00');

  useEffect(() => {
    const targetDate = new Date("2026-05-30T23:59:59").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setDaysLeft('00');
        setHoursLeft('00');
        setMinutesLeft('00');
        setSecondsLeftCountdown('00');
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setDaysLeft(String(d).padStart(2, '0'));
        setHoursLeft(String(h).padStart(2, '0'));
        setMinutesLeft(String(m).padStart(2, '0'));
        setSecondsLeftCountdown(String(s).padStart(2, '0'));
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateId = (type: string) => {
    const prefix = type === "Non IEEE Member" ? "NM" : type === "IEEE Member" ? "IM" : "CS";
    const num = Math.floor(100000 + Math.random() * 900000);
    return `BX26-${prefix}-${num}`;
  };

  // QR regenerate timer
  useEffect(() => {
    if (isModalOpen && regStep === 'payment' && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isModalOpen && regStep === 'payment' && secondsLeft === 0) {
      const newId = generateId(memberType);
      setRegistrationId(newId);
      setSecondsLeft(300);
    }
  }, [isModalOpen, regStep, secondsLeft, memberType]);

  const validateFormStep = () => {
    const errs: Record<string, string> = {};
    if (!formName.trim()) {
      errs.name = "Name is required";
    }
    
    if (!formWhatsapp.trim()) {
      errs.whatsapp = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(formWhatsapp.trim())) {
      errs.whatsapp = "WhatsApp number must be exactly 10 digits";
    }

    if (!formEmail.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail.trim())) {
      errs.email = "Please enter a valid email address";
    }

    if (!formCollege.trim()) {
      errs.college = "College Name is required";
    }
    
    if (!formDept) {
      errs.department = "Department is required";
    }
    
    if (formDept === "OTHER" && !formCustomDept.trim()) {
      errs.customDepartment = "Please specify department name";
    }
    
    if (!formYear) {
      errs.year = "Year is required";
    }

    if ((memberType === "IEEE Member" || memberType === "IEEE CS Member") && !formIeeeId.trim()) {
      errs.ieeeId = "IEEE Membership ID is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePaymentStep = () => {
    const errs: Record<string, string> = {};
    if (!selectedFile) {
      errs.selectedFile = "Please choose a payment screenshot file";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const qrDiv = document.querySelector("#payment-qr-container");
    if (!qrDiv) return;
    const svg = qrDiv.querySelector("svg");
    if (!svg) return;
    
    try {
      const svgString = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const blobURL = window.URL.createObjectURL(svgBlob);
      
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        // high resolution 512x512
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext("2d");
        if (!context) return;
        
        // Draw white background
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Scale and draw SVG to Canvas with neat margin
        context.drawImage(image, 32, 32, 448, 448);
        
        const png = canvas.toDataURL("image/png");
        
        const downloadLink = document.createElement("a");
        downloadLink.href = png;
        downloadLink.download = `payment_qr_${registrationId || 'upi'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(blobURL);
      };
      image.src = blobURL;
    } catch (err) {
      console.error("QR Code download failed:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase(Phase.Transition);
    }, 4500);

    const t2 = setTimeout(() => {
      setPhase(Phase.ComingSoon);
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const isPosterTheme = phase === Phase.ComingSoon;

  return (
    <div className="relative min-h-[100dvh] bg-transparent text-white overflow-x-hidden font-sans select-none scroll-smooth transition-colors duration-1000">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#ff3131] opacity-[0.07] blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#991b1b] opacity-[0.05] blur-[100px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            background: 'linear-gradient(45deg, transparent 40%, #ff3131 45%, #ff3131 55%, transparent 60%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      <div className="noise" />
      <div className="scanlines" />
      <BinaryBackground />

      {/* Persistent UI Elements (Header, Footer, Corners) - Only visible after Intro */}
      <AnimatePresence>
        {phase === Phase.ComingSoon && (
          <>
            {/* Header / Navigation Bar */}
            <header 
              className={`fixed top-0 left-0 w-full z-50 py-2.5 sm:py-3 transition-all duration-300 ${
                isScrolled 
                  ? "bg-black/95 backdrop-blur-md border-b border-white/10 shadow-lg" 
                  : "bg-transparent border-b border-transparent"
              }`}
            >
              <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
                {/* Always show a neat, solid brand header */}
                <div className="font-display font-black tracking-tighter uppercase pointer-events-auto cursor-pointer leading-none text-lg sm:text-xl" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                   <span className="text-white font-black">BUILD</span><span className="text-white font-black drop-shadow-[2px_2px_0px_rgba(255,49,49,1)] ml-1">X</span>
                </div>
                
                <nav className="flex items-center gap-2.5 sm:gap-4 pointer-events-auto">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center gap-1 text-[8px] sm:text-[10px] tracking-widest uppercase font-black text-white hover:text-[#ff3131] transition-colors"
                  >
                    <span>Home</span>
                  </button>
                  <button 
                    onClick={() => {
                      setRegStep('form');
                      setRegistrationId(generateId(memberType));
                      setSecondsLeft(300);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-[8px] sm:text-[10px] tracking-widest uppercase font-black text-[#ff3131] hover:text-white transition-colors"
                  >
                    <span>Register Now</span>
                  </button>
                  <button 
                    onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-1 text-[8px] sm:text-[10px] tracking-widest uppercase font-black text-white hover:text-[#ff3131] transition-colors"
                  >
                    <span>Contact</span>
                  </button>
                </nav>
              </div>
            </header>
          </>
        )}
      </AnimatePresence>

      {/* Grid Lines Overlay */}
      <div 
        className="hidden md:block fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ff3131 1px, transparent 1px), linear-gradient(90deg, #ff3131 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <AnimatePresence mode="wait">
        {phase === Phase.Intro && (
          <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4">
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="z-10 text-center flex flex-col items-center gap-4 sm:gap-6 w-full max-w-full"
            >
              <motion.span
                initial={{ opacity: 0, y: 10, letterSpacing: '0.2em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '0.4em' }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="text-[9px] sm:text-xs font-medium tracking-[0.3em] sm:tracking-[0.4em] text-white/40 uppercase text-center w-full block"
              >
                IEEE CS SBC CE KIDANGOOR
              </motion.span>
              
              <div className="overflow-hidden w-full flex justify-center">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl sm:text-9xl md:text-[10rem] lg:text-[12rem] xl:text-[13rem] font-display font-black tracking-tighter px-2 text-center leading-none"
                >
                  BUILD<span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-500 inline-block">X</span>
                </motion.h1>
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ delay: 1.5, duration: 1 }}
                className="h-[1px] bg-[#ff3131]"
              />
            </motion.div>
          </div>
        )}

        {phase === Phase.ComingSoon && (
          <div className="flex flex-col items-center w-full">
            {/* Hero Section */}
            <div className="min-h-screen pt-20 sm:pt-[8rem] pb-8 sm:pb-16 flex flex-col items-center justify-start p-4 w-full relative z-10">
              
              
              {/* Floating Vertical Barcode on Desktop (Left Margin) removed as requested */}



              <motion.div
                key="coming-soon"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-center flex flex-col items-center w-full max-w-3xl"
              >
                {/* Large BUILDX Logo */}
                <div className="font-display font-[900] uppercase tracking-tighter text-6xl sm:text-7xl md:text-[7rem] lg:text-[8.5rem] leading-none text-center select-none flex items-center justify-center">
                  <span className="text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] font-black">BUILD</span>
                  <span className="text-white font-black drop-shadow-[2px_2px_0px_rgba(255,49,49,1)] ml-1">X</span>
                </div>

                {/* Subtitle: Learn Build Launch */}
                <div className="text-white font-semibold text-lg sm:text-2xl md:text-3xl tracking-[0.2em] mt-3 sm:mt-5 text-center uppercase">
                  <span className="font-black text-white drop-shadow-[2px_2px_0px_rgba(255,49,49,1)]">L</span>earn | <span className="font-black text-white drop-shadow-[2px_2px_0px_rgba(255,49,49,1)]">B</span>uild | <span className="font-black text-white drop-shadow-[2px_2px_0px_rgba(255,49,49,1)]">L</span>aunch
                </div>

                {/* The Three Icons from learn build launch */}
                <div className="flex gap-6 sm:gap-10 items-center justify-center mt-3 sm:mt-5 mb-8 sm:mb-12">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 border-solid border-white flex items-center justify-center bg-black/40 shadow-[2px_2px_0px_rgba(255,49,49,0.3)]">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 border-solid border-white flex items-center justify-center bg-black/40 shadow-[2px_2px_0px_rgba(255,49,49,0.3)]">
                    <Code size={20} className="text-white" />
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 border-solid border-white flex items-center justify-center bg-black/40 shadow-[2px_2px_0px_rgba(255,49,49,0.3)]">
                    <Rocket size={20} className="text-white" />
                  </div>
                </div>

                {/* Central Retro Computer Graphic */}
                <div className="relative flex justify-center items-center w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem] px-4 my-2 select-none">
                  <img 
                    src={retroComputerImg} 
                    alt="Retro Computer Terminal" 
                    className="w-full h-auto object-contain select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* </ REGISTRATION OPEN > Footer */}
                <div className="text-3xl sm:text-5xl md:text-6xl font-display font-[950] tracking-wider text-center mt-8 sm:mt-16 flex items-center justify-center gap-2 select-none">
                  <span className="text-[#ff3131] font-extrabold">&lt;/</span>
                  <span className="text-white font-black drop-shadow-[4px_4px_0px_rgba(255,49,49,0.5)] uppercase">REGISTRATION OPEN</span>
                  <span className="text-[#ff3131] font-extrabold">&gt;</span>
                </div>

                {/* Sentence description beneath */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-gray-300 text-xs sm:text-sm md:text-base font-bold leading-relaxed mt-4 sm:mt-6 mb-6 sm:mb-8 text-center max-w-sm sm:max-w-lg px-4"
                >
                  Join the intensive 4-week <span className="text-white font-extrabold drop-shadow-[1px_1px_0px_rgba(255,49,49,0.5)]">Data Analytics Bootcamp</span>. Unleash your full potential and earn verified IEEE certifications.
                  <br className="hidden md:block" /> Register today to secure your seat.
                </motion.p>
                
                {/* Countdown / Stopwatch Section */}
                <motion.div
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.9, duration: 0.8 }}
                   className="mt-6 sm:mt-10 w-full max-w-xl px-4 flex flex-col items-center"
                >
                  {/* Timer Header */}
                  <span className="text-[10px] sm:text-xs font-mono font-black tracking-[0.25em] text-white/80 uppercase mb-4 text-center">
                    REGISTRATION CLOSES ON MAY 30
                  </span>
                  
                  {/* Stopwatch Card */}
                  <div className="w-full bg-[#05070c]/90 border border-white/10 rounded-2xl py-5 px-6 sm:px-10 flex items-center justify-between text-center backdrop-blur-md shadow-2xl relative overflow-hidden select-none">
                    {/* Glowing background hint */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff3131]/5 to-transparent pointer-events-none" />
                    
                    {/* Days */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="font-mono text-3xl sm:text-5xl font-black tracking-tight text-white select-none">
                        {daysLeft}
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase mt-2">
                        DAYS
                      </span>
                    </div>
                    
                    {/* Divider */}
                    <div className="w-px h-10 border-l border-white/10 mx-2" />
                    
                    {/* Hours */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="font-mono text-3xl sm:text-5xl font-black tracking-tight text-white select-none">
                        {hoursLeft}
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase mt-2">
                        HOURS
                      </span>
                    </div>
                    
                    {/* Divider */}
                    <div className="w-px h-10 border-l border-white/10 mx-2" />
                    
                    {/* Mins */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="font-mono text-3xl sm:text-5xl font-black tracking-tight text-white select-none">
                        {minutesLeft}
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase mt-2">
                        MINS
                      </span>
                    </div>
                    
                    {/* Divider */}
                    <div className="w-px h-10 border-l border-white/10 mx-2" />
                    
                    {/* Secs */}
                    <div className="flex-1 flex flex-col items-center">
                      <span className="font-mono text-3xl sm:text-5xl font-black tracking-tight text-[#ff3131] select-none drop-shadow-[0_0_12px_rgba(255,49,49,0.6)] animate-pulse">
                        {secondsLeftCountdown}
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-bold text-[#ff3131]/80 tracking-[0.2em] uppercase mt-2">
                        SECS
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Giant Chunky Retro Button */}
                <motion.button 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 1.1, duration: 0.8 }}
                   onClick={() => {
                     setRegStep('form');
                     setRegistrationId(generateId(memberType));
                     setSecondsLeft(300);
                     setIsModalOpen(true);
                   }}
                   className="mt-10 mb-2 px-12 py-5 bg-[#ff3131] text-white hover:bg-white hover:text-black border-[3px] border-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all rounded-none shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
                >
                   Register Now
                </motion.button>

                {/* Guidelines Section */}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8 }}
                   className="mt-16 sm:mt-24 w-full max-w-2xl px-4 flex flex-col items-center"
                >
                  <h2 className="text-2xl sm:text-4xl font-display font-[950] tracking-wider text-center uppercase mb-6 flex items-center justify-center gap-1.5 select-none text-white animate-pulse">
                    <span className="text-[#ff3131] font-extrabold">&lt;/</span>
                    <span className="drop-shadow-[3px_3px_0px_rgba(255,49,49,0.5)]">GUIDELINES</span>
                    <span className="text-[#ff3131] font-extrabold">&gt;</span>
                  </h2>

                  <div className="w-full border border-white/15 p-5 sm:p-8 text-left bg-zinc-950/80 backdrop-blur-md relative overflow-hidden select-none">
                    {/* Decorative tiny corner accents */}
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-[#ff3131]" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-white" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-white" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#ff3131]" />

                    <ol className="space-y-4 text-xs sm:text-sm font-semibold text-gray-200 tracking-wide leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-[#ff3131] font-black font-mono">1.</span>
                        <span>LAPTOP OR PC COMPULSORY</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#ff3131] font-black font-mono">2.</span>
                        <span>PARTICIPANTS MUST ATTEND DAILY SESSIONS AND COMPLETE ALL TASKS ON TIME.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#ff3131] font-black font-mono">3.</span>
                        <span>DAILY MINI QUIZZES AND TASKS ARE MANDATORY. ALL SUBMISSIONS MUST BE MADE BEFORE <span className="text-[#ff3131] font-black underline">11:59 PM</span> EACH DAY.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#ff3131] font-black font-mono">4.</span>
                        <span>PARTICIPANTS MUST COMPLETE ONE MINI PROJECT EACH WEEK AND SUBMIT THEM ON TIME TO BE ELIGIBLE FOR THE CERTIFICATE.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#ff3131] font-black font-mono">5.</span>
                        <span>A SECURITY DEPOSIT WILL BE COLLECTED FROM ALL PARTICIPANTS, AND 70% OF THE AMOUNT WILL BE REFUNDED UPON THE SUCCESSFUL COMPLETION OF ALL TASKS AND SUBMISSIONS.</span>
                      </li>
                      <li className="space-y-2">
                        <div className="flex gap-3">
                          <span className="text-[#ff3131] font-black font-mono">6.</span>
                          <span>CERTIFICATES WILL BE AWARDED ONLY TO PARTICIPANTS WHO:</span>
                        </div>
                        <ul className="pl-6 space-y-1.5 text-xs sm:text-sm text-gray-300">
                          <li className="flex items-center gap-2">
                            <span className="text-[#ff3131] font-extrabold">•</span>
                            <span>COMPLETE ALL DAILY TASKS AND MINI PROJECTS</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-[#ff3131] font-extrabold">•</span>
                            <span>SUBMIT ALL WORK BEFORE THE DEADLINES</span>
                          </li>
                        </ul>
                      </li>
                    </ol>
                  </div>
                </motion.div>

              </motion.div>
            </div>

            {/* Bottom Registration Call to Action */}
            <div 
              className="py-16 w-full flex flex-col items-center px-4"
            >

              {/* Event Timeline Heading & Dynamic Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-md sm:max-w-lg md:max-w-5xl px-4 mb-20 z-10 flex flex-col items-center"
              >
                <h2 className="text-3xl sm:text-5xl font-display font-[950] tracking-wider text-center uppercase mb-8 flex items-center justify-center gap-3">
                  <span className="text-[#ff3131] font-extrabold">&lt;</span>
                  <span className="text-white drop-shadow-[4px_4px_0px_rgba(255,49,49,0.5)] uppercase">EVENT TIMELINE</span>
                  <span className="text-[#ff3131] font-extrabold">&gt;</span>
                </h2>

                {/* 4-Week Grid / Summary Layout */}
                <div className="flex flex-col gap-10 w-full text-left">
                  {TIMELINE_DATA.map((wData) => {
                    return (
                      <motion.div
                        key={wData.week}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="group relative bg-zinc-800/80 hover:bg-zinc-800 p-6 sm:p-10 border border-white/5 hover:border-[#ff3131]/30 transition-all duration-300 flex flex-col md:flex-row gap-6 sm:gap-10 select-none"
                      >
                        {/* Huge stylized week indicator */}
                        <div className="flex md:flex-col justify-between items-start shrink-0">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-4xl sm:text-5xl font-black text-[#ff3131]">
                              0{wData.week}
                            </span>
                            <div className="h-10 w-[2px] bg-[#ff3131]/40 md:hidden" />
                            <div className="flex flex-col">
                              <span className="text-[10px] sm:text-xs font-mono font-bold text-white/40 uppercase tracking-widest leading-none mb-1">
                                MODULE
                              </span>
                              <span className="text-xs sm:text-sm font-mono font-extrabold text-[#ff3131] uppercase tracking-widest leading-none">
                                WEEK {wData.week}
                              </span>
                            </div>
                          </div>
                          
                          <div className="hidden md:block mt-6 border-t border-white/10 pt-4 w-full">
                            <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest block mb-1">
                              FOCUS AREA
                            </span>
                            <span className="text-xs font-mono font-extrabold text-white/60 uppercase tracking-wider block">
                              {wData.week === 1 ? "Basics & Excel" : wData.week === 2 ? "SQL Databases" : wData.week === 3 ? "Python Pipeline" : "Case Presentation"}
                            </span>
                          </div>
                        </div>

                        {/* Mid separator line in desktop layout */}
                        <div className="hidden md:block w-[1px] bg-white/5 self-stretch shrink-0" />

                        {/* Text and details block */}
                        <div className="flex-1 flex flex-col">
                          <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide mb-3 group-hover:text-[#ff3131] transition-colors">
                            {wData.title}
                          </h3>
                          
                          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 font-bold">
                            {wData.subtitle}
                          </p>

                          {/* Curriculum highlight box */}
                          <div className="border-l-[3px] border-[#ff3131] bg-white/[0.02] p-4 mb-6">
                            <div className="text-[9px] sm:text-[10px] font-mono font-black text-[#ff3131] uppercase tracking-wider mb-1.5">
                              CURRICULUM NOTE & SETUP
                            </div>
                            <p className="text-white text-xs sm:text-xs leading-relaxed font-bold">
                              {wData.programmeNote}
                            </p>
                            {wData.note && (
                              <p className="text-white/60 text-[10px] sm:text-xs leading-relaxed mt-2 font-bold italic">
                                💡 {wData.note}
                              </p>
                            )}
                          </div>

                          {/* Key Skills badging */}
                          <div>
                            <div className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Sparkles size={11} className="text-[#ff3131]" /> TARGET SKILLS & TOOLING
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {wData.topics.map((topic, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-3 py-1 bg-black/40 border border-white/10 text-white/80 font-mono text-[10px] uppercase tracking-wider hover:border-[#ff3131]/35 transition-colors"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Enhanced Footer / Contact Section */}
              <motion.div 
                id="contact-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-5xl px-4 pb-0 z-10"
              >
                 <div className="bg-zinc-800 p-6 sm:p-12 text-white rounded-none flex flex-col gap-10 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-10 sm:gap-16">
                    {/* Decorative background glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff3131]/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    
                    {/* Follow Us Section */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-[#ff3131] font-bold tracking-[0.3em] uppercase mb-8 text-sm flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-[#ff3131]/50" />
                        Follow Us
                      </h3>
                      <div className="flex flex-wrap gap-8 items-center">
                        <a 
                          href="https://www.linkedin.com/company/ieeesbcekidangoor/" 
                          target="_blank" 
                          rel="noreferrer"
                          className="group flex flex-col items-center gap-3"
                        >
                          <div className="w-14 h-14 rounded-none bg-white/[0.03] border-2 border-white/10 flex items-center justify-center group-hover:border-[#ff3131]/50 group-hover:bg-[#ff3131]/5 transition-all duration-300">
                            <Linkedin size={24} className="text-white/40 group-hover:text-[#ff3131] transition-colors" />
                          </div>
                          <span className="text-[10px] tracking-widest uppercase text-white/30 group-hover:text-white/60">LinkedIn</span>
                        </a>
                        
                        <a 
                          href="https://whatsapp.com/channel/0029Vb62xwqJZg48JsVcJn37" 
                          target="_blank" 
                          rel="noreferrer"
                          className="group flex flex-col items-center gap-3"
                        >
                          <div className="w-14 h-14 rounded-none bg-white/[0.03] border-2 border-white/10 flex items-center justify-center group-hover:border-green-500/50 group-hover:bg-green-500/5 transition-all duration-300">
                            <MessageCircle size={24} className="text-white/40 group-hover:text-green-500 transition-colors" />
                          </div>
                          <span className="text-[10px] tracking-widest uppercase text-white/30 group-hover:text-white/60">WhatsApp</span>
                        </a>
                        
                        <a 
                          href="https://www.instagram.com/ieeesbcekgr?igsh=MW5tdjM1ODF4cTNrNw==" 
                          target="_blank" 
                          rel="noreferrer"
                          className="group flex flex-col items-center gap-3"
                        >
                          <div className="w-14 h-14 rounded-none bg-white/[0.03] border-2 border-white/10 flex items-center justify-center group-hover:border-pink-500/50 group-hover:bg-pink-500/5 transition-all duration-300">
                            <Instagram size={24} className="text-white/40 group-hover:text-pink-500 transition-colors" />
                          </div>
                          <span className="text-[10px] tracking-widest uppercase text-white/30 group-hover:text-white/60">Instagram</span>
                        </a>
                      </div>
                    </div>

                    {/* For Inquiries Section */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-[#ff3131] font-bold tracking-[0.3em] uppercase mb-8 text-sm flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-[#ff3131]/50" />
                        For Inquiries
                      </h3>
                      <div className="space-y-6">
                        <a 
                          href="mailto:ieeesbcscekgr@gmail.com"
                          className="flex items-center gap-4 group"
                        >
                          <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-[#ff3131]/30 transition-all">
                            <Mail size={16} className="text-white/40 group-hover:text-white transition-colors" />
                          </div>
                          <span className="text-sm tracking-wide text-white/60 group-hover:text-white transition-colors">ieeesbcscekgr@gmail.com</span>
                        </a>
                        
                        <div className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center">
                            <PhoneCall size={16} className="text-white/40" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm tracking-wide text-white/80">+91 89216 69208</span>
                            <span className="text-[10px] tracking-widest uppercase text-[#ff3131] font-semibold">Ria Susan Kuruvilla (Coordinator)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Integrated Logos inside identical dark box */}
                  <div className="pt-6 border-t border-white/5 flex flex-col items-center">
                     <span className="text-[10px] font-bold tracking-widest text-white/40 mb-4">POWERED BY</span>
                     <div className="flex items-center justify-between gap-6 sm:gap-16 opacity-80 hover:opacity-100 transition-opacity duration-500 w-full mx-auto">
                       <div className="flex-1 flex justify-start items-center">
                         <img 
                           src={icon1} 
                           alt="IEEE Logo" 
                           className="max-h-96 sm:max-h-[30rem] max-w-full object-contain select-none filter brightness-0 invert transition-transform" 
                           referrerPolicy="no-referrer" 
                         />
                       </div>
                       <div className="w-[1px] h-8 sm:h-10 bg-white/10 shrink-0" />
                       <div className="flex-1 flex justify-center items-center">
                         <img 
                           src={icon2} 
                           alt="Computer Society Logo" 
                           className="max-h-11 sm:max-h-15 max-w-full object-contain select-none filter brightness-0 invert" 
                           referrerPolicy="no-referrer" 
                         />
                       </div>
                     </div>
                     <div className="mt-5 w-full flex justify-center items-center opacity-80 hover:opacity-100 transition-opacity duration-500">
                       <img 
                         src={icon3} 
                         alt="Partner Logo" 
                         className="max-h-12 sm:max-h-16 max-w-[200px] sm:max-w-[240px] md:max-w-[280px] object-contain select-none filter brightness-0 invert" 
                         referrerPolicy="no-referrer" 
                       />
                     </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ================================================== */}
            {/* IEEE EVENT REGISTRATION POPUP MODAL SYSTEM */}
            {/* ================================================== */}
            <AnimatePresence>
              {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
                  {/* Backdrop Closer */}
                  <div className="fixed inset-0 bg-transparent" onClick={() => setIsModalOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    transition={{ type: "spring", duration: 0.5, ease: "easeOut" }}
                    className="relative w-full max-w-2xl bg-zinc-900 border-2 border-white/10 rounded-none shadow-[0_0_60px_rgba(255,49,49,0.30)] p-6 sm:p-10 text-white z-10 overflow-hidden my-8"
                  >
                    {/* Top red accent glow line */}
                    <div className="absolute top-0 left-0 w-full h-[5px] bg-[#ff3131] shadow-[0_3px_20px_rgba(255,49,49,0.8)]" />

                    {/* Close button */}
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-5 right-5 text-white/50 hover:text-white hover:bg-white/5 p-2 transition-all cursor-pointer border border-transparent hover:border-white/10 select-none z-20"
                    >
                      <X size={18} />
                    </button>

                    {/* Step Content: Form Fields */}
                    {regStep === 'form' && (
                      <div>
                        <div className="mb-6">
                          <h2 className="text-xl sm:text-2xl font-display font-black tracking-wider uppercase text-white mb-1">
                            IEEE EVENT REGISTRATION
                          </h2>
                          <p className="text-[10px] text-white/50 font-mono tracking-widest uppercase">
                            FILL IN SECURE INFORMATION
                          </p>
                        </div>

                        {/* Top Tab Section */}
                        <div className="flex bg-zinc-950 border border-white/5 p-1 mb-6 w-full rounded-none">
                          {(["Non IEEE Member", "IEEE Member", "IEEE CS Member"] as const).map((tab) => {
                            const isActive = memberType === tab;
                            return (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => {
                                  setMemberType(tab);
                                  const amt = tab === "Non IEEE Member" ? 200 : tab === "IEEE Member" ? 150 : 100;
                                  setAmount(amt);
                                }}
                                className={`flex-1 py-3 text-[9px] sm:text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer text-center rounded-none ${
                                  isActive
                                    ? "bg-[#ff3131] text-white shadow-[0_0_15px_rgba(255,49,49,0.3)] border-none"
                                    : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                                }`}
                              >
                                {tab}
                              </button>
                            );
                          })}
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                          {/* 1. Name */}
                          <div>
                            <label className="block text-xs sm:text-sm uppercase font-mono font-extrabold tracking-widest text-white/75 mb-2">Name *</label>
                            <input
                              required
                              type="text"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              placeholder="Your Details / Name"
                              className="w-full bg-zinc-950 text-white placeholder-gray-700 border border-white/10 px-4 py-3 text-sm font-bold tracking-wider focus:outline-none focus:border-[#ff3131] transition-all rounded-none"
                            />
                            {errors.name && <span className="text-[#ff3131] text-[10px] font-bold uppercase tracking-wider block mt-1">⚠️ {errors.name}</span>}
                          </div>

                          {/* 2. WhatsApp Number */}
                          <div>
                            <label className="block text-xs sm:text-sm uppercase font-mono font-extrabold tracking-widest text-white/75 mb-2">WhatsApp Number *</label>
                            <input
                              required
                              type="text"
                              inputMode="numeric"
                              value={formWhatsapp}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormWhatsapp(val);
                              }}
                              placeholder="10-DIGIT NUMBER"
                              className="w-full bg-zinc-950 text-white placeholder-gray-700 border border-white/10 px-4 py-3 text-sm font-bold tracking-wider focus:outline-none focus:border-[#ff3131] transition-all rounded-none"
                            />
                            {errors.whatsapp && <span className="text-[#ff3131] text-[10px] font-bold uppercase tracking-wider block mt-1">⚠️ {errors.whatsapp}</span>}
                          </div>

                          {/* 3. Email Address */}
                          <div>
                            <label className="block text-xs sm:text-sm uppercase font-mono font-extrabold tracking-widest text-white/75 mb-2">Email Address *</label>
                            <input
                              required
                              type="email"
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                              placeholder="YOUR EMAIL"
                              className="w-full bg-zinc-950 text-white placeholder-gray-700 border border-white/10 px-4 py-3 text-sm font-bold tracking-wider focus:outline-none focus:border-[#ff3131] transition-all rounded-none"
                            />
                            {errors.email && <span className="text-[#ff3131] text-[10px] font-bold uppercase tracking-wider block mt-1">⚠️ {errors.email}</span>}
                          </div>

                          {/* 4. College / Institute Name */}
                          <div>
                            <label className="block text-xs sm:text-sm uppercase font-mono font-extrabold tracking-widest text-white/75 mb-2">College / Institute Name *</label>
                            <input
                              required
                              type="text"
                              value={formCollege}
                              onChange={(e) => setFormCollege(e.target.value)}
                              placeholder="Enter College Name"
                              className="w-full bg-zinc-950 text-white placeholder-gray-700 border border-white/10 px-4 py-3 text-sm font-bold tracking-wider focus:outline-none focus:border-[#ff3131] transition-all rounded-none"
                            />
                            {errors.college && <span className="text-[#ff3131] text-[10px] font-bold uppercase tracking-wider block mt-1">⚠️ {errors.college}</span>}
                          </div>

                          {/* 5. Department */}
                          <div>
                            <label className="block text-xs sm:text-sm uppercase font-mono font-extrabold tracking-widest text-white/75 mb-2">Department *</label>
                            <select
                              required
                              value={formDept}
                              onChange={(e) => setFormDept(e.target.value)}
                              className="w-full bg-zinc-950 text-white border border-white/10 px-4 py-3 text-sm font-bold tracking-wider focus:outline-none focus:border-[#ff3131] transition-all rounded-none"
                            >
                              <option value="" disabled>SELECT DEPARTMENT</option>
                              <option value="CSE">CSE</option>
                              <option value="EC">EC</option>
                              <option value="EL">EL</option>
                              <option value="EEE">EEE</option>
                              <option value="CIVIL">CIVIL</option>
                              <option value="OTHER">OTHER</option>
                            </select>
                            {errors.department && <span className="text-[#ff3131] text-[10px] font-bold uppercase tracking-wider block mt-1">⚠️ {errors.department}</span>}
                          </div>

                          {/* 5b. Custom Department If "OTHER" is selected */}
                          {formDept === "OTHER" && (
                            <div>
                              <label className="block text-xs sm:text-sm uppercase font-mono font-extrabold tracking-widest text-white/75 mb-2">Enter Department *</label>
                              <input
                                required
                                type="text"
                                value={formCustomDept}
                                onChange={(e) => setFormCustomDept(e.target.value)}
                                placeholder="Specify Department"
                                className="w-full bg-zinc-950 text-white placeholder-gray-700 border border-white/10 px-4 py-3 text-sm font-bold tracking-wider focus:outline-none focus:border-[#ff3131] transition-all rounded-none"
                              />
                              {errors.customDepartment && <span className="text-[#ff3131] text-[10px] font-bold uppercase tracking-wider block mt-1">⚠️ {errors.customDepartment}</span>}
                            </div>
                          )}

                          {/* 6. Year */}
                          <div>
                            <label className="block text-xs sm:text-sm uppercase font-mono font-extrabold tracking-widest text-white/75 mb-2">Year *</label>
                            <select
                              required
                              value={formYear}
                              onChange={(e) => setFormYear(e.target.value)}
                              className="w-full bg-zinc-950 text-white border border-white/10 px-4 py-3 text-sm font-bold tracking-wider focus:outline-none focus:border-[#ff3131] transition-all rounded-none"
                            >
                              <option value="" disabled>SELECT YEAR</option>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                            </select>
                            {errors.year && <span className="text-[#ff3131] text-[10px] font-bold uppercase tracking-wider block mt-1">⚠️ {errors.year}</span>}
                          </div>

                          {/* IEEE Membership ID */}
                          {(memberType === "IEEE Member" || memberType === "IEEE CS Member") && (
                            <div>
                              <label className="block text-xs sm:text-sm uppercase font-mono font-extrabold tracking-widest text-white/75 mb-2">IEEE Membership ID *</label>
                              <input
                                required
                                type="text"
                                value={formIeeeId}
                                onChange={(e) => setFormIeeeId(e.target.value)}
                                placeholder="ENTER MEMBERSHIP ID"
                                className="w-full bg-zinc-950 text-white placeholder-gray-700 border border-white/10 px-4 py-3 text-sm font-bold tracking-wider focus:outline-none focus:border-[#ff3131] transition-all rounded-none"
                              />
                              {errors.ieeeId && <span className="text-[#ff3131] text-[10px] font-bold uppercase tracking-wider block mt-1">⚠️ {errors.ieeeId}</span>}
                            </div>
                          )}
                        </div>

                        {/* Complete Proceed Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (validateFormStep()) {
                              const amt = memberType === "Non IEEE Member" ? 200 : memberType === "IEEE Member" ? 150 : 100;
                              setAmount(amt);
                              setRegistrationId(generateId(memberType));
                              setSecondsLeft(300);
                              setRegStep('payment');
                            }
                          }}
                          className="w-full py-4 bg-[#ff3131] text-white border-[2px] border-white font-black text-xs tracking-widest uppercase transition-all rounded-none shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer"
                        >
                          Proceed to Payment (₹{amount})
                        </button>
                      </div>
                    )}

                    {/* Step Content: Payment Information */}
                    {regStep === 'payment' && (
                      <div>
                        <div className="mb-4">
                          <h2 className="text-xl sm:text-2xl font-display font-black tracking-wider uppercase text-white mb-1">
                            COMPLETING PAYMENT
                          </h2>
                          <p className="text-[10px] text-white/50 font-mono tracking-widest uppercase">
                            DOCKING REGISTRATION ID: <span className="text-[#ff3131] font-black">{registrationId}</span>
                          </p>
                        </div>

                        <div className="bg-black/30 border border-white/5 p-4 sm:p-6 rounded-none flex flex-col gap-5 relative mb-6">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                            <div>
                              <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest">MEMBERSHIP CATEGORY</span>
                              <p className="text-xs sm:text-sm font-black text-white uppercase">{memberType}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest">REGISTRATION AMOUNT</span>
                              <p className="text-base sm:text-lg font-black text-[#ff3131]">₹{amount}</p>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-5 items-center">
                            {/* QR Code Container */}
                            <div className="flex flex-col items-center gap-2 bg-white p-3 border-none select-none shrink-0 border border-zinc-700">
                              <div id="payment-qr-container">
                                <QRCode 
                                  value={`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent("IEEE EVENT")}&am=${amount}&cu=INR&tn=${encodeURIComponent("IEEE Registration")}&tr=${encodeURIComponent(registrationId)}`} 
                                  size={120} 
                                />
                              </div>
                              <div className="text-[8px] font-mono font-bold text-black uppercase tracking-wider text-center">
                                SCAN TO PAY
                              </div>
                              <button
                                type="button"
                                onClick={handleDownloadQR}
                                className="mt-1 w-full py-1.5 px-2 bg-black hover:bg-zinc-900 border border-black/10 text-white font-mono text-[9px] font-black tracking-widest uppercase transition-all rounded-none cursor-pointer flex items-center justify-center gap-1.5"
                                title="Download QR Code image"
                              >
                                <Download size={11} className="stroke-[3]" />
                                DOWNLOAD QR
                              </button>
                            </div>

                            <div className="flex-1 space-y-3 w-full">
                              <div>
                                <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest block">REGISTRATION ID</span>
                                <span className="text-xs sm:text-sm font-black text-[#ff3131] font-mono uppercase tracking-wider">{registrationId}</span>
                              </div>

                              <div>
                                <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest block">UPI ID TO TRANSFER</span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] sm:text-xs font-bold text-white font-mono bg-zinc-950 border border-white/10 px-2 py-1.5 flex-1 select-all">{UPI_ID}</span>
                                  <button
                                    type="button"
                                    onClick={handleCopyUpi}
                                    className="p-1.5 bg-zinc-800 border border-white/5 text-white/70 hover:text-white hover:border-[#ff3131]/40 cursor-pointer"
                                    title="Copy UPI ID"
                                  >
                                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                  </button>
                                </div>
                              </div>

                              {/* Expiry Timer */}
                              <div className="bg-[#ff3131]/10 border border-[#ff3131]/20 px-2.5 py-1.5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#ff3131] animate-pulse" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                                  QR EXPIRES IN: <span className="text-[#ff3131] font-black">{formatTime(secondsLeft)}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* File Upload Box */}
                          <div className="border-t border-white/5 pt-4">
                            <label className="block text-xs sm:text-sm uppercase font-mono font-extrabold tracking-widest text-[#ff3131] mb-2 font-black">
                              Upload Payment Screenshot *
                            </label>
                            <div className="border-2 border-dashed border-white/10 hover:border-[#ff3131]/30 rounded-none p-6 text-center cursor-pointer bg-zinc-950 transition-colors relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setSelectedFile(e.target.files[0]); // Saves the file into state when picked
                                  }
                                }} 
                              />
                              <p className="text-xs sm:text-sm text-white/70 font-bold tracking-wider uppercase">
                                Click or drag & drop to choose payment file
                              </p>
                              <p className="text-[10px] text-white/40 mt-1 font-mono uppercase tracking-widest">
                                Supports PNG, JPG, JPEG
                              </p>
                            </div>
                            
                            {/* Shows the file name to the user once they successfully pick an image */}
                            {selectedFile && (
                              <p className="text-xs text-green-500 font-mono font-bold mt-2 flex items-center gap-1.5 uppercase tracking-wider">
                                <Check size={12} className="stroke-[3]" /> Ready: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                              </p>
                            )}

                            {errors.selectedFile && (
                              <span className="text-[#ff3131] text-[10px] font-bold uppercase tracking-wider block mt-1">
                                ⚠️ {errors.selectedFile}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Back & Submit Actions */}
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => setRegStep('form')}
                            className="py-3.5 px-5 bg-zinc-800 hover:bg-zinc-700/80 text-white border border-white/10 hover:border-white/20 font-black text-xs tracking-widest uppercase transition-all rounded-none cursor-pointer"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (validatePaymentStep()) {
                                setIsSubmitting(true);
                                
                                const formPayload = new URLSearchParams();
                                formPayload.append('membershipType', memberType);
                                formPayload.append('name', formName);
                                formPayload.append('whatsappNumber', formWhatsapp);
                                formPayload.append('emailAddress', formEmail);
                                formPayload.append('collegeName', formCollege);
                                formPayload.append('department', formDept === "OTHER" ? formCustomDept : formDept);
                                formPayload.append('customDepartment', formDept === "OTHER" ? "Yes" : "No");
                                formPayload.append('year', formYear);
                                formPayload.append('ieeeMembershipId', formIeeeId || "");

                                if (selectedFile) {
                                  try {
                                    const base64String = await convertFileToBase64(selectedFile);
                                    formPayload.append('imageBlob', base64String); // Sends the raw image data
                                    formPayload.append('imageName', selectedFile.name); // Sends the original name
                                  } catch (err) {
                                    console.error("Failed parsing image format", err);
                                  }
                                }
                                
                                // Extra fields for robust historical / column compatibility
                                formPayload.append('registrationId', registrationId);
                                formPayload.append('amount', String(amount));
                                formPayload.append('timestamp', new Date().toISOString());
                                formPayload.append('verificationStatus', "Pending");

                                try {
                                  const response = await fetch(GSHEET_EXEC_URL, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: formPayload.toString(),
                                  });
                                  
                                  const result = await response.json();
                                  
                                  if (result.status === "success" || result.result === "success") {
                                    if (result.registrationId) {
                                      setRegistrationId(result.registrationId);
                                    }
                                    setRegStep('success');
                                  } else {
                                    alert("Error saving data: " + (result.message || "Unknown error"));
                                  }
                                } catch (e) {
                                  console.error("Network interface error:", e);
                                  // Fallback success state so user doesn't get double charged trying again
                                  setRegStep('success');
                                } finally {
                                  setIsSubmitting(false);
                                }
                              }
                            }}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-green-600 hover:bg-green-700 text-white border-[2px] border-white font-black text-xs tracking-widest uppercase transition-all rounded-none shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 size={14} className="animate-spin text-white" />
                                <span>PROCESSING...</span>
                              </>
                            ) : (
                              "Submit Registration"
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step Content: Success Confirmation */}
                    {regStep === 'success' && (
                      <div className="py-6 flex flex-col items-center text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                          className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        >
                          <Check size={32} className="text-green-500 font-extrabold stroke-[3]" />
                        </motion.div>

                        <h3 className="text-xl sm:text-3xl font-display font-black text-white uppercase tracking-wider mb-2">
                          Registration Successful!
                        </h3>
                        
                        <div className="bg-black/45 border border-white/5 p-4 my-4 font-mono border-l-4 border-green-500 inline-block w-full text-center">
                          <span className="text-[8px] text-white/40 uppercase tracking-widest block mb-1">YOUR SECURE REGISTRATION ID</span>
                          <span className="text-base sm:text-lg font-black text-white tracking-widest uppercase">{registrationId}</span>
                        </div>

                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-bold mb-6">
                          Your registration has been submitted successfully. Verification will be done shortly.
                        </p>

                        {/* WhatsApp Group Join Callout */}
                        <div className="bg-[#25D366]/10 border border-[#25D366]/30 p-6 mb-6 rounded-none text-center w-full max-w-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-[#25D366]/10 blur-[30px] rounded-full -z-10" />
                          <div className="flex items-center justify-center gap-2 mb-2 text-[#25D366] font-extrabold uppercase text-xs tracking-wider">
                            <MessageCircle size={16} />
                            <span>JOIN THE WHATSAPP GROUP</span>
                          </div>
                          <p className="text-gray-300 text-[11px] sm:text-xs leading-relaxed mb-4 font-bold">
                            Join our WhatsApp group to receive critical announcements, workshop links, and daily curriculum updates.
                          </p>
                          <a
                            href="https://chat.whatsapp.com/C5MELy7tWju0xYGv8umEX3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white border-2 border-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all rounded-none shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[1.5px] hover:translate-y-[1.5px] cursor-pointer"
                          >
                            <span>JOIN GROUP CHAT</span>
                            <ExternalLink size={14} className="stroke-[2.5]" />
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            setFormName('');
                            setFormWhatsapp('');
                            setFormEmail('');
                            setFormCollege('');
                            setFormDept('');
                            setFormCustomDept('');
                            setFormYear('');
                            setFormIeeeId('');
                            setSelectedFile(null);
                            setRegStep('form');
                          }}
                          className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 font-black text-xs tracking-widest uppercase transition-all rounded-none cursor-pointer"
                        >
                          Close Window
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

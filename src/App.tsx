/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Rocket
} from 'lucide-react';

import icon1 from './icon1.png';
import icon2 from './icon2.png';
import retroComputerImg from './assets/images/retro_computer_terminal_1779273674781.png';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState(''); // Tracks the validation warning string
  const [isScrolled, setIsScrolled] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ⚠️ CRITICAL BACKEND CONFIGURATION NOTE:
  // Replace this placeholder with your production Web App execution URL copied from App Script deployments.
  // It must end in /exec. Do NOT use the raw Library URL path (/macros/library/d/...).
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbynnH2VPMjxpMLuNZuas6nKC5RCL0zxHw2MzsAh_TCaxU9xq8dkx_J5ktSiOIuhM0e_/exec";

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = value;

    // Remove the error message actively as soon as they reach exactly 10 digits
    if (value.length > 0 && value.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
    } else {
      setPhoneError('');
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      userName: formData.get('userName'),
      userPhone: formData.get('userPhone')
    };

    // Strict safety check before hit sending
    if (!data.userPhone || (data.userPhone as string).length !== 10) {
      setPhoneError('A complete 10-digit mobile number is required to proceed.');
      return;
    }

    setIsSubmitting(true);
    setPhoneError('');

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      setShowSuccess(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSubmitting(false);
    }
  };

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
            <header className="fixed top-0 left-0 w-full z-50 py-4 bg-transparent border-none">
              <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
                {/* Always show a neat, solid brand header */}
                <div className="font-display font-black tracking-tighter uppercase pointer-events-auto cursor-pointer leading-none text-xl sm:text-2xl" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
                    onClick={scrollToForm}
                    className="flex items-center gap-1 text-[8px] sm:text-[10px] tracking-widest uppercase font-black text-white hover:text-[#ff3131] transition-colors"
                  >
                    <span>Notify Me</span>
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

            <motion.div
              key="ui-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="fixed inset-0 z-40 pointer-events-none"
            >
              {/* Footer Spacer */}
              <footer className="absolute top-4 sm:top-2 bottom-auto left-0 w-full px-6 sm:px-12 py-2 sm:py-0 flex justify-between items-center bg-transparent z-40" />
            </motion.div>
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

                {/* </ COMING SOON > Footer */}
                <div className="text-3xl sm:text-5xl md:text-6xl font-display font-[950] tracking-wider text-center mt-8 sm:mt-16 flex items-center justify-center gap-2 select-none">
                  <span className="text-[#ff3131] font-extrabold">&lt;/</span>
                  <span className="text-white font-black drop-shadow-[4px_4px_0px_rgba(255,49,49,0.5)] uppercase">COMING SOON</span>
                  <span className="text-[#ff3131] font-extrabold">&gt;</span>
                </div>

                {/* Sentence description beneath */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-gray-300 text-xs sm:text-sm md:text-base font-bold leading-relaxed mt-4 sm:mt-6 mb-6 sm:mb-8 text-center max-w-sm sm:max-w-lg px-4"
                >
                  Something big is brewing. <span className="text-white font-extrabold drop-shadow-[1px_1px_0px_rgba(255,49,49,0.5)]">BUILDX</span> is evolving into the ultimate developer battleground. 
                  <br className="hidden md:block" /> Stay tuned.
                </motion.p>
                
                {/* Giant Chunky Retro Button */}
                <motion.button 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 1, duration: 0.8 }}
                   onClick={scrollToForm}
                   className="px-12 py-5 bg-[#ff3131] text-white hover:bg-white hover:text-black border-[3px] border-white font-black text-xs sm:text-sm tracking-widest uppercase transition-all rounded-none shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer"
                >
                   Notify Me
                </motion.button>

              </motion.div>
            </div>

            {/* Bottom Form Section */}
            <div 
              ref={formRef}
              className="py-16 w-full flex flex-col items-center px-4"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-md sm:max-w-lg mb-20 z-10"
              >
                {showSuccess ? (
                  <div className="py-12 flex flex-col items-center text-center bg-zinc-800 p-8 rounded-none w-full">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,49,49,0.4)]"
                    >
                      <span className="text-white text-3xl font-black">✓</span>
                    </motion.div>
                    <h3 className="text-2xl font-display font-black text-white mb-2">Successfully Registered!</h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-bold">
                      Check established! We will notify you the moment <span className="text-white underline">BUILDX</span> goes live!
                    </p>
                  </div>
                ) : (
                  <div className="bg-zinc-800 p-8 sm:p-10 rounded-none">
                    <div className="text-xs sm:text-sm tracking-[0.4em] font-black text-white/60 uppercase mb-8 text-center">
                      Early register
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                      <input 
                        required
                        name="userName"
                        type="text" 
                        autoComplete="off"
                        placeholder="YOUR NAME"
                        className="bg-white text-black placeholder-gray-500 border-4 border-black px-6 py-5 text-sm sm:text-base font-bold tracking-widest uppercase focus:outline-none focus:bg-yellow-50 transition-all"
                      />
                      
                      <div className="flex flex-col w-full gap-1.5">
                        <input 
                          required
                          name="userPhone"
                          type="text"
                          inputMode="numeric"
                          onChange={handlePhoneInput}
                          placeholder="MOBILE NUMBER"
                          className={`bg-white text-black placeholder-gray-500 border-4 px-6 py-5 text-sm sm:text-base font-bold tracking-widest uppercase focus:outline-none focus:bg-yellow-50 transition-all ${
                            phoneError ? 'border-red-500' : 'border-black'
                          }`}
                        />
                        {/* Interactive Warning Field */}
                        <AnimatePresence>
                          {phoneError && (
                            <motion.span 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-red-400 text-xs tracking-wider font-bold pl-1"
                            >
                              {phoneError}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      <button 
                        disabled={isSubmitting}
                        className="bg-white text-black border-4 border-black font-black text-xs sm:text-sm tracking-widest uppercase py-5 hover:bg-black hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? "PROCESSING..." : "Notify me"}
                      </button>
                    </form>
                  </div>
                )}
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
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
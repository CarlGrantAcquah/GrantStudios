import React, { useEffect, useState, useRef } from 'react';
import { NAV_LINKS, CONTACT_EMAIL, CONTACT_PHONE, COMPANY_NAME, LOCATION, SOCIAL_LINKS } from './constants';

// Since AOS is loaded via CDN in index.html, we access it via window
const initAOS = () => {
  if (window.AOS) {
    window.AOS.init({
      duration: 800,
      once: false,
      mirror: false,
      offset: 100,
      easing: 'ease-out-cubic',
    });
  }
};

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  // Prevent background scroll when modal is open
  // MOVED useEffect above the conditional return to comply with Rules of Hooks
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Content Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-fade-in-up z-10">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-slate-300 space-y-4 leading-relaxed text-sm md:text-base">
          {children}
        </div>
        <div className="p-4 border-t border-slate-700 bg-slate-900/50 rounded-b-2xl flex justify-end">
             <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium">Close</button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  // Smooth transition for background
  const navClasses = `fixed w-full z-50 transition-all duration-500 ease-in-out ${
    scrolled 
      ? 'bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-white/5 py-0' 
      : 'bg-transparent py-2'
  }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-white tracking-wider flex items-center gap-2" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <span className="text-brand-orange"><i className="fa-solid fa-microchip"></i></span>
              {COMPANY_NAME}
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-gray-300 hover:text-brand-orange transition-colors px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact" 
                className="bg-brand-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
                onClick={(e) => e.preventDefault()} // No contact section explicitly defined in anchor, just a CTA
              >
                Book Strategy Call
              </a>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-gray-800 animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-300 hover:text-brand-orange block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
            <a href="#contact" onClick={(e) => setIsOpen(false)} className="text-white bg-brand-blue block px-3 py-2 rounded-md text-base font-medium mt-4 text-center">
              Book Strategy Call
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-slate-900">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div data-aos="fade-up" className="inline-block mb-4 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 text-brand-orange text-sm font-semibold tracking-wide uppercase">
          Trusted by top independent contractors
        </div>
        <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Stop Losing Emergency <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">
            Jobs to Voicemail.
          </span>
        </h1>
        <p data-aos="fade-up" data-aos-delay="200" className="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
          The 24/7 AI Dispatcher for HVAC & Plumbers. It answers calls, vets emergencies, and books appointments while you’re on the job site.
        </p>
        <div data-aos="fade-up" data-aos-delay="300" className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="#demo" 
            onClick={(e) => handleSmoothScroll(e, 'demo')}
            className="px-8 py-4 bg-gradient-to-r from-brand-orange to-red-600 rounded-lg text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/60 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex h-3 w-3 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="relative">Hear The Demo</span>
          </a>
          <a 
            href="#features" 
            onClick={(e) => handleSmoothScroll(e, 'features')}
            className="px-8 py-4 border border-slate-600 rounded-lg text-white font-semibold text-lg hover:bg-slate-800 hover:border-slate-500 hover:text-brand-orange transition-all flex items-center justify-center"
          >
            Learn More
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-500">
        <i className="fas fa-chevron-down text-2xl"></i>
      </div>
    </section>
  );
};

const Problem = () => {
  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div data-aos="fade-up" className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-phone-slash text-3xl text-red-500"></i>
        </div>
        <h2 data-aos="fade-up" className="text-3xl md:text-5xl font-bold text-white mb-6">
          Your Voicemail is Costing You Money.
        </h2>
        <p data-aos="fade-up" data-aos-delay="100" className="text-xl text-slate-400 leading-relaxed mb-8">
          85% of customers hang up if they hear a voicemail. When you are under a house, {COMPANY_NAME} picks up the phone.
        </p>
        
        <div data-aos="zoom-in" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-3xl font-bold text-red-500 mb-2">85%</div>
                <div className="text-slate-400 text-sm">Hang up rate on voicemail</div>
            </div>
             <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-3xl font-bold text-red-500 mb-2">$5k+</div>
                <div className="text-slate-400 text-sm">Lost monthly revenue</div>
            </div>
             <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-3xl font-bold text-red-500 mb-2">0</div>
                <div className="text-slate-400 text-sm">Jobs missed with AI</div>
            </div>
        </div>
      </div>
    </section>
  );
};

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 45; // Simulated duration in seconds
  
  // Ref to hold the interval ID
  const progressInterval = useRef<number | null>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }

    return () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying]);

  const progressPercent = (currentTime / duration) * 100;

  // Generate bars for waveform with random heights for initial look
  const bars = Array.from({ length: 30 });

  return (
    <div className={`w-full max-w-lg mx-auto bg-slate-800/80 backdrop-blur-xl rounded-2xl border transition-all duration-500 ${isPlaying ? 'border-brand-orange/50 shadow-[0_0_50px_-10px_rgba(249,115,22,0.4)]' : 'border-white/10 shadow-2xl'} p-6 relative overflow-hidden group`}>
      {/* Glowing background effect behind player */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[100px] rounded-full transition-all duration-1000 ${isPlaying ? 'bg-brand-orange/20 opacity-100' : 'bg-brand-blue/10 opacity-50 group-hover:bg-brand-orange/10'}`}></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-white font-bold text-lg">Live Demo: Alex Handling a Leak</h3>
                <p className="text-slate-400 text-xs uppercase tracking-wider mt-1 flex items-center gap-2">
                   <i className="fas fa-phone-alt text-[10px]"></i> Incoming Call: 2:00 AM
                </p>
            </div>
            <div className={`flex space-x-2 items-center px-3 py-1 rounded-full ${isPlaying ? 'bg-red-500/10' : 'bg-slate-700/50'}`}>
                <span className={`block w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
                <span className={`${isPlaying ? 'text-red-500' : 'text-slate-500'} text-xs font-bold uppercase`}>{isPlaying ? 'Live' : 'Ready'}</span>
            </div>
        </div>

        {/* Visual Waveform Simulation using CSS Animations */}
        <div className="flex items-end justify-center space-x-[2px] h-16 mb-8 px-2 overflow-hidden">
            {bars.map((_, i) => (
                <div 
                    key={i} 
                    className={`w-1.5 rounded-t-sm transition-all duration-300 ${isPlaying ? 'bg-brand-orange animate-wave' : 'bg-slate-600'}`}
                    style={{ 
                        height: isPlaying ? '50%' : `${20 + Math.random() * 40}%`,
                        opacity: isPlaying ? 1 : 0.3,
                        animationDelay: `-${Math.random()}s`,
                        animationDuration: `${0.4 + Math.random() * 0.4}s` 
                    }}
                ></div>
            ))}
        </div>

        <div className="flex items-center gap-6">
            <button 
                onClick={togglePlay}
                className={`w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-red-600 text-white transition-all duration-300 relative z-20 ${isPlaying ? 'shadow-[0_0_25px_rgba(249,115,22,0.6)] scale-105' : 'shadow-xl hover:scale-110 hover:shadow-orange-500/30'}`}
            >
                {/* Pulse ring */}
                {!isPlaying && <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-75"></span>}
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-2xl ml-1`}></i>
            </button>
            
            <div className="flex-1">
                <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden cursor-pointer">
                    <div 
                        className="bg-gradient-to-r from-brand-orange to-red-500 h-full rounded-full transition-all duration-500 ease-linear relative"
                        style={{ width: `${progressPercent}%` }}
                    >
                        {/* Scrubber head */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono">
                    <span>00:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
                    <span>00:{duration}</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Invisible dummy audio tag as requested by developer note */}
      <audio className="hidden" controls>
          <source src="#" type="audio/mpeg" />
      </audio>
    </div>
  );
};

const Demo = () => {
  return (
    <section id="demo" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div data-aos="fade-right">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Listen to "Alex" Handle an Emergency Call.
                    </h2>
                    <p className="text-xl text-slate-400 mb-8">
                        The customer says "Furnace Broken." Listen to how Alex secures the $300 diagnostic fee before you even wake up.
                    </p>
                    <ul className="space-y-4 mb-8">
                        {['Immediate Response', 'Polite & Professional', 'Books The Appointment'].map((item, idx) => (
                            <li key={idx} className="flex items-center text-slate-300">
                                <i className="fas fa-check-circle text-brand-blue mr-3"></i>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div data-aos="fade-left">
                    <AudioPlayer />
                </div>
            </div>
        </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-24 relative bg-fixed bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1581094794329-cd279ce84a97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 data-aos="fade-up" className="text-brand-blue font-bold tracking-wide uppercase text-sm mb-2">The Solution</h2>
            <h3 data-aos="fade-up" className="text-3xl md:text-5xl font-bold text-white">Built for the Trades.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div data-aos="fade-up" data-aos-delay="0" className="glass-card p-8 rounded-2xl hover:border-brand-orange/50 transition-colors group">
                <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i className="fas fa-shield-alt text-2xl text-brand-orange"></i>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Emergency Screening</h4>
                <p className="text-slate-400">The AI detects keywords like 'Leak,' 'No Heat,' or 'Burst Pipe' and flags them as priority.</p>
            </div>

            {/* Feature 2 */}
            <div data-aos="fade-up" data-aos-delay="100" className="glass-card p-8 rounded-2xl hover:border-brand-blue/50 transition-colors group">
                <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i className="far fa-calendar-check text-2xl text-brand-blue"></i>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Instant Calendar Booking</h4>
                <p className="text-slate-400">Connects directly to your calendar to book diagnostic slots without double booking you.</p>
            </div>

            {/* Feature 3 */}
            <div data-aos="fade-up" data-aos-delay="200" className="glass-card p-8 rounded-2xl hover:border-green-500/50 transition-colors group">
                <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i className="fas fa-mobile-alt text-2xl text-green-500"></i>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">SMS Follow-Up</h4>
                <p className="text-slate-400">Instantly texts the customer a confirmation and prepares them for your arrival.</p>
            </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
            <div data-aos="flip-up" className="relative p-1 rounded-2xl bg-gradient-to-b from-brand-orange to-brand-blue">
                <div className="bg-slate-900 rounded-xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                        Most Popular
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">The Pro Dispatcher</h3>
                    <div className="flex items-baseline mb-6">
                        <span className="text-5xl font-extrabold text-white">$297</span>
                        <span className="text-xl text-slate-400 ml-2">/mo</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center text-white">
                            <i className="fas fa-check text-green-500 mr-3"></i>
                            <span className="font-bold text-brand-orange">Zero Setup Fee</span>
                        </li>
                        <li className="flex items-center text-slate-300">
                            <i className="fas fa-check text-brand-blue mr-3"></i>
                            500 Minutes of Talk Time
                        </li>
                        <li className="flex items-center text-slate-300">
                            <i className="fas fa-check text-brand-blue mr-3"></i>
                            24/7 Call Answering
                        </li>
                        <li className="flex items-center text-slate-300">
                            <i className="fas fa-check text-brand-blue mr-3"></i>
                            Emergency SMS Alerts
                        </li>
                        <li className="flex items-center text-slate-300">
                            <i className="fas fa-check text-brand-blue mr-3"></i>
                            Weekly Lead Reports
                        </li>
                    </ul>

                    <button className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-blue-500/25 mb-4">
                        Start Free Trial
                    </button>
                    <p className="text-center text-xs text-slate-500">
                        Guarantee: Pays for itself with 1 saved job or your money back.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the AI handle accents or bad connections?",
      answer: "GrantStudios uses advanced natural language processing trained on diverse voice datasets. It performs remarkably well with various accents. If the connection is too poor to understand, it politely asks the caller to repeat or redirects to voicemail/SMS."
    },
    {
      question: "Does it integrate with ServiceTitan or Housecall Pro?",
      answer: "Yes, we integrate with major field service management software including ServiceTitan, Housecall Pro, and Jobber to sync appointments directly to your dispatch board."
    },
    {
      question: "What if the AI makes a mistake?",
      answer: "The system records every call and transcripts are sent immediately to you via SMS/Email. If a booking detail is slightly off, you can catch it instantly. However, our error rate is extremely low for structured tasks like booking."
    },
    {
      question: "Is there a contract?",
      answer: "No, our services are month-to-month. We believe the value we provide will keep you around, not a piece of paper. You can cancel anytime."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 data-aos="fade-up" className="text-brand-blue font-bold tracking-wide uppercase text-sm mb-2">FAQ</h2>
            <h3 data-aos="fade-up" className="text-3xl md:text-5xl font-bold text-white">Common Questions</h3>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              className="border border-slate-800 rounded-lg bg-slate-900/50 overflow-hidden"
            >
              <button 
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-white text-lg group-hover:text-brand-orange transition-colors">{faq.question}</span>
                <span className={`transform transition-transform duration-300 text-brand-orange ${openIndex === index ? 'rotate-180' : ''}`}>
                  <i className="fas fa-chevron-down"></i>
                </span>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 pb-6 text-slate-400">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onOpenPrivacy, onOpenTerms }: { onOpenPrivacy: (e: React.MouseEvent) => void, onOpenTerms: (e: React.MouseEvent) => void }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="col-span-1">
                <div className="text-2xl font-bold text-white tracking-wider flex items-center gap-2 mb-4">
                    <span className="text-brand-orange"><i className="fa-solid fa-microchip"></i></span>
                    {COMPANY_NAME}
                </div>
                <p className="text-slate-400 mb-6">AI Solutions for Tradesmen.</p>
                <div className="flex space-x-4">
                    <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-black transition-all duration-300">
                      <i className="fab fa-x-twitter text-lg"></i>
                    </a>
                    <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0077b5] transition-all duration-300">
                      <i className="fab fa-linkedin-in text-lg"></i>
                    </a>
                </div>
            </div>

            <div className="col-span-1">
                <h4 className="text-white font-bold uppercase tracking-wider mb-4">Contact</h4>
                <ul className="space-y-3 text-slate-400">
                    <li className="flex items-center"><i className="fas fa-envelope mr-3 text-brand-orange"></i> {CONTACT_EMAIL}</li>
                    <li className="flex items-center"><i className="fas fa-phone mr-3 text-brand-orange"></i> {CONTACT_PHONE}</li>
                    <li className="flex items-center"><i className="fas fa-map-marker-alt mr-3 text-brand-orange"></i> {LOCATION}</li>
                </ul>
            </div>

            <div className="col-span-1">
                <h4 className="text-white font-bold uppercase tracking-wider mb-4">Legal</h4>
                <ul className="space-y-3 text-slate-400">
                    <li><a href="#" onClick={onOpenPrivacy} className="hover:text-brand-orange transition-colors">Privacy Policy</a></li>
                    <li><a href="#" onClick={onOpenTerms} className="hover:text-brand-orange transition-colors">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-900 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  useEffect(() => {
    initAOS();
  }, []);

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const openPrivacy = (e: React.MouseEvent) => { e.preventDefault(); setIsPrivacyOpen(true); };
  const openTerms = (e: React.MouseEvent) => { e.preventDefault(); setIsTermsOpen(true); };

  return (
    <div className="antialiased text-slate-200 overflow-x-hidden">
      <Navbar />
      <Hero />
      <Problem />
      <Demo />
      <Features />
      <Pricing />
      <FAQ />
      <Footer onOpenPrivacy={openPrivacy} onOpenTerms={openTerms} />

      {/* Privacy Policy Modal */}
      <Modal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} title="Privacy Policy">
          <h4 className="text-white font-bold mb-2">1. Introduction</h4>
          <p>Welcome to {COMPANY_NAME}. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our services.</p>
          
          <h4 className="text-white font-bold mb-2 mt-4">2. Data We Collect</h4>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website, products and services (including call recordings for quality assurance).</li>
          </ul>

          <h4 className="text-white font-bold mb-2 mt-4">3. How We Use Your Data</h4>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>To facilitate AI dispatching services and appointment bookings.</li>
          </ul>

          <h4 className="text-white font-bold mb-2 mt-4">4. Data Security</h4>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>

          <h4 className="text-white font-bold mb-2 mt-4">5. Contact Details</h4>
          <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: {CONTACT_EMAIL}.</p>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} title="Terms of Service">
           <h4 className="text-white font-bold mb-2">1. Agreement to Terms</h4>
           <p>By accessing or using the services provided by {COMPANY_NAME}, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

           <h4 className="text-white font-bold mb-2 mt-4">2. Service Description</h4>
           <p>{COMPANY_NAME} provides AI-powered call answering, screening, and dispatching services for contractors. We act as an intermediary to facilitate communication between you and your customers.</p>

           <h4 className="text-white font-bold mb-2 mt-4">3. User Responsibilities</h4>
           <p>You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to provide accurate and complete information when registering for the service.</p>

           <h4 className="text-white font-bold mb-2 mt-4">4. AI Limitations</h4>
           <p>While we strive for high accuracy, our services utilize Artificial Intelligence which may occasionally make errors in transcription, intent detection, or booking. {COMPANY_NAME} is not liable for lost revenue, missed appointments, or miscommunications resulting from AI errors.</p>

           <h4 className="text-white font-bold mb-2 mt-4">5. Payment and Subscription</h4>
           <p>Services are billed on a subscription basis. You agree to pay all fees associated with your chosen plan. Prices are subject to change with notice.</p>

           <h4 className="text-white font-bold mb-2 mt-4">6. Termination</h4>
           <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
           
           <h4 className="text-white font-bold mb-2 mt-4">7. Governing Law</h4>
           <p>These Terms shall be governed and construed in accordance with the laws of {LOCATION.split(',')[1] || 'Ghana'} and United States, without regard to its conflict of law provisions.</p>
      </Modal>
    </div>
  );
};

export default App;
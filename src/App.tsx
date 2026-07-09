import { useEffect, useRef, useState, ReactNode, FormEvent } from "react";
import { 
  Phone, 
  Calendar, 
  MessageSquare, 
  Bell, 
  Clock, 
  Scissors, 
  Briefcase, 
  Home, 
  Wrench, 
  Utensils, 
  Dumbbell, 
  Car, 
  Stethoscope, 
  Shield, 
  Server, 
  Lock, 
  FileText, 
  Menu, 
  X, 
  Check, 
  ArrowRight, 
  ChevronDown, 
  Sparkles,
  Zap,
  Users,
  Award
} from "lucide-react";

// ==========================================
// SCROLL REVEAL COMPONENT
// ==========================================
function ScrollReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string; key?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-on-scroll ${isVisible ? "active" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ==========================================
// COUNT-UP STAT COUNTER COMPONENT
// ==========================================
function Counter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const duration = 1500; // 1.5s
          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
              const progress = elapsedTime / duration;
              // Ease out quad
              const easeProgress = progress * (2 - progress);
              setCurrent(Math.floor(easeProgress * end));
              requestAnimationFrame(updateCounter);
            } else {
              setCurrent(end);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [value, hasAnimated]);

  return (
    <span ref={ref} className="font-serif text-5xl md:text-6xl text-ink font-bold tracking-tight">
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

// ==========================================
// TWEENED ROI VALUE COMPONENT
// ==========================================
function TweenedValue({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    if (startValue === endValue) return;

    const duration = 300; // Fast 300ms glide
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = startValue + (endValue - startValue) * ease;
      
      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatted = Math.round(displayValue).toLocaleString("en-GB");

  return (
    <span className="font-serif">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ==========================================
// CORE APPLICATION
// ==========================================
export default function App() {
  // Navigation State
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero headline words sequence
  const [headlineMounted, setHeadlineMounted] = useState(false);

  // How It Works drawing line state
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // ROI Calculator inputs
  const [dailyCalls, setDailyCalls] = useState(40);
  const [missedRate, setMissedRate] = useState(25);
  const [bookingValue, setBookingValue] = useState(120);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState("");
  const [modalFormSubmitted, setModalFormSubmitted] = useState(false);
  const [modalFormData, setModalFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: ""
  });

  // Free Pilot Form States
  const [pilotSubmitted, setPilotSubmitted] = useState(false);
  const [pilotFormStep, setPilotFormStep] = useState(1);
  const [pilotFormData, setPilotFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
    industry: "",
    city: ""
  });
  const [step1Errors, setStep1Errors] = useState({ firstName: false, lastName: false, email: false });

  // FAQ states (open item ID)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculate ROI outputs
  const missedPerDay = dailyCalls * (missedRate / 100);
  const dailyRisk = missedPerDay * bookingValue;
  const monthlyRisk = dailyRisk * 22;
  const recoveredMonthly = monthlyRisk * 0.80;

  // Track scroll position for navigation transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trigger headline animation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeadlineMounted(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // How It Works SVG line draw reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHowItWorksVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    const currentRef = howItWorksRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Handle open modal with selected plan
  const openPlanModal = (planName: string) => {
    setModalPlan(planName);
    setModalOpen(true);
    setModalFormSubmitted(false);
    setModalFormData({
      fullName: "",
      businessName: "",
      email: "",
      phone: ""
    });
  };

  const handleModalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (modalFormData.fullName && modalFormData.businessName && modalFormData.email && modalFormData.phone) {
      fetch("https://formspree.io/f/mkolzzza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: "New Lead - Systemize Labs",
          plan: modalPlan,
          fullName: modalFormData.fullName,
          businessName: modalFormData.businessName,
          email: modalFormData.email,
          phone: modalFormData.phone
        })
      }).catch((err) => console.error("Formspree error:", err));

      setModalFormSubmitted(true);
    }
  };

  const handlePilotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      pilotFormData.firstName && 
      pilotFormData.lastName && 
      pilotFormData.email && 
      pilotFormData.businessName && 
      pilotFormData.industry && 
      pilotFormData.city
    ) {
      const fullName = `${pilotFormData.firstName} ${pilotFormData.lastName}`.trim();
      fetch("https://formspree.io/f/mkolzzza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: "New Lead - Systemize Labs",
          firstName: pilotFormData.firstName,
          lastName: pilotFormData.lastName,
          yourName: fullName,
          fullName: fullName,
          email: pilotFormData.email,
          businessName: pilotFormData.businessName,
          industry: pilotFormData.industry,
          city: pilotFormData.city
        })
      }).catch((err) => console.error("Formspree error:", err));

      setPilotSubmitted(true);
    }
  };

  // Headline parts for word-by-word staggered delay animation
  const headlineSegments = [
    { text: "Never", highlight: false },
    { text: "Miss", highlight: false },
    { text: "Another", highlight: false },
    { text: "Call.", highlight: false },
    { text: "Never", highlight: false },
    { text: "Miss", highlight: false },
    { text: "Another", highlight: false },
    { text: "Customer.", highlight: true }
  ];

  const faqData = [
    {
      q: "How long does setup take?",
      a: "Our team configures and trains your AI assistant based on your exact FAQs, services, booking rules, and systems. The complete process takes less than 48 hours, and we set everything up for you. You don't have to touch a line of code."
    },
    {
      q: "Is my customer data secure and compliant?",
      a: "Absolutely. We are fully GDPR and UK Data Protection Act compliant. Every call transcript, audio capture, and booking reservation is strongly encrypted in transit and at rest. We minimize personal data storage and strictly adhere to data protection regulations."
    },
    {
      q: "Can the AI handle complex or urgent calls?",
      a: "Yes! While our AI handles about 90% of routine questions, appointment bookings, and inquiries, it is programmed with specific custom transfer rules. If a caller has an emergency or a complex query, the AI will immediately transfer the call or push an instant emergency text alert directly to your personal device."
    },
    {
      q: "Can I customize what the AI says for my specific business?",
      a: "Absolutely. Your AI receptionist is a bespoke agent designed to represent your brand. We construct custom scenarios detailing your operating hours, services, prices, cancellation policies, staff details, and FAQs. It will speak, assist, and book exactly like a fully trained internal staff member."
    },
    {
      q: "What happens if I want to cancel?",
      a: "All of our monthly subscription plans are fully flexible with no long-term contracts or tie-ins. You can upgrade, downgrade, or cancel your monthly service at any time directly through email or WhatsApp with no penalties or hidden fees."
    }
  ];

  return (
    <div className="font-sans text-ink bg-cloud min-h-screen selection:bg-signature-teal selection:text-obsidian antialiased overflow-x-hidden">
      
      {/* ==========================================
          1. NAVIGATION BAR
          ========================================== */}
      <nav 
        id="navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-4 px-6 md:px-12 ${
          isScrolled 
            ? "bg-[#0D1224]/85 backdrop-blur-md shadow-lg shadow-black/25 border-b border-white/10" 
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
         {/* Logo */}
<a href="#hero" className="flex items-center gap-2 group">
  <img src="/logo.svg" alt="Systemize Labs" className="w-10 h-10 object-contain" />
  <span className="font-serif text-2xl font-bold tracking-tight text-white">
    Systemize<span className="text-signature-teal">Labs</span>
  </span>
</a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className="text-sm font-medium transition-colors text-gray-300 hover:text-signature-teal"
            >
              Features
            </a>
            <a 
              href="#industries" 
              className="text-sm font-medium transition-colors text-gray-300 hover:text-signature-teal"
            >
              Industries
            </a>
            <a 
              href="#pricing" 
              className="text-sm font-medium transition-colors text-gray-300 hover:text-signature-teal"
            >
              Pricing
            </a>
            <a 
              href="#calculator" 
              className="text-sm font-medium transition-colors text-gray-300 hover:text-signature-teal"
            >
              Calculator
            </a>
            <a 
              href="#faq" 
              className="text-sm font-medium transition-colors text-gray-300 hover:text-signature-teal"
            >
              FAQ
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => openPlanModal("Free Demo")}
              className="bg-signature-teal hover:bg-signature-teal/90 text-obsidian font-semibold text-sm px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.03] shadow-md shadow-signature-teal/10 hover:shadow-lg hover:shadow-signature-teal/20"
            >
              Book Free Demo
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="text-white" size={24} />
            ) : (
              <Menu className="text-white" size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <div 
          className={`absolute top-full left-0 w-full bg-obsidian border-b border-gray-800 transition-all duration-300 overflow-hidden md:hidden ${
            mobileMenuOpen ? "max-h-[380px] opacity-100 py-6" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-5 px-6">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-signature-teal font-medium transition-colors text-base"
            >
              Features
            </a>
            <a 
              href="#industries" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-signature-teal font-medium transition-colors text-base"
            >
              Industries
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-signature-teal font-medium transition-colors text-base"
            >
              Pricing
            </a>
            <a 
              href="#calculator" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-signature-teal font-medium transition-colors text-base"
            >
              Calculator
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-signature-teal font-medium transition-colors text-base"
            >
              FAQ
            </a>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                openPlanModal("Free Demo");
              }}
              className="w-full bg-signature-teal text-obsidian font-semibold text-center py-3 rounded-lg hover:bg-signature-teal/90 transition-all"
            >
              Book Free Demo
            </button>
          </div>
        </div>
      </nav>

      {/* ==========================================
          2. HERO SECTION — THE SIGNATURE VISUAL
          ========================================== */}
      <section 
        id="hero"
        className="relative bg-obsidian text-white pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden px-6 md:px-12"
      >
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(0,217,192,0.12)_0%,transparent_70%)] pointer-events-none z-0"></div>
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(0,217,192,0.06)_0%,transparent_70%)] pointer-events-none z-0"></div>

        {/* Ambient Drifting Floating Particles */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
          <div className="absolute top-[10%] left-[20%] w-1.5 h-1.5 bg-signature-teal rounded-full blur-[1px] animate-[pulse_3s_infinite_ease-in-out]"></div>
          <div className="absolute top-[40%] left-[15%] w-2 h-2 bg-signature-teal rounded-full blur-[2px] animate-[pulse_4s_infinite_ease-in-out_1s]"></div>
          <div className="absolute top-[80%] left-[45%] w-1.5 h-1.5 bg-signature-teal rounded-full blur-[1px] animate-[pulse_5s_infinite_ease-in-out_2s]"></div>
          <div className="absolute top-[20%] left-[80%] w-2 h-2 bg-signature-teal rounded-full blur-[2px] animate-[pulse_4s_infinite_ease-in-out_1.5s]"></div>
          <div className="absolute top-[65%] left-[85%] w-1.5 h-1.5 bg-signature-teal rounded-full blur-[1px] animate-[pulse_3s_infinite_ease-in-out_0.5s]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 relative bg-[#11142B] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col items-start text-left order-2 lg:order-1 backdrop-blur-sm">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D9C0]/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
            
            <div className="relative z-10 w-full flex flex-col items-start">
              {/* Pill Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-signature-teal/10 border border-signature-teal/30 mb-6 animate-fade-in">
                <Sparkles size={14} className="text-signature-teal animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-signature-teal">
                  AI Voice Receptionist for Modern Businesses
                </span>
              </div>

              {/* Word-by-word staggered headline */}
              <h1 className="font-serif text-4xl sm:text-5xl md:text-[56px] leading-[1.1] mb-6 font-bold text-white tracking-tight">
                {headlineSegments.map((segment, idx) => (
                  <span
                    key={idx}
                    style={{ 
                      transitionDelay: `${idx * 80}ms`,
                      display: "inline-block"
                    }}
                    className={`mr-2.5 transition-all duration-700 ease-out transform ${
                      headlineMounted 
                        ? "translate-y-0 opacity-100" 
                        : "translate-y-6 opacity-0"
                    } ${
                      segment.highlight 
                        ? "text-signature-teal drop-shadow-[0_0_15px_rgba(0,217,192,0.3)]" 
                        : ""
                    }`}
                  >
                    {segment.text}
                  </span>
                ))}
              </h1>

              {/* Subheadline */}
              <p 
                style={{ transitionDelay: "750ms" }}
                className={`text-lg md:text-xl text-gray-300 leading-relaxed mb-8 transition-all duration-700 transform ${
                  headlineMounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                Our AI Receptionist answers 100% of overflow and after-hours calls instantly, books appointments in real time, and sends confirmations and reminders automatically — for any business that runs on calls and bookings. 24/7.
              </p>

              {/* CTA Buttons */}
              <div 
                style={{ transitionDelay: "950ms" }}
                className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10 transition-all duration-700 transform ${
                  headlineMounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <button 
                  onClick={() => openPlanModal("Free Demo")}
                  className="bg-signature-teal hover:bg-signature-teal/90 text-obsidian font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] text-center shadow-lg shadow-signature-teal/20"
                >
                  Request Free Demo
                </button>
                <a 
                  href="#features"
                  className="border border-white/20 hover:border-white/80 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-center hover:bg-white/5"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust Badges */}
              <div 
                style={{ transitionDelay: "1100ms" }}
                className={`grid grid-cols-2 md:flex md:items-center gap-y-3 gap-x-6 text-sm text-gray-400 transition-all duration-700 transform ${
                  headlineMounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <span className="flex items-center gap-1.5"><Check size={16} className="text-signature-teal" /> GDPR Compliant</span>
                <span className="flex items-center gap-1.5"><Check size={16} className="text-signature-teal" /> 24/7 Coverage</span>
                <span className="flex items-center gap-1.5"><Check size={16} className="text-signature-teal" /> Live in 48 Hours</span>
                <span className="flex items-center gap-1.5"><Check size={16} className="text-signature-teal" /> Works for Any Industry</span>
              </div>
            </div>
          </div>

          {/* Right Floating Robot Graphic Column */}
          <div className="lg:col-span-5 bg-[#0D1224] border border-[#00D9C0]/20 rounded-3xl flex justify-center items-center relative h-[420px] sm:h-[480px] lg:h-[500px] w-full order-1 lg:order-2 overflow-hidden shadow-2xl">
            
            {/* Pulse Pool Glow behind Robot */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,192,0.18)_0%,transparent_70%)] animate-pulse pointer-events-none z-0"></div>

            {/* SVG Connecting Paths to Orbiting Nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 500 500">
              {/* Connector 1: Top Left */}
              <path d="M250,250 Q160,180 80,110" fill="none" stroke="#00D9C0" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" opacity="0.4" />
              {/* Connector 2: Top Right */}
              <path d="M250,250 Q340,180 420,110" fill="none" stroke="#00D9C0" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" opacity="0.4" style={{ animationDirection: "reverse" }} />
              {/* Connector 3: Bottom Left */}
              <path d="M250,250 Q160,320 70,390" fill="none" stroke="#00D9C0" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" opacity="0.4" />
              {/* Connector 4: Bottom Right */}
              <path d="M250,250 Q340,320 430,390" fill="none" stroke="#00D9C0" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" opacity="0.4" style={{ animationDirection: "reverse" }} />
            </svg>

            {/* Orbiting Node 1: Top Left */}
            <div 
              style={{ animation: "float 6s ease-in-out infinite" }}
              className="absolute left-[15px] sm:left-[30px] top-[40px] z-20 flex items-center gap-2.5 bg-[#141C38] border border-signature-teal/20 px-3.5 py-2 rounded-xl shadow-lg shadow-black/40 backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-signature-teal/15 flex items-center justify-center text-signature-teal">
                <Phone size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-signature-teal uppercase tracking-wider">FEATURE</p>
                <p className="text-xs sm:text-sm font-semibold text-white">24/7 Call Answering</p>
              </div>
            </div>

            {/* Orbiting Node 2: Top Right */}
            <div 
              style={{ animation: "float 7s ease-in-out infinite 0.7s" }}
              className="absolute right-[15px] sm:right-[30px] top-[45px] z-20 flex items-center gap-2.5 bg-[#141C38] border border-signature-teal/20 px-3.5 py-2 rounded-xl shadow-lg shadow-black/40 backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-signature-teal/15 flex items-center justify-center text-signature-teal">
                <Calendar size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-signature-teal uppercase tracking-wider">AUTOMATION</p>
                <p className="text-xs sm:text-sm font-semibold text-white">Real-Time Booking</p>
              </div>
            </div>

            {/* Orbiting Node 3: Bottom Left */}
            <div 
              style={{ animation: "float 5.5s ease-in-out infinite 1.4s" }}
              className="absolute left-[5px] sm:left-[15px] bottom-[50px] z-20 flex items-center gap-2.5 bg-[#141C38] border border-signature-teal/20 px-3.5 py-2 rounded-xl shadow-lg shadow-black/40 backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-signature-teal/15 flex items-center justify-center text-signature-teal">
                <MessageSquare size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-signature-teal uppercase tracking-wider">MESSAGING</p>
                <p className="text-xs sm:text-sm font-semibold text-white">Instant Confirmation</p>
              </div>
            </div>

            {/* Orbiting Node 4: Bottom Right */}
            <div 
              style={{ animation: "float 6.5s ease-in-out infinite 2.1s" }}
              className="absolute right-[5px] sm:right-[15px] bottom-[55px] z-20 flex items-center gap-2.5 bg-[#141C38] border border-signature-teal/20 px-3.5 py-2 rounded-xl shadow-lg shadow-black/40 backdrop-blur-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-signature-teal/15 flex items-center justify-center text-signature-teal">
                <Bell size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-signature-teal uppercase tracking-wider">RETENTION</p>
                <p className="text-xs sm:text-sm font-semibold text-white">Automated Reminders</p>
              </div>
            </div>

            {/* Floating Sleek AI Robot Vector Illustration */}
            <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] z-10 animate-float">
              
              {/* Outer soft glowing shield ring */}
              <div className="absolute inset-0 rounded-full border border-signature-teal/20 bg-signature-teal/5 scale-110 pointer-events-none animate-pulse"></div>

              {/* Vector Robot SVG */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_35px_rgba(0,217,192,0.35)]">
                {/* Propulsion glow base */}
                <ellipse cx="100" cy="175" rx="30" ry="8" fill="url(#propulsionGlow)" opacity="0.8">
                  <animate attributeName="ry" values="6;10;6" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
                </ellipse>

                {/* Left hover hand */}
                <g className="animate-float" style={{ animationDuration: "3.5s" }}>
                  <path d="M45,115 Q30,120 40,130 Q45,125 45,115" fill="#00D9C0" opacity="0.9" />
                  <ellipse cx="40" cy="122" rx="4" ry="4" fill="#00D9C0" />
                </g>

                {/* Right hover hand */}
                <g className="animate-float" style={{ animationDuration: "3.8s", animationDelay: "0.5s" }}>
                  <path d="M155,115 Q170,120 160,130 Q155,125 155,115" fill="#00D9C0" opacity="0.9" />
                  <ellipse cx="160" cy="122" rx="4" ry="4" fill="#00D9C0" />
                </g>

                {/* Robot body torso */}
                <path d="M65,110 L135,110 L125,155 L75,155 Z" fill="#141C38" stroke="#00D9C0" strokeWidth="2.5" strokeLinejoin="round" />
                
                {/* Torso accent glow indicator */}
                <rect x="85" y="122" width="30" height="8" rx="4" fill="#00D9C0" opacity="0.3" />
                <circle cx="100" cy="126" r="3" fill="#00D9C0" className="animate-ping" />
                <circle cx="100" cy="126" r="3" fill="#00D9C0" />

                {/* Cyber neck connection */}
                <rect x="90" y="95" width="20" height="20" rx="3" fill="#00D9C0" opacity="0.7" />

                {/* Head unit helmet */}
                <rect x="55" y="45" width="90" height="60" rx="30" fill="#141C38" stroke="#00D9C0" strokeWidth="3" />

                {/* Audio acoustic wave ears */}
                <circle cx="50" cy="75" r="8" fill="#141C38" stroke="#00D9C0" strokeWidth="1.5" />
                <circle cx="50" cy="75" r="4" fill="#00D9C0" />
                <circle cx="150" cy="75" r="8" fill="#141C38" stroke="#00D9C0" strokeWidth="1.5" />
                <circle cx="150" cy="75" r="4" fill="#00D9C0" />

                {/* Cyber glass visor faceplate */}
                <path d="M68,60 L132,60 C138,60 138,88 132,88 L68,88 C62,88 62,60 68,60 Z" fill="#0A0E20" stroke="#00D9C0" strokeWidth="1.5" />

                {/* Blinking glowing circular cybereyes */}
                <g>
                  <circle cx="85" cy="74" r="6" fill="#00D9C0" className="animate-pulse">
                    <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="85" cy="74" r="2" fill="#FFFFFF" />
                  
                  <circle cx="115" cy="74" r="6" fill="#00D9C0" className="animate-pulse">
                    <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="115" cy="74" r="2" fill="#FFFFFF" />
                </g>

                {/* Visor shine flare reflection */}
                <path d="M72,64 L100,64" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

                {/* Gradient declarations */}
                <defs>
                  <radialGradient id="propulsionGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00D9C0" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00D9C0" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. TRUST BAR
          ========================================== */}
      <section 
        id="trust-bar"
        className="bg-cloud py-12 px-6 md:px-12 border-y border-gray-200/60"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-slate">
            Built For Businesses Like Yours
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 md:gap-16 w-full max-w-5xl">
            {/* Trust chips */}
            {[
              { label: "Dental & Medical", val: "Dental" },
              { label: "Salons & Spas", val: "Aesthetics" },
              { label: "Legal Services", val: "Legal" },
              { label: "Home Services", val: "Plumbing" },
              { label: "Fitness & Wellness", val: "Wellness" }
            ].map((chip, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:border-signature-teal hover:shadow-md">
                  <div className="w-2 h-2 rounded-full bg-signature-teal"></div>
                  <span className="font-serif text-sm font-semibold text-ink">{chip.label}</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-slate px-1.5 py-0.5 rounded bg-gray-100">{chip.val}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. PROBLEM SECTION — "The Hidden Revenue Leak"
          ========================================== */}
      <section 
        id="problem"
        className="py-20 md:py-28 px-6 md:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Section Headers */}
          <div className="text-center max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-slate block mb-3">THE HIDDEN REVENUE LEAK</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ink mb-6">
              Every Business Loses Money to Missed Calls
            </h2>
            <div className="w-16 h-1 bg-signature-teal mx-auto rounded-full"></div>
          </div>

          {/* 3 Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
            
            {/* Card 1 */}
            <ScrollReveal delay={0} className="bg-cloud border border-gray-200 p-8 rounded-2xl text-center shadow-sm relative overflow-hidden group hover:border-red-200 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
              <div className="mb-4">
                <Counter value={27} suffix="%" />
              </div>
              <p className="text-sm font-bold text-ink mb-2 uppercase tracking-wide">Inbound Calls Missed</p>
              <p className="text-sm text-muted-slate leading-relaxed">
                Of inbound calls go completely unanswered during busy hours across appointment-based businesses.
              </p>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal delay={100} className="bg-cloud border border-gray-200 p-8 rounded-2xl text-center shadow-sm relative overflow-hidden group hover:border-warm-amber/40 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-warm-amber"></div>
              <div className="mb-4 text-warm-amber">
                <Counter value={120} prefix="$" suffix="+" />
              </div>
              <p className="text-sm font-bold text-warm-amber mb-2 uppercase tracking-wide">Average Inquiry Value</p>
              <p className="text-sm text-muted-slate leading-relaxed">
                The standard value of a missed booking or new customer inquiry. A massive leak of potential revenue.
              </p>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal delay={200} className="bg-cloud border border-gray-200 p-8 rounded-2xl text-center shadow-sm relative overflow-hidden group hover:border-red-200 transition-colors">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
              <div className="mb-4">
                <Counter value={23} suffix="%" />
              </div>
              <p className="text-sm font-bold text-ink mb-2 uppercase tracking-wide">Never Call Back</p>
              <p className="text-sm text-muted-slate leading-relaxed">
                Of missed callers never call back or attempt to leave a voicemail. They simply call your nearest competitor.
              </p>
            </ScrollReveal>

          </div>

          {/* Problem Bottom Callout */}
          <div className="max-w-3xl text-center bg-gray-50 border border-gray-200/80 p-6 rounded-xl">
            <p className="text-base text-ink font-medium leading-relaxed">
              "A busy front desk, a client meeting, or a job on-site means calls go unanswered — and every unanswered call is a customer who may never call you again."
            </p>
          </div>

        </div>
      </section>

      {/* ==========================================
          5. SOLUTION SECTION — "Meet Your AI Receptionist"
          ========================================== */}
      <section 
        id="features"
        className="py-20 md:py-28 px-6 md:px-12 bg-cloud border-t border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Section Headers */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-signature-teal block mb-3">MEET YOUR AI RECEPTIONIST</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ink mb-6">
              Your Front Desk. Never Sleeps.
            </h2>
            <div className="w-16 h-1 bg-signature-teal mx-auto rounded-full mb-4"></div>
            <p className="text-muted-slate text-base md:text-lg">
              Never choose between serving your in-person client and answering the phone. Let our smart AI handle the line flawlessly.
            </p>
          </div>

          {/* 2x2 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Card 1 */}
            <ScrollReveal delay={0}>
              <div className="bg-white border border-gray-200/80 p-8 rounded-2xl h-full shadow-sm hover:translate-y-[-4px] hover:shadow-lg hover:border-signature-teal/30 hover:shadow-signature-teal/5 transition-all duration-300 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-signature-teal/10 flex items-center justify-center text-signature-teal shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink mb-3">Answers Every Call</h3>
                  <p className="text-muted-slate text-sm leading-relaxed">
                    Picks up 100% of overflow and after-hours calls instantly. Zero waiting on hold, no annoying automated menus. Just smooth, fast service.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal delay={100}>
              <div className="bg-white border border-gray-200/80 p-8 rounded-2xl h-full shadow-sm hover:translate-y-[-4px] hover:shadow-lg hover:border-signature-teal/30 hover:shadow-signature-teal/5 transition-all duration-300 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-signature-teal/10 flex items-center justify-center text-signature-teal shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink mb-3">Books Appointments Directly</h3>
                  <p className="text-muted-slate text-sm leading-relaxed">
                    Integrates directly with your current calendar software or booking platform. Writes client sessions in real time, validating slot availability instantly.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal delay={200}>
              <div className="bg-white border border-gray-200/80 p-8 rounded-2xl h-full shadow-sm hover:translate-y-[-4px] hover:shadow-lg hover:border-signature-teal/30 hover:shadow-signature-teal/5 transition-all duration-300 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-signature-teal/10 flex items-center justify-center text-signature-teal shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink mb-3">Works 24 Hours a Day</h3>
                  <p className="text-muted-slate text-sm leading-relaxed">
                    Handles calls at 2am, on holiday weekends, and during your most hectic peak hours. Scalable performance without staff overhead or scheduling struggles.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal delay={300}>
              <div className="bg-white border border-gray-200/80 p-8 rounded-2xl h-full shadow-sm hover:translate-y-[-4px] hover:shadow-lg hover:border-signature-teal/30 hover:shadow-signature-teal/5 transition-all duration-300 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-signature-teal/10 flex items-center justify-center text-signature-teal shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink mb-3">Sounds Like Your Business</h3>
                  <p className="text-muted-slate text-sm leading-relaxed">
                    Fully trained on your custom services, pricing, business details, and conversational style. Sounds natural, helpful, and friendly every single time.
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* ==========================================
          6. INDUSTRIES WE SERVE
          ========================================== */}
      <section 
        id="industries"
        className="py-20 md:py-28 px-6 md:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Section Headers */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-slate block mb-3">INDUSTRIES WE SERVE</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ink mb-6">
              Built for Any Business That Runs on Calls and Bookings
            </h2>
            <div className="w-16 h-1 bg-signature-teal mx-auto rounded-full mb-4"></div>
            <p className="text-muted-slate text-base md:text-lg">
              Originally built for healthcare clinics, now custom-adapted to serve appointment-based businesses across every market.
            </p>
          </div>

          {/* 8 Industry Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {[
              { title: "Medical & Dental Clinics", icon: <Stethoscope size={20} /> },
              { title: "Salons, Spas & Aesthetics", icon: <Scissors size={20} /> },
              { title: "Law Firms & Consultancies", icon: <Briefcase size={20} /> },
              { title: "Real Estate Agencies", icon: <Home size={20} /> },
              { title: "Home Services (Plumbers/Elect.)", icon: <Wrench size={20} /> },
              { title: "Restaurants & Hospitality", icon: <Utensils size={20} /> },
              { title: "Fitness & Wellness Studios", icon: <Dumbbell size={20} /> },
              { title: "Auto Repair & Service Shops", icon: <Car size={20} /> }
            ].map((ind, idx) => (
              <ScrollReveal key={idx} delay={idx * 60}>
                <div className="bg-cloud border border-gray-200/80 p-6 rounded-xl flex items-center gap-4 hover:translate-y-[-4px] hover:shadow-md hover:border-signature-teal/30 hover:bg-white transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-signature-teal/10 text-signature-teal flex items-center justify-center shrink-0">
                    {ind.icon}
                  </div>
                  <span className="font-serif font-bold text-ink text-sm sm:text-base">{ind.title}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom callout */}
          <div className="text-center">
            <p className="text-sm font-medium text-muted-slate">
              Don't see your industry? <span className="text-ink font-semibold">If your business takes calls and books appointments, we can build it for you.</span>
            </p>
          </div>

        </div>
      </section>

      {/* ==========================================
          7. HOW IT WORKS — "Live in 48 Hours"
          ========================================== */}
      <section 
        id="how-it-works"
        ref={howItWorksRef}
        className="py-20 md:py-28 px-6 md:px-12 bg-cloud border-t border-gray-200/50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Section Headers */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-signature-teal block mb-3">SIMPLE SETUP</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ink mb-6">
              Live in 48 Hours
            </h2>
            <div className="w-16 h-1 bg-signature-teal mx-auto rounded-full mb-4"></div>
            <p className="text-muted-slate text-base md:text-lg">
              Getting started is incredibly easy. We handle the heavy lifting, leaving you to focus on your clients.
            </p>
          </div>

          {/* Steps Row with interactive SVG background connector line */}
          <div className="relative max-w-5xl mx-auto">
            
            {/* Desktop SVG Connector Line */}
            <div className="hidden lg:block absolute top-[45px] left-[15%] right-[15%] h-[2px] z-0 pointer-events-none">
              <svg className="w-full h-10 overflow-visible" fill="none">
                <path 
                  d="M0,5 Q150,-15 300,5 T600,5" 
                  stroke="#E4E7F1" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <path 
                  d="M0,5 Q150,-15 300,5 T600,5" 
                  stroke="#00D9C0" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeDasharray="600"
                  strokeDashoffset={howItWorksVisible ? 0 : 600}
                  style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)" }}
                />
              </svg>
            </div>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
              
              {/* Step 1 */}
              <ScrollReveal delay={0} className="text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-signature-teal text-signature-teal font-serif text-2xl font-bold flex items-center justify-center shadow-md mb-6 relative">
                  1
                  <div className="absolute inset-0 rounded-full bg-signature-teal/5 animate-ping"></div>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-3">We Configure Your AI</h3>
                <p className="text-muted-slate text-sm leading-relaxed max-w-xs">
                  We train your AI Receptionist on your business name, operating hours, prices, FAQs, and custom booking rules. Done in 48 hours.
                </p>
              </ScrollReveal>

              {/* Step 2 */}
              <ScrollReveal delay={150} className="text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-signature-teal text-signature-teal font-serif text-2xl font-bold flex items-center justify-center shadow-md mb-6">
                  2
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-3">Calls Forward Automatically</h3>
                <p className="text-muted-slate text-sm leading-relaxed max-w-xs">
                  When you're busy or closed, calls forward seamlessly to your custom AI number. Your regular business phone number never changes.
                </p>
              </ScrollReveal>

              {/* Step 3 */}
              <ScrollReveal delay={300} className="text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-signature-teal text-signature-teal font-serif text-2xl font-bold flex items-center justify-center shadow-md mb-6">
                  3
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-3">Your Calendar Fills Itself</h3>
                <p className="text-muted-slate text-sm leading-relaxed max-w-xs">
                  The AI books clients in real-time, confirming details via WhatsApp or email. Every slot pops up directly inside your dashboard.
                </p>
              </ScrollReveal>

            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          8. INTEGRATIONS SECTION
          ========================================== */}
      <section 
        id="integrations"
        className="py-16 md:py-20 px-6 md:px-12 bg-white border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          
          <ScrollReveal>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-slate block mb-3">COMPATIBILITY</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-8">
              Works With Your Existing Systems
            </h2>
          </ScrollReveal>

          {/* Integration Badge Grid */}
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mb-8">
            {[
              "Google Calendar", "Calendly", "HubSpot", "Salesforce", "Dentally", "Cliniko", 
              "Mindbody", "Fresha", "Acuity Scheduling", "Shopify", "ActiveCampaign", "Zapier"
            ].map((sys, idx) => (
              <ScrollReveal key={idx} delay={idx * 40}>
                <span className="px-4.5 py-2.5 rounded-xl bg-cloud border border-gray-200 text-sm font-semibold text-ink hover:border-signature-teal/40 hover:bg-white transition-colors duration-200 cursor-default">
                  {sys}
                </span>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <p className="text-xs text-muted-slate max-w-md leading-relaxed">
              Don't see your system? <span className="text-ink font-semibold">We integrate with any calendar, CRM, or booking platform via API.</span> Contact us.
            </p>
          </ScrollReveal>

        </div>
      </section>

      {/* ==========================================
          9. ROI CALCULATOR — Interactive
          ========================================== */}
      <section 
        id="calculator"
        className="py-20 md:py-28 px-6 md:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Section Headers */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-signature-teal block mb-3">ROI CALCULATOR</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ink mb-6">
              Calculate Your Revenue at Risk
            </h2>
            <div className="w-16 h-1 bg-signature-teal mx-auto rounded-full mb-4"></div>
            <p className="text-muted-slate text-base md:text-lg">
              Adjust the sliders below to see how many bookings are slipping through the cracks and how much revenue we can recover for your business.
            </p>
          </div>

          {/* Calculator main container */}
          <div className="max-w-5xl mx-auto bg-[#EAFBF8]/60 border border-signature-teal/20 p-8 md:p-12 rounded-3xl shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Sliders Left Column */}
            <div className="lg:col-span-6 flex flex-col gap-8">
              
              {/* Slider 1 */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-ink">Daily Inbound Calls</span>
                  <span className="font-serif font-bold text-lg text-signature-teal bg-white border border-signature-teal/20 px-3 py-1 rounded-lg">
                    {dailyCalls} calls
                  </span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={dailyCalls}
                  onChange={(e) => setDailyCalls(Number(e.target.value))}
                  className="w-full accent-signature-teal h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-slate">
                  <span>10 calls</span>
                  <span>100 calls</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-ink">Missed Call Rate (%)</span>
                  <span className="font-serif font-bold text-lg text-signature-teal bg-white border border-signature-teal/20 px-3 py-1 rounded-lg">
                    {missedRate}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  value={missedRate}
                  onChange={(e) => setMissedRate(Number(e.target.value))}
                  className="w-full accent-signature-teal h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-slate">
                  <span>5% missed</span>
                  <span>40% missed</span>
                </div>
              </div>

              {/* Slider 3 */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-ink">Average Customer/Booking Value ($)</span>
                  <span className="font-serif font-bold text-lg text-signature-teal bg-white border border-signature-teal/20 px-3 py-1 rounded-lg">
                    ${bookingValue}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="400" 
                  value={bookingValue}
                  onChange={(e) => setBookingValue(Number(e.target.value))}
                  className="w-full accent-signature-teal h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-slate">
                  <span>$50</span>
                  <span>$400</span>
                </div>
              </div>

            </div>

            {/* Calculations Output Right Column */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              
              {/* Output 1 */}
              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Calls Missed / Day</span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-red-600">
                  <TweenedValue value={missedPerDay} />
                </p>
              </div>

              {/* Output 2 */}
              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Daily Revenue Leak</span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-red-600">
                  <TweenedValue value={dailyRisk} prefix="$" />
                </p>
              </div>

              {/* Output 3 */}
              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex flex-col justify-between shadow-sm col-span-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Monthly Revenue Leak</span>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-red-600">
                  <TweenedValue value={monthlyRisk} prefix="$" />
                </p>
              </div>

              {/* Output 4 - HIGHLIGHTED RECOVERED REVENUE */}
              <div className="bg-white border-2 border-money-green p-6 rounded-2xl col-span-2 shadow-md flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-money-green text-white text-[10px] font-bold px-3 py-1 uppercase rounded-bl-xl tracking-wider">
                  80% Recovered
                </div>
                <span className="text-xs font-bold text-money-green uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} /> Recovered with Systemize Labs
                </span>
                <p className="font-serif text-4xl sm:text-5xl font-bold text-money-green mb-1">
                  <TweenedValue value={recoveredMonthly} prefix="$" />
                  <span className="text-sm font-sans font-medium text-muted-slate"> / month</span>
                </p>
                <p className="text-xs text-muted-slate">
                  Based on our standard 80% answering and booking resolution rate.
                </p>
              </div>

            </div>

          </div>

          {/* Calculator CTA */}
          <div className="text-center mt-12">
            <button 
              onClick={() => openPlanModal("ROI Recovery")}
              className="bg-signature-teal hover:bg-signature-teal/90 text-obsidian font-bold text-base px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-md shadow-signature-teal/10"
            >
              See How Much You Can Recover →
            </button>
          </div>

        </div>
      </section>

      {/* ==========================================
          10. PRICING SECTION
          ========================================== */}
      <section 
        id="pricing"
        className="py-20 md:py-28 px-6 md:px-12 bg-cloud border-t border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Section Headers */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-signature-teal block mb-3">SIMPLE PLANS</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ink mb-6">
              Simple, Transparent Pricing
            </h2>
            <div className="w-16 h-1 bg-signature-teal mx-auto rounded-full mb-4"></div>
            <p className="text-muted-slate text-base md:text-lg">
              Choose the plan that fits your business. Every plan includes our natural AI voice, real-time booking, and automated customer communication.
            </p>
          </div>

          {/* 3 Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch mb-12">
            
            {/* Card 1: Sprout */}
            <ScrollReveal delay={0} className="bg-white border border-gray-200 p-8 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all h-full relative">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ink mb-1">Sprout</h3>
                <p className="text-xs text-muted-slate uppercase tracking-wider font-bold mb-6">FOR SMALL BUSINESSES</p>
                
                <div className="mb-6">
                  <span className="font-serif text-4xl font-bold text-ink">$349</span>
                  <span className="text-sm text-muted-slate font-medium"> / month</span>
                  <p className="text-xs text-muted-slate mt-1">For small businesses getting started</p>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6"></div>

                <ul className="flex flex-col gap-3.5 text-sm text-ink mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Business-hours call coverage (extendable to 24/7)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Up to 200 calls/month included</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Real-time appointment/booking</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>WhatsApp OR Email confirmation</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Standard reminders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Natural AI voice, 1 accent option</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Email support</span>
                  </li>
                </ul>
              </div>

              <div>
                <button 
                  onClick={() => openPlanModal("Sprout Plan")}
                  className="w-full bg-cloud border border-gray-300 hover:border-signature-teal hover:bg-white text-ink font-bold py-3.5 rounded-xl transition-all"
                >
                  Get Started
                </button>
                <p className="text-[11px] text-center text-muted-slate mt-2.5">Setup fee applies — details shared on your demo call</p>
              </div>
            </ScrollReveal>

            {/* Card 2: Thrive (Most Popular - HIGHLIGHTED) */}
            <ScrollReveal delay={120} className="bg-white border-2 border-signature-teal p-8 rounded-3xl flex flex-col justify-between shadow-xl shadow-signature-teal/5 hover:shadow-2xl hover:shadow-signature-teal/10 transition-all h-full relative lg:scale-105">
              
              {/* Badge */}
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-warm-amber text-obsidian text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                Most Popular
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-serif text-2xl font-bold text-ink">Thrive</h3>
                  <Sparkles size={16} className="text-warm-amber animate-pulse" />
                </div>
                <p className="text-xs text-signature-teal uppercase tracking-wider font-bold mb-6">ALWAYS-ON COVERAGE</p>
                
                <div className="mb-6">
                  <span className="font-serif text-5xl font-bold text-ink">$699</span>
                  <span className="text-sm text-muted-slate font-medium"> / month</span>
                  <p className="text-xs text-muted-slate mt-1">For busy businesses that need always-on coverage</p>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6"></div>

                <ul className="flex flex-col gap-3.5 text-sm text-ink mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span className="font-semibold text-ink">Full 24/7 call coverage</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span className="font-semibold text-ink">Up to 800 calls/month included</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Real-time appointment/booking</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span className="font-semibold text-ink">WhatsApp + Email confirmation (both)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Multi-stage smart reminders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Voice/accent choice</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Performance analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span className="font-semibold text-ink">Priority WhatsApp support</span>
                  </li>
                </ul>
              </div>

              <div>
                <button 
                  onClick={() => openPlanModal("Thrive Plan")}
                  className="w-full bg-signature-teal hover:bg-signature-teal/90 text-obsidian font-bold py-4 rounded-xl transition-all shadow-md shadow-signature-teal/15"
                >
                  Get Started
                </button>
                <p className="text-[11px] text-center text-muted-slate mt-2.5">Setup fee applies — details shared on your demo call</p>
              </div>
            </ScrollReveal>

            {/* Card 3: Summit */}
            <ScrollReveal delay={240} className="bg-white border border-gray-200 p-8 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all h-full relative">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ink mb-1">Summit</h3>
                <p className="text-xs text-muted-slate uppercase tracking-wider font-bold mb-6">ENTERPRISE / FRANCHISE</p>
                
                <div className="mb-6">
                  <span className="font-serif text-4xl font-bold text-ink">Custom Pricing</span>
                  <p className="text-xs text-muted-slate mt-2">For multi-location businesses and franchises</p>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6"></div>

                <ul className="flex flex-col gap-3.5 text-sm text-ink mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span className="font-semibold text-ink">Unlimited calls</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Multi-location support</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Custom branded voice persona</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Advanced CRM integration</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Dedicated account contact</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={16} className="text-signature-teal mt-0.5 shrink-0" />
                    <span>Fully custom automation workflows</span>
                  </li>
                </ul>
              </div>

              <div>
                <button 
                  onClick={() => openPlanModal("Summit Plan")}
                  className="w-full bg-cloud border border-gray-300 hover:border-signature-teal hover:bg-white text-ink font-bold py-3.5 rounded-xl transition-all"
                >
                  Contact Sales
                </button>
                <p className="text-[11px] text-center text-white select-none mt-2.5">Spacer tag for alignment</p>
              </div>
            </ScrollReveal>

          </div>

          {/* Pricing Bottom note */}
          <div className="text-center max-w-2xl mx-auto mt-12 bg-white/60 p-5 rounded-2xl border border-gray-200">
            <p className="text-sm text-muted-slate">
              Not sure which plan fits? <span className="text-ink font-semibold">Book a free demo call</span> and we'll recommend the right fit for your business — no pressure, no obligation.
            </p>
          </div>

        </div>
      </section>

      {/* ==========================================
          11. TRUST & SECURITY SECTION
          ========================================== */}
      <section 
        id="security"
        className="py-20 md:py-24 px-6 md:px-12 bg-white"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Section Headers */}
          <div className="text-center max-w-3xl mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-slate block mb-3">DATA PRIVACY</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ink mb-6">
              Built for Data Security and Compliance
            </h2>
            <div className="w-16 h-1 bg-signature-teal mx-auto rounded-full"></div>
          </div>

          {/* 4 Trust badges row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            
            {/* Badge 1 */}
            <ScrollReveal delay={0} className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-2xl bg-cloud shadow-sm group hover:border-signature-teal/30 hover:bg-white transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-signature-teal/10 flex items-center justify-center text-signature-teal mb-4 pulse-glow">
                <Shield size={24} />
              </div>
              <h3 className="font-serif font-bold text-ink text-base mb-2">GDPR Compliant</h3>
              <p className="text-xs text-muted-slate leading-relaxed">
                Fully compliant with UK data protection laws and general global privacy guidelines.
              </p>
            </ScrollReveal>

            {/* Badge 2 */}
            <ScrollReveal delay={100} className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-2xl bg-cloud shadow-sm group hover:border-signature-teal/30 hover:bg-white transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-signature-teal/10 flex items-center justify-center text-signature-teal mb-4 pulse-glow" style={{ animationDelay: "0.5s" }}>
                <Server size={24} />
              </div>
              <h3 className="font-serif font-bold text-ink text-base mb-2">Secure Data Storage</h3>
              <p className="text-xs text-muted-slate leading-relaxed">
                Customer interactions and session logs are safely backed up on enterprise storage.
              </p>
            </ScrollReveal>

            {/* Badge 3 */}
            <ScrollReveal delay={200} className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-2xl bg-cloud shadow-sm group hover:border-signature-teal/30 hover:bg-white transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-signature-teal/10 flex items-center justify-center text-signature-teal mb-4 pulse-glow" style={{ animationDelay: "1s" }}>
                <Lock size={24} />
              </div>
              <h3 className="font-serif font-bold text-ink text-base mb-2">End-to-End Encrypted</h3>
              <p className="text-xs text-muted-slate leading-relaxed">
                Every call transfer and appointment transmission is heavily encrypted in transit.
              </p>
            </ScrollReveal>

            {/* Badge 4 */}
            <ScrollReveal delay={300} className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-2xl bg-cloud shadow-sm group hover:border-signature-teal/30 hover:bg-white transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-signature-teal/10 flex items-center justify-center text-signature-teal mb-4 pulse-glow" style={{ animationDelay: "1.5s" }}>
                <FileText size={24} />
              </div>
              <h3 className="font-serif font-bold text-ink text-base mb-2">Privacy-First</h3>
              <p className="text-xs text-muted-slate leading-relaxed">
                We minimize active collection or storage of personal identifier customer details.
              </p>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* ==========================================
          12. FREE PILOT CTA SECTION
          ========================================== */}
      <section 
        id="pilot-cta"
        className="relative bg-obsidian text-white py-20 md:py-28 px-6 md:px-12 overflow-hidden"
      >
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(0,217,192,0.1)_0%,transparent_70%)] pointer-events-none z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-14 md:mb-20 max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-signature-teal/10 border border-signature-teal/30 mb-6">
                <Award size={14} className="text-signature-teal" />
                <span className="text-xs font-semibold uppercase tracking-wider text-signature-teal">EXCLUSIVE PILOT OPPORTUNITY</span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
                5 Businesses Selected Each Month for Our Free Pilot
              </h2>
              
              <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                We're currently selecting appointment-based businesses across Manchester, London, and Birmingham — any industry — for a free 30-day pilot. No cost. No commitment. Just real results.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: Presenting Robot + 3D Blueprint Card */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-8 lg:gap-10">
              
              {/* Robot Mascot Presenting */}
              <ScrollReveal delay={100} className="relative flex-shrink-0">
                <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] animate-float">
                  {/* Outer soft glowing shield ring */}
                  <div className="absolute inset-0 rounded-full border border-signature-teal/20 bg-signature-teal/5 scale-110 pointer-events-none animate-pulse"></div>

                  {/* Vector Presenting Robot SVG */}
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_35px_rgba(0,217,192,0.35)]">
                    {/* Propulsion glow base */}
                    <ellipse cx="100" cy="175" rx="30" ry="8" fill="url(#propulsionGlowPilotRedesign)" opacity="0.8">
                      <animate attributeName="ry" values="6;10;6" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
                    </ellipse>

                    {/* Left hover hand */}
                    <g className="animate-float" style={{ animationDuration: "3.5s" }}>
                      <path d="M45,115 Q30,120 40,130 Q45,125 45,115" fill="#00D9C0" opacity="0.9" />
                      <ellipse cx="40" cy="122" rx="4" ry="4" fill="#00D9C0" />
                    </g>

                    {/* Right presenting hand - gesturing outward/upward to the right */}
                    <g className="animate-float" style={{ animationDuration: "3.8s", animationDelay: "0.5s" }}>
                      <path d="M135,120 C155,112 172,108 178,112 C178,118 160,132 135,130 Z" fill="#00D9C0" opacity="0.9" stroke="#00D9C0" strokeWidth="1" />
                      {/* Hand/Fingers gesturing up-right */}
                      <ellipse cx="178" cy="112" rx="4.5" ry="4" fill="#00D9C0" />
                      <circle cx="173" cy="115" r="2.5" fill="#00D9C0" />
                      <circle cx="170" cy="119" r="2" fill="#00D9C0" />
                    </g>

                    {/* Robot body torso */}
                    <path d="M65,110 L135,110 L125,155 L75,155 Z" fill="#141C38" stroke="#00D9C0" strokeWidth="2.5" strokeLinejoin="round" />
                    
                    {/* Torso accent glow indicator */}
                    <rect x="85" y="122" width="30" height="8" rx="4" fill="#00D9C0" opacity="0.3" />
                    <circle cx="100" cy="126" r="3" fill="#00D9C0" className="animate-ping" />
                    <circle cx="100" cy="126" r="3" fill="#00D9C0" />

                    {/* Cyber neck connection */}
                    <rect x="90" y="95" width="20" height="20" rx="3" fill="#00D9C0" opacity="0.7" />

                    {/* Head unit helmet */}
                    <rect x="55" y="45" width="90" height="60" rx="30" fill="#141C38" stroke="#00D9C0" strokeWidth="3" />

                    {/* Audio acoustic wave ears */}
                    <circle cx="50" cy="75" r="8" fill="#141C38" stroke="#00D9C0" strokeWidth="1.5" />
                    <circle cx="50" cy="75" r="4" fill="#00D9C0" />
                    <circle cx="150" cy="75" r="8" fill="#141C38" stroke="#00D9C0" strokeWidth="1.5" />
                    <circle cx="150" cy="75" r="4" fill="#00D9C0" />

                    {/* Cyber glass visor faceplate */}
                    <path d="M68,60 L132,60 C138,60 138,88 132,88 L68,88 C62,88 62,60 68,60 Z" fill="#0A0E20" stroke="#00D9C0" strokeWidth="1.5" />

                    {/* Blinking glowing circular cybereyes */}
                    <g>
                      <circle cx="85" cy="74" r="6" fill="#00D9C0" className="animate-pulse">
                        <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="85" cy="74" r="2" fill="#FFFFFF" />
                      
                      <circle cx="115" cy="74" r="6" fill="#00D9C0" className="animate-pulse">
                        <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="115" cy="74" r="2" fill="#FFFFFF" />
                    </g>

                    {/* Visor shine flare reflection */}
                    <path d="M72,64 L100,64" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

                    {/* Gradient declarations */}
                    <defs>
                      <radialGradient id="propulsionGlowPilotRedesign" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#00D9C0" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#00D9C0" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </ScrollReveal>

              {/* Tilted Blueprint Card */}
              <ScrollReveal delay={250} className="relative flex-shrink-0">
                <div 
                  className="w-[170px] h-[238px] sm:w-[185px] sm:h-[259px] bg-gradient-to-br from-[#141C38] via-obsidian to-signature-teal/15 border border-signature-teal/35 rounded-xl p-5 shadow-2xl flex flex-col justify-between transition-all duration-500 hover:scale-105 select-none relative overflow-hidden"
                  style={{ 
                    transform: "perspective(1000px) rotateY(-15deg) rotateX(10deg) rotateZ(-3deg)", 
                    transformStyle: "preserve-3d",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 217, 192, 0.15)"
                  }}
                >
                  {/* Subtle blueprint grid background overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,192,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,192,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
                  
                  {/* Glossy overlay sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>

                  {/* Wordmark top */}
                  <div className="flex items-center gap-1 z-10">
                    <Sparkles size={11} className="text-signature-teal" />
                    <span className="text-[9px] font-bold tracking-widest text-gray-300 uppercase font-sans">Systemize Labs</span>
                  </div>

                  {/* Heading Middle */}
                  <div className="my-auto z-10 pr-1">
                    <span className="text-[9px] font-mono text-signature-teal uppercase tracking-widest block mb-1">PROPOSAL_V1</span>
                    <h3 className="font-sans font-bold text-base sm:text-lg text-white leading-tight uppercase tracking-tight">
                      AI Automation<br />Blueprint
                    </h3>
                    <div className="w-8 h-1 bg-signature-teal mt-2 rounded"></div>
                  </div>

                  {/* Subline bottom */}
                  <div className="z-10 mt-auto pt-2.5 border-t border-signature-teal/20">
                    <p className="text-[10px] text-gray-300 leading-normal font-sans font-medium">
                      Your Custom Roadmap to 24/7 Call Coverage
                    </p>
                  </div>
                </div>
              </ScrollReveal>

            </div>

            {/* RIGHT COLUMN: Multi-Step Form Card */}
            <div className="lg:col-span-7 flex justify-center">
              <ScrollReveal delay={200} className="w-full max-w-lg bg-white border border-gray-100 p-8 rounded-2xl shadow-2xl text-left relative text-ink">
                
                {/* Top Row with Icon/Logo and Step Indicator */}
                <div className="flex justify-between items-center mb-6">
                  {/* Small logo/icon at the top of the card */}
                  <div className="w-10 h-10 rounded-xl bg-signature-teal/10 flex items-center justify-center text-signature-teal">
                    <Sparkles size={20} />
                  </div>
                  {/* Small step indicator at the top right of the card */}
                  {!pilotSubmitted && (
                    <span className="text-xs font-bold text-muted-slate bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Step {pilotFormStep} of 2
                    </span>
                  )}
                </div>

                {!pilotSubmitted ? (
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-ink mb-1.5 leading-tight">
                      Let's Build Your Custom AI Blueprint
                    </h3>
                    <p className="text-xs text-muted-slate mb-6 leading-relaxed">
                      Tell us a bit about your business, and we'll share a customized pricing blueprint.
                    </p>

                    {/* Form with Slide Transition */}
                    <div className="relative overflow-hidden w-full min-h-[300px] sm:min-h-[265px]">
                      
                      {/* STEP 1 CONTAINER */}
                      <div 
                        className={`w-full transition-all duration-500 transform ${
                          pilotFormStep === 1 
                            ? "translate-x-0 opacity-100 relative pointer-events-auto" 
                            : "-translate-x-full opacity-0 absolute pointer-events-none"
                        }`}
                      >
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">First Name *</label>
                              <input 
                                type="text" 
                                name="firstName"
                                required
                                placeholder="e.g. Sarah" 
                                value={pilotFormData.firstName}
                                onChange={(e) => {
                                  setPilotFormData({...pilotFormData, firstName: e.target.value});
                                  setStep1Errors({...step1Errors, firstName: false});
                                }}
                                className={`border ${step1Errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-signature-teal'} rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none transition-all bg-white`}
                              />
                              {step1Errors.firstName && <span className="text-[10px] text-red-500 font-semibold">First name is required</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Last Name *</label>
                              <input 
                                type="text" 
                                name="lastName"
                                required
                                placeholder="e.g. Jenkins" 
                                value={pilotFormData.lastName}
                                onChange={(e) => {
                                  setPilotFormData({...pilotFormData, lastName: e.target.value});
                                  setStep1Errors({...step1Errors, lastName: false});
                                }}
                                className={`border ${step1Errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-signature-teal'} rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none transition-all bg-white`}
                              />
                              {step1Errors.lastName && <span className="text-[10px] text-red-500 font-semibold">Last name is required</span>}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Business Email *</label>
                            <input 
                              type="email" 
                              name="email"
                              required
                              placeholder="e.g. sarah@apexservices.com" 
                              value={pilotFormData.email}
                              onChange={(e) => {
                                setPilotFormData({...pilotFormData, email: e.target.value});
                                setStep1Errors({...step1Errors, email: false});
                              }}
                              className={`border ${step1Errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-signature-teal'} rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none transition-all bg-white`}
                            />
                            {step1Errors.email && <span className="text-[10px] text-red-500 font-semibold">Valid business email is required</span>}
                          </div>

                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const errors = {
                                firstName: pilotFormData.firstName.trim() === "",
                                lastName: pilotFormData.lastName.trim() === "",
                                email: pilotFormData.email.trim() === "" || !pilotFormData.email.includes("@")
                              };
                              setStep1Errors(errors);
                              if (!errors.firstName && !errors.lastName && !errors.email) {
                                setPilotFormStep(2);
                              }
                            }}
                            className="w-full bg-signature-teal hover:bg-signature-teal/90 text-obsidian font-bold text-sm py-3.5 rounded-xl transition-all duration-300 text-center mt-3 cursor-pointer shadow-lg shadow-signature-teal/10"
                          >
                            Next →
                          </button>
                        </div>
                      </div>

                      {/* STEP 2 CONTAINER */}
                      <div 
                        className={`w-full transition-all duration-500 transform ${
                          pilotFormStep === 2 
                            ? "translate-x-0 opacity-100 relative pointer-events-auto" 
                            : "translate-x-full opacity-0 absolute pointer-events-none"
                        }`}
                      >
                        <form onSubmit={handlePilotSubmit} className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Business Name *</label>
                            <input 
                              type="text" 
                              name="businessName"
                              required
                              placeholder="e.g. Apex Home Services" 
                              value={pilotFormData.businessName}
                              onChange={(e) => setPilotFormData({...pilotFormData, businessName: e.target.value})}
                              className="border border-slate-200 focus:border-signature-teal rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none transition-all bg-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Industry *</label>
                              <select 
                                name="industry"
                                required
                                value={pilotFormData.industry}
                                onChange={(e) => setPilotFormData({...pilotFormData, industry: e.target.value})}
                                className="border border-slate-200 focus:border-signature-teal rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none transition-all cursor-pointer bg-white"
                              >
                                <option value="">Select industry...</option>
                                <option value="Healthcare">Medical & Dental Clinic</option>
                                <option value="Beauty">Salon & Spa</option>
                                <option value="Legal">Law Firm / Consultant</option>
                                <option value="Real Estate">Real Estate Agency</option>
                                <option value="Home Services">Home Services</option>
                                <option value="Hospitality">Restaurant / Hospitality</option>
                                <option value="Fitness">Fitness & Wellness</option>
                                <option value="Auto">Auto Repair & Service</option>
                                <option value="Other">Other Industry</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">City Location *</label>
                              <select 
                                name="city"
                                required
                                value={pilotFormData.city}
                                onChange={(e) => setPilotFormData({...pilotFormData, city: e.target.value})}
                                className="border border-slate-200 focus:border-signature-teal rounded-lg px-4 py-2.5 text-sm text-ink focus:outline-none transition-all cursor-pointer bg-white"
                              >
                                <option value="">Select city...</option>
                                <option value="London">London</option>
                                <option value="Manchester">Manchester</option>
                                <option value="Birmingham">Birmingham</option>
                                <option value="Other UK">Other UK Location</option>
                                <option value="US">US Location</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-3">
                            <button 
                              type="button"
                              onClick={() => setPilotFormStep(1)}
                              className="w-1/3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm py-3.5 rounded-xl transition-all duration-300 text-center cursor-pointer bg-white"
                            >
                              ← Back
                            </button>
                            <button 
                              type="submit"
                              className="w-2/3 bg-signature-teal hover:bg-signature-teal/90 text-obsidian font-bold text-sm py-3.5 rounded-xl transition-all duration-300 text-center cursor-pointer shadow-lg shadow-signature-teal/10"
                            >
                              Get My Blueprint
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Thank-you state: same smooth crossfade with checkmark animation */
                  <div className="text-center py-6 px-2 flex flex-col items-center justify-center min-h-[350px]">
                    <div className="w-16 h-16 rounded-full bg-signature-teal/10 text-signature-teal flex items-center justify-center mb-6 shadow-sm pulse-glow">
                      <Check size={32} className="text-signature-teal animate-bounce" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-ink mb-3">Blueprint Requested!</h3>
                    <p className="text-slate-600 text-sm max-w-md leading-relaxed mb-6">
                      Thanks! We'll be in touch within 24 hours with your custom blueprint.
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center w-full">
                      <p className="text-xs text-signature-teal font-bold mb-2">WANT TO SPEED UP APPROVAL?</p>
                      <button 
                        onClick={() => {
                          setPilotSubmitted(false);
                          setPilotFormStep(1);
                          setPilotFormData({
                            firstName: "",
                            lastName: "",
                            email: "",
                            businessName: "",
                            industry: "",
                            city: ""
                          });
                          openPlanModal("Pilot Priority Demo");
                        }}
                        className="bg-signature-teal text-obsidian text-xs font-bold px-5 py-2.5 rounded-lg transition-all hover:bg-signature-teal/90 shadow-sm cursor-pointer"
                      >
                        Request Express Setup Demo
                      </button>
                    </div>
                  </div>
                )}

                {/* Reassurance text below form */}
                <p className="text-[11px] text-center text-muted-slate mt-4">
                  We'll respond within 24 hours. No spam. No sales calls without permission.
                </p>
              </ScrollReveal>
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          13. ADDITIONAL SERVICE BANNER
          ========================================== */}
      <section 
        id="additional-service"
        className="bg-[#F7F8FC] border-t border-[#E4E7F1] py-10 px-6 md:px-12"
      >
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <ScrollReveal className="flex flex-col items-center">
            <span 
              className="text-xs font-bold tracking-widest text-muted-slate uppercase mb-3 block"
              style={{ fontVariant: "all-small-caps" }}
            >
              ALSO AVAILABLE
            </span>
            <h3 className="font-sans font-normal text-[28px] text-ink leading-tight mb-4">
              Need a Custom Website for Your Business?
            </h3>
            <p className="text-[16px] text-muted-slate leading-relaxed mb-6 max-w-xl">
              Beyond AI Receptionists, Systemize Labs also designs and builds individual custom landing pages and websites — for any business. Fast turnaround, fully bespoke.
            </p>
            <button 
              onClick={() => openPlanModal("Custom Website Design")}
              className="border border-ink/30 hover:border-ink hover:bg-white text-ink text-xs font-bold px-5 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              Ask About Website Design
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          14. FAQ — Accordion
          ========================================== */}
      <section 
        id="faq"
        className="py-20 md:py-28 px-6 md:px-12 bg-white border-t border-gray-200/50"
      >
        <div className="max-w-4xl mx-auto">
          
          {/* Section Headers */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-slate block mb-3">ANY QUESTIONS?</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ink mb-6">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-1 bg-signature-teal mx-auto rounded-full"></div>
          </div>

          {/* Accordion Questions */}
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {faqData.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <ScrollReveal key={idx} delay={idx * 50}>
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-signature-teal/30 transition-all duration-300">
                    
                    {/* Header trigger */}
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-6 text-left font-serif font-bold text-ink text-base md:text-lg bg-cloud hover:bg-white transition-colors focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown 
                        size={18} 
                        className={`text-signature-teal transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`} 
                      />
                    </button>

                    {/* Content pane */}
                    <div 
                      className={`transition-all duration-300 overflow-hidden ${
                        isOpen ? "max-h-[250px] border-t border-gray-200/50 bg-white" : "max-h-0"
                      }`}
                    >
                      <p className="p-6 text-sm text-muted-slate leading-relaxed">
                        {faq.a}
                      </p>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==========================================
          15. FOOTER
          ========================================== */}
      <footer 
        id="footer"
        className="bg-obsidian text-white pt-16 pb-12 px-6 md:px-12 border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Logo & Tagline */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              Systemize<span className="text-signature-teal">Labs</span>
            </span>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              AI Receptionists for Every Business. Never miss another customer call, and watch your booking calendar fill automatically.
            </p>
            <div className="flex gap-4 text-xs font-semibold text-gray-500 mt-2">
              <span className="flex items-center gap-1"><Shield size={12} className="text-signature-teal" /> GDPR Compliant</span>
              <span>•</span>
              <span className="text-signature-teal">Active US & UK Support</span>
            </div>
          </div>

          {/* Middle Links */}
          <div className="md:col-span-4 flex flex-col items-start md:items-center">
            <div className="flex flex-col gap-3 text-left">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">QUICK LINKS</span>
              <a href="#features" className="text-sm text-gray-300 hover:text-signature-teal transition-colors">Features</a>
              <a href="#industries" className="text-sm text-gray-300 hover:text-signature-teal transition-colors">Industries</a>
              <a href="#pricing" className="text-sm text-gray-300 hover:text-signature-teal transition-colors">Pricing</a>
              <a href="#calculator" className="text-sm text-gray-300 hover:text-signature-teal transition-colors">Calculator</a>
              <a href="#faq" className="text-sm text-gray-300 hover:text-signature-teal transition-colors">FAQ</a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 flex flex-col items-start">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">CONTACT</span>
            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <p className="flex items-center gap-2"><Clock size={14} className="text-signature-teal" /> 24 / 7 Live Coverage</p>
              <p className="flex items-center gap-2"><MessageSquare size={14} className="text-signature-teal" /> operations@systemizelabs.com</p>
              <p className="text-xs text-gray-500 mt-1">Systemize Labs UK & US Ltd.</p>
            </div>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
          <p>© 2026 Systemize Labs. GDPR Compliant. All rights reserved.</p>
          <div className="flex gap-4 justify-center sm:justify-start">
            <a href="#" className="hover:text-signature-teal transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-signature-teal transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* ==========================================
          INTERACTIVE POPUP MODAL
          ========================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col scale-in duration-300 transform">
            
            {/* Modal Header */}
            <div className="bg-obsidian text-white p-6 relative">
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={16} className="text-signature-teal" />
                <span className="text-xs font-bold text-signature-teal uppercase tracking-widest">
                  {modalPlan === "Free Demo" || modalPlan === "ROI Recovery" ? "FREE DEMO RESERVATION" : `${modalPlan.toUpperCase()} REQUEST`}
                </span>
              </div>
              
              <h3 className="font-serif text-2xl font-bold text-white pr-6">
                {modalPlan === "Custom Enterprise Solution" || modalPlan === "Summit Plan"
                  ? "Bespoke Enterprise Integration" 
                  : modalPlan === "Custom Website Design"
                  ? "Custom Website Design Inquiry"
                  : "Let's Build Your AI Receptionist"}
              </h3>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh]">
              
              {/* Form State */}
              {!modalFormSubmitted ? (
                <form 
                  action="https://formspree.io/f/mkolzzza" 
                  method="POST" 
                  onSubmit={handleModalSubmit} 
                  className="flex flex-col gap-4"
                >
                  <input type="hidden" name="_subject" value="New Lead - Systemize Labs" />
                  <input type="hidden" name="plan" value={modalPlan} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name *</label>
                      <input 
                        type="text" 
                        name="fullName"
                        required 
                        placeholder="e.g. David Miller"
                        value={modalFormData.fullName}
                        onChange={(e) => setModalFormData({...modalFormData, fullName: e.target.value})}
                        className="bg-cloud border border-gray-200 rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-signature-teal"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Business Name *</label>
                      <input 
                        type="text" 
                        name="businessName"
                        required 
                        placeholder="e.g. Miller & Co Solicitors"
                        value={modalFormData.businessName}
                        onChange={(e) => setModalFormData({...modalFormData, businessName: e.target.value})}
                        className="bg-cloud border border-gray-200 rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-signature-teal"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      required 
                      placeholder="david@millerlegal.com"
                      value={modalFormData.email}
                      onChange={(e) => setModalFormData({...modalFormData, email: e.target.value})}
                      className="bg-cloud border border-gray-200 rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-signature-teal"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">WhatsApp / Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required 
                      placeholder="e.g. +44 7123 456789 (with country code)"
                      value={modalFormData.phone}
                      onChange={(e) => setModalFormData({...modalFormData, phone: e.target.value})}
                      className="bg-cloud border border-gray-200 rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-signature-teal"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="bg-signature-teal hover:bg-signature-teal/90 text-obsidian font-bold text-base py-3.5 rounded-xl transition-all duration-300 text-center cursor-pointer shadow-lg shadow-signature-teal/15 mt-2"
                  >
                    Request My Free Demo
                  </button>

                  <div className="flex items-center gap-1.5 justify-center text-xs text-muted-slate mt-1.5">
                    <Check size={14} className="text-signature-teal" /> 
                    <span>Live booking setup overview included on call</span>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-signature-teal/20 text-signature-teal flex items-center justify-center mb-4">
                    <Check size={28} className="animate-bounce" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-ink mb-2">Thank you!</h4>
                  <p className="text-sm text-muted-slate max-w-sm mb-6 leading-relaxed">
                    We have successfully registered your request. One of our engineers will reach out to <span className="font-semibold text-ink">{modalFormData.fullName}</span> at <span className="font-semibold text-ink">{modalFormData.phone}</span> within 24 hours.
                  </p>
                  
                  <div className="bg-cloud p-4 rounded-xl border border-gray-200 w-full">
                    <p className="text-[11px] font-bold text-signature-teal uppercase tracking-widest mb-1">PRO TIP</p>
                    <p className="text-xs text-ink/80 leading-relaxed">
                      Prepare a list of your most common unanswered inquiries so we can pre-train the AI before our session!
                    </p>
                  </div>

                  <button 
                    onClick={() => setModalOpen(false)}
                    className="mt-6 border border-gray-300 text-ink text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-cloud"
                  >
                    Close Window
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

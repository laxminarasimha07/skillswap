import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/shared/Button';
import { Layers, Zap, MessageSquare, ArrowRight, Shield, ShieldCheck, Video, Calendar, Sparkles } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) navigate('/feed');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      
      {/* ── Navbar ── */}
      <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="M3 8l4-5 3 3.5L12 3l1 5-5 5-5-5z" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">SkillSwap</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:flex text-slate-300 hover:text-white">
              Log in
            </Button>
            <Button size="sm" variant="primary" onClick={() => navigate('/register')}>
              Join the network
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-400 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="tracking-wide">Peer-to-Peer Learning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight"
          >
            Trade your skills.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Grow together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Connect with college peers to exchange knowledge. You teach them Python, they teach you Guitar. Perfectly matched, completely free.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button size="lg" onClick={() => navigate('/register')} className="w-full sm:w-auto px-8 py-3.5 text-base shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Get Started
              <ArrowRight className="h-5 w-5 ml-1.5" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 py-3.5 text-base">
              Sign In
            </Button>
          </motion.div>
        </div>
      </main>

      {/* ── Feature Cards Grid ── */}
      <section className="py-24 border-t border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Everything you need to learn.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Skip the generic courses. Connect with real students for highly specific, personalized skill trading.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="text-amber-400" />} 
              title="Instant Matching" 
              desc="Our engine pairs you with peers whose learning goals perfectly offset the skills you can offer." 
            />
            <FeatureCard 
              icon={<Calendar className="text-blue-400" />} 
              title="Smart Scheduling" 
              desc="Propose time slots and sync directly with Google Calendar so you never miss a learning session." 
            />
            <FeatureCard 
              icon={<MessageSquare className="text-fuchsia-400" />} 
              title="Direct Chat" 
              desc="Built-in low-latency messaging to easily coordinate details and share resources securely." 
            />
            <FeatureCard 
              icon={<Video className="text-emerald-400" />} 
              title="Automated Meets" 
              desc="Every confirmed session automatically generates a unique Google Meet video conferencing link." 
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-indigo-400" />} 
              title="Verified Profiles" 
              desc="Rest easy knowing you're connecting with verified college students within your network." 
            />
            <FeatureCard 
              icon={<Layers className="text-rose-400" />} 
              title="Progress Tracking" 
              desc="Earn peer ratings after every completed session to build your reputation on the platform." 
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">How it works</h2>
            <p className="text-slate-400">Three simple steps to start expanding your skillset.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
             <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 z-0" />
             
             {[
               { no: '1', title: 'Create your profile', desc: 'List the skills you have mastered and the ones you want to learn.' },
               { no: '2', title: 'Connect with peers', desc: 'Browse your personalized match feed and instantly send connection requests.' },
               { no: '3', title: 'Schedule & Trade', desc: 'Propose a time, get your Meet link, and host your 1-on-1 session.' },
             ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl flex items-center justify-center text-xl font-bold text-emerald-400 mb-6 font-['Poppins']">
                    {step.no}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-slate-800/80 bg-slate-950 text-center">
        <p className="text-sm text-slate-500 font-medium">
          Built for students. © {new Date().getFullYear()} SkillSwap.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 transition-colors shadow-sm">
    <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5 shrink-0">
      {React.cloneElement(icon, { className: "h-6 w-6" })}
    </div>
    <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default HomePage;

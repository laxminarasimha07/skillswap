import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/shared/Button';
import { Layers, Zap, MessageSquare, ArrowRight, Shield, Terminal } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) navigate('/feed');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border border-slate-700 bg-slate-900 flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path d="M3 8l4-5 3 3.5L12 3l1 5-5 5-5-5z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">SkillSwap</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="hidden sm:flex text-slate-400 hover:text-white">
              Log in
            </Button>
            <Button size="sm" variant="primary" onClick={() => navigate('/register')}>
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto relative relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-medium text-slate-400 mb-8"
          >
            <SparkleIcon className="h-3 w-3 text-indigo-400" />
            <span className="tracking-wide uppercase">Peer Learning Reimagined</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tighter mb-6 leading-[1.1]"
          >
            Master new skills.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            SkillSwap is a curated network for college students to exchange knowledge. 
            Teach what you know, learn what you don't. Zero cost.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button size="lg" onClick={() => navigate('/register')} className="w-full sm:w-auto px-8">
              Start exchanging
              <ArrowRight className="h-4 w-4 ml-1.5 opacity-70" />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')} className="w-full sm:w-auto px-8">
              Sign in
            </Button>
          </motion.div>
        </div>
      </main>

      {/* ── Features Grid ── */}
      <section className="py-24 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-4">Everything you need to grow.</h2>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
              We've built a streamlined platform that strips away the noise, focusing entirely on connecting you with the right peers and facilitating actual learning.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Layers />} 
              title="Smart Matching" 
              desc="Our algorithm connects you with students whose needs and offerings perfectly align with yours." 
            />
            <FeatureCard 
              icon={<MessageSquare />} 
              title="Real-time Chat" 
              desc="Instant, low-latency messaging to coordinate sessions and share resources instantly." 
            />
            <FeatureCard 
              icon={<Terminal />} 
              title="Focused UI" 
              desc="A clutter-free, developer-inspired interface designed to keep you focused on your goals." 
            />
            <FeatureCard 
              icon={<Zap />} 
              title="Lightning Fast" 
              desc="Built on a modern stack, ensuring your experience is smooth, responsive, and immediate." 
            />
            <FeatureCard 
              icon={<Shield />} 
              title="Secure Sessions" 
              desc="JWT-based authentication guarantees your data and conversations remain completely private." 
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-500">
          Seamlessly crafted for the modern student. © {new Date().getFullYear()} SkillSwap.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors">
    <div className="h-10 w-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 mb-5">
      {React.cloneElement(icon, { className: "h-5 w-5" })}
    </div>
    <h3 className="text-base font-medium text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const SparkleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default HomePage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/shared/Button';
import { Users, MessageSquare, Calendar, Zap, Shield, Smartphone, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) navigate('/feed');
  }, [user, navigate]);

  const features = [
    {
      icon: Users,
      title: 'Connect with Peers',
      description: 'Build real connections with students who share your goals and interests.',
      color: 'from-purple-600 to-purple-400',
    },
    {
      icon: Zap,
      title: 'Skill Exchange',
      description: 'Offer what you know, learn what you need. Zero cost, pure peer value.',
      color: 'from-cyan-600 to-cyan-400',
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Instant messaging to plan sessions and share resources on the go.',
      color: 'from-emerald-600 to-emerald-400',
    },
    {
      icon: Calendar,
      title: 'Schedule Sessions',
      description: 'Propose and confirm learning sessions with Google Calendar sync.',
      color: 'from-pink-600 to-pink-400',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'JWT-secured platform with privacy-first data handling.',
      color: 'from-orange-600 to-orange-400',
    },
    {
      icon: Smartphone,
      title: 'Always Connected',
      description: 'Fully responsive — access SkillSwap from any device on campus.',
      color: 'from-violet-600 to-violet-400',
    },
  ];

  const steps = [
    { step: '01', title: 'Create Profile', desc: 'Sign up and list your skills and learning goals.' },
    { step: '02', title: 'Find Peers', desc: 'Browse matched students with complementary skills.' },
    { step: '03', title: 'Chat & Plan', desc: 'Message connections and schedule sessions together.' },
    { step: '04', title: 'Learn & Grow', desc: 'Exchange skills live on Google Meet.' },
  ];

  const whyList = [
    'Zero cost — no fees, pure peer exchange',
    'Peer learning from students in your college',
    'Flexible scheduling that fits your timetable',
    'Community driven — built for students, by students',
    'Secure & private — your data stays yours',
    'Real results — grow your skills and your network',
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#E5E7EB]">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1F2937] bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SkillSwap
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
            <Button size="sm" onClick={() => navigate('/register')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-0 h-64 w-64 rounded-full bg-emerald-500/8 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-8"
          >
            <Zap className="h-3.5 w-3.5" />
            Peer-Powered Skill Exchange Platform
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Swap Skills.{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Grow Together.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#9CA3AF] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SkillSwap connects college students to exchange skills peer-to-peer.
            Find someone who knows what you want to learn — and teach them what you know.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" onClick={() => navigate('/register')} className="px-8 group">
              Get Started Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')} className="px-8">
              Sign In
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 sm:py-24 border-t border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-purple-400 text-sm font-medium mb-3 uppercase tracking-wider">Everything you need</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#E5E7EB]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Built for student learners
            </h2>
            <p className="text-[#6B7280] mt-3 max-w-xl mx-auto">
              A focused set of tools to find, connect with, and learn from peers in your college community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(139,92,246,0.3)' }}
                  className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 transition-all duration-300 group"
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-[#E5E7EB] font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {feature.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 sm:py-24 border-t border-[#1F2937]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-cyan-400 text-sm font-medium mb-3 uppercase tracking-wider">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#E5E7EB]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Start in 4 simple steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative text-center"
              >
                <div className="text-5xl font-black bg-gradient-to-br from-purple-600/30 to-cyan-500/30 bg-clip-text text-transparent mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {item.step}
                </div>
                <div className="h-px w-8 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-4 rounded-full" />
                <h4 className="text-[#E5E7EB] font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.title}</h4>
                <p className="text-[#6B7280] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why SkillSwap ── */}
      <section className="py-16 sm:py-24 border-t border-[#1F2937]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-emerald-400 text-sm font-medium mb-3 uppercase tracking-wider">Why SkillSwap</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#E5E7EB] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
                The smarter way to{' '}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  learn on campus
                </span>
              </h2>
              <ul className="space-y-3">
                {whyList.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <span className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-white" />
                    </span>
                    <span className="text-[#9CA3AF] text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-600/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: 'Skill Matching', color: 'from-purple-600 to-purple-400' },
                    { icon: MessageSquare, label: 'Real-time Chat', color: 'from-cyan-600 to-cyan-400' },
                    { icon: Calendar, label: 'Session Booking', color: 'from-emerald-600 to-emerald-400' },
                    { icon: Zap, label: 'Instant Connect', color: 'from-pink-600 to-pink-400' },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 flex flex-col items-center gap-2 text-center">
                        <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-[#9CA3AF] text-xs font-medium">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24 border-t border-[#1F2937]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/10 via-[#111827] to-cyan-500/10 p-10 sm:p-16 text-center"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#E5E7EB] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Ready to start swapping skills?
              </h2>
              <p className="text-[#9CA3AF] text-lg mb-8 max-w-xl mx-auto">
                Join students already exchanging skills and growing together on SkillSwap.
              </p>
              <Button size="lg" onClick={() => navigate('/register')} className="px-10 group">
                Create Your Free Account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1F2937] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="text-[#E5E7EB] font-semibold text-sm">SkillSwap</span>
            </div>
            <p className="text-[#4B5563] text-xs text-center">
              © 2025 SkillSwap · Built with ❤️ for student learning communities
            </p>
            <div className="flex gap-4 text-xs text-[#4B5563]">
              <a href="#" className="hover:text-[#9CA3AF] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#9CA3AF] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

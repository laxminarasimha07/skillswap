import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';
import { Users, MessageSquare, Calendar, Zap, Shield, Smartphone } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Users,
      title: 'Connect with Peers',
      description: 'Build meaningful connections with students who share your interests and skills. Create a network of like-minded learners in your college.'
    },
    {
      icon: Zap,
      title: 'Skill Exchange',
      description: 'Offer skills you excel at and learn from others. No monetary transactions required - pure value exchange between peers.'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Connect instantly with peers through our real-time messaging. Share resources, discuss topics, and build relationships effortlessly.'
    },
    {
      icon: Calendar,
      title: 'Schedule Sessions',
      description: 'Propose and confirm learning sessions with integrated calendar. Synchronize with Google Calendar for seamless scheduling.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your data is secure with end-to-end encryption. We prioritize your privacy and safety throughout the platform.'
    },
    {
      icon: Smartphone,
      title: 'Always Connected',
      description: 'Access SkillSwap on desktop, tablet, or mobile. Stay connected with your network wherever you are on campus.'
    }
  ];

  const stats = [
    { number: '100+', label: 'Active Users' },
    { number: '500+', label: 'Connections Made' },
    { number: '1000+', label: 'Skills Shared' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-indigo-600">SkillSwap</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Learn Together.<br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Grow Together.</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              SkillSwap connects college students to exchange skills, knowledge, and experiences. 
              Whether you want to learn coding, languages, or design—find peers who are eager to share their expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="px-8"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="px-8 text-white border-white hover:bg-white/10"
              >
                Login
              </Button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-1 backdrop-blur">
            <div className="rounded-xl bg-slate-800/50 p-12 flex items-center justify-center min-h-96">
              <div className="text-center">
                <Users className="h-24 w-24 text-indigo-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-300 text-lg">Community-Driven Learning Platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 sm:py-16 border-y border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-indigo-400 mb-2">{stat.number}</p>
                <p className="text-gray-400 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful Features for Learners
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to find, connect with, and learn from peers in your college community.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-xl border border-gray-700 bg-gray-800/50 p-8 hover:bg-gray-800/80 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="rounded-lg bg-indigo-500/10 p-3 w-fit group-hover:bg-indigo-500/20 transition-all duration-300">
                    <Icon className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h4 className="mt-4 text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative border-t border-gray-700 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How SkillSwap Works
            </h3>
            <p className="text-gray-400 text-lg">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-4">
            {[
              { step: 1, title: 'Create Profile', desc: 'Sign up and tell us about your skills and learning goals' },
              { step: 2, title: 'Find Peers', desc: 'Browse and connect with students who complement your goals' },
              { step: 3, title: 'Chat & Plan', desc: 'Message peers and schedule learning sessions together' },
              { step: 4, title: 'Learn & Grow', desc: 'Exchange skills through real-time sessions on Google Meet' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2 text-center">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-center text-sm">
                    {item.desc}
                  </p>
                </div>
                {idx < 3 && (
                  <div className="hidden sm:block absolute top-8 -right-6 h-1 w-12 bg-gradient-to-r from-indigo-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SkillSwap Section */}
      <section className="relative border-t border-gray-700 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Why Choose SkillSwap?
              </h3>
              <ul className="space-y-4">
                {[
                  'Zero Cost - Exchange skills without paying fees',
                  'Peer Learning - Learn from students at your college',
                  'Flexible Scheduling - Sessions that fit your time',
                  'Community Driven - Built by and for students',
                  'Secure & Private - Your data is always protected',
                  'Real Results - Grow your skills and network'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-3 w-3 rounded-full bg-indigo-400" />
                    </div>
                    <span className="text-gray-300 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-1 backdrop-blur">
              <div className="rounded-xl bg-slate-800/50 p-12 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Zap className="h-24 w-24 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-300 text-lg">Accelerate Your Learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-gray-700 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 sm:p-16 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of students exchanging skills and knowledge through SkillSwap today.
            </p>
            <Button
              size="lg"
              className="px-8 bg-white text-indigo-600 hover:bg-gray-100"
              onClick={() => navigate('/register')}
            >
              Create Your Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">SkillSwap</h4>
              <p className="text-gray-400 text-sm">Connecting peers for mutual learning</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm text-center">
              © 2025 SkillSwap. All rights reserved. Built with ❤️ for student learning communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

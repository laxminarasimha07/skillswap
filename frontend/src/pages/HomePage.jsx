import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/shared/Button';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) navigate('/feed');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-[#111111] rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full" />
             </div>
             <span className="text-xl font-bold tracking-tight text-[#111111] font-['Manrope']">SkillSwap</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
            <Button onClick={() => navigate('/register')}>Join the network</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-40 pb-20 px-6 sm:px-10 max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl sm:text-7xl lg:text-[100px] leading-[0.95] tracking-[-0.04em] font-extrabold text-[#111111] font-['Manrope'] mb-8"
          >
            Learn anything.<br/>From anyone.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-[#666666] max-w-2xl mb-12 font-medium leading-relaxed"
          >
            A curated peer-to-peer network for ambitious college students. Swap skills, build projects, and grow your expertise at zero cost.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" onClick={() => navigate('/register')}>Start trading skills</Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>Explore the feed</Button>
          </motion.div>
        </div>

        {/* Feature Grid / Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="col-span-1 md:col-span-2 aspect-[16/9] md:aspect-[16/7] bg-[#F9F9F9] rounded-[2rem] p-10 flex flex-col justify-end border border-[#E5E5E5]">
            <h3 className="text-3xl font-bold font-['Manrope'] tracking-tight mb-3 text-[#111111]">Smart matching.</h3>
            <p className="text-[#666666] text-lg max-w-md">Our algorithm pairs your learning goals directly with peers who can teach them.</p>
          </div>
          <div className="aspect-square md:aspect-auto bg-[#111111] rounded-[2rem] p-10 flex flex-col justify-end text-white">
            <h3 className="text-3xl font-bold font-['Manrope'] tracking-tight mb-3">Live chat.</h3>
            <p className="text-gray-400 text-lg">Coordinate and learn instantly in-app.</p>
          </div>
        </motion.div>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] py-12 px-6 sm:px-10">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="text-2xl font-bold tracking-tight text-[#111111] font-['Manrope']">SkillSwap &copy; {new Date().getFullYear()}</span>
          <div className="flex gap-8 text-sm font-semibold text-[#666666]">
            <span className="hover:text-[#111111] cursor-pointer">Manifesto</span>
            <span className="hover:text-[#111111] cursor-pointer">Privacy</span>
            <span className="hover:text-[#111111] cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import SkillBadge from '../components/feed/SkillBadge';
import { User, Shield, Star, Award } from 'lucide-react';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    about: user?.about || '',
    branch: user?.branch || '',
    year: user?.year || '',
    skillsOffered: user?.skillsOffered?.join(', ') || '',
    skillsWanted: user?.skillsWanted?.join(', ') || '',
    password: '',
  });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        about: form.about.slice(0, 100),
        branch: form.branch,
        year: form.year,
        skillsOffered: form.skillsOffered.split(',').map(s=>s.trim()).filter(Boolean),
        skillsWanted: form.skillsWanted.split(',').map(s=>s.trim()).filter(Boolean),
      };

      if (form.password.trim()) {
        await userApi.updatePassword({ password: form.password });
        setForm(p => ({ ...p, password: '' }));
      }

      const res = await userApi.updateProfile(payload);
      login(localStorage.getItem('token'), res);
      toast.success('Saved correctly');
      setEditing(false);
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 pt-8">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Block */}
        <div className="relative mb-8 pt-16 px-6 sm:px-10 pb-10 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {initials}
              </div>
              <div className="mt-2 sm:mt-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{user?.name}</h1>
                  <Shield className="h-5 w-5 text-emerald-400 mt-1.5" />
                </div>
                <p className="text-slate-400 font-medium">{user?.branch} • Year {user?.year}</p>
                
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-3 bg-slate-950/50 w-max mx-auto sm:mx-0 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-slate-200">{user?.rating?.toFixed(1) || '0.0'} Average Rating</span>
                </div>
              </div>
            </div>
            
            <Button variant={editing ? "outline" : "primary"} onClick={() => setEditing(!editing)} className="w-full sm:w-auto shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {editing ? 'Cancel edit' : 'Edit profile'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl relative z-20">
            {editing ? (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-5">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Edit Configuration</h3>
                <Input label="Name" name="name" value={form.name} onChange={handleChange} />
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bio <span className="font-normal opacity-60">({form.about.length}/100)</span></label>
                  <textarea
                    name="about" value={form.about}
                    onChange={e => setForm(p=>({...p, about: e.target.value.slice(0,100)}))}
                    rows={3}
                    className="w-full text-sm p-3.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} />
                  <Input label="Year" name="year" value={form.year} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-800">
                  <Input label="Can Teach" name="skillsOffered" value={form.skillsOffered} onChange={handleChange} hint="Comma separated" />
                  <Input label="Want to Learn" name="skillsWanted" value={form.skillsWanted} onChange={handleChange} hint="Comma separated" />
                </div>
                <div className="pt-6 mt-6 border-t border-slate-800">
                  <Input label="Update Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to skip" />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button onClick={save} isLoading={loading} className="px-8 shadow-[0_0_15px_rgba(16,185,129,0.3)]">Save Profile</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-10">
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" /> About Me
                  </h3>
                  <p className="text-base leading-relaxed text-slate-300 font-medium">
                    {user?.about || 'Student has not provided a bio.'}
                  </p>
                </section>
                
                <section className="pt-8 border-t border-slate-800">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                     <Award className="h-4 w-4" /> Exchange Arsenal
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-3 text-sm">Can Teach (<span className="text-emerald-400">Offers</span>)</h4>
                      <div className="flex flex-wrap gap-2">
                        {user?.skillsOffered?.length ? user.skillsOffered.map(s => <SkillBadge key={s} skill={s} type="offer" />) : <span className="text-slate-600 text-sm">None</span>}
                      </div>
                    </div>
                    <div className="hidden sm:block w-px bg-slate-800 mx-auto" />
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-3 text-sm">Want to Learn (<span className="text-indigo-400">Needs</span>)</h4>
                      <div className="flex flex-wrap gap-2">
                        {user?.skillsWanted?.length ? user.skillsWanted.map(s => <SkillBadge key={s} skill={s} type="want" />) : <span className="text-slate-600 text-sm">None</span>}
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import SkillBadge from '../components/feed/SkillBadge';

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
    <div className="min-h-screen bg-white">
      <div className="max-w-[1000px] mx-auto px-6 sm:px-10 py-20">
        
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-20 border-b border-[#E5E5E5] pb-10">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-[#111111] flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-5xl font-bold font-['Manrope'] text-[#111111] tracking-tight">{user?.name}</h1>
              <p className="text-[#666666] text-lg font-medium mt-1">{user?.branch} / {user?.year}</p>
            </div>
          </div>
          <Button variant={editing ? "outline" : "primary"} onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel edit' : 'Edit profile'}
          </Button>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            {editing ? (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
                <Input label="Name" name="name" value={form.name} onChange={handleChange} />
                <div>
                  <label className="block text-[13px] font-medium text-[#666666] mb-1.5">Bio <span className="font-normal">({form.about.length}/100)</span></label>
                  <textarea
                    name="about" value={form.about}
                    onChange={e => setForm(p=>({...p, about: e.target.value.slice(0,100)}))}
                    rows={3}
                    className="w-full text-sm p-4 rounded-2xl border border-[#E5E5E5] bg-transparent text-[#111111] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} />
                  <Input label="Year" name="year" value={form.year} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-[#E5E5E5]">
                  <Input label="Teaching" name="skillsOffered" value={form.skillsOffered} onChange={handleChange} hint="Comma separated" />
                  <Input label="Learning" name="skillsWanted" value={form.skillsWanted} onChange={handleChange} hint="Comma separated" />
                </div>
                <div className="pt-6 mt-6 border-t border-[#E5E5E5]">
                  <Input label="Update Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to skip" />
                </div>
                <div className="pt-4">
                  <Button onClick={save} isLoading={loading}>Save changes</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-12">
                <section>
                  <h3 className="text-sm font-bold text-[#A3A3A3] uppercase tracking-wider mb-4">About</h3>
                  <p className="text-xl leading-relaxed text-[#111111] font-medium max-w-2xl">
                    {user?.about || 'No bio written yet.'}
                  </p>
                </section>
                
                <section>
                  <h3 className="text-sm font-bold text-[#A3A3A3] uppercase tracking-wider mb-4">Skill Exchange</h3>
                  <div className="grid sm:grid-cols-2 gap-8 bg-[#F9F9F9] border border-[#E5E5E5] rounded-[24px] p-8">
                    <div>
                      <h4 className="font-bold text-[#111111] mb-3">Teaching</h4>
                      <div className="flex flex-wrap gap-2">
                        {user?.skillsOffered?.length ? user.skillsOffered.map(s => <SkillBadge key={s} skill={s} />) : <span className="text-[#666666]">None</span>}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111111] mb-3">Learning</h4>
                      <div className="flex flex-wrap gap-2">
                        {user?.skillsWanted?.length ? user.skillsWanted.map(s => <SkillBadge key={s} skill={s} />) : <span className="text-[#666666]">None</span>}
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </div>
          
          <div className="md:col-span-4 pl-0 md:pl-10 border-t md:border-t-0 md:border-l border-[#E5E5E5] pt-10 md:pt-0">
             <div className="bg-[#111111] text-white rounded-[24px] p-6 text-center">
               <h4 className="text-5xl font-['Manrope'] font-bold mb-1">{user?.rating?.toFixed(1) || '0.0'}</h4>
               <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest">Avg Rating</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

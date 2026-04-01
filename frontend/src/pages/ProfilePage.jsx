import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Star, Edit2, X, Save } from 'lucide-react';
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
      toast.success('Saved');
      setEditing(false);
    } catch {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your identity and learning goals</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Header Block */}
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-slate-800">
            <div className="h-20 w-20 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-semibold shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-100">{user?.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{user?.branch} · {user?.year}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-slate-300">{user?.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-xs text-slate-600 ml-1">avg rating</span>
              </div>
            </div>
            <Button
              variant={editing ? "secondary" : "outline"}
              size="sm"
              onClick={() => setEditing(!editing)}
              className="shrink-0"
            >
              {editing ? <><X className="h-3.5 w-3.5" /> Cancel</> : <><Edit2 className="h-3.5 w-3.5" /> Edit Profile</>}
            </Button>
          </div>

          <div className="p-6 sm:p-8">
            {editing ? (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4 max-w-xl">
                <Input label="Name" name="name" value={form.name} onChange={handleChange} />
                <div>
                  <label className="block text-xs font-medium text-slate-400 tracking-wide mb-1.5">
                    About <span className="text-slate-600 font-normal">({form.about.length}/100)</span>
                  </label>
                  <textarea
                    name="about" value={form.about}
                    onChange={e => setForm(p=>({...p, about: e.target.value.slice(0,100)}))}
                    rows={3}
                    className="w-full text-sm p-3 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Short bio..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} />
                  <Input label="Year" name="year" value={form.year} onChange={handleChange} />
                </div>
                <div className="border-t border-slate-800 my-4 pt-4 space-y-4">
                  <Input label="Skills you offer" name="skillsOffered" value={form.skillsOffered} onChange={handleChange} hint="Comma separated" />
                  <Input label="Skills you want" name="skillsWanted" value={form.skillsWanted} onChange={handleChange} hint="Comma separated" />
                </div>
                <div className="border-t border-slate-800 my-4 pt-4">
                  <Input label="Change Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={save} isLoading={loading} className="w-24">Save</Button>
                  <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">About</h3>
                  {user?.about ? (
                    <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">{user.about}</p>
                  ) : (
                    <p className="text-sm text-slate-600 italic">No bio provided.</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3">Teaching</h3>
                    <div className="flex flex-wrap gap-2">
                      {user?.skillsOffered?.length > 0 
                        ? user.skillsOffered.map(s => <SkillBadge key={s} skill={s} type="offered" />)
                        : <span className="text-xs text-slate-600">None listed</span>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-3">Learning</h3>
                    <div className="flex flex-wrap gap-2">
                      {user?.skillsWanted?.length > 0
                        ? user.skillsWanted.map(s => <SkillBadge key={s} skill={s} type="wanted" />)
                        : <span className="text-xs text-slate-600">None listed</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

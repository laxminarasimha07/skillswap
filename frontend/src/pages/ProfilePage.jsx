import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Star, Edit2, X, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    about: user?.about || '',
    branch: user?.branch || '',
    year: user?.year || '',
    skillsOffered: user?.skillsOffered?.join(', ') || '',
    skillsWanted: user?.skillsWanted?.join(', ') || '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatePayload = {
        name: formData.name,
        about: (formData.about || '').slice(0, 100),
        branch: formData.branch,
        year: formData.year,
        skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(s => s),
        skillsWanted: formData.skillsWanted.split(',').map(s => s.trim()).filter(s => s),
      };

      if (formData.password && formData.password.trim().length > 0) {
        await userApi.updatePassword({ password: formData.password });
        setFormData(prev => ({ ...prev, password: '' }));
      }

      const updated = await userApi.updateProfile(updatePayload);
      login(localStorage.getItem('token'), updated);
      toast.success('Profile updated!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Account</span>
          </div>
          <h1 className="text-2xl font-bold text-[#E5E7EB]" style={{ fontFamily: 'Poppins, sans-serif' }}>My Profile</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden"
        >
          {/* Banner */}
          <div className="h-28 bg-gradient-to-r from-purple-600/30 via-cyan-500/20 to-emerald-500/20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 opacity-10" />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar + Edit Button row */}
            <div className="flex justify-between items-end -mt-10 mb-6">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-purple-500/20 border-4 border-[#111827]">
                {initials}
              </div>
              <Button
                variant={isEditing ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <><X className="h-3.5 w-3.5" /> Cancel</> : <><Edit2 className="h-3.5 w-3.5" /> Edit Profile</>}
              </Button>
            </div>

            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">About <span className="text-[#4B5563]">(max 100 chars)</span></label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value.slice(0, 100) }))}
                    maxLength={100}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1F2937] text-[#E5E7EB] placeholder-[#4B5563] text-sm focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Write a short intro about yourself..."
                  />
                  <p className="text-right text-xs text-[#4B5563] mt-1">{(formData.about || '').length}/100</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Branch" name="branch" value={formData.branch} onChange={handleInputChange} />
                  <Input label="Year" name="year" value={formData.year} onChange={handleInputChange} />
                </div>
                <Input label="Skills You Offer (comma-separated)" name="skillsOffered" value={formData.skillsOffered} onChange={handleInputChange} placeholder="Java, Python, UI Design" />
                <Input label="Skills You Want (comma-separated)" name="skillsWanted" value={formData.skillsWanted} onChange={handleInputChange} placeholder="React, AWS, Figma" />
                <Input label="New Password (Optional)" type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Leave blank to keep current password" />

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} isLoading={isLoading} className="flex-1">
                    <Save className="h-3.5 w-3.5" /> Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Name & details */}
                <div>
                  <h2 className="text-xl font-bold text-[#E5E7EB]" style={{ fontFamily: 'Poppins, sans-serif' }}>{user?.name}</h2>
                  <p className="text-[#6B7280] text-sm mt-0.5">{user?.branch} · {user?.year}</p>
                  {user?.about ? (
                    <p className="mt-3 text-[#9CA3AF] text-sm bg-[#0D1320] border border-[#1F2937] rounded-xl p-4 leading-relaxed">
                      {user.about}
                    </p>
                  ) : (
                    <p className="mt-3 text-[#4B5563] text-sm italic">No "About" yet — click Edit Profile to add one.</p>
                  )}
                </div>

                {/* Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-1.5 w-4 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                      <h3 className="text-[#E5E7EB] text-sm font-semibold">Skills I Offer</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user?.skillsOffered?.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-1.5 w-4 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
                      <h3 className="text-[#E5E7EB] text-sm font-semibold">Skills I Want</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user?.skillsWanted?.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-[#E5E7EB] font-bold">{user?.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <span className="text-[#4B5563] text-xs">Rating</span>
                    </div>
                  </div>
                  <p className="text-[#4B5563] text-xs">
                    Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;

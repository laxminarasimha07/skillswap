import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../api/userApi';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { connectionApi } from '../api/connectionApi';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    about: user?.about || '',
    branch: user?.branch || '',
    year: user?.year || '',
    skillsOffered: user?.skillsOffered?.join(', ') || '',
    skillsWanted: user?.skillsWanted?.join(', ') || '',
  });

  useEffect(() => {
    const loadConnections = async () => {
      try {
        if (!user) return;
        const conns = await connectionApi.getConnections();
        const accepted = conns.filter((c) => c.status === 'ACCEPTED');
        const peerIds = [
          ...new Set(accepted.map((c) => (c.senderId === user.id ? c.receiverId : c.senderId))),
        ].filter(Boolean);
        const peers = await Promise.all(peerIds.map((id) => userApi.getUserById(id).catch(() => null)));
        setConnectedUsers(peers.filter(Boolean));
      } catch (e) {
        console.error('Failed to load connected users', e);
      }
    };
    loadConnections();
  }, [user]);
  
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
      const updated = await userApi.updateProfile(updatePayload);
      login(localStorage.getItem('token'), updated);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header/Banner placeholder */}
        <div className="h-32 bg-indigo-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="bg-white p-1 rounded-full border-4 border-white shadow-lg">
              <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold uppercase">
                {user?.name?.[0]}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About (max 100 characters)</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, about: e.target.value.slice(0, 100) }))
                  }
                  maxLength={100}
                  className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Write a short intro about yourself..."
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {(formData.about || '').length}/100
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                />
                <Input
                  label="Year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                />
              </div>
              <Input
                label="Skills You Offer (comma-separated)"
                name="skillsOffered"
                value={formData.skillsOffered}
                onChange={handleInputChange}
                placeholder="Java, Python, UI Design"
              />
              <Input
                label="Skills You Want (comma-separated)"
                name="skillsWanted"
                value={formData.skillsWanted}
                onChange={handleInputChange}
                placeholder="React, AWS, Figma"
              />
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSave} 
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500 font-medium">{user?.branch} • {user?.year}</p>
                {user?.about ? (
                  <p className="mt-3 text-gray-700 bg-gray-50 border border-gray-100 rounded-xl p-4">
                    {user.about}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-gray-400 italic">
                    No “About” yet. Click “Edit Profile” to add a short intro.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-1.5 h-6 bg-green-500 rounded-full mr-2"></span>
                    Skills I Offer
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user?.skillsOffered?.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full mr-2"></span>
                    Skills I Want
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user?.skillsWanted?.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Connected people</h3>
                {connectedUsers.length === 0 ? (
                  <p className="text-sm text-gray-500">No connections yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {connectedUsers.map((u) => (
                      <span
                        key={u.id}
                        className="px-3 py-1 bg-gray-50 text-gray-800 rounded-full text-sm font-medium border border-gray-100"
                        title={u.about || ''}
                      >
                        {u.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900">{user?.rating || '0.0'}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Rating</span>
                  </div>
                  <div className="h-8 w-px bg-gray-100"></div>
                  <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900">{connectedUsers.length}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Connections</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

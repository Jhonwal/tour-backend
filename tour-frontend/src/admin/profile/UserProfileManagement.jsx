import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  User as UserIcon, 
  Lock as LockIcon, 
  Camera as CameraIcon, 
  Save as SaveIcon,
  Mail as MailIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Edit as EditIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import Loading from '@/services/Loading';

const UserProfileManagement = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profile_picture: '',
    facebook: '',
    instagram: '',
    bio: '',
    email_verified_at: null,
    created_at: null,
    updated_at: null
  });
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const api = useApi();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        const response = await api.get('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = response.data;
        console.error(userData);
        setUser(userData);
        setProfileData(userData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });
  
    if (profileImage) {
      formData.append('profile_picture', profileImage);
    }
  
    try {
      const token = getToken();
      await api.post('/api/user/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      console.error(err);
      if (err.response) {
        console.error('Backend Error:', err.response.data);
        toast.error(`Failed to update profile: ${err.response.data.message}`);
      } else {
        toast.error('Failed to update profile');
      }
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const token = getToken();
      await api.post('/api/user/security', securityData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Security settings updated successfully');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error('Failed to update security settings');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setProfileData(prev => ({
      ...prev, 
      profile_picture: URL.createObjectURL(file)
    }));
  };

  if (loading) return (
      <Loading/>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <ToastContainer position="top-right" theme="colored" className="text-sm" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Overview Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <UserIcon className="mr-3" /> User Profile
            </h2>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => setEditMode(!editMode)}
            >
              <EditIcon className="mr-2" /> {editMode ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {!editMode ? (
            <CardContent className="p-8 grid md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center md:col-span-2 mb-4">
                <img 
                  src={profileData.profile_picture} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-lg"
                />
                <h3 className="mt-4 text-2xl font-semibold text-gray-800">{profileData.name}</h3>
                <p className="text-gray-500">{profileData.email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <FacebookIcon className="text-orange-500" />
                  <span>{profileData.facebook || 'No Facebook linked'}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <InstagramIcon className="text-orange-500" />
                  <span>{profileData.instagram || 'No Instagram linked'}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-gray-600">Registered:</span>
                  <p>{new Date(profileData.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Email Verified:</span>
                  <p>
                    {profileData.email_verified_at 
                      ? new Date(profileData.email_verified_at).toLocaleDateString() 
                      : 'Not Verified'}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-600 mb-2">Bio</h4>
                <p className="text-gray-700 bg-gray-100 p-4 rounded-lg">
                  {profileData.bio || 'No bio provided'}
                </p>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-8">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img 
                      src={profileData.profile_picture || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 shadow-lg"
                    />
                    <input 
                      type="file" 
                      id="profile-image" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    <label 
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-lg cursor-pointer"
                    >
                      <CameraIcon size={20} />
                    </label>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="border-orange-300 focus:border-orange-500"
                  />
                  <Input
                    placeholder="Email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="border-orange-300 focus:border-orange-500"
                  />
                  <Input
                    placeholder="Facebook Link"
                    value={profileData.facebook || ''}
                    onChange={(e) => setProfileData({...profileData, facebook: e.target.value})}
                    className="border-orange-300 focus:border-orange-500"
                  />
                  <Input
                    placeholder="Instagram Link"
                    value={profileData.instagram || ''}
                    onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <Textarea
                  placeholder="Bio"
                  value={profileData.bio || ''}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="border-orange-300 focus:border-orange-500"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  <SaveIcon className="mr-2" /> Update Profile
                </Button>
              </form>
            </CardContent>
          )}
        </div>

        {/* Security Settings Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <LockIcon className="mr-3" /> Security Settings
            </h2>
          </div>
          <CardContent className="p-8">
            <form onSubmit={handleSecurityUpdate} className="space-y-6">
              <Input
                type="password"
                placeholder="Current Password"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                className="border-orange-300 focus:border-orange-500"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                className="border-orange-300 focus:border-orange-500"
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                className="border-orange-300 focus:border-orange-500"
              />
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              >
                <LockIcon className="mr-2" /> Update Security
              </Button>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default UserProfileManagement;
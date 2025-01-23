import React, { useState } from 'react';
import { Trash2, Lock, User, Facebook, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    profile_picture: '/api/placeholder/150/150',
    facebook: '',
    instagram: '',
    bio: '',
  });

  const [activeSection, setActiveSection] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null); // State for uploaded image

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result); // Set the uploaded image URL
        setUser({ ...user, profile_picture: reader.result }); // Update the user state
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    toast.success('Password updated successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleDeleteAccount = () => {
    toast.error('Account deleted successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setShowDeleteConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Toast Container */}
      <ToastContainer />

      {/* Navigation Tabs */}
      <Tabs 
        value={activeSection} 
        onValueChange={setActiveSection}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-orange-50">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <Card className="border-none shadow-sm bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Profile Information</CardTitle>
            <CardDescription className="text-orange-700">
              Update your personal details and social links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 border-2 border-orange-300">
                  <AvatarImage src={uploadedImage || user.profile_picture} />
                  <AvatarFallback className="bg-orange-100 text-orange-900">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-picture"
                    className="cursor-pointer border border-orange-300 text-orange-900 hover:bg-orange-100 px-4 py-2 rounded-md"
                  >
                    Upload New Photo
                  </label>
                  <p className="text-sm text-orange-600 mt-2">
                    Recommended size: 150x150px
                  </p>
                </div>
              </div>

              {/* Name and Email */}
              <div className="space-y-4">
                <Input
                  placeholder="Name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="border-orange-300 focus:ring-orange-500"
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="border-orange-300 focus:ring-orange-500"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Facebook className="h-5 w-5 text-orange-500" />
                  <Input
                    placeholder="Facebook URL"
                    value={user.facebook}
                    onChange={(e) => setUser({ ...user, facebook: e.target.value })}
                    className="border-orange-300 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Instagram className="h-5 w-5 text-orange-500" />
                  <Input
                    placeholder="Instagram URL"
                    value={user.instagram}
                    onChange={(e) => setUser({ ...user, instagram: e.target.value })}
                    className="border-orange-300 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <Textarea
                placeholder="Tell us about yourself..."
                value={user.bio}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                rows={4}
                className="border-orange-300 focus:ring-orange-500"
              />

              {/* Save Button */}
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
              >
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Security Section */}
      {activeSection === 'security' && (
        <Card className="border-none shadow-sm bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Security Settings</CardTitle>
            <CardDescription className="text-orange-700">
              Manage your password and account security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Update Form */}
            <form onSubmit={handleSecurityUpdate} className="space-y-4">
              <Input
                type="password"
                placeholder="Current Password"
                className="border-orange-300 focus:ring-orange-500"
              />
              <Input
                type="password"
                placeholder="New Password"
                className="border-orange-300 focus:ring-orange-500"
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                className="border-orange-300 focus:ring-orange-500"
              />
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
              >
                Update Password
              </Button>
            </form>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Danger Zone</h3>
              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-orange-700">
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Yes, Delete Account
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="border-orange-300 text-orange-900 hover:bg-orange-100"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
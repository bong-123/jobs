'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/header';

interface User {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  contact?: string;
  address?: string;
  gender?: string;
  password?: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    contact: '',
    address: '',
    gender: '',
    password: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    
    // Save profile data to localStorage
    localStorage.setItem('user', JSON.stringify(user));
    alert('Profile updated!');
  
    // Handle password change
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError('All password fields must be filled to change your password.');
        return;
      }
  
      if (newPassword !== confirmPassword) {
        setError('New password and confirm password do not match.');
        return;
      }
  
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters long.');
        return;
      }
  
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No authentication token found. Please log in again.');
          return;
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/change-password/`;
        console.log("Calling API:", apiUrl);
        console.log("Request payload:", { current_password: currentPassword, new_password: newPassword });
        console.log("Auth Token:", token);

        await axios.put(
          apiUrl,
          { current_password: currentPassword, new_password: newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err: unknown) {
        let errorMsg = 'Failed to change password: ';
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err
        ) {
          // @ts-expect-error: axios error shape
          errorMsg += err.response?.data?.message || err.response?.data?.error || 'Unknown error';
        } else if (err instanceof Error) {
          errorMsg += err.message;
        }
        console.error("Error details:", err);
        setError(errorMsg);
      }
    }
  };
  return (
    <>
      <Header />
      <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 to-pink-300 text-black px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Profile</h1>
            <form className="space-y-4">
              {renderInput('First Name', 'first_name', user.first_name, handleChange)}
              {renderInput('Middle Name', 'middle_name', user.middle_name, handleChange)}
              {renderInput('Last Name', 'last_name', user.last_name, handleChange)}
              {renderInput('Username', 'username', user.username, handleChange)}
              {renderInput('Email', 'email', user.email, handleChange, 'email')}
              {renderInput('Contact', 'contact', user.contact, handleChange)}
              {renderInput('Address', 'address', user.address, handleChange)}
              {renderSelect('Gender', 'gender', user.gender, handleChange)}
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 text-center md:text-left">Change Password</h2>
            <div className="space-y-4">
              {renderPasswordInput('Current Password', currentPassword, setCurrentPassword)}
              {renderPasswordInput('New Password', newPassword, setNewPassword)}
              {renderPasswordInput('Confirm New Password', confirmPassword, setConfirmPassword)}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="button"
                onClick={handleSave}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const renderInput = (
  label: string,
  name: keyof User,
  value: string | undefined,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  type: string = 'text'
) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

const renderSelect = (
  label: string,
  name: keyof User,
  value: string | undefined,
  onChange: React.ChangeEventHandler<HTMLSelectElement>
) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <select
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>
);

const renderPasswordInput = (
  label: string,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="password"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full border rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>
);

export default ProfilePage;

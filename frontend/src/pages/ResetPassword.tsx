import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/confirm-reset-password`, {
        password, 
        token
      });

      setMessage('Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#C5C5C5' }}>
      <div className="max-w-md w-full space-y-8 p-10 rounded-2xl shadow-xl" style={{ backgroundColor: 'white' }}>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#4D6A6D' }}>
          Reset Password
        </h2>
        
        {message && (
          <div className="p-4 rounded-xl text-center mb-6" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
            {message}
          </div>
        )}
        
        {error && (
          <div className="p-4 rounded-xl text-center mb-6" style={{ backgroundColor: '#ffebee', color: '#c62828' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#4D6A6D' }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
              style={{ 
                border: '1px solid #829191',
                backgroundColor: 'white'
              }}
              required
              minLength={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#4D6A6D' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
              style={{ 
                border: '1px solid #829191',
                backgroundColor: 'white'
              }}
              required
              minLength={4}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium mt-8 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            style={{ 
              backgroundColor: '#4D6A6D',
              color: 'white'
            }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

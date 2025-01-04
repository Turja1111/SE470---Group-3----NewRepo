import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Forum from './pages/Forum'
import Report from './pages/Report'
import ResetPassword from './pages/ResetPassword'

import axios from 'axios'


const Home = () => {

  const [quote, setQuote] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://api.adviceslip.com/advice');
        setQuote(response.data.slip.advice);
        const data = response.data;
        console.log('Fetched quote:', data);

      } catch (error) {
        console.log('Error fetching quote:', error);
        setQuote({
          content: 'Welcome to a peaceful space for meaningful connections',
          author: 'SoulSpeak'
        });
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8 text-center">
      <h1 className="text-4xl font-semibold text-slate-700 mb-6">Welcome to SoulSpeak</h1>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-xl text-slate-600 italic mb-4">"{quote}"</p>
      </div>
    </div>
  );
};
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await axios.get("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login';
  }

  return (
    <Router>
      <nav className="bg-gradient-to-r from-[#4D6A6D] to-[#4C5B61] p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <Link to="/" className="text-white text-2xl font-semibold hover:text-sage-100 transition-all duration-300">
              SoulSpeak ✨
            </Link>
          </div>
          <div className="space-x-8">

            {!user ? (
              <>
                <Link to="/login" className="text-white hover:text-sage-100 transition-all duration-300">
                  <span className="hover:-translate-y-0.5 inline-block transform">Login</span>
                </Link>
                <Link to="/signup" className="text-white hover:text-sage-100 transition-all duration-300">
                  <span className="hover:-translate-y-0.5 inline-block transform">Sign Up</span>
                </Link>

              </>
            ) : (
              <>
                {user && !user.isCompanion && (
                <Link to="/become-a-companion" className="text-white hover:text-sage-100 transition-all duration-300">
                  <span className="hover:-translate-y-0.5 inline-block transform">Become A Companion</span>
                </Link>
                )}
                <Link to="/chat" className="text-white hover:text-sage-100 transition-all duration-300">
                  <span className="hover:-translate-y-0.5 inline-block transform">Chat</span>
                </Link>
                <Link to="/forum" className="text-white hover:text-sage-100 transition-all duration-300">
                  <span className="hover:-translate-y-0.5 inline-block transform">Forum</span>
                </Link>
                <Link to="/report" className="text-white hover:text-sage-100 transition-all duration-300">
                  <span className="hover:-translate-y-0.5 inline-block transform">Report</span>
                </Link>
                <Link to="/profile" className="text-white hover:text-sage-100 transition-all duration-300">
                  <span className="hover:-translate-y-0.5 inline-block transform">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-sage-100 transition-all duration-300"
                >
                  <span className="hover:-translate-y-0.5 inline-block transform">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>


      <div className="bg-gradient-to-br from-sage-50 via-slate-50 to-sage-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/report" element={<Report />} />

        </Routes>
      </div>
    </Router>
  )
}



export default App

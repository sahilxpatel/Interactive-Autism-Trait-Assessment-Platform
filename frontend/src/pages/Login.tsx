import React, { useState } from 'react';
import { AuthForm } from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../components/firebase';

export function Login() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, emailForReset);
      setResetSent(true);
    } catch (err) {
      console.error('Password reset error:', err);
      alert('Failed to send reset email. Please check the email and try again.');
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetSent(false);
    setEmailForReset('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl"
      >
        {/* Left Panel - Visual Appeal */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white w-full md:w-1/2 p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white"></div>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              {showForgotPassword ? 'Reset Password' : 'Welcome Back!'}
            </h2>
            <p className="text-lg mb-6">
              {showForgotPassword 
                ? "Enter your email to receive a password reset link"
                : "Sign in to continue your autism learning journey"}
            </p>
            <div className="w-24 h-1 bg-blue-300 mx-auto mb-8"></div>
            <p className="text-blue-100 text-sm">
              "Education is the most powerful weapon which you can use to change the world."
            </p>
          </motion.div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {showForgotPassword ? (
              <div className="space-y-6">
                {resetSent ? (
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Password reset email sent!
                    </h3>
                    <p className="text-sm text-gray-500">
                      We've sent instructions to {emailForReset}. Check your email and follow the link to reset your password.
                    </p>
                    <button
                      onClick={handleBackToLogin}
                      className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back to Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={emailForReset}
                          onChange={(e) => setEmailForReset(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Send Reset Link
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-2 text-center">Login</h3>
                <p className="text-gray-500 text-center mb-8">Enter your credentials to access your account</p>
                
                <AuthForm type="login" />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <button 
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                
                {/* Demo button omitted to avoid mixing flows; AuthForm handles auth directly. */}
                
                <p className="text-sm text-gray-600 text-center mt-6">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
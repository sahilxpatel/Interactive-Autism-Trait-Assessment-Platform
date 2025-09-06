// React import not needed directly due to JSX runtime
import { AuthForm } from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SignUp() {
  const navigate = useNavigate();
  const signupSuccess = false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl"
      >
        {/* Left Panel - Visual Appeal */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-blue-700 text-white w-full md:w-1/2 p-10 relative overflow-hidden">
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
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-6">Create your account to access personalized learning tools</p>
            <div className="w-24 h-1 bg-indigo-300 mx-auto mb-8"></div>
            <ul className="text-left text-blue-100 space-y-2 text-sm">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Personalized learning paths
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Progress tracking
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Expert-designed activities
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {signupSuccess ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-8 w-8 text-green-600"
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
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h3>
                <p className="text-gray-600 mb-6">
                  Your account has been successfully created. You can now access all features.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue to Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create Account</h3>
                <p className="text-gray-500 text-center mb-8">Get started with your free account</p>
                
                <AuthForm type="signup" />
                
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the <button className="text-indigo-600 hover:underline">Terms of Service</button> and <button className="text-indigo-600 hover:underline">Privacy Policy</button>
                  </label>
                </div>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">Or sign up with</span>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mb-6">
                  {['Google', 'Facebook', 'GitHub'].map((social, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                    >
                      {social.charAt(0)}
                    </motion.button>
                  ))}
                </div>
                
                <p className="text-sm text-gray-600 text-center">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Log in
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
// React import not required with new JSX runtime
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Test } from './pages/Test';
import EmotionGame from './pages/games/EmotionGame';
import { ShapeGame } from './pages/games/ShapeGame';
import ColorGame from './pages/games/ColorGame';
import GestureGame from './pages/games/GestureGame';
import { LogIn, UserPlus } from 'lucide-react';
import { Profile } from './pages/Profile';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function NavAuthButtons() {
  const { user } = useAuth();
  if (user) {
    return (
      <div className="flex space-x-4">
        <Link to="/profile" className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900">
          Profile
        </Link>
      </div>
    );
  }
  return (
    <div className="flex space-x-4">
      <Link
        to="/login"
        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
      >
        <LogIn className="w-5 h-5 mr-2" />
        Login
      </Link>
      <Link
        to="/signup"
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Sign Up
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                🧩 ASD Assessment Platform
              </Link>
              <NavAuthButtons />
            </div>
          </div>
        </nav>

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/test" element={<Test />} />
            <Route path="/emotion-game" element={<EmotionGame />} />
            <Route path="/shape-game" element={<ShapeGame />} />
            <Route path="/color-game" element={<ColorGame />} />
            <Route path="/gesture-game" element={<GestureGame />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

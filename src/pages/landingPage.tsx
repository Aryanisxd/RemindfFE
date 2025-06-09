import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import BackgroundPattern from '../pages/BackgroundPattern';

const LandingPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-black text-white' 
        : 'bg-white text-black'
    }`}>
      <BackgroundPattern />
      
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 z-20 p-3 rounded-full transition-all duration-300 ${
          isDarkMode
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-black/10 hover:bg-black/20 text-black'
        } backdrop-blur-sm border ${
          isDarkMode ? 'border-white/20' : 'border-black/20'
        }`}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo/Brand */}
        <div className="mb-12 animate-fade-in">
          <h1 className={`text-8xl md:text-9xl font-bold transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-black'
          } drop-shadow-2xl`}>
            Remind
          </h1>
          <p className={`mt-4 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Brains fail. Bookmarking don't. At least not with Remind .Who needs memory when you've got me !!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 animate-slide-up">
          {/* GitHub Button */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative px-8 py-4 backdrop-blur-sm border rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDarkMode
                ? 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:shadow-white/20'
                : 'bg-black/10 border-black/30 text-black hover:bg-black/20 hover:border-black/50 hover:shadow-black/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span>Repo</span>
            </div>
          </a>

          {/* Get Started Button */}
          <Link
            to="/signin"
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isDarkMode
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-black text-white hover:bg-gray-900'
            } hover:scale-[1.02]`}
          >
            Get Started
          </Link>
        </div>

        {/* Subtitle */}
        <p className={`mt-12 text-lg animate-fade-in-delayed transition-colors duration-500 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Leave WTF and Join WTB "{"Where to bookmark "}"
            
        </p>
        <p className={`mt-12 text-sm animate-fade-in-delayed transition-colors duration-500 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          V2 is coming soon! beta testing going on ... 
            
        </p>

      </div>
    </div>
  );
};

export default LandingPage;
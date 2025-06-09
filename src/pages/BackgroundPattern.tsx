import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

const BackgroundPattern: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-slow transition-colors duration-500 ${
        isDarkMode ? 'bg-white' : 'bg-black'
      }`} />
      <div className={`absolute top-3/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse-slow animation-delay-1000 transition-colors duration-500 ${
        isDarkMode ? 'bg-white' : 'bg-black/3'
      }`} />
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl animate-pulse-slow animation-delay-2000 transition-colors duration-500 ${
        isDarkMode ? 'bg-black' : 'bg-white'
      }`} />
      
      {/* Geometric Shapes */}
      <div className={`absolute top-20 left-20 w-32 h-32 border rounded-3xl rotate-45 animate-float transition-colors duration-500 ${
        isDarkMode ? 'border-white' : 'border-black'
      }`} />
      <div className={`absolute bottom-32 right-32 w-24 h-24 border rounded-2xl rotate-12 animate-float animation-delay-1000 transition-colors duration-500 ${
        isDarkMode ? 'border-white' : 'border-black/8'
      }`} />
      <div className={`absolute top-1/2 right-20 w-16 h-16 border rounded-xl -rotate-12 animate-float animation-delay-2000 transition-colors duration-500 ${
        isDarkMode ? 'border-black' : 'border-white'
      }`} />
      
      {/* Subtle Grid Pattern */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDarkMode ? 'opacity-[0.02]' : 'opacity-[0.03]'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Radial Gradient Overlay */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-gradient-radial from-transparent via-transparent to-black/20' 
          : 'bg-gradient-radial from-transparent via-transparent to-white/20'
      }`} />
    </div>
  );
};

export default BackgroundPattern;
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const location = useLocation();

  // Create callback ref for intersection observer
  const heroRef = useCallback(node => {
    if (node !== null) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // When hero is less than 20% visible, consider it not visible
          setIsHeroVisible(entry.isIntersecting && entry.intersectionRatio > 0.2);
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: [0.2, 0.3, 0.4, 0.5, 0.6]
        }
      );
      
      observer.observe(node);
      
      // Clean up observer on component unmount
      return () => observer.disconnect();
    }
  }, []);

  // Add scroll event listener to track scrolling within the hero section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add hero ref to the global window object so it can be accessed from the home component
  useEffect(() => {
    window.heroRef = heroRef;
    
    return () => {
      delete window.heroRef;
    };
  }, [heroRef]);

  // Function to determine if a link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <header className={`sticky top-0 z-[999] transition-all duration-300 ${
      !isHeroVisible 
        ? 'bg-[#560C06]/80 backdrop-blur-md shadow-lg' 
        : isScrolled 
          ? 'bg-gradient-to-r from-gray-900/70 to-gray-700/70 backdrop-blur-sm' 
          : 'bg-gradient-to-r from-gray-900/90 to-gray-700/90'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="REDBRICK" className="h-12" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`${isActive('/') ? 'text-red-500' : 'text-white'} hover:text-red-400 font-medium`}>
            Home
          </Link>
          
          <Link to="/building-page" className={`${isActive('/building-page') ? 'text-red-500' : 'text-white'} hover:text-red-400 font-medium`}>
            Services
          </Link>
          
          <Link to="/team" className={`${isActive('/team') ? 'text-red-500' : 'text-white'} hover:text-red-400 font-medium`}>
            Our Team
          </Link>
          
          <Link to="/contact" className={`${isActive('/contact') ? 'text-red-500' : 'text-white'} hover:text-red-400 font-medium`}>
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#560C06]/90 backdrop-blur-sm py-3 px-4 shadow-inner">
          <Link to="/" className={`block py-2 ${isActive('/') ? 'text-red-500' : 'text-white'} hover:text-red-400 font-medium`}>
            Home
          </Link>
          
          <Link to="/building-page" className={`block py-2 ${isActive('/building-page') ? 'text-red-500' : 'text-white'} hover:text-red-400 font-medium`}>
            Services
          </Link>
          
          <Link to="/team" className={`block py-2 ${isActive('/team') ? 'text-red-500' : 'text-white'} hover:text-red-400 font-medium`}>
            Our Team
          </Link>
          
          <Link to="/contact" className={`block py-2 ${isActive('/contact') ? 'text-red-500' : 'text-white'} hover:text-red-400 font-medium`}>
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header; 
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';

const ParticleBallLoader = ({ isActive = false, size = 20 }) => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const coreRef = useRef(null);
  const ringsRef = useRef([]);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particles = particlesRef.current;
    const core = coreRef.current;
    const rings = ringsRef.current;
    
    if (isActive) {
      // Create master timeline
      const masterTl = gsap.timeline({ repeat: -1 });
      
        // Subtle core with gentle magnetic field effect
        const coreTl = gsap.timeline({ repeat: -1 });
        coreTl.to(core, {
          scale: 1.2,
          opacity: 0.9,
          boxShadow: isDarkMode 
            ? '0 0 12px rgba(59, 130, 246, 0.7), 0 0 24px rgba(147, 51, 234, 0.5)' 
            : '0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(147, 51, 234, 0.4)',
          duration: 1.2,
          ease: "power2.inOut"
        })
        .to(core, {
          scale: 0.8,
          opacity: 0.6,
          boxShadow: isDarkMode 
            ? '0 0 6px rgba(59, 130, 246, 0.4), 0 0 12px rgba(147, 51, 234, 0.3)' 
            : '0 0 4px rgba(59, 130, 246, 0.3), 0 0 8px rgba(147, 51, 234, 0.2)',
          duration: 1.0,
          ease: "power2.inOut"
        });      masterTl.add(coreTl, 0);
      
      // Particles complex orbital dance
      particles.forEach((particle, index) => {
        const angle = (index / particles.length) * Math.PI * 2;
        const radius = size * 0.7;
        const orbitRadius = size * (0.9 + Math.random() * 0.3);
        
        // Set initial position with slight randomness
        gsap.set(particle, {
          x: Math.cos(angle) * orbitRadius + (Math.random() - 0.5) * 4,
          y: Math.sin(angle) * orbitRadius + (Math.random() - 0.5) * 4,
          scale: 0.3 + Math.random() * 0.4,
        });
        
        const particleTl = gsap.timeline({ repeat: -1 });
        
        // Multi-layered orbital motion
        particleTl.to(particle, {
          rotation: 360 + (index % 2 === 0 ? 120 : -120),
          duration: 2 + Math.random() * 1.5,
          ease: "none",
          transformOrigin: `${-Math.cos(angle) * orbitRadius}px ${-Math.sin(angle) * orbitRadius}px`
        }, 0)
        
        // Particle pulsing with individual rhythm
        .to(particle, {
          scale: 0.8 + Math.random() * 0.4,
          opacity: 0.4 + Math.random() * 0.6,
          duration: 0.5 + Math.random() * 0.8,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut",
          delay: Math.random() * 0.8
        }, 0)
        
        // Radial pulsing outward
        .to(particle, {
          x: Math.cos(angle) * (orbitRadius * 1.3),
          y: Math.sin(angle) * (orbitRadius * 1.3),
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut",
          delay: Math.random() * 1
        }, 0);
        
        masterTl.add(particleTl, 0);
      });
      
      // Container multi-axis rotation
      const containerTl = gsap.timeline({ repeat: -1 });
      containerTl.to(container, {
        rotation: 360,
        duration: 6,
        ease: "none"
      });
      
      masterTl.add(containerTl, 0);
      
      // Energy rings pulsing
      rings.forEach((ring, index) => {
        if (ring) {
          const ringTl = gsap.timeline({ repeat: -1 });
          ringTl.fromTo(ring, 
            {
              scale: 0.5,
              opacity: 0.8,
              rotation: 0
            },
            {
              scale: 1.5 + index * 0.2,
              opacity: 0,
              rotation: index % 2 === 0 ? 180 : -180,
              duration: 2 + index * 0.3,
              ease: "power2.out",
              delay: index * 0.4
            }
          );
          masterTl.add(ringTl, 0);
        }
      });
      
      return () => {
        masterTl.kill();
      };
    } else {
      // Cleanup animations
      gsap.killTweensOf([container, core, ...particles, ...rings]);
      gsap.set([container, core, ...particles, ...rings], {
        clearProps: "all"
      });
    }
  }, [isActive, size, isDarkMode]);
  
  const particleCount = size < 12 ? 4 : 8; // Fewer particles for more subtle effect
  
  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: size * 2.5, height: size * 2.5 }}
    >
      {/* Core energy sphere */}
      <div
        ref={coreRef}
        className={`absolute ${size < 12 ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-300 via-purple-400 to-cyan-300' 
            : 'bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500'
        }`}
        style={{
          boxShadow: isDarkMode 
            ? size < 12 
              ? '0 0 8px rgba(59, 130, 246, 0.8), 0 0 16px rgba(147, 51, 234, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.3)'
              : '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(147, 51, 234, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)' 
            : size < 12
              ? '0 0 6px rgba(59, 130, 246, 0.6), 0 0 12px rgba(147, 51, 234, 0.4), inset 0 0 6px rgba(255, 255, 255, 0.4)'
              : '0 0 8px rgba(59, 130, 246, 0.6), 0 0 16px rgba(147, 51, 234, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.4)'
        }}
      />
      
      {/* Particles with varied colors */}
      {Array.from({ length: particleCount }, (_, index) => {
        const colorClass = index % 4 === 0 
          ? (isDarkMode ? 'bg-blue-400' : 'bg-blue-500')
          : index % 4 === 1
          ? (isDarkMode ? 'bg-purple-400' : 'bg-purple-500')
          : index % 4 === 2
          ? (isDarkMode ? 'bg-cyan-400' : 'bg-cyan-500')
          : (isDarkMode ? 'bg-pink-400' : 'bg-pink-500');
        
        return (
          <div
            key={index}
            ref={el => particlesRef.current[index] = el}
            className={`absolute ${size < 12 ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full ${colorClass}`}
            style={{
              boxShadow: size < 12 ? '0 0 3px currentColor, 0 0 6px currentColor' : '0 0 6px currentColor, 0 0 12px currentColor',
              filter: 'brightness(1.2)'
            }}
          />
        );
      })}
      
      {/* Multiple energy rings */}
      {Array.from({ length: size < 12 ? 2 : 4 }, (_, index) => (
        <div 
          key={`ring-${index}`}
          ref={el => ringsRef.current[index] = el}
          className={`absolute border-2 rounded-full ${
            index % 2 === 0 
              ? (isDarkMode ? 'border-blue-400/30' : 'border-blue-500/40')
              : (isDarkMode ? 'border-purple-400/30' : 'border-purple-500/40')
          }`}
          style={{ 
            width: size * (1.8 + index * 0.3), 
            height: size * (1.8 + index * 0.3),
            borderStyle: index % 2 === 0 ? 'solid' : 'dashed'
          }}
        />
      ))}
      
      {/* Ambient glow */}
      <div 
        className={`absolute rounded-full opacity-20 ${
          isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
        }`}
        style={{ 
          width: size * 3, 
          height: size * 3,
          filter: 'blur(15px)'
        }}
      />
    </div>
  );
};

export default ParticleBallLoader;

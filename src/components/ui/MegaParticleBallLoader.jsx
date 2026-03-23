import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../contexts/ThemeContext';

const MegaParticleBallLoader = ({ isActive = false, size = 60 }) => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const coreRef = useRef(null);
  const ringsRef = useRef([]);
  const orbitingElementsRef = useRef([]);
  const { isDarkMode } = useTheme();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const particles = particlesRef.current;
    const core = coreRef.current;
    const rings = ringsRef.current;
    const orbitingElements = orbitingElementsRef.current;
    
    if (isActive) {
      // Create master timeline with more complex animations
      const masterTl = gsap.timeline({ repeat: -1 });
      
      // Ultra-enhanced core with magnetic pulses
      const coreTl = gsap.timeline({ repeat: -1 });
      coreTl.to(core, {
        scale: 1.6,
        opacity: 1,
        boxShadow: isDarkMode 
          ? '0 0 40px rgba(59, 130, 246, 1), 0 0 80px rgba(147, 51, 234, 0.9), 0 0 120px rgba(6, 182, 212, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.4)' 
          : '0 0 30px rgba(59, 130, 246, 0.9), 0 0 60px rgba(147, 51, 234, 0.7), 0 0 90px rgba(6, 182, 212, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.5)',
        duration: 1.2,
        ease: "power3.inOut"
      })
      .to(core, {
        scale: 0.8,
        opacity: 0.8,
        boxShadow: isDarkMode 
          ? '0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(147, 51, 234, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2)' 
          : '0 0 10px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 51, 234, 0.3), inset 0 0 8px rgba(255, 255, 255, 0.3)',
        duration: 0.8,
        ease: "power3.inOut"
      });
      
      masterTl.add(coreTl, 0);
      
      // Enhanced particles with quantum field effects
      particles.forEach((particle, index) => {
        const angle = (index / particles.length) * Math.PI * 2;
        const orbitRadius = size * (0.8 + Math.random() * 0.4);
        const layerIndex = Math.floor(index / (particles.length / 3)); // 3 layers
        const layerRadius = size * (0.7 + layerIndex * 0.3);
        
        // Set initial position with layered approach
        gsap.set(particle, {
          x: Math.cos(angle) * layerRadius + (Math.random() - 0.5) * 6,
          y: Math.sin(angle) * layerRadius + (Math.random() - 0.5) * 6,
          scale: 0.4 + Math.random() * 0.6,
        });
        
        const particleTl = gsap.timeline({ repeat: -1 });
        
        // Multi-layer orbital dance with quantum tunneling effect
        particleTl.to(particle, {
          rotation: 360 + (layerIndex % 2 === 0 ? 180 : -180),
          duration: 2.5 + layerIndex * 0.5,
          ease: "none",
          transformOrigin: `${-Math.cos(angle) * layerRadius}px ${-Math.sin(angle) * layerRadius}px`
        }, 0)
        
        // Quantum pulsing with phase variations
        .to(particle, {
          scale: 1.2 + Math.random() * 0.6,
          opacity: 0.3 + Math.random() * 0.7,
          duration: 0.8 + Math.random() * 1.2,
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut",
          delay: Math.random() * 1.2
        }, 0)
        
        // Quantum field fluctuations
        .to(particle, {
          x: Math.cos(angle) * (layerRadius * 1.5),
          y: Math.sin(angle) * (layerRadius * 1.5),
          duration: 2 + Math.random(),
          yoyo: true,
          repeat: -1,
          ease: "power2.inOut",
          delay: Math.random() * 1.5
        }, 0)
        
        // Particle teleportation effect
        .to(particle, {
          opacity: 0,
          scale: 0.1,
          duration: 0.1,
          delay: 3 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          repeatDelay: 5 + Math.random() * 3,
          ease: "power2.inOut"
        }, 0);
        
        masterTl.add(particleTl, 0);
      });
      
      // Container multi-dimensional rotation
      const containerTl = gsap.timeline({ repeat: -1 });
      containerTl.to(container, {
        rotation: 360,
        duration: 8,
        ease: "none"
      });
      
      masterTl.add(containerTl, 0);
      
      // Enhanced energy rings with plasma effects
      rings.forEach((ring, index) => {
        if (ring) {
          const ringTl = gsap.timeline({ repeat: -1 });
          ringTl.fromTo(ring, 
            {
              scale: 0.3,
              opacity: 0.9,
              rotation: 0,
              borderWidth: '1px'
            },
            {
              scale: 2 + index * 0.4,
              opacity: 0,
              rotation: index % 2 === 0 ? 360 : -360,
              borderWidth: '3px',
              duration: 3 + index * 0.5,
              ease: "power2.out",
              delay: index * 0.6
            }
          );
          masterTl.add(ringTl, 0);
        }
      });
      
      // Orbiting code elements with gravitational effects
      orbitingElements.forEach((element, index) => {
        if (element) {
          const orbitTl = gsap.timeline({ repeat: -1 });
          const radius = size * (1.2 + index * 0.2);
          
          orbitTl.to(element, {
            rotation: 360,
            transformOrigin: `0 ${radius}px`,
            duration: 4 + index,
            ease: "none"
          }, 0)
          .to(element, {
            scale: 1.3,
            opacity: 1,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut",
            delay: index * 0.5
          }, 0);
          
          masterTl.add(orbitTl, 0);
        }
      });
      
      return () => {
        masterTl.kill();
      };
    } else {
      // Cleanup animations
      gsap.killTweensOf([container, core, ...particles, ...rings, ...orbitingElements]);
      gsap.set([container, core, ...particles, ...rings, ...orbitingElements], {
        clearProps: "all"
      });
    }
  }, [isActive, size, isDarkMode]);
  
  const particleCount = 24; // More particles for the mega version
  const codeSymbols = ['{ }', '< >', '[ ]', '( )', '/>', '{}', '</', '/>'];
  
  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: size * 3, height: size * 3 }}
    >
      {/* Ultra core energy sphere */}
      <div
        ref={coreRef}
        className={`absolute w-6 h-6 rounded-full ${
          isDarkMode 
            ? 'bg-gradient-radial from-blue-200 via-purple-300 to-cyan-200' 
            : 'bg-gradient-radial from-blue-400 via-purple-500 to-cyan-400'
        }`}
        style={{
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.8) 50%, rgba(6, 182, 212, 0.7) 100%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 1) 0%, rgba(147, 51, 234, 0.9) 50%, rgba(6, 182, 212, 0.8) 100%)',
          boxShadow: isDarkMode 
            ? '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(147, 51, 234, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.3)' 
            : '0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(147, 51, 234, 0.4), inset 0 0 12px rgba(255, 255, 255, 0.4)'
        }}
      />
      
      {/* Enhanced particles with quantum colors */}
      {Array.from({ length: particleCount }, (_, index) => {
        const colorClass = index % 6 === 0 
          ? (isDarkMode ? 'bg-blue-300' : 'bg-blue-500')
          : index % 6 === 1
          ? (isDarkMode ? 'bg-purple-300' : 'bg-purple-500')
          : index % 6 === 2
          ? (isDarkMode ? 'bg-cyan-300' : 'bg-cyan-500')
          : index % 6 === 3
          ? (isDarkMode ? 'bg-pink-300' : 'bg-pink-500')
          : index % 6 === 4
          ? (isDarkMode ? 'bg-indigo-300' : 'bg-indigo-500')
          : (isDarkMode ? 'bg-teal-300' : 'bg-teal-500');
        
        return (
          <div
            key={index}
            ref={el => particlesRef.current[index] = el}
            className={`absolute w-2 h-2 rounded-full ${colorClass}`}
            style={{
              boxShadow: `0 0 8px currentColor, 0 0 16px currentColor, 0 0 24px currentColor`,
              filter: 'brightness(1.4) saturate(1.2)'
            }}
          />
        );
      })}
      
      {/* Plasma energy rings */}
      {Array.from({ length: 6 }, (_, index) => (
        <div 
          key={`ring-${index}`}
          ref={el => ringsRef.current[index] = el}
          className={`absolute border rounded-full ${
            index % 3 === 0 
              ? (isDarkMode ? 'border-blue-400/40' : 'border-blue-500/50')
              : index % 3 === 1
              ? (isDarkMode ? 'border-purple-400/40' : 'border-purple-500/50')
              : (isDarkMode ? 'border-cyan-400/40' : 'border-cyan-500/50')
          }`}
          style={{ 
            width: size * (2 + index * 0.4), 
            height: size * (2 + index * 0.4),
            borderStyle: index % 2 === 0 ? 'solid' : 'dashed',
            borderWidth: index % 3 === 0 ? '2px' : '1px'
          }}
        />
      ))}
      
      {/* Orbiting code symbols */}
      {codeSymbols.map((symbol, index) => (
        <div
          key={`orbit-${index}`}
          ref={el => orbitingElementsRef.current[index] = el}
          className={`absolute text-sm font-bold ${
            isDarkMode ? 'text-blue-300' : 'text-blue-600'
          }`}
          style={{
            left: '50%',
            top: `${size * (1.2 + index * 0.2)}px`,
            transform: 'translateX(-50%)',
            textShadow: '0 0 10px currentColor'
          }}
        >
          {symbol}
        </div>
      ))}
      
      {/* Ambient quantum field */}
      <div 
        className={`absolute rounded-full opacity-10 ${
          isDarkMode ? 'bg-gradient-radial from-blue-400 via-purple-400 to-transparent' : 'bg-gradient-radial from-blue-500 via-purple-500 to-transparent'
        }`}
        style={{ 
          width: size * 4, 
          height: size * 4,
          filter: 'blur(30px)',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.15) 50%, transparent 100%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 100%)'
        }}
      />
    </div>
  );
};

export default MegaParticleBallLoader;

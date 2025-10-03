import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Coffee, Music } from 'lucide-react';
import grandmaIdleImage from 'figma:asset/6c1cd635abe9663455c79ffda89de0ed099ca521.png';
import grandmaCheesecakeImage from 'figma:asset/caafb2a517ec7c01684578f6eb71548493ceee82.png';
import grandmaDancingImage from 'figma:asset/6d8d890cb2aa0cd204d44888fce4a88371fed04f.png';

interface GrandmaJuanerProps {
  message: string | null;
  showCelebration?: boolean;
}

const GRANDMA_STATES = {
  idle: grandmaIdleImage,
  cheesecake: grandmaCheesecakeImage,
  dancing: grandmaDancingImage,
  flowers: grandmaIdleImage, // Use idle image for flowers state
  workout: grandmaIdleImage, // Use idle image for workout state
  food: grandmaIdleImage // Use idle image for food state
};

const IDLE_MESSAGES = [
  "Take your time, child. The stars will wait for you. ✨",
  "Remember, even small steps light up the universe! 🌟",
  "I'm here whenever you need encouragement, dear. 💖",
  "Every planet in your universe is special, just like you! 🪐",
  "Don't forget to take breaks - I'm having some tea! ☕",
];

const CLICKABLE_MESSAGES = [
  "Hello, dear! I'm so proud of your cosmic journey! 🌟",
  "You know, my daughters think I only square dance, but I'm actually exploring the universe with you! 🤫",
  "Would you like some cheesecake? It gives me energy for celebrating your achievements! 🍰",
  "I may be old, but I understand that sometimes we need to take things one star at a time. ✨",
  "Your progress makes this old heart happy! Keep shining, child! 💖",
  "Between you and me, watching you complete planets is better than any TV show! 📺",
];

export function GrandmaJuaner({ message, showCelebration = false }: GrandmaJuanerProps) {
  const [currentState, setCurrentState] = useState<keyof typeof GRANDMA_STATES>('idle');
  const [idleMessage, setIdleMessage] = useState<string | null>(null);
  const [showIdleMessage, setShowIdleMessage] = useState(false);
  const [clickableMessage, setClickableMessage] = useState<string | null>(null);

  const handleGrandmaClick = () => {
    const randomMessage = CLICKABLE_MESSAGES[Math.floor(Math.random() * CLICKABLE_MESSAGES.length)];
    setClickableMessage(randomMessage);
    setTimeout(() => setClickableMessage(null), 4000);
  };

  // Random idle activities
  useEffect(() => {
    const activityInterval = setInterval(() => {
      if (!message) {
        const activities: (keyof typeof GRANDMA_STATES)[] = ['cheesecake', 'dancing', 'flowers', 'workout', 'food'];
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        setCurrentState(randomActivity);
        
        setTimeout(() => {
          setCurrentState('idle');
        }, 3000);
      }
    }, 15000);

    return () => clearInterval(activityInterval);
  }, [message]);

  // Random idle messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      if (!message && !showIdleMessage) {
        const randomMessage = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
        setIdleMessage(randomMessage);
        setShowIdleMessage(true);
        
        setTimeout(() => {
          setShowIdleMessage(false);
          setIdleMessage(null);
        }, 4000);
      }
    }, 25000);

    return () => clearInterval(messageInterval);
  }, [message, showIdleMessage]);

  const getActivityMessage = (state: keyof typeof GRANDMA_STATES) => {
    switch (state) {
      case 'cheesecake':
        return "Shhh... don't tell my daughters I'm having cheesecake! 🤫";
      case 'dancing':
        return "Square dancing keeps me young at heart! 💃";
      case 'flowers':
        return "Tending to my little garden... just like your progress! 🌻";
      case 'workout':
        return "A little exercise never hurt anyone, dear! 💪";
      case 'food':
        return "ShaXian snacks are my guilty pleasure! 🥟";
      default:
        return null;
    }
  };

  const displayMessage = message || clickableMessage || (showIdleMessage ? idleMessage : null);
  const activityMessage = !message && !clickableMessage && currentState !== 'idle' ? getActivityMessage(currentState) : null;

  return (
    <div className="fixed bottom-8 left-8 z-[100]">
      {/* Grandma character */}
      <motion.div
        className="relative mb-4 cursor-pointer"
        animate={{
          y: currentState === 'dancing' || showCelebration ? [0, -10, 0] : 0,
          rotate: currentState === 'workout' ? [0, 5, -5, 0] : 0,
          scale: showCelebration ? [1, 1.2, 1] : 1,
        }}
        transition={{
          y: { duration: 0.8, repeat: (currentState === 'dancing' || showCelebration) ? Infinity : 0 },
          rotate: { duration: 0.6, repeat: currentState === 'workout' ? Infinity : 0 },
          scale: { duration: 1, repeat: showCelebration ? Infinity : 0 },
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGrandmaClick}
      >
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center shadow-lg border-4 border-white/20 overflow-hidden ${showCelebration ? 'shadow-yellow-400/50' : ''}`}>
          <img 
            src={GRANDMA_STATES[currentState]}
            alt="Grandma Juan-er"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Activity indicators */}
        {currentState === 'cheesecake' && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Heart className="h-4 w-4 text-pink-400 fill-current" />
          </motion.div>
        )}
        
        {currentState === 'dancing' && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            <Music className="h-4 w-4 text-purple-400 fill-current" />
          </motion.div>
        )}
        
        {currentState === 'food' && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            <Coffee className="h-4 w-4 text-amber-400 fill-current" />
          </motion.div>
        )}
      </motion.div>

      {/* Messages */}
      <AnimatePresence>
        {(displayMessage || activityMessage) && (
          <motion.div
            className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-white/20 max-w-xs"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            <div className="text-sm text-slate-800 leading-relaxed">
              {displayMessage || activityMessage}
            </div>
            
            {/* Speech bubble tail */}
            <div className="absolute bottom-0 left-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white/95"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts when cheesecake */}
      {currentState === 'cheesecake' && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-400"
              style={{
                left: `${Math.random() * 60}px`,
                top: `${Math.random() * 60}px`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              💖
            </motion.div>
          ))}
        </>
      )}

      {/* Celebration fireworks */}
      {showCelebration && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`celebration-${i}`}
              className="absolute text-yellow-400 text-2xl"
              style={{
                left: `${Math.random() * 100}px`,
                top: `${Math.random() * 100}px`,
              }}
              animate={{
                y: [0, -60, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0, 1, 0],
                rotate: [0, 360],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {['🎉', '✨', '🌟', '🎊'][i % 4]}
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}
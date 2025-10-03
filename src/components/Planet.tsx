import React from 'react';
import { motion } from 'motion/react';
import { Task } from './Universe';

interface PlanetProps {
  task: Task;
  onClick: () => void;
}

export function Planet({ task, onClick }: PlanetProps) {
  const { planet, completed, steps, importance } = task;
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = steps.length > 0 ? completedSteps / steps.length : 0;

  // Kawaii expressions based on completion state
  const getExpression = () => {
    if (completed) return { eyes: '◕', mouth: '‿' }; // Happy completed
    if (progress > 0.5) return { eyes: '•', mouth: '◡' }; // Content in progress
    return { eyes: '•', mouth: '﹏' }; // Neutral/sleepy for new tasks
  };

  const expression = getExpression();

  // Different shapes based on importance
  const getShapeStyles = () => {
    switch (importance) {
      case 'small': // Cloud shape
        return {
          container: 'relative',
          main: `
            bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-200 dark:to-blue-300
            rounded-full relative
            ${completed ? 'shadow-lg shadow-blue-200/60' : 'shadow-md shadow-blue-100/40'}
          `,
          decorations: (
            <>
              {/* Cloud bumps */}
              <div className="absolute -top-2 left-1/4 w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-200 dark:to-blue-300 rounded-full" />
              <div className="absolute -top-1 right-1/4 w-4 h-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-200 dark:to-blue-300 rounded-full" />
              <div className="absolute -left-2 top-1/3 w-5 h-5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-200 dark:to-blue-300 rounded-full" />
              <div className="absolute -right-2 top-1/2 w-4 h-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-200 dark:to-blue-300 rounded-full" />
            </>
          )
        };
      
      case 'medium': // Simple planet
        return {
          container: 'relative',
          main: `
            bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-300 dark:to-purple-400
            rounded-full relative
            ${completed ? 'shadow-lg shadow-purple-200/60' : 'shadow-md shadow-purple-100/40'}
          `,
          decorations: (
            <>
              {/* Cute spots on the planet */}
              <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-purple-300/50 dark:bg-purple-400/50" />
              <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-purple-300/50 dark:bg-purple-400/50" />
            </>
          )
        };
      
      case 'large': // Planet with ring
        return {
          container: 'relative',
          main: `
            bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-300 dark:to-pink-400
            rounded-full relative
            ${completed ? 'shadow-lg shadow-pink-200/60' : 'shadow-md shadow-pink-100/40'}
          `,
          decorations: (
            <>
              {/* Ring around the planet */}
              <div className="absolute inset-0 rounded-full border-4 border-yellow-200/60 dark:border-yellow-300/60 transform rotate-12" 
                   style={{ 
                     width: `${planet.size * 1.3}px`, 
                     height: `${planet.size * 0.3}px`,
                     left: `${-planet.size * 0.15}px`,
                     top: `${planet.size * 0.35}px`,
                     borderRadius: '50%',
                   }} />
              {/* Planet spots */}
              <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-pink-300/50 dark:bg-pink-400/50" />
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-pink-300/50 dark:bg-pink-400/50" />
            </>
          )
        };
      
      default:
        return {
          container: 'relative',
          main: `bg-gradient-to-br ${planet.color} rounded-full relative shadow-md`,
          decorations: null
        };
    }
  };

  const shapeStyles = getShapeStyles();

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${planet.position.x}%`,
        top: `${planet.position.y}%`,
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: completed ? [0, -5, 0] : [0, -2, 0],
        rotate: completed && importance !== 'small' ? [0, 5, -5, 0] : 0,
      }}
      transition={{
        y: {
          duration: completed ? 2 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: completed ? {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        } : {},
      }}
      onClick={onClick}
    >
      {/* Kawaii Planet/Cloud Body */}
      <div className={shapeStyles.container}>
        <div
          className={shapeStyles.main}
          style={{
            width: `${planet.size}px`,
            height: `${planet.size}px`,
          }}
        >
          {/* Glow effect for completed planets */}
          {completed && (
            <div
              className={`absolute inset-0 rounded-full blur-xl opacity-40 -z-10 ${
                importance === 'small' ? 'bg-blue-200' :
                importance === 'medium' ? 'bg-purple-200' : 'bg-pink-200'
              }`}
              style={{
                width: `${planet.size * 1.3}px`,
                height: `${planet.size * 1.3}px`,
                left: `-${planet.size * 0.15}px`,
                top: `-${planet.size * 0.15}px`,
              }}
            />
          )}
          
          {/* Progress indicator - kawaii style */}
          {!completed && progress > 0 && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, rgba(255,182,193,0.8) ${progress * 360}deg, transparent ${progress * 360}deg)`,
                mask: 'radial-gradient(circle, transparent 65%, black 70%)',
              }}
            />
          )}

          {/* Kawaii Face */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {/* Eyes */}
              <div className="flex justify-center gap-1 mb-1">
                <span className="text-gray-600 dark:text-gray-700" style={{ fontSize: `${Math.max(planet.size * 0.15, 8)}px` }}>
                  {expression.eyes}
                </span>
                <span className="text-gray-600 dark:text-gray-700" style={{ fontSize: `${Math.max(planet.size * 0.15, 8)}px` }}>
                  {expression.eyes}
                </span>
              </div>
              {/* Mouth */}
              <div className="flex justify-center">
                <span className="text-gray-600 dark:text-gray-700" style={{ fontSize: `${Math.max(planet.size * 0.12, 6)}px` }}>
                  {expression.mouth}
                </span>
              </div>
            </div>
          </div>

          {/* Shape-specific decorations */}
          {shapeStyles.decorations}
        </div>
      </div>

      {/* Planet label - 日系风格 */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-amber-800 dark:text-amber-200 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg border border-orange-200/50 dark:border-amber-700/50 whitespace-nowrap">
          {task.title}
        </div>
        {steps.length > 0 && (
          <div className="text-amber-600/80 dark:text-amber-300/80 text-xs mt-1">
            {completedSteps}/{steps.length} {
              importance === 'small' ? '💧' :
              importance === 'medium' ? '⭐' : '✨'
            }
          </div>
        )}
      </div>

      {/* Floating kawaii particles for completed planets */}
      {completed && (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm"
              style={{
                left: `${Math.random() * (planet.size * 1.5)}px`,
                top: `${Math.random() * (planet.size * 1.5)}px`,
              }}
              animate={{
                y: [0, -25, 0],
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            >
              {importance === 'small' ? 
                ['💧', '☁️', '🌈', '💙'][i] : 
                importance === 'medium' ? 
                ['✨', '🌟', '💜', '🌸'][i] : 
                ['💖', '🌺', '✨', '🌙'][i]
              }
            </motion.div>
          ))}
        </>
      )}

      {/* Cute decorative elements around the planet */}
      {!completed && progress === 0 && (
        <>
          {importance === 'large' && (
            <motion.div
              className="absolute text-xs opacity-60"
              style={{
                left: `${planet.size + 10}px`,
                top: `${planet.size * 0.2}px`,
              }}
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ⭐
            </motion.div>
          )}
          {importance === 'small' && (
            <motion.div
              className="absolute text-xs opacity-60"
              style={{
                left: `${-15}px`,
                top: `${planet.size * 0.3}px`,
              }}
              animate={{
                y: [0, -3, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              💧
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Task } from './Universe';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onStepComplete: (taskId: string, stepId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskDetail({ task, onClose, onStepComplete, onEdit, onDelete }: TaskDetailProps) {
  const completedSteps = task.steps.filter(step => step.completed).length;
  const progress = task.steps.length > 0 ? completedSteps / task.steps.length : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-orange-200/50 dark:border-amber-700/50 overflow-hidden shadow-2xl">
            {/* Header with planet preview - 日系风格 */}
            <div className="relative p-6 border-b border-orange-200/30 dark:border-amber-700/30 bg-gradient-to-r from-pink-50/50 to-orange-50/50 dark:from-slate-700/50 dark:to-amber-900/50">
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-600 dark:text-amber-300 hover:bg-orange-100/50 dark:hover:bg-amber-800/30 rounded-full"
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-rose-400 dark:text-rose-300 hover:bg-rose-100/50 dark:hover:bg-rose-800/30 rounded-full"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-amber-600 dark:text-amber-300 hover:bg-orange-100/50 dark:hover:bg-amber-800/30 rounded-full"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Mini planet */}
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${task.planet.color} shadow-lg`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-1 rounded-full bg-white/10" />
                </motion.div>
                
                <div>
                  <h2 className="text-amber-800 dark:text-amber-200 mb-2">{task.title}</h2>
                  <div className="text-amber-600/80 dark:text-amber-300/80">
                    {completedSteps} of {task.steps.length} stars completed ⭐
                  </div>
                </div>
              </div>
            </div>

            {/* Orbiting stars visualization - 日系风格 */}
            <div className="relative h-64 bg-gradient-to-b from-pink-50/30 to-orange-50/30 dark:from-slate-800/30 dark:to-amber-900/30 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central kawaii planet (larger) */}
                <motion.div
                  className={`w-24 h-24 rounded-full ${
                    task.importance === 'small' ? 'bg-gradient-to-br from-blue-200 to-blue-300' :
                    task.importance === 'medium' ? 'bg-gradient-to-br from-purple-200 to-purple-300' :
                    'bg-gradient-to-br from-pink-200 to-pink-300'
                  } shadow-xl flex items-center justify-center`}
                  animate={{ 
                    rotate: task.importance !== 'small' ? 360 : 0,
                    y: [0, -3, 0]
                  }}
                  transition={{ 
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                    y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  {/* Kawaii face */}
                  <div className="text-center">
                    <div className="flex justify-center gap-1 mb-1">
                      <span className="text-gray-600 dark:text-gray-700 text-lg">•</span>
                      <span className="text-gray-600 dark:text-gray-700 text-lg">•</span>
                    </div>
                    <div className="flex justify-center">
                      <span className="text-gray-600 dark:text-gray-700">◡</span>
                    </div>
                  </div>
                  
                  {/* Shape-specific decorations */}
                  {task.importance === 'small' && (
                    <>
                      <div className="absolute -top-2 left-1/4 w-6 h-6 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full" />
                      <div className="absolute -top-1 right-1/4 w-4 h-4 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full" />
                      <div className="absolute -left-2 top-1/3 w-5 h-5 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full" />
                    </>
                  )}
                  {task.importance === 'large' && (
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-200/60 transform rotate-12" 
                         style={{ 
                           width: '120px', 
                           height: '30px',
                           left: '-12px',
                           top: '33px',
                           borderRadius: '50%',
                         }} />
                  )}
                </motion.div>

                {/* Orbiting stars */}
                {task.steps.map((step, index) => {
                  const angle = (index / task.steps.length) * 360;
                  const radius = 80;
                  
                  return (
                    <motion.div
                      key={step.id}
                      className="absolute"
                      style={{
                        width: '32px',
                        height: '32px',
                      }}
                      animate={{
                        rotate: 360,
                        x: Math.cos((angle * Math.PI) / 180) * radius,
                        y: Math.sin((angle * Math.PI) / 180) * radius,
                      }}
                      transition={{
                        rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                        x: { duration: 0 },
                        y: { duration: 0 },
                      }}
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                          ${step.completed 
                            ? 'bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-300 dark:to-yellow-400 shadow-lg shadow-yellow-300/50' 
                            : 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-200 dark:to-blue-300 border-2 border-blue-200/70 dark:border-blue-300/70 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-300 dark:hover:to-blue-400'
                          }`}
                        whileHover={{ scale: 1.3, y: -3 }}
                        whileTap={{ scale: 0.9 }}
                        animate={step.completed ? {
                          boxShadow: [
                            '0 0 20px rgba(255, 235, 59, 0.3)',
                            '0 0 30px rgba(255, 235, 59, 0.5)',
                            '0 0 20px rgba(255, 235, 59, 0.3)',
                          ],
                          y: [0, -3, 0]
                        } : {
                          y: [0, -1, 0]
                        }}
                        transition={{ 
                          boxShadow: { duration: 2, repeat: Infinity },
                          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        onClick={() => !step.completed && onStepComplete(task.id, step.id)}
                      >
                        {/* Kawaii star face */}
                        <div className="text-center">
                          {step.completed ? (
                            <div className="flex flex-col items-center">
                              <div className="flex gap-px">
                                <span className="text-amber-700 text-xs">◕</span>
                                <span className="text-amber-700 text-xs">◕</span>
                              </div>
                              <span className="text-amber-700 text-xs">‿</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="flex gap-px">
                                <span className="text-blue-600 dark:text-blue-700 text-xs">•</span>
                                <span className="text-blue-600 dark:text-blue-700 text-xs">•</span>
                              </div>
                              <span className="text-blue-600 dark:text-blue-700 text-xs">‿</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Steps list - 日系风格 */}
            <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
              {task.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300
                    ${step.completed 
                      ? 'bg-gradient-to-r from-green-100/80 to-emerald-100/80 dark:from-green-800/30 dark:to-emerald-800/30 border border-green-300/50 dark:border-green-600/50 shadow-md' 
                      : 'bg-white/60 dark:bg-slate-700/50 border border-orange-200/50 dark:border-amber-600/30 hover:bg-orange-50/60 dark:hover:bg-amber-800/30 hover:shadow-md'
                    }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-auto rounded-full ${step.completed ? 'text-green-600 dark:text-green-400' : 'text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300'}`}
                    onClick={() => !step.completed && onStepComplete(task.id, step.id)}
                    disabled={step.completed}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5 fill-current" />
                    ) : (
                      <Star className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <span className={`flex-1 ${step.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-amber-800 dark:text-amber-200'}`}>
                    {step.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress bar - 日系风格 */}
            <div className="p-6 pt-0">
              <div className="bg-orange-100/50 dark:bg-amber-800/30 rounded-full h-3 overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-300 to-orange-300 dark:from-pink-400 dark:to-orange-400 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="text-center text-amber-600 dark:text-amber-300 mt-3">
                <span className="bg-white/80 dark:bg-slate-700/80 px-3 py-1 rounded-full shadow-sm border border-orange-200/50 dark:border-amber-600/50">
                  ✨ {Math.round(progress * 100)}% complete ✨
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
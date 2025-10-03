import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Planet } from './Planet';
import { TaskDetail } from './TaskDetail';
import { GrandmaGrace } from './GrandmaGrace';
import { CreateTaskDialog, ImportanceLevel } from './CreateTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { Button } from './ui/button';

export interface Task {
  id: string;
  title: string;
  importance: ImportanceLevel;
  planet: {
    color: string;
    size: number;
    texture: string;
    position: { x: number; y: number };
  };
  steps: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  completed: boolean;
}

const generateStars = (count: number = 60) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
    animationDelay: Math.random() * 3,
  }));
};

// Kawaii planet colors - these are now handled in Planet component based on importance
const PLANET_COLORS = [
  'from-pink-200 to-rose-300', // 温柔粉色
  'from-blue-200 to-sky-300',  // 天空蓝
  'from-green-200 to-emerald-300', // 薄荷绿
  'from-orange-200 to-amber-300', // 温暖橙色
  'from-yellow-200 to-lime-300', // 柔和黄色
  'from-purple-200 to-violet-300', // 淡紫色
  'from-teal-200 to-cyan-300', // 青色
  'from-red-200 to-pink-300', // 温柔红色
];

const PLANET_TEXTURES = ['smooth', 'rocky', 'cloudy', 'ringed', 'gaseous'];

const IMPORTANCE_SIZES = {
  small: 70,   // Small planets
  medium: 100, // Medium planets
  large: 130,  // Large planets
};

const generatePlanetData = (importance: ImportanceLevel) => ({
  color: PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)],
  size: IMPORTANCE_SIZES[importance] + (Math.random() * 20 - 10), // Add some variation
  texture: PLANET_TEXTURES[Math.floor(Math.random() * PLANET_TEXTURES.length)],
  position: {
    x: Math.random() * 70 + 15, // 15-85% from left
    y: Math.random() * 60 + 20, // 20-80% from top
  },
});

const breakdownTask = (title: string) => {
  // AI-style task breakdown (mocked for now)
  const commonBreakdowns: Record<string, string[]> = {
    'write essay': [
      'Create outline and main points',
      'Research and gather sources', 
      'Write introduction paragraph',
      'Draft body paragraphs',
      'Write conclusion and review'
    ],
    'clean room': [
      'Pick up clothes and put in hamper',
      'Make the bed neatly',
      'Organize desk and surfaces',
      'Vacuum or sweep floor',
      'Put away remaining items'
    ],
    'workout': [
      'Put on workout clothes',
      'Do 5-minute warm-up',
      'Complete main exercise routine',
      'Cool down and stretch',
      'Drink water and rest'
    ]
  };

  const defaultSteps = [
    'Break down the task into smaller parts',
    'Gather needed materials or resources',
    'Start with the easiest part first',
    'Take breaks when needed',
    'Review and finish up'
  ];

  const steps = commonBreakdowns[title.toLowerCase()] || defaultSteps;
  
  return steps.map((step, index) => ({
    id: `step-${index}`,
    text: step,
    completed: false,
  }));
};

export function Universe() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [stars] = useState(generateStars());
  const [grandmaMessage, setGrandmaMessage] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleCreateTask = (title: string, importance: ImportanceLevel, aiSteps?: string[]) => {
    // Use AI steps if provided, otherwise fall back to default breakdown
    const steps = aiSteps ? aiSteps.map((step, index) => ({
      id: `step-${Date.now()}-${index}`,
      text: step,
      completed: false
    })) : breakdownTask(title);

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      importance,
      planet: generatePlanetData(importance),
      steps,
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setShowCreateDialog(false);
    
    const message = aiSteps 
      ? "A beautiful new planet with AI-guided steps has bloomed in your garden, dear! ✨🤖"
      : "A beautiful new planet has bloomed in your garden, dear! ✨";
    setGrandmaMessage(message);
    setTimeout(() => setGrandmaMessage(null), 4000);
  };

  const handleEditTask = (taskId: string, newTitle: string, newSteps: string[]) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id === taskId) {
          const updatedSteps = newSteps.map((stepText, index) => ({
            id: `step-${index}`,
            text: stepText,
            completed: false, // Reset completion when editing
          }));
          
          return {
            ...task,
            title: newTitle,
            steps: updatedSteps,
            completed: false, // Reset completion when editing
          };
        }
        return task;
      });
      return updatedTasks;
    });
    
    // Update selectedTask if it's the task being edited
    if (selectedTask && selectedTask.id === taskId) {
      const updatedTask = tasks.find(task => task.id === taskId);
      if (updatedTask) {
        const updatedSteps = newSteps.map((stepText, index) => ({
          id: `step-${index}`,
          text: stepText,
          completed: false,
        }));
        
        setSelectedTask({
          ...updatedTask,
          title: newTitle,
          steps: updatedSteps,
          completed: false,
        });
      }
    }
    
    setEditingTask(null);
    setGrandmaMessage("Your beautiful planet has been refreshed, sweetheart! ✨");
    setTimeout(() => setGrandmaMessage(null), 3000);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setSelectedTask(null);
    setGrandmaMessage("The planet has gently returned to stardust. Sometimes letting go is beautiful, dear. 🌟");
    setTimeout(() => setGrandmaMessage(null), 3000);
  };

  const handleStepComplete = (taskId: string, stepId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSteps = task.steps.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        );
        const allCompleted = updatedSteps.every(step => step.completed);
        
        if (allCompleted && !task.completed) {
          setShowCelebration(true);
    setGrandmaMessage("Oh my stars! You've completed an entire planet! The whole garden sparkles with your achievement! 🎉✨🌟");
          setTimeout(() => {
            setShowCelebration(false);
            setGrandmaMessage(null);
          }, 6000);
        } else {
          const encouragements = [
            "One more star shines bright! ✨",
            "Child, you're doing just fine, one star at a time.",
            "Beautiful work! Keep going! 🌟",
            "The stars are proud of you! ⭐"
          ];
          setGrandmaMessage(encouragements[Math.floor(Math.random() * encouragements.length)]);
          setTimeout(() => setGrandmaMessage(null), 3000);
        }
        
        const updatedTask = {
          ...task,
          steps: updatedSteps,
          completed: allCompleted,
        };
        
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    // Update selectedTask if it's the task being modified
    if (selectedTask && selectedTask.id === taskId) {
      const updatedSelectedTask = updatedTasks.find(task => task.id === taskId);
      if (updatedSelectedTask) {
        setSelectedTask(updatedSelectedTask);
      }
    }
  };

  const handlePlanetClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-pink-50 via-orange-50 to-yellow-50 dark:from-slate-800 dark:via-amber-900 dark:to-orange-900">
      {/* Animated starfield background - 更温暖的星星 */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-200 dark:to-amber-200"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity * 0.6,
          }}
          animate={{
            opacity: [star.opacity * 0.6, star.opacity * 0.2, star.opacity * 0.6],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: star.animationDelay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Planets */}
      {tasks.map((task) => (
        <Planet
          key={task.id}
          task={task}
          onClick={() => handlePlanetClick(task)}
        />
      ))}

      {/* Universe header - Japanese healing style */}
      <div className="absolute top-8 left-8 z-30">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg border border-orange-200/50 dark:border-amber-700/50">
          <h1 className="font-medium text-amber-800 dark:text-amber-200">✨ Grandma Grace's Cosmic Garden ✨</h1>
          <p className="text-amber-600/70 dark:text-amber-300/70">Your gentle productivity universe • {tasks.length} beautiful planets</p>
        </div>
      </div>

      {/* Create new planet button - 日系风格 */}
      <motion.div
        className="absolute bottom-8 right-8"
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setShowCreateDialog(true)}
          size="lg"
          disabled={false}
          className="rounded-full h-16 w-16 bg-gradient-to-r from-pink-300 to-orange-300 hover:from-pink-400 hover:to-orange-400 dark:from-pink-400 dark:to-orange-400 dark:hover:from-pink-500 dark:hover:to-orange-500 shadow-xl shadow-pink-200/40 dark:shadow-orange-800/40 border-2 border-white/50 dark:border-orange-200/30 text-white"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </motion.div>

      {/* Grandma Grace */}
      <GrandmaGrace 
        message={grandmaMessage} 
        showCelebration={showCelebration}
      />

      {/* Task detail view */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={handleCloseTaskDetail}
          onStepComplete={handleStepComplete}
          onEdit={() => setEditingTask(selectedTask)}
          onDelete={() => handleDeleteTask(selectedTask.id)}
        />
      )}

      {/* Create task dialog */}
      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateTask={handleCreateTask}
      />

      {/* Edit task dialog */}
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          onEditTask={handleEditTask}
        />
      )}
    </div>
  );
}
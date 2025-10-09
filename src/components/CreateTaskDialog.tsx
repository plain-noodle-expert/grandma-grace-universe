import { useState, FormEvent } from 'react';
import { Sparkles, Wand2, Circle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { AIServiceVercel } from '../services/aiService-vercel';

export type ImportanceLevel = 'small' | 'medium' | 'large';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (title: string, importance: ImportanceLevel, steps?: string[]) => void;
}

const TASK_SUGGESTIONS = [
  "Write essay",
  "Organize room", 
  "Exercise routine",
  "Learn new skill",
  "Sort photos",
  "Call a friend",
  "Read a book",
  "Cook healthy meal",
  "Plan weekend trip",
  "Update resume"
];

export function CreateTaskDialog({ open, onOpenChange, onCreateTask }: CreateTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [importance, setImportance] = useState<ImportanceLevel>('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setIsGenerating(true);
    try {
      // Call Vercel serverless function for secure AI breakdown
      const suggestion = await AIServiceVercel.generateTaskBreakdown(taskTitle.trim(), importance);
      if (suggestion?.steps?.length) {
        onCreateTask(taskTitle.trim(), importance, suggestion.steps);
      } else {
        onCreateTask(taskTitle.trim(), importance);
      }
    } catch (error) {
      console.warn('AI breakdown failed, falling back to local:', error);
      onCreateTask(taskTitle.trim(), importance);
    } finally {
      setTaskTitle('');
      setImportance('medium');
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTaskTitle(suggestion);
  };

  const generateRandomSuggestion = () => {
    const randomSuggestion = TASK_SUGGESTIONS[Math.floor(Math.random() * TASK_SUGGESTIONS.length)];
    setTaskTitle(randomSuggestion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-orange-200/50 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-400 dark:text-orange-400" />
            Plant a New Star
          </DialogTitle>
          <DialogDescription className="text-amber-600/80 dark:text-amber-300/80">
            Tell me what you'd like to accomplish, and I'll help you create a beautiful planet with gentle, manageable steps!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">What would you like to work on?</Label>
            <Input
              id="task-title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g., Write essay, Organize room, Learn guitar..."
              className="bg-orange-50/50 dark:bg-amber-800/30 border-orange-200/50 dark:border-amber-600/50 text-amber-800 dark:text-amber-200 placeholder:text-amber-500/60 dark:placeholder:text-amber-400/60 rounded-xl"
              autoFocus
            />
          </div>

          {/* Importance Level Selection */}
          <div className="space-y-1">
            <Label>How important is this to you?</Label>
            <div className="flex gap-3">
              {(
                [
                  { value: 'small', label: 'Small Planet', description: 'Quick tasks'},
                  { value: 'medium', label: 'Medium Planet', description: 'Daily tasks'},
                  { value: 'large', label: 'Large Planet', description: 'Important goals'},
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setImportance(option.value)}
                  className={`
                    flex-1 p-3 rounded-2xl border-2 text-left transition-all duration-200
                    ${importance === option.value 
                      ? 'border-pink-300 dark:border-orange-400 bg-pink-100/50 dark:bg-orange-400/20 shadow-md' 
                      : 'border-orange-200/50 dark:border-amber-600/50 bg-white/30 dark:bg-amber-800/20 hover:border-pink-200 dark:hover:border-orange-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Circle 
                      className={`
                        ${option.value === 'small' ? 'h-3 w-3' : option.value === 'medium' ? 'h-4 w-4' : 'h-5 w-5'}
                        ${importance === option.value ? 'text-pink-400 dark:text-orange-400' : 'text-amber-400 dark:text-amber-500'}
                      `}
                      fill="currentColor"
                    />
                    <span className={`${importance === option.value ? 'text-amber-800 dark:text-amber-200' : 'text-amber-600 dark:text-amber-300'}`}>
                      {option.label}
                    </span>
                  </div>
                  <div className={`text-xs ${importance === option.value ? 'text-pink-600 dark:text-orange-300' : 'text-amber-500 dark:text-amber-400'}`}>
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Random suggestion button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateRandomSuggestion}
            className="text-amber-600 dark:text-amber-300 border-orange-200 dark:border-amber-600 hover:bg-orange-100/50 dark:hover:bg-amber-700/50 hover:text-amber-700 dark:hover:text-amber-200 rounded-xl"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Give me an idea
          </Button>

          {/* Quick suggestions */}
          <div className="space-y-2">
            <Label className="text-amber-600/80 dark:text-amber-400/80">Quick suggestions:</Label>
            <div className="flex flex-wrap gap-2">
              {TASK_SUGGESTIONS.slice(0, 6).map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200 hover:bg-orange-100/50 dark:hover:bg-amber-700/30 border border-orange-200/50 dark:border-amber-600/50 rounded-xl"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200 hover:bg-orange-100/50 dark:hover:bg-amber-700/30 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!taskTitle.trim() || isGenerating}
              className="bg-gradient-to-r from-pink-300 to-orange-300 dark:from-pink-400 dark:to-orange-400 hover:from-pink-400 hover:to-orange-400 dark:hover:from-pink-500 dark:hover:to-orange-500 text-white rounded-xl shadow-lg"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Planet...
                </div>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Plant Star
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
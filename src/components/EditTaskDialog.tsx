import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
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
import { Task } from './Universe';

interface EditTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditTask: (taskId: string, newTitle: string, newSteps: string[]) => void;
}

export function EditTaskDialog({ task, open, onOpenChange, onEditTask }: EditTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [steps, setSteps] = useState<string[]>(task.steps.map(step => step.text));

  useEffect(() => {
    setTaskTitle(task.title);
    setSteps(task.steps.map(step => step.text));
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim() && steps.every(step => step.trim())) {
      onEditTask(task.id, taskTitle.trim(), steps.filter(step => step.trim()));
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-orange-200/50 dark:border-amber-700/50 text-amber-800 dark:text-amber-200 max-h-[80vh] overflow-y-auto shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-pink-400 dark:text-orange-400" />
            Tend to Your Planet
          </DialogTitle>
          <DialogDescription className="text-amber-600/80 dark:text-amber-300/80">
            Nurture your planet's purpose and adjust the steps to help it flourish.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-task-title">Planet's Purpose</Label>
            <Input
              id="edit-task-title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="What is this planet's gentle purpose?"
              className="bg-orange-50/50 dark:bg-amber-800/30 border-orange-200/50 dark:border-amber-600/50 text-amber-800 dark:text-amber-200 placeholder:text-amber-500/60 dark:placeholder:text-amber-400/60 rounded-xl"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Gentle Steps to Bloom</Label>
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  placeholder={`Step ${index + 1}...`}
                  className="bg-orange-50/50 dark:bg-amber-800/30 border-orange-200/50 dark:border-amber-600/50 text-amber-800 dark:text-amber-200 placeholder:text-amber-500/60 dark:placeholder:text-amber-400/60 rounded-xl"
                />
                {steps.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(index)}
                    className="text-rose-400 dark:text-rose-300 hover:text-rose-500 dark:hover:text-rose-200 hover:bg-rose-100/50 dark:hover:bg-rose-800/30 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {steps.length < 8 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addStep}
                className="text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-200 hover:bg-orange-100/50 dark:hover:bg-amber-700/30 rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Gentle Step
              </Button>
            )}
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
              disabled={!taskTitle.trim() || !steps.every(step => step.trim())}
              className="bg-gradient-to-r from-pink-300 to-orange-300 dark:from-pink-400 dark:to-orange-400 hover:from-pink-400 hover:to-orange-400 dark:hover:from-pink-500 dark:hover:to-orange-500 text-white rounded-xl shadow-lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Nurture Planet
            </Button>
          </div>
        </form>

        {/* Gentle reminder about resetting progress */}
        <div className="bg-orange-100/50 dark:bg-amber-800/20 border border-orange-200/50 dark:border-amber-600/50 rounded-2xl p-4 mt-4">
          <p className="text-amber-700 dark:text-amber-300">
            🌸 Gently editing will refresh all star progress for this planet, giving it a fresh start.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
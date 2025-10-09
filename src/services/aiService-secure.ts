// src/services/aiService-secure.ts
export interface TaskSuggestion {
  steps: string[];
  motivation: string;
  priority: 'high' | 'medium' | 'low';
}

export class AIService {
  private static backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  
  /**
   * Check if backend AI service is available
   */
  static isConfigured(): boolean {
    // 可以通过ping backend来检查
    return true; // 或者实现一个健康检查
  }

  /**
   * Generate task breakdown using secure backend
   */
  static async generateTaskBreakdown(taskTitle: string, importance: string): Promise<TaskSuggestion> {
    try {
      const response = await fetch(`${this.backendURL}/api/generate-task-breakdown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskTitle,
          importance,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Backend AI service error:', error);
      throw error;
    }
  }

  /**
   * Generate task breakdown using Netlify Functions
   */
  static async generateTaskBreakdownNetlify(taskTitle: string, importance: string): Promise<TaskSuggestion> {
    try {
      const response = await fetch('/.netlify/functions/generate-task-breakdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskTitle,
          importance,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Netlify function error:', error);
      throw error;
    }
  }
}
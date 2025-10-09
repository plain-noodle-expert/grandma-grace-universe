export interface TaskSuggestion {
  steps: string[];
  motivation?: string;
  priority?: 'high' | 'medium' | 'low';
}

export class AIServiceVercel {
  private static endpoint = '/api/generate-task-breakdown';

  static isConfigured(): boolean {
    // Frontend always available to call serverless function; assume server handles secret
    return true;
  }

  static async generateTaskBreakdown(taskTitle: string, importance: string): Promise<TaskSuggestion> {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskTitle, importance }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data;
  }
}
